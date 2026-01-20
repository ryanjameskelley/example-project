export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768945950721',
  title: 'Adjust The Corner Radius To',
  description: 'adjust the corner radius to be more dounded',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;