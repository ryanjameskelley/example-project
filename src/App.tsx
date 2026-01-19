import { prototypes } from '../apps/prototypes/registry';

function App() {
  // Get the prototype component from the registry
  const PrototypeComponent = prototypes['1768861766.008929'];

  if (!PrototypeComponent) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Prototype not found</h1>
        <p>Could not find prototype with ID: 1768861766.008929</p>
      </div>
    );
  }

  // Render the prototype component directly (no routing)
  return <PrototypeComponent />;
}

export default App;
