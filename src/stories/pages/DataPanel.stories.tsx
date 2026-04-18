import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { DataPanel } from '@/components/dashboard/DataPanel'

const meta: Meta<typeof DataPanel> = {
  title: 'Pages/DataPanel',
  component: DataPanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

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
  args: { transactions, activityItems },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify transactions table
    await expect(canvas.getByText('Recent Transactions')).toBeVisible()
    await expect(canvas.getByText('Customer')).toBeVisible()
    await expect(canvas.getByText('Status')).toBeVisible()
    // Verify transaction rows
    await expect(canvas.getByText('+$1,999.00')).toBeVisible()
    await expect(canvas.getByText('+$2,500.00')).toBeVisible()
    // Verify status badges
    await expect(canvas.getAllByText('completed').length).toBe(3)
    await expect(canvas.getByText('pending')).toBeVisible()
    await expect(canvas.getByText('failed')).toBeVisible()
    // Verify activity panel
    await expect(canvas.getByText('Recent Activity')).toBeVisible()
    await expect(canvas.getByText('pushed to main')).toBeVisible()
    await expect(canvas.getByText('deployed to prod')).toBeVisible()
  }
}
