import { differenceInMinutes, isToday, startOfMinute } from 'date-fns';

import { determineState } from '../../utils/determine-state';
import { zonedDateString } from '../../utils/zoned-date';
import { LogDocument } from './log.types';
import { State } from './state.schema';
import { StateDocument, StateValue } from './state.types';

export function lastUpdate(this: LogDocument): { date: string; state: StateValue } {
  const state = this.states[this.states.length - 1].state;
  return { date: this.updatedAt, state };
}

export function lastState(this: LogDocument): StateValue {
  return this.lastUpdate().state;
}

export async function updateState(this: LogDocument, state?: StateValue): Promise<void> {
  if (!isToday(new Date(this.createdAt))) {
    return;
  }
  state = state !== undefined ? state : await determineState();
  const now = new Date();
  const currentMinute = startOfMinute(now);
  let currentState: StateDocument;
  if (
    this.states.length &&
    (currentState = this.states[this.states.length - 1]) &&
    currentState.state === state &&
    [0, 1].includes(differenceInMinutes(currentMinute, new Date(currentState.to)))
  ) {
    currentState.toHour = currentMinute.getHours();
    currentState.toMinute = currentMinute.getMinutes();
    currentState.to = zonedDateString(currentMinute);
  } else {
    currentState = new State({ state });
    this.states.push(currentState);
  }
  this.updatedAt = zonedDateString(now);
}
