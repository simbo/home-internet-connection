import { format, utcToZonedTime } from 'date-fns-tz';

import { env } from './env';

export function zonedDate(date: string | number | Date = new Date(), timeZone = env.timezone): Date {
  return utcToZonedTime(new Date(new Date(date).toUTCString()), timeZone);
}

export function zonedDateString(date: string | number | Date = new Date(), timeZone = env.timezone): string {
  return format(zonedDate(date, timeZone), "yyyy-MM-dd'T'HH:mm:ss.SSSXX", { timeZone });
}
