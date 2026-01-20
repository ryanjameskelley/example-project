export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768872054890',
  title: 'Create A Simple Signup Form',
  description: 'create a simple signup form',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;