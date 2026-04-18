import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { RecentActivity, type ActivityItem } from './RecentActivity'

export interface Transaction {
  id: string
  customer: string
  email: string
  status: 'completed' | 'pending' | 'failed'
  amount: string
}

export interface DataPanelProps {
  transactions: Transaction[]
  activityItems: ActivityItem[]
}

const statusVariant = {
  completed: 'default' as const,
  pending: 'secondary' as const,
  failed: 'destructive' as const
}

export function DataPanel({ transactions, activityItems }: DataPanelProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payment activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarFallback>
                          {tx.customer
                            .split(' ')
                            .map(n => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{tx.customer}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[tx.status]}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {tx.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest team actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity items={activityItems} />
        </CardContent>
      </Card>
    </div>
  )
}
