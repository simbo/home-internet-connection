import { startOfDay } from 'date-fns';
import { model, Schema } from 'mongoose';

import { zonedDate, zonedDateString } from '../../utils/zoned-date';
import { lastState, lastUpdate, updateState } from './log.methods';
import { findOneByDate, logState } from './log.statics';
import { LogDocument, LogModel } from './log.types';
import { StateSchema } from './state.schema';
import { StateDocument } from './state.types';

export const LogSchema = new Schema<LogDocument, LogModel>(
  {
    year: {
      type: Number,
      default: () => startOfDay(zonedDate()).getFullYear(),
      required: true,
      immutable: true
    },
    month: {
      type: Number,
      default: () => startOfDay(zonedDate()).getMonth() + 1,
      required: true,
      immutable: true
    },
    day: {
      type: Number,
      default: () => startOfDay(zonedDate()).getDate(),
      required: true,
      immutable: true
    },
    date: {
      type: String,
      default: () => zonedDateString(startOfDay(zonedDate())),
      required: true,
      immutable: true,
      unique: true
    },
    states: {
      type: [StateSchema],
      required: true,
      validate: (states: StateDocument[]) => !!states.length
    },
    createdAt: {
      type: String,
      default: () => zonedDateString(),
      required: true,
      immutable: true
    },
    updatedAt: {
      type: String,
      default: () => zonedDateString(),
      required: true
    }
  },
  {
    validateBeforeSave: true
  }
);

LogSchema.methods.lastUpdate = lastUpdate;
LogSchema.methods.lastState = lastState;
LogSchema.methods.updateState = updateState;

LogSchema.statics.findOneByDate = findOneByDate;
LogSchema.statics.logState = logState;

export const Log = model<LogDocument>('Log', LogSchema) as LogModel;
