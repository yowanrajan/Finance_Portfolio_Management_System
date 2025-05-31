export interface Portfolio {
  id?: string;
  name: string;
  totalValue: number;
  createdDate: Date;
  lastUpdated: Date;
  assets: Asset[];
}

export interface Asset {
  id?: string;
  type: AssetType;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
  currentPrice?: number;
  value?: number;
  gain?: number;
  gainPercentage?: number;
}

export enum AssetType {
  STOCK = 'Stock',
  BOND = 'Bond',
  ETF = 'ETF',
  MUTUAL_FUND = 'Mutual Fund',
  CRYPTO = 'Cryptocurrency',
  CASH = 'Cash'
}
