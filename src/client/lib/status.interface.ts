import { StatusValue } from '../../shared/status-value.enum';

export interface Status {
  status: StatusValue;
  from: Date;
  to: Date;
}

export interface LatestStatus {
  status: StatusValue;
  since: Date;
  updated: Date;
}

export interface CurrentStatus {
  status: StatusValue;
  since: Date | null;
  updated: Date;
}

export interface MinutewiseStatus {
  status: StatusValue;
  at: Date;
}

export interface StatusPercentages {
  [StatusValue.Offline]: number;
  [StatusValue.NetworkReachable]: number;
  [StatusValue.InternetReachable]: number;
  [StatusValue.Unknown]: number;
}
