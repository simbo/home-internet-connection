import { startOfDay } from 'date-fns';
import { format } from 'date-fns-tz';

import { zonedDate, zonedDateString } from '../../utils/zoned-date';
import { Log } from './log.schema';
import { LogDocument, LogModel } from './log.types';

export async function logState(this: LogModel): Promise<LogDocument> {
  const entry = (await this.findOneByDate()) || new Log();
  await entry.updateState();
  await entry.save();
  return entry;
}

export async function findOneByDate(
  this: LogModel,
  date: string | [number, number, number] = zonedDateString()
): Promise<LogDocument | null> {
  const dateStr = (date = Array.isArray(date)
    ? `${date[0]}-${date[1]}-${date[2]}T00:00:00.000${format(zonedDate(), 'XX')}`
    : zonedDateString(startOfDay(zonedDate(date))));
  return this.findOne({ date: dateStr });
}
