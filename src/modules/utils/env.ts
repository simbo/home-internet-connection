import { config } from 'dotenv';
import { join } from 'path';

import { ABS_ROOT_PATH } from './constants';

const envPath = join(ABS_ROOT_PATH, '.env');

config({ path: envPath });

const {
  NODE_ENV,
  TIMEZONE,
  APP_HOST,
  APP_PORT,
  APP_SSL,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_DATABASE,
  SERVERS_REMOTE,
  SERVERS_LOCAL,
  SERVERS_TIMEOUT
} = process.env as { [key: string]: string };

/* eslint-disable @typescript-eslint/naming-convention */
const envVars = {
  TIMEZONE,
  APP_HOST,
  APP_PORT,
  APP_SSL,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_DATABASE,
  SERVERS_REMOTE,
  SERVERS_LOCAL,
  SERVERS_TIMEOUT
};

const undefinedEnvVars = Object.entries(envVars)
  .filter(([key, value]) => value === undefined)
  .map(([key]) => key);

if (undefinedEnvVars.length) {
  throw new Error(
    `Undefined ENV variable${undefinedEnvVars.length > 1 ? 's' : ''}: "${undefinedEnvVars.join('", "')}"`
  );
}

export const env = {
  isProduction: NODE_ENV === 'production',
  isDevelopment: NODE_ENV !== 'production',
  timezone: TIMEZONE,
  app: {
    host: APP_HOST,
    port: parseInt(APP_PORT, 10),
    ssl: APP_SSL === 'true'
  },
  mongodb: {
    host: MONGODB_HOST,
    port: MONGODB_PORT,
    user: MONGODB_USER,
    password: MONGODB_PASSWORD,
    database: MONGODB_DATABASE
  },
  servers: {
    remote: JSON.parse(SERVERS_REMOTE) as string[],
    local: JSON.parse(SERVERS_LOCAL) as string[],
    timeout: parseInt(SERVERS_TIMEOUT, 10)
  }
};
