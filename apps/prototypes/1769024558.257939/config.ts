export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769027709141',
  title: 'The Plus Button And X',
  description: 'the plus button and x button should be the same height as the form field',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;