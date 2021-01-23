import { slashJoin } from 'path-slashes';

import { SpeedJson } from '../../shared/speed-json.interface';
import { StatusJson } from '../../shared/status-json.interface';
import { formatIsoDate } from './format';
import { Speed } from './speed.interface';
import { LatestStatus, Status } from './status.interface';

class ApiService {
  private readonly basePath = slashJoin(location.pathname, 'api');

  public async getLatestStatus(): Promise<LatestStatus> {
    return this.request<StatusJson>('status/latest').then(({ from, to, status }) => ({
      since: new Date(from),
      updated: new Date(to),
      status
    }));
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
    return this.request<SpeedJson[]>('speed/last-24-hours').then(collection => collection.map(this.reviveSpeed));
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

  private reviveSpeed(speed: SpeedJson): Speed {
    return { ...speed, date: new Date(speed.date) };
  }
}

export const apiService = new ApiService();
