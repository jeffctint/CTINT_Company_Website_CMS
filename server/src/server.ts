import { NODE_ENV, PORT } from '@config';
import { logger } from '@utils/logger';
import { app } from './app';
import validateEnv from '@utils/validateEnv';
import { closeDb, dbPool } from '@database/connection';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

// Validate the environment variables, fail fast if any of them are missing
validateEnv();
const env = NODE_ENV || 'development';
// The port must be pipe string for Docker or Azure to work
const port = PORT || 10443;

// Use relative path to certs folder; if in production, navigate to ./certs/server.key since the certs folder is in the same directory as the server.js file
const keyPath = path.join(__dirname, process.env.NODE_ENV === 'production' ? './certs/server.key' : '../certs/server.key');
const certPath = path.join(__dirname, process.env.NODE_ENV === 'production' ? './certs/server.cert' : '../certs/server.cert');

// Create the server
// const server = https.createServer(
//   {
//     // minVersion: 'TLSv1.3',
//     key: fs.readFileSync(keyPath),
//     cert: fs.readFileSync(certPath),
//   },
//   app,
// );
const server = http.createServer(app);

// Initialize database connection
dbPool
  .connect()
  .then(() => {
    logger.info('Connected to database');
    // Start the server only after the database connection is established
    server.listen(port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${env} =======`);
      logger.info(`🚀 App listening on the port ${port}`);
      logger.info(`=================================`);
      if (process.env.INSTANCE_ID) {
        logger.info(`🚀 PM2 instance ${process.env.INSTANCE_ID} listening on the port ${port}`);
      }
    });
  })
  .catch((error: Error) => {
    console.log(error);
    logger.error('Error connecting to database: ', error.message);
  });

// Throw unhandled rejections
process.on('unhandledRejection', reason => {
  throw reason;
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error(`uncaughtException: ${error.message}`);
});

// Listen for the SIGTERM signal to gracefully shutdown the server
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  logger.info('Closing http server.');
  // Wait for the server to close properly
  server.close(async () => {
    logger.info('Server closed.');
    // Close the database connection
    await closeDb();
    logger.info('DB connection closed.');
    // Close the process
    process.exit(0);
  });
});
