export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768940052737',
  title: 'Change The Button Color To',
  description: 'change the button color to blue, the form should use the styling specified in the auui.md file as sh',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;