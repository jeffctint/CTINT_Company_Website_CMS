import express from 'express';
import { NODE_ENV } from '@config';
import { DocsRoute } from './DocsRoute';
import { InteractionRoute } from '@modules/interaction';
import { HealthCheckRoute } from '@modules/healthcheck';
import { NewsroomsRoute } from '@/modules/newsrooms';
import { LoginRoute } from '@/modules/login';
import { ContactRoutes } from '@/modules/contact';
import {PartnerRoutes} from '@/modules/partner';

const router = express.Router();

// Add routes here
const defaultRoutes = [
  {
    path: '/login',
    route: LoginRoute,
  },
  {
    path: '/newsrooms',
    route: NewsroomsRoute,
  },
  {
    path: '/interactions',
    route: InteractionRoute,
  },
  {
    path: '/healthcheck',
    route: HealthCheckRoute,
  },
  {
    path: '/contact',
    route: ContactRoutes,
  },
  {
    path: '/partners',
    route: PartnerRoutes
  }
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
