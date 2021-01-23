import { Chart, ChartConfiguration, ChartDataSets, ChartPoint } from 'chart.js';
import { addMinutes, subHours, subMinutes } from 'date-fns';
import { endOfHour, startOfHour } from 'date-fns/esm';
import { Component, createRef, VNode } from 'preact';
import { from, Subject, timer } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { leadingZeros } from '../../shared/leading-zeros';
import { apiService } from '../lib/api.service';
import { env } from '../lib/env';
import { formatShortDate, formatStatus, formatStatusBgColor } from '../lib/format';
import { sortStatus } from '../lib/sort-status';
import { MinutewiseStatus } from '../lib/status.interface';
import { toMinutewiseStatus } from '../lib/to-minutewise-status';

interface StatusChart24HoursProps {
  endDate?: Date;
}

interface StatusChart24HoursState {
  data: MinutewiseStatus[];
}

export class StatusChart24Hours extends Component<StatusChart24HoursProps, StatusChart24HoursState> {
  private readonly chartCanvasRef = createRef<HTMLCanvasElement>();
  private readonly unsubscribeSubject = new Subject<void>();
  private chart!: Chart;

  constructor(props: StatusChart24HoursProps) {
    super(props);
    timer(0, 60000)
      .pipe(
        takeUntil(this.unsubscribeSubject),
        mergeMap(() => {
          const endDate = this.props.endDate || new Date();
          const toDate = endOfHour(endDate);
          const fromDate = startOfHour(subHours(endDate, 24));
          return from(apiService.getStatusRanged(fromDate, toDate));
        })
      )
      .subscribe(entries => {
        this.setState(state => ({ ...state, data: toMinutewiseStatus(entries) }));
      });
  }

  public componentDidMount(): void {
    this.setChart();
  }

  public componentDidUpdate(): void {
    this.setChart();
  }

  public componentWillUnmount(): void {
    this.unsubscribeSubject.next();
  }

  public render(): VNode {
    return (
      <div class="c-status-chart-24-hours">
        <canvas className="c-status-chart-24-hours__canvas" ref={this.chartCanvasRef}></canvas>
      </div>
    );
  }

  private getDatasets(): ChartDataSets[] {
    return this.state.data
      .reduce(
        (data, { at, status }) => {
          data[status].push({ t: startOfHour(at), y: at.getMinutes() });
          return data;
        },
        [[], [], [], []] as ChartPoint[][]
      )
      .map((data, i) => ({
        label: formatStatus(i),
        data,
        backgroundColor: formatStatusBgColor(i),
        radius: 8,
        pointStyle: 'rect' as any,
        status: i
      }))
      .sort(sortStatus(data => data.status));
  }

  private getMinMaxOptions(): { min: Date; max: Date } {
    return {
      min: subMinutes(startOfHour(this.state.data[0].at), 30),
      max: addMinutes(startOfHour(this.state.data[this.state.data.length - 1].at), 30)
    };
  }

  private getChartOptions(): ChartConfiguration {
    return {
      type: 'scatter',
      data: { datasets: this.getDatasets() },
      options: {
        animation: { duration: 0 },
        hover: { animationDuration: 0 },
        responsiveAnimationDuration: 0,
        responsive: false,
        devicePixelRatio: 2,
        aspectRatio: 0.4,
        legend: { labels: { boxWidth: 12 } },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const { t, y } = ((data.datasets as ChartDataSets[])[tooltipItem.datasetIndex as number]
                .data as ChartPoint[])[tooltipItem.index as number];
              return ' ' + formatShortDate(addMinutes(t as Date, y as number));
            }
          }
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                displayFormats: { hour: env.time.short },
                unit: 'hour',
                unitStepSize: 1
              },
              position: 'bottom',
              ticks: {
                ...this.getMinMaxOptions(),
                autoSkip: false,
                maxRotation: 90,
                minRotation: 45,
                padding: 0,
                fontSize: 12
              },
              gridLines: { display: false }
            }
          ],
          yAxes: [
            {
              type: 'linear',
              position: 'bottom',
              ticks: {
                max: 59,
                min: 0,
                autoSkip: false,
                padding: 0,
                fontSize: 12,
                stepSize: 5,
                callback: value => leadingZeros(value)
              },
              gridLines: { display: false }
            }
          ]
        }
      }
    };
  }

  private setChart(): void {
    if (!this.chartCanvasRef || !this.chartCanvasRef.current || !this.state.data) {
      return;
    }
    if (!this.chart) {
      const canvasCtx = this.chartCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
      this.chart = new Chart(canvasCtx, this.getChartOptions());
    } else {
      this.chart.data.datasets = this.getDatasets();
      const { min, max } = this.getMinMaxOptions();
      if (this.chart.options.scales?.xAxes && this.chart.options.scales.xAxes[0]?.ticks) {
        this.chart.options.scales.xAxes[0].ticks.min = min;
        this.chart.options.scales.xAxes[0].ticks.max = max;
      }
      this.chart.update();
    }
  }
}
