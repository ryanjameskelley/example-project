export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768810055447',
  title: 'Create A Simple Login Form',
  description: 'create a simple login form with email and password fields',
  createdAt: '2026-01-19',
  temporary: true,
};

export default config;