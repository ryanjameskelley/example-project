export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768875589896',
  title: 'Edit The Button Color To',
  description: 'edit the button color to another color',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;