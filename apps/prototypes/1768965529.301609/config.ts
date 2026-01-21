export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768965550849',
  title: 'Create A Simple Badge Component',
  description: 'create a simple badge component supporting variants based on the shad badge design (primary, outline',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;