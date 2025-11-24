import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"

export interface ExampleComponentProps {
  title?: string
  description?: string
  placeholder?: string
  buttonText?: string
  onButtonClick?: () => void
}

export const ExampleComponent = ({
  title = "Example Component",
  description = "This is an example component using shadcn/ui components",
  placeholder = "Enter some text...",
  buttonText = "Click me",
  onButtonClick = () => console.log("Button clicked!")
}: ExampleComponentProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Input placeholder={placeholder} />
      </CardContent>
      <CardFooter>
        <Button onClick={onButtonClick} className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}