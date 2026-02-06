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
import { Field } from '@/components/atoms/Field';
import { STEP_CONFIG, type JourneyStepNodeData, type StepField } from './JourneyStepNode';

interface StepSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeId: string | null;
  data: JourneyStepNodeData | null;
  onSave: (nodeId: string, config: Record<string, any>) => void;
  rightOffset?: number;
}

export function StepSettingsDrawer({
  open,
  onOpenChange,
  nodeId,
  data,
  onSave,
  rightOffset = 0,
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
      <DrawerContent rightOffset={rightOffset}>
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

const baseInputClass =
  'w-full h-8 rounded-[10px] border border-[#E5E5E5] bg-white px-3.5 text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#EEEEEE]';

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
      return (
        <Field label={field.label} required={field.required}>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseInputClass}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </Field>
      );

    case 'textarea':
      return (
        <Field label={field.label} required={field.required}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${baseInputClass} h-auto min-h-[100px] py-2 resize-none`}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </Field>
      );

    case 'number':
      return (
        <Field label={field.label} required={field.required}>
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={baseInputClass}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        </Field>
      );

    case 'select':
      return (
        <Field label={field.label} required={field.required}>
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
        </Field>
      );

    default:
      return null;
  }
}
