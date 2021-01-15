import { differenceInMinutes } from 'date-fns';

import { determineStatus } from '../../utils/determine-status';
import { env } from '../../utils/env';
import { Status } from './status.schema';
import { StatusDocument, StatusModel, StatusValue } from './status.types';

export async function logStatus(this: StatusModel): Promise<StatusDocument> {
  const status = await determineStatus();
  const latestEntry = await this.findLatestStatus();
  const entryMaxAge = Math.round(env.status.interval / 60);
  const entry =
    latestEntry === null ||
    latestEntry.status !== status ||
    differenceInMinutes(new Date(), latestEntry.to) > entryMaxAge
      ? new Status({ status })
      : latestEntry.updateStatus();
  await entry.save();
  return entry;
}

export async function latestStatusIsOnline(this: StatusModel): Promise<boolean> {
  const latestEntry = await Status.findLatestStatus();
  return latestEntry && latestEntry.status === StatusValue.InternetReachable ? true : false;
}

export async function findLatestStatus(this: StatusModel): Promise<StatusDocument | null> {
  return this.findOne().sort({ from: -1 }).exec();
}
