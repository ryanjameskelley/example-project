import { AuuiBanner } from '../../components/AuuiBanner';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calendar,
  Users,
  FileText,
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

// Inline components for functionality not in whitelist
const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) => (
  <div className="border-b border-gray-200">
    <nav className="flex -mb-px space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-1 border-b-2 text-sm font-medium ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
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
  className = '',
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

const Badge = ({
  children,
  variant = 'default',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}) => {
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {children}
    </span>
  );
};

const Checkbox = ({
  checked,
  onChange,
  label,
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
  source: 'healthie' | 'vital' | 'elation' | 'canvas';
  reviewed: boolean;
  visible: boolean;
  flags: ('high' | 'low' | 'critical')[];
  threshold: {
    min: number;
    max: number;
    criticalMin: number;
    criticalMax: number;
  };
  careTeam: string[];
  program: string;
}

// Mock data
const generateMockVitals = (): VitalReading[] => {
  const patients = [
    'Sarah Chen',
    'Marcus Johnson',
    'Emma Davis',
    'Robert Taylor',
    'Linda Martinez',
    'James Wilson',
    'Patricia Brown',
    'Michael Garcia',
  ];
  const vitalTypes = [
    {
      name: 'Blood Pressure Systolic',
      unit: 'mmHg',
      min: 90,
      max: 140,
      criticalMin: 70,
      criticalMax: 180,
    },
    {
      name: 'Blood Pressure Diastolic',
      unit: 'mmHg',
      min: 60,
      max: 90,
      criticalMin: 40,
      criticalMax: 120,
    },
    {
      name: 'Heart Rate',
      unit: 'bpm',
      min: 60,
      max: 100,
      criticalMin: 40,
      criticalMax: 130,
    },
    {
      name: 'Blood Glucose',
      unit: 'mg/dL',
      min: 70,
      max: 140,
      criticalMin: 50,
      criticalMax: 200,
    },
    {
      name: 'SpO2',
      unit: '%',
      min: 95,
      max: 100,
      criticalMin: 90,
      criticalMax: 100,
    },
    {
      name: 'Temperature',
      unit: '°F',
      min: 97.0,
      max: 99.0,
      criticalMin: 95.0,
      criticalMax: 103.0,
    },
    {
      name: 'Weight',
      unit: 'lbs',
      min: 120,
      max: 200,
      criticalMin: 90,
      criticalMax: 300,
    },
  ];
  const sources: VitalReading['source'][] = [
    'healthie',
    'vital',
    'elation',
    'canvas',
  ];
  const careTeams = [
    'Team A',
    'Team B',
    'Team C',
    'Dr. Smith',
    'Dr. Johnson',
    'Nurse Wilson',
  ];
  const programs = ['Diabetes Care', 'Hypertension Management', 'Weight Loss', 'General Wellness'];

  const vitals: VitalReading[] = [];
  for (let i = 0; i < 50; i++) {
    const vitalType = vitalTypes[Math.floor(Math.random() * vitalTypes.length)];
    const value =
      vitalType.min +
      Math.random() * (vitalType.max - vitalType.min) +
      (Math.random() > 0.7 ? (Math.random() > 0.5 ? 20 : -20) : 0);

    const flags: ('high' | 'low' | 'critical')[] = [];
    if (value > vitalType.criticalMax || value < vitalType.criticalMin) {
      flags.push('critical');
    } else if (value > vitalType.max) {
      flags.push('high');
    } else if (value < vitalType.min) {
      flags.push('low');
    }

    vitals.push({
      id: `vital-${i}`,
      patientName: patients[Math.floor(Math.random() * patients.length)],
      patientId: `P${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      vitalType: vitalType.name,
      value: parseFloat(value.toFixed(1)),
      unit: vitalType.unit,
      source: sources[Math.floor(Math.random() * sources.length)],
      reviewed: Math.random() > 0.4,
      visible: true,
      flags,
      threshold: {
        min: vitalType.min,
        max: vitalType.max,
        criticalMin: vitalType.criticalMin,
        criticalMax: vitalType.criticalMax,
      },
      careTeam: [
        careTeams[Math.floor(Math.random() * careTeams.length)],
        careTeams[Math.floor(Math.random() * careTeams.length)],
      ],
      program: programs[Math.floor(Math.random() * programs.length)],
    });
  }

  return vitals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

function Original_PatientVitalsMonitor() {
  const [activeTab, setActiveTab] = useState('unreviewed');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedCareTeam, setSelectedCareTeam] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedThreshold, setSelectedThreshold] = useState('all');

  const [data, setData] = useState<VitalReading[]>(generateMockVitals());

  const toggleVisibility = (id: string) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, visible: !row.visible } : row))
    );
  };

  const toggleReviewed = (id: string) => {
    setData((prev) =>
      prev.map((row) => (row.id === id ? { ...row, reviewed: !row.reviewed } : row))
    );
  };

  const getValueColor = (reading: VitalReading) => {
    if (reading.flags.includes('critical')) return 'text-red-600 font-bold';
    if (reading.flags.includes('high') || reading.flags.includes('low'))
      return 'text-amber-600 font-semibold';
    return 'text-green-600';
  };

  const columns: ColumnDef<VitalReading>[] = [
    {
      accessorKey: 'patientName',
      header: 'Patient',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{row.original.patientName}</span>
          <span className="text-xs text-gray-500">{row.original.patientId}</span>
        </div>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">
            {row.original.timestamp.toLocaleDateString()}
          </span>
          <span className="text-xs text-gray-500">
            {row.original.timestamp.toLocaleTimeString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'vitalType',
      header: 'Vital Type',
      cell: ({ row }) => (
        <span className="text-sm font-medium text-gray-700">{row.original.vitalType}</span>
      ),
    },
    {
      accessorKey: 'flags',
      header: 'Flags',
      cell: ({ row }) => (
        <div className="flex gap-1 flex-wrap">
          {row.original.flags.length === 0 ? (
            <Badge variant="success">Normal</Badge>
          ) : (
            row.original.flags.map((flag) => (
              <Badge key={flag} variant={flag === 'critical' ? 'error' : 'warning'}>
                {flag === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                {flag.toUpperCase()}
              </Badge>
            ))
          )}
        </div>
      ),
    },
    {
      accessorKey: 'value',
      header: 'Value',
      cell: ({ row }) => (
        <span className={`text-sm font-mono ${getValueColor(row.original)}`}>
          {row.original.value}
        </span>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: ({ row }) => <span className="text-sm text-gray-600">{row.original.unit}</span>,
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => <Badge variant="info">{row.original.source}</Badge>,
    },
    {
      accessorKey: 'reviewed',
      header: 'Reviewed',
      cell: ({ row }) => (
        <button
          onClick={() => toggleReviewed(row.original.id)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            row.original.reviewed
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {row.original.reviewed ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Reviewed
            </>
          ) : (
            'Mark Reviewed'
          )}
        </button>
      ),
    },
    {
      id: 'actions',
      header: 'Visibility',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleVisibility(row.original.id)}
          className="p-1"
        >
          {row.original.visible ? (
            <Eye className="w-4 h-4 text-gray-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    let filtered = data;

    // Tab filter
    if (activeTab === 'unreviewed') {
      filtered = filtered.filter((row) => !row.reviewed);
    }

    // Date range filter
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter((row) => {
        const date = row.timestamp;
        if (dateRange.start && date < new Date(dateRange.start)) return false;
        if (dateRange.end && date > new Date(dateRange.end)) return false;
        return true;
      });
    }

    // Patient filter
    if (selectedPatient) {
      filtered = filtered.filter((row) => row.patientId === selectedPatient);
    }

    // Care team filter
    if (selectedCareTeam.length > 0) {
      filtered = filtered.filter((row) =>
        row.careTeam.some((team) => selectedCareTeam.includes(team))
      );
    }

    // Program filter
    if (selectedProgram) {
      filtered = filtered.filter((row) => row.program === selectedProgram);
    }

    // Threshold filter
    if (selectedThreshold !== 'all') {
      if (selectedThreshold === 'critical') {
        filtered = filtered.filter((row) => row.flags.includes('critical'));
      } else if (selectedThreshold === 'abnormal') {
        filtered = filtered.filter((row) => row.flags.length > 0);
      } else if (selectedThreshold === 'normal') {
        filtered = filtered.filter((row) => row.flags.length === 0);
      }
    }

    return filtered;
  }, [data, activeTab, dateRange, selectedPatient, selectedCareTeam, selectedProgram, selectedThreshold]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
  });

  const uniquePatients = Array.from(new Set(data.map((v) => v.patientId))).map((id) => ({
    value: id,
    label: `${data.find((v) => v.patientId === id)?.patientName} (${id})`,
  }));

  const uniqueCareTeams = Array.from(new Set(data.flatMap((v) => v.careTeam)));
  const uniquePrograms = Array.from(new Set(data.map((v) => v.program))).map((p) => ({
    value: p,
    label: p,
  }));

  const unreviewedCount = data.filter((v) => !v.reviewed).length;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Vitals Monitor</h1>
        <p className="text-sm text-gray-600 mt-1">
          Real-time monitoring and review of patient vital signs
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Tabs
              tabs={[
                { id: 'unreviewed', label: `Unreviewed (${unreviewedCount})` },
                { id: 'all', label: `All Vitals (${data.length})` },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
              {showFilters ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        {showFilters && (
          <CardContent className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Range
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, start: e.target.value }))
                    }
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Patient
                </Label>
                <Select
                  value={selectedPatient}
                  onChange={setSelectedPatient}
                  options={uniquePatients}
                  placeholder="All Patients"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Program
                </Label>
                <Select
                  value={selectedProgram}
                  onChange={setSelectedProgram}
                  options={uniquePrograms}
                  placeholder="All Programs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-700">
                  Threshold Filter
                </Label>
                <Select
                  value={selectedThreshold}
                  onChange={setSelectedThreshold}
                  options={[
                    { value: 'all', label: 'All Readings' },
                    { value: 'critical', label: 'Critical Only' },
                    { value: 'abnormal', label: 'Abnormal (High/Low)' },
                    { value: 'normal', label: 'Normal Only' },
                  ]}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label className="text-xs font-medium text-gray-700">
                  Care Team Filter
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {uniqueCareTeams.map((team) => (
                    <Checkbox
                      key={team}
                      checked={selectedCareTeam.includes(team)}
                      onChange={(checked) => {
                        if (checked) {
                          setSelectedCareTeam((prev) => [...prev, team]);
                        } else {
                          setSelectedCareTeam((prev) =>
                            prev.filter((t) => t !== team)
                          );
                        }
                      }}
                      label={team}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDateRange({ start: '', end: '' });
                  setSelectedPatient('');
                  setSelectedCareTeam([]);
                  setSelectedProgram('');
                  setSelectedThreshold('all');
                }}
              >
                Clear Filters
              </Button>
              <Badge variant="info">
                Showing {filteredData.length} of {data.length} vitals
              </Badge>
            </div>
          </CardContent>
        )}

        <CardContent className={showFilters ? 'border-t border-gray-200 pt-6' : ''}>
          <div className="rounded-md border">
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
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={!row.original.visible ? 'opacity-50' : ''}
                    >
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
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-500"
                    >
                      No vitals found matching your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
            <span className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769050633.931079" />
      <div style={{ marginTop: '40px' }}>
        <Original_PatientVitalsMonitor {...props} />
      </div>
    </>
  );
}