import { differenceInMinutes } from 'date-fns';

import { StatusValue } from '../../../../shared/status-value.enum';
import { determineStatus } from '../../../lib/determine-status';
import { Status } from './status.schema';
import { StatusDocument, StatusModel } from './status.types';

export async function logStatus(this: StatusModel): Promise<StatusDocument> {
  const status = await determineStatus();
  const latestEntry = await this.findLatestStatus();
  const entry =
    latestEntry === null || latestEntry.status !== status || differenceInMinutes(new Date(), latestEntry.to) > 1
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

export async function findStatusRanged(this: StatusModel, fromDate: Date, toDate: Date): Promise<StatusDocument[]> {
  return this.find(
    {
      $or: [
        { from: { $gte: fromDate }, to: { $lte: toDate } },
        { from: { $lte: toDate }, to: { $gte: fromDate } }
      ]
    },
    {},
    { sort: { from: 1 } }
  );
}

export async function findStatusSince(this: StatusModel, sinceDate: Date): Promise<StatusDocument[]> {
  return this.find(
    {
      $or: [{ from: { $gte: sinceDate } }, { to: { $gte: sinceDate } }]
    },
    {},
    { sort: { from: 1 } }
  );
}
