/**
 * AUUI Prototype - Healthcare Vitals Monitoring Table
 *
 * This component is managed by AUUI. Chat with the AI to make changes.
 * Changes are applied instantly via Hot Module Replacement (HMR).
 */

import { useState, useMemo } from 'react'
import { Button } from '@/components/atoms/Button'
import { Field } from '@/components/atoms/Field'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/molecules/Tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/organisms/table'
import { Badge } from '@/components/atoms/Badge'
import { SegmentedBadge } from '@/components/atoms/SegmentedBadge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/molecules/Dialog'
import { Label } from '@/components/atoms/Label'
import { Checkbox } from '@/components/atoms/Checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/molecules/DropdownMenu'
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  Calendar,
  Users,
  Activity,
  X,
  Trash2,
  Check,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/molecules/popover'
import { MultiFieldItem } from '@/components/molecules/MultiFieldItem'
import { format } from 'date-fns'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface VitalsRecord {
  id: string
  name: string
  time: Date
  classification: string
  value1: number
  value2: number
  value3: number
  unit1: string
  unit2: string
  unit3: string
  value1Color?: 'green' | 'yellow' | 'red' | 'orange' | 'gray'
  value2Color?: 'green' | 'yellow' | 'red' | 'orange' | 'gray'
  value3Color?: 'green' | 'yellow' | 'red' | 'orange' | 'gray'
  source: 'Healthie' | 'Vital' | 'Elation' | 'Canvas'
  reviewed: boolean
  visible: boolean
  readingType?: 'blood-pressure' | 'weight' | 'glucose' | 'heart-rate' | 'other'
  // Flag fields
  beforeMeal?: boolean // For glucose readings - set by Smart Meter or manual review
  medStatus?: 'Unknown' | 'Before Meds' | 'After Meds' // For blood pressure - set during manual review
  irregularHeartbeat?: boolean // For BPM readings - set during manual review
}

interface FilterState {
  dateRange: { start: string; end: string }
  patients: string[]
  careTeam: string[]
  program: string
  vitalsThreshold: string[]
  reviewed: 'all' | 'reviewed' | 'not-reviewed'
  classification: string[]
  classificationMatch: 'any' | 'all'
  source: string[]
}

interface SavedView {
  id: string
  name: string
  filters: FilterState
}

const mockData: VitalsRecord[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    time: new Date('2026-01-26T09:15:00'),
    classification: 'low',
    value1: 204.81,
    value2: 0,
    value3: 0,
    unit1: 'LB',
    unit2: '',
    unit3: '',
    value1Color: 'yellow',
    source: 'Healthie',
    reviewed: false,
    visible: true,
    readingType: 'weight',
    // No flags - weight reading with no flags set
  },
  {
    id: '2',
    name: 'Michael Chen',
    time: new Date('2026-01-26T08:45:00'),
    classification: 'low',
    value1: 128,
    value2: 52,
    value3: 64,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'green',
    value2Color: 'yellow',
    value3Color: 'green',
    source: 'Vital',
    reviewed: false,
    visible: true,
    readingType: 'blood-pressure',
    medStatus: 'Before Meds', // Blood pressure with medStatus only (1 flag)
    irregularHeartbeat: false, // BPM - both flags present (2 flags total)
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    time: new Date('2026-01-26T08:30:00'),
    classification: 'low',
    value1: 95,
    value2: 58,
    value3: 83,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'yellow',
    value2Color: 'yellow',
    source: 'Elation',
    reviewed: true,
    visible: true,
    readingType: 'blood-pressure',
    // No flags - blood pressure reading
  },
  {
    id: '4',
    name: 'James Wilson',
    time: new Date('2026-01-26T07:20:00'),
    classification: 'low',
    value1: 114,
    value2: 59,
    value3: 61,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'green',
    value2Color: 'yellow',
    value3Color: 'green',
    source: 'Canvas',
    reviewed: false,
    visible: true,
    readingType: 'blood-pressure',
    irregularHeartbeat: true, // BPM flag - 1 flag
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    time: new Date('2026-01-26T07:00:00'),
    classification: 'very high',
    value1: 157,
    value2: 71,
    value3: 52,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'orange',
    value2Color: 'green',
    value3Color: 'yellow',
    source: 'Healthie',
    reviewed: true,
    visible: true,
    readingType: 'blood-pressure',
    medStatus: 'After Meds', // Blood pressure with all 3 flags
    irregularHeartbeat: true,
    beforeMeal: false, // After Meal
  },
  {
    id: '6',
    name: 'David Martinez',
    time: new Date('2026-01-25T22:15:00'),
    classification: 'low',
    value1: 120,
    value2: 58,
    value3: 73,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'green',
    value2Color: 'yellow',
    value3Color: 'green',
    source: 'Vital',
    reviewed: false,
    visible: true,
    readingType: 'blood-pressure',
    // No flags - blood pressure reading
  },
  {
    id: '7',
    name: 'Jennifer Lee',
    time: new Date('2026-01-25T21:45:00'),
    classification: 'low',
    value1: 98,
    value2: 52,
    value3: 65,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'yellow',
    value2Color: 'yellow',
    value3Color: 'green',
    source: 'Elation',
    reviewed: false,
    visible: true,
    readingType: 'blood-pressure',
    beforeMeal: true, // Keep beforeMeal flag (1 flag)
  },
  {
    id: '8',
    name: 'Robert Taylor',
    time: new Date('2026-01-25T20:30:00'),
    classification: 'low',
    value1: 97,
    value2: 57,
    value3: 58,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'yellow',
    value2Color: 'yellow',
    value3Color: 'yellow',
    source: 'Canvas',
    reviewed: true,
    visible: true,
    readingType: 'blood-pressure',
    irregularHeartbeat: false, // BPM reading with 1 flag
  },
  {
    id: '9',
    name: 'Maria Garcia',
    time: new Date('2026-01-25T19:00:00'),
    classification: 'low',
    value1: 103,
    value2: 59,
    value3: 83,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'green',
    value2Color: 'yellow',
    value3Color: 'green',
    source: 'Healthie',
    reviewed: false,
    visible: true,
    readingType: 'blood-pressure',
    medStatus: 'Unknown', // Blood pressure with 1 flag only
  },
  {
    id: '10',
    name: 'Thomas Brown',
    time: new Date('2026-01-25T18:15:00'),
    classification: 'low',
    value1: 128,
    value2: 58,
    value3: 82,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'green',
    value2Color: 'yellow',
    value3Color: 'green',
    source: 'Vital',
    reviewed: true,
    visible: true,
    readingType: 'blood-pressure',
    // No flags - blood pressure reading
  },
  {
    id: '11',
    name: 'Patricia Moore',
    time: new Date('2026-01-25T17:30:00'),
    classification: 'high',
    value1: 185,
    value2: 0,
    value3: 0,
    unit1: 'mg/dL',
    unit2: '',
    unit3: '',
    source: 'Healthie',
    reviewed: false,
    visible: true,
    readingType: 'glucose',
    beforeMeal: false, // Glucose with After Meal (1 flag)
  },
  {
    id: '12',
    name: 'Kevin Zhang',
    time: new Date('2026-01-25T16:45:00'),
    classification: 'normal',
    value1: 130,
    value2: 85,
    value3: 72,
    unit1: 'SBP',
    unit2: 'DBP',
    unit3: 'BPM',
    value1Color: 'green',
    value2Color: 'green',
    value3Color: 'green',
    source: 'Canvas',
    reviewed: false,
    visible: true,
    readingType: 'blood-pressure',
    medStatus: 'Before Meds', // BP flag
    beforeMeal: true, // All three flags present (3 flags total)
    irregularHeartbeat: false, // BPM flag
  },
]

const getClassificationColor = (classification: string): string => {
  switch (classification) {
    case 'critical high':
    case 'critical low':
      return 'bg-red-100 text-red-700 border-red-300'
    case 'very high':
    case 'very low':
      return 'bg-orange-100 text-orange-700 border-orange-300'
    case 'high':
    case 'low':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

const getValueColorFromField = (color?: 'green' | 'yellow' | 'red' | 'orange' | 'gray'): string => {
  switch (color) {
    case 'red':
      return 'text-red-700 font-semibold'
    case 'orange':
      return 'text-orange-700 font-semibold'
    case 'yellow':
      return 'text-yellow-700 font-semibold'
    case 'green':
      return 'text-green-700 font-semibold'
    case 'gray':
      return 'text-gray-700'
    default:
      return 'text-gray-700'
  }
}

const getReadingDisplay = (record: VitalsRecord): string => {
  if (record.readingType === 'blood-pressure') {
    return `${record.value1}/${record.value2} mmHg`
  } else if (record.readingType === 'weight') {
    return `${record.value1} lbs (${record.value2} kg)`
  }
  return '-'
}

const getSegmentStatusFromColor = (color?: 'green' | 'yellow' | 'red' | 'orange' | 'gray'): "success" | "warning" | "error" | "alert" => {
  switch (color) {
    case 'red':
      return 'error'
    case 'orange':
      return 'alert'
    case 'yellow':
      return 'warning'
    case 'green':
      return 'success'
    default:
      return 'success'
  }
}

interface ColumnSortItem {
  id: string
  label: string
  direction: 'asc' | 'desc'
  active: boolean
}

const defaultColumnSort: ColumnSortItem[] = [
  { id: 'name', label: 'Name', direction: 'asc', active: true },
  { id: 'timestamp', label: 'Timestamp', direction: 'asc', active: true },
  { id: 'flags', label: 'Flags', direction: 'asc', active: true },
  { id: 'values', label: 'Values', direction: 'asc', active: true },
  { id: 'classification', label: 'Classification', direction: 'asc', active: true },
  { id: 'source', label: 'Source', direction: 'asc', active: true },
  { id: 'reviewed', label: 'Reviewed', direction: 'asc', active: true },
]

const patients = Array.from(new Set(mockData.map((d) => d.name))).sort()
const careTeamOptions = [
  'Dr. Sarah Miller', 'Max', 'Dr. James Patterson', 'Nurse Emily Chen',
  'Dr. Rachel Green', 'PA Michael Torres', 'Pod A', 'Pod B', 'Pod C',
  'After Hours', 'Day Shift', 'Night Shift',
]
const programOptions = ['Diabetes Management', 'Cardiac Care', 'General Wellness', 'Post-Op Recovery']
const thresholdOptions = ['Critical', 'Warning', 'Normal', 'All']
const classificationOptions = Array.from(new Set(mockData.map((d) => d.classification))).sort()
const sourceOptions = ['Healthie', 'Vital', 'Elation', 'Canvas']

// Pure function — no dependency on component state, safe at module level
const getActiveFlags = (record: VitalsRecord) => {
  const flags: Array<{
    type: 'beforeMeal' | 'medStatus' | 'irregularHeartbeat'
    label: string
    value: boolean | string
  }> = []

  if (typeof record.beforeMeal === 'boolean') {
    flags.push({ type: 'beforeMeal', label: record.beforeMeal ? 'Before Meal' : 'After Meal', value: record.beforeMeal })
  }
  if (typeof record.medStatus === 'string') {
    flags.push({ type: 'medStatus', label: record.medStatus, value: record.medStatus })
  }
  const hasBPM = record.unit1 === 'BPM' || record.unit2 === 'BPM' || record.unit3 === 'BPM'
  if (hasBPM && typeof record.irregularHeartbeat === 'boolean') {
    flags.push({ type: 'irregularHeartbeat', label: record.irregularHeartbeat ? 'Irregular' : 'Regular', value: record.irregularHeartbeat })
  }
  return flags
}

interface SortableColumnItemProps {
  item: ColumnSortItem
  onToggleActive: (id: string) => void
  onToggleDirection: (id: string) => void
}

function SortableColumnItem({ item, onToggleActive, onToggleDirection }: SortableColumnItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-[10px] border border-border p-2 bg-background mb-2">
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing focus:outline-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <span className="flex-1 text-sm">{item.label}</span>
      <button
        type="button"
        onClick={() => item.active && onToggleDirection(item.id)}
        className={`p-1 rounded transition-colors ${item.active ? 'hover:bg-accent cursor-pointer' : 'opacity-30 cursor-default'}`}
      >
        {item.direction === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      <Checkbox
        checked={item.active}
        onCheckedChange={() => onToggleActive(item.id)}
      />
    </div>
  )
}

interface FlagCellProps {
  record: VitalsRecord
  setData: (updater: (prev: VitalsRecord[]) => VitalsRecord[]) => void
}

function FlagCell({ record, setData }: FlagCellProps) {
  const activeFlags = getActiveFlags(record)

  if (activeFlags.length === 0) {
    return <span className="text-gray-400 text-sm">-</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {activeFlags.map((flag) => (
        <Popover key={flag.type}>
          <PopoverTrigger className="inline-flex items-center rounded-full border border-border bg-background text-foreground px-2 h-6 text-xs font-normal hover:bg-muted transition-colors">
            {flag.label}
          </PopoverTrigger>
          <PopoverContent className="p-3 rounded-[10px] min-w-[240px] w-auto" align="start">
            {flag.type === 'medStatus' && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Medication Status</Label>
                <div className="flex flex-col gap-1.5">
                  {(['Unknown', 'Before Meds', 'After Meds'] as const).map((status) => (
                    <Button
                      key={status}
                      variant={record.medStatus === status ? 'default' : 'outline'}
                      className="justify-start px-4 py-2"
                      onClick={() => setData(prev => prev.map(r => r.id === record.id ? { ...r, medStatus: status } : r))}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {flag.type === 'irregularHeartbeat' && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Heart Rhythm</Label>
                <div className="flex flex-col gap-1.5">
                  <Button
                    variant={record.irregularHeartbeat === false ? 'default' : 'outline'}
                    className="justify-start px-4 py-2"
                    onClick={() => setData(prev => prev.map(r => r.id === record.id ? { ...r, irregularHeartbeat: false } : r))}
                  >
                    Regular
                  </Button>
                  <Button
                    variant={record.irregularHeartbeat === true ? 'default' : 'outline'}
                    className="justify-start px-4 py-2"
                    onClick={() => setData(prev => prev.map(r => r.id === record.id ? { ...r, irregularHeartbeat: true } : r))}
                  >
                    Irregular
                  </Button>
                </div>
              </div>
            )}
            {flag.type === 'beforeMeal' && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Meal Timing</Label>
                <div className="flex flex-col gap-1.5">
                  <Button
                    variant={record.beforeMeal === true ? 'default' : 'outline'}
                    className="justify-start px-4 py-2"
                    onClick={() => setData(prev => prev.map(r => r.id === record.id ? { ...r, beforeMeal: true } : r))}
                  >
                    Before Meal
                  </Button>
                  <Button
                    variant={record.beforeMeal === false ? 'default' : 'outline'}
                    className="justify-start px-4 py-2"
                    onClick={() => setData(prev => prev.map(r => r.id === record.id ? { ...r, beforeMeal: false } : r))}
                  >
                    After Meal
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}

export default function Vitals() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState(mockData)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false)
  const [viewName, setViewName] = useState('')
  const [savedViews, setSavedViews] = useState<SavedView[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleColumnSortDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setTempColumnSortOrder((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const [filters, setFilters] = useState<FilterState>({
    dateRange: { start: '', end: '' },
    patients: [],
    careTeam: [],
    program: '',
    vitalsThreshold: [],
    reviewed: 'all',
    classification: [],
    classificationMatch: 'any',
    source: [],
  })

  const [tempFilters, setTempFilters] = useState<FilterState>(filters)
  const [patientSearchQuery, setPatientSearchQuery] = useState('')
  const [careTeamSearchQuery, setCareTeamSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<'timestamp' | 'values' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [columnSortOrder, setColumnSortOrder] = useState<ColumnSortItem[]>(defaultColumnSort)
  const [tempColumnSortOrder, setTempColumnSortOrder] = useState<ColumnSortItem[]>(defaultColumnSort)

  // Toggle flag handlers
  const toggleBeforeMeal = (recordId: string) => {
    setData(prevData =>
      prevData.map(record =>
        record.id === recordId
          ? { ...record, beforeMeal: !record.beforeMeal }
          : record
      )
    )
  }


  const toggleIrregularHeartbeat = (recordId: string) => {
    setData(prevData =>
      prevData.map(record =>
        record.id === recordId
          ? { ...record, irregularHeartbeat: !record.irregularHeartbeat }
          : record
      )
    )
  }

  const handleSort = (column: 'timestamp' | 'values') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const filteredData = useMemo(() => {
    const result = data.filter((record) => {
      const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch && record.visible
    })
    if (!sortColumn) return result
    return [...result].sort((a, b) => {
      if (sortColumn === 'timestamp') {
        return sortDirection === 'asc'
          ? a.time.getTime() - b.time.getTime()
          : b.time.getTime() - a.time.getTime()
      }
      return sortDirection === 'asc' ? a.value1 - b.value1 : b.value1 - a.value1
    })
  }, [data, searchQuery, sortColumn, sortDirection])

  const toggleVisibility = (id: string) => {
    setData(data.map((record) =>
      record.id === id ? { ...record, visible: !record.visible } : record
    ))
  }

  const toggleReviewed = (id: string) => {
    setData(data.map((record) =>
      record.id === id ? { ...record, reviewed: !record.reviewed } : record
    ))
  }

  const applyFilters = () => {
    setFilters(tempFilters)
    setColumnSortOrder(tempColumnSortOrder)
    setFilterDialogOpen(false)
  }

  const hasActiveSorts = JSON.stringify(columnSortOrder) !== JSON.stringify(defaultColumnSort)

  const toggleClassification = (classification: string) => {
    setTempFilters((prev) => ({
      ...prev,
      classification: prev.classification.includes(classification)
        ? prev.classification.filter((c) => c !== classification)
        : [...prev.classification, classification]
    }))
  }

  const toggleSource = (source: string) => {
    setTempFilters((prev) => ({
      ...prev,
      source: prev.source.includes(source)
        ? prev.source.filter((s) => s !== source)
        : [...prev.source, source]
    }))
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      dateRange: { start: '', end: '' },
      patients: [],
      careTeam: [],
      program: '',
      vitalsThreshold: [],
      reviewed: 'all',
      classification: [],
      classificationMatch: 'any',
      source: [],
    }
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
  }

  const hasActiveFilters = useMemo(() => !!(
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.patients.length > 0 ||
    filters.careTeam.length > 0 ||
    filters.program ||
    filters.vitalsThreshold.length > 0 ||
    filters.reviewed !== 'all' ||
    filters.classification.length > 0 ||
    filters.source.length > 0
  ), [filters])

  const activeFilterCount = useMemo(() =>
    (filters.dateRange.start ? 1 : 0) +
    (filters.dateRange.end ? 1 : 0) +
    (filters.patients.length > 0 ? 1 : 0) +
    (filters.careTeam.length > 0 ? 1 : 0) +
    (filters.program ? 1 : 0) +
    (filters.classification.length > 0 ? 1 : 0) +
    (filters.source.length > 0 ? 1 : 0) +
    (filters.vitalsThreshold.length > 0 ? 1 : 0) +
    (filters.reviewed !== 'all' ? 1 : 0),
  [filters])

  const hasModifiedFilters = useMemo(() =>
    tempFilters.dateRange.start !== filters.dateRange.start ||
    tempFilters.dateRange.end !== filters.dateRange.end ||
    JSON.stringify([...tempFilters.patients].sort()) !== JSON.stringify([...filters.patients].sort()) ||
    JSON.stringify([...tempFilters.careTeam].sort()) !== JSON.stringify([...filters.careTeam].sort()) ||
    tempFilters.program !== filters.program ||
    JSON.stringify([...tempFilters.vitalsThreshold].sort()) !== JSON.stringify([...filters.vitalsThreshold].sort()) ||
    tempFilters.reviewed !== filters.reviewed,
  [tempFilters, filters])

  const togglePatient = (patient: string) => {
    setTempFilters((prev) => ({
      ...prev,
      patients: prev.patients.includes(patient)
        ? prev.patients.filter((p) => p !== patient)
        : [...prev.patients, patient],
    }))
  }

  const toggleCareTeam = (team: string) => {
    setTempFilters((prev) => ({
      ...prev,
      careTeam: prev.careTeam.includes(team)
        ? prev.careTeam.filter((t) => t !== team)
        : [...prev.careTeam, team],
    }))
  }

  const toggleVitalsThreshold = (threshold: string) => {
    setTempFilters((prev) => ({
      ...prev,
      vitalsThreshold: prev.vitalsThreshold.includes(threshold)
        ? prev.vitalsThreshold.filter((t) => t !== threshold)
        : [...prev.vitalsThreshold, threshold],
    }))
  }

  const saveView = () => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name: viewName,
      filters: filters,
    }
    setSavedViews((prev) => [...prev, newView])
    setActiveTab(newView.id)
    setViewName('')
    setSaveViewDialogOpen(false)
  }

  const saveEditedView = () => {
    if (activeTab === 'all') return

    const updatedView: SavedView = {
      id: activeTab,
      name: savedViews.find((v) => v.id === activeTab)?.name || '',
      filters: tempFilters,
    }

    setSavedViews((prev) =>
      prev.map((v) => (v.id === activeTab ? updatedView : v))
    )
    setFilters(tempFilters)
    setFilterDialogOpen(false)
  }

  const loadView = (viewId: string) => {
    if (viewId === 'all') {
      clearFilters()
      setActiveTab('all')
    } else {
      const view = savedViews.find((v) => v.id === viewId)
      if (view) {
        setFilters(view.filters)
        setTempFilters(view.filters)
        setActiveTab(viewId)
      }
    }
  }

  const getViewItemCount = (viewId: string): number => {
    if (viewId === 'all') {
      return data.length
    }
    const view = savedViews.find((v) => v.id === viewId)
    if (!view) return 0

    // Apply view's filters to get count
    return data.filter((record) => {
      // Apply patient filter
      if (view.filters.patients.length > 0 && !view.filters.patients.includes(record.name)) {
        return false
      }
      // Add other filter logic as needed
      return true
    }).length
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Main Card */}
        <div className="rounded-lg">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={loadView} className="w-full">
            <div>
              <TabsList className="gap-4">
                <TabsTrigger value="all" className="px-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700">
                  All
                  <Badge variant="secondary" className={activeTab === 'all' ? "ml-2 bg-red-600 text-white" : "ml-2 bg-gray-200 text-black"}>
                    {data.length}
                  </Badge>
                </TabsTrigger>
                {savedViews.map((view) => (
                  <TabsTrigger key={view.id} value={view.id} className="px-1 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700">
                    {view.name}
                    <Badge variant="secondary" className={activeTab === view.id ? "ml-2 bg-red-600 text-white" : "ml-2 bg-gray-200 text-black"}>
                      {getViewItemCount(view.id)}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Controls */}
            <div className="py-6 border-b">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search by patient name..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                    }}
                    className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTempFilters(filters)
                    setTempColumnSortOrder(columnSortOrder)
                    setFilterDialogOpen(true)
                  }}
                  className="gap-2"
                >
                  <span className="relative">
                    <Filter className="h-4 w-4" />
                    {hasActiveFilters && (
                      <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-primary" />
                    )}
                  </span>
                  {hasActiveSorts && (
                    <span className="relative">
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-primary" />
                    </span>
                  )}
                </Button>
                {activeTab !== 'all' ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSavedViews((prev) => prev.filter((v) => v.id !== activeTab))
                      setActiveTab('all')
                      clearFilters()
                    }}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete View
                  </Button>
                ) : hasActiveFilters ? (
                  <Button
                    variant="outline"
                    onClick={() => setSaveViewDialogOpen(true)}
                    className="gap-2"
                  >
                    Save as View
                  </Button>
                ) : null}
              </div>
            </div>

            {/* Table Content */}
            <TabsContent value={activeTab} className="m-0 p-2">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Name</TableHead>
                      <TableHead className="w-[200px]">
                        <button
                          onClick={() => handleSort('timestamp')}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          Timestamp
                          {sortColumn === 'timestamp' ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                          )}
                        </button>
                      </TableHead>
                      <TableHead className="w-[140px]">Flags</TableHead>
                      <TableHead>
                        <button
                          onClick={() => handleSort('values')}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          Values
                          {sortColumn === 'values' ? (
                            sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                          )}
                        </button>
                      </TableHead>
                      <TableHead className="w-[160px]">Classification</TableHead>
                      <TableHead className="w-[100px]">Source</TableHead>
                      <TableHead className="w-[120px] text-center">Reviewed</TableHead>
                      <TableHead className="w-[80px] text-center">Visible</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                          No records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.name}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {format(record.time, 'MM/dd/yyyy hh:mm a')} PST
                          </TableCell>
                          <TableCell>
                            <FlagCell
                              record={record}
                              setData={setData}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex">
                              <SegmentedBadge
                                segments={[
                                  {
                                    value: record.value1,
                                    unit: record.unit1,
                                    status: getSegmentStatusFromColor(record.value1Color)
                                  },
                                  {
                                    value: record.value2,
                                    unit: record.unit2,
                                    status: getSegmentStatusFromColor(record.value2Color)
                                  },
                                  {
                                    value: record.value3,
                                    unit: record.unit3,
                                    status: getSegmentStatusFromColor(record.value3Color)
                                  }
                                ].filter(segment => segment.value !== 0 && segment.unit !== '')}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getClassificationColor(record.classification)}>
                              {record.classification}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-500"
                            >
                              {record.source}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`cursor-pointer transition-colors ${
                                record.reviewed
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : 'bg-gray-100 text-gray-500 border-gray-300'
                              }`}
                              onClick={() => toggleReviewed(record.id)}
                            >
                              {record.reviewed && <Check className="h-3 w-3 mr-1" />}
                              {record.reviewed ? 'Reviewed' : 'Not Reviewed'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVisibility(record.id)}
                            >
                              {record.visible ? (
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
          </Tabs>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent
          className="max-w-2xl max-h-[80vh] flex flex-col"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Filter Vitals</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down the vitals records
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 px-4 overflow-y-auto flex-1">
            {/* Date Range */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${tempFilters.dateRange.start || tempFilters.dateRange.end ? 'text-green-600' : ''}`}>
                <Calendar className={`h-4 w-4 ${tempFilters.dateRange.start || tempFilters.dateRange.end ? 'text-green-600' : ''}`} />
                Date Range
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start Date">
                  <input
                    type="date"
                    value={tempFilters.dateRange.start}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value },
                      }))
                    }
                    className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </Field>
                <Field label="End Date">
                  <input
                    type="date"
                    value={tempFilters.dateRange.end}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value },
                      }))
                    }
                    className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </Field>
              </div>
            </div>

            {/* Column Sort Order */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className={`flex items-center gap-2 ${JSON.stringify(tempColumnSortOrder) !== JSON.stringify(defaultColumnSort) ? 'text-green-600' : ''}`}>
                  <ArrowUpDown className={`h-4 w-4 ${JSON.stringify(tempColumnSortOrder) !== JSON.stringify(defaultColumnSort) ? 'text-green-600' : ''}`} />
                  Column Sort Order
                </Label>
                {JSON.stringify(tempColumnSortOrder) !== JSON.stringify(defaultColumnSort) && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                    onClick={() => setTempColumnSortOrder(defaultColumnSort)}
                  >
                    Reset to default
                  </button>
                )}
              </div>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleColumnSortDragEnd}
              >
                <SortableContext
                  items={tempColumnSortOrder.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {tempColumnSortOrder.map((col) => (
                    <SortableColumnItem
                      key={col.id}
                      item={col}
                      onToggleActive={(id) =>
                        setTempColumnSortOrder((prev) =>
                          prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
                        )
                      }
                      onToggleDirection={(id) =>
                        setTempColumnSortOrder((prev) =>
                          prev.map((c) =>
                            c.id === id
                              ? { ...c, direction: c.direction === 'asc' ? 'desc' : 'asc' }
                              : c
                          )
                        )
                      }
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            {/* Patient Selector */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${tempFilters.patients.length > 0 ? 'text-green-600' : ''}`}>
                <Users className={`h-4 w-4 ${tempFilters.patients.length > 0 ? 'text-green-600' : ''}`} />
                Patients
              </Label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-8">
                      {tempFilters.patients.length === 0
                        ? "Select patients"
                        : `${tempFilters.patients.length} selected`}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 max-h-[300px] overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <div className="p-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="Search patients..."
                        value={patientSearchQuery}
                        onChange={(e) => setPatientSearchQuery(e.target.value)}
                        className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    {patients.filter(patient => patient.toLowerCase().includes(patientSearchQuery.toLowerCase())).map((patient) => (
                      <DropdownMenuCheckboxItem
                        key={patient}
                        checked={tempFilters.patients.includes(patient)}
                        onCheckedChange={() => togglePatient(patient)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {patient}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {tempFilters.patients.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tempFilters.patients.map((patient) => (
                      <Badge
                        key={patient}
                        variant="secondary"
                        className="text-xs gap-1"
                      >
                        {patient}
                        <button
                          onClick={() => togglePatient(patient)}
                          className="ml-1 hover:bg-gray-300 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Care Team Filter */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${tempFilters.careTeam.length > 0 ? 'text-green-600' : ''}`}>
                <Activity className={`h-4 w-4 ${tempFilters.careTeam.length > 0 ? 'text-green-600' : ''}`} />
                Care Team
              </Label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-8">
                      {tempFilters.careTeam.length === 0
                        ? "Select care teams"
                        : `${tempFilters.careTeam.length} selected`}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <div className="p-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="Search care teams..."
                        value={careTeamSearchQuery}
                        onChange={(e) => setCareTeamSearchQuery(e.target.value)}
                        className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    {careTeamOptions.filter(team => team.toLowerCase().includes(careTeamSearchQuery.toLowerCase())).map((team) => (
                      <DropdownMenuCheckboxItem
                        key={team}
                        checked={tempFilters.careTeam.includes(team)}
                        onCheckedChange={() => toggleCareTeam(team)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {team}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {tempFilters.careTeam.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tempFilters.careTeam.map((team) => (
                      <Badge
                        key={team}
                        variant="secondary"
                        className="text-xs gap-1"
                      >
                        {team}
                        <button
                          onClick={() => toggleCareTeam(team)}
                          className="ml-1 hover:bg-gray-300 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Program and Values Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={tempFilters.program ? 'text-green-600' : ''}>Program</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-8">
                      {tempFilters.program || "Select program"}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {programOptions.map((program) => (
                      <DropdownMenuItem
                        key={program}
                        onClick={() => setTempFilters((prev) => ({ ...prev, program }))}
                      >
                        {program}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2">
                <Label className={tempFilters.vitalsThreshold.length > 0 ? 'text-green-600' : ''}>Vitals Threshold</Label>
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-8">
                        {tempFilters.vitalsThreshold.length === 0
                          ? "Select thresholds"
                          : `${tempFilters.vitalsThreshold.length} selected`}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                      {thresholdOptions.map((threshold) => (
                        <DropdownMenuCheckboxItem
                          key={threshold}
                          checked={tempFilters.vitalsThreshold.includes(threshold)}
                          onCheckedChange={() => toggleVitalsThreshold(threshold)}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {threshold}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {tempFilters.vitalsThreshold.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tempFilters.vitalsThreshold.map((threshold) => (
                        <Badge
                          key={threshold}
                          variant="secondary"
                          className="text-xs gap-1"
                        >
                          {threshold}
                          <button
                            onClick={() => toggleVitalsThreshold(threshold)}
                            className="ml-1 hover:bg-gray-300 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Classification Filter */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${tempFilters.classification.length > 0 ? 'text-green-600' : ''}`}>
                Classification
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Match Type</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-8">
                        {tempFilters.classificationMatch === 'any' ? 'Any of' : 'All of'}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-32">
                      <DropdownMenuItem
                        onClick={() => setTempFilters((prev) => ({ ...prev, classificationMatch: 'any' }))}
                      >
                        Any of
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTempFilters((prev) => ({ ...prev, classificationMatch: 'all' }))}
                      >
                        All of
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-500">Select Triggers</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between h-8">
                        {tempFilters.classification.length === 0
                          ? "Select"
                          : `${tempFilters.classification.length} selected`}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                      {classificationOptions.map((classification) => (
                        <DropdownMenuCheckboxItem
                          key={classification}
                          checked={tempFilters.classification.includes(classification)}
                          onCheckedChange={() => toggleClassification(classification)}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {classification}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {tempFilters.classification.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tempFilters.classification.map((classification) => (
                    <Badge
                      key={classification}
                      variant="secondary"
                      className="text-xs gap-1"
                    >
                      {classification}
                      <button
                        onClick={() => toggleClassification(classification)}
                        className="ml-1 hover:bg-gray-300 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Source Filter */}
            <div className="space-y-2">
              <Label className={`flex items-center gap-2 ${tempFilters.source.length > 0 ? 'text-green-600' : ''}`}>
                Source
              </Label>
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between h-8">
                      {tempFilters.source.length === 0
                        ? "Select sources"
                        : `${tempFilters.source.length} selected`}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                    {sourceOptions.map((source) => (
                      <DropdownMenuCheckboxItem
                        key={source}
                        checked={tempFilters.source.includes(source)}
                        onCheckedChange={() => toggleSource(source)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {source}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {tempFilters.source.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tempFilters.source.map((source) => (
                      <Badge
                        key={source}
                        variant="secondary"
                        className="text-xs gap-1"
                      >
                        {source}
                        <button
                          onClick={() => toggleSource(source)}
                          className="ml-1 hover:bg-gray-300 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reviewed Status Filter */}
            <div className="space-y-2">
              <Label className={tempFilters.reviewed !== 'all' ? 'text-green-600' : ''}>Reviewed Status</Label>
              <div className="flex gap-2">
                <Badge
                  variant={tempFilters.reviewed === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setTempFilters((prev) => ({ ...prev, reviewed: 'all' }))}
                >
                  All
                </Badge>
                <Badge
                  variant={tempFilters.reviewed === 'reviewed' ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setTempFilters((prev) => ({ ...prev, reviewed: 'reviewed' }))}
                >
                  Reviewed
                </Badge>
                <Badge
                  variant={tempFilters.reviewed === 'not-reviewed' ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setTempFilters((prev) => ({ ...prev, reviewed: 'not-reviewed' }))}
                >
                  Not Reviewed
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={clearFilters}>
              Clear All
            </Button>
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
            {activeTab !== 'all' && (
              <Button
                onClick={saveEditedView}
                disabled={!hasModifiedFilters}
              >
                Save edited view
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save View Dialog */}
      <Dialog open={saveViewDialogOpen} onOpenChange={setSaveViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Current View</DialogTitle>
            <DialogDescription>
              Give your filtered view a name to quickly access it later
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-4">
            <Field label="View Name">
              <input
                type="text"
                placeholder="e.g., High Priority Patients"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </Field>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveViewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveView} disabled={!viewName.trim()}>
              Save View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

