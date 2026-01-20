export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768932975228',
  title: 'Change The Button Color To',
  description: 'change the button color to blue',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;