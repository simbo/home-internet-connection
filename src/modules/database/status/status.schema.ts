import { model, Schema } from 'mongoose';

import { toResponse, updateStatus } from './status.methods';
import { findLatestStatus, latestStatusIsOnline, logStatus } from './status.statics';
import { StatusDocument, StatusModel, StatusValue } from './status.types';

export const StatusSchema = new Schema<StatusDocument, StatusModel>(
  {
    from: {
      type: Date,
      default: () => new Date(),
      required: true,
      immutable: true
    },
    to: {
      type: Date,
      default: () => new Date(),
      required: true
    },
    status: {
      type: Number,
      enum: Object.values(StatusValue).filter(value => typeof value === 'number'),
      required: true,
      immutable: true
    }
  },
  {
    validateBeforeSave: true
  }
);

StatusSchema.methods.updateStatus = updateStatus;
StatusSchema.methods.toResponse = toResponse;

StatusSchema.statics.latestStatusIsOnline = latestStatusIsOnline;
StatusSchema.statics.findLatestStatus = findLatestStatus;
StatusSchema.statics.logStatus = logStatus;

export const Status = model<StatusDocument>('Status', StatusSchema as any) as StatusModel;
