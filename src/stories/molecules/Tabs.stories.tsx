import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4">
        Overview content goes here.
      </TabsContent>
      <TabsContent value="analytics" className="p-4">
        Analytics content goes here.
      </TabsContent>
      <TabsContent value="reports" className="p-4">
        Reports content goes here.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Default tab should be active
    await expect(canvas.getByText('Overview content goes here.')).toBeVisible()
    // Click Analytics tab
    await userEvent.click(canvas.getByRole('tab', { name: 'Analytics' }))
    await expect(canvas.getByText('Analytics content goes here.')).toBeVisible()
    // Click Reports tab
    await userEvent.click(canvas.getByRole('tab', { name: 'Reports' }))
    await expect(canvas.getByText('Reports content goes here.')).toBeVisible()
    // Click back to Overview
    await userEvent.click(canvas.getByRole('tab', { name: 'Overview' }))
    await expect(canvas.getByText('Overview content goes here.')).toBeVisible()
  }
}

export const LineVariant: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="p-4">
        Overview content with line-style tabs.
      </TabsContent>
      <TabsContent value="analytics" className="p-4">
        Analytics content.
      </TabsContent>
      <TabsContent value="reports" className="p-4">
        Reports content.
      </TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // Verify line variant renders
    const tabsList = canvasElement.querySelector('[data-variant="line"]')
    await expect(tabsList).toBeInTheDocument()
    // Verify tab switching works
    await expect(
      canvas.getByText('Overview content with line-style tabs.')
    ).toBeVisible()
    await userEvent.click(canvas.getByRole('tab', { name: 'Analytics' }))
    await expect(canvas.getByText('Analytics content.')).toBeVisible()
  }
}
