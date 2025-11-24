import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';
import { VetAlert } from '../../components/ui/vet-alert';

const meta = {
  title: 'Atoms/Alert',
  component: VetAlert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title text of the alert',
    },
    description: {
      control: 'text',
      description: 'The description text of the alert',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    title: 'My Vet',
    description: 'Connect and share vitals with your vet',
  },
} satisfies Meta<typeof VetAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <Plus size={16} />,
  },
};