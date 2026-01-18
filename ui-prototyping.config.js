module.exports = {
  // Organization settings (get from https://yourservice.com/dashboard)
  organizationId: 'org_xxx',
  apiKey: process.env.UI_PROTOTYPING_API_KEY,

  // GitHub integration
  github: {
    repoOwner: 'your-github-org',        // Your GitHub username or organization
    repoName: 'your-repo-name',          // Your repository name
    token: process.env.GITHUB_TOKEN,     // Personal access token with 'repo' scope
    defaultBranch: 'main',
    prototypeBranchPrefix: 'prototypes/',
  },

  // Deployment (auto-detects Vercel, Netlify, Railway, etc.)
  deployment: {
    autoDetect: true,

    // OR manual configuration for self-hosted:
    // provider: 'self-hosted',
    // serverUrl: 'https://prototypes.yourapp.com',
  },

  // Billing
  billing: {
    organizationId: 'org_xxx',
    plan: 'pay-as-you-go',
    tokenLimit: 1000000,              // Optional: monthly limit
    alertThreshold: 0.8,               // Alert at 80% of limit
  },

  // Prototype settings
  prototypes: {
    autoDeleteAfterDays: 10,
    saveAction: 'create-pr',           // or 'direct-merge'
  },

  // Your component library (optional)
  componentLibrary: '@your-company/ui',

  // API endpoint (default: production)
  apiEndpoint: 'https://api.yourservice.com',
};
