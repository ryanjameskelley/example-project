import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
  type Edge,
  type NodeTypes,
  type Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Play,
  Plus,
  Grid2X2,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Ticket,
  PenLine,
  GitBranch,
  Clock,
  Zap,
} from 'lucide-react';
import {
  FlowNode,
  FlowNodeIcon,
  FlowNodeContent,
  FlowNodeType,
  FlowNodeName,
  FlowNodeOverlay,
  FlowNodeActions,
  FlowNodeFooter,
} from '@/components/molecules/FlowNode';
import { ButtonGroup } from '@/components/molecules/ButtonGroup';
import { Button } from '@/components/atoms/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/molecules/DropdownMenu';
import { AppLayout } from '@/components/atoms/AppLayout';
import {
  JourneyStepNode,
  STEP_CONFIG,
  type StepType,
  type JourneyStepNodeData,
} from '@/components/molecules/JourneyStepNode';
import { StepSettingsDrawer } from '@/components/molecules/StepSettingsDrawer';
import { TestRoutesDialog } from '@/components/molecules/TestRoutesDialog';

const CustomNode = ({ data }: any) => {
  return (
    <FlowNode>
      <FlowNodeIcon>
        <Play className="w-5 h-5" />
      </FlowNodeIcon>
      <FlowNodeContent>
        <FlowNodeType>Action</FlowNodeType>
        <FlowNodeName>{data.label}</FlowNodeName>
      </FlowNodeContent>
      <FlowNodeOverlay>
        <FlowNodeActions>
          {/* Add action buttons here */}
        </FlowNodeActions>
        <FlowNodeFooter>
          <span>Footer content</span>
        </FlowNodeFooter>
      </FlowNodeOverlay>
    </FlowNode>
  );
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
  journeyStep: JourneyStepNode,
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

const stepMenuItems: { type: StepType; icon: typeof MessageCircle; label: string; category: string }[] = [
  { type: 'send-chat-message', icon: MessageCircle, label: 'Send Chat Message', category: 'Actions' },
  { type: 'send-email', icon: Mail, label: 'Send Email', category: 'Actions' },
  { type: 'send-sms', icon: Phone, label: 'Send SMS', category: 'Actions' },
  { type: 'create-ticket', icon: Ticket, label: 'Create Ticket', category: 'Actions' },
  { type: 'edit-custom-field', icon: PenLine, label: 'Edit Custom Field', category: 'Actions' },
  { type: 'condition', icon: GitBranch, label: 'Condition', category: 'Logic' },
  { type: 'delay', icon: Clock, label: 'Delay', category: 'Timing' },
];

export function JourneysPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNodeData, setEditingNodeData] = useState<JourneyStepNodeData | null>(null);

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [rightPanelWidth, setRightPanelWidth] = useState(320);
  const [stepUnlocked, setStepUnlocked] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds: Edge[]) => addEdge(params, eds)),
    [setEdges],
  );

  const addStepNode = useCallback(
    (stepType: StepType) => {
      const config = STEP_CONFIG[stepType];
      const newNode: Node<JourneyStepNodeData> = {
        id: `node-${Date.now()}`,
        type: 'journeyStep',
        position: { x: 250 + Math.random() * 100, y: 150 + nodes.length * 120 },
        data: {
          stepType,
          label: config.label,
          config: {},
          finished: 0,
          total: 0,
        },
      };
      setNodes((nds: Node[]) => [...nds, newNode]);

      // If this is a trigger node, unlock steps
      if (config.category === 'Trigger') {
        setStepUnlocked(true);
      }
    },
    [setNodes, nodes.length],
  );

  const handleSaveNodeConfig = useCallback(
    (nodeId: string, config: Record<string, any>) => {
      setNodes((nds: Node[]) =>
        nds.map((node: Node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, config } }
            : node
        )
      );
    },
    [setNodes],
  );

  const handleCopyNode = useCallback(
    (nodeId: string, data: JourneyStepNodeData) => {
      const originalNode = nodes.find((n: Node) => n.id === nodeId);
      if (!originalNode) return;

      const newNode: Node<JourneyStepNodeData> = {
        id: `node-${Date.now()}`,
        type: 'journeyStep',
        position: {
          x: originalNode.position.x + 50,
          y: originalNode.position.y + 50,
        },
        data: { ...data, config: { ...data.config } },
      };
      setNodes((nds: Node[]) => [...nds, newNode]);
    },
    [setNodes, nodes],
  );

  const handleDeleteNode = useCallback(
    (nodeId: string, data?: JourneyStepNodeData) => {
      setNodes((nds: Node[]) => nds.filter((node: Node) => node.id !== nodeId));
    },
    [setNodes],
  );

  useEffect(() => {
    const handleEditEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData }>) => {
      setEditingNodeId(e.detail.id);
      setEditingNodeData(e.detail.data);
      setDrawerOpen(true);
    };

    const handleCopyEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData }>) => {
      handleCopyNode(e.detail.id, e.detail.data);
    };

    const handleDeleteEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData }>) => {
      handleDeleteNode(e.detail.id, e.detail.data);
    };

    const handleSparkleEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData }>) => {
      setIsRightPanelOpen(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle delete if dialog is open or if focused on an input
      if (testDialogOpen || drawerOpen) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.repeat) {
        const selectedNodes = nodes.filter((node: Node) => node.selected);
        selectedNodes.forEach((node: Node) => {
          handleDeleteNode(node.id);
        });
      }
    };

    window.addEventListener('journey-step-edit', handleEditEvent as EventListener);
    window.addEventListener('journey-step-copy', handleCopyEvent as EventListener);
    window.addEventListener('journey-step-delete', handleDeleteEvent as EventListener);
    window.addEventListener('journey-step-sparkle', handleSparkleEvent as EventListener);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('journey-step-edit', handleEditEvent as EventListener);
      window.removeEventListener('journey-step-copy', handleCopyEvent as EventListener);
      window.removeEventListener('journey-step-delete', handleDeleteEvent as EventListener);
      window.removeEventListener('journey-step-sparkle', handleSparkleEvent as EventListener);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleCopyNode, handleDeleteNode, nodes, testDialogOpen, drawerOpen]);

  const actionItems = stepMenuItems.filter((item) => item.category === 'Actions');
  const logicItems = stepMenuItems.filter((item) => item.category === 'Logic');
  const timingItems = stepMenuItems.filter((item) => item.category === 'Timing');

  // Check if there's a trigger node on the canvas
  const hasTriggerOnCanvas = nodes.some((node: Node) => {
    const nodeData = node.data as JourneyStepNodeData;
    if (nodeData?.stepType) {
      const config = STEP_CONFIG[nodeData.stepType];
      return config.category === 'Trigger';
    }
    return false;
  });

  const rightPanelContent = (
    <div className="h-full flex flex-col">
      <div className="h-[52px] flex items-center px-4 border-b">
        <h2 className="text-lg font-semibold">Ask AI and Suggestions</h2>
      </div>
      <div className="flex-1 p-4">
        <p className="text-sm text-muted-foreground">Right panel content goes here.</p>
      </div>
    </div>
  );

  return (
    <AppLayout
      sidebar={{
        className: 'bg-[#FFFFFF]',
        isRightPanelOpen,
        onToggleRightPanel: () => setIsRightPanelOpen(!isRightPanelOpen),
        activePage: 'journeys',
      }}
      rightPanel={rightPanelContent}
      isRightPanelOpen={isRightPanelOpen}
      rightPanelWidth={rightPanelWidth}
      onRightPanelResize={setRightPanelWidth}
    >
      <div className="h-screen w-full relative">
        <div className="absolute top-6 right-6 z-10">
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" leftIcon={<Zap className="w-4 h-4" />} disabled={hasTriggerOnCanvas}>
                  Trigger
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem onClick={() => addStepNode('patient-added')}>
                  Patient added to database
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addStepNode('email-received')}>
                  Email received
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addStepNode('appointment-scheduled')}>
                  Appointment scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addStepNode('form-submitted')}>
                  Form submitted
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />} disabled={!stepUnlocked}>
                  Step
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {actionItems.map((item) => (
                  <DropdownMenuItem
                    key={item.type}
                    onClick={() => addStepNode(item.type)}
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Logic</DropdownMenuLabel>
                {logicItems.map((item) => (
                  <DropdownMenuItem
                    key={item.type}
                    onClick={() => addStepNode(item.type)}
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Timing</DropdownMenuLabel>
                {timingItems.map((item) => (
                  <DropdownMenuItem
                    key={item.type}
                    onClick={() => addStepNode(item.type)}
                    className="gap-2"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />}>
              Note
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" leftIcon={<ChevronDown className="w-4 h-4" />} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="gap-2">
                  <Grid2X2 className="w-4 h-4" />
                  Canvas
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => setTestDialogOpen(true)}>
                  <Play className="w-4 h-4" />
                  Test workflow
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        </div>

        <div className="h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              style: { strokeWidth: 2, strokeDasharray: '5, 5' },
            }}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      <StepSettingsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        nodeId={editingNodeId}
        data={editingNodeData}
        onSave={handleSaveNodeConfig}
        rightOffset={isRightPanelOpen ? rightPanelWidth : 0}
      />

      <TestRoutesDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
        nodes={nodes}
        edges={edges}
      />
    </AppLayout>
  );
}
