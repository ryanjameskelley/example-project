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
import { AppSidebar } from '@/components/organisms/AppSidebar';
import {
  JourneyStepNode,
  STEP_CONFIG,
  type StepType,
  type JourneyStepNodeData,
} from '@/components/molecules/JourneyStepNode';
import { StepSettingsDrawer } from '@/components/molecules/StepSettingsDrawer';

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

const initialNodes: Node[] = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: 'Start' }, type: 'custom' },
];

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

  useEffect(() => {
    const handleEditEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData }>) => {
      setEditingNodeId(e.detail.id);
      setEditingNodeData(e.detail.data);
      setDrawerOpen(true);
    };

    const handleCopyEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData }>) => {
      handleCopyNode(e.detail.id, e.detail.data);
    };

    window.addEventListener('journey-step-edit', handleEditEvent as EventListener);
    window.addEventListener('journey-step-copy', handleCopyEvent as EventListener);

    return () => {
      window.removeEventListener('journey-step-edit', handleEditEvent as EventListener);
      window.removeEventListener('journey-step-copy', handleCopyEvent as EventListener);
    };
  }, [handleCopyNode]);

  const actionItems = stepMenuItems.filter((item) => item.category === 'Actions');
  const logicItems = stepMenuItems.filter((item) => item.category === 'Logic');
  const timingItems = stepMenuItems.filter((item) => item.category === 'Timing');

  return (
    <div className="h-screen w-full flex">
      <AppSidebar />

      <div className="flex-1 relative" style={{ marginLeft: '254px' }}>
        <div className="absolute top-6 right-6 z-10">
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />}>
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

            <Button variant="outline" leftIcon={<Grid2X2 className="w-4 h-4" />}>
              Canvas
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" leftIcon={<ChevronDown className="w-4 h-4" />} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Option 1</DropdownMenuItem>
                <DropdownMenuItem>Option 2</DropdownMenuItem>
                <DropdownMenuItem>Option 3</DropdownMenuItem>
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
      />
    </div>
  );
}
