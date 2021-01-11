import { Document, Model } from 'mongoose';

import { StateDocument, StateValue } from './state.types';

export interface LogEntry {
  date: string;
  states: StateDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface LogDocument extends LogEntry, Document<LogEntry> {
  lastUpdate(): { date: string; state: StateValue };
  lastState(): StateValue;
  updateState(state?: StateValue): Promise<void>;
}

export interface LogModel extends Model<LogDocument> {
  findOneByDate(date?: string | [number, number, number]): Promise<LogDocument | null>;
  logState(): Promise<LogDocument>;
}
