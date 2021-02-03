import * as speedtest from 'speedtest-net';

import { env } from './env';

export async function determineSpeed(): Promise<speedtest.ResultEvent> {
  const { hosts, timeout, sourceIp } = env.speedtest;
  let result: speedtest.ResultEvent | null = null;
  let error: Error | null = null;
  let i = 0;
  while (!result && i < hosts.length) {
    const cancel = speedtest.makeCancel();
    const cancelTimeout = setTimeout(() => cancel(), timeout * 1000);
    try {
      result = await speedtest({
        host: hosts[i],
        sourceIp,
        cancel,
        acceptLicense: true,
        acceptGdpr: true
      });
    } catch (err) {
      error = err;
    }
    clearTimeout(cancelTimeout);
    i++;
  }
  if (error) {
    throw error;
  }
  return result as speedtest.ResultEvent;
}
