import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, tap, catchError, delay } from 'rxjs/operators';
import { Portfolio, Asset, AssetType } from '../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfoliosSubject = new BehaviorSubject<Portfolio[]>([]);
  public portfolios$ = this.portfoliosSubject.asObservable();

  // Mock data for the portfolio
  private mockPortfolios: Portfolio[] = [
    {
      id: '1',
      name: 'Main Investment Portfolio',
      totalValue: 150000,
      createdDate: new Date('2023-01-15'),
      lastUpdated: new Date('2023-10-01'),
      assets: [
        {
          id: '1',
          type: AssetType.STOCK,
          symbol: 'AAPL',
          name: 'Apple Inc.',
          quantity: 50,
          purchasePrice: 150.75,
          purchaseDate: new Date('2023-02-10'),
          currentPrice: 180.25,
          value: 9012.5,
          gain: 1475,
          gainPercentage: 19.57
        },
        {
          id: '2',
          type: AssetType.STOCK,
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          quantity: 30,
          purchasePrice: 290.10,
          purchaseDate: new Date('2023-03-15'),
          currentPrice: 320.45,
          value: 9613.5,
          gain: 909.5,
          gainPercentage: 10.44
        },
        {
          id: '3',
          type: AssetType.ETF,
          symbol: 'VOO',
          name: 'Vanguard S&P 500 ETF',
          quantity: 40,
          purchasePrice: 370.25,
          purchaseDate: new Date('2023-01-20'),
          currentPrice: 415.80,
          value: 16632,
          gain: 1822,
          gainPercentage: 12.3
        }
      ]
    }
  ];

  constructor(private http: HttpClient) {
    // Initialize with mock data
    this.portfoliosSubject.next(this.mockPortfolios);
  }

  getPortfolios(): Observable<Portfolio[]> {
    // Simulate HTTP request with delay
    return of(this.mockPortfolios).pipe(
      delay(800),
      tap(portfolios => this.portfoliosSubject.next(portfolios))
    );
  }

  getPortfolio(id: string): Observable<Portfolio | undefined> {
    // Simulate HTTP request
    return of(this.mockPortfolios.find(p => p.id === id)).pipe(delay(300));
  }

  addAsset(portfolioId: string, asset: Asset): Observable<Portfolio> {
    // Add ID to new asset
    const newAsset = { ...asset, id: this.generateId() };

    // Find portfolio and add asset
    const portfolios = this.portfoliosSubject.value;
    const portfolioIndex = portfolios.findIndex(p => p.id === portfolioId);

    if (portfolioIndex === -1) {
      return of({} as Portfolio);
    }

    // Calculate asset values
    newAsset.value = newAsset.quantity * newAsset.purchasePrice;
    newAsset.currentPrice = newAsset.purchasePrice; // Mock - in real app would come from market data
    newAsset.gain = 0;
    newAsset.gainPercentage = 0;

    // Create updated portfolio
    const updatedPortfolio = {
      ...portfolios[portfolioIndex],
      assets: [...portfolios[portfolioIndex].assets, newAsset],
      lastUpdated: new Date()
    };

    // Update total value
    updatedPortfolio.totalValue = updatedPortfolio.assets.reduce(
      (sum, asset) => sum + (asset.value || 0), 0
    );

    // Update portfolios list
    portfolios[portfolioIndex] = updatedPortfolio;
    this.portfoliosSubject.next([...portfolios]);

    return of(updatedPortfolio).pipe(delay(300));
  }

  createPortfolio(portfolio: Portfolio): Observable<Portfolio> {
    const newPortfolio = {
      ...portfolio,
      id: this.generateId(),
      createdDate: new Date(),
      lastUpdated: new Date(),
      totalValue: portfolio.assets.reduce((sum, asset) => sum + (asset.quantity * asset.purchasePrice), 0)
    };

    const portfolios = [...this.portfoliosSubject.value, newPortfolio];
    this.portfoliosSubject.next(portfolios);

    return of(newPortfolio).pipe(delay(300));
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
