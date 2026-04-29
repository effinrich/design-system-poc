import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Mail, Loader2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  args: { onClick: fn() },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'destructive',
        'link'
      ]
    },
    size: {
      control: 'select',
      options: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg'
      ]
    },
    disabled: { control: 'boolean' }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Button' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Button' })
    await expect(button).toBeInTheDocument()
    await expect(button).toBeVisible()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  }
}

export const Outline: Story = {
  args: { variant: 'outline', children: 'Outline' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Outline' })
    await expect(button).toBeVisible()
  }
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Secondary' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('button', { name: 'Secondary' })
    ).toBeVisible()
  }
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Ghost' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Ghost' })).toBeVisible()
  }
}

export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Delete' })).toBeVisible()
  }
}

export const Link: Story = {
  args: { variant: 'link', children: 'Link' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: 'Link' })).toBeVisible()
  }
}

export const WithIcon: Story = {
  render: args => (
    <Button {...args}>
      <Mail data-icon="inline-start" /> Login with Email
    </Button>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /login with email/i })
    await expect(button).toBeVisible()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalled()
  }
}

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <Loader2 className="animate-spin" data-icon="inline-start" />
      Please wait
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /please wait/i })
    await expect(button).toBeDisabled()
  }
}

export const IconOnly: Story = {
  args: { variant: 'outline', size: 'icon', children: <ChevronRight /> },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await expect(button).toBeVisible()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalled()
  }
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons).toHaveLength(6)
    for (const button of buttons) {
      await expect(button).toBeVisible()
    }
  }
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const buttons = canvas.getAllByRole('button')
    await expect(buttons).toHaveLength(4)
  }
}

export const Xs: Story = {
  args: { size: 'xs', children: 'Xs' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button', { name: 'Xs' })
    await expect(element).toBeVisible()
  }
}

export const Sm: Story = {
  args: { size: 'sm', children: 'Sm' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button', { name: 'Sm' })
    await expect(element).toBeVisible()
  }
}

export const Lg: Story = {
  args: { size: 'lg', children: 'Lg' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button', { name: 'Lg' })
    await expect(element).toBeVisible()
  }
}

export const Icon: Story = {
  args: { size: 'icon', children: 'Icon' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button', { name: 'Icon' })
    await expect(element).toBeVisible()
  }
}

export const IconXs: Story = {
  args: { size: 'icon-xs', children: 'Icon-xs' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button', { name: 'Icon-xs' })
    await expect(element).toBeVisible()
  }
}

export const IconSm: Story = {
  args: { size: 'icon-sm', children: 'Icon-sm' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button', { name: 'Icon-sm' })
    await expect(element).toBeVisible()
  }
}

export const IconLg: Story = {
  args: { size: 'icon-lg', children: 'Icon-lg' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByRole('button', { name: 'Icon-lg' })
    await expect(element).toBeVisible()
  }
}
