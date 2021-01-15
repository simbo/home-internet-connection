import { Document, Model } from 'mongoose';

export interface SpeedReportEntry {
  download: {
    bandwidth: number;
    bytes: number;
    elapsed: number;
  };
  upload: {
    bandwidth: number;
    bytes: number;
    elapsed: number;
  };
  ping: {
    jitter: number;
    latency: number;
  };
  packetLoss: number;
  interface: {
    externalIp: string;
    internalIp: string;
    isVpn: boolean;
    macAddr: string;
    name: string;
  };
  isp: string;
  server: {
    country: string;
    host: string;
    id: number;
    ip: string;
    location: string;
    name: string;
    port: number;
  };
  result: {
    id: string;
    url: string;
  };
}

export interface SpeedReportDocument extends SpeedReportEntry, Document<SpeedReportEntry> {
  toResponse(): SpeedReportEntry;
}

export interface SpeedReportModel extends Model<SpeedReportDocument> {}
