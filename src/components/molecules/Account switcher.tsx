import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Card, CardContent } from '@/components/molecules/card';
import { Input } from '@/components/atoms/input';
import { Check, ChevronDown, Plus, X } from 'lucide-react';

export interface Organization {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'member';
  logoUrl?: string;
  memberCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  currentOrganization: Organization;
  organizations: Organization[];
}

export const Badge = ({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline';
}) => {
  const variants = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 text-gray-800',
    outline: 'bg-white text-gray-600 border border-gray-300'
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const Avatar = ({ 
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

export const AccountSwitcher = ({
  user,
  onSwitchOrganization,
  onAddOrganization
}: {
  user: User;
  onSwitchOrganization: (org: Organization) => void;
  onAddOrganization: (name: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');

  const handleSwitchOrganization = (org: Organization) => {
    onSwitchOrganization(org);
    setIsOpen(false);
  };

  const handleAddOrganization = () => {
    if (!newOrgName.trim()) return;

    onAddOrganization(newOrgName.trim());
    setNewOrgName('');
    setIsAddingOrg(false);
    setIsOpen(false);
  };

  const getRoleBadgeVariant = (role: string): 'default' | 'secondary' | 'outline' => {
    switch (role) {
      case 'manager':
        return 'default';
      case 'admin':
        return 'outline';
      case 'member':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-between h-auto p-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-3">
            <Avatar 
              name={user.currentOrganization.name} 
              imageUrl={user.currentOrganization.logoUrl}
            />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">
                {user.currentOrganization.name}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={getRoleBadgeVariant(user.currentOrganization.role)}>
                  {user.currentOrganization.role}
                </Badge>
                <span className="text-xs text-gray-500">
                  {user.currentOrganization.memberCount} members
                </span>
              </div>
            </div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        {isOpen && (
          <Card>
            <CardContent className="p-2">
              <div className="space-y-1">
                {user.organizations.map((org) => {
                  const isCurrent = org.id === user.currentOrganization.id;
                  
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
                
                {isAddingOrg ? (
                  <div className="p-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Organization name"
                        value={newOrgName}
                        onChange={(e) => setNewOrgName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddOrganization();
                          } else if (e.key === 'Escape') {
                            setIsAddingOrg(false);
                            setNewOrgName('');
                          }
                        }}
                        autoFocus
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAddOrganization}
                        disabled={!newOrgName.trim()}
                        className="h-10 w-10 p-0"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddingOrg(false);
                          setNewOrgName('');
                        }}
                        className="h-10 w-10 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingOrg(true)}
                    className="w-full flex items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-blue-600">
                      + Add Organization
                    </span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};