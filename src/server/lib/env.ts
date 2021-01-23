import { config } from 'dotenv';
import { join } from 'path';

import { ABS_ROOT_PATH } from './constants';

const envPath = join(ABS_ROOT_PATH, '.env');

config({ path: envPath });

const {
  NODE_ENV,
  APP_HOST,
  APP_PORT,
  APP_SSL,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_DATABASE,
  STATUS_SERVERS_REMOTE,
  STATUS_SERVERS_LOCAL,
  STATUS_SERVERS_TIMEOUT,
  SPEEDTEST_HOST,
  SPEEDTEST_SOURCE_IP,
  SPEEDTEST_TIMEOUT
} = process.env as { [key: string]: string };

/* eslint-disable @typescript-eslint/naming-convention */
const envVars = {
  APP_HOST,
  APP_PORT,
  APP_SSL,
  MONGODB_HOST,
  MONGODB_PORT,
  MONGODB_USER,
  MONGODB_PASSWORD,
  MONGODB_DATABASE,
  STATUS_SERVERS_REMOTE,
  STATUS_SERVERS_LOCAL,
  STATUS_SERVERS_TIMEOUT,
  SPEEDTEST_HOST,
  SPEEDTEST_SOURCE_IP,
  SPEEDTEST_TIMEOUT
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
  status: {
    servers: {
      remote: JSON.parse(STATUS_SERVERS_REMOTE) as string[],
      local: JSON.parse(STATUS_SERVERS_LOCAL) as string[],
      timeout: parseInt(STATUS_SERVERS_TIMEOUT, 10)
    }
  },
  speedtest: {
    host: SPEEDTEST_HOST,
    sourceIp: SPEEDTEST_SOURCE_IP,
    timeout: parseInt(SPEEDTEST_TIMEOUT, 10)
  }
};
