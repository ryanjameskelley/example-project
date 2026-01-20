export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768872371789',
  title: 'Change The Color Of The',
  description: 'change the color of the signup button',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;