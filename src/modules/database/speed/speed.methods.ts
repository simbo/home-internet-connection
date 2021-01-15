import { zonedDateString } from '../../utils/date';
import { SpeedDetailedJson, SpeedDocument, SpeedErrorJson, SpeedJson } from './speed.types';

export function toResponse(this: SpeedDocument, detailed = false): SpeedJson | SpeedDetailedJson | SpeedErrorJson {
  const date = zonedDateString(this.date);
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
    ...report
  };
}
