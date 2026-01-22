export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769064539675',
  title: 'Adjust It To 6 Then',
  description: 'adjust it to 6 then make sure there is 8px between the subtitle and the first field',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;