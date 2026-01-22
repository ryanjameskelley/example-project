import { AuuiBanner } from '../../components/AuuiBanner';

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Filter,
  ChevronDown,
  Eye,
  EyeOff,
  Calendar,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Search,
} from 'lucide-react';

// Inline Badge component
const Badge = ({
  children,
  variant = 'default',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'secondary';
  className?: string;
}) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    destructive: 'bg-red-100 text-red-800',
    warning: 'bg-amber-100 text-amber-800',
    success: 'bg-green-100 text-green-800',
    secondary: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Inline Select component
const Select = ({
  value,
  onChange,
  options,
  placeholder,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Inline Checkbox component
const Checkbox = ({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}) => {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
  );
};

interface VitalReading {
  id: string;
  patientName: string;
  patientId: string;
  time: Date;
  vitalType: string;
  value: number;
  unit: string;
  source: 'healthie' | 'vital' | 'elation' | 'canvas';
  reviewed: boolean;
  flags: ('high' | 'low' | 'critical')[];
  normalRange: { min: number; max: number };
  careTeam: string[];
  program: string;
  visible: boolean;
}

const sampleVitals: VitalReading[] = [
  {
    id: '1',
    patientName: 'Sarah Chen',
    patientId: 'PT-001',
    time: new Date('2025-01-15T09:30:00'),
    vitalType: 'Blood Pressure (Systolic)',
    value: 165,
    unit: 'mmHg',
    source: 'healthie',
    reviewed: false,
    flags: ['high'],
    normalRange: { min: 90, max: 140 },
    careTeam: ['Dr. Johnson', 'Nurse Martinez'],
    program: 'Hypertension Management',
    visible: true,
  },
  {
    id: '2',
    patientName: 'Marcus Johnson',
    patientId: 'PT-002',
    time: new Date('2025-01-15T10:15:00'),
    vitalType: 'Blood Glucose',
    value: 245,
    unit: 'mg/dL',
    source: 'vital',
    reviewed: false,
    flags: ['high', 'critical'],
    normalRange: { min: 70, max: 130 },
    careTeam: ['Dr. Patel', 'Nurse Kim'],
    program: 'Diabetes Care',
    visible: true,
  },
  {
    id: '3',
    patientName: 'Emma Davis',
    patientId: 'PT-003',
    time: new Date('2025-01-15T11:00:00'),
    vitalType: 'Heart Rate',
    value: 72,
    unit: 'bpm',
    source: 'elation',
    reviewed: true,
    flags: [],
    normalRange: { min: 60, max: 100 },
    careTeam: ['Dr. Johnson', 'Nurse Lee'],
    program: 'Cardiac Monitoring',
    visible: true,
  },
  {
    id: '4',
    patientName: 'James Wilson',
    patientId: 'PT-004',
    time: new Date('2025-01-15T08:45:00'),
    vitalType: 'Oxygen Saturation',
    value: 88,
    unit: '%',
    source: 'canvas',
    reviewed: false,
    flags: ['low', 'critical'],
    normalRange: { min: 95, max: 100 },
    careTeam: ['Dr. Anderson', 'Nurse Thompson'],
    program: 'Respiratory Care',
    visible: true,
  },
  {
    id: '5',
    patientName: 'Lisa Rodriguez',
    patientId: 'PT-005',
    time: new Date('2025-01-15T13:20:00'),
    vitalType: 'Weight',
    value: 185,
    unit: 'lbs',
    source: 'healthie',
    reviewed: true,
    flags: [],
    normalRange: { min: 120, max: 180 },
    careTeam: ['Dr. Patel'],
    program: 'Weight Management',
    visible: true,
  },
  {
    id: '6',
    patientName: 'David Kim',
    patientId: 'PT-006',
    time: new Date('2025-01-15T14:10:00'),
    vitalType: 'Blood Pressure (Diastolic)',
    value: 95,
    unit: 'mmHg',
    source: 'vital',
    reviewed: false,
    flags: ['high'],
    normalRange: { min: 60, max: 90 },
    careTeam: ['Dr. Johnson', 'Nurse Martinez'],
    program: 'Hypertension Management',
    visible: true,
  },
];

function Original_PatientVitalsTable() {
  const [activeTab, setActiveTab] = useState<'unreviewed' | 'all'>('unreviewed');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedThreshold, setSelectedThreshold] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareTeam, setSelectedCareTeam] = useState<string[]>([]);
  const [vitals, setVitals] = useState(sampleVitals);

  const filteredVitals = vitals.filter((vital) => {
    if (activeTab === 'unreviewed' && vital.reviewed) return false;
    if (selectedPatient && vital.patientId !== selectedPatient) return false;
    if (selectedProgram && vital.program !== selectedProgram) return false;
    if (selectedThreshold === 'flagged' && vital.flags.length === 0) return false;
    if (searchTerm && !vital.patientName.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    return true;
  });

  const getValueColor = (vital: VitalReading) => {
    if (vital.flags.includes('critical')) return 'text-red-700 font-bold';
    if (vital.flags.includes('high')) return 'text-amber-600 font-semibold';
    if (vital.flags.includes('low')) return 'text-amber-600 font-semibold';
    return 'text-green-700';
  };

  const toggleVisibility = (id: string) => {
    setVitals(vitals.map((v) => (v.id === id ? { ...v, visible: !v.visible } : v)));
  };

  const toggleReviewed = (id: string) => {
    setVitals(vitals.map((v) => (v.id === id ? { ...v, reviewed: !v.reviewed } : v)));
  };

  const patients = Array.from(new Set(sampleVitals.map((v) => v.patientId))).map((id) => ({
    value: id,
    label: sampleVitals.find((v) => v.patientId === id)?.patientName || id,
  }));

  const programs = Array.from(new Set(sampleVitals.map((v) => v.program))).map((prog) => ({
    value: prog,
    label: prog,
  }));

  const careTeamMembers = Array.from(
    new Set(sampleVitals.flatMap((v) => v.careTeam))
  ).sort();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Vitals Monitor</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and review patient vital signs across all programs
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">{filteredVitals.filter((v) => !v.reviewed).length} Unreviewed</Badge>
            <Badge variant="destructive">
              {filteredVitals.filter((v) => v.flags.includes('critical')).length} Critical
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('unreviewed')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'unreviewed'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Unreviewed ({sampleVitals.filter((v) => !v.reviewed).length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'all'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  All Vitals ({sampleVitals.length})
                </div>
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search and Filter Toggle */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="whitespace-nowrap"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilterMenu ? 'Hide' : 'Show'} Filters
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Expanded Filter Menu */}
              {showFilterMenu && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date Range
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, start: e.target.value })
                        }
                        className="text-sm"
                      />
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          setDateRange({ ...dateRange, end: e.target.value })
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Patient Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Patient
                    </Label>
                    <Select
                      value={selectedPatient}
                      onChange={setSelectedPatient}
                      options={[{ value: '', label: 'All Patients' }, ...patients]}
                      placeholder="Select patient"
                    />
                  </div>

                  {/* Program Selector */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                      Program
                    </Label>
                    <Select
                      value={selectedProgram}
                      onChange={setSelectedProgram}
                      options={[{ value: '', label: 'All Programs' }, ...programs]}
                      placeholder="Select program"
                    />
                  </div>

                  {/* Threshold Selector */}
                  <div className="space-y-2">
                    <Label className

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769040696.645819" />
      <div style={{ marginTop: '40px' }}>
        <Original_PatientVitalsTable {...props} />
      </div>
    </>
  );
}