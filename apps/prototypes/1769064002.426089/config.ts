export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769068192769',
  title: 'Change The Close Button From',
  description: 'change the close button from absolute right-4 top-4 to absolute right-4 top-8',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;