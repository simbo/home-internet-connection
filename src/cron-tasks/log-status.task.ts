import { connect, disconnect } from '../modules/database/database';
import { Status } from '../modules/database/status/status.schema';
import { importOldData } from '../modules/temp/import-old-data';
import { dieOnError } from '../modules/utils/die-on-error';

async function addStatusLogEntry(): Promise<void> {
  await connect();
  await importOldData();
  await Status.logStatus();
  await disconnect();
}

addStatusLogEntry().catch(dieOnError);
