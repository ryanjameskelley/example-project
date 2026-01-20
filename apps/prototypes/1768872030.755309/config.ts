export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768875269542',
  title: 'Change The Button To A',
  description: 'change the button to a different color',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;