export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768978556119',
  title: 'Manager Should Be Default, Admin',
  description: 'manager should be default, admin should be outline, member should be secondary',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;