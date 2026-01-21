export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769027280355',
  title: 'Selecting "add Organization" Should Open',
  description: 'selecting "add organization" should open a dialog to enter an organizations name',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;