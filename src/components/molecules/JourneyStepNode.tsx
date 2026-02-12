import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import {
  MessageCircle, Mail, Phone, Ticket, PenLine, GitBranch, Clock,
  MessageCircleMore, MailOpen, PhoneCall, TicketCheck, PenSquare, GitMerge, Timer,
  UserRoundPlus, Copy, Terminal, Pencil, Zap, Calendar, FileText, Database, Trash2, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/atoms/Button';

export const STEP_CONFIG = {
  'send-chat-message': {
    label: 'Send Chat Message',
    category: 'Action',
    icon: MessageCircle,
    hoverIcon: MessageCircleMore,
    color: 'text-blue-500',
    fields: [
      { key: 'message', label: 'Message', type: 'textarea', required: true },
      { key: 'channel', label: 'Channel', type: 'select', options: [
        { value: 'default', label: 'Default Channel' },
        { value: 'support', label: 'Support' },
        { value: 'sales', label: 'Sales' },
      ]},
    ],
  },
  'send-email': {
    label: 'Send Email',
    category: 'Action',
    icon: Mail,
    hoverIcon: MailOpen,
    color: 'text-green-500',
    fields: [
      { key: 'subject', label: 'Subject', type: 'text', required: true },
      { key: 'body', label: 'Body', type: 'textarea', required: true },
      { key: 'template', label: 'Template', type: 'select', options: [
        { value: 'welcome', label: 'Welcome Email' },
        { value: 'followup', label: 'Follow Up' },
        { value: 'custom', label: 'Custom' },
      ]},
    ],
  },
  'send-sms': {
    label: 'Send SMS',
    category: 'Action',
    icon: Phone,
    hoverIcon: PhoneCall,
    color: 'text-purple-500',
    fields: [
      { key: 'message', label: 'Message', type: 'textarea', required: true },
      { key: 'from', label: 'From Number', type: 'select', options: [
        { value: '+1234567890', label: '+1 (234) 567-890' },
        { value: '+0987654321', label: '+0 (987) 654-321' },
      ]},
    ],
  },
  'create-ticket': {
    label: 'Create Ticket',
    category: 'Action',
    icon: Ticket,
    hoverIcon: TicketCheck,
    color: 'text-orange-500',
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'priority', label: 'Priority', type: 'select', options: [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
      ]},
    ],
  },
  'edit-custom-field': {
    label: 'Edit Custom Field',
    category: 'Action',
    icon: PenLine,
    hoverIcon: PenSquare,
    color: 'text-cyan-500',
    fields: [
      { key: 'field', label: 'Field', type: 'select', required: true, options: [
        { value: 'status', label: 'Status' },
        { value: 'tags', label: 'Tags' },
        { value: 'score', label: 'Score' },
      ]},
      { key: 'value', label: 'Value', type: 'text', required: true },
    ],
  },
  'condition': {
    label: 'Condition',
    category: 'Logic',
    icon: GitBranch,
    hoverIcon: GitMerge,
    color: 'text-yellow-500',
    fields: [
      { key: 'field', label: 'If Field', type: 'select', required: true, options: [
        { value: 'email', label: 'Email' },
        { value: 'status', label: 'Status' },
        { value: 'score', label: 'Score' },
      ]},
      { key: 'operator', label: 'Operator', type: 'select', required: true, options: [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'greater_than', label: 'Greater Than' },
        { value: 'less_than', label: 'Less Than' },
      ]},
      { key: 'value', label: 'Value', type: 'text', required: true },
    ],
  },
  'delay': {
    label: 'Delay',
    category: 'Timing',
    icon: Clock,
    hoverIcon: Timer,
    color: 'text-slate-500',
    fields: [
      { key: 'duration', label: 'Duration', type: 'number', required: true },
      { key: 'unit', label: 'Unit', type: 'select', required: true, options: [
        { value: 'minutes', label: 'Minutes' },
        { value: 'hours', label: 'Hours' },
        { value: 'days', label: 'Days' },
      ]},
    ],
  },
  'patient-added': {
    label: 'Patient added to database',
    category: 'Trigger',
    icon: Database,
    hoverIcon: Database,
    color: 'text-indigo-500',
    fields: [],
  },
  'email-received': {
    label: 'Email received',
    category: 'Trigger',
    icon: Mail,
    hoverIcon: MailOpen,
    color: 'text-green-500',
    fields: [],
  },
  'appointment-scheduled': {
    label: 'Appointment scheduled',
    category: 'Trigger',
    icon: Calendar,
    hoverIcon: Calendar,
    color: 'text-pink-500',
    fields: [],
  },
  'form-submitted': {
    label: 'Form submitted',
    category: 'Trigger',
    icon: FileText,
    hoverIcon: FileText,
    color: 'text-teal-500',
    fields: [],
  },
} as const;

export type StepType = keyof typeof STEP_CONFIG;

export interface StepField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  required?: boolean;
  options?: { value: string; label: string }[];
}

export interface JourneyStepNodeData {
  stepType: StepType;
  label?: string;
  config?: Record<string, any>;
  finished?: number;
  total?: number;
  highlighted?: boolean;
}

interface JourneyStepNodeProps {
  id: string;
  data: JourneyStepNodeData;
  selected?: boolean;
}

export function JourneyStepNode({ id, data }: JourneyStepNodeProps) {
  const [hovered, setHovered] = useState(false);
  const config = STEP_CONFIG[data.stepType];
  const Icon = hovered ? config.hoverIcon : config.icon;
  const isTrigger = config.category === 'Trigger';

  const finished = data.finished ?? 0;
  const total = data.total ?? 0;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('journey-step-edit', { detail: { id, data } }));
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('journey-step-copy', { detail: { id, data } }));
  };

  const handleAddUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('journey-step-add-user', { detail: { id, data } }));
  };

  const handleTerminal = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('journey-step-terminal', { detail: { id, data } }));
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('journey-step-delete', { detail: { id, data } }));
  };

  const handleSparkle = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('journey-step-sparkle', { detail: { id, data } }));
  };

  return (
    <div
      className={cn(
        "group relative min-w-[328px] min-h-[80px] flex items-center gap-3 px-3 border rounded-[10px] transition-colors",
        data.highlighted
          ? "border-green-500 bg-green-50"
          : "border-border bg-background"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          "!w-3 !h-3 !-top-[7px] !z-10",
          data.highlighted ? "!bg-green-500" : "!bg-border"
        )}
      />

      <div className={cn("flex items-center justify-center", data.highlighted ? "text-green-600" : config.color)}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{config.category}</span>
        <span className="text-sm font-medium text-foreground">{data.label || config.label}</span>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-3 bg-background/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-[10px]">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1">
            <Button variant="ghost" onClick={handleAddUser} className="!h-9 !w-9 !p-0 text-[#0A0A0A] hover:!bg-[#F5F5F5]">
              <UserRoundPlus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={handleCopy} className="!h-9 !w-9 !p-0 text-[#0A0A0A] hover:!bg-[#F5F5F5]">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={handleTerminal} className="!h-9 !w-9 !p-0 text-[#0A0A0A] hover:!bg-[#F5F5F5]">
              <Terminal className="w-4 h-4" />
            </Button>
            <Button variant="ghost" onClick={handleEdit} className="!h-9 !w-9 !p-0 text-[#0A0A0A] hover:!bg-[#F5F5F5]">
              <Pencil className="w-4 h-4" />
            </Button>
          </div>
          {isTrigger && (
            <Button variant="ghost" onClick={handleSparkle} className="!h-9 !w-9 !p-0 text-[#0A0A0A] hover:!bg-[#F5F5F5]">
              <Sparkles className="w-4 h-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>finished: {finished}</span>
          <span>total: {total}</span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          "!w-3 !h-3 !-bottom-[7px] !z-10",
          data.highlighted ? "!bg-green-500" : "!bg-border"
        )}
      />
    </div>
  );
}
