export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768891531831',
  title: 'Lets Implement 1',
  description: 'lets implement 1',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;