/**
 * AUUI Prototype - {{PROJECT_TITLE}}
 *
 * This component is managed by AUUI. Chat with the AI to make changes.
 * Changes are applied instantly via Hot Module Replacement (HMR).
 */

import { useState } from 'react'
import { SearchList, SearchListItem } from '@/components/molecules/SearchList'
import { JourneysPage } from '@/components/pages/JourneysPage'
import { Button } from '@/components/atoms/Button'

interface Prototype {
  name: string
  description?: string
  component: React.ComponentType
}

const prototypes: Record<string, Prototype> = {
  journeys: {
    name: 'Journeys Page',
    description: 'User journey prototypes',
    component: JourneysPage,
  },
  // Add more prototypes here
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string | null>(null)

  if (currentPage && prototypes[currentPage]) {
    const Page = prototypes[currentPage].component
    return (
      <div className="min-h-screen">
        <div className="p-4 border-b h-[52px] bg-white flex items-center">
        
        </div>
        <Page />
      </div>
    )
  }

  const items: SearchListItem[] = Object.entries(prototypes).map(([key, proto]) => ({
    id: key,
    name: proto.name,
    description: proto.description,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AUUI Prototype Gallery
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
      </div>
    </div>
  )
}
