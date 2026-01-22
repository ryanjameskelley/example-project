export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1769066459014',
  title: 'Remove The Title, Put A',
  description: 'remove the title, put a full width div around the x and put the title in it also with space between ',
  createdAt: '2026-01-22',
  temporary: true,
};

export default config;