export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768902083960',
  title: 'Create A Simple Login Form',
  description: 'create a simple login form with name, email, and password fields',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;