import express from 'express';
import { healthCheck } from './HealthCheckController';
const router = express.Router();

// Define the route and controllers here
router.route('/').get(healthCheck);

export { router };
