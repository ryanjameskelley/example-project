import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

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
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search components..." 
                  className="pl-8"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="Enter your email" />
                <p className="text-sm text-muted-foreground">We'll never share your email with anyone else.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-destructive">Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter your password"
                  className="border-destructive focus-visible:ring-destructive"
                />
                <p className="text-sm text-destructive">Password is required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App