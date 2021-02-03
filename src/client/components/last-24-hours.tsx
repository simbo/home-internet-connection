import { endOfHour, startOfHour, subHours } from 'date-fns';
import { Component, VNode } from 'preact';
import { from, Subject, timer } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';

import { apiService } from '../lib/api.service';
import { getStatusPercentages } from '../lib/get-status-percentages';
import { Speed } from '../lib/speed.interface';
import { MinutewiseStatus, StatusPercentages } from '../lib/status.interface';
import { toMinutewiseStatus } from '../lib/to-minutewise-status';
import { DayCharts } from './day-charts';

interface Last24HoursState {
  percentages: StatusPercentages;
  speedData: Speed[];
  statusData: MinutewiseStatus[];
}

export class Last24Hours extends Component<{}, Last24HoursState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor(props: {}) {
    super(props);
    this.subscribeToPercentageData();
    this.subscribeToSpeedData();
    this.subscribeToStatusData();
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(props: {}, { percentages, speedData, statusData }: Last24HoursState): VNode {
    return (
      <div class="c-last-24-hours">
        {percentages && speedData && statusData ? (
          <DayCharts percentages={percentages} speedData={speedData} statusData={statusData} />
        ) : (
          ''
        )}
      </div>
    );
  }

  private subscribeToPercentageData(): void {
    timer(0, 60000)
      .pipe(
        takeUntil(this.unsubscribeSubject),
        mergeMap(() => from(apiService.getStatusForLast24Hours()))
      )
      .subscribe(entries => {
        const minutewiseEntries = toMinutewiseStatus(entries);
        const percentages = getStatusPercentages(minutewiseEntries);
        this.setState(state => ({ ...state, percentages }));
      });
  }

  private subscribeToSpeedData(): void {
    timer(0, 60000)
      .pipe(
        takeUntil(this.unsubscribeSubject),
        filter(() => !this.state.speedData || [1, 16, 31, 46].includes(new Date().getMinutes())),
        mergeMap(() => {
          const toDate = new Date();
          const fromDate = startOfHour(subHours(toDate, 24));
          return from(apiService.getSpeedRanged(fromDate, toDate));
        })
      )
      .subscribe(speedData => {
        this.setState(state => ({ ...state, speedData }));
      });
  }

  private subscribeToStatusData(): void {
    timer(0, 60000)
      .pipe(
        takeUntil(this.unsubscribeSubject),
        mergeMap(() => {
          const date = new Date();
          const toDate = endOfHour(date);
          const fromDate = startOfHour(subHours(date, 24));
          return from(apiService.getStatusRanged(fromDate, toDate));
        })
      )
      .subscribe(entries => {
        this.setState(state => ({ ...state, statusData: toMinutewiseStatus(entries) }));
      });
  }
}
