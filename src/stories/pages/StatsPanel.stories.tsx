import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { StatsPanel } from '@/components/dashboard/StatsPanel'

const meta: Meta<typeof StatsPanel> = {
  title: 'Pages/StatsPanel',
  component: StatsPanel,
  parameters: { layout: 'padded' },
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

export const Default: Story = {
  args: { stats, chartData },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify all stat cards rendered
    await expect(canvas.getByText('Total Revenue')).toBeVisible()
    await expect(canvas.getByText('$45,231.89')).toBeVisible()
    await expect(canvas.getByText('Subscriptions')).toBeVisible()
    await expect(canvas.getByText('Sales')).toBeVisible()
    await expect(canvas.getByText('Active Now')).toBeVisible()
    // Verify chart card
    await expect(canvas.getByText('Overview')).toBeVisible()
    // Verify tab switching between Bar and Table views
    const barTab = canvas.getByRole('tab', { name: 'Bar' })
    const tableTab = canvas.getByRole('tab', { name: 'Table' })
    await expect(barTab).toBeVisible()
    await expect(tableTab).toBeVisible()
    // Switch to table view
    await userEvent.click(tableTab)
    await expect(canvas.getByText('Jan')).toBeVisible()
    await expect(canvas.getByText('Dec')).toBeVisible()
    // Switch back to bar view
    await userEvent.click(barTab)
  }
}
