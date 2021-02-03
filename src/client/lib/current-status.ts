import { addMinutes, differenceInMinutes } from 'date-fns';
import { BehaviorSubject, from, Observable, timer } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { StatusValue } from '../../shared/status-value.enum';
import { apiService } from './api.service';
import { CurrentStatus } from './status.interface';

const currentStatusSubject = new BehaviorSubject<CurrentStatus | null>(null);

timer(0, 60000)
  .pipe(mergeMap(() => from(apiService.getLatestStatus())))
  .subscribe(latestStatus => {
    const currentStatus: CurrentStatus = {
      from: null,
      to: new Date(),
      status: StatusValue.Unknown
    };
    if (latestStatus) {
      if (differenceInMinutes(new Date(), latestStatus.to) <= 1) {
        currentStatus.from = latestStatus.from;
        currentStatus.to = latestStatus.to;
        currentStatus.status = latestStatus.status;
      } else {
        currentStatus.from = addMinutes(latestStatus.to, 1);
      }
    }
    currentStatusSubject.next(currentStatus);
  });

export const currentStatus$ = currentStatusSubject.pipe(filter(status => !!status)) as Observable<CurrentStatus>;
