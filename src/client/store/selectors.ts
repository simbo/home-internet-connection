import { Selectors } from 'small-store';

import { Speed } from '../lib/speed.interface';
import { CurrentStatus, LatestStatus } from '../lib/status.interface';
import { StoreState } from './state.interface';

export const storeSelectors: Selectors<StoreState> = {
  latestStatus: ({ latestStatus }): LatestStatus | null => {
    return latestStatus;
  },

  currentStatus: ({ currentStatus }): CurrentStatus | null => {
    return currentStatus;
  },

  latestSpeed: ({ latestSpeed }): Speed | null => {
    return latestSpeed;
  }
};
