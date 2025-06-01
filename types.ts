
export interface Product {
  id: string;
  name: string;
  costPrice: number;
  sellingPrice: number;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string; // For easier display
  quantity: number;
  saleDate: Date;
  unitProfit: number;
  totalProfit: number;
}

export enum ActiveTab {
  PRODUCTS = 'PRODUCTS',
  SALES = 'SALES',
  CHART = 'CHART',
}
