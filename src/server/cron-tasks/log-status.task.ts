import { dieOnError } from '../lib/die-on-error';
import { connect, disconnect } from '../modules/database/database';
import { Status } from '../modules/database/status/status.schema';

async function addStatusLogEntry(): Promise<void> {
  await connect();
  await Status.logStatus();
  await disconnect();
}

addStatusLogEntry().catch(dieOnError);
