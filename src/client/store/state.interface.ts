import { Speed } from '../lib/speed.interface';
import { CurrentStatus, LatestStatus } from '../lib/status.interface';

export interface StoreState {
  currentStatus: CurrentStatus | null;
  latestStatus: LatestStatus | null;
  latestSpeed: Speed | null;
}
