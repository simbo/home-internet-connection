import { dieOnError } from '../lib/die-on-error';
import { connect, disconnect } from '../modules/database/database';
import { Speed } from '../modules/database/speed/speed.schema';

async function addSpeedLogEntry(): Promise<void> {
  await connect();
  await Speed.logSpeed();
  await disconnect();
}

addSpeedLogEntry().catch(dieOnError);
