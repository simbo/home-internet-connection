import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  ChartDataset,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ScatterDataPoint,
  TimeScale,
  Tooltip
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { roundToNearestMinutes } from 'date-fns';
import OpenColor from 'open-color';
import { Component, createRef, VNode } from 'preact';

import { FONT_MONO, FONT_SANS } from '../lib/constants';
import { env } from '../lib/env';
import { formatBps, formatDecimals, formatPing, formatShortDate, formatSpeedType } from '../lib/format';
import { SpeedType } from '../lib/speed-type.enum';
import { Speed } from '../lib/speed.interface';

Chart.register(
  TimeScale,
  LinearScale,
  LineController,
  BarController,
  PointElement,
  LineElement,
  BarElement,
  Legend,
  Tooltip,
  Filler,
  CategoryScale
);

interface SpeedChartProps {
  type: SpeedType;
  data: Speed[];
}

export class SpeedChart extends Component<SpeedChartProps> {
  private readonly chartCanvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;
  private maxValue = 0;
  private readonly errorMessages = new Map<number, string>();
  private readonly hostNames = new Map<number, string>();
  private readonly dates = new Map<string, Date>();

  public componentDidMount(): void {
    this.setChart();
  }

  public componentDidUpdate(prevProps: SpeedChartProps): void {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setChart();
    }
  }

  public render(): VNode {
    return (
      <div class="c-speed-chart">
        <canvas className="c-speed-chart__canvas" ref={this.chartCanvasRef}></canvas>
      </div>
    );
  }

  private getDatasets(): (ChartDataset<'bar'> | ChartDataset<'line'>)[] {
    this.errorMessages.clear();
    this.hostNames.clear();
    return Object.values(
      this.props.data.reduce((data, speed) => {
        const y =
          this.props.type === SpeedType.Ping
            ? Math.round(speed[this.props.type])
            : formatDecimals(speed[this.props.type] / env.speedtest.valueMultiplier);
        const x = roundToNearestMinutes(speed.date, { nearestTo: 15 }).getTime();
        if (!data[x] || !speed.error) {
          data[x] = [x, y, speed];
        }
        return data;
      }, {} as { [key: number]: [number, number, Speed] })
    )
      .reduce(
        (data, [x, y, speed]) => {
          data[0].push({ x, y: env.speedtest.expected[this.props.type] });
          if (speed.error) {
            this.errorMessages.set(data[1].length, speed.error);
            this.dates.set(`error_${data[1].length}`, speed.date);
          } else if (speed.host) {
            this.hostNames.set(data[2].length, speed.host);
            this.dates.set(`report_${data[2].length}`, speed.date);
          }
          data[speed.error ? 1 : 2].push({ x, y });
          if (y > this.maxValue) {
            this.maxValue = y;
          }
          return data;
        },
        [[], [], []] as ScatterDataPoint[][]
      )
      .map((data, i) =>
        i === 0
          ? {
              label: 'Expected',
              backgroundColor: OpenColor.green[5],
              borderColor: OpenColor.green[5],
              data,
              type: 'line',
              order: 0,
              pointRadius: 0,
              hitRadius: 0,
              hoverRadius: 0,
              borderWidth: 1
            }
          : {
              label: i === 2 ? formatSpeedType(this.props.type) : 'Error',
              backgroundColor: i === 2 ? OpenColor.blue[5] : OpenColor.gray[8],
              data,
              order: 1,
              stack: 'a'
            }
      );
  }

  private getYMinMaxOptions(): { min: number; max: number } {
    const max = Math.ceil(env.speedtest.expected[this.props.type] * 1.2);
    return {
      min: 0,
      max: this.maxValue > max ? Math.ceil(this.maxValue * 1.2) : max
    };
  }

  private getChartOptions(): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: [],
        datasets: this.getDatasets()
      },
      options: {
        font: {
          family: FONT_SANS,
          size: 10
        },
        animation: false,
        responsive: true,
        devicePixelRatio: 2,
        aspectRatio: 16 / 9,
        interaction: {
          mode: 'point'
        },
        spanGaps: false,
        scales: {
          x: {
            type: 'time',
            time: {
              displayFormats: {
                minute: env.time.short
              },
              unit: 'minute',
              stepSize: 15
            },
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              minRotation: 45,
              labelOffset: 6,
              font: {
                family: FONT_MONO
              }
            },
            gridLines: {
              display: true
            }
          },
          y: {
            type: 'linear',
            ...this.getYMinMaxOptions(),
            ticks: {
              autoSkip: false,
              font: {
                family: FONT_MONO
              },
              stepSize: Math.round(env.speedtest.expected[this.props.type] / 10)
            },
            gridLines: {
              display: true
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            reverse: true,
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
              title: () => '',
              label: tooltipItem => {
                if (tooltipItem.datasetIndex === 1) {
                  return ` ${
                    this.errorMessages.has(tooltipItem.dataIndex)
                      ? this.errorMessages.get(tooltipItem.dataIndex)
                      : 'Error'
                  }`;
                }
                const label = [
                  ` ${
                    this.props.type === SpeedType.Ping
                      ? formatPing(tooltipItem.dataPoint.y)
                      : formatBps(tooltipItem.dataPoint.y)
                  }`
                ];
                if (this.hostNames.has(tooltipItem.dataIndex)) {
                  label.push(` ${this.hostNames.get(tooltipItem.dataIndex)}`);
                }
                return label;
              },
              afterLabel: tooltipItem =>
                ` ${formatShortDate(
                  this.dates.get(`${tooltipItem.datasetIndex === 1 ? 'error' : 'report'}_${tooltipItem.dataIndex}`) ||
                    tooltipItem.dataPoint.x
                )}`
            }
          }
        }
      }
    };
  }

  private setChart(): void {
    if (!this.chartCanvasRef || !this.chartCanvasRef.current || !this.props.data || !this.props.type) {
      return;
    }
    if (!this.chart) {
      const canvasCtx = this.chartCanvasRef.current.getContext('2d') as CanvasRenderingContext2D;
      this.chart = new Chart(canvasCtx, this.getChartOptions());
    } else {
      const [set0, set1, set2] = this.getDatasets();
      this.chart.data.datasets[0].data = set0.data;
      this.chart.data.datasets[1].data = set1.data;
      this.chart.data.datasets[2].data = set2.data;
      // this.chart.data.datasets = this.getDatasets();
      console.log(this.getDatasets());
      const { min, max } = this.getYMinMaxOptions();
      if (this.chart.options.scales?.x) {
        this.chart.options.scales.x.min = min;
        this.chart.options.scales.x.max = max;
      }
      this.chart.update();
    }
  }
}
