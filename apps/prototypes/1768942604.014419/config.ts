export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768954511730',
  title: 'The Fill Before Expanded Should',
  description: 'the fill before expanded should be ffffff then e5e5e5 when hovered',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;