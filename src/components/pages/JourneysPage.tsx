import { useCallback } from 'react';
import ReactFlow, {
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  type Connection,
  type Edge,
  type NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Plus, Grid2X2, ChevronDown, ArrowLeft } from 'lucide-react';
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
} from '@/components/molecules/DropdownMenu';
import { AppSidebar } from '@/components/organisms/AppSidebar';

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
};

const initialNodes = [
  { id: '1', position: { x: 250, y: 5 }, data: { label: 'Start' }, type: 'custom' },
];

const initialEdges: Edge[] = [];

export function JourneysPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-screen w-full flex">
      {/* AppSidebar on the left */}
      <AppSidebar />

      {/* Main content area */}
      <div className="flex-1 relative" style={{ marginLeft: '254px' }}>
        {/* Button Group positioned at top right */}
        <div className="absolute top-6 right-6 z-10">
          <ButtonGroup>
            {/* Add Step Button with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />}>
                  Step
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Action Step</DropdownMenuItem>
                <DropdownMenuItem>Condition Step</DropdownMenuItem>
                <DropdownMenuItem>Loop Step</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Note Button */}
            <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />}>
              Note
            </Button>

            {/* Canvas Button */}
            <Button variant="outline" leftIcon={<Grid2X2 className="w-4 h-4" />}>
              Canvas
            </Button>

            {/* Dropdown Menu Button */}
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
    </div>
  );
}
