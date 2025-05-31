import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MarketData, MarketTrend } from '../models/market-data.model';
import { ChartData } from '../models/chart-data.model';
import { AssetType } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  // Mock market data
  private mockMarketData: MarketData[] = [
    { symbol: 'AAPL', price: 180.25, change: 2.35, changePercent: 1.32, lastUpdated: new Date() },
    { symbol: 'MSFT', price: 320.45, change: -1.20, changePercent: -0.37, lastUpdated: new Date() },
    { symbol: 'GOOGL', price: 135.60, change: 0.75, changePercent: 0.56, lastUpdated: new Date() },
    { symbol: 'AMZN', price: 130.15, change: 1.45, changePercent: 1.13, lastUpdated: new Date() },
    { symbol: 'VOO', price: 415.80, change: 3.25, changePercent: 0.79, lastUpdated: new Date() }
  ];

  // Mock historical data for charts (6 months)
  private mockHistoricalData: any = {
    'AAPL': this.generateHistoricalData(150.75, 180.25, 180),
    'MSFT': this.generateHistoricalData(290.10, 320.45, 180),
    'GOOGL': this.generateHistoricalData(120.30, 135.60, 180),
    'AMZN': this.generateHistoricalData(110.40, 130.15, 180),
    'VOO': this.generateHistoricalData(370.25, 415.80, 180)
  };

  constructor(private http: HttpClient) { }

  getMarketData(symbol: string): Observable<MarketData> {
    const data = this.mockMarketData.find(item => item.symbol === symbol);
    return of(data || this.mockMarketData[0]).pipe(delay(300));
  }

  getAllMarketData(): Observable<MarketData[]> {
    return of(this.mockMarketData).pipe(delay(500));
  }

  getHistoricalData(symbol: string, days: number = 180): Observable<MarketTrend> {
    const data = this.mockHistoricalData[symbol] || this.mockHistoricalData['AAPL'];
    return of({
      symbol,
      data: data.slice(0, days)
    }).pipe(delay(500));
  }

  getAssetAllocation(assets: { type: AssetType, value: number }[]): ChartData {
    const types = assets.map(a => a.type);
    const values = assets.map(a => a.value);

    return {
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

  getPerformanceData(portfolioHistory: { date: Date, value: number }[]): ChartData {
    return {
      labels: portfolioHistory.map(item => new Date(item.date).toLocaleDateString()),
      datasets: [{
        label: 'Portfolio Value',
        data: portfolioHistory.map(item => item.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false
      }]
    };
  }

  private generateHistoricalData(startPrice: number, endPrice: number, days: number): { date: Date, price: number }[] {
    const data: { date: Date, price: number }[] = [];
    const priceDiff = endPrice - startPrice;
    const volatility = Math.abs(priceDiff) * 0.01;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Generate a somewhat realistic price progression with some volatility
      const progressRatio = 1 - (i / days);
      const trend = startPrice + (priceDiff * progressRatio);
      const randomFactor = (Math.random() - 0.5) * volatility;
      const price = trend + randomFactor;

      data.push({ date, price: Number(price.toFixed(2)) });
    }

    return data;
  }
}
