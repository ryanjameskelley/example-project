export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768934509298',
  title: 'Change The Button Color To',
  description: 'change the button color to purple, the form should use the styling specified in the auui.md file as ',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;