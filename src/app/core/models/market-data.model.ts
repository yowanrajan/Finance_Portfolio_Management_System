export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: Date;
}

export interface MarketTrend {
  symbol: string;
  data: { date: Date; price: number }[];
}
