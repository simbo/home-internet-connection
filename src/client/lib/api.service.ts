import { slashJoin } from 'path-slashes';

import { SpeedErrorJson } from '../../shared/speed-error-json.interface';
import { SpeedJson } from '../../shared/speed-json.interface';
import { StatusJson } from '../../shared/status-json.interface';
import { env } from './env';
import { formatIsoDate } from './format';
import { Speed } from './speed.interface';
import { Status } from './status.interface';

class ApiService {
  private readonly basePath = slashJoin(location.pathname, 'api');

  public async getLatestStatus(): Promise<Status> {
    return this.request<StatusJson>('status/latest').then(this.reviveStatus);
  }

  public async getStatusForLast24Hours(): Promise<Status[]> {
    return this.request<StatusJson[]>('status/last-24-hours').then(collection => collection.map(this.reviveStatus));
  }

  public async getStatusRanged(fromDate: Date, toDate: Date): Promise<Status[]> {
    return this.request<StatusJson[]>(
      `status/ranged/${formatIsoDate(fromDate)}/${formatIsoDate(toDate)}`
    ).then(collection => collection.map(this.reviveStatus));
  }

  public async getLatestSpeed(): Promise<Speed> {
    return this.request<SpeedJson>('speed/latest').then(this.reviveSpeed);
  }

  public async getSpeedForLast24Hours(): Promise<Speed[]> {
    return this.request<(SpeedJson | SpeedErrorJson)[]>('speed/last-24-hours').then(collection =>
      collection.map(this.reviveSpeed)
    );
  }

  public async getSpeedRanged(fromDate: Date, toDate: Date): Promise<Speed[]> {
    return this.request<SpeedJson[]>(
      `speed/ranged/${formatIsoDate(fromDate)}/${formatIsoDate(toDate)}`
    ).then(collection => collection.map(this.reviveSpeed));
  }

  private async request<T>(path: string): Promise<T> {
    return fetch(slashJoin(this.basePath, path)).then(async response => {
      if (response.status >= 400) {
        throw await response.json();
      }
      return response.json();
    });
  }

  private reviveStatus({ from, to, status }: StatusJson): Status {
    return { from: new Date(from), to: new Date(to), status };
  }

  private reviveSpeed(speed: SpeedJson | SpeedErrorJson): Speed {
    return {
      date: new Date(speed.date),
      down: speed.hasOwnProperty('down')
        ? (speed as SpeedJson).down
        : env.speedtest.expected.down * env.speedtest.valueMultiplier,
      up: speed.hasOwnProperty('up')
        ? (speed as SpeedJson).up
        : env.speedtest.expected.up * env.speedtest.valueMultiplier,
      ping: speed.hasOwnProperty('ping') ? (speed as SpeedJson).ping : env.speedtest.expected.ping,
      host: speed.hasOwnProperty('host') ? (speed as SpeedJson).host : null,
      error: speed.hasOwnProperty('error') ? (speed as SpeedErrorJson).error : null
    };
  }
}

export const apiService = new ApiService();
