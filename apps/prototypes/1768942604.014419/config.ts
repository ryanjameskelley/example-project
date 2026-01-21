export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768953624619',
  title: 'Add Custom Classes To DialogTitle',
  description: 'Add custom classes to DialogTitle to override any built-in spacing and Check if we need to add class',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;