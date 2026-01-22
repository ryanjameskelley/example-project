export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769041118058',
  title: 'Change The Background Cell Color',
  description: 'change the background cell color to e5e5e5',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;