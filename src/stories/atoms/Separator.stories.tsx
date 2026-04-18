import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import { Separator } from '@/components/ui/separator'

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: { layout: 'centered' },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <p className="text-sm">Above</p>
      <Separator className="my-4" />
      <p className="text-sm">Below</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Above')).toBeVisible()
    await expect(canvas.getByText('Below')).toBeVisible()
    const separator = canvasElement.querySelector('[data-slot="separator"]')
    await expect(separator).toBeInTheDocument()
    await expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  }
}

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span className="text-sm">Left</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Right</span>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Left')).toBeVisible()
    await expect(canvas.getByText('Right')).toBeVisible()
    const separator = canvasElement.querySelector('[data-slot="separator"]')
    await expect(separator).toBeInTheDocument()
    await expect(separator).toHaveAttribute('data-orientation', 'vertical')
  }
}
