import { useState, useEffect } from 'react';
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

interface Route {
  id: string;
  name: string;
  selected: boolean;
  steps: string[];
  nodeIds: string[];
  edgeIds: string[];
}

interface TestWorkflowDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: Node[];
  edges: Edge[];
  rightOffset?: number;
  onRouteSelectionChange?: (selectedNodeIds: string[], selectedEdgeIds: string[]) => void;
}

export function TestWorkflowDrawer({ open, onOpenChange, nodes, edges, rightOffset = 0, onRouteSelectionChange }: TestWorkflowDrawerProps) {
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

        // Find connected nodes
        const connectedEdges = edges.filter((e: Edge) => e.source === nodeId);

        // If no more connections, return the current path
        if (connectedEdges.length === 0) {
          return [{ steps: newPath, nodeIds: newNodeIds, edgeIds: currentEdgeIds }];
        }

        // Check if this is a conditional (branching) node
        const isConditional = config?.category === 'Logic';

        // If multiple edges from a non-conditional node, create separate routes
        if (connectedEdges.length > 1 && !isConditional) {
          const allPaths: Array<{ steps: string[]; nodeIds: string[]; edgeIds: string[] }> = [];
          connectedEdges.forEach((edge: Edge) => {
            const newEdgeIds = [...currentEdgeIds, edge.id];
            const subPaths = traversePaths(edge.target, newPath, newNodeIds, newEdgeIds);
            allPaths.push(...subPaths);
          });
          return allPaths;
        }

        // For conditional or single edge, continue traversal
        const allPaths: Array<{ steps: string[]; nodeIds: string[]; edgeIds: string[] }> = [];
        connectedEdges.forEach((edge: Edge) => {
          const newEdgeIds = [...currentEdgeIds, edge.id];
          const subPaths = traversePaths(edge.target, newPath, newNodeIds, newEdgeIds);
          allPaths.push(...subPaths);
        });
        return allPaths;
      };

      const paths = traversePaths(triggerNode.id, [], [], []);

      // Create a route for each path
      paths.forEach((pathData) => {
        routeCounter++;
        allRoutes.push({
          id: `route-${routeCounter}`,
          name: `Route ${routeCounter}`,
          selected: false,
          steps: pathData.steps,
          nodeIds: pathData.nodeIds,
          edgeIds: pathData.edgeIds,
        });
      });
    });

    return allRoutes;
  };

  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    if (open) {
      // Only regenerate routes if we don't have any yet
      setRoutes((prev) => {
        if (prev.length === 0) {
          return generateRoutes();
        }
        return prev;
      });
    } else {
      // Clear selections when drawer closes
      setRoutes([]);
      if (onRouteSelectionChange) {
        onRouteSelectionChange([], []);
      }

      // Ensure body styles are cleaned up
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
        // Force remove any vaul-specific attributes
        document.body.removeAttribute('data-vaul-drawer-visible');
        document.body.removeAttribute('vaul-drawer-visible');
      }, 150);
    }
  }, [open]);

  const selectedCount = routes.filter((r) => r.selected).length;
  const totalRoutes = routes.length;
  const coveragePercentage = totalRoutes > 0 ? Math.round((selectedCount / totalRoutes) * 100) : 0;

  const handleToggleRoute = (routeId: string) => {
    setRoutes((prev) => {
      const updatedRoutes = prev.map((route) =>
        route.id === routeId ? { ...route, selected: !route.selected } : route
      );

      // Collect all selected node and edge IDs
      const selectedNodeIds = new Set<string>();
      const selectedEdgeIds = new Set<string>();

      updatedRoutes.forEach((route) => {
        if (route.selected) {
          route.nodeIds.forEach((id) => selectedNodeIds.add(id));
          route.edgeIds.forEach((id) => selectedEdgeIds.add(id));
        }
      });

      // Notify parent of selection changes
      if (onRouteSelectionChange) {
        onRouteSelectionChange(Array.from(selectedNodeIds), Array.from(selectedEdgeIds));
      }

      return updatedRoutes;
    });
  };

  const handleRenameRoute = (routeId: string, newName: string) => {
    setRoutes((prev) =>
      prev.map((route) => (route.id === routeId ? { ...route, name: newName } : route))
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent rightOffset={rightOffset}>
        <DrawerHeader>
          <DrawerTitle>Select test route</DrawerTitle>
          <DrawerDescription>Choose a branching path to test</DrawerDescription>
        </DrawerHeader>

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
                    {route.steps.map((step, index) => (
                      <div key={index}>{step}</div>
                    ))}
                  </div>
                </ItemContent>
              </Item>
            ))}
        </div>

        <DrawerFooter className="flex flex-row justify-end gap-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button onClick={() => onOpenChange(false)}>
            Start test ({selectedCount} {selectedCount === 1 ? 'route' : 'routes'})
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
