import { Document, Model } from 'mongoose';
import { ResultEvent } from 'speedtest-net';

import { SpeedJson } from '../../../../shared/speed-json.interface';
import { SpeedReportDocument, SpeedReportEntry } from './speed-report/speed-report.types';

export interface SpeedEntry {
  date: Date;
  down?: number;
  up?: number;
  ping?: number;
  host?: string;
  report?: SpeedReportDocument;
  error?: string;
}

export interface SpeedDetailedJson extends SpeedJson {
  report: SpeedReportEntry;
}

export interface SpeedDocument extends SpeedEntry, Document<SpeedEntry> {
  toResponse(detailed?: boolean): SpeedJson;
}

export interface SpeedModel extends Model<SpeedDocument> {
  logSpeed(): Promise<SpeedDocument>;
  createFromTestResult(result: ResultEvent): SpeedDocument;
  findLatestSpeed(): Promise<SpeedDocument | null>;
  findSpeedRanged(fromDate: Date, toDate: Date): Promise<SpeedDocument[]>;
  findSpeedSince(sinceDate: Date): Promise<SpeedDocument[]>;
}
