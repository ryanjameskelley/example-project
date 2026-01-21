import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Organization {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  avatarUrl?: string;
  memberCount: number;
}

const sampleOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=acme',
    memberCount: 45,
  },
  {
    id: '2',
    name: 'Tech Startup Inc',
    role: 'manager',
    avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech',
    memberCount: 12,
  },
  {
    id: '3',
    name: 'Global Solutions Ltd',
    role: 'member',
    avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=global',
    memberCount: 128,
  },
  {
    id: '4',
    name: 'Creative Agency',
    role: 'viewer',
    avatarUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=creative',
    memberCount: 8,
  },
];

const RoleBadge = ({ role }: { role: string }) => {
  const variants = {
    admin: 'bg-blue-100 text-blue-800 border-blue-200',
    manager: 'bg-purple-100 text-purple-800 border-purple-200',
    member: 'bg-green-100 text-green-800 border-green-200',
    viewer: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
        variants[role as keyof typeof variants]
      }`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

function Original_OrganizationSwitcher() {
  const [currentOrg, setCurrentOrg] = useState<Organization>(sampleOrganizations[0]);
  const [open, setOpen] = useState(false);

  const handleSelectOrganization = (org: Organization) => {
    setCurrentOrg(org);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select organization"
          className="w-full justify-between px-3 py-2 h-auto"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={currentOrg.avatarUrl} alt={currentOrg.name} />
              <AvatarFallback>
                <Building2 className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-0">
              <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                {currentOrg.name}
              </span>
              <span className="text-xs text-gray-500">
                {currentOrg.memberCount} members
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-md">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Switch Organization
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-2">
          <div className="space-y-1">
            {sampleOrganizations.map((org) => (
              <button
                key={org.id}
                onClick={() => handleSelectOrganization(org)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 transition-colors text-left"
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={org.avatarUrl} alt={org.name} />
                  <AvatarFallback>
                    <Building2 className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {org.name}
                    </span>
                    <RoleBadge role={org.role} />
                  </div>
                  <span className="text-xs text-gray-500">
                    {org.memberCount} members
                  </span>
                </div>
                {currentOrg.id === org.id && (
                  <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769020541.660949" />
      <div style={{ marginTop: '40px' }}>
        <Original_OrganizationSwitcher {...props} />
      </div>
    </>
  );
}