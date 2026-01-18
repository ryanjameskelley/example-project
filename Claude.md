# Claude.md - Prototype Generation Guidelines

Customize how Claude generates prototypes for your project.

## Allowed Component Libraries

- `react` and `react-dom` (always allowed)
- `@/components/ui/*` - shadcn/ui or your UI components
- `@your-company/ui` - Your internal UI library
- `lucide-react` - Icons
- Add your allowed libraries here...

## Blocked Imports

- Node.js built-ins (`fs`, `path`, etc.)
- Server-side packages
- Add restricted packages here...

## Styling Requirements

- **CSS Framework**: Tailwind CSS utility classes
- **Design System**: Follow your company's design system
- **Responsive**: Mobile-first responsive design required

## Code Standards

- **TypeScript**: Always use TypeScript with explicit types
- **Components**: Functional components with hooks only
- **Props**: Always define prop interfaces

## Prototype Guidelines

- Keep it simple (under 5 components)
- Use mock data only (no real API calls)
- Include loading and error states
- Add accessibility attributes
