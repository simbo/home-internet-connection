import { connect as dbConnect, connection, ConnectOptions, disconnect as dbDisconnect } from 'mongoose';

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
  await dbConnect(uri, options);
}

export async function disconnect(): Promise<void> {
  if (!connection || connection.readyState !== 1) {
    return;
  }
  await dbDisconnect();
}
