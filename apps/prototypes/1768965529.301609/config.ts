export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768966123543',
  title: 'Undo The Previous Change So',
  description: 'undo the previous change so the border radius is the same as the shad standards',
  createdAt: '2026-01-21',
  temporary: true,
};

export default config;