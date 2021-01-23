import { addMinutes, isBefore, isSameMinute, startOfMinute } from 'date-fns';

import { MinutewiseStatus, Status } from './status.interface';

export function toMinutewiseStatus(statusCollection: Status[]): MinutewiseStatus[] {
  return statusCollection.reduce((collection, entry) => {
    const status = entry.status;
    let at = startOfMinute(entry.from);
    while (isBefore(at, entry.to) || isSameMinute(at, entry.to)) {
      collection.push({ at, status });
      at = addMinutes(at, 1);
    }
    return collection;
  }, [] as MinutewiseStatus[]);
}
