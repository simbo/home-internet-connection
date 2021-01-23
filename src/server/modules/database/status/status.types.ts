import { Document, Model } from 'mongoose';

import { StatusJson } from '../../../../shared/status-json.interface';
import { StatusValue } from '../../../../shared/status-value.enum';

export interface StatusEntry {
  from: Date;
  to: Date;
  status: StatusValue;
}

export interface StatusDocument extends StatusEntry, Document<StatusEntry> {
  updateStatus(): StatusDocument;
  toResponse(): StatusJson;
}

export interface StatusModel extends Model<StatusDocument> {
  logStatus(): Promise<StatusDocument>;
  latestStatusIsOnline(): Promise<boolean>;
  findLatestStatus(): Promise<StatusDocument | null>;
  findStatusRanged(fromDate: Date, toDate: Date): Promise<StatusDocument[]>;
  findStatusSince(sinceDate: Date): Promise<StatusDocument[]>;
}
