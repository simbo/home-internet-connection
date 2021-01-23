import { Chart, ChartConfiguration, ChartDataSets, ChartPoint } from 'chart.js';
import { Component, createRef, VNode } from 'preact';

import { formatDecimals } from '../lib/format';
import { Speed } from '../lib/speed.interface';

export enum SpeedChartType {
  Download = 'down',
  Upload = 'up',
  Ping = 'ping'
}

interface SpeedChartProps {
  type: SpeedChartType;
  data: Speed[];
}

export class SpeedChart extends Component<SpeedChartProps> {
  private readonly chartCanvasRef = createRef<HTMLCanvasElement>();
  private chart!: Chart;

  public componentDidMount(): void {
    this.setChart();
  }

  public componentDidUpdate(): void {
    this.setChart();
  }

  public render(): VNode {
    return (
      <div class="c-speed-chart">
        <canvas className="c-speed-chart__canvas" ref={this.chartCanvasRef}></canvas>
      </div>
    );
  }

  private getDatasets(): ChartDataSets[] {
    return [
      {
        fill: 'start',
        backgroundColor: 'rgb(255,0,0)',
        data: this.props.data.reduce((data, speed) => {
          const y =
            this.props.type === SpeedChartType.Ping
              ? Math.round(speed[this.props.type])
              : formatDecimals(speed[this.props.type] / 1000000);
          data.push({ t: speed.date, y });
          return data;
        }, [] as ChartPoint[])
      }
    ];
  }

  private getChartOptions(): ChartConfiguration {
    return {
      type: 'line',
      data: { datasets: this.getDatasets() },
      // data: { datasets: [{ data: [] }] },
      options: {
        animation: { duration: 0 },
        hover: { animationDuration: 0 },
        responsiveAnimationDuration: 0,
        responsive: true,
        devicePixelRatio: 2,
        // aspectRatio: 0.4,
        showLines: true,
        legend: { labels: { boxWidth: 12 } },
        // tooltips: {
        //   callbacks: {
        //     label: (tooltipItem, data) => {
        //       const { t, y } = ((data.datasets as ChartDataSets[])[tooltipItem.datasetIndex as number]
        //         .data as ChartPoint[])[tooltipItem.index as number];
        //       return format(addMinutes(t as Date, y as number), ' dd.MM. HH:mm');
        //     }
        //   }
        // },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                displayFormats: { minute: 'HH:mm' },
                unit: 'minute',
                unitStepSize: 15
              },
              position: 'bottom',
              ticks: {
                // ...this.getMinMaxOptions(),
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
                min: 0,
                autoSkip: false,
                padding: 0,
                fontSize: 12,
                stepSize: 10
              },
              gridLines: { display: false }
            }
          ]
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
      // } else {
      //   this.chart.data.datasets = this.getDatasets();
      //   // const { min, max } = this.getMinMaxOptions();
      //   // if (this.chart.options.scales?.xAxes && this.chart.options.scales.xAxes[0]?.ticks) {
      //   //   this.chart.options.scales.xAxes[0].ticks.min = min;
      //   //   this.chart.options.scales.xAxes[0].ticks.max = max;
      //   // }
      //   this.chart.update();
    }
  }
}
