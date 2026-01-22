export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769041767687',
  title: 'Revert To The Previous Corner',
  description: 'revert to the previous corner radius',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;