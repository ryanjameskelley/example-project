# User Test Project

This is a **test project** that simulates a real user installing `@yourcompany/ui-prototyping` into their existing React application.

## Purpose

This project helps you test the npm installation flow **before publishing** to npm. It's separate from `example-project` which demonstrates the tool's functionality after installation.

## What This Tests

✅ Installing the package via workspace protocol (simulates npm install)
✅ Running `npx ui-prototyping init` command
✅ Config file generation
✅ CLI tool functionality
✅ Package imports and types

## How It's Different from example-project

| Aspect | example-project | user-test-project |
|--------|----------------|-------------------|
| **Purpose** | Demo/reference implementation | Test installation flow |
| **State** | Fully configured with prototypes | Clean slate, no config |
| **Use case** | Show what's possible | Test user onboarding |
| **Runs on** | Port 3000 | Port 3001 |

## Testing the Installation Flow

### Step 1: Install Dependencies

From the **root of the monorepo**, run:

```bash
npm install
```

This installs dependencies for all workspaces, including this test project.

### Step 2: Build the Package

Build the ui-prototyping package:

```bash
cd packages/ui-prototyping
npm run build
cd ../..
```

### Step 3: Test the CLI Init Command

Navigate to this test project and run the init command:

```bash
cd examples/user-test-project
npm run init-prototyping
```

Or directly:

```bash
npx ui-prototyping init
```

**This should create:**
- ✅ `ui-prototyping.config.js`
- ✅ `.env.example`
- ✅ `Claude.md`
- ✅ `apps/prototypes/` directory
- ✅ Update `.gitignore`

### Step 4: Verify Generated Files

Check that files were created correctly:

```bash
ls -la
# Should see ui-prototyping.config.js, Claude.md, .env.example

ls -la apps/
# Should see prototypes/

cat ui-prototyping.config.js
# Should have template config
```

### Step 5: Test Configuration

Try validating the config:

```bash
npx ui-prototyping validate
```

Should show errors because placeholder values are used.

### Step 6: Start the Dev Server

```bash
npm run dev
```

Visit http://localhost:3001

You should see the test project homepage with installation status.

## What to Test

### ✅ CLI Commands

- [ ] `npx ui-prototyping init` creates files
- [ ] Running init again shows "already exists" error
- [ ] `npx ui-prototyping validate` checks config
- [ ] `npx ui-prototyping help` shows help

### ✅ Generated Files

- [ ] `ui-prototyping.config.js` has correct template
- [ ] `.env.example` has required variables
- [ ] `Claude.md` has customization guidelines
- [ ] `apps/prototypes/` directory exists
- [ ] `.gitignore` updated with prototype entries

### ✅ Package Imports

After init, test importing from the package:

```typescript
// In src/App.tsx (add temporarily)
import { defineConfig } from '@yourcompany/ui-prototyping';

// Should have TypeScript types and no errors
```

## Simulating Real npm Installation

To test as close to real npm installation as possible:

### Option 1: Use npm pack

```bash
# From root, build and pack the package
cd packages/ui-prototyping
npm run build
npm pack

# This creates yourcompany-ui-prototyping-0.1.0.tgz

# In a completely separate directory (outside monorepo)
mkdir /tmp/real-user-test
cd /tmp/real-user-test
npm init -y
npm install /path/to/ui-prototyping/packages/ui-prototyping/yourcompany-ui-prototyping-0.1.0.tgz

# Test the init command
npx ui-prototyping init
```

### Option 2: Use npm link

```bash
# Link the package globally
cd packages/ui-prototyping
npm run build
npm link

# In another directory
mkdir /tmp/real-user-test
cd /tmp/real-user-test
npm init -y
npm link @yourcompany/ui-prototyping

# Test the init command
npx ui-prototyping init
```

## Resetting for Another Test

To test the init command again:

```bash
# From user-test-project directory
rm -f ui-prototyping.config.js Claude.md .env.example
rm -rf apps/

# Now run init again
npm run init-prototyping
```

## Expected Behavior

### First Run (Success)

```
🎨 Initializing ui-prototyping in your project...

✅ Created apps/prototypes/ directory
✅ Created ui-prototyping.config.js
✅ Created .env.example
✅ Created Claude.md (optional customization)
✅ Updated .gitignore

✅ Setup complete!

📝 Next steps:
  1. Copy .env.example to .env and fill in your values:
     cp .env.example .env

  2. Update ui-prototyping.config.js with your organization details
  ...
```

### Second Run (Error)

```
🎨 Initializing ui-prototyping in your project...

❌ ui-prototyping.config.js already exists
💡 To reconfigure, delete the file and run init again
```

## Troubleshooting

### "Command not found: ui-prototyping"

The package isn't installed or built. From monorepo root:

```bash
npm install
cd packages/ui-prototyping
npm run build
```

### "Cannot find module '@yourcompany/ui-prototyping'"

The workspace link isn't working. From monorepo root:

```bash
npm install
```

### "No files created"

Check you're in the right directory:

```bash
pwd
# Should be: .../ui-prototyping/examples/user-test-project
```

## What's Next

After verifying the installation flow works:

1. **Fix any issues** in the CLI or package structure
2. **Update package name** in `packages/ui-prototyping/package.json`
3. **Publish to npm**: See `../../PUBLISHING.md`
4. **Test real installation**: `npm install @yourcompany/ui-prototyping` in a fresh project

## Differences from Production

| Aspect | This Test | Real Production |
|--------|-----------|----------------|
| Package source | `workspace:*` | `npm registry` |
| Installation | Local monorepo | `npm install` |
| Updates | Rebuild package | `npm update` |
| Version | Local build | Published version |

## Files Structure After Init

```
user-test-project/
├── src/                          # Your React app
├── apps/
│   └── prototypes/              # Created by init ✨
├── ui-prototyping.config.js     # Created by init ✨
├── Claude.md                    # Created by init ✨
├── .env.example                 # Created by init ✨
├── .gitignore                   # Updated by init ✨
└── package.json
```

## Testing Checklist

Before publishing to npm, verify:

- [ ] `npm run init-prototyping` works
- [ ] All config files are created correctly
- [ ] CLI commands work (init, validate, help)
- [ ] Package imports work with TypeScript
- [ ] Error messages are helpful
- [ ] Generated config templates are correct
- [ ] Documentation URLs are correct
- [ ] No "tellescope" or placeholder references

## Notes

- This project runs on **port 3001** (example-project uses 3000)
- Config files are **gitignored** by default
- The init command is **idempotent** (safe to run multiple times with warning)
- Test both workspace installation and tarball installation before publishing
