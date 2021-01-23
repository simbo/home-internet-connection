import * as isReachable from 'is-reachable';

import { StatusValue } from '../../shared/status-value.enum';
import { env } from './env';

async function testServers(servers: string[], timeout: number): Promise<boolean> {
  let result = false;
  let i = 0;
  while (!result && i < servers.length) {
    result = await isReachable(servers[i], { timeout });
    i++;
  }
  return result;
}

export async function determineStatus(): Promise<StatusValue> {
  const { remote, local, timeout } = env.status.servers;
  if (await testServers(remote, timeout * 1000)) {
    return StatusValue.InternetReachable;
  }
  if (await testServers(local, timeout * 1000)) {
    return StatusValue.NetworkReachable;
  }
  return StatusValue.Offline;
}
