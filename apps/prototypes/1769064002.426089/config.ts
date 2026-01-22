export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769068400462',
  title: 'Option 1: Remove The Duplicate',
  description: 'Option 1: Remove the duplicate X button in the content area (keep only the one in the header)',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;