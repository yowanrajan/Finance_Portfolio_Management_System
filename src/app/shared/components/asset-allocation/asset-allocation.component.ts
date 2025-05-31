import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Asset, AssetType } from '../../../core/models/portfolio.model';
import { ChartData } from '../../../core/models/chart-data.model';

@Component({
  selector: 'app-asset-allocation',
  templateUrl: './asset-allocation.component.html',
  styleUrls: ['./asset-allocation.component.scss']
})
export class AssetAllocationComponent implements OnChanges {
  @Input() assets: Asset[] = [];

  chartData: ChartData | null = null;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assets'] && this.assets) {
      this.generateChartData();
    }
  }

  generateChartData(): void {
    // Group assets by type and calculate total value
    const assetsByType = new Map<AssetType, number>();

    this.assets.forEach(asset => {
      const value = asset.value || asset.quantity * (asset.currentPrice || asset.purchasePrice);
      const currentValue = assetsByType.get(asset.type) || 0;
      assetsByType.set(asset.type, currentValue + value);
    });

    // Convert map to arrays for chart
    const types = Array.from(assetsByType.keys());
    const values = Array.from(assetsByType.values());

    // Create chart data
    this.chartData = {
      labels: types,
      datasets: [{
        label: 'Asset Allocation',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ]
      }]
    };
  }
}
