import { addMinutes, differenceInMinutes, isAfter, isBefore, isSameMinute, max, min, subMinutes } from 'date-fns';

import { StatusJson } from '../../shared/status-json.interface';
import { StatusValue } from '../../shared/status-value.enum';

export function adjustStatusDateRange(entries: StatusJson[], fromDate?: Date, toDate?: Date): StatusJson[] {
  // if there are no entries, create one covering the whole range with unknown status
  if (!entries.length && fromDate && toDate) {
    return [
      {
        from: fromDate.toISOString(),
        to: toDate.toISOString(),
        status: StatusValue.Unknown
      }
    ];
  }
  const step = 1;
  return (
    entries
      // cut first and last entry to fit range
      .map((entry, i) => {
        if (i === 0 && fromDate && isBefore(new Date(entry.from), fromDate)) {
          entry.from = fromDate.toISOString();
        }
        if (i === entries.length - 1 && toDate && isAfter(new Date(entry.to), toDate)) {
          entry.to = toDate.toISOString();
        }
        return entry;
      })
      // populate gaps with unknown status entries
      .reduce((populatedEntries, entry, i) => {
        const entryFrom = new Date(entry.from);
        if (i === 0) {
          // populate any leading gap
          if (fromDate && isAfter(entryFrom, fromDate) && !isSameMinute(entryFrom, fromDate)) {
            populatedEntries.push({
              from: fromDate.toISOString(),
              to: max([fromDate, subMinutes(entryFrom, step)]).toISOString(),
              status: StatusValue.Unknown
            });
          }
        } else {
          // populate any gaps in between
          const lastTo = new Date(entries[i - 1].to);
          if (differenceInMinutes(entryFrom, lastTo) > step) {
            const newFrom = addMinutes(lastTo, step);
            populatedEntries.push({
              from: newFrom.toISOString(),
              to: max([newFrom, subMinutes(entryFrom, step)]).toISOString(),
              status: StatusValue.Unknown
            });
          }
        }
        populatedEntries.push(entry);
        if (i === entries.length - 1) {
          // populate any trailing gap
          const entryTo = new Date(entry.to);
          if (toDate && isBefore(entryTo, toDate) && !isSameMinute(entryTo, toDate)) {
            populatedEntries.push({
              from: min([toDate, addMinutes(entryTo, step)]).toISOString(),
              to: toDate.toISOString(),
              status: StatusValue.Unknown
            });
          }
        }
        return populatedEntries;
      }, [] as StatusJson[])
  );
}
