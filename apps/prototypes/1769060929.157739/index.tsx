import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { X } from 'lucide-react';

// Inline Dialog components following shadcn design patterns
const DialogOverlay = ({ onClick }: { onClick: () => void }) => (
  <div 
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
    onClick={onClick}
  />
);

const DialogContent = ({ 
  children, 
  onClose 
}: { 
  children: React.ReactNode; 
  onClose: () => void;
}) => (
  <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
      {children}
    </div>
  </div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-0">
    {children}
  </div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-gray-900">
    {children}
  </h2>
);

const DialogDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-gray-600">
    {children}
  </p>
);

const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-0">
    {children}
  </div>
);

// Main component demonstrating the Dialog
function Original_DialogComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { name, email });
    setIsOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dialog Component</h1>
          <p className="text-sm text-gray-600 mt-2">
            A modal dialog component following shadcn design patterns
          </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setIsOpen(true)}>
            Open Dialog
          </Button>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Modal overlay with backdrop blur</li>
            <li>• Centered positioning</li>
            <li>• Close button with hover effect</li>
            <li>• Responsive design</li>
            <li>• Form submission example</li>
            <li>• Accessible with ARIA labels</li>
          </ul>
        </div>
      </div>

      {isOpen && (
        <>
          <DialogOverlay onClick={() => setIsOpen(false)} />
          <DialogContent onClose={() => setIsOpen(false)}>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="sm:mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </>
      )}
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769060929.157739" />
      <div style={{ marginTop: '40px' }}>
        <Original_DialogComponent {...props} />
      </div>
    </>
  );
}