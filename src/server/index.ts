import { dieOnError } from './lib/die-on-error';
import { handleProcess } from './lib/handle-process';
import { logger } from './modules/logger/logger';
import { startServer } from './modules/server/start-server';

handleProcess();

startServer()
  .then(server => logger.log(`Server listening @ ${server.info.host}:${server.info.port}`))
  .catch(dieOnError);
