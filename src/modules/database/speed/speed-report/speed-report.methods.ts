import { SpeedReportDocument, SpeedReportEntry } from './speed-report.types';

export function toResponse(this: SpeedReportDocument): SpeedReportEntry {
  return {
    download: this.download,
    upload: this.upload,
    ping: this.ping,
    packetLoss: this.packetLoss,
    interface: this.interface,
    isp: this.isp,
    server: this.server,
    result: this.result
  };
}
