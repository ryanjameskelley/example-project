import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Badge } from '@/components/atoms/badge';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

// Define inline components for Table structure
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
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
);

const TableCell = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>{children}</td>
);

// Inline Button component
const Button = ({ 
  children, 
  onClick, 
  variant = 'default',
  size = 'md',
  className = '' 
}: { 
  children: React.ReactNode; 
  onClick?: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'text-gray-600 hover:bg-gray-100',
    outline: 'border border-gray-200 text-gray-600 hover:bg-gray-50'
  };
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

// Inline Input component
const Input = ({ 
  placeholder, 
  value, 
  onChange,
  className = ''
}: { 
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

// Inline Card components
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Data interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinedAt: Date;
}

type SortDirection = 'asc' | 'desc' | null;
type SortField = keyof User | null;

function Original_SimpleDataTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

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
      name: 'Alex Rodriguez',
      email: 'a.rodriguez@example.com',
      role: 'viewer',
      department: 'Marketing',
      status: 'pending',
      joinedAt: new Date('2024-11-05'),
    },
    {
      id: '5',
      name: 'Lisa Kim',
      email: 'l.kim@example.com',
      role: 'member',
      department: 'Engineering',
      status: 'inactive',
      joinedAt: new Date('2024-02-28'),
    },
  ];

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc');
      if (sortDirection === 'desc') {
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = sampleUsers
    .filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.department.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (!sortField || !sortDirection) return 0;
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const getStatusBadgeVariant = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeVariant = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'member':
        return 'bg-gray-100 text-gray-800';
      case 'viewer':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const SortIcon = ({ field }: { field: keyof User }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-600 mt-2">Manage and view your team members</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Users ({filteredAndSortedData.length})</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Button variant="outline" size="md">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAndSortedData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No users found matching your search.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      Name <SortIcon field="name" />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('email')}
                    >
                      Email <SortIcon field="email" />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('role')}
                    >
                      Role <SortIcon field="role" />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('department')}
                    >
                      Department <SortIcon field="department" />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      Status <SortIcon field="status" />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('joinedAt')}
                    >
                      Joined <SortIcon field="joinedAt" />
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedData.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{user.department}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.joinedAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">Edit</Button>
                          <Button variant="ghost" size="sm">View</Button>
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
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769048283.084849" />
      <div style={{ marginTop: '40px' }}>
        <Original_SimpleDataTable {...props} />
      </div>
    </>
  );
}