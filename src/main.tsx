import React, { Suspense, ComponentType, Component, ReactNode, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/**
 * Error Boundary to catch render errors in isolated components
 */
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ComponentErrorBoundary extends Component<
  { children: ReactNode; componentPath: string },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; componentPath: string }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Component Preview] Render error:', error)
    console.error('[Component Preview] Component stack:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-lg">
          <div className="text-red-600 font-medium mb-2">Component Error</div>
          <div className="text-sm text-gray-600 mb-2">{this.props.componentPath}</div>
          <pre className="text-xs bg-red-100 p-2 rounded overflow-auto max-h-48">
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <div className="mt-3 text-xs text-gray-500">
            This component may require props or context providers to render correctly.
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Detect component type from name and return smart default props
 */
function getSmartDefaults(componentName: string, componentPath: string): {
  props: Record<string, any>
  wrapperStyle?: React.CSSProperties
  isOverlay?: boolean
} {
  const name = componentName.toLowerCase()
  const path = componentPath.toLowerCase()

  // Dialog, Modal, Sheet, Drawer - need open={true}
  if (name.includes('dialog') || name.includes('modal') || name.includes('sheet') ||
      name.includes('drawer') || name.includes('popover') || name.includes('dropdown') ||
      path.includes('dialog') || path.includes('modal') || path.includes('sheet')) {
    return {
      props: { open: true, defaultOpen: true },
      isOverlay: true
    }
  }

  // Sidebar, Nav - may need explicit dimensions
  if (name.includes('sidebar') || name.includes('sidenav') || name.includes('navigation')) {
    return {
      props: {},
      wrapperStyle: { width: '280px', height: '100vh', position: 'relative' as const }
    }
  }

  // Tooltip, Hover cards - need to be visible
  if (name.includes('tooltip') || name.includes('hovercard')) {
    return {
      props: { open: true, defaultOpen: true },
      isOverlay: false
    }
  }

  // Accordion, Collapsible - default open
  if (name.includes('accordion') || name.includes('collapsible')) {
    return {
      props: { defaultValue: 'item-1', type: 'single' },
      wrapperStyle: { width: '400px' }
    }
  }

  // Tabs - need default value
  if (name.includes('tabs')) {
    return {
      props: { defaultValue: 'tab-1' },
      wrapperStyle: { width: '500px' }
    }
  }

  // Card, Panel - give reasonable width
  if (name.includes('card') || name.includes('panel')) {
    return {
      props: {},
      wrapperStyle: { width: '400px' }
    }
  }

  // Button, Link - need children
  if (name.includes('button') || name.includes('link') || name.includes('badge') || name.includes('tag')) {
    return {
      props: { children: 'Sample Text' }
    }
  }

  // Input, Textarea - need placeholder
  if (name.includes('input') || name.includes('textarea') || name.includes('textfield')) {
    return {
      props: { placeholder: 'Enter text...' },
      wrapperStyle: { width: '300px' }
    }
  }

  // Select, Combobox - need options
  if (name.includes('select') || name.includes('combobox')) {
    return {
      props: { placeholder: 'Select option...' },
      wrapperStyle: { width: '300px' }
    }
  }

  // Table - needs reasonable width
  if (name.includes('table') || name.includes('datagrid')) {
    return {
      props: {},
      wrapperStyle: { width: '100%', maxWidth: '800px' }
    }
  }

  // Form - reasonable width
  if (name.includes('form')) {
    return {
      props: {},
      wrapperStyle: { width: '100%', maxWidth: '500px' }
    }
  }

  // Default - no special handling
  return { props: {} }
}

/**
 * Interactive controls panel for preview
 */
function PreviewControls({
  componentName,
  isOverlay,
  onToggleOpen,
  isOpen,
  wrapperStyle,
  onStyleChange
}: {
  componentName: string
  isOverlay?: boolean
  onToggleOpen?: () => void
  isOpen?: boolean
  wrapperStyle?: React.CSSProperties
  onStyleChange?: (style: React.CSSProperties) => void
}) {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-lg border overflow-hidden transition-all ${collapsed ? 'w-auto' : 'w-64'}`}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
        >
          <span>Preview Controls</span>
          <span className="text-gray-400">{collapsed ? '▲' : '▼'}</span>
        </button>

        {!collapsed && (
          <div className="p-3 border-t space-y-3">
            {isOverlay !== undefined && onToggleOpen && (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isOpen}
                  onChange={onToggleOpen}
                  className="rounded"
                />
                <span>Show {componentName}</span>
              </label>
            )}

            {wrapperStyle && onStyleChange && (
              <>
                <div className="text-xs text-gray-500 font-medium">Dimensions</div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs">
                    Width
                    <input
                      type="text"
                      defaultValue={wrapperStyle.width as string || 'auto'}
                      onChange={(e) => onStyleChange({ ...wrapperStyle, width: e.target.value })}
                      className="w-full mt-1 px-2 py-1 border rounded text-xs"
                    />
                  </label>
                  <label className="text-xs">
                    Height
                    <input
                      type="text"
                      defaultValue={wrapperStyle.height as string || 'auto'}
                      onChange={(e) => onStyleChange({ ...wrapperStyle, height: e.target.value })}
                      className="w-full mt-1 px-2 py-1 border rounded text-xs"
                    />
                  </label>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Component Isolation Preview wrapper
 */
function ComponentPreview({
  Component,
  componentPath,
  componentName,
  previewConfig
}: {
  Component: ComponentType<any>
  componentPath: string
  componentName: string
  previewConfig?: { props?: Record<string, any>; wrapperStyle?: React.CSSProperties }
}) {
  const defaults = getSmartDefaults(componentName, componentPath)

  // Merge preview config with smart defaults (preview config takes precedence)
  const initialProps = { ...defaults.props, ...previewConfig?.props }
  const initialStyle = { ...defaults.wrapperStyle, ...previewConfig?.wrapperStyle }

  const [isOpen, setIsOpen] = useState(true)
  const [wrapperStyle, setWrapperStyle] = useState<React.CSSProperties>(initialStyle)

  // Build props - handle open state for overlays
  const componentProps = { ...initialProps }
  if (defaults.isOverlay) {
    componentProps.open = isOpen
    componentProps.onOpenChange = setIsOpen
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header showing which component is being previewed */}
      <div className="bg-white border-b px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
        <span>Component Preview:</span>
        <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">{componentPath}</code>
        {defaults.isOverlay && (
          <span className="ml-2 text-xs text-blue-600">(overlay - toggle with controls)</span>
        )}
      </div>

      {/* Component render area */}
      <div className="p-8 flex items-start justify-center min-h-[calc(100vh-44px)]">
        <ComponentErrorBoundary componentPath={componentPath}>
          <Suspense fallback={
            <div className="text-gray-500 animate-pulse">Loading component...</div>
          }>
            <div style={wrapperStyle}>
              <Component {...componentProps} />
            </div>
          </Suspense>
        </ComponentErrorBoundary>
      </div>

      {/* Interactive controls */}
      <PreviewControls
        componentName={componentName}
        isOverlay={defaults.isOverlay}
        onToggleOpen={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        wrapperStyle={wrapperStyle}
        onStyleChange={setWrapperStyle}
      />
    </div>
  )
}

/**
 * Error display for load failures
 */
function PreviewError({ error, componentPath }: { error: string; componentPath: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-md text-center">
        <div className="text-red-500 text-lg font-medium mb-2">Failed to load component</div>
        <div className="text-gray-600 text-sm mb-4">
          <code className="bg-gray-100 px-2 py-1 rounded">{componentPath}</code>
        </div>
        <div className="bg-red-50 border border-red-200 rounded p-3 text-left">
          <pre className="text-xs text-red-700 whitespace-pre-wrap">{error}</pre>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Check that the file exports a React component (default or named export).
        </div>
      </div>
    </div>
  )
}

/**
 * Main entry point
 * Supports component isolation via URL parameter: ?component=components/Button.tsx
 *
 * Preview config convention:
 * Export a __preview object from your component file to customize the preview:
 *
 * export const __preview = {
 *   props: { variant: 'primary', children: 'Click me' },
 *   wrapperStyle: { width: '200px' }
 * }
 */
async function main() {
  const root = document.getElementById('root')!
  const params = new URLSearchParams(window.location.search)
  const componentPath = params.get('component')

  if (componentPath) {
    // Component isolation mode
    console.log('[Component Preview] Isolating:', componentPath)

    try {
      // Normalize the path: remove 'src/' prefix if present, ensure no leading slash
      const normalizedPath = componentPath
        .replace(/^\//, '')
        .replace(/^src\//, '')
        .replace(/\.tsx$/, '')

      console.log('[Component Preview] Normalized path:', normalizedPath)

      // Dynamic import using Vite's glob import for better compatibility
      const modules = import.meta.glob('./**/*.tsx')
      const modulePath = `./${normalizedPath}.tsx`

      console.log('[Component Preview] Looking for module:', modulePath)

      if (modules[modulePath]) {
        const mod = await modules[modulePath]() as Record<string, any>

        console.log('[Component Preview] Module exports:', Object.keys(mod))

        // Get preview config if exported
        const previewConfig = mod.__preview as { props?: Record<string, any>; wrapperStyle?: React.CSSProperties } | undefined

        // Get the component - prefer default export, fall back to first capitalized named export
        let Component = mod.default
        let componentName = 'Component'

        if (!Component) {
          // Find the first export that looks like a React component (capitalized function/class)
          for (const [name, exp] of Object.entries(mod)) {
            if (
              name !== '__preview' &&
              name[0] === name[0].toUpperCase() &&
              (typeof exp === 'function' || (typeof exp === 'object' && exp !== null))
            ) {
              console.log('[Component Preview] Using named export:', name)
              Component = exp
              componentName = name
              break
            }
          }
        } else {
          // Try to get component name from default export
          componentName = (Component as any).displayName || Component.name || 'Component'
        }

        if (Component) {
          console.log('[Component Preview] Rendering component:', componentName)
          ReactDOM.createRoot(root).render(
            <React.StrictMode>
              <ComponentPreview
                Component={Component as ComponentType<any>}
                componentPath={componentPath}
                componentName={componentName}
                previewConfig={previewConfig}
              />
            </React.StrictMode>
          )
          return
        } else {
          console.error('[Component Preview] No valid component export found')
        }
      } else {
        console.error('[Component Preview] Module not found in glob results')
      }

      // Module not found or no valid export
      ReactDOM.createRoot(root).render(
        <PreviewError
          error={`Could not find component at path: ${normalizedPath}.tsx\n\nAvailable paths:\n${Object.keys(modules).slice(0, 5).join('\n')}${Object.keys(modules).length > 5 ? '\n...' : ''}`}
          componentPath={componentPath}
        />
      )
    } catch (err: any) {
      console.error('[Component Preview] Error:', err)
      ReactDOM.createRoot(root).render(
        <PreviewError
          error={err.message || 'Unknown error'}
          componentPath={componentPath}
        />
      )
    }
  } else {
    // Normal mode - render full app
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

main()
