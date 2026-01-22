import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Dialog({ open, onClose, title, description, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close dialog"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Original_DialogExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsOpen(false);
    setFormData({ name: '', email: '' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dialog Component Example
        </h1>
        
        <Button onClick={() => setIsOpen(true)}>
          Open Dialog
        </Button>

        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Create New User"
          description="Add a new user to your organization. Fill in the required information below."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                required
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create User
              </Button>
            </div>
          </form>
        </Dialog>
      </div>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769062946.972769" />
      <div style={{ marginTop: '40px' }}>
        <Original_DialogExample {...props} />
      </div>
    </>
  );
}