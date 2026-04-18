import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    variant: 'default' as const,
    color: 'text-emerald-600'
  },
  down: {
    icon: TrendingDown,
    variant: 'destructive' as const,
    color: 'text-red-600'
  },
  neutral: {
    icon: Minus,
    variant: 'secondary' as const,
    color: 'text-muted-foreground'
  }
}

export function StatCard({
  title,
  value,
  change,
  trend = 'neutral'
}: StatCardProps) {
  const { icon: TrendIcon, variant, color } = trendConfig[trend]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">{value}</span>
          {change && (
            <Badge variant={variant} className={color}>
              <TrendIcon className="size-3" />
              {change}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
