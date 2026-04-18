import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search } from 'lucide-react'
import { StatsPanel, type StatsPanelProps } from './StatsPanel'
import { DataPanel, type DataPanelProps } from './DataPanel'

export interface DashboardPageProps {
  user: { name: string; avatar?: string; initials: string }
  statsPanel: StatsPanelProps
  dataPanel: DataPanelProps
}

export function DashboardPage({
  user,
  statsPanel,
  dataPanel
}: DashboardPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">Acme Inc</span>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" className="text-foreground">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm">
              Customers
            </Button>
            <Button variant="ghost" size="sm">
              Products
            </Button>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." className="w-56 pl-8" />
          </div>
          <Avatar size="sm">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button>Download</Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4 flex flex-col gap-4">
            <StatsPanel {...statsPanel} />
            <DataPanel {...dataPanel} />
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
              Analytics content placeholder
            </div>
          </TabsContent>
          <TabsContent value="reports" className="mt-4">
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
              Reports content placeholder
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
