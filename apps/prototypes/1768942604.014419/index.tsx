import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, Plus, Building2, X } from 'lucide-react';

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
  const [newOrgName, setNewOrgName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const selectedOrg = organizations.find((org) => org.id === selectedOrgId);

  const handleSelectOrganization = (orgId: string) => {
    setSelectedOrgId(orgId);
  };

  const handleAddOrganization = () => {
    if (!newOrgName.trim()) return;

    setIsAdding(true);

    // Simulate API call
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Switch Organization</h1>
          <p className="text-sm text-gray-600 mt-2">
            Select an organization to access its workspace
          </p>
        </div>

        {/* Current Organization Display */}
        <Card className="border-blue-200 bg-blue-50 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center">
                {selectedOrg?.avatarUrl ? (
                  <img 
                    src={selectedOrg.avatarUrl} 
                    alt={selectedOrg.name}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold">
                    {selectedOrg ? getInitials(selectedOrg.name) : 'ORG'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Current Organization
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedOrg?.name}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedOrg?.role || 'member')}`}>
                {selectedOrg?.role}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Organization List */}
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Organizations</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-full"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Organization
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200">
              {organizations.map((org) => (
                <button
                  key={org.id}
                  onClick={() => handleSelectOrganization(org.id)}
                  className={`w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors ${
                    selectedOrgId === org.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="h-10 w-10 rounded-2xl bg-gray-200 flex items-center justify-center">
                    {org.avatarUrl ? (
                      <img 
                        src={org.avatarUrl} 
                        alt={org.name}
                        className="h-10 w-10 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-gray-700 font-semibold text-sm">
                        {getInitials(org.name)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900">{org.name}</p>
                      {selectedOrgId === org.id && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(org.role)}`}>
                        {org.role}
                      </span>
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

        {/* Empty State */}
        {organizations.length === 0 && (
          <Card className="border-dashed rounded-2xl">
            <CardContent className="p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No organizations yet</p>
              <Button onClick={() => setIsDialogOpen(true)} className="rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Organization
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dialog Modal */}
        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Add New Organization</h2>
                <button
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewOrgName('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Organization Name
                  </label>
                  <Input
                    className="rounded-xl"
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
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setNewOrgName('');
                    }}
                    disabled={isAdding}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-full"
                    onClick={handleAddOrganization}
                    disabled={!newOrgName.trim() || isAdding}
                  >
                    {isAdding ? 'Adding...' : 'Add Organization'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
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