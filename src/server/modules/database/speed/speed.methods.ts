import { SpeedErrorJson } from '../../../../shared/speed-error-json.interface';
import { SpeedJson } from '../../../../shared/speed-json.interface';
import { SpeedDetailedJson, SpeedDocument } from './speed.types';

export function toResponse(this: SpeedDocument, detailed = false): SpeedJson | SpeedDetailedJson | SpeedErrorJson {
  const date = this.date.toISOString();
  if (this.error) {
    const error = this.error;
    return { date, error };
  }
  const report = detailed && this.report ? this.report.toResponse() : {};
  return {
    date,
    down: this.down as number,
    up: this.up as number,
    ping: this.ping as number,
    host: this.host as string,
    ...report
  };
}
