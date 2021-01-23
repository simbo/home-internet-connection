import { createContext } from 'preact';
import { Store } from 'small-store';

import { StoreAction, StoreActionPayloads, storeActions } from './actions';
import { storeEffects } from './effects';
import { StoreState } from './state.interface';

const initialState: StoreState = {
  currentStatus: null,
  latestStatus: null,
  latestSpeed: null
};

export const store = new Store<StoreState, StoreAction, StoreActionPayloads>(initialState, storeActions, storeEffects);

export const storeContext = createContext(initialState);
