export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768952109891',
  title: 'Restructuring To Remove DialogHeader And',
  description: 'restructuring to remove DialogHeader and use custom layout',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;