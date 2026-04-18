import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DashboardPage } from '@/components/dashboard/DashboardPage'

const meta: Meta<typeof DashboardPage> = {
  title: 'Pages/DashboardPage',
  component: DashboardPage,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

const stats = [
  {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up' as const
  },
  {
    title: 'Subscriptions',
    value: '+2,350',
    change: '+180.1%',
    trend: 'up' as const
  },
  { title: 'Sales', value: '+12,234', change: '+19%', trend: 'up' as const },
  { title: 'Active Now', value: '+573', change: '-2%', trend: 'down' as const }
]

const chartData = [
  { name: 'Jan', total: 1800 },
  { name: 'Feb', total: 2200 },
  { name: 'Mar', total: 3200 },
  { name: 'Apr', total: 2800 },
  { name: 'May', total: 3600 },
  { name: 'Jun', total: 4200 },
  { name: 'Jul', total: 3800 },
  { name: 'Aug', total: 4800 },
  { name: 'Sep', total: 5200 },
  { name: 'Oct', total: 4600 },
  { name: 'Nov', total: 5800 },
  { name: 'Dec', total: 6400 }
]

const transactions = [
  {
    id: '1',
    customer: 'Olivia Martin',
    email: 'olivia@example.com',
    status: 'completed' as const,
    amount: '+$1,999.00'
  },
  {
    id: '2',
    customer: 'Jackson Lee',
    email: 'jackson@example.com',
    status: 'completed' as const,
    amount: '+$39.00'
  },
  {
    id: '3',
    customer: 'Isabella Nguyen',
    email: 'isabella@example.com',
    status: 'pending' as const,
    amount: '+$299.00'
  },
  {
    id: '4',
    customer: 'William Kim',
    email: 'william@example.com',
    status: 'failed' as const,
    amount: '+$99.00'
  },
  {
    id: '5',
    customer: 'Sofia Davis',
    email: 'sofia@example.com',
    status: 'completed' as const,
    amount: '+$2,500.00'
  }
]

const activityItems = [
  {
    id: '1',
    user: { name: 'Olivia Martin', initials: 'OM' },
    action: 'pushed to main',
    timestamp: '2 min ago'
  },
  {
    id: '2',
    user: { name: 'Jackson Lee', initials: 'JL' },
    action: 'opened PR #42',
    timestamp: '15 min ago'
  },
  {
    id: '3',
    user: { name: 'Isabella Nguyen', initials: 'IN' },
    action: 'commented on issue',
    timestamp: '1 hr ago'
  },
  {
    id: '4',
    user: { name: 'William Kim', initials: 'WK' },
    action: 'merged feature/auth',
    timestamp: '3 hrs ago'
  },
  {
    id: '5',
    user: { name: 'Sofia Davis', initials: 'SD' },
    action: 'deployed to prod',
    timestamp: '5 hrs ago'
  }
]

export const Default: Story = {
  args: {
    user: { name: 'Rich Tillman', initials: 'RT' },
    statsPanel: { stats, chartData },
    dataPanel: { transactions, activityItems }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Verify header
    await expect(canvas.getByText('Acme Inc')).toBeVisible()
    await expect(canvas.getByText('Dashboard')).toBeVisible()
    await expect(canvas.getByText('RT')).toBeVisible()

    // Verify search input
    const searchInput = canvas.getByPlaceholderText('Search...')
    await expect(searchInput).toBeVisible()
    await userEvent.click(searchInput)
    await userEvent.type(searchInput, 'revenue')
    await expect(searchInput).toHaveValue('revenue')
    await userEvent.clear(searchInput)

    // Verify nav buttons
    await expect(
      canvas.getByRole('button', { name: 'Customers' })
    ).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Products' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Settings' })).toBeVisible()

    // Verify stat cards
    await expect(canvas.getByText('Total Revenue')).toBeVisible()
    await expect(canvas.getByText('$45,231.89')).toBeVisible()

    // Verify transactions table
    await expect(canvas.getByText('Recent Transactions')).toBeVisible()

    // Verify tab switching
    const analyticsTab = canvas.getAllByRole('tab', { name: 'Analytics' })[0]
    await userEvent.click(analyticsTab)
    await expect(
      canvas.getByText('Analytics content placeholder')
    ).toBeVisible()

    // Switch back to overview
    const overviewTab = canvas.getAllByRole('tab', { name: 'Overview' })[0]
    await userEvent.click(overviewTab)
    await expect(canvas.getByText('Total Revenue')).toBeVisible()
  }
}
