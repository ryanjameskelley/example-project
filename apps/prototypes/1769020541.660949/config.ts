export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769020564473',
  title: 'Create An Account Switching Feature',
  description: 'create an account switching feature allowing a member of an organization to switch to another organi',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;