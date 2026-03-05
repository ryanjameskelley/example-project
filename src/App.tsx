/**
 * AUUI Prototype - {{PROJECT_TITLE}}
 *
 * This component is managed by AUUI. Chat with the AI to make changes.
 * Changes are applied instantly via Hot Module Replacement (HMR).
 */

import { useState } from 'react'
import { SearchList, SearchListItem } from '@/components/molecules/SearchList'
import { VitalsPage } from '@/components/pages/VitalsPage'
import { Settings } from '@/components/pages/settings/Settings'
import { PatientVitals } from '@/components/pages/PatientVitals'
import { TooltipProvider } from '@/components/atoms/tooltip'

interface Prototype {
  name: string
  description?: string
  component: React.ComponentType
}

const prototypes: Record<string, Prototype> = {
  vitals: {
    name: 'Vitals',
    description: 'Healthcare vitals monitoring table',
    component: VitalsPage,
  },
  settings: {
    name: 'Settings',
    description: 'Settings related to vitals',
    component: Settings,
  },
  patientVitals: {
    name: 'Patient Vitals',
    description: 'Patient vitals in the contacts dialog',
    component: PatientVitals,
  },
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string | null>(null)

  if (currentPage && prototypes[currentPage]) {
    const Page = prototypes[currentPage].component
    return (
      <TooltipProvider>
        <Page />
      </TooltipProvider>
    )
  }

  const items: SearchListItem[] = Object.entries(prototypes).map(([key, proto]) => ({
    id: key,
    name: proto.name,
    description: proto.description,
  }))

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Vitals
            </h1>
            <p className="text-gray-600">
              Select a prototype to view
            </p>
          </div>

          <SearchList
            items={items}
            onSelect={(id) => setCurrentPage(id)}
            placeholder="Search prototypes..."
          />

          <div className="mt-10 bg-white/70 border border-gray-200 rounded-xl p-6 text-sm text-gray-700 space-y-6">
            <div>
              <p className="text-gray-800 font-medium mb-1">Developer Notes</p>
              <p>Files below are included in the PR. The remaining aspects of the designs already exist as components in the app. Feel free to scrap the PR and implement differently using the prototypes as a guide if needed.</p>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-3">Vitals Components</p>
              <div className="space-y-3">
                <div>
                  <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/components/VitalItem.tsx</code>
                  <p className="mt-1 text-gray-600">List item component for displaying a single observation in the patient vitals panel. Accepts <code className="text-[11px] bg-gray-100 text-gray-600 px-1 rounded">name</code>, <code className="text-[11px] bg-gray-100 text-gray-600 px-1 rounded">timestamp</code>, <code className="text-[11px] bg-gray-100 text-gray-600 px-1 rounded">timestampIsEstimated</code>, <code className="text-[11px] bg-gray-100 text-gray-600 px-1 rounded">readingType</code>, <code className="text-[11px] bg-gray-100 text-gray-600 px-1 rounded">segments</code> (value/unit/status pairs), <code className="text-[11px] bg-gray-100 text-gray-600 px-1 rounded">source</code>, <code className="text-[11px] bg-gray-100 text-gray-600 px-1 rounded">flags</code> (display strings derived from beforeMeal, medStatus, irregularHeartbeat), and <code className="text-[11px] bg-gray-100 text-gray-600 px-1 rounded">reviewed</code>. Shows a reading-type icon (hidden on narrow screens), name, a subtitle with timestamp · source · flags, a reviewed dot, and a SegmentedBadge for the measurement values. Responsive: icon hidden and content stacks vertically below the sm breakpoint.</p>
                </div>
                <div>
                  <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/components/SegmentedBadge.tsx</code>
                  <p className="mt-1 text-gray-600">Base component for displaying multiple value/unit pairs in connected segments with status-based color coding (success, warning, error, alert).</p>
                </div>
                <div>
                  <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/components/VitalsBadge.tsx</code>
                  <p className="mt-1 text-gray-600">Medical-aware wrapper for SegmentedBadge that automatically determines status colors based on medical thresholds for different vital types (blood pressure, glucose, heart rate, weight).</p>
                </div>
                <div>
                  <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/components/FlagCell.tsx</code>
                  <p className="mt-1 text-gray-600">Optimized component for displaying and editing vitals flags (beforeMeal, medStatus, irregularHeartbeat) with popover editors and multiple flag support.</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-3">Hooks</p>
              <div>
                <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/hooks/useFlagManager.ts</code>
                <p className="mt-1 text-gray-600">Centralized hook for managing vitals flags with configuration-driven logic, proper memoization, and support for EnduserObservation data structure.</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-3">Utilities</p>
              <div>
                <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/lib/vitals-utils.ts</code>
                <p className="mt-1 text-gray-600">Medical threshold configurations, status determination logic, and TypeScript interfaces for vitals data (VitalsThresholds, VitalFlag, FlagEditorConfig).</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-3">Package Updates</p>
              <div className="space-y-2">
                <div>
                  <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/index.ts</code>
                  <p className="mt-1 text-gray-600">Added exports for all new vitals and PageTabs components.</p>
                </div>
                <div>
                  <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/hooks/index.ts</code>
                  <p className="mt-1 text-gray-600">Added export for useFlagManager hook.</p>
                </div>
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-800 mb-3">Settings Components</p>
              <div>
                <code className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">/packages/ui/src/components/PageTabs.tsx</code>
                <p className="mt-1 text-gray-600">Specialized tabs component for page-level navigation with sophisticated styling, bottom border active indicators, and smooth hover transitions.</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="font-semibold text-amber-900 mb-2">Other Settings Notes</p>
              <p className="text-amber-800">The settings prototype includes settings for vitals and calendar so the tab structure can be implemented. The nested settings are configured with a vertical line rendered with a left border on the container div wrapping the sub-items.</p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
