import { model, Schema } from 'mongoose';

import { StatusValue } from '../../../../shared/status-value.enum';
import { toResponse, updateStatus } from './status.methods';
import { findLatestStatus, findStatusRanged, findStatusSince, latestStatusIsOnline, logStatus } from './status.statics';
import { StatusDocument, StatusModel } from './status.types';

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
      enum: Object.values(StatusValue).filter(value => typeof value === 'number' && value !== StatusValue.Unknown),
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
StatusSchema.statics.findStatusRanged = findStatusRanged;
StatusSchema.statics.findStatusSince = findStatusSince;

export const Status = model<StatusDocument>('Status', StatusSchema as any) as StatusModel;
