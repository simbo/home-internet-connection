import { connect, disconnect } from '../modules/database/database';
import { Speed } from '../modules/database/speed/speed.schema';
import { dieOnError } from '../modules/utils/die-on-error';

async function addSpeedLogEntry(): Promise<void> {
  await connect();
  await Speed.logSpeed();
  await disconnect();
}

addSpeedLogEntry().catch(dieOnError);
