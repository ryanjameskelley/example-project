import { AuuiBanner } from '../../components/AuuiBanner';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState
} from '@tanstack/react-table';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Badge } from '@/components/atoms/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/molecules/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/organisms/table';
import {
  Search,
  Filter,
  Calendar,
  Users,
  Stethoscope,
  AlertTriangle,
  ChevronDown,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Inline components for filters
const Tabs = ({
  tabs,
  activeTab,
  onTabChange
}: {
  tabs: { id: string; label: string; count?: number }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) => (
  <div className="border-b border-gray-200">
    <nav className="flex -mb-px space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-3 px-1 border-b-2 text-sm font-medium whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </nav>
  </div>
);

const Select = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = ''
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const Checkbox = ({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) => (
  <label className="flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
  </label>
);

// Types
interface VitalReading {
  id: string;
  patientName: string;
  patientId: string;
  timestamp: Date;
  vitalType: string;
  value: number;
  unit: string;
  threshold: { min: number; max: number };
  source: 'healthie' | 'vital' | 'elation' | 'canvas';
  reviewed: boolean;
  flags: string[];
  careTeam: string[];
  program: string;
  visible: boolean;
}

// Mock data
const generateMockData = (): VitalReading[] => {
  const patients = [
    { id: '1', name: 'Sarah Chen' },
    { id: '2', name: 'Marcus Johnson' },
    { id: '3', name: 'Emma Davis' },
    { id: '4', name: 'James Wilson' },
    { id: '5', name: 'Olivia Martinez' }
  ];

  const vitals = [
    {
      type: 'Blood Pressure (Systolic)',
      unit: 'mmHg',
      threshold: { min: 90, max: 140 }
    },
    { type: 'Heart Rate', unit: 'bpm', threshold: { min: 60, max: 100 } },
    { type: 'Blood Glucose', unit: 'mg/dL', threshold: { min: 70, max: 140 } },
    { type: 'Oxygen Saturation', unit: '%', threshold: { min: 95, max: 100 } },
    { type: 'Weight', unit: 'lbs', threshold: { min: 120, max: 200 } },
    { type: 'Temperature', unit: '°F', threshold: { min: 97, max: 99 } }
  ];

  const sources: VitalReading['source'][] = [
    'healthie',
    'vital',
    'elation',
    'canvas'
  ];
  const programs = ['Diabetes Management', 'Cardiac Care', 'Hypertension', 'General Wellness'];
  const careTeams = [
    ['Dr. Smith', 'Nurse Jane'],
    ['Dr. Johnson', 'Nurse Mary'],
    ['Dr. Williams', 'Nurse Bob']
  ];

  const data: VitalReading[] = [];

  for (let i = 0; i < 50; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const vital = vitals[Math.floor(Math.random() * vitals.length)];
    const baseValue =
      (vital.threshold.min + vital.threshold.max) / 2 +
      (Math.random() - 0.5) * (vital.threshold.max - vital.threshold.min) * 1.5;
    const value = Math.round(baseValue * 10) / 10;

    const flags: string[] = [];
    if (value < vital.threshold.min) flags.push('Low');
    if (value > vital.threshold.max) flags.push('High');
    if (Math.random() > 0.7) flags.push('Trend');

    data.push({
      id: `vital-${i}`,
      patientName: patient.name,
      patientId: patient.id,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      vitalType: vital.type,
      value,
      unit: vital.unit,
      threshold: vital.threshold,
      source: sources[Math.floor(Math.random() * sources.length)],
      reviewed: Math.random() > 0.4,
      flags,
      careTeam: careTeams[Math.floor(Math.random() * careTeams.length)],
      program: programs[Math.floor(Math.random() * programs.length)],
      visible: true
    });
  }

  return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

function Original_PatientVitalsMonitor() {
  const [data] = useState<VitalReading[]>(generateMockData());
  const [activeTab, setActiveTab] = useState<'unreviewed' | 'all'>('unreviewed');
  const [showFilters, setShowFilters] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCareTeam, setSelectedCareTeam] = useState<string[]>([]);
  const [vitalThreshold, setVitalThreshold] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get filtered data
  const filteredData = useMemo(() => {
    let filtered = data;

    // Tab filter
    if (activeTab === 'unreviewed') {
      filtered = filtered.filter((item) => !item.reviewed);
    }

    // Patient filter
    if (selectedPatient) {
      filtered = filtered.filter((item) => item.patientId === selectedPatient);
    }

    // Program filter
    if (selectedProgram) {
      filtered = filtered.filter((item) => item.program === selectedProgram);
    }

    // Care team filter
    if (selectedCareTeam.length > 0) {
      filtered = filtered.filter((item) =>
        item.careTeam.some((member) => selectedCareTeam.includes(member))
      );
    }

    // Threshold filter
    if (vitalThreshold === 'flagged') {
      filtered = filtered.filter((item) => item.flags.length > 0);
    }

    // Date range filter
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      filtered = filtered.filter((item) => item.timestamp >= startDate);
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter((item) => item.timestamp <= endDate);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.vitalType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [
    data,
    activeTab,
    selectedPatient,
    selectedProgram,
    selectedCareTeam,
    vitalThreshold,
    dateRange,
    searchQuery
  ]);

  const columns: ColumnDef<VitalReading>[] = [
    {
      accessorKey: 'patientName',
      header: 'Patient Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <img
            src={`https://api.dicebear.com/9.x/shapes/svg?seed=${row.original.patientId}`}
            alt={row.original.patientName}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="font-medium text-gray-900">
              {row.original.patientName}
            </div>
            <div className="text-xs text-gray-500">{row.original.vitalType}</div>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {row.original.timestamp.toLocaleDateString()}
          </div>
          <div className="text-xs text-gray-500">
            {row.original.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'flags',
      header: 'Flags',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.flags.map((flag) => (
            <Badge
              key={flag}
              variant={
                flag === 'High' || flag === 'Low' ? 'destructive' : 'default'
              }
            >
              {flag === 'High' && <TrendingUp className="w-3 h-3 mr-1" />}
              {flag === 'Low' && <TrendingDown className="w-3 h-3 mr-1" />}
              {flag === 'Trend' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {flag}
            </Badge>
          ))}
        </div>
      )
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => {
        const { value, threshold } = row.original;
        const isLow = value < threshold.min;
        const isHigh = value > threshold.max;
        const colorClass = isLow
          ? 'text-blue-600'
          : isHigh
          ? 'text-red-600'
          : 'text-green-600';

        return (
          <div className={`text-lg font-semibold ${colorClass}`}>{value}</div>
        );
      }
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.original.unit}</div>
      )
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.source}
        </Badge>
      )
    },
    {
      accessorKey: 'reviewed',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {row.original.reviewed ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">Reviewed</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-600">Pending</span>
            </>
          )}
        </div>
      )
    },
    {
      id: 'visibility',
      header: 'Visibility',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Toggle visibility logic would go here
            console.log('Toggle visibility for:', row.original.id);
          }}
        >
          {row.original.visible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
      )
    }
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters
    },
    initialState: {
      pagination: {
        pageSize: 15
      }
    }
  });

  const unreviewedCount = data.filter((item) => !item.reviewed).length;

  const patients = Array.from(
    new Set(data.map((item) => ({ id: item.patientId, name: item.patientName })))
  ).map((p) => ({ value: p.id, label: p.name }));

  const programs = Array.from(new Set(data.map((item) => item.program))).map(
    (p) => ({ value: p, label: p })
  );

  const careTeamMembers = Array.from(
    new Set(data.flatMap((item) => item.careTeam))
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Vitals</h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor and review patient vital signs
          </p>
        </div>
        <Button onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </Button>
      </div>

      <Card>
        <CardHeader>
          <Tabs
            tabs={[
              { id: 'unreviewed', label: 'Unreviewed', count: unreviewedCount },
              { id: 'all', label: 'All Vitals', count: data.length }
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as 'unreviewed' | 'all')}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search patients or vitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={vitalThreshold}
              onChange={setVitalThreshold}
              options={[
                { value: 'all', label: 'All Readings' },
                { value: 'flagged', label: 'Flagged Only' }
              ]}
              placeholder="Threshold Filter"
              className="w-40"
            />
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Date Range */}
                  <div>
                    <Label className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      Date Range
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, start: e.target.value })
                        }
                        placeholder="Start date"
                      />
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, end: e.target.value })
                        }
                        placeholder="End date"
                      />
                    </div>
                  </div>

                  {/* Patient Filter */}
                  <div>
                    <Label className="flex items-center mb-2">
                      <Users className="w-4 h-4 mr-2" />
                      Patient
                    </Label>
                    <Select
                      value={selectedPatient}
                      onChange={setSelectedPatient}
                      options={patients}
                      placeholder="All Patients"
                    />
                  </div>

                  {/* Program Filter */}
                  <div>
                    <Label className="flex items-center mb-2">
                      <Stethoscope className="w-4 h-4 mr-2" />
                      Program
                    </Label>
                    <Select
                      value={selectedProgram}
                      onChange={setSelectedProgram}
                      options={programs}
                      placeholder="All Programs"
                    />
                  </div>

                  {/* Care Team Filter */}
                  <div className="md:col-span-2 lg:col-span-3">
                    <Label className="flex items-center mb-2">
                      <Users className="w-4 h-4 mr-2" />
                      Care Team Members
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {careTeamMembers.map((member) => (
                        <Checkbox
                          key={member}
                          checked={selectedCareTeam.includes(member)}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedCareTeam([...selectedCareTeam, member]);
                            } else {
                              setSelectedCareTeam(
                                selectedCareTeam.filter((m) => m !== member)
                              );
                            }
                          }}
                          label={member}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDateRange({ start: '', end: '' });
                      setSelectedPatient('');
                      setSelectedProgram('');
                      setSelectedCareTeam([]);
                      setVitalThreshold('all');
                      setSearchQuery('');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing {filteredData.length} of {data.length} readings
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center py-12 text-gray-500"
                    >
                      No vitals found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769062009.846899" />
      <div style={{ marginTop: '40px' }}>
        <Original_PatientVitalsMonitor {...props} />
      </div>
    </>
  );
}