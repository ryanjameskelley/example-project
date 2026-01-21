export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768954836075',
  title: 'That Should Be The Color',
  description: 'that should be the color of the hover effect of the selected item while not expanded. it should also',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;