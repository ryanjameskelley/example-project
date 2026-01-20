import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check, Building2, Plus, Users, X } from 'lucide-react';

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
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {activeOrg.logoUrl ? (
                      <img src={activeOrg.logoUrl} alt={activeOrg.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {activeOrg.name}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white">
                        Current
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(activeOrg.role)}`}>
                        {activeOrg.role}
                      </span>
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
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                          {org.logoUrl ? (
                            <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building2 className="w-6 h-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{org.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(org.role)}`}>
                              {org.role}
                            </span>
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
        <Card 
          className="border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-400 transition-colors rounded-2xl"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Organization</span>
            </div>
          </CardContent>
        </Card>

        {/* Add Organization Dialog */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Add Organization</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewOrgName('');
                  }}
                  className="p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Enter the name of the organization you want to add
              </p>
              <div className="space-y-4">
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
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1768941061.630109" />
      <div style={{ marginTop: '40px' }}>
        <OriginalComponent {...props} />
      </div>
    </>
  );
}