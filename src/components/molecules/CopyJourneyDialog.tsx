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
import { Checkbox } from '@/components/atoms/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { Alert, AlertDescription } from '@/components/atoms/Alert';
import { AlertTriangle } from 'lucide-react';

interface CopyJourneyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopy?: (data: {
    name: string;
    copyToDifferentAccount: boolean;
    destinationEnvironment?: string;
    destinationApiKey?: string;
  }) => void;
}

export function CopyJourneyDialog({ open, onOpenChange, onCopy }: CopyJourneyDialogProps) {
  const [name, setName] = useState('');
  const [copyToDifferentAccount, setCopyToDifferentAccount] = useState(false);
  const [destinationEnvironment, setDestinationEnvironment] = useState('');
  const [destinationApiKey, setDestinationApiKey] = useState('');

  const handleCopy = () => {
    onCopy?.({
      name,
      copyToDifferentAccount,
      destinationEnvironment: copyToDifferentAccount ? destinationEnvironment : undefined,
      destinationApiKey: copyToDifferentAccount ? destinationApiKey : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Copy Journey</DialogTitle>
        </DialogHeader>

        <DialogClose />

        <div className="px-4 pb-4 space-y-4">
          <Field label="Copy name">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter copy name"
              className="w-full h-8 rounded-[10px] border border-[#E5E5E5] bg-white px-3.5 text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#EEEEEE]"
            />
          </Field>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={copyToDifferentAccount}
              onCheckedChange={(checked) => setCopyToDifferentAccount(checked as boolean)}
            />
            <label className="text-sm font-medium cursor-pointer" onClick={() => setCopyToDifferentAccount(!copyToDifferentAccount)}>
              Copy to a different account/environment
            </label>
          </div>

          {copyToDifferentAccount && (
            <>
              <Alert variant="action">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please make sure to update message templates, senders, default ticket assignees, and other related data in the new environment after copying
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">Destination environment</label>
                <Select value={destinationEnvironment} onValueChange={setDestinationEnvironment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Field label="Destination API key">
                <input
                  type="password"
                  value={destinationApiKey}
                  onChange={(e) => setDestinationApiKey(e.target.value)}
                  placeholder="Enter API key"
                  className="w-full h-8 rounded-[10px] border border-[#E5E5E5] bg-white px-3.5 text-sm font-geist focus:outline-none focus:ring-2 focus:ring-[#EEEEEE]"
                />
              </Field>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCopy}>
            Create copy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
