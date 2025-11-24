import { Button, SearchInput, FormField, Badge } from '@atomic/ui'

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Atomic Design System
          </h1>
          <p className="text-lg text-muted-foreground">
            React components with shadcn/ui styling in a monorepo structure
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Atoms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Badges</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Molecules</h2>
            <div className="space-y-4 max-w-md">
              <SearchInput 
                placeholder="Search components..." 
                onSearch={(value) => console.log('Searching:', value)}
              />
              
              <FormField 
                label="Email"
                placeholder="Enter your email"
                description="We'll never share your email with anyone else."
              />
              
              <FormField 
                label="Password"
                type="password"
                placeholder="Enter your password"
                error="Password is required"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App