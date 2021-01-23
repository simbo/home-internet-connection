import { Component, VNode } from 'preact';
import { Subject } from 'rxjs';

import { apiService } from '../lib/api.service';
import { getStatusPercentages } from '../lib/get-status-percentages';
import { MinutewiseStatus, Status, StatusPercentages } from '../lib/status.interface';
import { toMinutewiseStatus } from '../lib/to-minutewise-status';
import { SpeedCharts24Hours } from './speed-charts-24-hours';
import { StatusChart24Hours } from './status-chart-24-hours';
import { StatusPercentagesDisplay } from './status-percentages';

interface Last24HoursState {
  entries: Status[];
  minutewiseEntries: MinutewiseStatus[];
  percentages: StatusPercentages;
}

export class Last24Hours extends Component<{}, Last24HoursState> {
  private readonly unsubscribeSubject = new Subject<void>();

  constructor(props: {}) {
    super(props);
    apiService.getStatusForLast24Hours().then(entries => {
      const minutewiseEntries = toMinutewiseStatus(entries);
      const percentages = getStatusPercentages(minutewiseEntries);
      this.setState({ entries, minutewiseEntries, percentages });
    });
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(props: {}, { minutewiseEntries, percentages }: Last24HoursState): VNode {
    return (
      <div class="c-last-24-hours">
        <SpeedCharts24Hours />
        {percentages ? <StatusPercentagesDisplay percentages={percentages} /> : ''}
        {minutewiseEntries ? <StatusChart24Hours /> : ''}
      </div>
    );
  }
}
