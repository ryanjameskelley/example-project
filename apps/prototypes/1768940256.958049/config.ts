export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768940601877',
  title: 'Change Button Color To Purple',
  description: 'change button color to purple',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;