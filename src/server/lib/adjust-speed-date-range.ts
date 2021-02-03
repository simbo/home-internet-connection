import {
  addHours,
  addMinutes,
  isAfter,
  isBefore,
  isSameMinute,
  roundToNearestMinutes,
  startOfHour,
  subMinutes
} from 'date-fns';

import { SpeedErrorJson } from '../../shared/speed-error-json.interface';
import { SpeedJson } from '../../shared/speed-json.interface';

/* eslint-disable complexity */
export function adjustSpeedDateRange(
  entries: (SpeedJson | SpeedErrorJson)[],
  fromDate?: Date,
  toDate?: Date
): (SpeedJson | SpeedErrorJson)[] {
  const step = 15;
  const error = 'N/A';
  // get the first date in 15 minutes steps
  let fromDateStep = !fromDate ? null : startOfHour(fromDate);
  while (fromDate && fromDateStep && isBefore(fromDateStep, fromDate)) {
    fromDateStep = addMinutes(fromDateStep, step);
  }
  // get the last date in 15 minutes steps
  let toDateStep = !toDate ? null : startOfHour(addHours(toDate, 1));
  while (toDate && toDateStep && isAfter(toDateStep, toDate)) {
    toDateStep = subMinutes(toDateStep, step);
  }
  // if there are no entries, create them covering the whole range with unknown error
  if (!entries.length && fromDateStep && toDateStep) {
    let date = fromDateStep;
    while (isBefore(date, toDateStep)) {
      entries.push({ date: date.toISOString(), error });
      date = addMinutes(date, step);
    }
    return entries;
  }
  return (
    entries
      // populate gaps with unknown error entries
      .reduce((populatedEntries, entry, i) => {
        const entryDate = roundToNearestMinutes(new Date(entry.date), { nearestTo: 15 });
        if (i === 0) {
          // populate any leading gap
          let date = fromDateStep || new Date();
          while (fromDateStep && isBefore(date, entryDate) && !isSameMinute(date, entryDate)) {
            populatedEntries.push({ date: date.toISOString(), error });
            date = addMinutes(date, step);
          }
        } else if (i !== entries.length - 1) {
          // populate any gaps in between
          const lastDate = roundToNearestMinutes(new Date(entries[i - 1].date), { nearestTo: 15 });
          let date = addMinutes(lastDate, step);
          while (!isSameMinute(entryDate, date) && isBefore(date, entryDate)) {
            populatedEntries.push({ date: date.toISOString(), error });
            date = addMinutes(date, step);
          }
        }
        populatedEntries.push(entry);
        if (i === entries.length - 1) {
          // populate any trailing gap
          let date = startOfHour(entryDate);
          while (isBefore(date, entryDate)) {
            date = addMinutes(date, step);
          }
          while (toDateStep && isBefore(date, toDateStep) && !isSameMinute(date, toDateStep)) {
            populatedEntries.push({ date: date.toISOString(), error });
            date = addMinutes(date, step);
          }
        }
        return populatedEntries;
      }, [] as (SpeedJson | SpeedErrorJson)[])
  );
}
