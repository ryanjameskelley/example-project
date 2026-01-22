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
  flexRender
} from '@tanstack/react-table';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Badge } from '@/components/atoms/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/molecules/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/organisms/table';
import {
  Calendar,
  Filter,
  Users,
  Activity,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  X
} from 'lucide-react';

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
  flags: string[];
  reviewed: boolean;
  careTeam: string[];
  program: string;
  visible: boolean;
}

// Mock data
const generateVitals = (): VitalReading[] => {
  const patients = [
    { id: 'P001', name: 'Sarah Martinez' },
    { id: 'P002', name: 'James Wilson' },
    { id: 'P003', name: 'Maria Garcia' },
    { id: 'P004', name: 'Robert Chen' },
    { id: 'P005', name: 'Linda Johnson' }
  ];
  
  const vitalTypes = [
    { type: 'Blood Pressure Systolic', unit: 'mmHg', min: 90, max: 140 },
    { type: 'Blood Pressure Diastolic', unit: 'mmHg', min: 60, max: 90 },
    { type: 'Heart Rate', unit: 'bpm', min: 60, max: 100 },
    { type: 'Blood Glucose', unit: 'mg/dL', min: 70, max: 140 },
    { type: 'Weight', unit: 'lbs', min: 100, max: 250 },
    { type: 'SpO2', unit: '%', min: 95, max: 100 }
  ];
  
  const sources: VitalReading['source'][] = ['healthie', 'vital', 'elation', 'canvas'];
  const programs = ['Diabetes Management', 'Cardiac Care', 'Weight Management', 'General Monitoring'];
  const careTeams = ['Dr. Smith', 'Nurse Johnson', 'Care Team A', 'Care Team B'];
  
  const vitals: VitalReading[] = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const vital = vitalTypes[Math.floor(Math.random() * vitalTypes.length)];
    const value = Math.round(vital.min + Math.random() * (vital.max - vital.min + 40) - 20);
    const flags: string[] = [];
    
    if (value < vital.min) flags.push('Below Threshold');
    if (value > vital.max) flags.push('Above Threshold');
    if (Math.random() > 0.7) flags.push('Critical');
    if (Math.random() > 0.8) flags.push('Trending');
    
    vitals.push({
      id: `V${String(i + 1).padStart(3, '0')}`,
      patientName: patient.name,
      patientId: patient.id,
      timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      vitalType: vital.type,
      value,
      unit: vital.unit,
      threshold: { min: vital.min, max: vital.max },
      source: sources[Math.floor(Math.random() * sources.length)],
      flags,
      reviewed: Math.random() > 0.4,
      careTeam: [careTeams[Math.floor(Math.random() * careTeams.length)]],
      program: programs[Math.floor(Math.random() * programs.length)],
      visible: true
    });
  }
  
  return vitals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const Tabs = ({ tabs, activeTab, onTabChange }: { 
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
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </nav>
  </div>
);

const Select = ({ value, onChange, options, placeholder = 'Select...', className = '' }: {
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
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

function Original_PatientVitalsMonitor() {
  const [vitals] = useState<VitalReading[]>(generateVitals());
  const [activeTab, setActiveTab] = useState<'unreviewed' | 'all'>('unreviewed');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedCareTeam, setSelectedCareTeam] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedThreshold, setSelectedThreshold] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVitals = useMemo(() => {
    let filtered = vitals;
    
    // Tab filter
    if (activeTab === 'unreviewed') {
      filtered = filtered.filter(v => !v.reviewed);
    }
    
    // Patient filter
    if (selectedPatient) {
      filtered = filtered.filter(v => v.patientId === selectedPatient);
    }
    
    // Care team filter
    if (selectedCareTeam) {
      filtered = filtered.filter(v => v.careTeam.includes(selectedCareTeam));
    }
    
    // Program filter
    if (selectedProgram) {
      filtered = filtered.filter(v => v.program === selectedProgram);
    }
    
    // Threshold filter
    if (selectedThreshold === 'critical') {
      filtered = filtered.filter(v => v.flags.includes('Critical'));
    } else if (selectedThreshold === 'above') {
      filtered = filtered.filter(v => v.value > v.threshold.max);
    } else if (selectedThreshold === 'below') {
      filtered = filtered.filter(v => v.value < v.threshold.min);
    }
    
    // Date range filter
    if (dateRange.start) {
      const start = new Date(dateRange.start);
      filtered = filtered.filter(v => v.timestamp >= start);
    }
    if (dateRange.end) {
      const end = new Date(dateRange.end);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(v => v.timestamp <= end);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.patientName.toLowerCase().includes(query) ||
        v.vitalType.toLowerCase().includes(query) ||
        v.source.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [vitals, activeTab, selectedPatient, selectedCareTeam, selectedProgram, selectedThreshold, dateRange, searchQuery]);

  const columns: ColumnDef<VitalReading>[] = [
    {
      accessorKey: 'patientName',
      header: 'Patient Name',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">{row.original.patientName}</div>
      )
    },
    {
      accessorKey: 'vitalType',
      header: 'Vital Type',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">{row.original.vitalType}</div>
      )
    },
    {
      accessorKey: 'timestamp',
      header: 'Time',
      cell: ({ row }) => (
        <div className="text-sm text-gray-600">
          {row.original.timestamp.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      )
    },
    {
      accessorKey: 'flags',
      header: 'Flags',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.flags.map((flag, idx) => (
            <Badge
              key={idx}
              variant={flag === 'Critical' ? 'destructive' : 'default'}
              className="text-xs"
            >
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
        const isAbove = value > threshold.max;
        const isBelow = value < threshold.min;
        const color = isAbove || isBelow ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold';
        
        return <div className={`text-sm ${color}`}>{value}</div>;
      }
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">{row.original.unit}</div>
      )
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs capitalize">
          {row.original.source}
        </Badge>
      )
    },
    {
      accessorKey: 'reviewed',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.reviewed ? 'default' : 'outline'}>
          {row.original.reviewed ? 'Reviewed' : 'Unreviewed'}
        </Badge>
      )
    },
    {
      id: 'actions',
      header: 'Visibility',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Toggle visibility logic would go here
          }}
        >
          {row.original.visible ? (
            <Eye className="w-4 h-4 text-gray-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </Button>
      )
    }
  ];

  const table = useReactTable({
    data: filteredVitals,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize: 20
      }
    }
  });

  const patients = Array.from(new Set(vitals.map(v => v.patientId))).map(id => ({
    value: id,
    label: vitals.find(v => v.patientId === id)?.patientName || id
  }));

  const careTeams = Array.from(new Set(vitals.flatMap(v => v.careTeam))).map(team => ({
    value: team,
    label: team
  }));

  const programs = Array.from(new Set(vitals.map(v => v.program))).map(prog => ({
    value: prog,
    label: prog
  }));

  const unreviewedCount = vitals.filter(v => !v.reviewed).length;
  const activeFiltersCount = [selectedPatient, selectedCareTeam, selectedProgram, selectedThreshold, dateRange.start, dateRange.end].filter(Boolean).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Vitals Monitor</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and review patient vital signs</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Activity className="w-4 h-4 mr-1" />
          {filteredVitals.length} readings
        </Badge>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Tabs
            tabs={[
              { id: 'unreviewed', label: 'Unreviewed', count: unreviewedCount },
              { id: 'all', label: 'All Vitals', count: vitals.length }
            ]}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as 'unreviewed' | 'all')}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Search and Filter Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search patients, vital types, or sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="whitespace-nowrap"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="default" className="ml-2 px-1.5 py-0.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Inline Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                Date Range Start
              </Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                <Calendar className="w-3 h-3 inline mr-1" />
                Date Range End
              </Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                <Users className="w-3 h-3 inline mr-1" />
                Patient
              </Label>
              <Select
                value={selectedPatient}
                onChange={setSelectedPatient}
                options={patients}
                placeholder="All Patients"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                <Users className="w-3 h-3 inline mr-1" />
                Care Team
              </Label>
              <Select
                value={selectedCareTeam}
                onChange={setSelectedCareTeam}
                options={careTeams}
                placeholder="All Care Teams"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                <Activity className="w-3 h-3 inline mr-1" />
                Program
              </Label>
              <Select
                value={selectedProgram}
                onChange={setSelectedProgram}
                options={programs}
                placeholder="All Programs"
              />
            </div>
          </div>

          {/* Expanded Filter Menu */}
          {showFilterMenu && (
            <Card className="border-2 border-blue-100 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">Advanced Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPatient('');
                      setSelectedCareTeam('');
                      setSelectedProgram('');
                      setSelectedThreshold('');
                      setDateRange({ start: '', end: '' });
                    }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      <Settings className="w-3 h-3 inline mr-1" />
                      Threshold Status
                    </Label>
                    <Select
                      value={selectedThreshold}
                      onChange={setSelectedThreshold}
                      options={[
                        { value: 'critical', label: 'Critical Only' },
                        { value: 'above', label: 'Above Threshold' },
                        { value: 'below', label: 'Below Threshold' }
                      ]}
                      placeholder="All Thresholds"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowFilterMenu(false)}
                      className="w-full"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Filters:</span>
              {selectedPatient && (
                <Badge variant="outline" className="text-xs">
                  Patient: {patients.find(p => p.value === selectedPatient)?.label}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedPatient('')}
                  />
                </Badge>
              )}
              {selectedCareTeam && (
                <Badge variant="outline" className="text-xs">
                  Care Team: {selectedCareTeam}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedCareTeam('')}
                  />
                </Badge>
              )}
              {selectedProgram && (
                <Badge variant="outline" className="text-xs">
                  Program: {selectedProgram}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedProgram('')}
                  />
                </Badge>
              )}
              {selectedThreshold && (
                <Badge variant="outline" className="text-xs">
                  Threshold: {selectedThreshold}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setSelectedThreshold('')}
                  />
                </Badge>
              )}
              {dateRange.start && (
                <Badge variant="outline" className="text-xs">
                  From: {new Date(dateRange.start).toLocaleDateString()}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setDateRange({ ...dateRange, start: '' })}
                  />
                </Badge>
              )}
              {dateRange.end && (
                <Badge variant="outline" className="text-xs">
                  To: {new Date(dateRange.end).toLocaleDateString()}
                  <X
                    className="w-3 h-3 ml-1 cursor-pointer"
                    onClick={() => setDateRange({ ...dateRange, end: '' })}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Data Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="bg-gray-50">
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
                    <TableRow key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                      No vitals found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                filteredVitals.length
              )}{' '}
              of {filteredVitals.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
        </CardContent>
      </Card>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769060329.897279" />
      <div style={{ marginTop: '40px' }}>
        <Original_PatientVitalsMonitor {...props} />
      </div>
    </>
  );
}