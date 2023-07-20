import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { SwaggerDefinition } from '@/docs/SwaggerDefinition';
const router = express.Router();

const specs = swaggerJSDoc({
  swaggerDefinition: SwaggerDefinition,
  apis: ['src/routes/v1/*.ts', 'src/routes/v1/*.yaml', 'src/docs/*.yaml', 'src/modules/**/*.ts', 'src/modules/**/*.yaml'],
});

router.use('/', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

export { router as DocsRoute };
