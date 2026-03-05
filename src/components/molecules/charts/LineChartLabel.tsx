import * as React from "react"
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/atoms/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card"
import { cn } from "@/lib/utils"

// ─── Context ──────────────────────────────────────────────────────────────────

interface LineChartContextValue {
  data: Record<string, unknown>[]
  config: ChartConfig
  dataKeys: string[]
  xKey: string
  highlightIndex?: number
}

const LineChartContext = React.createContext<LineChartContextValue>({
  data: [],
  config: {},
  dataKeys: [],
  xKey: "x",
})

function useLineChart() {
  return React.useContext(LineChartContext)
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface LineChartRootProps {
  data: Record<string, unknown>[]
  config: ChartConfig
  dataKeys: string[]
  xKey?: string
  highlightIndex?: number
  children?: React.ReactNode
  className?: string
}

function LineChartRoot({
  data,
  config,
  dataKeys,
  xKey = "x",
  highlightIndex,
  children,
  className,
}: LineChartRootProps) {
  return (
    <LineChartContext.Provider value={{ data, config, dataKeys, xKey, highlightIndex }}>
      <Card className={cn("border-0 shadow-none", className)}>
        {children}
      </Card>
    </LineChartContext.Provider>
  )
}
LineChartRoot.displayName = "LineChartRoot"

// ─── Header ───────────────────────────────────────────────────────────────────

function LineChartHeader({
  title,
  description,
  className,
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  className?: string
}) {
  return (
    <CardHeader className={cn("pb-2 px-0", className)}>
      {title && <CardTitle className="text-sm font-medium">{title}</CardTitle>}
      {description && (
        <CardDescription className="text-xs">{description}</CardDescription>
      )}
    </CardHeader>
  )
}
LineChartHeader.displayName = "LineChartHeader"

// ─── Chart body ───────────────────────────────────────────────────────────────

export interface LineChartContentProps {
  showLabels?: boolean
  showGrid?: boolean
  className?: string
}

function LineChartContent({
  showLabels = true,
  showGrid = true,
  className,
}: LineChartContentProps) {
  const { data, config, dataKeys, xKey, highlightIndex } = useLineChart()

  return (
    <CardContent className={cn("px-0 pb-0", className)}>
      <ChartContainer config={config} className="h-[180px] w-full">
        <LineChart
          accessibilityLayer
          data={data}
          margin={{ top: showLabels ? 20 : 8, left: 4, right: 4, bottom: 0 }}
        >
          {showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" />}
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 11 }}
          />
          <YAxis hide />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          {highlightIndex !== undefined && (
            <ReferenceLine
              x={data[highlightIndex]?.[xKey] as string}
              stroke="hsl(var(--foreground))"
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
          )}
          {dataKeys.map((key) => (
            <Line
              key={key}
              dataKey={key}
              type="natural"
              stroke={`var(--color-${key})`}
              strokeWidth={2}
              dot={(dotProps) => {
                const { cx, cy, index } = dotProps
                const isHighlighted = index === highlightIndex
                return (
                  <circle
                    key={`dot-${index}`}
                    cx={cx}
                    cy={cy}
                    r={isHighlighted ? 6 : 3}
                    fill={`var(--color-${key})`}
                    stroke={isHighlighted ? "hsl(var(--background))" : "none"}
                    strokeWidth={isHighlighted ? 2 : 0}
                  />
                )
              }}
              activeDot={{ r: 6 }}
            >
              {showLabels && (
                <LabelList
                  position="top"
                  offset={10}
                  className="fill-foreground"
                  fontSize={10}
                />
              )}
            </Line>
          ))}
        </LineChart>
      </ChartContainer>
    </CardContent>
  )
}
LineChartContent.displayName = "LineChartContent"

// ─── Footer ───────────────────────────────────────────────────────────────────

function LineChartFooter({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <CardFooter className={cn("flex-col items-start gap-2 text-sm px-0 pb-0", className)}>
      {children}
    </CardFooter>
  )
}
LineChartFooter.displayName = "LineChartFooter"

// ─── Composed default ─────────────────────────────────────────────────────────

const defaultData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const defaultConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "hsl(var(--chart-1))" },
  mobile: { label: "Mobile", color: "hsl(var(--chart-2))" },
}

export function LineChartLabel() {
  return (
    <LineChartRoot data={defaultData} config={defaultConfig} dataKeys={["desktop", "mobile"]} xKey="month">
      <LineChartHeader title="Line Chart — Label" description="January – June 2024" />
      <LineChartContent />
    </LineChartRoot>
  )
}

export { LineChartRoot, LineChartHeader, LineChartContent, LineChartFooter, useLineChart }
export type { ChartConfig }
