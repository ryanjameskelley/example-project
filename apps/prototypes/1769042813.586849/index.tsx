import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Filter,
  Calendar as CalendarIcon,
  User,
  Users,
  Activity,
  AlertTriangle,
  Eye,
  EyeOff,
  ChevronDown,
  X,
} from 'lucide-react';

// Inline Badge component
const Badge = ({ 
  children, 
  variant = 'default',
  className = ''
}: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'secondary';
  className?: string;
}) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface VitalReading {
  id: string;
  patientName: string;
  patientId: string;
  timestamp: Date;
  vitalType: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  source: 'healthie' | 'vital' | 'elation' | 'canvas';
  reviewed: boolean;
  flags: ('critical' | 'high' | 'low')[];
  careTeam: string[];
  program: string;
  visible: boolean;
}

const mockVitals: VitalReading[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    patientId: 'P001',
    timestamp: new Date('2025-01-15T08:30:00'),
    vitalType: 'Blood Pressure',
    value: 165,
    unit: 'mmHg',
    normalRange: { min: 90, max: 140 },
    source: 'healthie',
    reviewed: false,
    flags: ['high'],
    careTeam: ['Dr. Smith', 'Nurse Williams'],
    program: 'Hypertension Management',
    visible: true,
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    patientId: 'P002',
    timestamp: new Date('2025-01-15T09:15:00'),
    vitalType: 'Blood Glucose',
    value: 185,
    unit: 'mg/dL',
    normalRange: { min: 70, max: 130 },
    source: 'vital',
    reviewed: false,
    flags: ['high'],
    careTeam: ['Dr. Martinez', 'Care Coordinator Brown'],
    program: 'Diabetes Care',
    visible: true,
  },
  {
    id: '3',
    patientName: 'Emily Rodriguez',
    patientId: 'P003',
    timestamp: new Date('2025-01-15T10:00:00'),
    vitalType: 'Heart Rate',
    value: 115,
    unit: 'bpm',
    normalRange: { min: 60, max: 100 },
    source: 'elation',
    reviewed: true,
    flags: ['high'],
    careTeam: ['Dr. Smith', 'Nurse Johnson'],
    program: 'Cardiac Monitoring',
    visible: true,
  },
  {
    id: '4',
    patientName: 'Robert Taylor',
    patientId: 'P004',
    timestamp: new Date('2025-01-15T10:45:00'),
    vitalType: 'Oxygen Saturation',
    value: 88,
    unit: '%',
    normalRange: { min: 95, max: 100 },
    source: 'canvas',
    reviewed: false,
    flags: ['critical', 'low'],
    careTeam: ['Dr. Martinez', 'Respiratory Therapist Lee'],
    program: 'Respiratory Care',
    visible: true,
  },
  {
    id: '5',
    patientName: 'Linda Williams',
    patientId: 'P005',
    timestamp: new Date('2025-01-15T11:30:00'),
    vitalType: 'Weight',
    value: 92,
    unit: 'kg',
    normalRange: { min: 50, max: 85 },
    source: 'healthie',
    reviewed: true,
    flags: ['high'],
    careTeam: ['Dr. Smith', 'Dietitian Anderson'],
    program: 'Weight Management',
    visible: true,
  },
  {
    id: '6',
    patientName: 'James Anderson',
    patientId: 'P006',
    timestamp: new Date('2025-01-15T12:15:00'),
    vitalType: 'Temperature',
    value: 38.9,
    unit: '°C',
    normalRange: { min: 36.5, max: 37.5 },
    source: 'vital',
    reviewed: false,
    flags: ['high'],
    careTeam: ['Dr. Martinez', 'Nurse Williams'],
    program: 'General Monitoring',
    visible: true,
  },
];

const patients = [
  { id: 'P001', name: 'Sarah Johnson' },
  { id: 'P002', name: 'Michael Chen' },
  { id: 'P003', name: 'Emily Rodriguez' },
  { id: 'P004', name: 'Robert Taylor' },
  { id: 'P005', name: 'Linda Williams' },
  { id: 'P006', name: 'James Anderson' },
];

const careTeamMembers = [
  'Dr. Smith',
  'Dr. Martinez',
  'Nurse Williams',
  'Nurse Johnson',
  'Care Coordinator Brown',
  'Respiratory Therapist Lee',
  'Dietitian Anderson',
];

const programs = [
  'Hypertension Management',
  'Diabetes Care',
  'Cardiac Monitoring',
  'Respiratory Care',
  'Weight Management',
  'General Monitoring',
];

function Original_PatientVitalsTable() {
  const [activeTab, setActiveTab] = useState<'unreviewed' | 'all'>('unreviewed');
  const [vitals, setVitals] = useState(mockVitals);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selectedPatient, setSelectedPatient] = useState<string>('all');
  const [selectedCareTeam, setSelectedCareTeam] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [thresholdFilter, setThresholdFilter] = useState<string>('all');

  const getValueColor = (vital: VitalReading) => {
    if (vital.flags.includes('critical')) return 'text-red-700 font-bold';
    if (vital.flags.includes('high')) return 'text-amber-700 font-semibold';
    if (vital.flags.includes('low')) return 'text-blue-700 font-semibold';
    return 'text-gray-900';
  };

  const getValueBackground = (vital: VitalReading) => {
    if (vital.flags.includes('critical')) return 'bg-red-50';
    if (vital.flags.includes('high')) return 'bg-amber-50';
    if (vital.flags.includes('low')) return 'bg-blue-50';
    return '';
  };

  const toggleVisibility = (id: string) => {
    setVitals(vitals.map(v => 
      v.id === id ? { ...v, visible: !v.visible } : v
    ));
  };

  const toggleReviewed = (id: string) => {
    setVitals(vitals.map(v => 
      v.id === id ? { ...v, reviewed: !v.reviewed } : v
    ));
  };

  const filteredVitals = vitals.filter(vital => {
    if (activeTab === 'unreviewed' && vital.reviewed) return false;
    if (selectedPatient !== 'all' && vital.patientId !== selectedPatient) return false;
    if (selectedProgram !== 'all' && vital.program !== selectedProgram) return false;
    if (thresholdFilter === 'above' && !vital.flags.includes('high') && !vital.flags.includes('critical')) return false;
    if (thresholdFilter === 'below' && !vital.flags.includes('low')) return false;
    if (thresholdFilter === 'critical' && !vital.flags.includes('critical')) return false;
    if (selectedCareTeam.length > 0 && !selectedCareTeam.some(member => vital.careTeam.includes(member))) return false;
    return true;
  });

  const unreviewedCount = vitals.filter(v => !v.reviewed).length;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Vitals Monitor</h1>
            <p className="text-sm text-gray-600 mt-1">Track and review patient vital signs</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'unreviewed' | 'all')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="unreviewed" className="relative">
              Unreviewed
              {unreviewedCount > 0 && (
                <Badge variant="danger" className="ml-2">
                  {unreviewedCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All Vitals</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date Range
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                            </>
                          ) : (
                            dateRange.from.toLocaleDateString()
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range) => setDateRange(range || {})}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Patient Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Patient
                  </Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="All Patients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patients</SelectItem>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Care Team Filter */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Care Team
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          {selectedCareTeam.length === 0 ? (
                            'All Team Members'
                          ) : (
                            `${selectedCareTeam.length} selected`
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">Select Team Members</Label>
                          {selectedCareTeam.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCareTeam([])}
                              className="h-auto p-0 text-xs"
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        {careTeamMembers.map(member => (
                          <div key={member} className="flex items-center space-x-2">
                            <Checkbox
                              id={member}
                              checked={selectedCareTeam.includes(member)}
                              onCheckedChange={(checked) => {

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769042813.586849" />
      <div style={{ marginTop: '40px' }}>
        <Original_PatientVitalsTable {...props} />
      </div>
    </>
  );
}