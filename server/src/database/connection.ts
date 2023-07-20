import { DB_SERVER, DB_NAME, DB_USER, DB_PWD, DB_REQUEST_TIMEOUT } from '@/config';
import { logger } from '@/utils/logger';
const sql = require('mssql');

const sqlConfig = {
  user: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  server: DB_SERVER,
  requestTimeout: 60000,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const pool = new sql.ConnectionPool(sqlConfig);

export const sqlInt = sql.Int;
export const sqlNVarChar = sql.NVarChar;
export const sqlDatetime = sql.DateTime;

const init = async () => {
  try {
    const appPool = await sqlConnect();
    logger.info('Connected to database');
    return appPool;
  } catch (error) {
    console.log(error);
    logger.error('DB Error connecting to database: ', error);
    logger.debug('DB Error connecting to database: ', error);
  }
};

// Get the DB connection; it will automatically resolve to any existing connection
const sqlConnect = async () => {
  return await pool.connect();
};

const sqlClose = async () => {
  await pool.close();
};

export const sqlRequest = async () => {
  const instance = await sqlConnect();
  return instance.request();
};

export { init as dbInit, sqlConnect as getDb, sqlClose as closeDb, pool as dbPool };
