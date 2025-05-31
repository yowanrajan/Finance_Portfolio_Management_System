import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../../../core/services/portfolio.service';
import { MarketDataService } from '../../../core/services/market-data.service';
import { Portfolio } from '../../../core/models/portfolio.model';
import { MarketData, MarketTrend } from '../../../core/models/market-data.model';
import { ChartData } from '../../../core/models/chart-data.model';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  portfolio$: Observable<Portfolio | undefined>;
  marketDataSource = new MatTableDataSource<MarketData>();
  performanceChartData: ChartData | null = null;
  isLoading = true;

  // Mock portfolio performance data (6 month history)
  portfolioPerformance: { date: Date, value: number }[] = [];

  constructor(
    private portfolioService: PortfolioService,
    private marketDataService: MarketDataService
  ) {
    this.portfolio$ = this.portfolioService.getPortfolio('1');
  }

  ngOnInit(): void {
    // Load all required data
    this.loadDashboardData();
    this.marketDataService.getAllMarketData().subscribe(data => {
      this.marketDataSource.data = data ?? []; // fallback to empty array
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // First load portfolio
    this.portfolioService.getPortfolio('1').subscribe(portfolio => {
      if (portfolio) {
        // Generate mock portfolio performance history
        this.generateMockPerformanceData(portfolio);

        // Generate performance chart data
        this.performanceChartData = this.marketDataService.getPerformanceData(this.portfolioPerformance);
      }

      this.isLoading = false;
    });
  }

  generateMockPerformanceData(portfolio: Portfolio): void {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const startValue = portfolio.totalValue * 0.85; // Start with 85% of current value
    const dayCount = Math.round((today.getTime() - sixMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
    const valueIncrease = portfolio.totalValue - startValue;

    this.portfolioPerformance = [];

    // Generate a data point for each week
    for (let i = 0; i <= dayCount; i += 7) {
      const date = new Date(sixMonthsAgo);
      date.setDate(date.getDate() + i);

      // Create a realistic growth curve with some volatility
      const progressRatio = i / dayCount;
      const baseValue = startValue + (valueIncrease * progressRatio);
      const volatility = startValue * 0.02; // 2% volatility
      const randomFactor = (Math.random() - 0.5) * volatility;

      this.portfolioPerformance.push({
        date: new Date(date),
        value: Number((baseValue + randomFactor).toFixed(2))
      });
    }

    // Make sure the last data point matches the current portfolio value
    this.portfolioPerformance.push({
      date: new Date(),
      value: portfolio.totalValue
    });
  }
}
