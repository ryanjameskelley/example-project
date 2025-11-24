# Example Project - Atomic Design System

A modern React project implementing atomic design principles with shadcn/ui components, organized in a monorepo structure with comprehensive Storybook documentation.

## Features

✅ **Atomic Design System** - Organized components hierarchy  
✅ **shadcn/ui Integration** - Modern, accessible components  
✅ **Storybook Documentation** - Component playground and docs  
✅ **TypeScript Support** - Full type safety across packages  
✅ **Workspace Management** - Efficient monorepo structure  
✅ **Hot Reloading** - Instant feedback during development  
✅ **Modern Tooling** - Vite, ESM, latest React practices  

## Project Structure

```
atomic-ui-system/
├── packages/
│   └── ui/                    # Shared UI component library
│       ├── src/
│       │   ├── atoms/         # Basic building blocks
│       │   ├── molecules/     # Simple component combinations
│       │   ├── organisms/     # Complex component assemblies
│       │   ├── templates/     # Page-level layouts
│       │   └── index.ts       # Barrel exports
├── apps/
│   └── web/                   # Main React application
│       ├── src/
│       ├── .storybook/        # Storybook configuration
└── package.json               # Root workspace configuration
```

## Quick Start

```bash
# Install dependencies
npm run install:all

# Start development server
npm run dev

# Start Storybook
npm run storybook

# Build everything
npm run build
```

## Development

See CLAUDE.md for detailed implementation progress and instructions.