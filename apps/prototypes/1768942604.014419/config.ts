export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768950167830',
  title: 'Theres More Padding Above "Add',
  description: 'theres more padding above "Add New Organization" than there should be it could be coming from elsewh',
  createdAt: '2026-01-20',
  temporary: true,
};

export default config;