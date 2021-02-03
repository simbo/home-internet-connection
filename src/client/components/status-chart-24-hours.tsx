import {
  Chart,
  ChartConfiguration,
  ChartDataset,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScatterController,
  ScatterDataPoint,
  TimeScale,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { addMinutes, subMinutes } from 'date-fns';
import { startOfHour } from 'date-fns/esm';
import { Component, createRef, VNode } from 'preact';

import { leadingZeros } from '../../shared/leading-zeros';
import { FONT_MONO, FONT_SANS } from '../lib/constants';
import { env } from '../lib/env';
import { formatShortDate, formatStatus, formatStatusBgColor } from '../lib/format';
import { sortStatus } from '../lib/sort-status';
import { MinutewiseStatus } from '../lib/status.interface';

Chart.register(ScatterController, LinearScale, TimeScale, PointElement, LineElement, Legend, Tooltip);

interface StatusChart24HoursProps {
  data: MinutewiseStatus[];
}

export class StatusChart24Hours extends Component<StatusChart24HoursProps> {
  private readonly chartCanvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

  public componentDidMount(): void {
    this.setChart();
  }

  public componentDidUpdate(prevProps: StatusChart24HoursProps): void {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setChart();
    }
  }

  public render(): VNode {
    return (
      <div class="c-status-chart-24-hours">
        <canvas className="c-status-chart-24-hours__canvas" ref={this.chartCanvasRef}></canvas>
      </div>
    );
  }

  private getDatasets(): ChartDataset<'scatter'>[] {
    return this.props.data
      .reduce(
        (data, { at, status }) => {
          data[status].push({ x: startOfHour(at).getTime(), y: at.getMinutes() });
          return data;
        },
        [[], [], [], []] as ScatterDataPoint[][]
      )
      .map((data, i) => ({
        label: formatStatus(i),
        data,
        backgroundColor: formatStatusBgColor(i),
        radius: 8,
        pointStyle: 'rect',
        hitRadius: 0,
        hoverRadius: 8,
        status: i
      }))
      .sort(sortStatus(data => data.status));
  }

  private getXMinMaxOptions(): { min: number; max: number } {
    return {
      min: subMinutes(startOfHour(this.props.data[0].at), 30).getTime(),
      max: addMinutes(startOfHour(this.props.data[this.props.data.length - 1].at), 30).getTime()
    };
  }

  private getChartOptions(): ChartConfiguration {
    return {
      type: 'scatter',
      data: { labels: [], datasets: this.getDatasets() },
      options: {
        font: {
          family: FONT_SANS,
          size: 10
        },
        animation: false,
        responsive: false,
        devicePixelRatio: 2,
        aspectRatio: 0.4,
        interaction: {
          mode: 'point'
        },
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: { hour: env.time.short },
              unit: 'hour',
              stepSize: 1
            },
            ...this.getXMinMaxOptions(),
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 45,
              labelOffset: 4,
              font: {
                family: FONT_MONO
              }
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          },
          y: {
            type: 'linear',
            max: 59.5,
            min: -0.5,
            beginAtZero: false,
            ticks: {
              autoSkip: false,
              stepSize: 0.5,
              callback: value => {
                if (value % 1 !== 0) {
                  return '';
                }
                return leadingZeros(value);
              },
              font: {
                family: FONT_MONO
              }
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            bodyFont: {
              family: FONT_SANS,
              size: 12
            },
            callbacks: {
              label: tooltipItem => ` ${tooltipItem.dataset.label}`,
              afterLabel: tooltipItem =>
                ` ${formatShortDate(addMinutes(tooltipItem.dataPoint.x, tooltipItem.dataPoint.y))}`
            }
          }
        }
      }
    };
  }

  private setChart(): void {
    if (!this.chartCanvasRef || !this.chartCanvasRef.current || !this.props.data) {
      return;
    }
    if (!this.chart) {
      const canvasCtx = this.chartCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
      this.chart = new Chart(canvasCtx, this.getChartOptions());
    } else {
      this.chart.data.datasets = this.getDatasets();
      if (this.chart.options.scales?.x) {
        const { min, max } = this.getXMinMaxOptions();
        this.chart.options.scales.x.min = min;
        this.chart.options.scales.x.max = max;
      }
      this.chart.update();
    }
  }
}
