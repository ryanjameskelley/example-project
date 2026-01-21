export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769027428051',
  title: 'Remove The Dialog',
  description: 'remove the dialog',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;