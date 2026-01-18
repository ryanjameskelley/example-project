function Home() {
  return (
    <div className="container">
      <div className="page">
        <h1>User Test Project</h1>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          This is a test project simulating a real user installing the UI Prototyping Tool.
        </p>

        <h2>Status</h2>
        <div style={{ marginTop: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>📦 Step 1:</strong> Basic React project created ✅
          </div>

          <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>🔧 Step 2:</strong> Install UI Prototyping package
            <pre style={{ marginTop: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '4px' }}>
              npm install @yourcompany/ui-prototyping
            </pre>
          </div>

          <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px', marginBottom: '1rem' }}>
            <strong>⚙️  Step 3:</strong> Initialize configuration
            <pre style={{ marginTop: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '4px' }}>
              npx ui-prototyping init
            </pre>
          </div>

          <div style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
            <strong>🚀 Step 4:</strong> Start using prototypes
          </div>
        </div>

        <h2 style={{ marginTop: '2rem' }}>Instructions</h2>
        <ol style={{ marginLeft: '2rem', color: '#666', lineHeight: '1.8' }}>
          <li>Run <code>npm install</code> from the root to install dependencies</li>
          <li>The package is linked via workspace protocol</li>
          <li>Run <code>npm run init-prototyping</code> to test the init command</li>
          <li>Check that config files were created</li>
          <li>This simulates what a real user would experience!</li>
        </ol>
      </div>
    </div>
  );
}

export default Home;
