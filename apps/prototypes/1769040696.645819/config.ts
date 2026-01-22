export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769042670408',
  title: 'Change The Background Cell Color',
  description: 'change the background cell color to eeeeee',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;