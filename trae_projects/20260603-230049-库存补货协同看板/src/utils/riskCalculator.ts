import type { SKU, RiskAssessment, RiskLevel, RiskReason } from '@/types';

export function calculateRiskLevel(sku: SKU): RiskAssessment {
  const stockDays = sku.avgDailyConsumption > 0 
    ? sku.currentStock / sku.avgDailyConsumption 
    : 999;
  const safetyRatio = sku.safetyStock > 0 
    ? sku.currentStock / sku.safetyStock 
    : 999;

  if (sku.currentStock === 0) {
    return {
      level: 'critical',
      reason: 'STOCK_ZERO',
      stockDays: 0,
      safetyRatio: 0,
    };
  }

  if (!sku.supplierId) {
    return {
      level: 'critical',
      reason: 'NO_SUPPLIER',
      stockDays,
      safetyRatio,
    };
  }

  if (safetyRatio < 0.3) {
    return {
      level: 'high',
      reason: 'EXTREMELY_LOW',
      stockDays,
      safetyRatio,
    };
  }

  if (safetyRatio < 1) {
    return {
      level: 'high',
      reason: 'BELOW_SAFETY',
      stockDays,
      safetyRatio,
    };
  }

  if (stockDays < sku.leadTime) {
    return {
      level: 'medium',
      reason: 'LEAD_TIME_RISK',
      stockDays,
      safetyRatio,
    };
  }

  if (stockDays < sku.leadTime + 3) {
    return {
      level: 'medium',
      reason: 'BUFFER_RISK',
      stockDays,
      safetyRatio,
    };
  }

  return {
    level: 'low',
    reason: 'NORMAL',
    stockDays,
    safetyRatio,
  };
}

export function getRiskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    critical: '#EF4444',
    high: '#F59E0B',
    medium: '#EAB308',
    low: '#10B981',
  };
  return colors[level];
}

export function getRiskLevelBgColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    critical: 'bg-red-500/10',
    high: 'bg-amber-500/10',
    medium: 'bg-yellow-500/10',
    low: 'bg-emerald-500/10',
  };
  return colors[level];
}

export function getRiskLevelBorderColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    critical: 'border-red-500/30',
    high: 'border-amber-500/30',
    medium: 'border-yellow-500/30',
    low: 'border-emerald-500/30',
  };
  return colors[level];
}

export function getRiskReasonText(reason: RiskReason): string {
  const texts: Record<RiskReason, string> = {
    STOCK_ZERO: '库存为零',
    NO_SUPPLIER: '供应商缺失',
    EXTREMELY_LOW: '库存极低',
    BELOW_SAFETY: '低于安全库存',
    LEAD_TIME_RISK: '提前期风险',
    BUFFER_RISK: '缓冲期风险',
    NORMAL: '正常',
  };
  return texts[reason];
}

export function getRiskLevelText(level: RiskLevel): string {
  const texts: Record<RiskLevel, string> = {
    critical: '紧急',
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  };
  return texts[level];
}

export function aggregateAlertsByLevel(alerts: { level: RiskLevel }[]): Record<RiskLevel, number> {
  return alerts.reduce((acc, alert) => {
    acc[alert.level] = (acc[alert.level] || 0) + 1;
    return acc;
  }, {} as Record<RiskLevel, number>);
}

export function reduceAlertNoise(
  alerts: { level: RiskLevel; skuId: string; type: string }[],
  threshold: number = 10
) {
  if (alerts.length <= threshold) {
    return { alerts, suppressed: 0, aggregated: [] };
  }

  const critical = alerts.filter(a => a.level === 'critical');
  const high = alerts.filter(a => a.level === 'high');
  const medium = alerts.filter(a => a.level === 'medium');
  const low = alerts.filter(a => a.level === 'low');

  const visible = [...critical];
  
  let remainingSlots = threshold - critical.length;
  const suppressedCount = Math.max(0, high.length + medium.length + low.length - remainingSlots);
  
  visible.push(...high.slice(0, remainingSlots));
  remainingSlots -= high.length;
  if (remainingSlots > 0) {
    visible.push(...medium.slice(0, remainingSlots));
  }

  const aggregated = [
    { level: 'high' as RiskLevel, count: high.length, type: 'high_risk_group' },
    { level: 'medium' as RiskLevel, count: medium.length, type: 'medium_risk_group' },
    { level: 'low' as RiskLevel, count: low.length, type: 'low_risk_group' },
  ].filter(g => g.count > 0);

  return {
    alerts: visible,
    suppressed: suppressedCount,
    aggregated,
  };
}
