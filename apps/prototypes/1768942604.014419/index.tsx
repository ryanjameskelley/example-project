import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, Building2, ChevronDown } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  memberCount: number;
  avatarUrl?: string;
}

function OriginalComponent() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      role: 'admin',
      memberCount: 24,
      avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=acme',
    },
    {
      id: '2',
      name: 'Tech Innovators Inc',
      role: 'member',
      memberCount: 12,
      avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech',
    },
    {
      id: '3',
      name: 'Design Studio Pro',
      role: 'manager',
      memberCount: 8,
      avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
    },
  ]);

  const [selectedOrgId, setSelectedOrgId] = useState<string>('1');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showOrgList, setShowOrgList] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const selectedOrg = organizations.find((org) => org.id === selectedOrgId);

  const handleSelectOrganization = (orgId: string) => {
    setSelectedOrgId(orgId);
    setShowOrgList(false);
  };

  const handleAddOrganization = () => {
    if (!newOrgName.trim()) return;

    setIsAdding(true);

    setTimeout(() => {
      const newOrg: Organization = {
        id: Date.now().toString(),
        name: newOrgName,
        role: 'member',
        memberCount: 1,
        avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${newOrgName}`,
      };

      setOrganizations([...organizations, newOrg]);
      setSelectedOrgId(newOrg.id);
      setNewOrgName('');
      setIsDialogOpen(false);
      setIsAdding(false);
      setShowOrgList(false);
    }, 800);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'member':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Current Organization</h1>
          <p className="text-sm text-gray-600 mt-2">
            View or switch between your organizations
          </p>
        </div>

        {/* Current Organization Display */}
        <Card 
          className="cursor-pointer hover:bg-gray-50 transition-colors border-[#e5e5e5] bg-[#ffffff]"
          onClick={() => setShowOrgList(!showOrgList)}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {selectedOrg ? getInitials(selectedOrg.name) : 'ORG'}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Current Organization
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedOrg?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(selectedOrg?.role || 'member')}>
                  {selectedOrg?.role}
                </Badge>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${showOrgList ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization List */}
        {showOrgList && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Switch Organization</CardTitle>
                  <CardDescription>Select an organization to switch to</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrganization(org.id)}
                    className={`w-full px-6 py-4 flex items-center gap-4 transition-colors ${
                      selectedOrgId === org.id 
                        ? 'bg-gray-50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-semibold">
                      {getInitials(org.name)}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{org.name}</p>
                        {selectedOrgId === org.id && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={getRoleBadgeVariant(org.role)}>
                          {org.role}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {org.memberCount} member{org.memberCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <Building2 className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dialog Modal */}
        {isDialogOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => {
                setIsDialogOpen(false);
                setNewOrgName('');
              }}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
              <div 
                className="bg-white rounded-lg w-full max-w-md p-6 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-4 m-0 p-0">Add New Organization</h2>
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Organization Name
                  </label>
                  <Input
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
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setNewOrgName('');
                    }}
                    disabled={isAdding}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddOrganization}
                    disabled={!newOrgName.trim() || isAdding}
                  >
                    {isAdding ? 'Adding...' : 'Add Organization'}
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1768942604.014419" />
      <div style={{ marginTop: '40px' }}>
        <OriginalComponent {...props} />
      </div>
    </>
  );
}