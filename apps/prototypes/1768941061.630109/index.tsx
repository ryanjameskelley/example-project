import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Building2, Plus, Users } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  memberCount: number;
  isActive: boolean;
}

function OriginalComponent() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      logoUrl: 'https://i.pravatar.cc/150?img=10',
      role: 'admin',
      memberCount: 24,
      isActive: true,
    },
    {
      id: '2',
      name: 'TechStart Inc.',
      logoUrl: 'https://i.pravatar.cc/150?img=11',
      role: 'member',
      memberCount: 8,
      isActive: false,
    },
    {
      id: '3',
      name: 'Design Studio Pro',
      logoUrl: 'https://i.pravatar.cc/150?img=12',
      role: 'manager',
      memberCount: 15,
      isActive: false,
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');

  const handleSwitchOrg = (orgId: string) => {
    setOrganizations(orgs =>
      orgs.map(org => ({
        ...org,
        isActive: org.id === orgId,
      }))
    );
  };

  const handleAddOrganization = () => {
    if (!newOrgName.trim()) return;

    const newOrg: Organization = {
      id: Date.now().toString(),
      name: newOrgName,
      role: 'member',
      memberCount: 1,
      isActive: false,
    };

    setOrganizations([...organizations, newOrg]);
    setNewOrgName('');
    setIsAddDialogOpen(false);
  };

  const activeOrg = organizations.find(org => org.isActive);

  const getRoleColor = (role: Organization['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Switch Organization</h1>
          <p className="text-sm text-gray-600 mt-2">
            Select an organization to switch your current workspace
          </p>
        </div>

        {/* Current Organization */}
        {activeOrg && (
          <Card className="border-2 border-blue-600 rounded-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    {activeOrg.logoUrl ? (
                      <AvatarImage src={activeOrg.logoUrl} alt={activeOrg.name} />
                    ) : (
                      <AvatarFallback className="bg-blue-600 text-white">
                        <Building2 className="w-6 h-6" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {activeOrg.name}
                      <Badge variant="default" className="bg-blue-600 rounded-full">
                        Current
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <Badge variant="outline" className={`${getRoleColor(activeOrg.role)} rounded-full`}>
                        {activeOrg.role}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs">
                        <Users className="w-3 h-3" />
                        {activeOrg.memberCount} members
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Check className="w-6 h-6 text-blue-600" />
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Other Organizations */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Organizations</h2>
          <div className="space-y-3">
            {organizations
              .filter(org => !org.isActive)
              .map(org => (
                <Card
                  key={org.id}
                  className="cursor-pointer hover:border-blue-300 transition-colors rounded-2xl"
                  onClick={() => handleSwitchOrg(org.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          {org.logoUrl ? (
                            <AvatarImage src={org.logoUrl} alt={org.name} />
                          ) : (
                            <AvatarFallback className="bg-gray-200">
                              <Building2 className="w-6 h-6 text-gray-600" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{org.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <Badge variant="outline" className={`${getRoleColor(org.role)} rounded-full`}>
                              {org.role}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Users className="w-3 h-3" />
                              {org.memberCount} members
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">
                        Switch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Add Organization Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Card className="border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition-colors rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-3 text-gray-600">
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Add Organization</span>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Organization</DialogTitle>
              <DialogDescription>
                Enter the name of the organization you want to add
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="org-name" className="text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <Input
                  id="org-name"
                  placeholder="e.g., My Company Inc."
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddOrganization();
                    }
                  }}
                  className="rounded-lg"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewOrgName('');
                  }}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddOrganization}
                  disabled={!newOrgName.trim()}
                  className="rounded-full"
                >
                  Add Organization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1768941061.630109" />
      <div style={{ marginTop: '40px' }}>
        <OriginalComponent {...props} />
      </div>
    </>
  );
}