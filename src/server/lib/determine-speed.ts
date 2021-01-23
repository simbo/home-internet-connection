import * as speedtest from 'speedtest-net';

import { env } from './env';

export async function determineSpeed(): Promise<speedtest.ResultEvent> {
  const { host, timeout, sourceIp } = env.speedtest;
  const cancel = speedtest.makeCancel();
  const cancelTimeout = setTimeout(() => cancel(), timeout * 1000);
  const result = await speedtest({
    host,
    sourceIp,
    cancel,
    acceptLicense: true,
    acceptGdpr: true
  });
  clearTimeout(cancelTimeout);
  return result;
}
