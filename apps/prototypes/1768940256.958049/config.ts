export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768940390161',
  title: 'Change Button Color To Blue',
  description: 'change button color to blue',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;