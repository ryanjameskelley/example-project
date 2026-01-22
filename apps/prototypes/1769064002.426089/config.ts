export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769067636411',
  title: 'Theyre Meant To Be Stacked',
  description: 'theyre meant to be stacked horizontally not vertically',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;