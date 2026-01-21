import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown } from 'lucide-react';

// Inline Badge component since it's not in the allowed imports
const Badge = ({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline';
}) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'bg-white text-gray-600 border border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Inline Avatar component
const Avatar = ({ 
  name, 
  imageUrl 
}: { 
  name: string; 
  imageUrl?: string;
}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-sm font-medium text-gray-600">{initials}</span>
      )}
    </div>
  );
};

interface Organization {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  logoUrl?: string;
  memberCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currentOrganization: Organization;
  organizations: Organization[];
}

function Original_AccountSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [currentUser, setCurrentUser] = useState<User>({
    id: '1',
    name: 'Sarah Chen',
    email: 's.chen@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    currentOrganization: {
      id: 'org-1',
      name: 'Acme Corp',
      role: 'admin',
      logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=acme',
      memberCount: 24
    },
    organizations: [
      {
        id: 'org-1',
        name: 'Acme Corp',
        role: 'admin',
        logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=acme',
        memberCount: 24
      },
      {
        id: 'org-2',
        name: 'TechStart Inc',
        role: 'manager',
        logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=techstart',
        memberCount: 12
      },
      {
        id: 'org-3',
        name: 'Design Studio',
        role: 'member',
        logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
        memberCount: 8
      },
      {
        id: 'org-4',
        name: 'Consulting Group',
        role: 'viewer',
        logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=consulting',
        memberCount: 35
      }
    ]
  });

  const handleSwitchOrganization = (org: Organization) => {
    setCurrentUser({
      ...currentUser,
      currentOrganization: org
    });
    setIsOpen(false);
  };

  const handleAddOrganization = () => {
    if (!newOrgName.trim()) return;

    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      name: newOrgName.trim(),
      role: 'admin',
      logoUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${newOrgName.toLowerCase().replace(/\s+/g, '')}`,
      memberCount: 1
    };

    setCurrentUser({
      ...currentUser,
      organizations: [...currentUser.organizations, newOrg],
      currentOrganization: newOrg
    });

    setNewOrgName('');
    setIsDialogOpen(false);
  };

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'outline' => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'manager':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        {/* Account Switcher Button */}
        <Button
          variant="outline"
          className="w-full justify-between h-auto p-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-3">
            <Avatar 
              name={currentUser.currentOrganization.name} 
              imageUrl={currentUser.currentOrganization.logoUrl}
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {currentUser.currentOrganization.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={getRoleBadgeVariant(currentUser.currentOrganization.role)}>
                  {currentUser.currentOrganization.role}
                </Badge>
                <span className="text-xs text-gray-500">
                  {currentUser.currentOrganization.memberCount} members
                </span>
              </div>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        {/* Organizations List */}
        {isOpen && (
          <Card>
            <CardContent className="p-2">
              <div className="space-y-1">
                {currentUser.organizations.map((org) => {
                  const isCurrent = org.id === currentUser.currentOrganization.id;
                  
                  return (
                    <button
                      key={org.id}
                      onClick={() => handleSwitchOrganization(org)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isCurrent
                          ? 'bg-blue-50 hover:bg-blue-100'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar name={org.name} imageUrl={org.logoUrl} />
                        <div className="text-left">
                          <p className={`text-sm font-medium ${
                            isCurrent ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {org.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={getRoleBadgeVariant(org.role)}>
                              {org.role}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {org.memberCount} members
                            </span>
                          </div>
                        </div>
                      </div>
                      {isCurrent && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Organization Button */}
        <Button 
          variant="ghost" 
          className="w-full"
          onClick={() => setIsDialogOpen(true)}
        >
          Add Organization
        </Button>
      </div>

      {/* Add Organization Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Organization</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label htmlFor="org-name" className="text-sm font-medium text-gray-700 block mb-2">
              Organization Name
            </label>
            <Input
              id="org-name"
              placeholder="Enter organization name"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddOrganization();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddOrganization}
              disabled={!newOrgName.trim()}
            >
              Add Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769024558.257939" />
      <div style={{ marginTop: '40px' }}>
        <Original_AccountSwitcher {...props} />
      </div>
    </>
  );
}