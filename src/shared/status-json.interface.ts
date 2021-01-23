import { StatusValue } from './status-value.enum';

export interface StatusJson {
  from: string;
  to: string;
  status: StatusValue;
}
