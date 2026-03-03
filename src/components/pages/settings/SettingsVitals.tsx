import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Label } from '@/components/atoms/Label'
import { Switch } from '@/components/atoms/switch'
import { Badge } from '@/components/atoms/Badge'
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
import { Item, ItemContent, ItemTitle, ItemDescription } from '@/components/molecules/Item'
import { X, Plus, Pencil, Trash2, GripVertical, ArrowLeft, Info, ChevronDown } from 'lucide-react'
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

interface ProgramItem {
  id: string
  title: string
  vitalsThresholds: string[]
}

interface RangeItem {
  id: string
  target: string
  operator: string
  value: string
  trend: string
}

const targetOptions = ['High', 'Low', 'Very High', 'Very Low', 'Critical High', 'Critical Low']
const operatorOptions = ['Less Than', 'Greater Than', 'Between']
const trendOptions = Array.from({ length: 365 }, (_, i) => `Within ${i + 1} day${i === 0 ? '' : 's'}`)
const thresholdOptions = ['Critical', 'Warning', 'Normal', 'All']

interface SortableRangeItemProps {
  item: RangeItem
  onDelete: () => void
  onUpdate: (id: string, field: string, value: string) => void
}

function SortableRangeItem({ item, onDelete, onUpdate }: SortableRangeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="flex items-center gap-2 rounded-[10px] border border-border p-2 bg-background">
        <button type="button" className="cursor-grab active:cursor-grabbing focus:outline-none" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="flex-1 grid grid-cols-4 gap-2">
          <Select value={item.target} onValueChange={(v) => onUpdate(item.id, 'target', v)}>
            <SelectTrigger className="h-8"><SelectValue placeholder="Target" /></SelectTrigger>
            <SelectContent>
              {targetOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={item.operator} onValueChange={(v) => onUpdate(item.id, 'operator', v)}>
            <SelectTrigger className="h-8"><SelectValue placeholder="Operator" /></SelectTrigger>
            <SelectContent>
              {operatorOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
          <input
            type="text"
            value={item.value}
            onChange={(e) => onUpdate(item.id, 'value', e.target.value)}
            placeholder="Value"
            className="flex h-8 rounded-[10px] border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Select value={item.trend} onValueChange={(v) => onUpdate(item.id, 'trend', v)}>
            <SelectTrigger className="h-8"><SelectValue placeholder="Trend" /></SelectTrigger>
            <SelectContent className="max-h-60">
              {trendOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <button type="button" onClick={onDelete} className="focus:outline-none">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

interface SortableProgramItemProps {
  item: ProgramItem
  onDelete: () => void
  onUpdate: (id: string, field: 'title' | 'vitalsThresholds', value: string | string[]) => void
  toggleThreshold: (programId: string, threshold: string) => void
}

function SortableProgramItem({ item, onDelete, onUpdate, toggleThreshold }: SortableProgramItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <div className="flex items-center gap-2 rounded-[10px] border border-border p-2 bg-background">
        <button type="button" className="cursor-grab active:cursor-grabbing focus:outline-none" {...attributes} {...listeners}>
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
                  {item.vitalsThresholds.length === 0 ? 'Select vitals thresholds' : item.vitalsThresholds.join(', ')}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
                {thresholdOptions.map((t) => (
                  <DropdownMenuCheckboxItem
                    key={t}
                    checked={item.vitalsThresholds.includes(t)}
                    onCheckedChange={() => toggleThreshold(item.id, t)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {t}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <button type="button" onClick={onDelete} className="focus:outline-none">
          <X className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}

export function SettingsVitals() {
  const [view, setView] = useState<'settings' | 'edit-programs' | 'create-config'>('settings')

  // Settings state
  const [showVitalsTab, setShowVitalsTab] = useState(true)
  const [requireInvalidationReason, setRequireInvalidationReason] = useState(false)
  const [delayedReadingInterval, setDelayedReadingInterval] = useState('15')
  const [newInvalidationReason, setNewInvalidationReason] = useState('')
  const [invalidationReasons, setInvalidationReasons] = useState<string[]>(['Device malfunction', 'Patient error', 'Data entry error'])
  const [vitalsConfigurations, setVitalsConfigurations] = useState([
    { id: '1', name: 'Blood Glucose' },
    { id: '2', name: 'DBP' },
  ])

  // Original settings for dirty check
  const [originalSettings, setOriginalSettings] = useState({
    showVitalsTab: true,
    requireInvalidationReason: false,
    delayedReadingInterval: '15',
    invalidationReasons: ['Device malfunction', 'Patient error', 'Data entry error'],
    vitalsConfigurations: [{ id: '1', name: 'Blood Glucose' }, { id: '2', name: 'DBP' }],
  })

  const hasSettingsChanged =
    showVitalsTab !== originalSettings.showVitalsTab ||
    requireInvalidationReason !== originalSettings.requireInvalidationReason ||
    delayedReadingInterval !== originalSettings.delayedReadingInterval ||
    JSON.stringify(invalidationReasons) !== JSON.stringify(originalSettings.invalidationReasons) ||
    JSON.stringify(vitalsConfigurations) !== JSON.stringify(originalSettings.vitalsConfigurations)

  const saveSettings = () => {
    setOriginalSettings({ showVitalsTab, requireInvalidationReason, delayedReadingInterval, invalidationReasons, vitalsConfigurations })
  }

  // Program items state
  const [programItems, setProgramItems] = useState<ProgramItem[]>([
    { id: '1', title: 'Hypertension Management', vitalsThresholds: ['Critical', 'Warning'] },
    { id: '2', title: 'Diabetes Care', vitalsThresholds: ['Critical'] },
  ])
  const [originalProgramItems, setOriginalProgramItems] = useState<ProgramItem[]>([
    { id: '1', title: 'Hypertension Management', vitalsThresholds: ['Critical', 'Warning'] },
    { id: '2', title: 'Diabetes Care', vitalsThresholds: ['Critical'] },
  ])
  const hasProgramsChanged = JSON.stringify(programItems) !== JSON.stringify(originalProgramItems)

  const addProgramItem = () => {
    setProgramItems([...programItems, { id: Date.now().toString(), title: '', vitalsThresholds: [] }])
  }
  const updateProgramItem = (id: string, field: 'title' | 'vitalsThresholds', value: string | string[]) => {
    setProgramItems(programItems.map(item => item.id === id ? { ...item, [field]: value } : item))
  }
  const deleteProgramItem = (id: string) => {
    setProgramItems(programItems.filter(item => item.id !== id))
  }
  const toggleProgramThreshold = (programId: string, threshold: string) => {
    setProgramItems(programItems.map(item =>
      item.id === programId
        ? { ...item, vitalsThresholds: item.vitalsThresholds.includes(threshold) ? item.vitalsThresholds.filter(t => t !== threshold) : [...item.vitalsThresholds, threshold] }
        : item
    ))
  }
  const savePrograms = () => {
    setOriginalProgramItems(programItems)
    setView('settings')
  }

  const programSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const handleProgramDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setProgramItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Vital configuration state
  const [configTitle, setConfigTitle] = useState('')
  const [configUnit, setConfigUnit] = useState('')
  const [rangeItems, setRangeItems] = useState<RangeItem[]>([])
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null)
  const [originalConfigState, setOriginalConfigState] = useState({ configTitle: '', configUnit: '', rangeItems: [] as RangeItem[] })

  const hasConfigChanged =
    configTitle !== originalConfigState.configTitle ||
    configUnit !== originalConfigState.configUnit ||
    JSON.stringify(rangeItems) !== JSON.stringify(originalConfigState.rangeItems)

  const addRangeItem = () => {
    setRangeItems([...rangeItems, { id: Date.now().toString(), target: '', operator: '', value: '', trend: '' }])
  }
  const updateRangeItem = (id: string, field: string, value: string) => {
    setRangeItems(rangeItems.map(item => item.id === id ? { ...item, [field]: value } : item))
  }
  const deleteRangeItem = (id: string) => {
    setRangeItems(rangeItems.filter(item => item.id !== id))
  }

  const rangeSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const handleRangeDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setRangeItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const openEditConfiguration = (configId: string) => {
    const config = vitalsConfigurations.find(c => c.id === configId)
    if (config) {
      setConfigTitle(config.name)
      setConfigUnit('mmHg')
      setRangeItems([])
      setEditingConfigId(configId)
      setOriginalConfigState({ configTitle: config.name, configUnit: 'mmHg', rangeItems: [] })
      setView('create-config')
    }
  }

  const saveConfiguration = () => {
    if (editingConfigId) {
      setVitalsConfigurations(vitalsConfigurations.map(c => c.id === editingConfigId ? { ...c, name: configTitle } : c))
      setEditingConfigId(null)
    }
    setOriginalConfigState({ configTitle, configUnit, rangeItems })
    setConfigTitle('')
    setConfigUnit('')
    setRangeItems([])
    setView('settings')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Sub-view header (back button + title) */}
      {view !== 'settings' && (
        <div className="flex items-center gap-2 -mt-2 mb-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setView('settings')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold">
            {view === 'edit-programs' ? 'Edit Programs' : editingConfigId ? 'Edit Vital Configuration' : 'Create Vital Configuration'}
          </span>
        </div>
      )}

      {view === 'settings' ? (
        <>
          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Show Vitals Tab</Label>
                <p className="text-sm text-muted-foreground">Display vitals tab in the interface</p>
              </div>
              <Switch checked={showVitalsTab} onCheckedChange={setShowVitalsTab} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Require Reason When Invalidating Observations</Label>
                <p className="text-sm text-muted-foreground">Users must provide a reason to invalidate data</p>
              </div>
              <Switch checked={requireInvalidationReason} onCheckedChange={setRequireInvalidationReason} />
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
                  <Badge key={index} variant="secondary" className="text-xs gap-1">
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
                <Button variant="outline" size="sm" onClick={() => setView('edit-programs')}>
                  Edit Programs
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setConfigTitle('')
                  setConfigUnit('')
                  setRangeItems([])
                  setEditingConfigId(null)
                  setOriginalConfigState({ configTitle: '', configUnit: '', rangeItems: [] })
                  setView('create-config')
                }}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Configuration
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {vitalsConfigurations.map((config) => (
                <div key={config.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent">
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

          {/* Footer */}
          {hasSettingsChanged && (
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => {
                setShowVitalsTab(originalSettings.showVitalsTab)
                setRequireInvalidationReason(originalSettings.requireInvalidationReason)
                setDelayedReadingInterval(originalSettings.delayedReadingInterval)
                setInvalidationReasons(originalSettings.invalidationReasons)
                setVitalsConfigurations(originalSettings.vitalsConfigurations)
              }}>Cancel</Button>
              <Button onClick={saveSettings}>Save</Button>
            </div>
          )}
        </>
      ) : view === 'edit-programs' ? (
        <>
          <DndContext sensors={programSensors} collisionDetection={closestCenter} onDragEnd={handleProgramDragEnd}>
            <SortableContext items={programItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div>
                {programItems.map((item) => (
                  <SortableProgramItem
                    key={item.id}
                    item={item}
                    onDelete={() => deleteProgramItem(item.id)}
                    onUpdate={updateProgramItem}
                    toggleThreshold={toggleProgramThreshold}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Button variant="outline" className="w-full" onClick={addProgramItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Program Item
          </Button>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setView('settings')}>Cancel</Button>
            <Button onClick={savePrograms} disabled={!hasProgramsChanged}>Save</Button>
          </div>
        </>
      ) : (
        <>
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
                    <div>• With trends, a positive value represents an increase over time.</div>
                    <div>• With trends, a negative value represents a decrease over time.</div>
                  </ItemDescription>
                </ItemContent>
              </div>
            </Item>
          </div>
          <DndContext sensors={rangeSensors} collisionDetection={closestCenter} onDragEnd={handleRangeDragEnd}>
            <SortableContext items={rangeItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <div>
                {rangeItems.map((item) => (
                  <SortableRangeItem
                    key={item.id}
                    item={item}
                    onDelete={() => deleteRangeItem(item.id)}
                    onUpdate={updateRangeItem}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Button variant="outline" className="w-full" onClick={addRangeItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Range
          </Button>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setView('settings')}>Cancel</Button>
            <Button onClick={saveConfiguration} disabled={!hasConfigChanged}>Save</Button>
          </div>
        </>
      )}
    </div>
  )
}
