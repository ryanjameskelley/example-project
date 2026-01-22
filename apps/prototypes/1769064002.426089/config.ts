export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769064919814',
  title: 'The Title Should Be Inline',
  description: 'the title should be inline with the remove dialog x',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;