import { Component, Fragment, VNode } from 'preact';

import { SpeedType } from '../lib/speed-type.enum';
import { Speed } from '../lib/speed.interface';
import { MinutewiseStatus, StatusPercentages } from '../lib/status.interface';
import { SpeedChart } from './speed-chart';
import { StatusChart24Hours } from './status-chart-24-hours';
import { StatusPercentagesDisplay } from './status-percentages-display';

interface DayChartsProps {
  percentages: StatusPercentages;
  speedData: Speed[];
  statusData: MinutewiseStatus[];
}

export class DayCharts extends Component<DayChartsProps> {
  public render({ percentages, speedData, statusData }: DayChartsProps): VNode {
    return (
      <div className="c-day-charts">
        {percentages ? <StatusPercentagesDisplay percentages={percentages} /> : ''}
        {statusData ? <StatusChart24Hours data={statusData} /> : ''}
        {speedData ? (
          <Fragment>
            <SpeedChart data={speedData} type={SpeedType.Download} />
            <SpeedChart data={speedData} type={SpeedType.Upload} />
            <SpeedChart data={speedData} type={SpeedType.Ping} />
          </Fragment>
        ) : (
          ''
        )}
      </div>
    );
  }
}
