export interface PrototypeConfig {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  temporary?: boolean;
}

const config: PrototypeConfig = {
  id: '1768866624644',
  title: 'Change The Color Of Both',
  description: 'change the color of both the sign in button and the forgot password link to both of them are the sam',
  createdAt: '2026-01-19',
  temporary: true,
};

export default config;