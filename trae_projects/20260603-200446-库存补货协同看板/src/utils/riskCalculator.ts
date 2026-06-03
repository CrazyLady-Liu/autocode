import { Sku, Supplier, ProcessingResult, RiskLevel, SimulationConfig } from '../data/types';
import { suppliers } from '../data/mockData';

export const calculateRiskLevel = (
  sku: Sku,
  config: SimulationConfig = {
    safetyStockThreshold: 50,
    highRiskDays: 3,
    mediumRiskDays: 7,
    maxAlerts: 10,
  }
): RiskLevel => {
  if (sku.currentStock === 0) {
    return 'high';
  }
  
  const daysToOut = sku.currentStock / sku.avgDailyConsumption;
  const safetyStockRatio = sku.currentStock / sku.safetyStock;
  
  if (daysToOut <= config.highRiskDays || safetyStockRatio < 0.5) {
    return 'high';
  } else if (daysToOut <= config.mediumRiskDays || safetyStockRatio < 1) {
    return 'medium';
  } else {
    return 'low';
  }
};

export const handleZeroStock = (sku: Sku): ProcessingResult => {
  const categorySuppliers = suppliers.filter(s => 
    s.status === 'active' && s.supportedCategories.includes(sku.category)
  );
  
  return {
    level: 'critical',
    actions: [
      '立即触发紧急补货流程',
      '自动通知采购专员和仓库主管',
      '系统推荐替代SKU供选择',
      '检查其他仓库库存进行调货',
      '临时调高该商品安全库存阈值',
    ],
    suggestedSupplier: categorySuppliers[0],
    alternativeSuppliers: categorySuppliers.slice(0, 3),
  };
};

export const handleMissingSupplier = (sku: Sku): ProcessingResult => {
  const matchingSuppliers = suppliers.filter(s => 
    s.status === 'active' && s.supportedCategories.includes(sku.category)
  );
  
  return {
    level: 'warning',
    actions: [
      '标记该SKU供应商待分配状态',
      '推荐历史合作供应商列表',
      '自动触发采购寻源流程',
      '建议设置临时备用供应商',
    ],
    alternativeSuppliers: matchingSuppliers.slice(0, 3),
  };
};

export const handleTooManyAlerts = (alerts: Sku[], maxAlerts: number = 10): ProcessingResult => {
  const priorityMap: Record<string, number> = { high: 0, medium: 1, low: 2 };
  
  const prioritized = [...alerts].sort((a, b) => {
    const riskDiff = priorityMap[a.riskLevel] - priorityMap[b.riskLevel];
    if (riskDiff !== 0) return riskDiff;
    return a.expectedDaysToOut - b.expectedDaysToOut;
  });
  
  return {
    level: 'info',
    actions: [
      `检测到 ${alerts.length} 个预警，超过阈值 ${maxAlerts}`,
      '按风险优先级批量处理前10项',
      '建议设置自动补货规则减少人工干预',
      '分析高频预警SKU，优化安全库存配置',
      '考虑与核心供应商签订VMI协议',
    ],
    batchProcessList: prioritized.slice(0, maxAlerts),
  };
};

export const getSupplierById = (supplierId: string | null): Supplier | undefined => {
  if (!supplierId) return undefined;
  return suppliers.find(s => s.id === supplierId);
};

export const getRiskColor = (riskLevel: RiskLevel): string => {
  const colors = {
    high: '#E94560',
    medium: '#FF9F1C',
    low: '#2EC4B6',
  };
  return colors[riskLevel];
};

export const getRiskText = (riskLevel: RiskLevel): string => {
  const texts = {
    high: '高风险',
    medium: '中风险',
    low: '低风险',
  };
  return texts[riskLevel];
};

export const getSupplierStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: '#2EC4B6',
    inactive: '#6B7280',
    delayed: '#FF9F1C',
  };
  return colors[status] || '#6B7280';
};

export const getSupplierStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    active: '正常合作',
    inactive: '暂停合作',
    delayed: '交付延迟',
  };
  return texts[status] || '未知';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    urgent: '#E94560',
    high: '#FF9F1C',
    medium: '#165DFF',
    low: '#2EC4B6',
  };
  return colors[priority] || '#6B7280';
};

export const getPriorityText = (priority: string): string => {
  const texts: Record<string, string> = {
    urgent: '紧急',
    high: '高',
    medium: '中',
    low: '低',
  };
  return texts[priority] || '未知';
};
