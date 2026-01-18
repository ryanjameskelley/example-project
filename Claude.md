# Claude.md - Prototype Generation Guidelines

This file customizes how Claude generates prototypes for your project.

## Allowed Component Libraries

You can import from these packages:

- `react` and `react-dom` (always allowed)
- `@/components/ui/*` - shadcn/ui components (or your component library)
- `lucide-react` - Icons
- Add your component libraries here...

## Blocked Imports

Do NOT import from:

- Node.js built-ins (`fs`, `path`, etc.)
- Server-side packages

## Styling Requirements

- **CSS Framework**: Tailwind CSS utility classes
- **Component Library**: Your design system components
- **Theme**: Use CSS variables defined in your app
- **Responsive**: Mobile-first responsive design required

Example:
```tsx
<div className="container mx-auto py-8 px-4">
  <h1 className="text-2xl font-bold mb-4">Title</h1>
</div>
```

## Code Standards

- **TypeScript**: Always use TypeScript with explicit types
- **Components**: Functional components with hooks only
- **Naming**: PascalCase for components, camelCase for functions
- **Props**: Always define prop interfaces
- **State**: Use `useState` for local state
- **Effects**: Minimize `useEffect` usage

Example:
```tsx
interface CardProps {
  title: string;
  description: string;
}

export default function Card({ title, description }: CardProps) {
  return (
    <div className="rounded-lg border p-4">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
```

## Prototype Guidelines

- **Max Components**: Keep it under 5 components per prototype
- **Data**: Use mock data only, no real API calls
- **State**: Minimal state management
- **Accessibility**: Include ARIA labels and semantic HTML
- **Loading States**: Always include loading indicators
- **Error States**: Show error messages clearly

Example mock data:
```tsx
const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];
```

## Specific Requirements

### Forms
- Use controlled components
- Include validation
- Show error messages inline
- Disable submit while processing

### Lists
- Use proper keys
- Include empty states
- Add loading skeletons
- Implement pagination if >20 items

## File Structure

Each prototype should follow this structure:

```
apps/prototypes/{id}/
├── index.tsx          # Main component (required)
├── config.ts          # Metadata (optional)
└── components/        # Sub-components (optional)
```

## Examples

### Good Prototype
```tsx
interface MetricCardProps {
  title: string;
  value: number;
  change: number;
}

export default function Dashboard() {
  const metrics = [
    { title: 'Users', value: 1234, change: 12 },
    { title: 'Revenue', value: 45200, change: 8 },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>
    </div>
  );
}

function MetricCard({ title, value, change }: MetricCardProps) {
  const isPositive = change > 0;

  return (
    <div className="rounded-lg border p-6 bg-white shadow-sm">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold mt-2">{value.toLocaleString()}</p>
      <p className={`text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{change}%
      </p>
    </div>
  );
}
```

### Bad Prototype
```tsx
// ❌ No TypeScript types
// ❌ No mock data
// ❌ Making real API calls
// ❌ No error handling

export default function Dashboard() {
  const [data, setData] = useState();

  useEffect(() => {
    fetch('https://api.example.com/data')  // ❌ Real API call
      .then(r => r.json())
      .then(setData);
  }, []);

  return <div>{data?.map(...)}</div>;  // ❌ No loading/error states
}
```

## Notes

- Keep prototypes focused and simple
- Prioritize speed of development over perfection
- These are prototypes, not production code
- Focus on demonstrating UI/UX concepts
