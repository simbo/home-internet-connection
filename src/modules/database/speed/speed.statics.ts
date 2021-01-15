import { ResultEvent } from 'speedtest-net';

import { determineSpeed } from '../../utils/determine-speed';
import { env } from '../../utils/env';
import { Status } from '../status/status.schema';
import { Speed } from './speed.schema';
import { SpeedDocument, SpeedModel } from './speed.types';

export function createFromTestResult(this: SpeedModel, report: ResultEvent): SpeedDocument {
  const date = new Date(report.timestamp);
  const down = report.download.bandwidth * 8;
  const up = report.upload.bandwidth * 8;
  const ping = report.ping.latency;
  return new Speed({ date, down, up, ping, report });
}

export async function logSpeed(this: SpeedModel): Promise<SpeedDocument> {
  let result: ResultEvent;
  let entry: SpeedDocument;
  try {
    if (!(await Status.latestStatusIsOnline())) {
      throw new Error('No internet connection');
    }
    result = await determineSpeed();
    entry = this.createFromTestResult(result);
  } catch (err) {
    if (/privacy\spolicy/i.test(`${err}`)) {
      return this.logSpeed();
    }
    const error = `${err}`;
    const host = env.speedtest.host;
    entry = new Speed({ date: new Date(), host, error });
  }
  await entry.save();
  return entry;
}

export async function findLatestSpeed(this: SpeedModel): Promise<SpeedDocument | null> {
  return this.findOne({}, {}, { sort: { date: -1 } });
}
