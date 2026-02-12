/**
 * AUUI Prototype - Healthcare Vitals Monitoring Table
 *
 * This component is managed by AUUI. Chat with the AI to make changes.
 * Changes are applied instantly via Hot Module Replacement (HMR).
 */

import { useState } from 'react'
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/molecules/Drawer'
import { Label } from '@/components/atoms/Label'
import { Checkbox } from '@/components/ui/checkbox'
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
  Flag,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings,
  Pencil,
  Plus,
  GripVertical,
} from 'lucide-react'
import { Switch } from '@/components/atoms/switch'
import { MultiFieldItem } from '@/components/molecules/MultiFieldItem'
import { Item, ItemContent, ItemTitle, ItemDescription } from '@/components/molecules/Item'
import { format } from 'date-fns'
import { ArrowLeft, Info } from 'lucide-react'
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

interface ProgramItem {
  id: string
  title: string
  vitalsThresholds: string[]
}

interface SortableProgramItemProps {
  item: ProgramItem
  onDelete: () => void
  onUpdate: (id: string, field: 'title' | 'vitalsThresholds', value: string | string[]) => void
  toggleThreshold: (programId: string, threshold: string) => void
  thresholdOptions: string[]
}

interface SortableRangeItemProps {
  item: {
    id: string
    target: string
    operator: string
    value: string
    trend: string
  }
  onDelete: () => void
  onUpdate: (id: string, field: string, value: string) => void
  targetOptions: string[]
  operatorOptions: string[]
  trendOptions: string[]
}

function SortableRangeItem({ item, onDelete, onUpdate, targetOptions, operatorOptions, trendOptions }: SortableRangeItemProps) {
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
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="flex items-center gap-2 rounded-[10px] border border-border p-2 bg-background">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing focus:outline-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1 grid grid-cols-4 gap-2">
          <Select value={item.target} onValueChange={(value) => onUpdate(item.id, 'target', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Target" />
            </SelectTrigger>
            <SelectContent>
              {targetOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={item.operator} onValueChange={(value) => onUpdate(item.id, 'operator', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
              {operatorOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="text"
            value={item.value}
            onChange={(e) => onUpdate(item.id, 'value', e.target.value)}
            placeholder="Value"
            className="flex h-8 rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Select value={item.trend} onValueChange={(value) => onUpdate(item.id, 'trend', value)}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Trend" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {trendOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="focus:outline-none"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

function SortableProgramItem({ item, onDelete, onUpdate, toggleThreshold, thresholdOptions }: SortableProgramItemProps) {
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
    <div ref={setNodeRef} style={style} className="mb-4">
      <div
        className="flex items-center gap-2 rounded-[10px] border border-border p-2 bg-background"
      >
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing focus:outline-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={item.title}
            onChange={(e) => onUpdate(item.id, 'title', e.target.value)}
            placeholder="Program title"
            className="flex h-8 flex-1 rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="relative flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-8">
                  {item.vitalsThresholds.length === 0
                    ? "Select vitals thresholds"
                    : item.vitalsThresholds.join(', ')}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                {thresholdOptions.map((threshold) => (
                  <DropdownMenuCheckboxItem
                    key={threshold}
                    checked={item.vitalsThresholds.includes(threshold)}
                    onCheckedChange={() => toggleThreshold(item.id, threshold)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {threshold}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="focus:outline-none"
        >
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

export default function Vitals() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [data, setData] = useState(mockData)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [saveViewDialogOpen, setSaveViewDialogOpen] = useState(false)
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false)
  const [flagsModalOpen, setFlagsModalOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [viewName, setViewName] = useState('')
  const [savedViews, setSavedViews] = useState<SavedView[]>([])

  // Settings state
  const [drawerView, setDrawerView] = useState<'settings' | 'edit-programs' | 'create-config'>('settings')
  const [showVitalsTab, setShowVitalsTab] = useState(true)
  const [requireInvalidationReason, setRequireInvalidationReason] = useState(false)
  const [delayedReadingInterval, setDelayedReadingInterval] = useState('15')
  const [newInvalidationReason, setNewInvalidationReason] = useState('')
  const [invalidationReasons, setInvalidationReasons] = useState<string[]>(['Device malfunction', 'Patient error', 'Data entry error'])
  const [vitalsConfigurations, setVitalsConfigurations] = useState([
    { id: '1', name: 'Blood Glucose' },
    { id: '2', name: 'DBP' }
  ])

  // Program items state
  const [programItems, setProgramItems] = useState<ProgramItem[]>([
    { id: '1', title: 'Hypertension Management', vitalsThresholds: ['Critical', 'Warning'] },
    { id: '2', title: 'Diabetes Care', vitalsThresholds: ['Critical'] }
  ])
  const [originalProgramItems, setOriginalProgramItems] = useState<ProgramItem[]>([
    { id: '1', title: 'Hypertension Management', vitalsThresholds: ['Critical', 'Warning'] },
    { id: '2', title: 'Diabetes Care', vitalsThresholds: ['Critical'] }
  ])

  // Vital configuration state
  interface RangeItem {
    id: string
    target: string
    operator: string
    value: string
    trend: string
  }
  const [configTitle, setConfigTitle] = useState('')
  const [configUnit, setConfigUnit] = useState('')
  const [rangeItems, setRangeItems] = useState<RangeItem[]>([])
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null)
  const [originalConfigState, setOriginalConfigState] = useState({
    configTitle: '',
    configUnit: '',
    rangeItems: [] as RangeItem[]
  })

  // Original settings for comparison
  const [originalSettings, setOriginalSettings] = useState({
    showVitalsTab: true,
    requireInvalidationReason: false,
    delayedReadingInterval: '15',
    invalidationReasons: ['Device malfunction', 'Patient error', 'Data entry error'],
    vitalsConfigurations: [
      { id: '1', name: 'Blood Glucose' },
      { id: '2', name: 'DBP' }
    ]
  })

  const hasSettingsChanged =
    showVitalsTab !== originalSettings.showVitalsTab ||
    requireInvalidationReason !== originalSettings.requireInvalidationReason ||
    delayedReadingInterval !== originalSettings.delayedReadingInterval ||
    JSON.stringify(invalidationReasons) !== JSON.stringify(originalSettings.invalidationReasons) ||
    JSON.stringify(vitalsConfigurations) !== JSON.stringify(originalSettings.vitalsConfigurations)

  const hasProgramsChanged =
    JSON.stringify(programItems) !== JSON.stringify(originalProgramItems)

  const saveSettings = () => {
    setOriginalSettings({
      showVitalsTab,
      requireInvalidationReason,
      delayedReadingInterval,
      invalidationReasons,
      vitalsConfigurations
    })
    setSettingsDrawerOpen(false)
    setDrawerView('settings')
  }

  const savePrograms = () => {
    setOriginalProgramItems(programItems)
    setDrawerView('settings')
  }

  const addProgramItem = () => {
    const newItem: ProgramItem = {
      id: Date.now().toString(),
      title: '',
      vitalsThresholds: []
    }
    setProgramItems([...programItems, newItem])
  }

  const updateProgramItem = (id: string, field: 'title' | 'vitalsThresholds', value: string | string[]) => {
    setProgramItems(programItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const deleteProgramItem = (id: string) => {
    setProgramItems(programItems.filter(item => item.id !== id))
  }

  const toggleProgramThreshold = (programId: string, threshold: string) => {
    setProgramItems(programItems.map(item =>
      item.id === programId
        ? {
            ...item,
            vitalsThresholds: item.vitalsThresholds.includes(threshold)
              ? item.vitalsThresholds.filter(t => t !== threshold)
              : [...item.vitalsThresholds, threshold]
          }
        : item
    ))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setProgramItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const hasConfigChanged =
    configTitle !== originalConfigState.configTitle ||
    configUnit !== originalConfigState.configUnit ||
    JSON.stringify(rangeItems) !== JSON.stringify(originalConfigState.rangeItems)

  const addRangeItem = () => {
    const newItem: RangeItem = {
      id: Date.now().toString(),
      target: '',
      operator: '',
      value: '',
      trend: ''
    }
    setRangeItems([...rangeItems, newItem])
  }

  const updateRangeItem = (id: string, field: keyof RangeItem, value: string) => {
    setRangeItems(rangeItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const deleteRangeItem = (id: string) => {
    setRangeItems(rangeItems.filter(item => item.id !== id))
  }

  const handleRangeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setRangeItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const saveConfiguration = () => {
    if (editingConfigId) {
      // Update existing configuration
      setVitalsConfigurations(vitalsConfigurations.map(config =>
        config.id === editingConfigId ? { ...config, name: configTitle } : config
      ))
      setEditingConfigId(null)
    }
    setOriginalConfigState({
      configTitle,
      configUnit,
      rangeItems
    })
    setConfigTitle('')
    setConfigUnit('')
    setRangeItems([])
    setDrawerView('settings')
  }

  const openEditConfiguration = (configId: string) => {
    const config = vitalsConfigurations.find(c => c.id === configId)
    if (config) {
      setConfigTitle(config.name)
      setConfigUnit('mmHg') // Default unit, could be stored with config
      setRangeItems([]) // Would load actual ranges if stored
      setEditingConfigId(configId)
      setOriginalConfigState({
        configTitle: config.name,
        configUnit: 'mmHg',
        rangeItems: []
      })
      setDrawerView('create-config')
    }
  }

  const targetOptions = ['High', 'Low', 'Very High', 'Very Low', 'Critical High', 'Critical Low']
  const operatorOptions = ['Less Than', 'Greater Than', 'Between']
  const trendOptions = Array.from({ length: 365 }, (_, i) => `Within ${i + 1} day${i === 0 ? '' : 's'}`)

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

  // Get active flags for a record
  const getActiveFlags = (record: VitalsRecord) => {
    const flags: Array<{
      type: 'beforeMeal' | 'medStatus' | 'irregularHeartbeat'
      label: string
      value: boolean | string
    }> = []

    // Check for glucose beforeMeal flag
    if (typeof record.beforeMeal === 'boolean') {
      flags.push({
        type: 'beforeMeal',
        label: record.beforeMeal ? 'Before Meal' : 'After Meal',
        value: record.beforeMeal
      })
    }

    // Check for blood pressure medStatus flag
    if (typeof record.medStatus === 'string') {
      flags.push({
        type: 'medStatus',
        label: record.medStatus,
        value: record.medStatus
      })
    }

    // Check for BPM irregularHeartbeat flag
    const hasBPM = record.unit1 === 'BPM' || record.unit2 === 'BPM' || record.unit3 === 'BPM'
    if (hasBPM && typeof record.irregularHeartbeat === 'boolean') {
      flags.push({
        type: 'irregularHeartbeat',
        label: record.irregularHeartbeat ? 'Irregular' : 'Regular',
        value: record.irregularHeartbeat
      })
    }

    return flags
  }

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

  const setMedStatus = (recordId: string, status: 'Unknown' | 'Before Meds' | 'After Meds') => {
    setData(prevData =>
      prevData.map(record =>
        record.id === recordId
          ? { ...record, medStatus: status }
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

  const patients = Array.from(new Set(mockData.map((d) => d.name))).sort()
  const careTeamOptions = [
    'Dr. Sarah Miller',
    'Max',
    'Dr. James Patterson',
    'Nurse Emily Chen',
    'Dr. Rachel Green',
    'PA Michael Torres',
    'Pod A',
    'Pod B',
    'Pod C',
    'After Hours',
    'Day Shift',
    'Night Shift'
  ]
  const programOptions = ['Diabetes Management', 'Cardiac Care', 'General Wellness', 'Post-Op Recovery']
  const thresholdOptions = ['Critical', 'Warning', 'Normal', 'All']
  const classificationOptions = Array.from(new Set(mockData.map((d) => d.classification))).sort()
  const sourceOptions = ['Healthie', 'Vital', 'Elation', 'Canvas']

  const handleSort = (column: 'timestamp' | 'values') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  let filteredData = data.filter((record) => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && record.visible
  })

  // Apply sorting
  if (sortColumn) {
    filteredData = [...filteredData].sort((a, b) => {
      if (sortColumn === 'timestamp') {
        const timeA = a.time.getTime()
        const timeB = b.time.getTime()
        return sortDirection === 'asc' ? timeA - timeB : timeB - timeA
      } else if (sortColumn === 'values') {
        const valueA = a.value1
        const valueB = b.value1
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA
      }
      return 0
    })
  }

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
    setFilterDialogOpen(false)
  }

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

  const hasActiveFilters =
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.patients.length > 0 ||
    filters.careTeam.length > 0 ||
    filters.program ||
    filters.vitalsThreshold.length > 0 ||
    filters.reviewed !== 'all' ||
    filters.classification.length > 0 ||
    filters.source.length > 0

  const activeFilterCount =
    (filters.dateRange.start ? 1 : 0) +
    (filters.dateRange.end ? 1 : 0) +
    (filters.patients.length > 0 ? 1 : 0) +
    (filters.careTeam.length > 0 ? 1 : 0) +
    (filters.program ? 1 : 0) +
    (filters.classification.length > 0 ? 1 : 0) +
    (filters.source.length > 0 ? 1 : 0) +
    (filters.vitalsThreshold.length > 0 ? 1 : 0) +
    (filters.reviewed !== 'all' ? 1 : 0)

  const hasModifiedFilters =
    tempFilters.dateRange.start !== filters.dateRange.start ||
    tempFilters.dateRange.end !== filters.dateRange.end ||
    JSON.stringify(tempFilters.patients.sort()) !== JSON.stringify(filters.patients.sort()) ||
    JSON.stringify(tempFilters.careTeam.sort()) !== JSON.stringify(filters.careTeam.sort()) ||
    tempFilters.program !== filters.program ||
    JSON.stringify(tempFilters.vitalsThreshold.sort()) !== JSON.stringify(filters.vitalsThreshold.sort()) ||
    tempFilters.reviewed !== filters.reviewed

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
            <div className="pt-6">
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
                  onClick={() => setSettingsDrawerOpen(true)}
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFilterDialogOpen(true)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {activeFilterCount}
                    </Badge>
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
                            {(() => {
                              const activeFlags = getActiveFlags(record)

                              if (activeFlags.length === 0) {
                                // No flags - show nothing
                                return <span className="text-gray-400 text-sm">-</span>
                              } else if (activeFlags.length === 1) {
                                // Single flag - inline dropdown editor
                                const flag = activeFlags[0]
                                return (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="default"
                                        className="h-8 border"
                                      >
                                        {flag.label}
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                      {flag.type === 'beforeMeal' && (
                                        <>
                                          <DropdownMenuLabel>Meal Timing</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => {
                                            setData(prevData =>
                                              prevData.map(r =>
                                                r.id === record.id ? { ...r, beforeMeal: true } : r
                                              )
                                            )
                                          }}>
                                            Before Meal
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => {
                                            setData(prevData =>
                                              prevData.map(r =>
                                                r.id === record.id ? { ...r, beforeMeal: false } : r
                                              )
                                            )
                                          }}>
                                            After Meal
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                      {flag.type === 'medStatus' && (
                                        <>
                                          <DropdownMenuLabel>Medication Status</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => setMedStatus(record.id, 'Unknown')}>
                                            Unknown
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => setMedStatus(record.id, 'Before Meds')}>
                                            Before Meds
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => setMedStatus(record.id, 'After Meds')}>
                                            After Meds
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                      {flag.type === 'irregularHeartbeat' && (
                                        <>
                                          <DropdownMenuLabel>Heart Rhythm</DropdownMenuLabel>
                                          <DropdownMenuSeparator />
                                          <DropdownMenuItem onClick={() => {
                                            setData(prevData =>
                                              prevData.map(r =>
                                                r.id === record.id ? { ...r, irregularHeartbeat: true } : r
                                              )
                                            )
                                          }}>
                                            Irregular
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => {
                                            setData(prevData =>
                                              prevData.map(r =>
                                                r.id === record.id ? { ...r, irregularHeartbeat: false } : r
                                              )
                                            )
                                          }}>
                                            Regular
                                          </DropdownMenuItem>
                                        </>
                                      )}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )
                              } else {
                                // Multiple flags - flag icon with badge count, opens modal
                                return (
                                  <Button
                                    variant="outline"
                                    size="default"
                                    className="h-8 border gap-1"
                                    onClick={() => {
                                      setSelectedRecordId(record.id)
                                      setFlagsModalOpen(true)
                                    }}
                                  >
                                    <Flag className="h-4 w-4" />
                                    <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                                      {activeFlags.length}
                                    </Badge>
                                  </Button>
                                )
                              }
                            })()}
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
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
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

            {/* Patient Selector */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
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
              <Label className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
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
                <Label>Program</Label>
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
                <Label>Vitals Threshold</Label>
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
              <Label className="flex items-center gap-2">
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
              <Label className="flex items-center gap-2">
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
              <Label>Reviewed Status</Label>
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

      {/* Settings Drawer */}
      <Drawer
        open={settingsDrawerOpen}
        dismissible={false}
        onOpenChange={(open) => {
          setSettingsDrawerOpen(open)
          if (!open) {
            setDrawerView('settings')
          }
        }}
      >
        <DrawerContent
          hideHandle={true}
          onOverlayClick={() => {
            setSettingsDrawerOpen(false)
            setDrawerView('settings')
          }}
        >
          <DrawerHeader>
            <div className="flex items-center gap-2">
              {(drawerView === 'edit-programs' || drawerView === 'create-config') && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setDrawerView('settings')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex-1">
                <DrawerTitle>
                  {drawerView === 'settings' ? 'Settings' : drawerView === 'edit-programs' ? 'Edit Programs' : editingConfigId ? 'Edit Vital Configuration' : 'Create Vital Configuration'}
                </DrawerTitle>
                <DrawerDescription>
                  {drawerView === 'settings'
                    ? 'Configure your vitals monitoring preferences'
                    : drawerView === 'edit-programs'
                    ? 'Manage program titles and vitals thresholds'
                    : 'Define configuration parameters and ranges'}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="p-6 pb-0 space-y-6" style={{ maxHeight: '60vh', display: 'flex', flexDirection: 'column' }}>
            {drawerView === 'settings' ? (
              <div className="overflow-y-auto space-y-6">
                {/* Switches Section */}
                <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Vitals Tab</Label>
                  <p className="text-sm text-muted-foreground">Display vitals tab in the interface</p>
                </div>
                <Switch
                  checked={showVitalsTab}
                  onCheckedChange={setShowVitalsTab}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require Reason When Invalidating Observations</Label>
                  <p className="text-sm text-muted-foreground">Users must provide a reason to invalidate data</p>
                </div>
                <Switch
                  checked={requireInvalidationReason}
                  onCheckedChange={setRequireInvalidationReason}
                />
              </div>
            </div>

            {/* Delayed Reading Interval */}
            <div className="space-y-2">
              <Label htmlFor="delayed-interval">Delayed Reading Interval (minutes)</Label>
              <input
                id="delayed-interval"
                type="number"
                value={delayedReadingInterval}
                onChange={(e) => setDelayedReadingInterval(e.target.value)}
                className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="15"
              />
            </div>

            {/* Invalidation Reasons */}
            <div className="space-y-2">
              <Label>Invalidation Reason</Label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInvalidationReason}
                  onChange={(e) => setNewInvalidationReason(e.target.value)}
                  className="flex h-8 flex-1 rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Type to add reason..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newInvalidationReason.trim()) {
                      setInvalidationReasons([...invalidationReasons, newInvalidationReason.trim()])
                      setNewInvalidationReason('')
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="default"
                  className="h-8"
                  onClick={() => {
                    if (newInvalidationReason.trim()) {
                      setInvalidationReasons([...invalidationReasons, newInvalidationReason.trim()])
                      setNewInvalidationReason('')
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {invalidationReasons.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {invalidationReasons.map((reason, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs gap-1"
                    >
                      {reason}
                      <button
                        onClick={() => setInvalidationReasons(invalidationReasons.filter((_, i) => i !== index))}
                        className="ml-1 hover:bg-gray-300 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Vitals Configurations */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-base">Active Vitals Configurations</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setDrawerView('edit-programs')}>
                    Edit Programs
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setConfigTitle('')
                    setConfigUnit('')
                    setRangeItems([])
                    setEditingConfigId(null)
                    setDrawerView('create-config')
                  }}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Configuration
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {vitalsConfigurations.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent"
                  >
                    <span className="text-sm font-medium">{config.name}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditConfiguration(config.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => setVitalsConfigurations(vitalsConfigurations.filter(c => c.id !== config.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              </div>
            ) : drawerView === 'edit-programs' ? (
              <>
                {/* Edit Programs View */}
                <div className="overflow-y-auto flex-1 min-h-0">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={programItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="min-h-0">
                        {programItems.map((item) => (
                          <SortableProgramItem
                            key={item.id}
                            item={item}
                            onDelete={() => deleteProgramItem(item.id)}
                            onUpdate={updateProgramItem}
                            toggleThreshold={toggleProgramThreshold}
                            thresholdOptions={thresholdOptions}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
                <div className="flex-shrink-0 pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={addProgramItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Program Item
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* Create Configuration View */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Configuration Title</Label>
                    <input
                      type="text"
                      value={configTitle}
                      onChange={(e) => setConfigTitle(e.target.value)}
                      placeholder="e.g., Blood Pressure"
                      className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit of Measurement</Label>
                    <input
                      type="text"
                      value={configUnit}
                      onChange={(e) => setConfigUnit(e.target.value)}
                      placeholder="e.g., mmHg"
                      className="flex h-8 w-full rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <Item variant="muted" className="flex-col items-start">
                    <div className="flex items-start gap-2 w-full">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <ItemContent>
                        <ItemTitle>Range Tips</ItemTitle>
                        <ItemDescription className="space-y-1">
                          <div>• Ranges are evaluated in order from top to bottom until a match is found. Order according to priority.</div>
                          <div>• With trends, a positive value represents an increase over time. For example, use "Greater Than 5" to represent an increase of 6 or more.</div>
                          <div>• With trends, a negative value represents a decrease over time. For example, "Less Than -5" to represent a decrease of 6 or more. To enter a negative number, first type the desired number and then add a minus sign at the start.</div>
                        </ItemDescription>
                      </ItemContent>
                    </div>
                  </Item>
                </div>

                <div className="overflow-y-auto flex-1 min-h-0">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleRangeDragEnd}
                  >
                    <SortableContext
                      items={rangeItems.map(item => item.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="min-h-0">
                        {rangeItems.map((item) => (
                          <SortableRangeItem
                            key={item.id}
                            item={item}
                            onDelete={() => deleteRangeItem(item.id)}
                            onUpdate={updateRangeItem}
                            targetOptions={targetOptions}
                            operatorOptions={operatorOptions}
                            trendOptions={trendOptions}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
                <div className="flex-shrink-0 pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={addRangeItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Range
                  </Button>
                </div>
              </>
            )}
          </div>
          <DrawerFooter>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSettingsDrawerOpen(false)
                  setDrawerView('settings')
                }}
              >
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={drawerView === 'settings' ? saveSettings : drawerView === 'edit-programs' ? savePrograms : saveConfiguration}
                disabled={drawerView === 'settings' ? !hasSettingsChanged : drawerView === 'edit-programs' ? !hasProgramsChanged : !hasConfigChanged}
              >
                Save
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Flags Modal - for editing multiple flags */}
      <Dialog open={flagsModalOpen} onOpenChange={setFlagsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Flags</DialogTitle>
            <DialogDescription>
              Edit all flags for this observation
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-4">
            <div className="space-y-4">
              {selectedRecordId && (() => {
                const record = data.find(r => r.id === selectedRecordId)
                if (!record) return null

                return (
                  <>
                    {/* Med Status flag - only for blood pressure */}
                    {typeof record.medStatus === 'string' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Medication Status</Label>
                        <div className="flex flex-col gap-2">
                          {(['Unknown', 'Before Meds', 'After Meds'] as const).map((status) => (
                            <Button
                              key={status}
                              variant={record.medStatus === status ? 'default' : 'outline'}
                              className="h-9 justify-start"
                              onClick={() => setMedStatus(record.id, status)}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Irregular Heartbeat flag - only for BPM */}
                    {typeof record.irregularHeartbeat === 'boolean' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Heart Rhythm</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={record.irregularHeartbeat === false ? 'default' : 'outline'}
                            className="flex-1 h-9"
                            onClick={() => {
                              setData(prevData =>
                                prevData.map(r =>
                                  r.id === record.id ? { ...r, irregularHeartbeat: false } : r
                                )
                              )
                            }}
                          >
                            Regular
                          </Button>
                          <Button
                            variant={record.irregularHeartbeat === true ? 'default' : 'outline'}
                            className="flex-1 h-9"
                            onClick={() => {
                              setData(prevData =>
                                prevData.map(r =>
                                  r.id === record.id ? { ...r, irregularHeartbeat: true } : r
                                )
                              )
                            }}
                          >
                            Irregular
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Before Meal flag - only for glucose */}
                    {typeof record.beforeMeal === 'boolean' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Meal Timing</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={record.beforeMeal === true ? 'default' : 'outline'}
                            className="flex-1 h-9"
                            onClick={() => {
                              setData(prevData =>
                                prevData.map(r =>
                                  r.id === record.id ? { ...r, beforeMeal: true } : r
                                )
                              )
                            }}
                          >
                            Before Meal
                          </Button>
                          <Button
                            variant={record.beforeMeal === false ? 'default' : 'outline'}
                            className="flex-1 h-9"
                            onClick={() => {
                              setData(prevData =>
                                prevData.map(r =>
                                  r.id === record.id ? { ...r, beforeMeal: false } : r
                                )
                              )
                            }}
                          >
                            After Meal
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setFlagsModalOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
