import { connect, disconnect } from '../modules/database/database';
import { Log } from '../modules/database/log/log.schema';
import { dieOnError } from '../modules/utils/die-on-error';

async function addLogEntry(): Promise<void> {
  await connect();
  Log.logState();
  await disconnect();
}

addLogEntry().catch(dieOnError);
