import { subHours } from 'date-fns';
import { startOfHour } from 'date-fns/esm';
import { Component, Fragment, VNode } from 'preact';
import { from, Subject, timer } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { apiService } from '../lib/api.service';
import { Speed } from '../lib/speed.interface';
import { SpeedChart, SpeedChartType } from './speed-chart';

interface SpeedCharts24HoursProps {
  endDate?: Date;
}

interface SpeedCharts24HoursState {
  data: Speed[];
}

export class SpeedCharts24Hours extends Component<SpeedCharts24HoursProps, SpeedCharts24HoursState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor(props: SpeedCharts24HoursProps) {
    super(props);
    timer(0, 60000)
      .pipe(
        takeUntil(this.unsubscribeSubject),
        mergeMap(() => {
          const toDate = this.props.endDate || new Date();
          const fromDate = startOfHour(subHours(toDate, 24));
          return from(apiService.getSpeedRanged(fromDate, toDate));
        })
      )
      .subscribe(data => {
        this.setState(state => ({ ...state, data }));
      });
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(props: SpeedCharts24HoursProps, { data }: SpeedCharts24HoursState): VNode {
    return (
      <div class="c-speed-charts-24-hours">
        {data ? (
          <Fragment>
            <SpeedChart data={data} type={SpeedChartType.Download} />
            <SpeedChart data={data} type={SpeedChartType.Upload} />
            <SpeedChart data={data} type={SpeedChartType.Ping} />
          </Fragment>
        ) : (
          ''
        )}
      </div>
    );
  }
}
