export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769041651482',
  title: 'Make The Corner Radius Slightly',
  description: 'make the corner radius slightly rounder',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;