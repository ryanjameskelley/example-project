/**
 * Inspect Runtime — runs inside the preview iframe.
 *
 * Listens for postMessage commands from the gallery host and draws
 * overlays (measure, spacing, component boundaries) on a transparent
 * fixed div.  Sends element data back to the host on hover/click.
 *
 * Origin validation: only accepts messages from *.auui.ai
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BoxModel {
  marginTop: number; marginRight: number; marginBottom: number; marginLeft: number;
  paddingTop: number; paddingRight: number; paddingBottom: number; paddingLeft: number;
  borderTopWidth: number; borderRightWidth: number; borderBottomWidth: number; borderLeftWidth: number;
}

interface ElementData {
  tagName: string;
  id: string;
  className: string;
  rect: { top: number; left: number; width: number; height: number };
  boxModel: BoxModel;
  componentName: string | null;
  computedStyles?: Record<string, Record<string, string>>;
  props?: Record<string, unknown>;
  fiberAvailable?: boolean;
}

interface BoundaryComponent {
  name: string;
  rect: { top: number; left: number; width: number; height: number };
  color: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ORIGIN_RE = /^https?:\/\/([a-z0-9-]+\.)*auui\.ai$/;

function isAllowedOrigin(origin: string): boolean {
  // Allow any *.auui.ai origin AND localhost for development
  return ORIGIN_RE.test(origin) || origin.startsWith('http://localhost') || origin.startsWith('https://localhost');
}

function px(n: number): string { return `${Math.round(n)}px`; }

function parsePixelValue(v: string): number {
  return parseFloat(v) || 0;
}

function hashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 70%, 55%)`;
}

// ---------------------------------------------------------------------------
// React Fiber access
// ---------------------------------------------------------------------------

function getFiber(el: Element): any | null {
  try {
    const key = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
    return key ? (el as any)[key] : null;
  } catch { return null; }
}

function getComponentName(el: Element): string | null {
  try {
    let fiber = getFiber(el);
    // Walk up until we find a function/class component
    while (fiber) {
      if (fiber.type && typeof fiber.type === 'function') {
        return fiber.type.displayName || fiber.type.name || null;
      }
      fiber = fiber.return;
    }
  } catch { /* fiber access failed */ }
  return null;
}

function getFiberProps(el: Element): Record<string, unknown> | null {
  try {
    let fiber = getFiber(el);
    while (fiber) {
      if (fiber.memoizedProps && fiber.type && typeof fiber.type === 'function') {
        return serializeProps(fiber.memoizedProps);
      }
      fiber = fiber.return;
    }
  } catch { /* */ }
  return null;
}

function serializeProps(props: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (k === 'children') {
      if (typeof v === 'string') out[k] = v;
      else if (Array.isArray(v)) out[k] = `[${v.length} children]`;
      else if (v && typeof v === 'object') out[k] = '[Element]';
      else out[k] = v;
    } else if (typeof v === 'function') {
      out[k] = '[Function]';
    } else if (v && typeof v === 'object') {
      try { out[k] = JSON.parse(JSON.stringify(v)); }
      catch { out[k] = '[Object]'; }
    } else {
      out[k] = v;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Computed style extraction
// ---------------------------------------------------------------------------

function extractComputedStyles(el: Element): Record<string, Record<string, string>> {
  const cs = getComputedStyle(el);
  return {
    Typography: {
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
    },
    Layout: {
      display: cs.display,
      position: cs.position,
      flexDirection: cs.flexDirection,
      alignItems: cs.alignItems,
      justifyContent: cs.justifyContent,
      gap: cs.gap,
      overflow: cs.overflow,
    },
    Spacing: {
      marginTop: cs.marginTop, marginRight: cs.marginRight,
      marginBottom: cs.marginBottom, marginLeft: cs.marginLeft,
      paddingTop: cs.paddingTop, paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft,
    },
    Sizing: {
      width: cs.width, height: cs.height,
      minWidth: cs.minWidth, minHeight: cs.minHeight,
      maxWidth: cs.maxWidth, maxHeight: cs.maxHeight,
    },
    Colors: {
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      borderColor: cs.borderColor,
      boxShadow: cs.boxShadow,
    },
    Border: {
      borderWidth: cs.borderWidth,
      borderStyle: cs.borderStyle,
      borderRadius: cs.borderRadius,
    },
  };
}

function getBoxModel(el: Element): BoxModel {
  const cs = getComputedStyle(el);
  return {
    marginTop: parsePixelValue(cs.marginTop),
    marginRight: parsePixelValue(cs.marginRight),
    marginBottom: parsePixelValue(cs.marginBottom),
    marginLeft: parsePixelValue(cs.marginLeft),
    paddingTop: parsePixelValue(cs.paddingTop),
    paddingRight: parsePixelValue(cs.paddingRight),
    paddingBottom: parsePixelValue(cs.paddingBottom),
    paddingLeft: parsePixelValue(cs.paddingLeft),
    borderTopWidth: parsePixelValue(cs.borderTopWidth),
    borderRightWidth: parsePixelValue(cs.borderRightWidth),
    borderBottomWidth: parsePixelValue(cs.borderBottomWidth),
    borderLeftWidth: parsePixelValue(cs.borderLeftWidth),
  };
}

// ---------------------------------------------------------------------------
// Canvas overlay
// ---------------------------------------------------------------------------

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;

function getCanvas(): HTMLCanvasElement {
  if (canvas && document.body.contains(canvas)) return canvas;
  canvas = document.createElement('canvas');
  canvas.id = 'auui-inspect-canvas';
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0',
    pointerEvents: 'none', zIndex: '999999',
    width: '100vw', height: '100vh',
  });
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  resizeCanvas();
  return canvas;
}

function resizeCanvas() {
  const c = getCanvas();
  const dpr = window.devicePixelRatio || 1;
  c.width = window.innerWidth * dpr;
  c.height = window.innerHeight * dpr;
  ctx = c.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function clearCanvas() {
  if (!ctx || !canvas) return;
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Canvas drawing helpers
// ---------------------------------------------------------------------------

function roundRectPath(
  c: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
}

function drawLabel(
  c: CanvasRenderingContext2D,
  text: string, x: number, y: number,
  opts: { textColor: string; bgColor: string; fontSize?: number },
) {
  const size = opts.fontSize ?? 10;
  c.font = `${size}px ui-monospace, monospace`;
  const tm = c.measureText(text);
  const pw = 4; // horizontal padding
  const ph = 2; // vertical padding
  const bw = tm.width + pw * 2;
  const bh = size + ph * 2;

  roundRectPath(c, x, y - bh / 2, bw, bh, 2);
  c.fillStyle = opts.bgColor;
  c.fill();

  c.fillStyle = opts.textColor;
  c.textBaseline = 'middle';
  c.fillText(text, x + pw, y);
}

// ---------------------------------------------------------------------------
// Tool state + unified redraw
// ---------------------------------------------------------------------------

let currentMeasureEl: Element | null = null;
let currentSpacingEl: Element | null = null;
let currentBoundaries: BoundaryComponent[] | null = null;

function redraw() {
  getCanvas(); // ensure canvas exists
  clearCanvas();
  if (!ctx) return;

  if (currentBoundaries) drawBoundaries(currentBoundaries);
  if (currentMeasureEl) drawMeasure(currentMeasureEl);
  if (currentSpacingEl) drawSpacing(currentSpacingEl);
}

// ---------------------------------------------------------------------------
// Measure tool drawing (canvas)
// ---------------------------------------------------------------------------

function drawMeasure(el: Element) {
  if (!ctx) return;
  const c = ctx;
  const rect = el.getBoundingClientRect();

  // Purple dashed outline
  c.save();
  c.setLineDash([4, 3]);
  c.strokeStyle = '#7c3aed';
  c.lineWidth = 1.5;
  roundRectPath(c, rect.left, rect.top, rect.width, rect.height, 2);
  c.stroke();
  c.fillStyle = 'rgba(124, 58, 237, 0.04)';
  c.fill();
  c.restore();

  // Dimension tooltip
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  const dimText = `${w} × ${h}`;
  c.font = '11px ui-monospace, monospace';
  const dimTm = c.measureText(dimText);
  const tipX = rect.right + 6;
  const tipY = rect.top - 24;
  const tipW = dimTm.width + 12;
  const tipH = 18;
  roundRectPath(c, tipX, tipY, tipW, tipH, 3);
  c.fillStyle = '#7c3aed';
  c.fill();
  c.fillStyle = '#fff';
  c.textBaseline = 'middle';
  c.fillText(dimText, tipX + 6, tipY + tipH / 2);

  // Distance lines to parent edges
  const parent = el.parentElement;
  if (!parent) return;
  const pr = parent.getBoundingClientRect();

  c.save();
  c.strokeStyle = '#ef4444';
  c.lineWidth = 1;

  // Top distance
  const topDist = Math.round(rect.top - pr.top);
  if (topDist > 2) {
    const cx_ = rect.left + rect.width / 2;
    c.beginPath(); c.moveTo(cx_, pr.top); c.lineTo(cx_, rect.top); c.stroke();
    drawLabel(c, `${topDist}`, cx_ + 4, pr.top + topDist / 2,
      { textColor: '#ef4444', bgColor: 'rgba(255,255,255,0.85)' });
  }

  // Left distance
  const leftDist = Math.round(rect.left - pr.left);
  if (leftDist > 2) {
    const cy_ = rect.top + rect.height / 2;
    c.beginPath(); c.moveTo(pr.left, cy_); c.lineTo(rect.left, cy_); c.stroke();
    drawLabel(c, `${leftDist}`, pr.left + leftDist / 2 - 10, cy_ + 10,
      { textColor: '#ef4444', bgColor: 'rgba(255,255,255,0.85)' });
  }

  // Bottom distance
  const bottomDist = Math.round(pr.bottom - rect.bottom);
  if (bottomDist > 2) {
    const cx_ = rect.left + rect.width / 2;
    c.beginPath(); c.moveTo(cx_, rect.bottom); c.lineTo(cx_, pr.bottom); c.stroke();
    drawLabel(c, `${bottomDist}`, cx_ + 4, rect.bottom + bottomDist / 2,
      { textColor: '#ef4444', bgColor: 'rgba(255,255,255,0.85)' });
  }

  // Right distance
  const rightDist = Math.round(pr.right - rect.right);
  if (rightDist > 2) {
    const cy_ = rect.top + rect.height / 2;
    c.beginPath(); c.moveTo(rect.right, cy_); c.lineTo(pr.right, cy_); c.stroke();
    drawLabel(c, `${rightDist}`, rect.right + rightDist / 2 - 10, cy_ + 10,
      { textColor: '#ef4444', bgColor: 'rgba(255,255,255,0.85)' });
  }

  c.restore();
}

// ---------------------------------------------------------------------------
// Spacing overlay drawing (canvas)
// ---------------------------------------------------------------------------

function drawSpacing(el: Element) {
  if (!ctx) return;
  const c = ctx;
  const rect = el.getBoundingClientRect();
  const bm = getBoxModel(el);

  // Content area (blue)
  const contentX = rect.left + bm.borderLeftWidth + bm.paddingLeft;
  const contentY = rect.top + bm.borderTopWidth + bm.paddingTop;
  const contentW = rect.width - bm.borderLeftWidth - bm.borderRightWidth - bm.paddingLeft - bm.paddingRight;
  const contentH = rect.height - bm.borderTopWidth - bm.borderBottomWidth - bm.paddingTop - bm.paddingBottom;
  c.fillStyle = 'rgba(0, 100, 255, 0.15)';
  c.fillRect(contentX, contentY, contentW, contentH);

  // --- Padding zones (green) ---
  const padColor = 'rgba(0, 128, 0, 0.3)';
  const padLabelColor = '#065f46';
  const padLabelBg = 'rgba(255,255,255,0.7)';

  // Top padding
  if (bm.paddingTop > 0) {
    c.fillStyle = padColor;
    c.fillRect(
      rect.left + bm.borderLeftWidth,
      rect.top + bm.borderTopWidth,
      rect.width - bm.borderLeftWidth - bm.borderRightWidth,
      bm.paddingTop,
    );
    if (bm.paddingTop >= 10) {
      drawLabel(c, `${Math.round(bm.paddingTop)}`,
        rect.left + rect.width / 2 - 12,
        rect.top + bm.borderTopWidth + bm.paddingTop / 2,
        { textColor: padLabelColor, bgColor: padLabelBg });
    }
  }

  // Bottom padding
  if (bm.paddingBottom > 0) {
    c.fillStyle = padColor;
    c.fillRect(
      rect.left + bm.borderLeftWidth,
      rect.bottom - bm.borderBottomWidth - bm.paddingBottom,
      rect.width - bm.borderLeftWidth - bm.borderRightWidth,
      bm.paddingBottom,
    );
    if (bm.paddingBottom >= 10) {
      drawLabel(c, `${Math.round(bm.paddingBottom)}`,
        rect.left + rect.width / 2 - 12,
        rect.bottom - bm.borderBottomWidth - bm.paddingBottom / 2,
        { textColor: padLabelColor, bgColor: padLabelBg });
    }
  }

  // Left padding
  if (bm.paddingLeft > 0) {
    c.fillStyle = padColor;
    c.fillRect(
      rect.left + bm.borderLeftWidth,
      rect.top + bm.borderTopWidth + bm.paddingTop,
      bm.paddingLeft,
      rect.height - bm.borderTopWidth - bm.borderBottomWidth - bm.paddingTop - bm.paddingBottom,
    );
    if (bm.paddingLeft >= 10) {
      drawLabel(c, `${Math.round(bm.paddingLeft)}`,
        rect.left + bm.borderLeftWidth + bm.paddingLeft / 2 - 8,
        rect.top + rect.height / 2,
        { textColor: padLabelColor, bgColor: padLabelBg });
    }
  }

  // Right padding
  if (bm.paddingRight > 0) {
    c.fillStyle = padColor;
    c.fillRect(
      rect.right - bm.borderRightWidth - bm.paddingRight,
      rect.top + bm.borderTopWidth + bm.paddingTop,
      bm.paddingRight,
      rect.height - bm.borderTopWidth - bm.borderBottomWidth - bm.paddingTop - bm.paddingBottom,
    );
    if (bm.paddingRight >= 10) {
      drawLabel(c, `${Math.round(bm.paddingRight)}`,
        rect.right - bm.borderRightWidth - bm.paddingRight / 2 - 8,
        rect.top + rect.height / 2,
        { textColor: padLabelColor, bgColor: padLabelBg });
    }
  }

  // --- Margin zones (orange) ---
  const marginColor = 'rgba(255, 165, 0, 0.3)';
  const marginLabelColor = '#92400e';
  const marginLabelBg = 'rgba(255,255,255,0.7)';

  // Top margin
  if (bm.marginTop > 0) {
    c.fillStyle = marginColor;
    c.fillRect(rect.left, rect.top - bm.marginTop, rect.width, bm.marginTop);
    if (bm.marginTop >= 10) {
      drawLabel(c, `${Math.round(bm.marginTop)}`,
        rect.left + rect.width / 2 - 12,
        rect.top - bm.marginTop / 2,
        { textColor: marginLabelColor, bgColor: marginLabelBg });
    }
  }

  // Bottom margin
  if (bm.marginBottom > 0) {
    c.fillStyle = marginColor;
    c.fillRect(rect.left, rect.bottom, rect.width, bm.marginBottom);
    if (bm.marginBottom >= 10) {
      drawLabel(c, `${Math.round(bm.marginBottom)}`,
        rect.left + rect.width / 2 - 12,
        rect.bottom + bm.marginBottom / 2,
        { textColor: marginLabelColor, bgColor: marginLabelBg });
    }
  }

  // Left margin
  if (bm.marginLeft > 0) {
    c.fillStyle = marginColor;
    c.fillRect(rect.left - bm.marginLeft, rect.top, bm.marginLeft, rect.height);
    if (bm.marginLeft >= 10) {
      drawLabel(c, `${Math.round(bm.marginLeft)}`,
        rect.left - bm.marginLeft / 2 - 8,
        rect.top + rect.height / 2,
        { textColor: marginLabelColor, bgColor: marginLabelBg });
    }
  }

  // Right margin
  if (bm.marginRight > 0) {
    c.fillStyle = marginColor;
    c.fillRect(rect.right, rect.top, bm.marginRight, rect.height);
    if (bm.marginRight >= 10) {
      drawLabel(c, `${Math.round(bm.marginRight)}`,
        rect.right + bm.marginRight / 2 - 8,
        rect.top + rect.height / 2,
        { textColor: marginLabelColor, bgColor: marginLabelBg });
    }
  }

  // Outer border outline (thin dashed)
  c.save();
  c.setLineDash([3, 3]);
  c.strokeStyle = 'rgba(100,100,100,0.5)';
  c.lineWidth = 1;
  c.strokeRect(rect.left, rect.top, rect.width, rect.height);
  c.restore();
}

// ---------------------------------------------------------------------------
// Component boundaries drawing
// ---------------------------------------------------------------------------

function collectComponentBoundaries(): BoundaryComponent[] {
  const results: BoundaryComponent[] = [];
  const root = document.getElementById('root');
  if (!root) return results;

  try {
    const rootFiber = getFiber(root);
    if (!rootFiber) return results;
    walkFiber(rootFiber, results);
  } catch {
    // Fiber access failed — degrade gracefully
  }
  return results;
}

function walkFiber(fiber: any, results: BoundaryComponent[]) {
  if (!fiber) return;

  try {
    if (fiber.type && typeof fiber.type === 'function') {
      const name = fiber.type.displayName || fiber.type.name;
      if (name) {
        const domNode = findDomNode(fiber);
        if (domNode) {
          const rect = domNode.getBoundingClientRect();
          // Skip tiny elements
          if (rect.width >= 8 && rect.height >= 8) {
            results.push({
              name,
              rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
              color: hashColor(name),
            });
          }
        }
      }
    }
  } catch { /* skip */ }

  // Recurse children
  try {
    let child = fiber.child;
    while (child) {
      walkFiber(child, results);
      child = child.sibling;
    }
  } catch { /* skip */ }
}

function findDomNode(fiber: any): HTMLElement | null {
  // stateNode for host (DOM) fibers
  if (fiber.stateNode instanceof HTMLElement) return fiber.stateNode;
  // Walk child fibers to find first DOM node
  let child = fiber.child;
  while (child) {
    if (child.stateNode instanceof HTMLElement) return child.stateNode;
    const found = findDomNode(child);
    if (found) return found;
    child = child.sibling;
  }
  return null;
}

function drawBoundaries(components: BoundaryComponent[]) {
  if (!ctx) return;
  const c = ctx;

  c.save();
  for (const comp of components) {
    // Dashed outline
    c.setLineDash([4, 3]);
    c.strokeStyle = comp.color;
    c.lineWidth = 1;
    c.globalAlpha = 0.6;
    c.strokeRect(comp.rect.left, comp.rect.top, comp.rect.width, comp.rect.height);

    // Label background
    c.globalAlpha = 0.85;
    c.font = '9px ui-monospace, monospace';
    const tm = c.measureText(comp.name);
    const lw = tm.width + 8;
    const lh = 16;
    roundRectPath(c, comp.rect.left - 1, comp.rect.top - 1, lw, lh, 0);
    c.fillStyle = comp.color;
    c.fill();

    // Label text
    c.fillStyle = '#fff';
    c.textBaseline = 'middle';
    c.fillText(comp.name, comp.rect.left + 3, comp.rect.top - 1 + lh / 2);
  }
  c.restore();
}

// ---------------------------------------------------------------------------
// Main runtime
// ---------------------------------------------------------------------------

export function initInspectRuntime() {
  const activeTools = new Set<string>();
  let lastHoveredEl: Element | null = null;
  let rafId = 0;
  let hostOrigin = '*'; // Set on first valid message

  // Send message to host
  function sendToHost(data: any) {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(data, hostOrigin === '*' ? '*' : hostOrigin);
      }
    } catch { /* cross-origin blocked */ }
  }

  // Element detection (hide canvas, detect, restore)
  function elementAtPoint(x: number, y: number): Element | null {
    const c = canvas;
    if (c) c.style.display = 'none';
    const el = document.elementFromPoint(x, y);
    if (c) c.style.display = '';
    return el;
  }

  // Build minimal element data (for hover)
  function buildMinimalData(el: Element): ElementData {
    const rect = el.getBoundingClientRect();
    return {
      tagName: el.tagName.toLowerCase(),
      id: (el as HTMLElement).id || '',
      className: (el as HTMLElement).className || '',
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      boxModel: getBoxModel(el),
      componentName: getComponentName(el),
    };
  }

  // Build full element data (for click)
  function buildFullData(el: Element): ElementData {
    const data = buildMinimalData(el);
    data.computedStyles = extractComputedStyles(el);
    data.props = getFiberProps(el) || undefined;
    data.fiberAvailable = getFiber(el) !== null;
    return data;
  }

  // Hover handler (throttled via rAF)
  function onMouseMove(e: MouseEvent) {
    if (activeTools.size === 0) return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const el = elementAtPoint(e.clientX, e.clientY);
      if (!el || el === lastHoveredEl) return;
      // Skip canvas element
      if (el.closest('#auui-inspect-canvas')) return;
      lastHoveredEl = el;

      currentMeasureEl = activeTools.has('measure') ? el : currentMeasureEl;
      currentSpacingEl = activeTools.has('spacing') ? el : currentSpacingEl;
      redraw();

      sendToHost({ type: 'auui:element-hover', data: buildMinimalData(el) });
    });
  }

  // Click handler
  function onClick(e: MouseEvent) {
    if (activeTools.size === 0) return;
    const el = elementAtPoint(e.clientX, e.clientY);
    if (!el) return;
    if (el.closest('#auui-inspect-canvas')) return;

    e.preventDefault();
    e.stopPropagation();

    sendToHost({ type: 'auui:element-click', data: buildFullData(el) });
  }

  // Cursor management
  function updateCursor() {
    document.body.style.cursor = activeTools.size > 0 ? 'crosshair' : '';
  }

  // Tool enable/disable
  function enableTool(tool: string) {
    activeTools.add(tool);
    updateCursor();
    getCanvas(); // ensure canvas exists

    if (tool === 'boundaries') {
      currentBoundaries = collectComponentBoundaries();
      redraw();
      sendToHost({ type: 'auui:boundaries-data', components: currentBoundaries });
    }
  }

  function disableTool(tool: string) {
    activeTools.delete(tool);
    updateCursor();

    if (tool === 'measure') currentMeasureEl = null;
    if (tool === 'spacing') currentSpacingEl = null;
    if (tool === 'boundaries') currentBoundaries = null;

    if (activeTools.size === 0) {
      clearCanvas();
      lastHoveredEl = null;
    } else {
      redraw();
    }
  }

  // Recalculate boundaries on scroll/resize (debounced)
  let boundsTimer: ReturnType<typeof setTimeout>;
  function recalcBoundaries() {
    clearTimeout(boundsTimer);
    boundsTimer = setTimeout(() => {
      if (activeTools.has('boundaries')) {
        currentBoundaries = collectComponentBoundaries();
      }
      redraw();
    }, 100);
  }

  // Resize handler: resize backing store then recalculate
  function onResize() {
    resizeCanvas();
    recalcBoundaries();
  }

  // Message handler
  function onMessage(e: MessageEvent) {
    // Origin validation
    if (!isAllowedOrigin(e.origin)) return;
    const msg = e.data;
    if (!msg || typeof msg.type !== 'string' || !msg.type.startsWith('auui:')) return;

    // Remember the host origin for responses
    hostOrigin = e.origin;

    switch (msg.type) {
      case 'auui:enable-tool':
        if (msg.tool) enableTool(msg.tool);
        break;
      case 'auui:disable-tool':
        if (msg.tool) disableTool(msg.tool);
        break;
      case 'auui:ping':
        sendToHost({ type: 'auui:inspect-ready' });
        break;
    }
  }

  // Attach listeners
  window.addEventListener('message', onMessage);
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('click', onClick, true); // capture phase
  window.addEventListener('scroll', recalcBoundaries, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  // Signal ready
  sendToHost({ type: 'auui:inspect-ready' });

  // Re-signal on HMR (Vite re-executes the module)
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      window.removeEventListener('message', onMessage);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('scroll', recalcBoundaries);
      window.removeEventListener('resize', onResize);
      if (canvas) canvas.remove();
      canvas = null;
      ctx = null;
      currentMeasureEl = null;
      currentSpacingEl = null;
      currentBoundaries = null;
      document.body.style.cursor = '';
    });
  }
}
