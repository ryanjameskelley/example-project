export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768897281754',
  title: 'Adjust The Button Color To',
  description: 'adjust the button color to something else',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;