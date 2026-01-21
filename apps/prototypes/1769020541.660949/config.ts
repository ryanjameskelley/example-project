export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769021857697',
  title: 'Revert The Corner Radius Adjustment',
  description: 'revert the corner radius adjustment',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;