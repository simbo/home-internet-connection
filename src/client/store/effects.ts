import { Effects } from 'small-store';

import { StoreAction, StoreActionPayloads } from './actions';
import { StoreState } from './state.interface';

export const storeEffects: Effects<StoreState, StoreAction, StoreActionPayloads> = {
  [StoreAction.SetLatestStatus]: (action, state, dispatch) => {
    dispatch(StoreAction.SetCurrentStatus);
  }
};
