import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const meta: Meta<typeof RecentActivity> = {
  title: 'Molecules/RecentActivity',
  component: RecentActivity,
  parameters: { layout: 'centered' },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

const mockItems = [
  {
    id: '1',
    user: { name: 'Olivia Martin', initials: 'OM' },
    action: 'pushed to main',
    timestamp: '2 minutes ago'
  },
  {
    id: '2',
    user: { name: 'Jackson Lee', initials: 'JL' },
    action: 'opened a pull request',
    timestamp: '15 minutes ago'
  },
  {
    id: '3',
    user: { name: 'Isabella Nguyen', initials: 'IN' },
    action: 'commented on issue #42',
    timestamp: '1 hour ago'
  },
  {
    id: '4',
    user: { name: 'William Kim', initials: 'WK' },
    action: 'merged branch feature/auth',
    timestamp: '3 hours ago'
  },
  {
    id: '5',
    user: { name: 'Sofia Davis', initials: 'SD' },
    action: 'deployed to production',
    timestamp: '5 hours ago'
  }
]

export const Default: Story = {
  args: { items: mockItems },
  decorators: [
    Story => (
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Story />
        </CardContent>
      </Card>
    )
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify all users rendered
    await expect(canvas.getByText('Olivia Martin')).toBeVisible()
    await expect(canvas.getByText('Jackson Lee')).toBeVisible()
    await expect(canvas.getByText('Isabella Nguyen')).toBeVisible()
    await expect(canvas.getByText('William Kim')).toBeVisible()
    await expect(canvas.getByText('Sofia Davis')).toBeVisible()
    // Verify actions
    await expect(canvas.getByText('pushed to main')).toBeVisible()
    await expect(canvas.getByText('deployed to production')).toBeVisible()
    // Verify timestamps
    await expect(canvas.getByText('2 minutes ago')).toBeVisible()
    // Verify fallback initials rendered
    await expect(canvas.getByText('OM')).toBeVisible()
    await expect(canvas.getByText('SD')).toBeVisible()
  }
}
