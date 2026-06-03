import { addDays } from 'date-fns';
import type { SKU, Supplier, ReplenishmentSuggestion } from '@/types';

function calculatePriority(sku: SKU, suggestedQty: number): number {
  const stockDays = sku.avgDailyConsumption > 0 
    ? sku.currentStock / sku.avgDailyConsumption 
    : 999;
  const safetyRatio = sku.safetyStock > 0 
    ? sku.currentStock / sku.safetyStock 
    : 999;
  
  let score = 0;
  
  if (sku.currentStock === 0) score += 100;
  if (!sku.supplierId) score += 80;
  if (safetyRatio < 0.3) score += 60;
  else if (safetyRatio < 0.5) score += 40;
  else if (safetyRatio < 1) score += 20;
  
  if (stockDays < sku.leadTime) score += 30;
  else if (stockDays < sku.leadTime + 3) score += 15;
  
  score += suggestedQty * 0.01;
  
  return Math.round(score);
}

export function calculateReplenishment(
  sku: SKU,
  supplier?: Supplier | null
): ReplenishmentSuggestion | null {
  if (!sku) return null;

  const { currentStock, safetyStock, avgDailyConsumption, leadTime, unitCost } = sku;
  
  const targetStock = safetyStock + (avgDailyConsumption * (leadTime + 7));
  const suggestedQuantity = Math.max(0, Math.ceil(targetStock - currentStock));
  
  if (suggestedQuantity <= 0) return null;
  
  const priority = calculatePriority(sku, suggestedQuantity);
  
  return {
    id: `REP-${sku.id}`,
    skuId: sku.id,
    skuCode: sku.skuCode,
    skuName: sku.name,
    suggestedQuantity,
    expectedDate: addDays(new Date(), leadTime).toISOString().split('T')[0],
    estimatedCost: suggestedQuantity * unitCost,
    priority,
    supplierId: supplier?.id || '',
    supplierName: supplier?.name || '待分配',
    currentStock,
    safetyStock,
    status: 'pending',
  };
}

export function batchCalculateReplenishment(
  skus: SKU[],
  suppliers: Supplier[]
): ReplenishmentSuggestion[] {
  return skus
    .map(sku => {
      const supplier = suppliers.find(s => s.id === sku.supplierId);
      return calculateReplenishment(sku, supplier);
    })
    .filter((s): s is ReplenishmentSuggestion => s !== null)
    .sort((a, b) => b.priority - a.priority);
}

export function findAlternativeSuppliers(
  sku: SKU,
  suppliers: Supplier[],
  limit: number = 3
): Supplier[] {
  return suppliers
    .filter(s => 
      s.status === 'active' && 
      s.categories.some(cat => sku.category.includes(cat) || cat.includes(sku.category))
    )
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.onTimeRate !== a.onTimeRate) return b.onTimeRate - a.onTimeRate;
      return a.avgDeliveryTime - b.avgDeliveryTime;
    })
    .slice(0, limit);
}

export function calculateTotalEstimatedCost(suggestions: ReplenishmentSuggestion[]): number {
  return suggestions.reduce((sum, s) => sum + s.estimatedCost, 0);
}

export function getPriorityLabel(priority: number): string {
  if (priority >= 80) return '极紧急';
  if (priority >= 60) return '紧急';
  if (priority >= 40) return '高';
  if (priority >= 20) return '中';
  return '普通';
}

export function getPriorityColor(priority: number): string {
  if (priority >= 80) return '#EF4444';
  if (priority >= 60) return '#F97316';
  if (priority >= 40) return '#F59E0B';
  if (priority >= 20) return '#EAB308';
  return '#10B981';
}
