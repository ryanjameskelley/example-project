# Action Editor Architecture - Revised Approach

## Executive Summary

**MAJOR INSIGHT:** Instead of building 50+ specialized editor components, use a **schema-driven, configuration-based approach** that leverages existing atoms.

**Current State:** You have all the core UI primitives needed (Field, Select, Button, etc.)
**New Approach:** Configuration schemas + generic field renderer = scalable solution
**Estimated Build Time:** 3-5 days (vs. 3-4 weeks)

---

## ✅ EXISTING COMPONENTS (All You Need!)

### Atoms (Basic UI Elements) - SUFFICIENT
| Component | Location | Purpose | Usage |
|-----------|----------|---------|-------|
| **Field** | `atoms/Field.tsx` | Handles text, textarea, number inputs via children | ✅ Use for ALL basic inputs |
| **Select** | `atoms/Select.tsx` | Dropdown selector (Radix UI) | ✅ Use for dropdowns |
| **Checkbox** | `atoms/Checkbox.tsx` | Boolean toggles | ✅ Use for booleans |
| **Switch** | `atoms/switch.tsx` | On/off toggles | ✅ Use for toggles |
| **Button** | `atoms/Button.tsx` | Action buttons | ✅ Use for actions |
| **Badge** | `atoms/badge.tsx` | Tags/status | ✅ Use for tag displays |

### Molecules (Composite Components)
| Component | Location | Purpose | Usage |
|-----------|----------|---------|-------|
| **StepSettingsDrawer** | `molecules/StepSettingsDrawer.tsx` | Existing editor with FieldRenderer pattern | ✅ Template to extend |
| **MultiFieldItem** | `molecules/MultiFieldItem.tsx` | Drag-and-drop list items | ✅ Use for array fields |
| **SearchList** | `molecules/SearchList.tsx` | Searchable lists | ✅ Use for searchable selects |
| **Drawer** | `molecules/Drawer.tsx` | Side panel | ✅ Use for editing |
| **FlowNode** | `molecules/FlowNode.tsx` | Display component | ✅ Keep for visualization |

---

## 🎯 REVISED ARCHITECTURE: Configuration-Driven

### Core Principle
**Don't build 50 editors. Build 1 smart renderer that reads 50 configurations.**

### Phase 1: No New Components Needed (0 days)

**Field component already handles:**
- ✅ Text inputs (wrap `<input type="text">`)
- ✅ Textareas (wrap `<textarea>`)
- ✅ Number inputs (wrap `<input type="number">`)
- ✅ Email inputs (wrap `<input type="email">`)

**Select component already handles:**
- ✅ Dropdowns with options
- ✅ Single selection

**Existing components handle:**
- ✅ Multi-select tags (SearchList + Badge)
- ✅ Array fields (MultiFieldItem)
- ✅ Booleans (Checkbox, Switch)

---

## 🏗️ NEW ARCHITECTURE: Schema-Driven Approach

### 1. Action Configuration Schema (1 file)
```typescript
// src/lib/action-schemas.ts
export const ACTION_SCHEMAS = {
  sendEmail: {
    label: 'Send Email',
    category: 'Communication',
    icon: 'Mail',
    fields: [
      { key: 'template', label: 'Email Template', type: 'select', required: true,
        options: 'templates', // references data source
        searchable: true },
      { key: 'subject', label: 'Subject Override', type: 'text' },
      { key: 'body', label: 'Body Override', type: 'textarea' },
      { key: 'cc', label: 'CC', type: 'text', placeholder: 'email@example.com' },
      { key: 'from', label: 'From Address Override', type: 'select',
        options: 'fromAddresses' },
    ]
  },
  sendSMS: {
    label: 'Send SMS',
    category: 'Communication',
    icon: 'Phone',
    fields: [
      { key: 'message', label: 'Message', type: 'textarea', required: true, maxLength: 160 },
      { key: 'fromNumber', label: 'From Number', type: 'select', options: 'phoneNumbers' },
    ]
  },
  addEnduserTags: {
    label: 'Add Tags',
    category: 'Contact Management',
    icon: 'Tag',
    fields: [
      { key: 'tags', label: 'Tags', type: 'multi-select', required: true, options: 'tags' },
      { key: 'replaceExisting', label: 'Replace Existing Tags', type: 'boolean' },
    ]
  },
  setEnduserFields: {
    label: 'Set Contact Fields',
    category: 'Contact Management',
    icon: 'Edit',
    fields: [
      { key: 'fieldMappings', label: 'Field Mappings', type: 'key-value-array', required: true,
        keyOptions: 'contactFields', // field selector
        valueType: 'dynamic' // based on field type
      },
    ]
  },
  aiDecision: {
    label: 'AI Decision',
    category: 'Logic',
    icon: 'Sparkles',
    fields: [
      { key: 'prompt', label: 'Decision Prompt', type: 'textarea', required: true,
        placeholder: 'Analyze the contact data and decide...',
        variables: true }, // enables variable insertion
      { key: 'dataSources', label: 'Data Sources', type: 'multi-select',
        options: 'dataSources' },
      { key: 'model', label: 'AI Model', type: 'select',
        options: [{ value: 'gpt-4', label: 'GPT-4' }, { value: 'gpt-3.5', label: 'GPT-3.5' }]},
    ]
  },
  // ... 45+ more action schemas (just data, no components!)
};
```

### 2. Enhanced FieldRenderer (extend existing pattern)

```typescript
// Extend StepSettingsDrawer's FieldRenderer to handle more types
function FieldRenderer({ field, value, onChange }) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'number':
      return (
        <Field label={field.label} required={field.required}>
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
            className={baseInputClass}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
          />
        </Field>
      );

    case 'textarea':
      return (
        <Field label={field.label} required={field.required}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={baseTextareaClass}
            placeholder={field.placeholder}
            maxLength={field.maxLength}
          />
        </Field>
      );

    case 'select':
      const options = resolveOptions(field.options); // fetch from data source or use inline
      return (
        <Field label={field.label} required={field.required}>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      );

    case 'multi-select':
      // Use SearchList + Badge for tag selection
      return (
        <Field label={field.label} required={field.required}>
          <TagSelector
            options={resolveOptions(field.options)}
            value={value || []}
            onChange={onChange}
          />
        </Field>
      );

    case 'boolean':
      return (
        <Field label={field.label}>
          <div className="flex items-center gap-2">
            <Switch checked={value} onCheckedChange={onChange} />
            <span className="text-sm">{field.description}</span>
          </div>
        </Field>
      );

    case 'key-value-array':
      // Use MultiFieldItem for dynamic field mappings
      return (
        <Field label={field.label} required={field.required}>
          <KeyValueArrayEditor
            value={value || []}
            onChange={onChange}
            keyOptions={resolveOptions(field.keyOptions)}
          />
        </Field>
      );

    default:
      return null;
  }
}
```

### 3. Only 3-5 Specialized Components Needed
These handle edge cases that can't be solved with basic inputs:

| Component | Purpose | Why Specialized? | Time |
|-----------|---------|------------------|------|
| **TagSelector** | Multi-select with search, add new tags | Combines SearchList + Badge + creation | 3h |
| **KeyValueArrayEditor** | Dynamic field mappings | Uses MultiFieldItem + dynamic inputs | 3h |
| **VariableTextarea** | Textarea with @variable insertion | Special @ autocomplete behavior | 3h |
| **ConditionBuilder** | Visual if/then branches (advanced only) | Complex nested logic UI | 4h |
| **WebhookHeadersEditor** | Key-value pairs for HTTP headers | Specialized KV with validation | 2h |

**Total:** ~15 hours (2 days)

**Note:** These are truly specialized. The other "specialized" components (TemplateSelector, UserPicker, etc.) are just `<Select>` with different data sources.

---

## 📦 WHAT THIS ELIMINATES

### ❌ NO LONGER NEEDED (Replaced by Schema + Select):
- ~~TemplateSelector~~ → `<Select options="templates">`
- ~~IntegrationPicker~~ → `<Select options="integrations">`
- ~~UserPicker~~ → `<Select options="users">`
- ~~JourneyPicker~~ → `<Select options="journeys">`
- ~~FormPicker~~ → `<Select options="forms">`
- ~~PhoneNumberPicker~~ → `<Select options="phoneNumbers">`
- ~~EmailAddressInput~~ → `<input type="email">`
- ~~ContentSelector~~ → `<Select options="content">`
- ~~CarePlanTemplateSelector~~ → `<Select options="carePlanTemplates">`
- ~~DelayTimePicker~~ → `<input type="number"> + <Select>` (combined fields)
- ~~AIPromptEditor~~ → `<VariableTextarea>` (generic component)

### ❌ NO LONGER NEEDED (No 50+ Action Editors!):
- ~~SendEmailEditor.tsx~~
- ~~SendSMSEditor.tsx~~
- ~~CreateTicketEditor.tsx~~
- ~~... 47 more files~~

**All replaced by:** `ACTION_SCHEMAS` configuration file

---

## 🎯 REVISED BUILD PLAN

### Day 1: Schema Foundation (4-6 hours)
1. **Create action schemas** (`src/lib/action-schemas.ts`)
   - Define all 50+ action configurations
   - Just JSON-like data, no components!

2. **Create data source resolvers** (`src/lib/data-sources.ts`)
   - Functions that fetch templates, users, tags, etc.
   - Example: `resolveOptions('templates')` → fetches template list

3. **Extend FieldRenderer** (update `StepSettingsDrawer.tsx`)
   - Add cases for new field types
   - Wire up data source resolution

### Day 2-3: Specialized Components (12-16 hours)

Build the 5 truly specialized components:
- TagSelector (multi-select with creation)
- KeyValueArrayEditor (dynamic mappings)
- VariableTextarea (variable insertion)
- ConditionBuilder (visual logic - optional, can defer)
- WebhookHeadersEditor (HTTP headers)

### Day 4: Integration & Polish (4-6 hours)

- Wire schemas into existing StepSettingsDrawer
- Test with 5-10 different action types
- Add validation and error handling
- Polish UX

### Day 5: Complete Remaining Schemas (2-4 hours)

- Fill out all 50+ action schemas
- Test edge cases
- Documentation

---

## 📊 COMPARISON: Old vs New Approach

| Aspect | Old Approach | New Approach |
|--------|--------------|--------------|
| **Components to Build** | ~72 components | ~5 components |
| **Lines of Code** | ~15,000+ lines | ~2,000 lines |
| **Build Time** | 3-4 weeks | 3-5 days |
| **Maintenance** | Update 50+ files per change | Update 1 schema file |
| **Type Safety** | 50+ prop interfaces | 1 schema type |
| **Adding New Actions** | Build new component | Add schema entry |
| **Flexibility** | Limited to component props | Full schema control |
| **Testing** | Test 50+ components | Test 1 renderer + schemas |

---

## ✅ BENEFITS OF SCHEMA APPROACH

1. **Drastically Reduced Code**
   - 1 configuration file replaces 50+ component files

2. **Easier Maintenance**
   - Change field rendering once, applies everywhere

3. **Faster Development**
   - Adding new action = adding 10 lines of config

4. **Better Consistency**
   - All actions use same rendering logic

5. **Data-Driven**
   - Non-developers can modify schemas

6. **Easier Testing**
   - Test the renderer once, validate schemas

7. **Flexible**
   - Easy to add new field types to renderer
   - Schema can grow with new capabilities

---

## 🏗️ FINAL FILE STRUCTURE

```
src/
├── lib/
│   ├── action-schemas.ts          ← All 50+ action configs (1 file!)
│   ├── data-sources.ts            ← Data fetching functions
│   └── field-types.ts             ← Field type definitions
│
├── components/
│   ├── atoms/
│   │   └── [existing atoms]       ← No changes needed
│   │
│   ├── molecules/
│   │   ├── StepSettingsDrawer.tsx ← Extend FieldRenderer
│   │   ├── TagSelector.tsx        ← NEW (multi-select)
│   │   ├── KeyValueArrayEditor.tsx← NEW (dynamic mappings)
│   │   ├── VariableTextarea.tsx   ← NEW (variable insertion)
│   │   ├── ConditionBuilder.tsx   ← NEW (optional, for complex logic)
│   │   └── WebhookHeadersEditor.tsx← NEW (HTTP headers)
│   │
│   └── organisms/
│       └── [existing organisms]    ← No changes needed
```

**Total New Files:** 6 files (vs. 72+ in old approach)

---

## 🚀 NEXT STEPS

**Recommended: Start with Schema Foundation (Day 1)**

This proves the concept immediately:
1. Create `action-schemas.ts` with 3-5 example actions
2. Extend FieldRenderer to handle those actions
3. Wire into existing StepSettingsDrawer
4. See it work end-to-end in a few hours

Then decide if you need the specialized components or if basic inputs suffice for your prototype.

**Ready to start?**

---

## 📋 RECOMMENDED BUILD ORDER

### Week 1: Foundation
- ✅ Day 1-2: Build 5 core input atoms
- ✅ Day 3: Build FlowNodeEditor router
- ✅ Day 4-5: Build TemplateSelector, TagPicker, ContactFieldPicker

### Week 2: Specialized Components
- ✅ Day 6-7: Build ConditionBuilder, IntegrationPicker
- ✅ Day 8-9: Build UserPicker, JourneyPicker, FormPicker, WebhookEditor
- ✅ Day 10: Build DelayTimePicker, AIPromptEditor

### Week 3: Action Editors (Critical)
- ✅ Day 11-12: Build SendEmailEditor, SendSMSEditor, CreateTicketEditor
- ✅ Day 13-14: Build SetEnduserFieldsEditor, AIDecisionEditor
- ✅ Day 15: Build AddEnduserTagsEditor, SendWebhookEditor

### Week 4: Action Editors (Remaining)
- ✅ Day 16-17: Build 10 high-priority action editors
- ✅ Day 18-19: Build 10 medium-priority action editors
- ✅ Day 20: Build remaining editors + testing

---

## 🏗️ RECOMMENDED FILE STRUCTURE

```
src/components/
├── atoms/
│   ├── Button.tsx              ✅ Exists
│   ├── Field.tsx               ✅ Exists
│   ├── Select.tsx              ✅ Exists
│   ├── Checkbox.tsx            ✅ Exists
│   ├── Switch.tsx              ✅ Exists
│   ├── Input.tsx               ❌ NEW (Phase 1)
│   ├── Textarea.tsx            ❌ NEW (Phase 1)
│   ├── NumberInput.tsx         ❌ NEW (Phase 1)
│   ├── Combobox.tsx            ❌ NEW (Phase 1)
│   └── RadioGroup.tsx          ❌ NEW (Phase 1)
│
├── molecules/
│   ├── FlowNode.tsx            ✅ Exists (display only)
│   ├── Drawer.tsx              ✅ Exists
│   ├── MultiFieldItem.tsx      ✅ Exists
│   ├── SearchList.tsx          ✅ Exists
│   │
│   └── editor-fields/          ❌ NEW DIRECTORY (Phase 2)
│       ├── TemplateSelector.tsx
│       ├── TagPicker.tsx
│       ├── ConditionBuilder.tsx
│       ├── ContactFieldPicker.tsx
│       ├── IntegrationPicker.tsx
│       ├── UserPicker.tsx
│       ├── JourneyPicker.tsx
│       ├── FormPicker.tsx
│       ├── WebhookEditor.tsx
│       ├── DelayTimePicker.tsx
│       ├── AIPromptEditor.tsx
│       ├── PhoneNumberPicker.tsx
│       ├── EmailAddressInput.tsx
│       ├── ContentSelector.tsx
│       └── CarePlanTemplateSelector.tsx
│
└── organisms/
    ├── Table.tsx               ✅ Exists
    ├── Vitals.tsx              ✅ Exists
    ├── FlowNodeEditor.tsx      ❌ NEW (Phase 3)
    │
    └── action-editors/         ❌ NEW DIRECTORY (Phase 4)
        ├── SendEmailEditor.tsx
        ├── SendSMSEditor.tsx
        ├── CreateTicketEditor.tsx
        ├── SetEnduserFieldsEditor.tsx
        ├── AIDecisionEditor.tsx
        ├── AddEnduserTagsEditor.tsx
        ├── RemoveEnduserTagsEditor.tsx
        ├── SendWebhookEditor.tsx
        ├── NotifyTeamEditor.tsx
        ├── AddToJourneyEditor.tsx
        ├── RemoveFromJourneyEditor.tsx
        ├── ConditionEditor.tsx
        ├── CreateTicketEditor.tsx
        ├── CompleteTicketsEditor.tsx
        ├── SetEnduserStatusEditor.tsx
        ├── ChangeContactTypeEditor.tsx
        ├── AddAccessTagsEditor.tsx
        ├── RemoveAccessTagsEditor.tsx
        ├── RemoveFromAllJourneysEditor.tsx
        ├── ShareContentEditor.tsx
        ├── CreateCarePlanEditor.tsx
        ├── CompleteCarePlanEditor.tsx
        ├── SwitchToRelatedContactEditor.tsx
        ├── CancelFutureAppointmentsEditor.tsx
        ├── CancelCurrentEventEditor.tsx
        ├── ConfirmCurrentEventEditor.tsx
        ├── OutboundCallEditor.tsx
        ├── CallUserEditor.tsx
        ├── AssignCareTeamEditor.tsx
        ├── RemoveCareTeamEditor.tsx
        ├── AssignInboxItemEditor.tsx
        ├── StripeChargeCardOnFileEditor.tsx
        ├── SendChatEditor.tsx
        ├── SendFormEditor.tsx
        ├── PushFormsToPortalEditor.tsx
        ├── IterableSendEmailEditor.tsx
        ├── IterableCustomEventEditor.tsx
        ├── ZendeskCreateTicketEditor.tsx
        ├── ZusSyncEditor.tsx
        ├── ZusPullEditor.tsx
        ├── ZusSubscribeEditor.tsx
        ├── MetriportSyncEditor.tsx
        ├── PagerDutyCreateIncidentEditor.tsx
        ├── SmartMeterPlaceOrderEditor.tsx
        ├── HealthieSyncEditor.tsx
        ├── HealthieAddToCourseEditor.tsx
        ├── HealthieSendChatEditor.tsx
        ├── ActiveCampaignSyncEditor.tsx
        ├── ActiveCampaignAddToListsEditor.tsx
        ├── ElationSyncEditor.tsx
        ├── AthenaSync Editor.tsx
        ├── CanvasSyncEditor.tsx
        ├── CanvasCreateNoteEditor.tsx
        ├── DevelopHealthMedEligibilityEditor.tsx
        └── CustomerIOIdentifyEditor.tsx
```

---

## 🎯 KEY PATTERNS TO FOLLOW

### 1. Extend StepSettingsDrawer Pattern
The existing `StepSettingsDrawer.tsx` already has:
- ✅ Drawer integration
- ✅ FieldRenderer pattern for dynamic fields
- ✅ Form state management
- ✅ Save/Cancel handling

**Recommendation:** Extend the `FieldRenderer` component to support new field types:

```typescript
// Current FieldRenderer supports:
- 'text'
- 'textarea'
- 'number'
- 'select'

// Add support for:
- 'template'      → TemplateSelector
- 'tags'          → TagPicker
- 'condition'     → ConditionBuilder
- 'contactField'  → ContactFieldPicker
- 'integration'   → IntegrationPicker
- 'user'          → UserPicker
- 'journey'       → JourneyPicker
- 'form'          → FormPicker
- 'webhook'       → WebhookEditor
- 'delay'         → DelayTimePicker
- 'prompt'        → AIPromptEditor
- 'phone'         → PhoneNumberPicker
- 'email'         → EmailAddressInput
- 'content'       → ContentSelector
- 'carePlan'      → CarePlanTemplateSelector
```

### 2. Action Editor Registry Pattern

```typescript
// src/lib/action-editor-registry.ts
import { SendEmailEditor } from '@/components/organisms/action-editors/SendEmailEditor';
import { SendSMSEditor } from '@/components/organisms/action-editors/SendSMSEditor';
// ... import all 50+ editors

export const ACTION_EDITORS = {
  sendEmail: SendEmailEditor,
  sendSMS: SendSMSEditor,
  createTicket: CreateTicketEditor,
  aiDecision: AIDecisionEditor,
  setEnduserFields: SetEnduserFieldsEditor,
  // ... all 50+ action types
} as const;

export type ActionType = keyof typeof ACTION_EDITORS;
```

### 3. Shared Props Interface

```typescript
// All action editors follow this interface
interface ActionEditorProps {
  data: Record<string, any>;
  onChange: (data: Record<string, any>) => void;
  onSave?: () => void;
  onCancel?: () => void;
}
```

---

## 📦 DEPENDENCIES NEEDED

Based on specialized components, you'll likely need:

```bash
# Date/time handling
npm install date-fns

# Rich text editor (for email/prompt editing)
npm install @tiptap/react @tiptap/starter-kit

# Code editor (for webhook JSON editing)
npm install @monaco-editor/react

# Form validation
npm install zod react-hook-form @hookform/resolvers

# Multi-select components
npm install react-select

# Drag and drop (for reordering conditions/tags)
npm install @dnd-kit/core @dnd-kit/sortable
```

---

## ✅ NEXT STEPS

**Ready to start?** I can scaffold out:

1. **Option A: Foundation First**
   - Build 5 core input atoms (Input, Textarea, NumberInput, Combobox, RadioGroup)
   - Build FlowNodeEditor router component
   - Create action editor registry pattern

2. **Option B: Quick Win**
   - Build SendEmailEditor end-to-end (including TemplateSelector)
   - Demonstrates full workflow from router → editor → specialized fields
   - Proves architecture before scaling to 50+ editors

3. **Option C: Infrastructure**
   - Build all 15 specialized editor molecules first
   - Then action editors can compose them quickly

**Which approach would you prefer?**
