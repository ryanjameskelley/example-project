export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768937315380',
  title: 'Create An Account Switching Feature.',
  description: 'create an account switching feature. the feature should allow a user in an organization to select a ',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;