import { useEffect, useState } from 'react';
import { prototypes } from '../apps/prototypes/registry';

function App() {
  const [Component, setComponent] = useState<any>(null);

  useEffect(() => {
    const prototypeId = '1769041535.059149';
    const loadPrototype = prototypes[prototypeId];

    if (loadPrototype) {
      loadPrototype().then((mod: any) => {
        setComponent(() => mod.default);
      });
    }
  }, []);

  if (!Component) {
    return <div>Loading...</div>;
  }

  return <Component />;
}

export default App;
