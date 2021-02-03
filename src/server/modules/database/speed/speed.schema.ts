import { model, Schema } from 'mongoose';

import { SpeedReportSchema } from './speed-report/speed-report.schema';
import { toResponse } from './speed.methods';
import { createFromTestResult, findLatestSpeed, findSpeedRanged, findSpeedSince, logSpeed } from './speed.statics';
import { SpeedDocument, SpeedModel } from './speed.types';

export const SpeedSchema = new Schema<SpeedDocument, SpeedModel>(
  {
    date: {
      type: Date,
      required: true,
      immutable: true
    },
    down: {
      type: Number,
      immutable: true
    },
    up: {
      type: Number,
      immutable: true
    },
    ping: {
      type: Number,
      immutable: true
    },
    host: {
      type: String,
      immutable: true
    },
    report: {
      type: SpeedReportSchema
    },
    error: {
      type: String,
      immutable: true
    }
  },
  {
    validateBeforeSave: true
  }
);

SpeedSchema.methods.toResponse = toResponse;

SpeedSchema.statics.createFromTestResult = createFromTestResult;
SpeedSchema.statics.findLatestSpeed = findLatestSpeed;
SpeedSchema.statics.logSpeed = logSpeed;
SpeedSchema.statics.findSpeedRanged = findSpeedRanged;
SpeedSchema.statics.findSpeedSince = findSpeedSince;

export const Speed = model<SpeedDocument>('Speed', SpeedSchema as any) as SpeedModel;
