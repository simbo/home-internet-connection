import { format, formatDistance } from 'date-fns';
import OpenColor from 'open-color';

import { StatusValue } from '../../shared/status-value.enum';
import { env } from './env';
import { SpeedType } from './speed-type.enum';

export function formatStatus(value: StatusValue): string {
  return {
    [StatusValue.Offline]: 'Offline',
    [StatusValue.NetworkReachable]: 'LAN only',
    [StatusValue.InternetReachable]: 'Online',
    [StatusValue.Unknown]: 'Unknown'
  }[value];
}

export function formatSpeedType(value: SpeedType): string {
  return {
    [SpeedType.Download]: 'Download',
    [SpeedType.Upload]: 'Upload',
    [SpeedType.Ping]: 'Ping'
  }[value];
}

export function formatStatusBgColor(value: StatusValue): string {
  return {
    [StatusValue.Offline]: OpenColor.red[9],
    [StatusValue.NetworkReachable]: OpenColor.yellow[7],
    [StatusValue.InternetReachable]: OpenColor.green[8],
    [StatusValue.Unknown]: OpenColor.gray[7]
  }[value];
}

export function formatStatusFgColor(value: StatusValue): string {
  return {
    [StatusValue.Offline]: OpenColor.red[2],
    [StatusValue.NetworkReachable]: OpenColor.yellow[0],
    [StatusValue.InternetReachable]: OpenColor.green[1],
    [StatusValue.Unknown]: OpenColor.gray[4]
  }[value];
}

export function formatKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^-a-z]+/g, '');
}

export function formatDate(date: Date): string {
  return format(date, `${env.date.full} ${env.time.full}`);
}

export function formatShortDate(date: Date): string {
  return format(date, `${env.date.short} ${env.time.short}`);
}

export function formatIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSXX");
}

export function formatSince(dateLeft: Date, dateRight = new Date()): string {
  return formatDistance(dateLeft, dateRight);
}

export function formatBps(bits: number): string {
  const unit = ['', 'K', 'M', 'G'];
  let i = 0;
  while (bits > 1000 && i < unit.length - 1) {
    bits /= 1000;
    i++;
  }
  return `${formatDecimals(bits)} ${unit[i]}bps`;
}

export function formatDecimals(value: number, decimals = 2): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

export function formatPing(ping: number): string {
  return `${Math.round(ping)} ms`;
}

export function formatPercentage(value: number): string {
  return `${formatDecimals(value)} %`;
}
