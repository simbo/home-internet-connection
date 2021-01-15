import { Document, Model } from 'mongoose';

export interface StatusEntry {
  from: Date;
  to: Date;
  status: StatusValue;
}

export interface StatusJson {
  from: string;
  to: string;
  status: StatusValue;
}

export enum StatusValue {
  Offline = 0,
  NetworkReachable = 1,
  InternetReachable = 2
}
export interface StatusDocument extends StatusEntry, Document<StatusEntry> {
  updateStatus(): StatusDocument;
  toResponse(): StatusJson;
}

export interface StatusModel extends Model<StatusDocument> {
  logStatus(): Promise<StatusDocument>;
  latestStatusIsOnline(): Promise<boolean>;
  findLatestStatus(): Promise<StatusDocument | null>;
}
