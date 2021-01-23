import { addMinutes, differenceInMinutes } from 'date-fns';
import { Actions } from 'small-store';

import { StatusValue } from '../../shared/status-value.enum';
import { Speed } from '../lib/speed.interface';
import { CurrentStatus, LatestStatus } from '../lib/status.interface';
import { StoreState } from './state.interface';

export enum StoreAction {
  SetLatestStatus = 'setLatestStatus',
  SetCurrentStatus = 'setCurrentStatus',
  SetLatestSpeed = 'setLatestSpeed'
}

export interface StoreActionPayloads {
  [StoreAction.SetLatestStatus]: LatestStatus;
  [StoreAction.SetLatestSpeed]: Speed;
}

export const storeActions: Actions<StoreState, StoreAction, StoreActionPayloads> = {
  [StoreAction.SetLatestStatus]: latestStatus => ({ latestStatus }),

  [StoreAction.SetCurrentStatus]: () => state => {
    const latestStatus = state.latestStatus;
    const currentStatus: CurrentStatus = {
      since: null,
      updated: new Date(),
      status: StatusValue.Unknown
    };
    if (latestStatus) {
      if (differenceInMinutes(new Date(), latestStatus.updated) <= 1) {
        currentStatus.since = latestStatus.since;
        currentStatus.updated = latestStatus.updated;
        currentStatus.status = latestStatus.status;
      } else {
        currentStatus.since = addMinutes(latestStatus.updated, 1);
      }
    }
    return { ...state, currentStatus };
  },

  [StoreAction.SetLatestSpeed]: latestSpeed => ({ latestSpeed })
};
