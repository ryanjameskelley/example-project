import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MapPin, Camera } from 'lucide-react';
import { IconTabs, IconTabTrigger } from '../../components/ui/icon-tabs';

const meta = {
  title: 'Atoms/IconTabs',
  component: IconTabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default'],
      description: 'Visual variant of the icon tabs',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the icon tabs container',
    },
  },
  args: {
    variant: 'default',
    size: 'default',
  },
} satisfies Meta<typeof IconTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultComponent = (args: React.ComponentProps<typeof IconTabs>) => {
  const [value, setValue] = useState('location');
  
  return (
    <IconTabs {...args} value={value} onValueChange={setValue}>
      <IconTabTrigger value="location">
        <MapPin className="w-4 h-4" />
      </IconTabTrigger>
      <IconTabTrigger value="camera">
        <Camera className="w-4 h-4" />
      </IconTabTrigger>
    </IconTabs>
  );
};

export const Default: Story = {
  render: DefaultComponent,
};

