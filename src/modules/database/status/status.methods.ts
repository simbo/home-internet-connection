import { zonedDateString } from '../../utils/date';
import { StatusDocument, StatusJson } from './status.types';

export function updateStatus(this: StatusDocument): StatusDocument {
  this.to = new Date();
  return this;
}

export function toResponse(this: StatusDocument): StatusJson {
  const { status } = this;
  return {
    from: zonedDateString(this.from),
    to: zonedDateString(this.to),
    status
  };
}
