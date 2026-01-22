export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769064759561',
  title: 'Yes',
  description: 'yes',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;