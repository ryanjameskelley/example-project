import { useState } from 'react'
import { Button } from './components/ui/button'
import { ExampleComponent } from './components/ExampleComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">UI Design System</h1>
      
      <div className="grid gap-8">
        <ExampleComponent />
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">shadcn/ui Buttons</h2>
          <div className="flex gap-2 flex-wrap">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Counter Example</h2>
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
