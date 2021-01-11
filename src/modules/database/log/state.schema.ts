import { startOfMinute } from 'date-fns';
import { model, Schema } from 'mongoose';

import { zonedDate, zonedDateString } from '../../utils/zoned-date';
import { StateDocument, StateModel, StateValue } from './state.types';

export const StateSchema = new Schema<StateDocument, StateModel>(
  {
    fromHour: {
      type: Number,
      default: () => startOfMinute(zonedDate()).getHours(),
      required: true,
      immutable: true
    },
    fromMinute: {
      type: Number,
      default: () => startOfMinute(zonedDate()).getMinutes(),
      required: true,
      immutable: true
    },
    from: {
      type: String,
      default: () => zonedDateString(startOfMinute(zonedDate())),
      required: true,
      immutable: true
    },
    toHour: {
      type: Number,
      default: () => startOfMinute(zonedDate()).getHours(),
      required: true
    },
    toMinute: {
      type: Number,
      default: () => startOfMinute(zonedDate()).getMinutes(),
      required: true
    },
    to: {
      type: String,
      default: () => zonedDateString(startOfMinute(zonedDate())),
      required: true
    },
    state: {
      type: Number,
      enum: Object.values(StateValue).filter(value => typeof value === 'number'),
      required: true,
      immutable: true
    }
  },
  {
    validateBeforeSave: true
  }
);

export const State = model<StateDocument>('State', StateSchema) as StateModel;
