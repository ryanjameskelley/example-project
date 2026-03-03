import { useState, useEffect, useRef } from 'react';
import type { Node, Edge } from 'reactflow';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from './Drawer';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from './Item';
import { STEP_CONFIG, type JourneyStepNodeData } from './JourneyStepNode';
import { CheckCircle2, XCircle, Loader2, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from './dialog';

type Phase = 'select' | 'testing' | 'results';
type RouteTestStatus = 'pending' | 'running' | 'passed' | 'failed';

interface FailureReport {
  routeName: string;
  testPatientId: string;
  failedStep: string;
  errorCode: string;
  errorMessage: string;
  timeline: { step: string; status: 'passed' | 'failed' | 'skipped' }[];
  timestamp: string;
}

const FAILURE_SCENARIOS = [
  { code: 'ERR_SMTP_TIMEOUT', message: 'SMTP connection timeout after 30s — mail server unreachable during test execution.' },
  { code: 'ERR_INVALID_PHONE', message: 'Invalid phone number format for test patient — E.164 format required.' },
  { code: 'ERR_VALIDATION', message: "Validation failed: required field 'priority' is missing from test patient payload." },
  { code: 'ERR_FIELD_NOT_FOUND', message: "Condition evaluation error: field 'score' not found in test patient data." },
  { code: 'ERR_TIMEOUT', message: 'Test execution timeout exceeded maximum allowed duration (5s).' },
  { code: 'ERR_READONLY_FIELD', message: "Field 'status' is read-only in the test environment and cannot be written." },
];

const generateFailureReport = (route: Route): FailureReport => {
  const scenario = FAILURE_SCENARIOS[Math.floor(Math.random() * FAILURE_SCENARIOS.length)];
  const failIndex = Math.min(Math.floor(Math.random() * route.steps.length), route.steps.length - 1);
  const timeline = route.steps.map((step, i) => ({
    step,
    status: i < failIndex ? 'passed' : i === failIndex ? 'failed' : 'skipped',
  })) as { step: string; status: 'passed' | 'failed' | 'skipped' }[];
  return {
    routeName: route.name,
    testPatientId: route.testPatientId,
    failedStep: route.steps[failIndex] ?? 'Unknown step',
    errorCode: scenario.code,
    errorMessage: scenario.message,
    timeline,
    timestamp: new Date().toISOString(),
  };
};

interface Route {
  id: string;
  name: string;
  selected: boolean;
  steps: string[];
  nodeIds: string[];
  edgeIds: string[];
  testPatientId: string;
}

interface TestWorkflowDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: Node[];
  edges: Edge[];
  rightOffset?: number;
  onRouteSelectionChange?: (selectedNodeIds: string[], selectedEdgeIds: string[]) => void;
  onTestNodeStatusChange?: (nodeStatuses: Record<string, 'testing' | 'passed' | 'failed'>) => void;
}

export function TestWorkflowDrawer({ open, onOpenChange, nodes, edges, rightOffset = 0, onRouteSelectionChange, onTestNodeStatusChange }: TestWorkflowDrawerProps) {
  const generateRoutes = (): Route[] => {
    const allRoutes: Route[] = [];
    let routeCounter = 0;

    const triggerNodes = nodes.filter((node: Node) => {
      const nodeData = node.data as JourneyStepNodeData;
      const config = STEP_CONFIG[nodeData?.stepType];
      return config?.category === 'Trigger';
    });

    if (triggerNodes.length === 0) {
      return [];
    }

    triggerNodes.forEach((triggerNode) => {
      const traversePaths = (
        nodeId: string,
        currentPath: string[],
        currentNodeIds: string[],
        currentEdgeIds: string[]
      ): Array<{ steps: string[]; nodeIds: string[]; edgeIds: string[] }> => {
        const node = nodes.find((n: Node) => n.id === nodeId);
        if (!node) return [{ steps: currentPath, nodeIds: currentNodeIds, edgeIds: currentEdgeIds }];

        const nodeData = node.data as JourneyStepNodeData;
        const config = STEP_CONFIG[nodeData?.stepType];
        const label = nodeData.label || config?.label || 'Unknown';

        const newPath = [...currentPath, label];
        const newNodeIds = [...currentNodeIds, nodeId];

        const connectedEdges = edges.filter((e: Edge) => e.source === nodeId);

        if (connectedEdges.length === 0) {
          return [{ steps: newPath, nodeIds: newNodeIds, edgeIds: currentEdgeIds }];
        }

        const allPaths: Array<{ steps: string[]; nodeIds: string[]; edgeIds: string[] }> = [];
        connectedEdges.forEach((edge: Edge) => {
          const newEdgeIds = [...currentEdgeIds, edge.id];
          const subPaths = traversePaths(edge.target, newPath, newNodeIds, newEdgeIds);
          allPaths.push(...subPaths);
        });
        return allPaths;
      };

      const paths = traversePaths(triggerNode.id, [], [], []);

      paths.forEach((pathData) => {
        routeCounter++;
        allRoutes.push({
          id: `route-${routeCounter}`,
          name: `Route ${routeCounter}`,
          selected: false,
          steps: pathData.steps,
          nodeIds: pathData.nodeIds,
          edgeIds: pathData.edgeIds,
          testPatientId: `PT-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
        });
      });
    });

    return allRoutes;
  };

  const [routes, setRoutes] = useState<Route[]>([]);
  const [phase, setPhase] = useState<Phase>('select');
  const [routeStatuses, setRouteStatuses] = useState<Record<string, RouteTestStatus>>({});
  const [routeReports, setRouteReports] = useState<Record<string, FailureReport>>({});
  const [reportRouteId, setReportRouteId] = useState<string | null>(null);
  const [expandedRoutes, setExpandedRoutes] = useState<Set<string>>(new Set());
  const testAbortRef = useRef(false);

  const toggleExpanded = (routeId: string) => {
    setExpandedRoutes(prev => {
      const next = new Set(prev);
      if (next.has(routeId)) next.delete(routeId); else next.add(routeId);
      return next;
    });
  };

  useEffect(() => {
    if (open) {
      setPhase('select');
      setRouteStatuses({});
      setRoutes((prev) => {
        if (prev.length === 0) {
          return generateRoutes();
        }
        return prev;
      });
    } else {
      testAbortRef.current = true;
      setRoutes([]);
      setPhase('select');
      setRouteStatuses({});
      onRouteSelectionChange?.([], []);
      onTestNodeStatusChange?.({});

      setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
        document.body.removeAttribute('data-vaul-drawer-visible');
        document.body.removeAttribute('vaul-drawer-visible');
      }, 150);
    }
  }, [open]);

  const selectedRoutes = routes.filter((r) => r.selected);
  const selectedCount = selectedRoutes.length;
  const totalRoutes = routes.length;
  const coveragePercentage = totalRoutes > 0 ? Math.round((selectedCount / totalRoutes) * 100) : 0;
  const passedCount = selectedRoutes.filter(r => routeStatuses[r.id] === 'passed').length;

  const handleToggleRoute = (routeId: string) => {
    setRoutes((prev) => {
      const updatedRoutes = prev.map((route) =>
        route.id === routeId ? { ...route, selected: !route.selected } : route
      );

      const selectedNodeIds = new Set<string>();
      const selectedEdgeIds = new Set<string>();

      updatedRoutes.forEach((route) => {
        if (route.selected) {
          route.nodeIds.forEach((id) => selectedNodeIds.add(id));
          route.edgeIds.forEach((id) => selectedEdgeIds.add(id));
        }
      });

      onRouteSelectionChange?.(Array.from(selectedNodeIds), Array.from(selectedEdgeIds));
      return updatedRoutes;
    });
  };

  const handleStartTest = async () => {
    if (selectedRoutes.length === 0) return;

    testAbortRef.current = false;
    setPhase('testing');

    const initialStatuses: Record<string, RouteTestStatus> = {};
    selectedRoutes.forEach(r => { initialStatuses[r.id] = 'pending'; });
    setRouteStatuses(initialStatuses);

    const nodeStatuses: Record<string, 'testing' | 'passed' | 'failed'> = {};

    for (const route of selectedRoutes) {
      if (testAbortRef.current) break;

      setRouteStatuses(prev => ({ ...prev, [route.id]: 'running' }));
      route.nodeIds.forEach(nid => { nodeStatuses[nid] = 'testing'; });
      onTestNodeStatusChange?.({ ...nodeStatuses });

      await new Promise<void>(resolve => setTimeout(resolve, 1200));
      if (testAbortRef.current) break;

      const passed = Math.random() > 0.2;
      const finalStatus: RouteTestStatus = passed ? 'passed' : 'failed';

      setRouteStatuses(prev => ({ ...prev, [route.id]: finalStatus }));
      route.nodeIds.forEach(nid => { nodeStatuses[nid] = passed ? 'passed' : 'failed'; });
      onTestNodeStatusChange?.({ ...nodeStatuses });

      if (!passed) {
        setRouteReports(prev => ({ ...prev, [route.id]: generateFailureReport(route) }));
      }

      await new Promise<void>(resolve => setTimeout(resolve, 400));
    }

    if (!testAbortRef.current) {
      setPhase('results');
    }
  };

  const getStatusIcon = (status: RouteTestStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'running': return <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />;
      case 'passed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const report = reportRouteId ? routeReports[reportRouteId] : null;

  return (
    <>
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent rightOffset={rightOffset}>
        <DrawerHeader>
          <DrawerTitle>
            {phase === 'select' ? 'Select test route' :
             phase === 'testing' ? 'Running test...' :
             'Test complete'}
          </DrawerTitle>
          <DrawerDescription>
            {phase === 'select' ? 'Choose a branching path to test' :
             phase === 'testing' ? 'Testing selected routes...' :
             `${passedCount} of ${selectedRoutes.length} routes passed`}
          </DrawerDescription>
        </DrawerHeader>

        {phase === 'select' && (
          <>
            <div className="p-4 pb-0">
              <Item variant="muted">
                <ItemContent>
                  <ItemTitle>
                    {selectedCount} of {totalRoutes} routes selected
                  </ItemTitle>
                  <ItemDescription>{coveragePercentage}% test coverage</ItemDescription>
                </ItemContent>
              </Item>
            </div>

            <div className="px-4 pb-4 pt-4 space-y-2 max-h-[50vh] overflow-y-auto">
              {routes.map((route) => (
                <Item
                  key={route.id}
                  variant="outline"
                  clickable
                  onClick={() => handleToggleRoute(route.id)}
                  className={`cursor-pointer !items-start transition-colors ${
                    route.selected
                      ? 'bg-green-50 border-green-500 hover:bg-green-100'
                      : ''
                  }`}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={route.selected}
                      onCheckedChange={() => handleToggleRoute(route.id)}
                      className="mt-0.5"
                    />
                  </div>
                  <ItemContent>
                    <ItemTitle className={route.selected ? 'text-green-700' : ''}>
                      {route.name}
                    </ItemTitle>
                    <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      {(expandedRoutes.has(route.id) ? route.steps : route.steps.slice(0, 3)).map((step, index) => (
                        <div key={index}>{step}</div>
                      ))}
                      {route.steps.length > 3 && (
                        <a href="#" onClick={(e) => { e.stopPropagation(); e.preventDefault(); toggleExpanded(route.id); }} className="text-blue-500 hover:text-blue-700 hover:underline">
                          {expandedRoutes.has(route.id) ? 'show less' : `and ${route.steps.length - 3} more`}
                        </a>
                      )}
                    </div>
                  </ItemContent>
                </Item>
              ))}
            </div>

            <DrawerFooter className="flex flex-row justify-end gap-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <Button onClick={handleStartTest} disabled={selectedCount === 0}>
                Start test ({selectedCount} {selectedCount === 1 ? 'route' : 'routes'})
              </Button>
            </DrawerFooter>
          </>
        )}

        {(phase === 'testing' || phase === 'results') && (
          <>
            <div className="px-4 pb-4 pt-4 space-y-2 max-h-[50vh] overflow-y-auto">
              {selectedRoutes.map((route) => {
                const status = routeStatuses[route.id] ?? 'pending';
                return (
                  <Item
                    key={route.id}
                    variant="outline"
                    className={cn(
                      '!items-start transition-colors',
                      status === 'running' && 'border-orange-300 bg-orange-50',
                      status === 'passed' && 'border-green-500 bg-green-50',
                      status === 'failed' && 'border-red-400 bg-red-50',
                    )}
                  >
                    <div className="mt-0.5">{getStatusIcon(status)}</div>
                    <ItemContent>
                      <ItemTitle className={cn(
                        status === 'running' && 'text-orange-700',
                        status === 'passed' && 'text-green-700',
                        status === 'failed' && 'text-red-700',
                      )}>
                        {route.name}
                      </ItemTitle>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2 mb-1">
                          <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            className="text-blue-500 hover:text-blue-700 hover:underline"
                          >
                            Test patient: {route.testPatientId}
                          </a>
                          {status === 'failed' && routeReports[route.id] && (
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); setReportRouteId(route.id); }}
                              className="flex items-center gap-1 text-red-500 hover:text-red-700 hover:underline"
                            >
                              <AlertCircle className="w-3 h-3" />
                              View failure report
                            </a>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          {(expandedRoutes.has(route.id) ? route.steps : route.steps.slice(0, 3)).map((step, index) => (
                            <div key={index}>{step}</div>
                          ))}
                          {route.steps.length > 3 && (
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleExpanded(route.id); }} className="text-blue-500 hover:text-blue-700 hover:underline">
                              {expandedRoutes.has(route.id) ? 'show less' : `and ${route.steps.length - 3} more`}
                            </a>
                          )}
                        </div>
                      </div>
                    </ItemContent>
                  </Item>
                );
              })}
            </div>

            {phase === 'results' && (
              <DrawerFooter className="flex flex-row justify-end gap-2">
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
                <Button onClick={handleStartTest}>
                  Re-run
                </Button>
              </DrawerFooter>
            )}
          </>
        )}
      </DrawerContent>
    </Drawer>

    {report && (
      <Dialog open={!!reportRouteId} onOpenChange={(open) => { if (!open) setReportRouteId(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Failure Report — {report.routeName}
            </DialogTitle>
            <DialogDescription>
              Test patient: {report.testPatientId} · {new Date(report.timestamp).toLocaleTimeString()}
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-4 space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Step timeline</p>
              <div className="space-y-1.5">
                {report.timeline.map((entry, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {entry.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                    {entry.status === 'failed' && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                    {entry.status === 'skipped' && <div className="w-4 h-4 rounded-full border-2 border-muted flex-shrink-0" />}
                    <span className={cn(
                      entry.status === 'failed' && 'text-red-700 font-medium',
                      entry.status === 'skipped' && 'text-muted-foreground',
                    )}>
                      {entry.step}
                      {entry.status === 'skipped' && <span className="ml-1 text-xs">(skipped)</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-md bg-red-50 border border-red-200 p-3 space-y-1">
              <p className="font-medium text-red-700">{report.errorCode}</p>
              <p className="text-red-600">{report.errorMessage}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportRouteId(null)}>Close</Button>
            <Button variant="default" onClick={() => setReportRouteId(null)}>
              Pause Journey for All Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
    </>
  );
}
