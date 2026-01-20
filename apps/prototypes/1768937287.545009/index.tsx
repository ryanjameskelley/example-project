import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Building2, ChevronDown, Plus, Check } from 'lucide-react';

interface Organization {
  id: string;
  name: string;
  logo?: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  memberCount: number;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
}

function OriginalComponent() {
  const [organizations] = useState<Organization[]>([
    {
      id: '1',
      name: 'Acme Corporation',
      logo: 'https://i.pravatar.cc/150?img=50',
      role: 'admin',
      memberCount: 24,
      plan: 'enterprise',
    },
    {
      id: '2',
      name: 'TechStart Inc',
      logo: 'https://i.pravatar.cc/150?img=51',
      role: 'member',
      memberCount: 8,
      plan: 'professional',
    },
    {
      id: '3',
      name: 'Design Studio',
      logo: 'https://i.pravatar.cc/150?img=52',
      role: 'manager',
      memberCount: 12,
      plan: 'starter',
    },
  ]);

  const [currentOrg, setCurrentOrg] = useState<Organization>(organizations[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSwitchOrg = (org: Organization) => {
    setCurrentOrg(org);
    setIsOpen(false);
  };

  const handleAddOrganization = () => {
    if (!newOrgName.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setNewOrgName('');
      setIsAddDialogOpen(false);
      // In a real app, this would trigger a join request or search
    }, 1000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Switching</h1>
        <p className="text-sm text-gray-600">
          Switch between organizations or join a new one
        </p>
      </div>

      {/* Current Organization Display */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={currentOrg.logo} />
                <AvatarFallback>
                  <Building2 className="w-6 h-6 text-gray-400" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Current Organization
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {currentOrg.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {currentOrg.role}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {currentOrg.memberCount} members
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2"
            >
              Switch
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Organization Switcher */}
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Switch Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSwitchOrg(org)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={org.logo} />
                    <AvatarFallback>
                      <Building2 className="w-5 h-5 text-gray-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{org.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {org.role}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {org.memberCount} members
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400 capitalize">
                        {org.plan}
                      </span>
                    </div>
                  </div>
                </div>
                {currentOrg.id === org.id && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))}

            {/* Add Organization Button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 p-4 mt-4 border-dashed"
                >
                  <Plus className="w-4 h-4" />
                  Join Another Organization
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join an Organization</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <label
                      htmlFor="org-name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Organization Name
                    </label>
                    <Input
                      id="org-name"
                      type="text"
                      placeholder="Enter organization name"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddOrganization();
                        }
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Enter the exact name of the organization you want to join
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setNewOrgName('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddOrganization}
                      disabled={!newOrgName.trim() || isSearching}
                      className="flex-1"
                    >
                      {isSearching ? 'Searching...' : 'Request to Join'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1768937287.545009" />
      <div style={{ marginTop: '40px' }}>
        <OriginalComponent {...props} />
      </div>
    </>
  );
}