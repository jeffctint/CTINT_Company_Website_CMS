import { PORT } from '@/config';
// import { version } from '@/../package.json';
const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'CTINT HKDL Genesys Engage webapp API documentation',
    version: '1.0.0',
    license: {
      name: 'MIT',
      url: '',
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}/v1`,
    },
  ],
};

export { swaggerDef as SwaggerDefinition };
