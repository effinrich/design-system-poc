import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { StatCard } from '@/components/dashboard/StatCard'

const meta: Meta<typeof StatCard> = {
  title: 'Molecules/StatCard',
  component: StatCard,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    trend: { control: 'select', options: ['up', 'down', 'neutral'] }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const TrendUp: Story = {
  args: {
    title: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    trend: 'up'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Total Revenue')).toBeVisible()
    await expect(canvas.getByText('$45,231.89')).toBeVisible()
    await expect(canvas.getByText('+20.1%')).toBeVisible()
  }
}

export const TrendDown: Story = {
  args: {
    title: 'Bounce Rate',
    value: '42.3%',
    change: '-4.5%',
    trend: 'down'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Bounce Rate')).toBeVisible()
    await expect(canvas.getByText('42.3%')).toBeVisible()
    await expect(canvas.getByText('-4.5%')).toBeVisible()
  }
}

export const Neutral: Story = {
  args: {
    title: 'Active Users',
    value: '2,350',
    change: '0%',
    trend: 'neutral'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Active Users')).toBeVisible()
    await expect(canvas.getByText('2,350')).toBeVisible()
    await expect(canvas.getByText('0%')).toBeVisible()
  }
}

export const NoChange: Story = {
  args: { title: 'Total Pages', value: '128' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Total Pages')).toBeVisible()
    await expect(canvas.getByText('128')).toBeVisible()
  }
}

export const Row: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-4 w-[800px]">
      <StatCard
        title="Total Revenue"
        value="$45,231"
        change="+20.1%"
        trend="up"
      />
      <StatCard
        title="Subscriptions"
        value="+2,350"
        change="+180.1%"
        trend="up"
      />
      <StatCard title="Sales" value="+12,234" change="+19%" trend="up" />
      <StatCard title="Active Now" value="+573" change="-2%" trend="down" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Total Revenue')).toBeVisible()
    await expect(canvas.getByText('Subscriptions')).toBeVisible()
    await expect(canvas.getByText('Sales')).toBeVisible()
    await expect(canvas.getByText('Active Now')).toBeVisible()
    const cards = canvasElement.querySelectorAll('[data-slot="card"]')
    await expect(cards.length).toBe(4)
  }
}
