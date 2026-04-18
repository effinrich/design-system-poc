import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['default', 'sm'] }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with some details about the item.</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Card Title')).toBeVisible()
    await expect(canvas.getByText('Card description goes here.')).toBeVisible()
    await expect(
      canvas.getByText('Card content with some details about the item.')
    ).toBeVisible()
  }
}

export const WithFooter: Story = {
  render: () => {
    const onCancel = fn()
    const onSave = fn()
    return (
      <Card className="w-80">
        <CardHeader>
          <CardTitle>Project Settings</CardTitle>
          <CardDescription>Manage your project configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Update your project name and description here.</p>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </CardFooter>
      </Card>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Project Settings')).toBeVisible()
    const cancelBtn = canvas.getByRole('button', { name: 'Cancel' })
    const saveBtn = canvas.getByRole('button', { name: 'Save' })
    await expect(cancelBtn).toBeVisible()
    await expect(saveBtn).toBeVisible()
    await userEvent.click(cancelBtn)
    await userEvent.click(saveBtn)
  }
}

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Badge variant="secondary">3 new</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Check your inbox for the latest updates.</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Notifications')).toBeVisible()
    await expect(canvas.getByText('3 new')).toBeVisible()
  }
}

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-64">
      <CardHeader>
        <CardTitle>Compact Card</CardTitle>
        <CardDescription>Smaller padding variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Less spacing for dense layouts.</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Compact Card')).toBeVisible()
    const card = canvasElement.querySelector('[data-size="sm"]')
    await expect(card).toBeInTheDocument()
  }
}
