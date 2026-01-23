# AUUI Project Context

## Project Information
- **Project ID**: 1769134093.400059
- **Title**: AUUI Prototype

## Tech Stack (Pre-installed)
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling

## Installing Additional Dependencies

You have terminal access to install any dependencies needed. Examples:

```bash
# UI Component Libraries
npx shadcn@latest init -y           # Initialize shadcn/ui
npx shadcn@latest add button card   # Add specific components

# Icons
npm install lucide-react            # Lucide icons
npm install @heroicons/react        # Heroicons

# Animation
npm install framer-motion           # Framer Motion
npm install react-spring            # React Spring

# Charts
npm install recharts                # Recharts
npm install @tremor/react           # Tremor

# Forms
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install zustand                 # Zustand
npm install jotai                   # Jotai

# Utilities
npm install clsx tailwind-merge     # Class utilities
npm install date-fns                # Date utilities
npm install axios                   # HTTP client
```

**Always install dependencies before importing them.**

---

## Path Alias

Use `@/` to import from the `src` directory:

```tsx
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
```

---

## Project Structures

### Simple Prototype (Default)

For single-component UIs, landing pages, or quick mockups:

```
src/
├── App.tsx          # Main component (edit this)
├── main.tsx         # Entry point (don't edit)
└── index.css        # Tailwind imports (don't edit)
```

**Usage**: Put all your code in `App.tsx`. This is the fastest way to prototype.

---

### Complex Prototype

For multi-component UIs, dashboards, or apps with shared logic:

```
src/
├── App.tsx              # Main component
├── main.tsx             # Entry point (don't edit)
├── index.css            # Tailwind imports (don't edit)
├── components/
│   ├── ui/              # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   ├── layout/          # Layout components
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   └── features/        # Feature-specific components
│       └── dashboard.tsx
├── hooks/               # Custom React hooks
│   └── use-local-storage.ts
├── lib/                 # Utility functions
│   └── utils.ts
└── types/               # TypeScript types
    └── index.ts
```

---

## Setting Up shadcn/ui

If the user requests shadcn components:

```bash
# 1. Initialize shadcn (creates components.json, adds dependencies)
npx shadcn@latest init -y --defaults

# 2. Add components as needed
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add badge
```

After installation, import from `@/components/ui/`:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
```

---

## Component Guidelines

1. Use functional components with TypeScript
2. Use Tailwind CSS for all styling
3. Use the `@/` path alias for imports
4. Export components as named exports, except App.tsx which uses default export
5. File naming: use kebab-case (e.g., `user-profile.tsx`)

---

## Example: Simple Button (no dependencies)

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}
```

---

## Example: Utility Function

Create `src/lib/utils.ts`:

```tsx
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Note**: Requires `npm install clsx tailwind-merge`

---

## Notes
- Changes are applied instantly via HMR (Hot Module Replacement)
- Use semantic HTML and accessibility best practices
- Responsive design: use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- When creating new files, use `.tsx` for components and `.ts` for non-JSX code
- **Always run `npm install <package>` before importing new packages**
