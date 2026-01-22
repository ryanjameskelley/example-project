export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769067811719',
  title: 'The Form Fields Are Meant',
  description: 'the form fields are meant to stach vertically. i meant the x and the title are meant to stack horizo',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;