export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768860065533',
  title: 'Create A Simple Login Form',
  description: 'create a simple login form',
  createdAt: '2026-01-19',
  temporary: true,
};

export default config;