import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Edit, Trash2, Eye } from 'lucide-react';

// Inline Table components using the templates from system prompt
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
  <tr className={className}>{children}</tr>
);

const TableHead = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>{children}</td>
);

// Inline Badge component
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default}`}>
      {children}
    </span>
  );
};

// Inline Button component
const Button = ({ children, variant = 'default', size = 'md', onClick, className = '' }: { 
  children: React.ReactNode; 
  variant?: string; 
  size?: string; 
  onClick?: () => void;
  className?: string;
}) => {
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      onClick={onClick}
      className={`font-medium rounded transition-colors ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.md} ${className}`}
    >
      {children}
    </button>
  );
};

// Inline Card components
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Data types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinedAt: Date;
}

type SortField = 'name' | 'email' | 'department' | 'status' | 'joinedAt';
type SortDirection = 'asc' | 'desc';

// Sample data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 's.chen@example.com',
    role: 'admin',
    department: 'Engineering',
    status: 'active',
    joinedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'm.johnson@example.com',
    role: 'manager',
    department: 'Product',
    status: 'active',
    joinedAt: new Date('2024-03-20'),
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'e.davis@example.com',
    role: 'member',
    department: 'Design',
    status: 'active',
    joinedAt: new Date('2024-06-10'),
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'j.wilson@example.com',
    role: 'member',
    department: 'Engineering',
    status: 'inactive',
    joinedAt: new Date('2023-11-05'),
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    email: 'o.martinez@example.com',
    role: 'viewer',
    department: 'Marketing',
    status: 'pending',
    joinedAt: new Date('2024-12-01'),
  },
  {
    id: '6',
    name: 'Liam Brown',
    email: 'l.brown@example.com',
    role: 'manager',
    department: 'Sales',
    status: 'active',
    joinedAt: new Date('2024-02-14'),
  },
];

function Original_UserDataTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Filter users based on search query
  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: string | Date = a[sortField];
    let bValue: string | Date = b[sortField];

    if (sortField === 'joinedAt') {
      aValue = a.joinedAt.getTime();
      bValue = b.joinedAt.getTime();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: User['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'danger';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // Sort icon component
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>User Management</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {sortedUsers.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500 text-sm">No users found matching your search.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                      Name <SortIcon field="name" />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('email')}>
                      Email <SortIcon field="email" />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('department')}>
                      Department <SortIcon field="department" />
                    </TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                      Status <SortIcon field="status" />
                    </TableHead>
                    <TableHead className="cursor-pointer hover:bg-gray-100" onClick={() => handleSort('joinedAt')}>
                      Joined <SortIcon field="joinedAt" />
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell className="text-gray-600">{user.department}</TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(user.status)}>
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => console.log('View', user.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => console.log('Edit', user.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => console.log('Delete', user.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769047902.690339" />
      <div style={{ marginTop: '40px' }}>
        <Original_UserDataTable {...props} />
      </div>
    </>
  );
}