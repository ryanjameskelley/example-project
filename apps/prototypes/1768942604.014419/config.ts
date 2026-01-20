export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768952500304',
  title: 'Attempt The Override, If It',
  description: 'attempt the override, if it doesnt work then well attempt the other solutions',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;