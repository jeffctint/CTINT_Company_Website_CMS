import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import express from 'express';
// Set up Patch error handling for async/await functions; MUST be right after import express
import 'express-async-errors';
// Do other imports below
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { logger, stream } from '@utils/logger';
import 'reflect-metadata';
import { ErrorLogger, ErrorResponder } from './middlewares/';
import { routes } from './routes/v1';
import { HttpException } from './exceptions/HttpException';
import { StatusCodes } from 'http-status-codes';

const app = express();

// set security HTTP headers
app.use(helmet());
// prevent http param pollution
app.use(hpp());
// parse json request body
app.use(express.json({ limit: '50mb' }));
// parse urlencoded request body
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Sanitize request data

// parse cookie
app.use(cookieParser());
// gzip compression
app.use(compression());
// enable CORS
app.use(cors());
// set up logger
app.use(morgan('combined', { stream }));

// jwt authentication
// passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/v1', routes);

// Initialize static file serving
app.use('/public', express.static('public'));

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new HttpException(StatusCodes.NOT_FOUND, 'Page Not found'));
});

// Initialize error handling middlewares
app.use(ErrorLogger);
app.use(ErrorResponder);

export { app };
