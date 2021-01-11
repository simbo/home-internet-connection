import { logger } from './modules/logger/logger';
import { startServer } from './modules/server/start-server';
import { dieOnError } from './modules/utils/die-on-error';
import { handleProcess } from './modules/utils/handle-process';

handleProcess();

startServer()
  .then(server => logger.log(`Server listening @ ${server.info.host}:${server.info.port}`))
  .catch(dieOnError);
