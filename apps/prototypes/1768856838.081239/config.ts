export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768856855650',
  title: 'Create A Simple Login Page',
  description: 'create a simple login page',
  createdAt: '2026-01-19',
  temporary: true,
};

export default config;