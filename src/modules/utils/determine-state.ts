import * as isReachable from 'is-reachable';

import { StateValue } from '../database/log/state.types';
import { env } from './env';

export async function determineState(): Promise<StateValue> {
  const { remote, local, timeout } = env.servers;
  if (await isReachable(remote, { timeout })) {
    return StateValue.InternetReachable;
  }
  if (await isReachable(local, { timeout })) {
    return StateValue.NetworkReachable;
  }
  return StateValue.Offline;
}
