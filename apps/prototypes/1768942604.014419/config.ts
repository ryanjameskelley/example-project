export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768942631864',
  title: 'Build A Prototype Of An',
  description: 'build a prototype of an account switching feature. the purpose of the feature is to allow a team mem',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;