import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export interface ActivityItem {
  id: string
  user: { name: string; avatar?: string; initials: string }
  action: string
  timestamp: string
}

export interface RecentActivityProps {
  items: ActivityItem[]
}

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map(item => (
        <div key={item.id} className="flex items-center gap-3">
          <Avatar size="sm">
            {item.user.avatar && (
              <AvatarImage src={item.user.avatar} alt={item.user.name} />
            )}
            <AvatarFallback>{item.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">{item.user.name}</span>{' '}
              <span className="text-muted-foreground">{item.action}</span>
            </p>
            <p className="text-xs text-muted-foreground">{item.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
