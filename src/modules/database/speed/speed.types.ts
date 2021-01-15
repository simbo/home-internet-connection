import { Document, Model } from 'mongoose';
import { ResultEvent } from 'speedtest-net';

import { SpeedReportDocument, SpeedReportEntry } from './speed-report/speed-report.types';

export interface SpeedEntry {
  date: Date;
  down?: number;
  up?: number;
  ping?: number;
  report?: SpeedReportDocument;
  error?: string;
}

export interface SpeedJson {
  date: string;
  down: number;
  up: number;
  ping: number;
}

export interface SpeedDetailedJson extends SpeedJson {
  report: SpeedReportEntry;
}

export interface SpeedErrorJson {
  date: string;
  error: string;
}

export interface SpeedDocument extends SpeedEntry, Document<SpeedEntry> {
  toResponse(detailed?: boolean): SpeedJson;
}

export interface SpeedModel extends Model<SpeedDocument> {
  logSpeed(): Promise<SpeedDocument>;
  createFromTestResult(result: ResultEvent): SpeedDocument;
  findLatestSpeed(): Promise<SpeedDocument | null>;
}
