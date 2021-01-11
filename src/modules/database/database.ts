import { connect as dbConnect, connection, ConnectOptions, disconnect as dbDisconnect } from 'mongoose';

import { logger } from '../logger/logger';
import { env } from '../utils/env';

export async function connect(): Promise<void> {
  if (connection && connection.readyState !== 0) {
    return;
  }
  const { host, port, user, password, database } = env.mongodb;
  const uri = `mongodb://${host}:${port}/`;
  const options: ConnectOptions = {
    user,
    pass: password,
    dbName: database,
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  };
  connection.once('open', async () => logger.log(`Connected to database @ ${host}:${port}/${database}`));
  connection.once('disconnected', async () => logger.log('Disconnected from database'));
  connection.on('error', err => logger.error('Database connection error:', err));
  await dbConnect(uri, options);
}

export async function disconnect(): Promise<void> {
  if (!connection || connection.readyState !== 1) {
    return;
  }
  await dbDisconnect();
}
