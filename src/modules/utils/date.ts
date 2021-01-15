import { format, utcToZonedTime } from 'date-fns-tz';

import { env } from './env';
import { leadingZeros } from './leading-zeros';

export type DateArray =
  | [number, number, number]
  | [number, number, number, number]
  | [number, number, number, number, number]
  | [number, number, number, number, number, number];

export function sanitizeDateArray(arr: number[]): DateArray {
  const now = zonedDate();
  const dateArr = arr || [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  if (dateArr.length < 6) {
    for (let i = dateArr.length; i < 6; i++) {
      dateArr[i] = 0;
    }
  }
  return dateArr.slice(0, 6) as DateArray;
}

export function zonedDateToArray(date: string | number | Date): DateArray {
  const dateStr = zonedDateString(date);
  return [
    dateStr.substr(0, 4),
    dateStr.substr(5, 2),
    dateStr.substr(8, 2),
    dateStr.substr(11, 2),
    dateStr.substr(14, 2),
    dateStr.substr(17, 2)
  ].map(val => parseInt(val, 10)) as DateArray;
}

export function zonedDate(date: string | number | Date = new Date(), timeZone = env.timezone): Date {
  return utcToZonedTime(date, timeZone);
}

export function zonedDateString(date: string | number | Date = new Date(), timeZone = env.timezone): string {
  return format(zonedDate(date, timeZone), "yyyy-MM-dd'T'HH:mm:ss.SSSXX", { timeZone });
}

export function zonedDateStringFromNumbers(
  year: number | string = 0,
  month: number | string = 0,
  day: number | string = 0,
  hours: number | string = 0,
  minutes: number | string = 0,
  seconds: number | string = 0
): string {
  const d = [
    leadingZeros(year || 0, 4),
    leadingZeros(month || 0),
    leadingZeros(day || 0),
    leadingZeros(hours || 0),
    leadingZeros(minutes || 0),
    leadingZeros(seconds || 0),
    format(zonedDate(), 'XX')
  ];
  return `${d[0]}-${d[1]}-${d[2]}T${d[3]}:${d[4]}:${d[5]}.000${d[7]}`;
}

export function zonedDateFromNumbers(
  year: number | string = 0,
  month: number | string = 0,
  day: number | string = 0,
  hours: number | string = 0,
  minutes: number | string = 0,
  seconds: number | string = 0
): Date {
  return zonedDate(zonedDateStringFromNumbers(year, month, day, hours, minutes, seconds));
}
