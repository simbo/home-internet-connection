import { StatusJson } from '../../../../shared/status-json.interface';
import { StatusDocument } from './status.types';

export function updateStatus(this: StatusDocument): StatusDocument {
  this.to = new Date();
  return this;
}

export function toResponse(this: StatusDocument): StatusJson {
  const { status } = this;
  return {
    from: this.from.toISOString(),
    to: this.to.toISOString(),
    status
  };
}
