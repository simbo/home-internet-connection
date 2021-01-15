import { model, Schema } from 'mongoose';

import { toResponse } from './speed-report.methods';
import { SpeedReportDocument, SpeedReportModel } from './speed-report.types';

export const SpeedReportSchema = new Schema<SpeedReportDocument, SpeedReportModel>(
  {
    download: {
      bandwidth: {
        type: Number,
        immutable: true
      },
      bytes: {
        type: Number,
        immutable: true
      },
      elapsed: {
        type: Number,
        immutable: true
      }
    },
    upload: {
      bandwidth: {
        type: Number,
        immutable: true
      },
      bytes: {
        type: Number,
        immutable: true
      },
      elapsed: {
        type: Number,
        immutable: true
      }
    },
    ping: {
      jitter: {
        type: Number,
        immutable: true
      },
      latency: {
        type: Number,
        immutable: true
      }
    },
    packetLoss: {
      type: Number,
      immutable: true
    },
    interface: {
      externalIp: {
        type: String,
        immutable: true
      },
      internalIp: {
        type: String,
        immutable: true
      },
      isVpn: {
        type: Boolean,
        immutable: true
      },
      macAddr: {
        type: String,
        immutable: true
      },
      name: {
        type: String,
        immutable: true
      }
    },
    isp: {
      type: String,
      immutable: true
    },
    server: {
      country: {
        type: String,
        immutable: true
      },
      host: {
        type: String,
        immutable: true
      },
      id: {
        type: Number,
        immutable: true
      },
      ip: {
        type: String,
        immutable: true
      },
      location: {
        type: String,
        immutable: true
      },
      name: {
        type: String,
        immutable: true
      },
      port: {
        type: Number,
        immutable: true
      }
    },
    result: {
      id: {
        type: String,
        immutable: true
      },
      url: {
        type: String,
        immutable: true
      }
    }
  },
  {
    validateBeforeSave: true
  }
);

SpeedReportSchema.methods.toResponse = toResponse;

export const SpeedReport = model<SpeedReportDocument>('SpeedReport', SpeedReportSchema as any) as SpeedReportModel;
