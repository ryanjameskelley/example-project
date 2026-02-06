import { useState, useEffect } from 'react';
import type { Node, Edge } from 'reactflow';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from './Dialog';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from './Item';
import { STEP_CONFIG, type JourneyStepNodeData } from './JourneyStepNode';

interface Route {
  id: string;
  name: string;
  selected: boolean;
  steps: string[];
}

interface TestRoutesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: Node[];
  edges: Edge[];
}

export function TestRoutesDialog({ open, onOpenChange, nodes, edges }: TestRoutesDialogProps) {
  // Generate routes by traversing the flow from trigger nodes
  const generateRoutes = (): Route[] => {
    const allRoutes: Route[] = [];
    let routeCounter = 0;

    // Find trigger nodes
    const triggerNodes = nodes.filter((node: Node) => {
      const nodeData = node.data as JourneyStepNodeData;
      const config = STEP_CONFIG[nodeData?.stepType];
      return config?.category === 'Trigger';
    });

    if (triggerNodes.length === 0) {
      return [];
    }

    // For each trigger, traverse the flow to build routes
    triggerNodes.forEach((triggerNode) => {
      // DFS traversal that creates separate routes for each branch
      const traversePaths = (nodeId: string, currentPath: string[]): string[][] => {
        const node = nodes.find((n: Node) => n.id === nodeId);
        if (!node) return [currentPath];

        const nodeData = node.data as JourneyStepNodeData;
        const config = STEP_CONFIG[nodeData?.stepType];
        const label = nodeData.label || config?.label || 'Unknown';

        const newPath = [...currentPath, label];

        // Find connected nodes
        const connectedEdges = edges.filter((e: Edge) => e.source === nodeId);

        // If no more connections, return the current path
        if (connectedEdges.length === 0) {
          return [newPath];
        }

        // Check if this is a conditional (branching) node
        const isConditional = config?.category === 'Logic';

        // If multiple edges from a non-conditional node, create separate routes
        if (connectedEdges.length > 1 && !isConditional) {
          const allPaths: string[][] = [];
          connectedEdges.forEach((edge: Edge) => {
            const subPaths = traversePaths(edge.target, newPath);
            allPaths.push(...subPaths);
          });
          return allPaths;
        }

        // For conditional or single edge, continue traversal
        const allPaths: string[][] = [];
        connectedEdges.forEach((edge: Edge) => {
          const subPaths = traversePaths(edge.target, newPath);
          allPaths.push(...subPaths);
        });
        return allPaths;
      };

      const paths = traversePaths(triggerNode.id, []);

      // Create a route for each path
      paths.forEach((steps) => {
        routeCounter++;
        allRoutes.push({
          id: `route-${routeCounter}`,
          name: `Route ${routeCounter}`,
          selected: false,
          steps,
        });
      });
    });

    return allRoutes;
  };

  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    if (open) {
      setRoutes(generateRoutes());
    }
  }, [open, nodes, edges]);

  const selectedCount = routes.filter((r) => r.selected).length;
  const totalRoutes = routes.length;
  const coveragePercentage = totalRoutes > 0 ? Math.round((selectedCount / totalRoutes) * 100) : 0;

  const handleToggleRoute = (routeId: string) => {
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId ? { ...route, selected: !route.selected } : route
      )
    );
  };

  const handleRenameRoute = (routeId: string, newName: string) => {
    setRoutes((prev) =>
      prev.map((route) => (route.id === routeId ? { ...route, name: newName } : route))
    );
  };

  useEffect(() => {
    if (!open) {
      // Force cleanup of any body styles that might be lingering
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    }
  }, [open]);

  return (
    <>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Select test route</DialogTitle>
          <DialogDescription>Choose a branching path to test</DialogDescription>
        </DialogHeader>

        <DialogClose />

        <div className="px-4 pb-4 space-y-4">
          <Item variant="muted">
            <ItemContent>
              <ItemTitle>
                {selectedCount} of {totalRoutes} routes selected
              </ItemTitle>
              <ItemDescription>{coveragePercentage}% test coverage</ItemDescription>
            </ItemContent>
          </Item>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {routes.map((route) => (
              <Item
                key={route.id}
                variant="outline"
                clickable
                onClick={() => handleToggleRoute(route.id)}
                className="cursor-pointer !items-start"
              >
                <Checkbox
                  checked={route.selected}
                  onCheckedChange={() => handleToggleRoute(route.id)}
                  className="mt-0.5"
                />
                <ItemContent>
                  <ItemTitle>{route.name}</ItemTitle>
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                    {route.steps.map((step, index) => (
                      <div key={index}>{step}</div>
                    ))}
                  </div>
                </ItemContent>
              </Item>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Start test ({selectedCount} {selectedCount === 1 ? 'route' : 'routes'})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
      )}
    </>
  );
}
