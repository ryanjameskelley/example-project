export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768955039193',
  title: 'Replace The Admin Member Manager',
  description: 'replace the admin member manager badges with the correct shad badges',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;