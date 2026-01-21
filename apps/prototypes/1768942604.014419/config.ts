export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769017092872',
  title: 'The Check Beside The Selected',
  description: 'the check beside the selected org should be 171717 rather than blue',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;