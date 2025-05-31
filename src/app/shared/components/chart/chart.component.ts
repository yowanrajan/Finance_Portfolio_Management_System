import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartData } from '../../../core/models/chart-data.model';
import { Chart, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() chartData: ChartData | null = null;
  @Input() chartType: ChartType = 'line';
  @Input() chartHeight: number = 300;
  @Input() chartTitle: string = '';
  @Input() showLegend: boolean = true;

  chartInstance: any;
  chartOptions: any;

  constructor() { }

  ngOnInit(): void {
    this.setupChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && this.chartData) {
      this.setupChartOptions();
    }
  }

  setupChartOptions(): void {
    this.chartOptions = {
      type: this.chartType,
      data: this.chartData || { labels: [], datasets: [] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.showLegend
          },
          title: {
            display: !!this.chartTitle,
            text: this.chartTitle
          }
        }
      }
    };
  }
}
