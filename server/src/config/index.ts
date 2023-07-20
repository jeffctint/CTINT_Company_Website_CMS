import { config } from 'dotenv';
// const result = config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
config();

export const { NODE_ENV, PORT, DB_SERVER, DB_NAME, DB_USER, DB_PWD, DB_REQUEST_TIMEOUT } = process.env;
