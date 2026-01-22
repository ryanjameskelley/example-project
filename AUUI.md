# AUUI Project Context

## Project Information
- **Project ID**: 1769115908.624029
- **Title**: AUUI Prototype

## Tech Stack
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- Lucide React for icons

## Available Libraries
- `react` - React core library
- `react-dom` - React DOM rendering
- `lucide-react` - Icon library (e.g., `import { Menu, X, ChevronRight } from 'lucide-react'`)
- `clsx` - Utility for constructing className strings
- `tailwind-merge` - Merge Tailwind classes without conflicts

## Component Guidelines
1. Use functional components with TypeScript
2. Use Tailwind CSS for all styling (no separate CSS files needed)
3. Keep components in the `src/` directory
4. Export default from App.tsx for the main component

## File Structure
```
src/
  App.tsx      # Main component (edit this)
  main.tsx     # Entry point (don't edit)
  index.css    # Tailwind imports (don't edit)
```

## Example Component Patterns

### Button with variants
```tsx
import { clsx } from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant = 'primary', children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-indigo-600 text-white hover:bg-indigo-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300'
      )}
    >
      {children}
    </button>
  );
}
```

### Card component
```tsx
interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

function Card({ title, description, children }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );
}
```

### Icon usage
```tsx
import { Menu, X, ArrowRight, Check } from 'lucide-react';

// Use icons inline
<Menu className="w-6 h-6 text-gray-600" />
<Check className="w-4 h-4 text-green-500" />
```

## Notes
- Changes are applied instantly via HMR (Hot Module Replacement)
- Use semantic HTML and accessibility best practices
- Responsive design: use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
