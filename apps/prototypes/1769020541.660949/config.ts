export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769020699785',
  title: 'Make The Corner Radiuses More',
  description: 'make the corner radiuses more rounded',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;