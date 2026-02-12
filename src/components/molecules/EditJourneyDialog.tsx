import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from './Dialog';
import { Button } from '@/components/atoms/Button';
import { Field } from '@/components/atoms/Field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';

interface EditJourneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journeyTitle?: string;
  journeyDescription?: string;
  onSave?: (data: { title: string; description: string; patientCommunication: string }) => void;
}

export function EditJourneyDialog({
  open,
  onOpenChange,
  journeyTitle = '',
  journeyDescription = '',
  onSave,
}: EditJourneyDialogProps) {
  const [title, setTitle] = useState(journeyTitle);
  const [description, setDescription] = useState(journeyDescription);
  const [patientCommunication, setPatientCommunication] = useState('create-ticket');

  const handleSave = () => {
    onSave?.({ title, description, patientCommunication });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Journey Info</DialogTitle>
        </DialogHeader>

        <DialogClose />

        <div className="px-4 pb-4 space-y-4">
          <Field label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Journey title"
              className="w-full h-8 rounded-[10px] border border-[#E5E5E5] bg-white px-3.5 text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#EEEEEE]"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Journey description"
              rows={4}
              className="w-full rounded-[10px] border border-[#E5E5E5] bg-white px-3.5 py-2 text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#EEEEEE] resize-none"
            />
          </Field>

          <div className="space-y-2">
            <label className="text-sm font-medium">On incoming patient communication</label>
            <Select value={patientCommunication} onValueChange={setPatientCommunication}>
              <SelectTrigger>
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="create-ticket">Create Ticket</SelectItem>
                <SelectItem value="send-email">Send Email</SelectItem>
                <SelectItem value="send-sms">Send SMS</SelectItem>
                <SelectItem value="do-nothing">Do Nothing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
