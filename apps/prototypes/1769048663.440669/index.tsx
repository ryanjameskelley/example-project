import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Badge } from '@/components/atoms/badge';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  avatarUrl?: string;
  department: string;
  jobTitle: string;
  joinedAt: Date;
  status: 'active' | 'inactive' | 'pending';
}

const Table = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-50">{children}</thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
);

const TableRow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <tr className={`hover:bg-gray-50 transition-colors ${className}`}>{children}</tr>
);

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>{children}</td>
);

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 's.chen@example.com',
    role: 'admin',
    department: 'Engineering',
    jobTitle: 'Engineering Manager',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    joinedAt: new Date('2024-01-15'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'm.johnson@example.com',
    role: 'manager',
    department: 'Product',
    jobTitle: 'Product Manager',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    joinedAt: new Date('2024-03-20'),
    status: 'active'
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'e.davis@example.com',
    role: 'member',
    department: 'Design',
    jobTitle: 'Senior Designer',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    joinedAt: new Date('2024-06-10'),
    status: 'inactive'
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'j.wilson@example.com',
    role: 'member',
    department: 'Engineering',
    jobTitle: 'Senior Engineer',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    joinedAt: new Date('2024-07-22'),
    status: 'active'
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    email: 'o.martinez@example.com',
    role: 'viewer',
    department: 'Marketing',
    jobTitle: 'Marketing Analyst',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    joinedAt: new Date('2024-09-05'),
    status: 'pending'
  }
];

type SortField = 'name' | 'email' | 'department' | 'role' | 'joinedAt';
type SortDirection = 'asc' | 'desc';

function Original_UserDataTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedUsers = sampleUsers
    .filter((user) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'joinedAt') {
        return (a.joinedAt.getTime() - b.joinedAt.getTime()) * modifier;
      }
      return a[sortField].localeCompare(b[sortField]) * modifier;
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block ml-1" />
    );
  };

  const getStatusBadgeVariant = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getRoleBadgeColor = (role: User['role']) => {
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and view all team members
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Add Member
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredAndSortedUsers.length} of {sampleUsers.length} members
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          {filteredAndSortedUsers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-sm">No members found matching your criteria</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Member
                      <SortIcon field="name" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('email')}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Email
                      <SortIcon field="email" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('department')}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Department
                      <SortIcon field="department" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('role')}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Role
                      <SortIcon field="role" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort('joinedAt')}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      Joined
                      <SortIcon field="joinedAt" />
                    </button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.jobTitle}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell className="text-gray-600">{user.department}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.joinedAt.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          Edit
                        </button>
                        <button className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors">
                          Remove
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769048663.440669" />
      <div style={{ marginTop: '40px' }}>
        <Original_UserDataTable {...props} />
      </div>
    </>
  );
}