import { useCallback, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from '@/components/molecules/prompt-input';
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
  type AttachmentData,
} from '@/components/molecules/attachments';
import { PlusIcon, ArrowUpIcon } from 'lucide-react';

export {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
};

export type { AttachmentData };

interface ChatInputProps {
  attachments?: AttachmentData[];
  onAttachmentsChange?: (attachments: AttachmentData[]) => void;
}

export function ChatInput({ attachments: externalAttachments, onAttachmentsChange }: ChatInputProps = {}) {
  const [value, setValue] = useState('');
  const [internalAttachments, setInternalAttachments] = useState<AttachmentData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const attachments = externalAttachments ?? internalAttachments;
  const setAttachments = onAttachmentsChange ?? setInternalAttachments;

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newAttachments: AttachmentData[] = files.map((file) => ({
      id: nanoid(),
      type: 'file' as const,
      filename: file.name,
      mediaType: file.type || 'application/octet-stream',
      url: URL.createObjectURL(file),
    }));
    setAttachments([...attachments, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [attachments, setAttachments]);

  const handleRemoveAttachment = useCallback((id: string) => {
    setAttachments(attachments.filter((a) => (a as any).id !== id));
  }, [attachments, setAttachments]);

  return (
    <PromptInput
      onSubmit={(message) => {
        console.log('Submit:', message.text);
        setValue('');
      }}
    >
      <PromptInputBody>
        {attachments.length > 0 && (
          <div className="px-2 pt-2">
            <Attachments variant="inline">
              {attachments.map((attachment) => (
                <Attachment
                  key={(attachment as any).id}
                  data={attachment}
                  onRemove={() => handleRemoveAttachment((attachment as any).id)}
                >
                  <AttachmentPreview />
                  <AttachmentRemove />
                </Attachment>
              ))}
            </Attachments>
          </div>
        )}
        <PromptInputTextarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask AI anything..."
          className="min-h-[128px] max-h-[400px]"
        />
      </PromptInputBody>
      <PromptInputFooter>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <PromptInputTools>
          <PromptInputButton
            onClick={() => fileInputRef.current?.click()}
            tooltip="Add files"
          >
            <PlusIcon className="size-4" />
          </PromptInputButton>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={!value.trim()}
          variant="ghost"
          className={value.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}
        >
          <ArrowUpIcon className="size-4" />
        </PromptInputSubmit>
      </PromptInputFooter>
    </PromptInput>
  );
}
