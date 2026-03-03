import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { Switch } from '@/components/atoms/switch';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Label } from '@/components/atoms/Label';
import { Field } from '@/components/atoms/Field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { X } from 'lucide-react';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i + 1));

const TIMEZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Anchorage', 'Pacific/Honolulu', 'Europe/London', 'Europe/Paris',
  'Europe/Berlin', 'Europe/Moscow', 'Asia/Dubai', 'Asia/Kolkata',
  'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney', 'Pacific/Auckland',
];

export function SettingsCalendar() {
  const [fromHour, setFromHour] = useState('8');
  const [toHour, setToHour] = useState('17');
  const [copyReminders, setCopyReminders] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);
  const [templateRequired, setTemplateRequired] = useState(false);
  const [locationRequired, setLocationRequired] = useState(false);
  const [cancelReasons, setCancelReasons] = useState<string[]>([]);
  const [cancelInput, setCancelInput] = useState('');
  const [multiTimezone, setMultiTimezone] = useState(false);
  const [timezone1, setTimezone1] = useState('America/New_York');
  const [timezone2, setTimezone2] = useState('Europe/London');
  const [tz1Search, setTz1Search] = useState('');
  const [tz2Search, setTz2Search] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const markDirty = () => setIsDirty(true);

  const handleCancel = () => {
    setFromHour('8');
    setToHour('17');
    setCopyReminders(false);
    setShowRecurring(false);
    setTemplateRequired(false);
    setLocationRequired(false);
    setCancelReasons([]);
    setCancelInput('');
    setMultiTimezone(false);
    setTimezone1('America/New_York');
    setTimezone2('Europe/London');
    setIsDirty(false);
  };

  const handleSave = () => {
    setIsDirty(false);
  };

  const addReason = () => {
    const trimmed = cancelInput.trim();
    if (trimmed) {
      setCancelReasons((prev) => [trimmed, ...prev]);
      setCancelInput('');
      markDirty();
    }
  };

  const removeReason = (index: number) => {
    setCancelReasons((prev) => prev.filter((_, i) => i !== index));
    markDirty();
  };

  return (
    <div className="p-6 space-y-8">

      {/* Calendar Display Hours */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#0A0A0A]">Calendar Display Hours</h3>
        <div className="flex items-center gap-4">
          <Select value={fromHour} onValueChange={(v) => { setFromHour(v); markDirty(); }}>
            <SelectTrigger className="w-32">
              <span className="text-muted-foreground text-sm mr-1">From</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>{h}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={toHour} onValueChange={(v) => { setToHour(v); markDirty(); }}>
            <SelectTrigger className="w-32">
              <span className="text-muted-foreground text-sm mr-1">To</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>{h}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Display Multiple Timezones */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#0A0A0A]">Display Multiple Timezones</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-8">
            <Label className="text-sm text-[#0A0A0A] font-normal cursor-pointer">
              Display multiple timezones on calendar
            </Label>
            <Switch
              checked={multiTimezone}
              onCheckedChange={(v) => { setMultiTimezone(v); markDirty(); }}
            />
          </div>
          {multiTimezone && (
            <div className="flex items-center gap-4">
              <Select value={timezone1} onValueChange={(v) => { setTimezone1(v); setTz1Search(''); markDirty(); }}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent search={tz1Search} onSearchChange={setTz1Search} onCloseAutoFocus={() => setTz1Search('')}>
                  {TIMEZONES.filter(tz => tz.toLowerCase().includes(tz1Search.toLowerCase())).map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={timezone2} onValueChange={(v) => { setTimezone2(v); setTz2Search(''); markDirty(); }}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent search={tz2Search} onSearchChange={setTz2Search} onCloseAutoFocus={() => setTz2Search('')}>
                  {TIMEZONES.filter(tz => tz.toLowerCase().includes(tz2Search.toLowerCase())).map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Calendar Display Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#0A0A0A]">Calendar Display Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-8">
            <Label className="text-sm text-[#0A0A0A] font-normal cursor-pointer">
              Check Copy Reminders on event recurrences by default
            </Label>
            <Switch
              checked={copyReminders}
              onCheckedChange={(v) => { setCopyReminders(v); markDirty(); }}
            />
          </div>
          <div className="flex items-center justify-between gap-8">
            <Label className="text-sm text-[#0A0A0A] font-normal cursor-pointer">
              Show Make Recurring Icon on Profile Events List
            </Label>
            <Switch
              checked={showRecurring}
              onCheckedChange={(v) => { setShowRecurring(v); markDirty(); }}
            />
          </div>
          <div className="flex items-center justify-between gap-8">
            <Label htmlFor="template-required" className="text-sm text-[#0A0A0A] font-normal cursor-pointer">
              Template Selection Required
            </Label>
            <Checkbox
              id="template-required"
              checked={templateRequired}
              onCheckedChange={(v) => { setTemplateRequired(!!v); markDirty(); }}
            />
          </div>
          <div className="flex items-center justify-between gap-8">
            <Label htmlFor="location-required" className="text-sm text-[#0A0A0A] font-normal cursor-pointer">
              Location Selection Required
            </Label>
            <Checkbox
              id="location-required"
              checked={locationRequired}
              onCheckedChange={(v) => { setLocationRequired(!!v); markDirty(); }}
            />
          </div>
        </div>
      </div>

      {/* Predefined Cancel Reasons */}
      <Field label="Predefined Cancel Reasons">
        <div
          className="flex items-center gap-1.5 h-8 px-2 border border-input rounded-[10px] cursor-text focus-within:ring-2 focus-within:ring-[#EEEEEE] overflow-x-auto"
          onClick={() => document.getElementById('cancel-reason-input')?.focus()}
        >
          <input
            id="cancel-reason-input"
            type="text"
            value={cancelInput}
            onChange={(e) => setCancelInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addReason();
              }
            }}
            placeholder={cancelReasons.length === 0 ? 'Type a reason and press Enter\u2026' : 'Add another\u2026'}
            className={`outline-none text-sm bg-transparent placeholder:text-muted-foreground flex-shrink-0 ${cancelReasons.length === 0 ? 'flex-1' : 'w-[100px]'}`}
          />
          {cancelReasons.map((reason, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 bg-muted text-[#0A0A0A] text-sm px-2 py-0.5 rounded-[10px] whitespace-nowrap flex-shrink-0"
            >
              {reason}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeReason(i); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </Field>

      {/* Footer actions */}
      {isDirty && (
        <div className="flex items-center gap-2 pt-2 justify-end">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      )}
    </div>
  );
}
