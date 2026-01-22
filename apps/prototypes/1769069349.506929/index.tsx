import { AuuiBanner } from '../../components/AuuiBanner';

import { useState } from 'react';
import { Button } from '@/components/atoms/button';
import { Input } from '@/components/atoms/input';
import { Badge } from '@/components/atoms/badge';
import { Card, CardContent, CardHeader } from '@/components/molecules/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/organisms/table';
import { Search, Download, Eye, EyeOff, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

// Inline components required (not in whitelist)
const Tabs = ({ tabs, activeTab, onTabChange }: { tabs: { id: string; label: string; count?: number }[]; activeTab: string; onTabChange: (id: string) => void }) => (
  <div className="border-b border-gray-200">
    <nav className="flex -mb-px space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-1 border-b-2 text-sm font-medium flex items-center gap-2 ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${
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
  flags: ('high' | 'low' | 'critical')[];
  visible: boolean;
}

function Original_PatientVitalsMonitor() {
  const [activeTab, setActiveTab] = useState('unreviewed');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [vitalTypeFilter, setVitalTypeFilter] = useState('');

  // Mock data
  const vitals: VitalReading[] = [
    {
      id: '1',
      patientName: 'Sarah Chen',
      patientId: 'P-001',
      timestamp: new Date('2025-01-15T09:30:00'),
      vitalType: 'Blood Pressure',
      value: 145,
      unit: 'mmHg',
      normalRange: { min: 90, max: 120 },
      source: 'healthie',
      reviewed: false,
      flags: ['high'],
      visible: true
    },
    {
      id: '2',
      patientName: 'Marcus Johnson',
      patientId: 'P-002',
      timestamp: new Date('2025-01-15T10:15:00'),
      vitalType: 'Heart Rate',
      value: 110,
      unit: 'bpm',
      normalRange: { min: 60, max: 100 },
      source: 'vital',
      reviewed: false,
      flags: ['high'],
      visible: true
    },
    {
      id: '3',
      patientName: 'Emma Davis',
      patientId: 'P-003',
      timestamp: new Date('2025-01-15T11:00:00'),
      vitalType: 'Blood Glucose',
      value: 65,
      unit: 'mg/dL',
      normalRange: { min: 70, max: 100 },
      source: 'elation',
      reviewed: false,
      flags: ['low'],
      visible: true
    },
    {
      id: '4',
      patientName: 'James Wilson',
      patientId: 'P-004',
      timestamp: new Date('2025-01-15T08:45:00'),
      vitalType: 'Oxygen Saturation',
      value: 88,
      unit: '%',
      normalRange: { min: 95, max: 100 },
      source: 'canvas',
      reviewed: false,
      flags: ['critical', 'low'],
      visible: true
    },
    {
      id: '5',
      patientName: 'Lisa Anderson',
      patientId: 'P-005',
      timestamp: new Date('2025-01-14T16:20:00'),
      vitalType: 'Temperature',
      value: 98.6,
      unit: '°F',
      normalRange: { min: 97.0, max: 99.0 },
      source: 'healthie',
      reviewed: true,
      flags: [],
      visible: true
    },
    {
      id: '6',
      patientName: 'Robert Kim',
      patientId: 'P-006',
      timestamp: new Date('2025-01-14T14:30:00'),
      vitalType: 'Blood Pressure',
      value: 115,
      unit: 'mmHg',
      normalRange: { min: 90, max: 120 },
      source: 'vital',
      reviewed: true,
      flags: [],
      visible: true
    }
  ];

  const [visibilityState, setVisibilityState] = useState<Record<string, boolean>>(
    vitals.reduce((acc, vital) => ({ ...acc, [vital.id]: vital.visible }), {})
  );

  const filteredVitals = vitals.filter((vital) => {
    const matchesTab = activeTab === 'unreviewed' ? !vital.reviewed : true;
    const matchesSearch = vital.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vital.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = !sourceFilter || vital.source === sourceFilter;
    const matchesType = !vitalTypeFilter || vital.vitalType === vitalTypeFilter;
    
    return matchesTab && matchesSearch && matchesSource && matchesType;
  });

  const unreviewedCount = vitals.filter(v => !v.reviewed).length;

  const getValueColor = (vital: VitalReading) => {
    if (vital.flags.includes('critical')) return 'text-red-600 font-bold';
    if (vital.flags.includes('high')) return 'text-amber-600 font-semibold';
    if (vital.flags.includes('low')) return 'text-blue-600 font-semibold';
    return 'text-gray-900';
  };

  const getSourceBadge = (source: string) => {
    const colors: Record<string, string> = {
      healthie: 'bg-blue-100 text-blue-800',
      vital: 'bg-green-100 text-green-800',
      elation: 'bg-purple-100 text-purple-800',
      canvas: 'bg-amber-100 text-amber-800'
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  const toggleVisibility = (id: string) => {
    setVisibilityState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markAsReviewed = (id: string) => {
    const vital = vitals.find(v => v.id === id);
    if (vital) vital.reviewed = true;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Vitals Monitor</h1>
          <p className="text-sm text-gray-600 mt-1">Monitor and review patient vital signs across all sources</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs
              tabs={[
                { id: 'unreviewed', label: 'Unreviewed', count: unreviewedCount },
                { id: 'all', label: 'All Vitals', count: vitals.length }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={sourceFilter}
                  onChange={setSourceFilter}
                  options={[
                    { value: 'healthie', label: 'Healthie' },
                    { value: 'vital', label: 'Vital' },
                    { value: 'elation', label: 'Elation' },
                    { value: 'canvas', label: 'Canvas' }
                  ]}
                  placeholder="All Sources"
                  className="w-full sm:w-48"
                />
                <Select
                  value={vitalTypeFilter}
                  onChange={setVitalTypeFilter}
                  options={[
                    { value: 'Blood Pressure', label: 'Blood Pressure' },
                    { value: 'Heart Rate', label: 'Heart Rate' },
                    { value: 'Blood Glucose', label: 'Blood Glucose' },
                    { value: 'Oxygen Saturation', label: 'Oxygen Saturation' },
                    { value: 'Temperature', label: 'Temperature' }
                  ]}
                  placeholder="All Vitals"
                  className="w-full sm:w-48"
                />
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Patient Name</TableHead>
                      <TableHead className="w-40">Time</TableHead>
                      <TableHead className="w-32">Vital Type</TableHead>
                      <TableHead className="w-24">Flags</TableHead>
                      <TableHead className="w-32 text-right">Value</TableHead>
                      <TableHead className="w-24">Unit</TableHead>
                      <TableHead className="w-32">Source</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="w-24 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVitals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                          No vitals found matching your criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVitals.map((vital) => (
                        <TableRow key={vital.id} className={!visibilityState[vital.id] ? 'opacity-40' : ''}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://api.dicebear.com/9.x/shapes/svg?seed=${vital.patientId}`}
                                alt={vital.patientName}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-medium text-gray-900">{vital.patientName}</div>
                                <div className="text-xs text-gray-500">{vital.patientId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {vital.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            <div className="text-xs text-gray-400">
                              {vital.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-900">{vital.vitalType}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {vital.flags.includes('critical') && (
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              )}
                              {vital.flags.includes('high') && (
                                <TrendingUp className="w-4 h-4 text-amber-600" />
                              )}
                              {vital.flags.includes('low') && (
                                <TrendingDown className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className={`text-right text-lg ${getValueColor(vital)}`}>
                            {vital.value}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">{vital.unit}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceBadge(vital.source)}`}>
                              {vital.source}
                            </span>
                          </TableCell>
                          <TableCell>
                            {vital.reviewed ? (
                              <Badge variant="default" className="bg-green-100 text-green-800 border-0">
                                Reviewed
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => markAsReviewed(vital.id)}
                                className="text-xs"
                              >
                                Mark Reviewed
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVisibility(vital.id)}
                              className="p-2"
                            >
                              {visibilityState[vital.id] ? (
                                <Eye className="w-4 h-4 text-gray-600" />
                              ) : (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              {filteredVitals.length > 0 && (
                <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
                  <div>
                    Showing <span className="font-medium text-gray-900">{filteredVitals.length}</span> of{' '}
                    <span className="font-medium text-gray-900">{vitals.length}</span> vitals
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>{vitals.filter(v => v.flags.includes('critical')).length} Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-600" />
                      <span>{vitals.filter(v => v.flags.includes('high')).length} High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-blue-600" />
                      <span>{vitals.filter(v => v.flags.includes('low')).length} Low</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Component(props: any) {
  return (
    <>
      <AuuiBanner galleryUrl="https://app.auui.ai/prototypes/1769069349.506929" />
      <div style={{ marginTop: '40px' }}>
        <Original_PatientVitalsMonitor {...props} />
      </div>
    </>
  );
}