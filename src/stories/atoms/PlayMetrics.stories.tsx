import type { Meta, StoryObj } from '@storybook/react';
import { Heart, PawPrint } from 'lucide-react';
import { PlayMetrics } from '../../components/ui/play-metrics';

const meta = {
  title: 'Atoms/PlayMetrics',
  component: PlayMetrics,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title/label of the metric',
    },
    value: {
      control: 'text',
      description: 'The main metric value',
    },
    average: {
      control: 'text',
      description: 'The average value text',
    },
    variant: {
      control: 'select',
      options: ['default'],
      description: 'Visual variant of the card',
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof PlayMetrics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BPM: Story = {
  args: {
    title: 'BPM',
    value: '90',
    average: '65 Avg',
    icon: <Heart className="w-4 h-4" style={{ height: '16px' }} />,
  },
};

export const Steps: Story = {
  args: {
    title: 'Steps',
    value: '14',
    average: '29,3858 Avg',
    icon: <PawPrint className="w-4 h-4" style={{ height: '16px' }} />,
  },
};