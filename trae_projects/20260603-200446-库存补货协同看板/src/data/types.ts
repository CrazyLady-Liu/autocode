export type RiskLevel = 'high' | 'medium' | 'low';
export type SupplierStatus = 'active' | 'inactive' | 'delayed';
export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type WarehouseStatus = 'normal' | 'warning' | 'critical';

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  totalSkus: number;
  outOfStock: number;
  inTransit: number;
  healthScore: number;
  status: WarehouseStatus;
}

export interface Sku {
  id: string;
  name: string;
  code: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  avgDailyConsumption: number;
  riskLevel: RiskLevel;
  supplierId: string | null;
  expectedDaysToOut: number;
  lastRestockDate: string;
}

export interface RestockSuggestion {
  id: string;
  skuId: string;
  skuName: string;
  suggestedQuantity: number;
  priority: Priority;
  estimatedArrivalDate: string;
  supplierId: string;
  supplierName: string;
  reason: string;
}

export interface Supplier {
  id: string;
  name: string;
  status: SupplierStatus;
  averageDeliveryTime: number;
  onTimeRate: number;
  contactPerson: string;
  contactPhone: string;
  supportedCategories: string[];
}

export interface StockTrend {
  date: string;
  totalStock: number;
  outOfStockCount: number;
  restockCount: number;
}

export interface ProcessingResult {
  level: string;
  actions: string[];
  suggestedSupplier?: Supplier;
  alternativeSuppliers?: Supplier[];
  batchProcessList?: Sku[];
}

export interface SimulationConfig {
  safetyStockThreshold: number;
  highRiskDays: number;
  mediumRiskDays: number;
  maxAlerts: number;
}

export type SimulationScenario = 'zeroStock' | 'missingSupplier' | 'tooManyAlerts' | 'normal';
