# AUUI.md - Prototype Generation Guidelines

This file customizes how Claude generates prototypes for your project.

## Allowed Component Libraries


**From `lucide-react`:**
- Any icon is allowed (e.g., `TrendingUp`, `Users`, `DollarSign`, `Calendar`, `Settings`)

### What NOT to Use
- ❌ Do not use `@headlessui/react` or `@radix-ui` directly (use shadcn/ui wrappers)
- ❌ Do not create custom button/input components from scratch
- ❌ Do not use inline styles
- ❌ Do not use `<div>` with lots of Tailwind classes when a shadcn component exists

## Data Models

Use these TypeScript interfaces for mock data:

### User
```typescript
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
```

### Project
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on-hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: User;
  team: User[];
  budget: number;
  spent: number;
  deadline: Date;
  startDate: Date;
  progress: number; // 0-100
  tags: string[];
}
```

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: User;
  project: Project;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Metric
```typescript
interface Metric {
  label: string;
  value: number | string;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
  icon?: string; // lucide-react icon name
  period: string; // e.g., "vs last month"
}
```

### Customer
```typescript
interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: 'free' | 'starter' | 'professional' | 'enterprise';
  mrr: number; // Monthly Recurring Revenue
  status: 'active' | 'churned' | 'trial';
  signupDate: Date;
  lastActive: Date;
}
```

### Invoice
```typescript
interface Invoice {
  id: string;
  customer: Customer;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidDate?: Date;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}
```

### Notification
```typescript
interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}
```

## Design System Rules

### Colors

**Brand Colors:**
- Primary: `bg-blue-600`, `text-blue-600`, `border-blue-600`
- Primary Hover: `hover:bg-blue-700`
- Success: `bg-green-500`, `text-green-600`
- Warning: `bg-amber-500`, `text-amber-600`
- Danger: `bg-red-500`, `text-red-600`
- Neutral: `bg-gray-100`, `text-gray-600`, `border-gray-200`

**Semantic Colors:**
- Status Active: `bg-green-100 text-green-800`
- Status Pending: `bg-yellow-100 text-yellow-800`
- Status Inactive: `bg-gray-100 text-gray-800`
- Status Error: `bg-red-100 text-red-800`

### Spacing

- **Page Container**: `container mx-auto px-4 sm:px-6 lg:px-8`
- **Page Padding**: `p-6 md:p-8`
- **Card Padding**: `p-6`
- **Section Gaps**: `space-y-6` or `gap-6`
- **Button Spacing**: `px-4 py-2`
- **Input Spacing**: `px-3 py-2`

### Typography

- **Page Title**: `text-3xl font-bold text-gray-900`
- **Section Heading**: `text-2xl font-bold text-gray-900`
- **Card Title**: `text-lg font-semibold text-gray-900`
- **Body Text**: `text-sm text-gray-600`
- **Label Text**: `text-xs font-medium text-gray-500 uppercase tracking-wide`
- **Muted Text**: `text-xs text-gray-400`

### Layout Patterns

- **Dashboard Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- **Two Column**: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- **Content Max Width**: `max-w-7xl mx-auto`
- **Card Grid**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`

## Code Style

### Import Order

Always organize imports in this order:

```typescript
// 1. React and hooks
import { useState, useEffect } from 'react';

// 2. UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/atoms/badge';

// 3. Icons
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

// 4. Types (defined inline in the file)
```

### Component Structure

- Use TypeScript with explicit types
- Use functional components with hooks only
- Add proper TypeScript interfaces for all props and data
- Use meaningful variable names
- Keep components focused and single-purpose

### Expected Behaviors

When implementing prototypes:

**For Lists:**
- Display items with proper keys
- Show empty states when no data
- Include search/filter functionality for >10 items
- Add sorting options where appropriate
- Use pagination or "Load More" for >20 items

**For Forms:**
- Use controlled components
- Show validation errors inline
- Disable submit button while processing
- Display success message after submission
- Clear form after successful submission

**For Data Tables:**
- Include column headers with sort indicators
- Add row hover states
- Include action buttons (Edit, Delete, View)
- Show "No results" state
- Include row selection for bulk actions

**For Dashboards:**
- Display key metrics at the top
- Show trend indicators (up/down arrows)
- Include time period selectors
- Add visual charts where appropriate
- Use cards for metric grouping

**For Modals/Dialogs:**
- Include clear close button
- Show action buttons (Cancel, Confirm)
- Disable confirm button while processing
- Close on successful action
- Focus trap within modal

## Sample Data Patterns

### Users

```typescript
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
    status: 'active',
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
    status: 'active',
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
    status: 'active',
  },
];
```

### Projects

```typescript
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design',
    status: 'active',
    priority: 'high',
    owner: sampleUsers[0],
    team: [sampleUsers[0], sampleUsers[2]],
    budget: 50000,
    spent: 32500,
    deadline: new Date('2026-03-01'),
    startDate: new Date('2025-12-01'),
    progress: 65,
    tags: ['design', 'frontend', 'marketing'],
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Build native iOS and Android applications',
    status: 'planning',
    priority: 'urgent',
    owner: sampleUsers[1],
    team: [sampleUsers[0], sampleUsers[1]],
    budget: 120000,
    spent: 5000,
    deadline: new Date('2026-06-15'),
    startDate: new Date('2026-02-01'),
    progress: 10,
    tags: ['mobile', 'ios', 'android'],
  },
];
```

### Metrics

```typescript
const sampleMetrics: Metric[] = [
  {
    label: 'Total Users',
    value: '12,345',
    change: 12.5,
    trend: 'up',
    icon: 'Users',
    period: 'vs last month',
  },
  {
    label: 'Revenue',
    value: '$45,200',
    change: 8.2,
    trend: 'up',
    icon: 'DollarSign',
    period: 'vs last month',
  },
  {
    label: 'Active Projects',
    value: 24,
    change: -3.1,
    trend: 'down',
    icon: 'FolderOpen',
    period: 'vs last month',
  },
];
```

## Component Examples

### Good - Metric Card

```typescript
interface MetricCardProps {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

function MetricCard({ label, value, change, trend, icon }: MetricCardProps) {
  const Icon = Icons[icon as keyof typeof Icons];
  const isPositive = trend === 'up';

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {label}
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
        <div className="mt-4 flex items-center">
          <Badge variant={isPositive ? 'default' : 'destructive'} className="mr-2">
            {change > 0 ? '+' : ''}{change}%
          </Badge>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Bad - Don't Do This

```typescript
// ❌ Using generic divs instead of Card components
// ❌ No TypeScript types
// ❌ Inline styles
// ❌ Missing accessibility

function MetricCard({ label, value }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '20px' }}>
      <span>{label}</span>
      <h3>{value}</h3>
    </div>
  );
}
```

### Good - Data Table

```typescript
interface TableRow {
  id: string;
  name: string;
  status: string;
  date: Date;
}

export default function DataTable() {
  const data: TableRow[] = [
    { id: '1', name: 'Project A', status: 'active', date: new Date() },
    { id: '2', name: 'Project B', status: 'completed', date: new Date() },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <Badge>{row.status}</Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {row.date.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

## What to Generate

- Generate a SINGLE React component as the default export
- Make it self-contained with inline mock data
- Make it responsive (mobile-first)
- Add hover states and interactions
- Use proper TypeScript types for all data
- Include realistic sample data
- Add loading and empty states
- Include proper accessibility attributes

## What NOT to Generate

- ❌ No API calls or data fetching
- ❌ No routing (no react-router, no Next.js Link)
- ❌ No form submissions to external services
- ❌ No external dependencies beyond allowed list
- ❌ No complex state management (Redux, Zustand, etc.)
- ❌ No Node.js built-ins or server-side code
- ❌ No authentication/authorization logic

## File Structure

Each prototype should follow this structure:

```
apps/prototypes/{id}/
├── index.tsx          # Main component (required)
├── config.ts          # Metadata (optional)
└── components/        # Sub-components (optional)
```

## Prototype Guidelines

- **Max Components**: Keep it under 5 components per prototype
- **Data**: Use mock data only, no real API calls
- **State**: Minimal state management (useState only)
- **Accessibility**: Include ARIA labels and semantic HTML
- **Loading States**: Always include loading indicators
- **Error States**: Show error messages clearly
- **Responsiveness**: Mobile-first responsive design
- **Performance**: Keep render cycles minimal
- **Focus**: Demonstrate UI/UX concepts, not production logic

## Notes

- Keep prototypes focused and simple
- Prioritize speed of development over perfection
- These are prototypes, not production code
- Focus on demonstrating UI/UX concepts
- Always use the exact data models defined above
- Follow the design system rules for consistency
- Include realistic sample data for better demos



## Integration Context

### API Endpoints
- GET /api/users - List users
- POST /api/users - Create user

### Authentication
- Uses JWT tokens
- uses Oauth

### Database Tables
- users, projects, tasks, organizations, 

### Other Important Stuff
- use css classes from the {}

## Available Components

Components saved from prototypes are automatically added here when you select a category.

### Atoms
<!-- Small, single-purpose UI elements (buttons, badges, inputs, icons) -->
- `@/components/atoms/badge` - badge

### Molecules
<!-- Combinations of atoms that form functional units (search bars, cards, form fields) -->

### Organisms
<!-- Complex, standalone sections composed of molecules (headers, sidebars, data tables) -->

### Pages
<!-- Full page layouts and templates -->
