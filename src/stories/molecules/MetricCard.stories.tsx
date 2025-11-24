import type { Meta, StoryObj } from '@storybook/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MetricCard } from '../../components/ui/metric-card';

const meta = {
  title: 'Molecules/MetricCard',
  component: MetricCard,
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
    trend: {
      control: 'text',
      description: 'The trend percentage or value',
    },
    subtitle: {
      control: 'text',
      description: 'Subtitle text below the value',
    },
    description: {
      control: 'text',
      description: 'Additional description text',
    },
    variant: {
      control: 'select',
      options: ['default', 'trending'],
      description: 'Visual variant of the card',
    },
  },
  args: {
    title: 'Current BPM',
    value: '90',
    trend: '+10.2%',
    subtitle: 'Trending up this month',
    description: 'Fido might be exercising currently',
    variant: 'default',
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BPM: Story = {
  args: {
    icon: <TrendingUp className="w-4 h-6 text-chart-3" />,
  },
};

export const Steps: Story = {
  args: {
    title: 'Steps today',
    value: '23,5125',
    trend: '+12.5%',
    subtitle: 'Trending up this month',
    description: 'Yesterdays walk was longer than average',
    icon: <TrendingUp className="w-4 h-6 text-chart-3" />,
  },
};

export const Food: Story = {
  args: {
    title: 'Food intake today',
    value: '4 Ounces',
    trend: '-2.8%',
    trendIcon: <TrendingDown className="w-3 h-3 text-chart-3" />,
    subtitle: 'Trending up this month',
    description: 'Todays walk was longer than average',
    icon: <TrendingUp className="w-4 h-6 text-chart-3" />,
  },
};