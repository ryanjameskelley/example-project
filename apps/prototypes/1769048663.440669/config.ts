export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769048767994',
  title: 'Create A Simple Data Table',
  description: 'create a simple data table component',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;