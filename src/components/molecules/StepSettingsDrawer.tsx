import { useState, useEffect } from 'react';
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
import { STEP_CONFIG, type JourneyStepNodeData, type StepField } from './JourneyStepNode';

interface StepSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string | null;
  data: JourneyStepNodeData | null;
  onSave: (nodeId: string, config: Record<string, any>) => void;
}

export function StepSettingsDrawer({
  open,
  onOpenChange,
  nodeId,
  data,
  onSave,
}: StepSettingsDrawerProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  useEffect(() => {
    if (data?.config) {
      setFormValues(data.config);
    } else {
      setFormValues({});
    }
  }, [data]);

  if (!data) return null;

  const config = STEP_CONFIG[data.stepType];
  const Icon = config.icon;

  const handleFieldChange = (key: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (nodeId) {
      onSave(nodeId, formValues);
    }
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-center gap-3">
            <div className={config.color}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <DrawerTitle>{data.label || config.label}</DrawerTitle>
              <DrawerDescription>Configure {config.category.toLowerCase()} settings</DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {config.fields.map((field) => (
            <FieldRenderer
              key={field.key}
              field={field as StepField}
              value={formValues[field.key] ?? ''}
              onChange={(value) => handleFieldChange(field.key, value)}
            />
          ))}
        </div>

        <DrawerFooter>
          <Button onClick={handleSave}>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface FieldRendererProps {
  field: StepField;
  value: any;
  onChange: (value: any) => void;
}

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  const baseInputClass =
    'w-full px-3 py-2 text-sm border border-border rounded-[8px] bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1';

  switch (field.type) {
    case 'text':
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} min-h-[100px] resize-none`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={baseInputClass}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
          >
            <option value="">Select {field.label.toLowerCase()}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    default:
      return null;
  }
}
