/**
 * AUUI Prototype - Healthcare Vitals Monitoring Table
 *
 * This component is managed by AUUI. Chat with the AI to make changes.
 * Changes are applied instantly via Hot Module Replacement (HMR).
 */

import { useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Calendar as CalendarIcon, Filter, Users, Activity, Eye, EyeOff, AlertTriangle, X, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

type VitalSource = 'healthie' | 'vital' | 'elation' | 'canvas'

interface VitalReading {
  id: string
  patientName: string
  time: string
  vitalType: string
  value: number
  unit: string
  threshold: { min: number; max: number }
  source: VitalSource
  reviewed: boolean
  flags: string[]
  visible: boolean
}

interface SavedView {
  id: string
  name: string
  filters: {
    careTeam: string
    source: string
  }
  selectedPatients: string[]
  selectedPrograms: string[]
  selectedThresholds: string[]
  careTeamMembers: string[]
  careTeamGroups: string[]
  dateRange: { from: Date | undefined; to: Date | undefined }
}

const sampleVitals: VitalReading[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    time: '2026-01-22 08:30',
    vitalType: 'Blood Pressure (Systolic)',
    value: 165,
    unit: 'mmHg',
    threshold: { min: 90, max: 140 },
    source: 'healthie',
    reviewed: false,
    flags: ['HIGH', 'URGENT'],
    visible: true
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    time: '2026-01-22 09:15',
    vitalType: 'Heart Rate',
    value: 58,
    unit: 'bpm',
    threshold: { min: 60, max: 100 },
    source: 'vital',
    reviewed: false,
    flags: ['LOW'],
    visible: true
  },
  {
    id: '3',
    patientName: 'Emily Rodriguez',
    time: '2026-01-22 10:00',
    vitalType: 'Blood Glucose',
    value: 95,
    unit: 'mg/dL',
    threshold: { min: 70, max: 140 },
    source: 'elation',
    reviewed: true,
    flags: [],
    visible: true
  },
  {
    id: '4',
    patientName: 'James Wilson',
    time: '2026-01-22 10:45',
    vitalType: 'Oxygen Saturation',
    value: 89,
    unit: '%',
    threshold: { min: 95, max: 100 },
    source: 'canvas',
    reviewed: false,
    flags: ['LOW', 'CRITICAL'],
    visible: true
  },
  {
    id: '5',
    patientName: 'Maria Garcia',
    time: '2026-01-22 11:20',
    vitalType: 'Temperature',
    value: 101.5,
    unit: '°F',
    threshold: { min: 97, max: 99 },
    source: 'healthie',
    reviewed: false,
    flags: ['HIGH'],
    visible: true
  },
  {
    id: '6',
    patientName: 'David Thompson',
    time: '2026-01-22 12:00',
    vitalType: 'Heart Rate',
    value: 78,
    unit: 'bpm',
    threshold: { min: 60, max: 100 },
    source: 'vital',
    reviewed: true,
    flags: [],
    visible: true
  },
  {
    id: '7',
    patientName: 'Lisa Anderson',
    time: '2026-01-22 13:30',
    vitalType: 'Blood Pressure (Systolic)',
    value: 118,
    unit: 'mmHg',
    threshold: { min: 90, max: 140 },
    source: 'elation',
    reviewed: true,
    flags: [],
    visible: true
  },
  {
    id: '8',
    patientName: 'Robert Martinez',
    time: '2026-01-22 14:15',
    vitalType: 'Blood Glucose',
    value: 185,
    unit: 'mg/dL',
    threshold: { min: 70, max: 140 },
    source: 'canvas',
    reviewed: false,
    flags: ['HIGH'],
    visible: true
  }
]

export default function App() {
  const [activeTab, setActiveTab] = useState('all')
  const [vitals, setVitals] = useState<VitalReading[]>(sampleVitals)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  })

  const [filters, setFilters] = useState({
    careTeam: 'all',
    source: 'all'
  })

  const [selectedPatients, setSelectedPatients] = useState<string[]>([])
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [selectedThresholds, setSelectedThresholds] = useState<string[]>([])
  const [patientSearch, setPatientSearch] = useState('')
  const [programSearch, setProgramSearch] = useState('')
  const [thresholdSearch, setThresholdSearch] = useState('')
  const [careTeamMemberSearch, setCareTeamMemberSearch] = useState('')
  const [careTeamGroupSearch, setCareTeamGroupSearch] = useState('')
  const [careTeamMembers, setCareTeamMembers] = useState<string[]>([])
  const [careTeamGroups, setCareTeamGroups] = useState<string[]>([])
  const [patientOpen, setPatientOpen] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)
  const [thresholdOpen, setThresholdOpen] = useState(false)
  const [careTeamMemberOpen, setCareTeamMemberOpen] = useState(false)
  const [careTeamGroupOpen, setCareTeamGroupOpen] = useState(false)

  const [savedViews, setSavedViews] = useState<SavedView[]>([])
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false)
  const [editViewDialogOpen, setEditViewDialogOpen] = useState(false)
  const [newViewName, setNewViewName] = useState('')
  const [editingViewName, setEditingViewName] = useState('')

  const resetFilters = () => {
    setFilters({
      careTeam: 'all',
      source: 'all'
    })
    setSelectedPatients([])
    setSelectedPrograms([])
    setSelectedThresholds([])
    setPatientSearch('')
    setProgramSearch('')
    setThresholdSearch('')
    setCareTeamMemberSearch('')
    setCareTeamGroupSearch('')
    setDateRange({ from: undefined, to: undefined })
    setCareTeamMembers([])
    setCareTeamGroups([])
    setPatientOpen(false)
    setProgramOpen(false)
    setThresholdOpen(false)
    setCareTeamMemberOpen(false)
    setCareTeamGroupOpen(false)
  }

  const activeFilterCount = () => {
    let count = 0
    if (selectedPatients.length > 0) count++
    if (filters.careTeam !== 'all') count++
    if (selectedPrograms.length > 0) count++
    if (selectedThresholds.length > 0) count++
    if (filters.source !== 'all') count++
    if (dateRange.from || dateRange.to) count++
    if (careTeamMembers.length > 0) count++
    if (careTeamGroups.length > 0) count++
    return count
  }

  const hasActiveFilters = () => activeFilterCount() > 0

  const saveView = () => {
    if (!newViewName.trim()) return

    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      filters: { ...filters },
      selectedPatients: [...selectedPatients],
      selectedPrograms: [...selectedPrograms],
      selectedThresholds: [...selectedThresholds],
      careTeamMembers: [...careTeamMembers],
      careTeamGroups: [...careTeamGroups],
      dateRange: { ...dateRange }
    }

    setSavedViews([...savedViews, newView])
    setActiveTab(newView.id)
    setNewViewName('')
    setSaveViewDialogOpen(false)
  }

  const loadView = (view: SavedView) => {
    setFilters(view.filters)
    setSelectedPatients(view.selectedPatients)
    setSelectedPrograms(view.selectedPrograms)
    setSelectedThresholds(view.selectedThresholds)
    setCareTeamMembers(view.careTeamMembers)
    setCareTeamGroups(view.careTeamGroups)
    setDateRange(view.dateRange)
    setActiveTab(view.id)
  }

  const deleteView = () => {
    setSavedViews(savedViews.filter(v => v.id !== activeTab))
    setActiveTab('all')
    setEditViewDialogOpen(false)
  }

  const renameView = () => {
    if (!editingViewName.trim()) return

    setSavedViews(savedViews.map(v =>
      v.id === activeTab ? { ...v, name: editingViewName } : v
    ))
    setEditViewDialogOpen(false)
    setEditingViewName('')
  }

  const getCurrentView = () => savedViews.find(v => v.id === activeTab)

  const getValueColor = (value: number, threshold: { min: number; max: number }) => {
    if (value < threshold.min) return 'text-blue-600 bg-blue-50 font-semibold'
    if (value > threshold.max) return 'text-red-600 bg-red-50 font-semibold'
    return 'text-green-600 bg-green-50 font-semibold'
  }

  const getSourceBadgeColor = (source: VitalSource) => {
    const colors = {
      healthie: 'bg-purple-100 text-purple-800',
      vital: 'bg-blue-100 text-blue-800',
      elation: 'bg-emerald-100 text-emerald-800',
      canvas: 'bg-orange-100 text-orange-800'
    }
    return colors[source]
  }

  const toggleVisibility = (id: string) => {
    setVitals(vitals.map(v => v.id === id ? { ...v, visible: !v.visible } : v))
  }

  const toggleReviewed = (id: string) => {
    setVitals(vitals.map(v => v.id === id ? { ...v, reviewed: !v.reviewed } : v))
  }

  const allPatients = useMemo(() => Array.from(new Set(vitals.map(v => v.patientName))), [vitals])

  const filteredPatients = useMemo(() => {
    return allPatients.filter(name =>
      name.toLowerCase().includes(patientSearch.toLowerCase())
    )
  }, [allPatients, patientSearch])

  const allCareTeamMembers = ['Dr. Smith', 'Dr. Jones', 'Nurse Williams', 'Nurse Davis']
  const filteredCareTeamMembers = useMemo(() => {
    return allCareTeamMembers.filter(member =>
      member.toLowerCase().includes(careTeamMemberSearch.toLowerCase())
    )
  }, [careTeamMemberSearch])

  const allCareTeamGroupsData = ['Pod A', 'Pod B', 'Pod C', 'Pod D', 'After Hours']
  const filteredCareTeamGroupsData = useMemo(() => {
    return allCareTeamGroupsData.filter(group =>
      group.toLowerCase().includes(careTeamGroupSearch.toLowerCase())
    )
  }, [careTeamGroupSearch])

  const allPrograms = [
    { value: 'diabetes', label: 'Diabetes Management' },
    { value: 'hypertension', label: 'Hypertension Care' },
    { value: 'cardiac', label: 'Cardiac Rehab' },
    { value: 'respiratory', label: 'Respiratory Care' }
  ]
  const filteredPrograms = useMemo(() => {
    return allPrograms.filter(program =>
      program.label.toLowerCase().includes(programSearch.toLowerCase())
    )
  }, [programSearch])

  const allThresholds = [
    { value: 'above', label: 'Above Threshold' },
    { value: 'below', label: 'Below Threshold' },
    { value: 'normal', label: 'Within Normal' }
  ]
  const filteredThresholds = useMemo(() => {
    return allThresholds.filter(threshold =>
      threshold.label.toLowerCase().includes(thresholdSearch.toLowerCase())
    )
  }, [thresholdSearch])

  const filteredVitals = vitals.filter(vital => {
    if (selectedPatients.length > 0 && !selectedPatients.includes(vital.patientName)) return false
    if (filters.source !== 'all' && vital.source !== filters.source) return false

    // Multi-select threshold filtering
    if (selectedThresholds.length > 0) {
      const matchesThreshold = selectedThresholds.some(threshold => {
        if (threshold === 'above') return vital.value > vital.threshold.max
        if (threshold === 'below') return vital.value < vital.threshold.min
        if (threshold === 'normal') return vital.value >= vital.threshold.min && vital.value <= vital.threshold.max
        return false
      })
      if (!matchesThreshold) return false
    }

    return true
  })

  const unreviewedCount = vitals.filter(v => !v.reviewed).length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Vitals Monitor</h1>
          <p className="text-gray-600">Healthcare care coordinator dashboard for monitoring patient vitals</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value)
            if (value === 'all') {
              resetFilters()
            } else {
              const view = savedViews.find(v => v.id === value)
              if (view) loadView(view)
            }
          }} className="w-full">
            {/* Combined Tabs and Filter Controls */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TabsList className="bg-white">
                    <TabsTrigger value="all">
                      All
                    </TabsTrigger>
                    {savedViews.slice(0, 3).map(view => (
                      <TabsTrigger key={view.id} value={view.id}>
                        {view.name}
                      </TabsTrigger>
                    ))}
                    {savedViews.length > 3 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 px-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          {savedViews.slice(3).map(view => (
                            <DropdownMenuItem key={view.id} onClick={() => loadView(view)}>
                              {view.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TabsList>
                  {activeTab !== 'all' && getCurrentView() && (
                    <Dialog open={editViewDialogOpen} onOpenChange={setEditViewDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditingViewName(getCurrentView()?.name || '')}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit View</DialogTitle>
                          <DialogDescription>
                            Rename or delete this saved view
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">View Name</label>
                            <Input
                              value={editingViewName}
                              onChange={(e) => setEditingViewName(e.target.value)}
                              placeholder="Enter view name"
                            />
                          </div>
                        </div>
                        <DialogFooter className="flex items-center justify-between">
                          <Button variant="destructive" onClick={deleteView}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete View
                          </Button>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setEditViewDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={renameView}>
                              Save Changes
                            </Button>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters() && (
                    <>
                      <Dialog open={saveViewDialogOpen} onOpenChange={setSaveViewDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Save as View
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Save View</DialogTitle>
                            <DialogDescription>
                              Give your filtered view a name to save it
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">View Name</label>
                              <Input
                                value={newViewName}
                                onChange={(e) => setNewViewName(e.target.value)}
                                placeholder="Enter view name"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSaveViewDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={saveView}>
                              Save View
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={resetFilters}>
                        Clear Filters
                      </Button>
                    </>
                  )}
                  <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="relative">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFilterCount() > 0 && (
                          <Badge className="ml-2 bg-blue-600 text-white text-xs px-1.5 py-0">
                            {activeFilterCount()}
                          </Badge>
                        )}
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Filter Vitals</DialogTitle>
                      <DialogDescription>
                        Apply filters to refine the vitals monitoring view
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                      {/* Date Range */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Date Range</label>
                        <div className="grid grid-cols-2 gap-3">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "Start Date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start" sameWidth>
                              <Calendar mode="single" selected={dateRange.from} onSelect={(date) => setDateRange({ ...dateRange, from: date })} />
                            </PopoverContent>
                          </Popover>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={cn("justify-start text-left font-normal", !dateRange.to && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "End Date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start" sameWidth>
                              <Calendar mode="single" selected={dateRange.to} onSelect={(date) => setDateRange({ ...dateRange, to: date })} />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      {/* Patients */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Patients</label>
                        <Popover open={patientOpen} onOpenChange={setPatientOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {selectedPatients.length > 0 ? `${selectedPatients.length} selected` : 'Select patients...'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                            <Command className="rounded-lg">
                              <CommandInput
                                placeholder="Search patients..."
                                value={patientSearch}
                                onValueChange={setPatientSearch}
                              />
                              <CommandList>
                                {filteredPatients.length === 0 ? (
                                  <CommandEmpty>No patients found.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {filteredPatients.map(name => (
                                      <CommandItem
                                        key={name}
                                        value={name}
                                        onSelect={() => {
                                          if (selectedPatients.includes(name)) {
                                            setSelectedPatients(selectedPatients.filter(p => p !== name))
                                          } else {
                                            setSelectedPatients([...selectedPatients, name])
                                          }
                                        }}
                                      >
                                        <div className="flex items-center space-x-2 w-full">
                                          <Checkbox
                                            checked={selectedPatients.includes(name)}
                                            onCheckedChange={() => {}}
                                          />
                                          <span className="flex-1">{name}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {selectedPatients.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedPatients.map(patient => (
                              <Badge key={patient} variant="secondary" className="flex items-center gap-1">
                                {patient}
                                <button
                                  onClick={() => setSelectedPatients(selectedPatients.filter(p => p !== patient))}
                                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Care Team Members */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Care Team Members</label>
                        <Popover open={careTeamMemberOpen} onOpenChange={setCareTeamMemberOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {careTeamMembers.length > 0 ? `${careTeamMembers.length} selected` : 'Select care team members...'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                            <Command className="rounded-lg">
                              <CommandInput
                                placeholder="Search care team members..."
                                value={careTeamMemberSearch}
                                onValueChange={setCareTeamMemberSearch}
                              />
                              <CommandList>
                                {filteredCareTeamMembers.length === 0 ? (
                                  <CommandEmpty>No care team members found.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {filteredCareTeamMembers.map(member => (
                                      <CommandItem
                                        key={member}
                                        value={member}
                                        onSelect={() => {
                                          if (careTeamMembers.includes(member)) {
                                            setCareTeamMembers(careTeamMembers.filter(m => m !== member))
                                          } else {
                                            setCareTeamMembers([...careTeamMembers, member])
                                          }
                                        }}
                                      >
                                        <div className="flex items-center space-x-2 w-full">
                                          <Checkbox
                                            checked={careTeamMembers.includes(member)}
                                            onCheckedChange={() => {}}
                                          />
                                          <span className="flex-1">{member}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {careTeamMembers.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {careTeamMembers.map(member => (
                              <Badge key={member} variant="secondary" className="flex items-center gap-1">
                                {member}
                                <button
                                  onClick={() => setCareTeamMembers(careTeamMembers.filter(m => m !== member))}
                                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Groups */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Groups</label>
                        <Popover open={careTeamGroupOpen} onOpenChange={setCareTeamGroupOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {careTeamGroups.length > 0 ? `${careTeamGroups.length} selected` : 'Select groups...'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                            <Command className="rounded-lg">
                              <CommandInput
                                placeholder="Search groups..."
                                value={careTeamGroupSearch}
                                onValueChange={setCareTeamGroupSearch}
                              />
                              <CommandList>
                                {filteredCareTeamGroupsData.length === 0 ? (
                                  <CommandEmpty>No groups found.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {filteredCareTeamGroupsData.map(group => (
                                      <CommandItem
                                        key={group}
                                        value={group}
                                        onSelect={() => {
                                          if (careTeamGroups.includes(group)) {
                                            setCareTeamGroups(careTeamGroups.filter(g => g !== group))
                                          } else {
                                            setCareTeamGroups([...careTeamGroups, group])
                                          }
                                        }}
                                      >
                                        <div className="flex items-center space-x-2 w-full">
                                          <Checkbox
                                            checked={careTeamGroups.includes(group)}
                                            onCheckedChange={() => {}}
                                          />
                                          <span className="flex-1">{group}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {careTeamGroups.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {careTeamGroups.map(group => (
                              <Badge key={group} variant="secondary" className="flex items-center gap-1">
                                {group}
                                <button
                                  onClick={() => setCareTeamGroups(careTeamGroups.filter(g => g !== group))}
                                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Program */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Program</label>
                        <Popover open={programOpen} onOpenChange={setProgramOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {selectedPrograms.length > 0 ? `${selectedPrograms.length} selected` : 'Select programs...'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                            <Command className="rounded-lg">
                              <CommandInput
                                placeholder="Search programs..."
                                value={programSearch}
                                onValueChange={setProgramSearch}
                              />
                              <CommandList>
                                {filteredPrograms.length === 0 ? (
                                  <CommandEmpty>No programs found.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {filteredPrograms.map(program => (
                                      <CommandItem
                                        key={program.value}
                                        value={program.value}
                                        onSelect={() => {
                                          if (selectedPrograms.includes(program.value)) {
                                            setSelectedPrograms(selectedPrograms.filter(p => p !== program.value))
                                          } else {
                                            setSelectedPrograms([...selectedPrograms, program.value])
                                          }
                                        }}
                                      >
                                        <div className="flex items-center space-x-2 w-full">
                                          <Checkbox
                                            checked={selectedPrograms.includes(program.value)}
                                            onCheckedChange={() => {}}
                                          />
                                          <span className="flex-1">{program.label}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {selectedPrograms.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedPrograms.map(programValue => {
                              const program = allPrograms.find(p => p.value === programValue)
                              return (
                                <Badge key={programValue} variant="secondary" className="flex items-center gap-1">
                                  {program?.label}
                                  <button
                                    onClick={() => setSelectedPrograms(selectedPrograms.filter(p => p !== programValue))}
                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Vitals Threshold */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Vitals Threshold</label>
                        <Popover open={thresholdOpen} onOpenChange={setThresholdOpen}>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {selectedThresholds.length > 0 ? `${selectedThresholds.length} selected` : 'Select thresholds...'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0" align="start" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                            <Command className="rounded-lg">
                              <CommandInput
                                placeholder="Search thresholds..."
                                value={thresholdSearch}
                                onValueChange={setThresholdSearch}
                              />
                              <CommandList>
                                {filteredThresholds.length === 0 ? (
                                  <CommandEmpty>No thresholds found.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {filteredThresholds.map(threshold => (
                                      <CommandItem
                                        key={threshold.value}
                                        value={threshold.value}
                                        onSelect={() => {
                                          if (selectedThresholds.includes(threshold.value)) {
                                            setSelectedThresholds(selectedThresholds.filter(t => t !== threshold.value))
                                          } else {
                                            setSelectedThresholds([...selectedThresholds, threshold.value])
                                          }
                                        }}
                                      >
                                        <div className="flex items-center space-x-2 w-full">
                                          <Checkbox
                                            checked={selectedThresholds.includes(threshold.value)}
                                            onCheckedChange={() => {}}
                                          />
                                          <span className="flex-1">{threshold.label}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {selectedThresholds.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedThresholds.map(thresholdValue => {
                              const threshold = allThresholds.find(t => t.value === thresholdValue)
                              return (
                                <Badge key={thresholdValue} variant="secondary" className="flex items-center gap-1">
                                  {threshold?.label}
                                  <button
                                    onClick={() => setSelectedThresholds(selectedThresholds.filter(t => t !== thresholdValue))}
                                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Data Source */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900">Data Source</label>
                        <Select value={filters.source} onValueChange={(value) => setFilters({ ...filters, source: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Data Source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="healthie">Healthie</SelectItem>
                            <SelectItem value="vital">Vital</SelectItem>
                            <SelectItem value="elation">Elation</SelectItem>
                            <SelectItem value="canvas">Canvas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter className="flex items-center justify-between">
                      <Button variant="outline" onClick={resetFilters}>
                        Reset All
                      </Button>
                      <Button onClick={() => setFilterDialogOpen(false)}>
                        Apply Filters
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

            <TabsContent value="all" className="m-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Patient Name</TableHead>
                      <TableHead className="font-semibold">Time</TableHead>
                      <TableHead className="font-semibold">Vital Type</TableHead>
                      <TableHead className="font-semibold">Flags</TableHead>
                      <TableHead className="font-semibold text-right">Value</TableHead>
                      <TableHead className="font-semibold">Unit</TableHead>
                      <TableHead className="font-semibold">Source</TableHead>
                      <TableHead className="font-semibold">Reviewed</TableHead>
                      <TableHead className="font-semibold text-center">Visible</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVitals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          No vitals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVitals.map((vital) => (
                        <TableRow key={vital.id} className={!vital.visible ? 'opacity-40' : ''}>
                          <TableCell className="font-medium">{vital.patientName}</TableCell>
                          <TableCell className="text-sm text-gray-600">{vital.time}</TableCell>
                          <TableCell className="text-sm">{vital.vitalType}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {vital.flags.map((flag, idx) => (
                                <Badge
                                  key={idx}
                                  variant="destructive"
                                  className={cn(
                                    "text-xs",
                                    flag === 'CRITICAL' && "bg-red-600",
                                    flag === 'URGENT' && "bg-orange-600",
                                    flag === 'HIGH' && "bg-red-500",
                                    flag === 'LOW' && "bg-blue-500"
                                  )}
                                >
                                  {flag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className={cn("px-2 py-1 rounded text-sm", getValueColor(vital.value, vital.threshold))}>
                              {vital.value}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{vital.unit}</TableCell>
                          <TableCell>
                            <Badge className={cn("text-xs", getSourceBadgeColor(vital.source))}>
                              {vital.source}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant={vital.reviewed ? "default" : "outline"}
                              onClick={() => toggleReviewed(vital.id)}
                              className={cn(
                                "text-xs",
                                vital.reviewed && "bg-green-600 hover:bg-green-700"
                              )}
                            >
                              {vital.reviewed ? 'Reviewed' : 'Mark Reviewed'}
                            </Button>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleVisibility(vital.id)}
                            >
                              {vital.visible ? (
                                <Eye className="h-4 w-4 text-gray-600" />
                              ) : (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {savedViews.map(view => (
              <TabsContent key={view.id} value={view.id} className="m-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Patient Name</TableHead>
                        <TableHead className="font-semibold">Time</TableHead>
                        <TableHead className="font-semibold">Vital Type</TableHead>
                        <TableHead className="font-semibold">Flags</TableHead>
                        <TableHead className="font-semibold text-right">Value</TableHead>
                        <TableHead className="font-semibold">Unit</TableHead>
                        <TableHead className="font-semibold">Source</TableHead>
                        <TableHead className="font-semibold">Reviewed</TableHead>
                        <TableHead className="font-semibold text-center">Visible</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVitals.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            No vitals found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredVitals.map((vital) => (
                          <TableRow key={vital.id} className={!vital.visible ? 'opacity-40' : ''}>
                            <TableCell className="font-medium">{vital.patientName}</TableCell>
                            <TableCell className="text-sm text-gray-600">{vital.time}</TableCell>
                            <TableCell className="text-sm">{vital.vitalType}</TableCell>
                            <TableCell>
                              <div className="flex gap-1 flex-wrap">
                                {vital.flags.map((flag, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="destructive"
                                    className={cn(
                                      "text-xs",
                                      flag === 'CRITICAL' && "bg-red-600",
                                      flag === 'URGENT' && "bg-orange-600",
                                      flag === 'HIGH' && "bg-red-500",
                                      flag === 'LOW' && "bg-blue-500"
                                    )}
                                  >
                                    {flag}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={cn("px-2 py-1 rounded text-sm", getValueColor(vital.value, vital.threshold))}>
                                {vital.value}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">{vital.unit}</TableCell>
                            <TableCell>
                              <Badge className={cn("text-xs", getSourceBadgeColor(vital.source))}>
                                {vital.source}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant={vital.reviewed ? "default" : "outline"}
                                onClick={() => toggleReviewed(vital.id)}
                                className={cn(
                                  "text-xs",
                                  vital.reviewed && "bg-green-600 hover:bg-green-700"
                                )}
                              >
                                {vital.reviewed ? 'Reviewed' : 'Mark Reviewed'}
                              </Button>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleVisibility(vital.id)}
                              >
                                {vital.visible ? (
                                  <Eye className="h-4 w-4 text-gray-600" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
