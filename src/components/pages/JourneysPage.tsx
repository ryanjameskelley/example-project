import { useCallback, useEffect, useRef, useState } from 'react';
import { ChatInput, type AttachmentData } from '@/components/molecules/ChatInput';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { Shimmer } from '@/components/atoms/Shimmer';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@/components/molecules/conversation';
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
  Copy,
  Route,
  SquarePen,
  MessageCircleDashed,
  Search,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/Dialog';
import { Item, ItemContent, ItemTitle, ItemDescription } from '@/components/molecules/Item';
import ScrollFade from '@/components/atoms/scroll-fade';
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
import { TestWorkflowDrawer } from '@/components/molecules/TestWorkflowDrawer';
import { EditJourneyDialog } from '@/components/molecules/dialogs/EditJourneyDialog';
import { CopyJourneyDialog } from '@/components/molecules/dialogs/CopyJourneyDialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/molecules/NoJourney';

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
  const [testDrawerOpen, setTestDrawerOpen] = useState(false);
  const [editJourneyDialogOpen, setEditJourneyDialogOpen] = useState(false);
  const [copyJourneyDialogOpen, setCopyJourneyDialogOpen] = useState(false);
  const [selectedTestNodeIds, setSelectedTestNodeIds] = useState<string[]>([]);
  const [selectedTestEdgeIds, setSelectedTestEdgeIds] = useState<string[]>([]);
  const [hasJourneys, setHasJourneys] = useState(false);
  const [aiMode, setAiMode] = useState<'none' | 'step' | 'journey'>('none');
  const [attachments, setAttachments] = useState<AttachmentData[]>([]);
  const [conversationsOpen, setConversationsOpen] = useState(false);
  const [conversationSearch, setConversationSearch] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const dragDepth = useRef(0);

  // Handlers that close other drawers when opening one
  const handleSetDrawerOpen = (open: boolean) => {
    if (open) {
      setTestDrawerOpen(false);
    }
    setDrawerOpen(open);

    // Ensure body pointer events are restored when closing
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = '';
      }, 100);
    }
  };

  const handleSetTestDrawerOpen = (open: boolean) => {
    if (open) {
      setDrawerOpen(false);
    }
    setTestDrawerOpen(open);

    // Ensure body pointer events are restored when closing
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
        // Force remove any vaul-specific attributes
        document.body.removeAttribute('data-vaul-drawer-visible');
        document.body.removeAttribute('vaul-drawer-visible');
      }, 150);
    }
  };

  const handlePanelDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current += 1;
    setIsDragOver(true);
  }, []);

  const handlePanelDragLeave = useCallback(() => {
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setIsDragOver(false);
    }
  }, []);

  const handlePanelDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handlePanelDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    const newAttachments: AttachmentData[] = files.map((file) => ({
      id: nanoid(),
      type: 'file' as const,
      filename: file.name,
      mediaType: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file),
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  const handleTestNodeStatusChange = useCallback(
    (nodeStatuses: Record<string, 'testing' | 'passed' | 'failed'>) => {
      setNodes((nds: Node[]) =>
        nds.map((node: Node) => ({
          ...node,
          data: {
            ...node.data,
            testStatus: nodeStatuses[node.id],
          },
        }))
      );
    },
    [setNodes]
  );

  const handleRouteSelectionChange = useCallback((nodeIds: string[], edgeIds: string[]) => {
    setSelectedTestNodeIds(nodeIds);
    setSelectedTestEdgeIds(edgeIds);

    // Update node styles
    setNodes((nds: Node[]) =>
      nds.map((node: Node) => {
        const isHighlighted = nodeIds.includes(node.id);
        const hasSelection = nodeIds.length > 0;
        return {
          ...node,
          style: {
            ...node.style,
            opacity: !hasSelection ? 1 : isHighlighted ? 1 : 0.3,
            pointerEvents: 'all',
          },
          data: {
            ...node.data,
            highlighted: isHighlighted,
          },
          draggable: true,
        };
      })
    );

    // Update edge styles
    setEdges((eds: Edge[]) =>
      eds.map((edge: Edge) => {
        const isHighlighted = edgeIds.includes(edge.id);
        const hasSelection = edgeIds.length > 0;
        return {
          ...edge,
          style: {
            strokeDasharray: '5, 5',
            stroke: isHighlighted ? '#22c55e' : '#94a3b8',
            strokeWidth: isHighlighted ? 3 : 2,
            opacity: !hasSelection ? 1 : isHighlighted ? 1 : 0.3,
          },
        };
      })
    );
  }, [setNodes, setEdges]);

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
      handleSetDrawerOpen(true);
    };

    const handleCopyEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData }>) => {
      handleCopyNode(e.detail.id, e.detail.data);
    };

    const handleDeleteEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData }>) => {
      handleDeleteNode(e.detail.id, e.detail.data);
    };

    const handleSparkleEvent = (e: CustomEvent<{ id: string; data: JourneyStepNodeData; isTrigger: boolean }>) => {
      setIsRightPanelOpen(true);
      setAiMode(e.detail.isTrigger ? 'journey' : 'step');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle delete if drawer is open or if focused on an input
      if (testDrawerOpen || drawerOpen) return;
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
  }, [handleCopyNode, handleDeleteNode, nodes, testDrawerOpen, drawerOpen]);

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
    <div
      className={cn(
        "h-full flex flex-col relative transition-colors duration-150",
        isDragOver && "bg-violet-500/[0.06]"
      )}
      onDragEnter={handlePanelDragEnter}
      onDragLeave={handlePanelDragLeave}
      onDragOver={handlePanelDragOver}
      onDrop={handlePanelDrop}
    >
      {/* Drag-over overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="absolute inset-0 ring-2 ring-inset ring-violet-500/40 rounded" />
          {/* Shimmer sweep over the violet background */}
          <div
            className="absolute inset-0 rounded animate-shimmer-sweep"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.12) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
          />
          <div className="flex flex-col items-center gap-3 rounded-xl px-10 py-7">
            <div className="p-3">
              <Plus className="size-7 text-violet-600/80" />
            </div>
            <Shimmer className="text-sm font-medium text-violet-600/90" duration={2.5} spread={2}>Drop files to attach</Shimmer>
          </div>
        </div>
      )}
      <div className="h-[52px] flex items-center justify-between px-4 border-b">
        <h2 className="text-lg font-semibold">Ask AI</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setAiMode('step')}
            title="New conversation"
          >
            <SquarePen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setConversationsOpen(true)}
            title="Previous conversations"
          >
            <MessageCircleDashed className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        <Conversation className="size-full">
          <ConversationContent>
            {aiMode === 'journey' ? (
              <ConversationEmptyState>
                <Shimmer className="text-sm text-center leading-relaxed" spread={1} duration={3}>Describe a journey or drop in some protocol documents to get started</Shimmer>
              </ConversationEmptyState>
            ) : aiMode === 'step' ? (
              <ConversationEmptyState>
                <Shimmer className="text-sm text-center leading-relaxed">How can I help?</Shimmer>
              </ConversationEmptyState>
            ) : (
              <ConversationEmptyState
                title="Ask AI"
                description="Start a conversation to get help building your journey."
              />
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
      <div className="px-3 pb-3">
        <ChatInput attachments={attachments} onAttachmentsChange={setAttachments} />
      </div>

      <Dialog open={conversationsOpen} onOpenChange={setConversationsOpen}>
        <DialogContent className="max-w-md flex flex-col max-h-[70vh]" onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Previous Conversations</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4 py-4 px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={conversationSearch}
                onChange={(e) => setConversationSearch(e.target.value)}
                className="flex h-8 w-full rounded-[10px] border border-input bg-background pl-9 pr-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eeeeee] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <ScrollFade axis="vertical" className="max-h-[420px]" fadeColor="white">
              <div className="space-y-1">
                {[
                  { id: '1', title: 'Onboarding journey for new patients', date: 'Today, 2:34 PM' },
                  { id: '2', title: 'Post-visit follow-up automation', date: 'Today, 11:12 AM' },
                  { id: '3', title: 'Medication reminder workflow', date: 'Yesterday, 4:50 PM' },
                  { id: '4', title: 'Lab results notification flow', date: 'Yesterday, 1:08 PM' },
                  { id: '5', title: 'Appointment scheduling journey', date: 'Feb 24, 10:22 AM' },
                  { id: '6', title: 'Care gap outreach campaign', date: 'Feb 23, 3:17 PM' },
                  { id: '7', title: 'Chronic condition management', date: 'Feb 22, 9:40 AM' },
                  { id: '8', title: 'Preventive care reminders', date: 'Feb 21, 2:05 PM' },
                ]
                  .filter((c) => c.title.toLowerCase().includes(conversationSearch.toLowerCase()))
                  .map((convo) => (
                    <Item
                      key={convo.id}
                      clickable
                      onClick={() => setConversationsOpen(false)}
                    >
                      <ItemContent>
                        <ItemTitle>{convo.title}</ItemTitle>
                        <ItemDescription>{convo.date}</ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
              </div>
            </ScrollFade>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConversationsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => { setAiMode('step'); setConversationsOpen(false); }}>
              New Conversation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <AppLayout
      sidebar={{
        className: 'bg-[#FFFFFF]',
        isRightPanelOpen,
        onToggleRightPanel: () => {
          if (!isRightPanelOpen) setAiMode('step');
          setIsRightPanelOpen(!isRightPanelOpen);
        },
        activePage: 'journeys',
      }}
      rightPanel={rightPanelContent}
      isRightPanelOpen={isRightPanelOpen}
      rightPanelWidth={rightPanelWidth}
      onRightPanelResize={setRightPanelWidth}
    >
      {!hasJourneys ? (
        <div className="h-screen w-full flex items-center justify-center pb-64 bg-white">
          <Empty>
            <div className="flex items-center justify-center w-8 h-8 rounded-[14px] bg-[#ffffff] text-muted-foreground mb-4">
              <Route className="w-4 h-4" />
            </div>
            <EmptyHeader>
              <EmptyContent>
                <EmptyTitle>No Journeys Yet</EmptyTitle>
                <EmptyDescription>
                  You haven't created any journeys yet. Get started by creating your first project.
                </EmptyDescription>
              </EmptyContent>
            </EmptyHeader>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setHasJourneys(true)}>
                Create Journey
              </Button>
              <Button onClick={() => { setHasJourneys(true); setIsRightPanelOpen(true); setAiMode('journey'); }}>
                Create Journey with AI
              </Button>
            </div>
          </Empty>
        </div>
      ) : (
      <div className="h-screen w-full relative">
        <div className="absolute top-2 left-2 right-2 z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="outline" className="!h-8">View all</Button>
            <span
              className="text-sm font-medium text-[#0E0E0E] cursor-pointer hover:underline"
              onClick={() => setEditJourneyDialogOpen(true)}
            >
              Journey J92834923499283748
            </span>
            <Button variant="ghost" className="!h-9 !w-9 !p-0" onClick={() => setCopyJourneyDialogOpen(true)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div>
          <ButtonGroup>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="!h-8" leftIcon={<Zap className="w-4 h-4" />} disabled={hasTriggerOnCanvas}>
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
                <Button variant="outline" className="!h-8" leftIcon={<Plus className="w-4 h-4" />} disabled={!stepUnlocked}>
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

            <Button variant="outline" className="!h-8" leftIcon={<Plus className="w-4 h-4" />}>
              Note
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="!h-8" leftIcon={<ChevronDown className="w-4 h-4" />} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="gap-2">
                  <Grid2X2 className="w-4 h-4" />
                  Canvas
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2" onClick={() => handleSetTestDrawerOpen(true)}>
                  <Play className="w-4 h-4" />
                  Test workflow
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
          </div>
        </div>

        <div className="h-full relative">
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
            minZoom={0.1}
            maxZoom={4}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
      )}

      <StepSettingsDrawer
        open={drawerOpen}
        onOpenChange={handleSetDrawerOpen}
        nodeId={editingNodeId}
        data={editingNodeData}
        onSave={handleSaveNodeConfig}
        rightOffset={isRightPanelOpen ? rightPanelWidth : 0}
      />

      <TestWorkflowDrawer
        open={testDrawerOpen}
        onOpenChange={handleSetTestDrawerOpen}
        nodes={nodes}
        edges={edges}
        rightOffset={isRightPanelOpen ? rightPanelWidth : 0}
        onRouteSelectionChange={handleRouteSelectionChange}
        onTestNodeStatusChange={handleTestNodeStatusChange}
      />

      <EditJourneyDialog
        open={editJourneyDialogOpen}
        onOpenChange={setEditJourneyDialogOpen}
        journeyTitle="Journey J92834923499283748"
        journeyDescription=""
      />

      <CopyJourneyDialog
        open={copyJourneyDialogOpen}
        onOpenChange={setCopyJourneyDialogOpen}
      />
    </AppLayout>
  );
}
