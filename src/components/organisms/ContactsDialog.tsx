import * as React from 'react'
import { ArrowUpRight, Check, ChevronDown, HeartPulse, Phone, Video, MessageSquare } from 'lucide-react'
import { VitalItem, type VitalReadingType, type VitalItemSegment } from '@/components/molecules/VitalItem'
import { BloodPressureReading } from '@/components/molecules/BloodPressureReading'
import { OtherReading } from '@/components/molecules/OtherReading'
import { LineChartRoot, LineChartContent } from '@/components/molecules/charts/LineChartLabel'
import { type ChartConfig } from '@/components/atoms/chart'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/molecules/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/molecules/popover'
import { Badge } from '@/components/atoms/Badge'
import { Button } from '@/components/atoms/Button'
import { Label } from '@/components/atoms/Label'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/atoms/breadcrumb'
import { cn } from '@/lib/utils'
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
} from '@/components/molecules/DropdownMenu'
import { DateSpanRoot, DateSpanTrigger, DateSpanCalendar } from '@/components/molecules/date/DateSpan'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface VitalRecord {
  id: string
  name: string
  timestamp: Date
  timestampIsEstimated?: boolean
  readingType: VitalReadingType
  segments: VitalItemSegment[]
  source: string
  medStatus?: 'Unknown' | 'Before Meds' | 'After Meds'
  irregularHeartbeat?: boolean
  beforeMeal?: boolean
  reviewed: boolean
}

interface FlagState {
  medStatus?: 'Unknown' | 'Before Meds' | 'After Meds'
  irregularHeartbeat?: boolean
  beforeMeal?: boolean
}

const applicableFlagTypes: Record<VitalReadingType, Array<keyof FlagState>> = {
  'blood-pressure': ['medStatus', 'irregularHeartbeat'],
  glucose: ['beforeMeal'],
  'heart-rate': ['irregularHeartbeat'],
  weight: [],
  other: [],
}

function getDisplayFlags(record: FlagState): string[] {
  const flags: string[] = []
  if (record.medStatus) flags.push(record.medStatus)
  if (typeof record.irregularHeartbeat === 'boolean') flags.push(record.irregularHeartbeat ? 'Irregular' : 'Regular')
  if (typeof record.beforeMeal === 'boolean') flags.push(record.beforeMeal ? 'Before Meal' : 'After Meal')
  return flags
}

function getFlagPillInfo(type: keyof FlagState, state: FlagState): { label: string; active: boolean } {
  switch (type) {
    case 'medStatus':
      return { label: state.medStatus ?? 'Med Status', active: state.medStatus !== undefined }
    case 'irregularHeartbeat':
      return {
        label: typeof state.irregularHeartbeat === 'boolean'
          ? (state.irregularHeartbeat ? 'Irregular' : 'Regular')
          : 'Heart Rhythm',
        active: state.irregularHeartbeat !== undefined,
      }
    case 'beforeMeal':
      return {
        label: typeof state.beforeMeal === 'boolean'
          ? (state.beforeMeal ? 'Before Meal' : 'After Meal')
          : 'Meal Timing',
        active: state.beforeMeal !== undefined,
      }
  }
}

const VITALS_DATA: VitalRecord[] = [
  {
    id: 'v1',
    name: 'Blood Pressure',
    timestamp: new Date('2026-01-26T09:15:00'),
    readingType: 'blood-pressure',
    segments: [
      { value: 128, unit: 'SBP', status: 'success' },
      { value: 52, unit: 'DBP', status: 'warning' },
      { value: 64, unit: 'BPM', status: 'success' },
    ],
    source: 'Vital',
    medStatus: 'Before Meds',
    reviewed: false,
  },
  {
    id: 'v2',
    name: 'Weight',
    timestamp: new Date('2026-01-26T08:45:00'),
    readingType: 'weight',
    segments: [{ value: '204.8', unit: 'LB', status: 'warning' }],
    source: 'Healthie',
    reviewed: false,
  },
  {
    id: 'v3',
    name: 'Blood Pressure',
    timestamp: new Date('2026-01-25T14:30:00'),
    readingType: 'blood-pressure',
    segments: [
      { value: 95, unit: 'SBP', status: 'warning' },
      { value: 58, unit: 'DBP', status: 'warning' },
      { value: 83, unit: 'BPM', status: 'success' },
    ],
    source: 'Elation',
    reviewed: true,
  },
  {
    id: 'v4',
    name: 'Glucose',
    timestamp: new Date('2026-01-25T07:00:00'),
    readingType: 'glucose',
    segments: [{ value: 142, unit: 'mg/dL', status: 'alert' }],
    source: 'Canvas',
    beforeMeal: false,
    reviewed: false,
  },
  {
    id: 'v5',
    name: 'Blood Pressure',
    timestamp: new Date('2026-01-24T11:20:00'),
    readingType: 'blood-pressure',
    segments: [
      { value: 114, unit: 'SBP', status: 'success' },
      { value: 59, unit: 'DBP', status: 'warning' },
      { value: 61, unit: 'BPM', status: 'success' },
    ],
    source: 'Vital',
    reviewed: true,
  },
  {
    id: 'v6',
    name: 'Heart Rate',
    timestamp: new Date('2026-01-24T09:05:00'),
    readingType: 'heart-rate',
    segments: [{ value: 92, unit: 'BPM', status: 'success' }],
    source: 'Healthie',
    irregularHeartbeat: true,
    reviewed: false,
  },
  // Blood Pressure extras
  {
    id: 'v7',
    name: 'Blood Pressure',
    timestamp: new Date('2026-01-23T08:00:00'),
    timestampIsEstimated: true,
    readingType: 'blood-pressure',
    segments: [
      { value: 132, unit: 'SBP', status: 'warning' },
      { value: 84, unit: 'DBP', status: 'warning' },
      { value: 71, unit: 'BPM', status: 'success' },
    ],
    source: 'Canvas',
    medStatus: 'Unknown',
    reviewed: false,
  },
  {
    id: 'v8',
    name: 'Blood Pressure',
    timestamp: new Date('2026-01-22T15:45:00'),
    readingType: 'blood-pressure',
    segments: [
      { value: 118, unit: 'SBP', status: 'success' },
      { value: 76, unit: 'DBP', status: 'success' },
      { value: 68, unit: 'BPM', status: 'success' },
    ],
    source: 'Elation',
    medStatus: 'After Meds',
    irregularHeartbeat: false,
    reviewed: true,
  },
  // Weight extras
  {
    id: 'v9',
    name: 'Weight',
    timestamp: new Date('2026-01-24T08:30:00'),
    timestampIsEstimated: true,
    readingType: 'weight',
    segments: [{ value: '205.2', unit: 'LB', status: 'warning' }],
    source: 'Vital',
    reviewed: false,
  },
  {
    id: 'v10',
    name: 'Weight',
    timestamp: new Date('2026-01-23T09:00:00'),
    readingType: 'weight',
    segments: [{ value: '203.1', unit: 'LB', status: 'success' }],
    source: 'Healthie',
    reviewed: true,
  },
  {
    id: 'v11',
    name: 'Weight',
    timestamp: new Date('2026-01-21T08:15:00'),
    readingType: 'weight',
    segments: [{ value: '206.0', unit: 'LB', status: 'alert' }],
    source: 'Canvas',
    reviewed: false,
  },
  // Glucose extras
  {
    id: 'v12',
    name: 'Glucose',
    timestamp: new Date('2026-01-24T07:00:00'),
    timestampIsEstimated: true,
    readingType: 'glucose',
    segments: [{ value: 98, unit: 'mg/dL', status: 'success' }],
    source: 'Vital',
    beforeMeal: true,
    reviewed: true,
  },
  {
    id: 'v13',
    name: 'Glucose',
    timestamp: new Date('2026-01-23T12:30:00'),
    readingType: 'glucose',
    segments: [{ value: 167, unit: 'mg/dL', status: 'alert' }],
    source: 'Canvas',
    beforeMeal: false,
    reviewed: false,
  },
  {
    id: 'v14',
    name: 'Glucose',
    timestamp: new Date('2026-01-22T07:15:00'),
    readingType: 'glucose',
    segments: [{ value: 112, unit: 'mg/dL', status: 'warning' }],
    source: 'Healthie',
    beforeMeal: true,
    reviewed: true,
  },
  // Heart Rate extras
  {
    id: 'v15',
    name: 'Heart Rate',
    timestamp: new Date('2026-01-23T14:20:00'),
    readingType: 'heart-rate',
    segments: [{ value: 78, unit: 'BPM', status: 'success' }],
    source: 'Elation',
    irregularHeartbeat: false,
    reviewed: true,
  },
  {
    id: 'v16',
    name: 'Heart Rate',
    timestamp: new Date('2026-01-22T09:00:00'),
    timestampIsEstimated: true,
    readingType: 'heart-rate',
    segments: [{ value: 104, unit: 'BPM', status: 'warning' }],
    source: 'Vital',
    reviewed: false,
  },
  {
    id: 'v17',
    name: 'Heart Rate',
    timestamp: new Date('2026-01-21T11:30:00'),
    readingType: 'heart-rate',
    segments: [{ value: 88, unit: 'BPM', status: 'success' }],
    source: 'Canvas',
    irregularHeartbeat: true,
    reviewed: false,
  },
]

// ─── Chart helpers ─────────────────────────────────────────────────────────────

function buildChartData(items: VitalRecord[], type: VitalReadingType) {
  const sorted = [...items].sort((a, b) => +a.timestamp - +b.timestamp)
  return sorted.map((item) => {
    const x = item.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (type === 'blood-pressure') {
      return {
        x,
        sbp: Number(item.segments[0]?.value ?? 0),
        dbp: Number(item.segments[1]?.value ?? 0),
        bpm: Number(item.segments[2]?.value ?? 0),
      }
    }
    return { x, value: Number(item.segments[0]?.value ?? 0) }
  })
}

const chartConfigs: Record<VitalReadingType, ChartConfig> = {
  'blood-pressure': {
    sbp: { label: 'SBP', color: 'hsl(var(--chart-1))' },
    dbp: { label: 'DBP', color: 'hsl(var(--chart-2))' },
    bpm: { label: 'BPM', color: 'hsl(var(--chart-3))' },
  },
  weight: { value: { label: 'Weight (LB)', color: 'hsl(var(--chart-1))' } },
  glucose: { value: { label: 'Glucose (mg/dL)', color: 'hsl(var(--chart-2))' } },
  'heart-rate': { value: { label: 'Heart Rate (BPM)', color: 'hsl(var(--chart-3))' } },
  other: { value: { label: 'Value', color: 'hsl(var(--chart-1))' } },
}

const chartKeys: Record<VitalReadingType, string[]> = {
  'blood-pressure': ['sbp', 'dbp', 'bpm'],
  weight: ['value'],
  glucose: ['value'],
  'heart-rate': ['value'],
  other: ['value'],
}

const readingTypeLabels: Record<VitalReadingType, string> = {
  'blood-pressure': 'Blood Pressure',
  weight: 'Weight',
  glucose: 'Glucose',
  'heart-rate': 'Heart Rate',
  other: 'Other',
}

// ─── Vital detail view ────────────────────────────────────────────────────────

interface VitalDetailViewProps {
  readingType: VitalReadingType
}

function VitalDetailView({ readingType }: VitalDetailViewProps) {
  // Chart: oldest → newest (most recent on right)
  const items = [...VITALS_DATA]
    .filter((r) => r.readingType === readingType)
    .sort((a, b) => +a.timestamp - +b.timestamp)

  // List: newest → oldest (most recent on top)
  const listItems = [...items].reverse()

  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [reviewedMap, setReviewedMap] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(items.map((r) => [r.id, r.reviewed]))
  )
  const [flagsMap, setFlagsMap] = React.useState<Record<string, FlagState>>(
    () => Object.fromEntries(items.map((r) => [r.id, {
      medStatus: r.medStatus,
      irregularHeartbeat: r.irregularHeartbeat,
      beforeMeal: r.beforeMeal,
    }]))
  )
  const [invalidateId, setInvalidateId] = React.useState<string | null>(null)
  const [invalidateReason, setInvalidateReason] = React.useState('')
  const [invalidatedMap, setInvalidatedMap] = React.useState<Record<string, string>>({})

  const chartData = buildChartData(items, readingType)
  const selectedIndex = items.findIndex((r) => r.id === selectedId)

  function handleItemClick(id: string) {
    setSelectedId((prev) => (prev === id ? null : id))
    setInvalidateId(null)
    setInvalidateReason('')
  }

  function toggleReviewed(id: string) {
    setReviewedMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function confirmInvalidate(id: string) {
    if (!invalidateReason.trim()) return
    setInvalidatedMap((prev) => ({ ...prev, [id]: invalidateReason.trim() }))
    setInvalidateId(null)
    setInvalidateReason('')
    setSelectedId(null)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Chart */}
      <div className="px-4 pt-3 pb-1 border-b">
        <LineChartRoot
          data={chartData}
          config={chartConfigs[readingType]}
          dataKeys={chartKeys[readingType]}
          xKey="x"
          highlightIndex={selectedIndex >= 0 ? selectedIndex : undefined}
        >
          <LineChartContent showLabels={false} />
        </LineChartRoot>
      </div>

      {/* Item list */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {listItems.filter((item) => !invalidatedMap[item.id]).map((item) => {
          const isSelected = selectedId === item.id
          const flagState = flagsMap[item.id] ?? {}
          const reviewed = reviewedMap[item.id]

          return (
            <div key={item.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => handleItemClick(item.id)}
                className="text-left"
              >
                <VitalItem
                  name={item.name}
                  timestamp={item.timestamp}
                  timestampIsEstimated={item.timestampIsEstimated}
                  readingType={item.readingType}
                  segments={item.segments}
                  source={item.source}
                  flags={getDisplayFlags(flagState)}
                  reviewed={reviewed}
                  className={cn(
                    'transition-colors cursor-pointer hover:bg-gray-100',
                    isSelected && 'border-foreground/20 bg-gray-100 ring-1 ring-foreground/10',
                  )}
                />
              </button>

              {/* Edit controls */}
              {isSelected && (
                <div className="mt-1 ml-0 rounded-b-lg border border-t-0 border-gray-100 bg-white px-3 py-3 flex flex-col gap-3">
                  {/* Flags + Reviewed row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {applicableFlagTypes[item.readingType].map((flagType) => {
                          const { label, active } = getFlagPillInfo(flagType, flagState)
                          return (
                            <Popover key={flagType}>
                              <PopoverTrigger className={cn(
                                'inline-flex items-center rounded-full border px-2 h-6 text-xs font-normal hover:bg-muted transition-colors',
                                active
                                  ? 'border-border bg-background text-foreground'
                                  : 'border-dashed border-border text-muted-foreground bg-transparent'
                              )}>
                                {label}
                              </PopoverTrigger>
                              <PopoverContent className="p-3 rounded-[10px] min-w-[200px] w-auto" align="start">
                                {flagType === 'medStatus' && (
                                  <div className="space-y-2">
                                    <Label className="text-xs font-semibold">Medication Status</Label>
                                    <div className="flex flex-col gap-1.5">
                                      {(['Unknown', 'Before Meds', 'After Meds'] as const).map((status) => (
                                        <Button
                                          key={status}
                                          variant={flagState.medStatus === status ? 'default' : 'outline'}
                                          className="justify-start px-4 py-2"
                                          onClick={() => setFlagsMap((prev) => ({ ...prev, [item.id]: { ...prev[item.id], medStatus: status } }))}
                                        >
                                          {status}
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {flagType === 'irregularHeartbeat' && (
                                  <div className="space-y-2">
                                    <Label className="text-xs font-semibold">Heart Rhythm</Label>
                                    <div className="flex flex-col gap-1.5">
                                      <Button
                                        variant={flagState.irregularHeartbeat === false ? 'default' : 'outline'}
                                        className="justify-start px-4 py-2"
                                        onClick={() => setFlagsMap((prev) => ({ ...prev, [item.id]: { ...prev[item.id], irregularHeartbeat: false } }))}
                                      >
                                        Regular
                                      </Button>
                                      <Button
                                        variant={flagState.irregularHeartbeat === true ? 'default' : 'outline'}
                                        className="justify-start px-4 py-2"
                                        onClick={() => setFlagsMap((prev) => ({ ...prev, [item.id]: { ...prev[item.id], irregularHeartbeat: true } }))}
                                      >
                                        Irregular
                                      </Button>
                                    </div>
                                  </div>
                                )}
                                {flagType === 'beforeMeal' && (
                                  <div className="space-y-2">
                                    <Label className="text-xs font-semibold">Meal Timing</Label>
                                    <div className="flex flex-col gap-1.5">
                                      <Button
                                        variant={flagState.beforeMeal === true ? 'default' : 'outline'}
                                        className="justify-start px-4 py-2"
                                        onClick={() => setFlagsMap((prev) => ({ ...prev, [item.id]: { ...prev[item.id], beforeMeal: true } }))}
                                      >
                                        Before Meal
                                      </Button>
                                      <Button
                                        variant={flagState.beforeMeal === false ? 'default' : 'outline'}
                                        className="justify-start px-4 py-2"
                                        onClick={() => setFlagsMap((prev) => ({ ...prev, [item.id]: { ...prev[item.id], beforeMeal: false } }))}
                                      >
                                        After Meal
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </PopoverContent>
                            </Popover>
                          )
                        })}
                    </div>
                    <Badge
                      variant="outline"
                      className={`cursor-pointer transition-colors flex-shrink-0 ${
                        reviewed
                          ? 'bg-green-100 text-green-700 border-green-300'
                          : 'bg-gray-100 text-gray-500 border-gray-300'
                      }`}
                      onClick={() => toggleReviewed(item.id)}
                    >
                      {reviewed && <Check className="h-3 w-3 mr-1" />}
                      {reviewed ? 'Reviewed' : 'Not Reviewed'}
                    </Badge>
                  </div>

                  {/* Invalidate */}
                  {invalidateId === item.id ? (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-destructive">Reason for invalidation</span>
                      <div className="flex flex-col gap-1">
                        {(['Entered in Error', 'Cancelled', 'Corrected', 'Amended'] as const).map((reason) => (
                          <button
                            key={reason}
                            type="button"
                            onClick={() => setInvalidateReason(reason)}
                            className={cn(
                              'text-left text-xs px-2 py-1.5 rounded-md border transition-colors',
                              invalidateReason === reason
                                ? 'bg-destructive/10 border-destructive/40 text-destructive'
                                : 'border-gray-200 hover:bg-gray-50 text-foreground'
                            )}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="h-7 text-xs px-2"
                          onClick={() => confirmInvalidate(item.id)}
                          disabled={!invalidateReason}
                        >
                          Confirm
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs px-2"
                          onClick={() => { setInvalidateId(null); setInvalidateReason('') }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs px-2 w-fit text-destructive border-destructive/30 hover:bg-destructive/5"
                      onClick={() => setInvalidateId(item.id)}
                    >
                      Invalidate
                    </Button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Primitives ──────────────────────────────────────────────────────────────

const ContactsDialogRoot = Dialog
ContactsDialogRoot.displayName = 'ContactsDialogRoot'

const ContactsDialogTrigger = DialogTrigger
ContactsDialogTrigger.displayName = 'ContactsDialogTrigger'

const ContactsDialogTitle = DialogTitle
ContactsDialogTitle.displayName = 'ContactsDialogTitle'

const ContactsDialogDescription = DialogDescription
ContactsDialogDescription.displayName = 'ContactsDialogDescription'

// ─── Nav sidebar ─────────────────────────────────────────────────────────────

interface ContactsDialogNavItem {
  name: string
  icon: React.ElementType
}

const contactsNav: ContactsDialogNavItem[] = [
  { name: 'Vitals', icon: HeartPulse },
]

interface ContactsDialogNavProps {
  activeItem?: string
  onSelect?: (name: string) => void
  className?: string
}

const ContactsDialogNav = React.forwardRef<HTMLDivElement, ContactsDialogNavProps>(
  ({ activeItem = 'All Contacts', onSelect, className }, ref) => (
    <div
      ref={ref}
      className={cn('hidden md:flex flex-col w-[200px] border-r bg-gray-50 flex-shrink-0', className)}
    >
      {/* Nav items */}
      <div className="py-3 px-2 flex flex-col gap-0.5">
        {contactsNav.map((item) => {
          const isActive = activeItem === item.name
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelect?.(item.name)}
              className={cn(
                'flex items-center gap-2 w-full h-8 px-2 rounded-md text-sm transition-colors outline-none focus:outline-none',
                isActive
                  ? 'bg-[#EBEBEB] text-foreground font-medium'
                  : 'text-muted-foreground hover:bg-[#EBEBEB]/60 hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
)
ContactsDialogNav.displayName = 'ContactsDialogNav'

// ─── Content area ─────────────────────────────────────────────────────────────

type ContentView = 'vitals' | 'add-blood-pressure' | 'add-other-reading' | 'vital-detail'

interface ContactsDialogContentAreaProps {
  className?: string
  children?: React.ReactNode
}

function ContactsDialogContentArea({ className, children }: ContactsDialogContentAreaProps) {
  const [view, setView] = React.useState<ContentView>('vitals')
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({})
  const [program, setProgram] = React.useState<string>('')
  const [thresholds, setThresholds] = React.useState<string[]>([])
  const [timezone, setTimezone] = React.useState<string>('')

  const toggleThreshold = (t: string) =>
    setThresholds((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])
  const [detailType, setDetailType] = React.useState<VitalReadingType>('blood-pressure')

  function openDetail(type: VitalReadingType) {
    setDetailType(type)
    setView('vital-detail')
  }

  const breadcrumb = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">Patient Name</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        {view === 'vitals' ? (
          <BreadcrumbItem>
            <BreadcrumbPage>Vitals</BreadcrumbPage>
          </BreadcrumbItem>
        ) : view === 'add-blood-pressure' || view === 'add-other-reading' ? (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href="#"
                onClick={(e) => { e.preventDefault(); setView('vitals') }}
                className="cursor-pointer"
              >
                Vitals
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Add Reading</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : view === 'vital-detail' ? (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href="#"
                onClick={(e) => { e.preventDefault(); setView('vitals') }}
                className="cursor-pointer"
              >
                Vitals
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{readingTypeLabels[detailType]}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : null}
      </BreadcrumbList>
    </Breadcrumb>
  )

  return (
    <main className={cn('flex flex-1 flex-col overflow-hidden', className)}>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <ArrowUpRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">{breadcrumb}</div>
        <div className="flex flex-shrink-0">
          <button
            type="button"
            title="Call"
            className="flex items-center justify-center h-8 w-8 rounded-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Phone className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Video call"
            className="flex items-center justify-center h-8 w-8 rounded-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Video className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            title="Message"
            className="flex items-center justify-center h-8 w-8 rounded-[10px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {view === 'vitals' && !children && (
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 z-10 flex flex-col gap-2 p-4 pb-3 bg-white/70 backdrop-blur-sm">
            {/* Filters row */}
            <div className="flex gap-2 overflow-x-auto">
              <Popover>
                <DateSpanRoot
                  value={dateRange.from ? { from: dateRange.from, to: dateRange.to } : undefined}
                  onChange={(range) => setDateRange({ from: range?.from, to: range?.to })}
                >
                  <DateSpanTrigger className="h-8 text-xs flex-shrink-0" />
                  <DateSpanCalendar />
                </DateSpanRoot>
              </Popover>

              <Select value={program} onValueChange={setProgram}>
                <SelectTrigger className="h-8 text-xs w-[130px] flex-shrink-0">
                  <SelectValue placeholder="Program" />
                </SelectTrigger>
                <SelectContent>
                  {['Diabetes Management', 'Hypertension', 'Weight Loss', 'Cardiac Care'].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="h-8 pl-3 pr-2 text-xs rounded-[10px] border border-input bg-background flex items-center gap-1.5 flex-shrink-0 w-[130px] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <span className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-none text-left">
                      {thresholds.length === 0 ? 'Threshold' : thresholds.join(', ')}
                    </span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-50 flex-shrink-0" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {['Critical', 'Warning', 'Normal'].map((t) => (
                    <DropdownMenuCheckboxItem
                      key={t}
                      checked={thresholds.includes(t)}
                      onCheckedChange={() => toggleThreshold(t)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {t}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="h-8 text-xs w-[150px] flex-shrink-0">
                  <SelectValue placeholder="Timezone" />
                </SelectTrigger>
                <SelectContent>
                  {['America/New_York', 'America/Chicago', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo'].map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Action buttons row */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setView('add-blood-pressure')}>
                Add blood pressure reading
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={() => setView('add-other-reading')}>
                Add other reading
              </Button>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4 pt-[152px] sm:pt-[108px]">
            {VITALS_DATA.map((item) => (
              <button
                key={item.id}
                type="button"
                className="text-left"
                onClick={() => openDetail(item.readingType)}
              >
                <VitalItem
                  name={item.name}
                  timestamp={item.timestamp}
                  timestampIsEstimated={item.timestampIsEstimated}
                  readingType={item.readingType}
                  segments={item.segments}
                  source={item.source}
                  flags={getDisplayFlags(item)}
                  reviewed={item.reviewed}
                  className="cursor-pointer hover:bg-gray-100 transition-colors"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'add-blood-pressure' && (
        <BloodPressureReading
          onCancel={() => setView('vitals')}
          onSave={() => setView('vitals')}
        />
      )}

      {view === 'add-other-reading' && (
        <OtherReading
          onCancel={() => setView('vitals')}
          onSave={() => setView('vitals')}
        />
      )}

      {view === 'vital-detail' && (
        <VitalDetailView readingType={detailType} />
      )}

      {children && view === 'vitals' && (
        <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">{children}</div>
      )}
    </main>
  )
}

// ─── Composed content wrapper ─────────────────────────────────────────────────

interface ContactsDialogContentProps
  extends Omit<React.ComponentPropsWithoutRef<typeof DialogContent>, 'children'> {
  children?: React.ReactNode
}

const ContactsDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  ContactsDialogContentProps
>(({ className, children, ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn('overflow-hidden p-0 w-[calc(100vw-48px)] max-w-[calc(100vw-48px)] h-[calc(100vh-48px)] max-h-[calc(100vh-48px)]', className)}
    {...props}
  >
    <ContactsDialogTitle className="sr-only">Contacts</ContactsDialogTitle>
    <ContactsDialogDescription className="sr-only">
      Browse and manage your contacts.
    </ContactsDialogDescription>
    <div className="flex h-full">{children}</div>
  </DialogContent>
))
ContactsDialogContent.displayName = 'ContactsDialogContent'

// ─── Fully composed default variant ──────────────────────────────────────────

export function ContactsDialog() {
  const [open, setOpen] = React.useState(false)
  const [activeItem, setActiveItem] = React.useState('Vitals')

  return (
    <ContactsDialogRoot open={open} onOpenChange={setOpen}>
      <ContactsDialogTrigger asChild>
        <Button size="sm">Open Contacts</Button>
      </ContactsDialogTrigger>
      <ContactsDialogContent>
        <ContactsDialogNav activeItem={activeItem} onSelect={setActiveItem} />
        <ContactsDialogContentArea />
      </ContactsDialogContent>
    </ContactsDialogRoot>
  )
}

// ─── Named primitive exports ──────────────────────────────────────────────────

export {
  ContactsDialogRoot,
  ContactsDialogTrigger,
  ContactsDialogTitle,
  ContactsDialogDescription,
  ContactsDialogContent,
  ContactsDialogNav,
  ContactsDialogContentArea,
}
export type { ContactsDialogNavItem, ContactsDialogNavProps, ContactsDialogContentAreaProps }
