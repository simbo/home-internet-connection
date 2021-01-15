import { Plugin } from '@hapi/hapi';
import { connection } from 'mongoose';

import { logger } from '../logger/logger';
import { env } from '../utils/env';
import { connect, disconnect } from './database';

export const databasePlugin: Plugin<{}> = {
  name: 'database',

  register: async (server): Promise<void> => {
    const { host, port, database } = env.mongodb;

    connection.once('open', async () => logger.log(`Connected to database @ ${host}:${port}/${database}`));
    connection.once('disconnected', async () => logger.log('Disconnected from database'));
    connection.on('error', err => logger.error('Database connection error:', err));

    server.events.on('start', async () => connect());
    server.events.on('stop', async () => disconnect());
  }
};
