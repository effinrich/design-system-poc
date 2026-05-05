import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount
} from '@/components/ui/avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'default', 'lg'] }
  }
}

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  args: {
    size: "sm"
  },

  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const avatar = canvas.getByAltText('@shadcn')
    await expect(avatar).toBeInTheDocument()
  }
}

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>RT</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('RT')).toBeVisible()
  }
}

export const Small: Story = {
  render: () => (
    <Avatar size="sm">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const root = canvasElement.querySelector('[data-size="sm"]')
    await expect(root).toBeInTheDocument()
    await expect(canvas.getByAltText('@shadcn')).toBeInTheDocument()
  }
}

export const Large: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-size="lg"]')
    await expect(root).toBeInTheDocument()
  }
}

export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('U2')).toBeVisible()
    await expect(canvas.getByText('U3')).toBeVisible()
    await expect(canvas.getByText('+3')).toBeVisible()
  }
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('SM')).toBeVisible()
    await expect(canvas.getByText('MD')).toBeVisible()
    await expect(canvas.getByText('LG')).toBeVisible()
  }
}

export const LgAvatar: Story = {
  args: {
    size: "lg"
  },

  render: () => (<Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>),

  play: async (
    {
      canvasElement
    }
  ) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByAltText("@shadcn");
    await expect(avatar).toBeInTheDocument();
  }
};

export const SmAvatar: Story = {
  args: {
    size: "sm"
  },

  render: () => (<Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>),

  play: async (
    {
      canvasElement
    }
  ) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByAltText("@shadcn");
    await expect(avatar).toBeInTheDocument();
  }
};

export const DefaultAvatar: Story = {
  args: {
    size: "default"
  },

  render: () => (<Avatar>
    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>),

  play: async (
    {
      canvasElement
    }
  ) => {
    const canvas = within(canvasElement);
    const avatar = canvas.getByAltText("@shadcn");
    await expect(avatar).toBeInTheDocument();
  }
};
