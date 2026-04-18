import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const meta: Meta<typeof Table> = {
  title: 'Molecules/Table',
  component: Table,
  parameters: { layout: 'padded' },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

const invoices = [
  { id: 'INV001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  {
    id: 'INV003',
    status: 'Unpaid',
    method: 'Bank Transfer',
    amount: '$350.00'
  },
  { id: 'INV004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { id: 'INV005', status: 'Paid', method: 'PayPal', amount: '$550.00' }
]

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === 'Paid'
      ? 'default'
      : status === 'Pending'
        ? 'secondary'
        : 'destructive'
  return <Badge variant={variant}>{status}</Badge>
}

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(inv => (
          <TableRow key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>
              <StatusBadge status={inv.status} />
            </TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell className="text-right">{inv.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify table headers
    await expect(canvas.getByText('Invoice')).toBeVisible()
    await expect(canvas.getByText('Status')).toBeVisible()
    await expect(canvas.getByText('Method')).toBeVisible()
    await expect(canvas.getByText('Amount')).toBeVisible()
    // Verify rows rendered
    await expect(canvas.getByText('INV001')).toBeVisible()
    await expect(canvas.getByText('INV005')).toBeVisible()
    // Verify caption
    await expect(canvas.getByText('A list of recent invoices.')).toBeVisible()
    // Verify correct row count
    const rows = canvasElement.querySelectorAll(
      '[data-slot="table-body"] [data-slot="table-row"]'
    )
    await expect(rows.length).toBe(5)
    // Verify status badges
    const paidBadges = canvas.getAllByText('Paid')
    await expect(paidBadges.length).toBe(3)
  }
}
