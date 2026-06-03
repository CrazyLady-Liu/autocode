export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type RiskReason = 
  | 'STOCK_ZERO' 
  | 'NO_SUPPLIER' 
  | 'EXTREMELY_LOW' 
  | 'BELOW_SAFETY' 
  | 'LEAD_TIME_RISK' 
  | 'BUFFER_RISK' 
  | 'NORMAL';

export interface RiskAssessment {
  level: RiskLevel;
  reason: RiskReason;
  stockDays: number;
  safetyRatio: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  totalCapacity: number;
  usedCapacity: number;
  healthScore: number;
  status: 'normal' | 'warning' | 'critical';
  skuCount: number;
  alertCount: number;
}

export interface SKU {
  id: string;
  skuCode: string;
  name: string;
  category: string;
  currentStock: number;
  safetyStock: number;
  avgDailyConsumption: number;
  leadTime: number;
  warehouseId: string;
  supplierId: string | null;
  unitCost: number;
  lastRestockDate: string;
  imageUrl?: string;
}

export interface SKUWithRisk extends SKU {
  risk: RiskAssessment;
  supplier?: Supplier | null;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  rating: number;
  avgDeliveryTime: number;
  onTimeRate: number;
  status: 'active' | 'inactive' | 'pending';
  categories: string[];
  totalOrders: number;
  qualityScore: number;
}

export interface ReplenishmentSuggestion {
  id: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  suggestedQuantity: number;
  expectedDate: string;
  estimatedCost: number;
  priority: number;
  supplierId: string;
  supplierName: string;
  currentStock: number;
  safetyStock: number;
  status: 'pending' | 'approved' | 'ordered' | 'completed';
}

export interface RiskAlert {
  id: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  type: string;
  level: RiskLevel;
  description: string;
  status: 'new' | 'acknowledged' | 'resolved';
  createdAt: string;
}

export interface DeliveryRecord {
  id: string;
  supplierId: string;
  orderId: string;
  actualDays: number;
  expectedDays: number;
  qualityScore: string;
  date: string;
  status: 'on-time' | 'early' | 'late';
}

export interface InventoryLog {
  id: string;
  skuId: string;
  stockChange: number;
  reason: string;
  timestamp: string;
  balance: number;
}

export interface TrendDataPoint {
  date: string;
  stock: number;
  consumption: number;
  forecast?: number;
}

export interface SimulationParams {
  safetyStockCoefficient: number;
  warningThreshold: number;
  leadTimeAdjustment: number;
  demandFluctuation: number;
  alertNoiseThreshold: number;
}

export interface SimulationResult {
  scenario: string;
  description: string;
  affectedSKUs: number;
  criticalAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  recommendedActions: string[];
  costImpact: number;
  timeline: string;
}

export interface KPIData {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
  color: string;
}

export interface AlertAggregation {
  level: RiskLevel;
  count: number;
  skuIds: string[];
}
