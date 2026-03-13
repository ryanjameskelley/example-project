# AUUI Project Context

## Project Information
- **Project ID**: cml9y9hv5000316242ng4hstb
- **Title**: New Prototype

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


## Available Components

### Atoms
- `@/components/atoms/tooltip` - tooltip
- `@/components/atoms/textarea` - textarea
- `@/components/atoms/switch` - switch
- `@/components/atoms/spinner` - spinner
- `@/components/atoms/scroll-fade` - scroll-fade
- `@/components/atoms/progress` - progress
- `@/components/atoms/input` - input
- `@/components/atoms/inline-citation` - inline-citation
- `@/components/atoms/image` - image
- `@/components/atoms/edge` - edge
- `@/components/atoms/connection` - connection
- `@/components/atoms/collapsible` - collapsible
- `@/components/atoms/badge` - badge
- `@/components/atoms/accordion` - accordion
- `@/components/atoms/Shimmer` - Shimmer
- `@/components/atoms/Separator` - Separator
- `@/components/atoms/Select` - Select
- `@/components/atoms/SegmentedBadge` - SegmentedBadge
- `@/components/atoms/Label` - Label
- `@/components/atoms/InputGroup` - InputGroup
- `@/components/atoms/Field` - Field
- `@/components/atoms/Checkbox` - Checkbox
- `@/components/atoms/Button` - Button
- `@/components/atoms/Avatar` - Avatar
- `@/components/atoms/AppLayout` - AppLayout
- `@/components/atoms/Alert` - Alert
- Button (src/components/atoms/Button.tsx)


- Field (src/components/atoms/Field.tsx)
- SegmentedBadge (src/components/atoms/SegmentedBadge.tsx)
- Badge (src/components/atoms/badge.tsx)
- Switch (src/components/atoms/switch.tsx)
- Select (src/components/atoms/select.tsx)
- InputGroup (src/components/atoms/InputGroup.tsx)
### Molecules
- `@/components/molecules/voice-selector` - voice-selector
- `@/components/molecules/transcription` - transcription
- `@/components/molecules/toolbar` - toolbar
- `@/components/molecules/tool` - tool
- `@/components/molecules/task` - task
- `@/components/molecules/suggestion` - suggestion
- `@/components/molecules/speech-input` - speech-input
- `@/components/molecules/sources` - sources
- `@/components/molecules/snippet` - snippet
- `@/components/molecules/scroll-area` - scroll-area
- `@/components/molecules/reasoning` - reasoning
- `@/components/molecules/prompt-input` - prompt-input
- `@/components/molecules/popover` - popover
- `@/components/molecules/open-in-chat` - open-in-chat
- `@/components/molecules/node` - node
- `@/components/molecules/model-selector` - model-selector
- `@/components/molecules/mic-selector` - mic-selector
- `@/components/molecules/message` - message
- `@/components/molecules/hover-card` - hover-card
- `@/components/molecules/dialog` - dialog
- `@/components/molecules/conversation` - conversation
- `@/components/molecules/controls` - controls
- `@/components/molecules/commit` - commit
- `@/components/molecules/command` - command
- `@/components/molecules/code-block` - code-block
- `@/components/molecules/checkpoint` - checkpoint
- `@/components/molecules/carousel` - carousel
- `@/components/molecules/card` - card
- `@/components/molecules/audio-player` - audio-player
- `@/components/molecules/attachments` - attachments
- `@/components/molecules/TestWorkflowDrawer` - TestWorkflowDrawer
- `@/components/molecules/TestRoutesDialog` - TestRoutesDialog
- `@/components/molecules/Tabs` - Tabs
- `@/components/molecules/StepSettingsDrawer` - StepSettingsDrawer
- `@/components/molecules/StandardTabs` - StandardTabs
- `@/components/molecules/SearchList` - SearchList
- `@/components/molecules/PageTabs` - PageTabs
- `@/components/molecules/NoJourney` - NoJourney
- `@/components/molecules/MultiFieldItem` - MultiFieldItem
- `@/components/molecules/JourneyStepNode` - JourneyStepNode
- `@/components/molecules/Item` - Item
- `@/components/molecules/FlowNode` - FlowNode
- `@/components/molecules/EditJourneyDialog` - EditJourneyDialog
- `@/components/molecules/DropdownMenu` - DropdownMenu
- `@/components/molecules/Drawer` - Drawer
- `@/components/molecules/CopyJourneyDialog` - CopyJourneyDialog
- `@/components/molecules/ChatInput` - ChatInput
- `@/components/molecules/ButtonGroup` - ButtonGroup
- ButtonGroup (src/components/molecules/ButtonGroup.tsx)
- DropdownMenu (src/components/molecules/DropdownMenu.tsx)
- Drawer (src/components/molecules/Drawer.tsx)
- FlowNode (src/components/molecules/FlowNode.tsx)
- Item (src/components/molecules/Item.tsx)
- Dialog (src/components/molecules/dialog.tsx)
- Empty (src/components/molecules/NoJourney.tsx)
- Tabs (src/components/molecules/Tabs.tsx)
- MultiFieldItem (src/components/molecules/MultiFieldItem.tsx)

- StandardTabs (src/components/molecules/StandardTabs.tsx)
### Organisms
- `@/components/organisms/web-preview` - web-preview
- `@/components/organisms/test-results` - test-results
- `@/components/organisms/terminal` - terminal
- `@/components/organisms/table` - table
- `@/components/organisms/stack-trace` - stack-trace
- `@/components/organisms/schema-display` - schema-display
- `@/components/organisms/sandbox` - sandbox
- `@/components/organisms/queue` - queue
- `@/components/organisms/plan` - plan
- `@/components/organisms/persona` - persona
- `@/components/organisms/panel` - panel
- `@/components/organisms/package-info` - package-info
- `@/components/organisms/jsx-preview` - jsx-preview
- `@/components/organisms/file-tree` - file-tree
- `@/components/organisms/environment-variables` - environment-variables
- `@/components/organisms/context` - context
- `@/components/organisms/confirmation` - confirmation
- `@/components/organisms/chain-of-thought` - chain-of-thought
- `@/components/organisms/canvas` - canvas
- `@/components/organisms/artifact` - artifact
- `@/components/organisms/agent` - agent
- `@/components/organisms/Vitals` - Vitals
- `@/components/organisms/AppSidebar` - AppSidebar
- Table (src/components/organisms/table.tsx)
- Vitals (src/components/organisms/Vitals.tsx)