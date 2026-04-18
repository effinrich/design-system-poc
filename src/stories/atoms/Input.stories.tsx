import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input } from '@/components/ui/input'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url']
    },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Enter text...')
    await expect(input).toBeVisible()
    await userEvent.click(input)
    await userEvent.type(input, 'Hello world')
    await expect(input).toHaveValue('Hello world')
  }
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'Email address' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Email address')
    await userEvent.type(input, 'test@example.com')
    await expect(input).toHaveValue('test@example.com')
  }
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Password' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Password')
    await expect(input).toHaveAttribute('type', 'password')
    await userEvent.type(input, 'secret123')
    await expect(input).toHaveValue('secret123')
  }
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled input', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Disabled input')
    await expect(input).toBeDisabled()
  }
}

export const WithValue: Story = {
  args: { defaultValue: 'Hello world' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByDisplayValue('Hello world')
    await expect(input).toBeVisible()
    await userEvent.clear(input)
    await userEvent.type(input, 'New value')
    await expect(input).toHaveValue('New value')
  }
}

export const Search: Story = {
  args: { type: 'search', placeholder: 'Search...' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByPlaceholderText('Search...')
    await expect(input).toHaveAttribute('type', 'search')
    await userEvent.type(input, 'query')
    await expect(input).toHaveValue('query')
  }
}
