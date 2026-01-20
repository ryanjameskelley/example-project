import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Plus, Building2 } from 'lucide-react';

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
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedOrg?.avatarUrl} alt={selectedOrg?.name} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {selectedOrg ? getInitials(selectedOrg.name) : 'ORG'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Current Organization
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedOrg?.name}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">{selectedOrg?.role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Organization List */}
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Organizations</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Organization</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
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
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setNewOrgName('');
                      }}
                      disabled={isAdding}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddOrganization}
                      disabled={!newOrgName.trim() || isAdding}
                      className="rounded-xl"
                    >
                      {isAdding ? 'Adding...' : 'Add Organization'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={org.avatarUrl} alt={org.name} />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {getInitials(org.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-900">{org.name}</p>
                      {selectedOrgId === org.id && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs rounded-full">
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

        {/* Empty State */}
        {organizations.length === 0 && (
          <Card className="border-dashed rounded-2xl">
            <CardContent className="p-12 text-center">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No organizations yet</p>
              <Button onClick={() => setIsDialogOpen(true)} className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Organization
              </Button>
            </CardContent>
          </Card>
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