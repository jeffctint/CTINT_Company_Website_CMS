import express from 'express';
import { NODE_ENV } from '@config';
import { DocsRoute } from './DocsRoute';
import { InteractionRoute } from '@modules/interaction';
import { HealthCheckRoute } from '@modules/healthcheck';

const router = express.Router();

// Add routes here
const defaultRoutes = [
  {
    path: '/interactions',
    route: InteractionRoute,
  },
  {
    path: '/healthcheck',
    route: HealthCheckRoute,
  },
];

// Add routes available only in development mode
const devRoutes = [
  {
    path: '/docs',
    route: DocsRoute,
  },
];
defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});

devRoutes.forEach(route => {
  router.use(route.path, route.route);
});
// if (process.env.NODE_ENV === 'development') {
//   devRoutes.forEach(route => {
//     router.use(route.path, route.route);
//   });
// }

export { router as routes };
