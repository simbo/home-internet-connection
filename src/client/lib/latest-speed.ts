import { BehaviorSubject, from, Observable, timer } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { apiService } from './api.service';
import { Speed } from './speed.interface';

const latestSpeedSubject = new BehaviorSubject<Speed | null>(null);

timer(0, 60000)
  .pipe(mergeMap(() => from(apiService.getLatestSpeed())))
  .subscribe(latestSpeed => {
    latestSpeedSubject.next(latestSpeed);
  });

export const latestSpeed$ = latestSpeedSubject.pipe(filter(speed => !!speed)) as Observable<Speed>;
