import { StatCard } from './StatCard'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

export interface StatsPanelProps {
  stats: {
    title: string
    value: string
    change?: string
    trend?: 'up' | 'down' | 'neutral'
  }[]
  chartData: { name: string; total: number }[]
}

const chartConfig = {
  total: { label: 'Revenue', color: 'var(--chart-1)' }
}

export function StatsPanel({ stats, chartData }: StatsPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(stat => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Monthly revenue for the current year.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bar">
            <TabsList>
              <TabsTrigger value="bar">Bar</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <TabsContent value="bar">
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={v => `$${v}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="total"
                    fill="var(--color-total)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="table">
              <div className="grid grid-cols-3 gap-2 text-sm">
                {chartData.map(d => (
                  <div
                    key={d.name}
                    className="flex justify-between rounded-md bg-muted/50 px-3 py-2">
                    <span>{d.name}</span>
                    <span className="font-medium">${d.total}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
