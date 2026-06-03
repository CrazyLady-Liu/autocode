import type { 
  SimulationParams, 
  SimulationResult, 
  SKU, 
  Supplier,
  RiskLevel 
} from '@/types';
import { calculateRiskLevel } from './riskCalculator';

export const defaultSimulationParams: SimulationParams = {
  safetyStockCoefficient: 1.5,
  warningThreshold: 0.8,
  leadTimeAdjustment: 0,
  demandFluctuation: 0,
  alertNoiseThreshold: 10,
};

export type SimulationScenario = 
  | 'baseline'
  | 'stock_zero'
  | 'supplier_outage'
  | 'demand_surge'
  | 'lead_time_delay'
  | 'multi_factor';

export const scenarioConfigs: Record<SimulationScenario, {
  name: string;
  description: string;
  params: Partial<SimulationParams>;
  skuModifier?: (sku: SKU) => SKU;
  supplierModifier?: (supplier: Supplier) => Supplier;
}> = {
  baseline: {
    name: '基准场景',
    description: '当前正常运营状态，无特殊调整',
    params: {},
  },
  stock_zero: {
    name: '库存归零',
    description: '模拟多个核心 SKU 库存同时归零的紧急场景',
    params: { safetyStockCoefficient: 2.0 },
    skuModifier: (sku) => {
      if (['SKU-001', 'SKU-002', 'SKU-010', 'SKU-003'].includes(sku.id)) {
        return { ...sku, currentStock: 0 };
      }
      return sku;
    },
  },
  supplier_outage: {
    name: '供应商断供',
    description: '模拟主要供应商临时断供，需要寻找替代渠道',
    params: { warningThreshold: 0.6 },
    supplierModifier: (supplier) => {
      if (supplier.id === 'SUP-001') {
        return { ...supplier, status: 'inactive' as const };
      }
      return supplier;
    },
    skuModifier: (sku) => {
      if (sku.supplierId === 'SUP-001') {
        return { ...sku, supplierId: null };
      }
      return sku;
    },
  },
  demand_surge: {
    name: '需求突增',
    description: '模拟市场需求突增 50%，测试库存承受能力',
    params: { demandFluctuation: 50, safetyStockCoefficient: 2.0 },
    skuModifier: (sku) => ({
      ...sku,
      avgDailyConsumption: Math.round(sku.avgDailyConsumption * 1.5),
    }),
  },
  lead_time_delay: {
    name: '交货延迟',
    description: '模拟所有供应商交货期延长 50%',
    params: { leadTimeAdjustment: 50, warningThreshold: 0.7 },
    skuModifier: (sku) => ({
      ...sku,
      leadTime: Math.round(sku.leadTime * 1.5),
    }),
  },
  multi_factor: {
    name: '综合压力测试',
    description: '需求突增+交货延迟+部分供应商断供的综合极端场景',
    params: {
      safetyStockCoefficient: 2.5,
      warningThreshold: 0.5,
      leadTimeAdjustment: 30,
      demandFluctuation: 30,
    },
    skuModifier: (sku) => {
      let modified = {
        ...sku,
        avgDailyConsumption: Math.round(sku.avgDailyConsumption * 1.3),
        leadTime: Math.round(sku.leadTime * 1.3),
      };
      if (['SKU-001', 'SKU-003', 'SKU-008'].includes(sku.id)) {
        modified.currentStock = Math.max(0, Math.floor(sku.currentStock * 0.2));
      }
      if (sku.supplierId === 'SUP-003') {
        modified.supplierId = null;
      }
      return modified;
    },
  },
};

export function runSimulation(
  scenario: SimulationScenario,
  skus: SKU[],
  suppliers: Supplier[],
  customParams?: Partial<SimulationParams>
): SimulationResult {
  const config = scenarioConfigs[scenario];
  const params: SimulationParams = {
    ...defaultSimulationParams,
    ...config.params,
    ...customParams,
  };

  let modifiedSkus = skus.map(sku => 
    config.skuModifier ? config.skuModifier(sku) : sku
  );
  const modifiedSuppliers = suppliers.map(supplier =>
    config.supplierModifier ? config.supplierModifier(supplier) : supplier
  );

  modifiedSkus = modifiedSkus.map(sku => {
    const adjustedSafetyStock = Math.round(sku.safetyStock * params.safetyStockCoefficient);
    return { ...sku, safetyStock: adjustedSafetyStock };
  });

  const riskAssessments = modifiedSkus.map(sku => ({
    sku,
    risk: calculateRiskLevel(sku),
  }));

  const criticalAlerts = riskAssessments.filter(r => r.risk.level === 'critical').length;
  const highAlerts = riskAssessments.filter(r => r.risk.level === 'high').length;
  const mediumAlerts = riskAssessments.filter(r => r.risk.level === 'medium').length;
  const affectedSKUs = riskAssessments.filter(r => r.risk.level !== 'low').length;

  const totalCost = riskAssessments
    .filter(r => r.risk.level === 'critical' || r.risk.level === 'high')
    .reduce((sum, r) => {
      const shortageQty = Math.max(0, r.sku.safetyStock - r.sku.currentStock);
      return sum + shortageQty * r.sku.unitCost * 1.2;
    }, 0);

  const recommendedActions = generateRecommendations(
    scenario,
    riskAssessments,
    modifiedSuppliers
  );

  const timeline = generateTimeline(scenario, params);

  return {
    scenario: config.name,
    description: config.description,
    affectedSKUs,
    criticalAlerts,
    highAlerts,
    mediumAlerts,
    recommendedActions,
    costImpact: Math.round(totalCost),
    timeline,
  };
}

function generateRecommendations(
  scenario: SimulationScenario,
  riskAssessments: { sku: SKU; risk: { level: RiskLevel; reason: string } }[],
  suppliers: Supplier[]
): string[] {
  const actions: string[] = [];
  const criticalSkus = riskAssessments.filter(r => r.risk.level === 'critical');
  const noSupplierSkus = criticalSkus.filter(r => r.risk.reason === 'NO_SUPPLIER');
  const stockZeroSkus = criticalSkus.filter(r => r.risk.reason === 'STOCK_ZERO');

  if (scenario === 'stock_zero' || stockZeroSkus.length > 0) {
    actions.push(`紧急处理 ${stockZeroSkus.length} 个断货 SKU，启动紧急补货通道`);
    actions.push('协调物流优先配送，必要时使用空运加急');
    actions.push('评估是否启动备选供应商或替代物料方案');
  }

  if (scenario === 'supplier_outage' || noSupplierSkus.length > 0) {
    actions.push(`${noSupplierSkus.length} 个 SKU 缺少供应商，请立即补充供应商信息`);
    
    const availableSuppliers = suppliers.filter(s => s.status === 'active');
    if (availableSuppliers.length > 0) {
      const topSuppliers = availableSuppliers
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      actions.push(`推荐备选供应商: ${topSuppliers.map(s => s.name).join('、')}`);
    }
    
    actions.push('启动供应商开发紧急流程，3个工作日内完成新供应商审核');
  }

  if (scenario === 'demand_surge') {
    actions.push('需求突增预警，建议临时增加安全库存系数至 2.0');
    actions.push('与市场部门确认需求持续性，避免盲目补货造成积压');
    actions.push('协调生产端产能，优先保障高风险 SKU 供应');
  }

  if (scenario === 'lead_time_delay') {
    actions.push('交货延迟预警，建议提前 3-5 天下达采购订单');
    actions.push('评估空运替代方案，平衡时效与成本');
    actions.push('与供应商协商建立安全库存寄售机制');
  }

  if (scenario === 'multi_factor') {
    actions.push('⚠️ 综合风险预警：多因素叠加，建议启动供应链应急响应预案');
    actions.push('成立应急小组，每日召开库存协调会议');
    actions.push('临时放宽采购审批流程，确保补货效率');
    actions.push('与销售端沟通，适当控制促销活动节奏');
  }

  if (criticalSkus.length > 5) {
    actions.push(`高风险 SKU 数量较多（${criticalSkus.length}个），建议按品类分组处理`);
    actions.push('启用预警降噪机制，按优先级分批推送告警');
  }

  if (actions.length === 0) {
    actions.push('当前库存状态健康，建议保持现有补货策略');
    actions.push('持续监控关键指标，预防潜在风险');
  }

  return actions.slice(0, 6);
}

function generateTimeline(scenario: SimulationScenario, params: SimulationParams): string {
  const baseDays = 7;
  const leadTimeImpact = params.leadTimeAdjustment / 100;
  const demandImpact = params.demandFluctuation / 100;
  
  let days = baseDays;
  if (scenario === 'stock_zero') days = 3;
  if (scenario === 'supplier_outage') days = 14;
  if (scenario === 'demand_surge') days = Math.round(10 * (1 + demandImpact));
  if (scenario === 'lead_time_delay') days = Math.round(14 * (1 + leadTimeImpact));
  if (scenario === 'multi_factor') days = 21;

  return `预计恢复周期: ${days} 天`;
}

export const logicFlowSteps = [
  { id: 'detect', label: '异常检测', description: '实时监控库存数据变化' },
  { id: 'stock_check', label: '库存检查', description: '判断库存是否归零', condition: '库存 = 0?' },
  { id: 'supplier_check', label: '供应商检查', description: '检查是否有有效供应商', condition: '供应商缺失?' },
  { id: 'threshold_check', label: '阈值检查', description: '判断预警数量是否超限', condition: '预警 > 阈值?' },
  { id: 'emergency', label: '紧急通道', description: '库存归零处理流程' },
  { id: 'supplier_alert', label: '供应商告警', description: '供应商缺失处理流程' },
  { id: 'noise_reduction', label: '预警降噪', description: '预警过多时的聚合处理' },
  { id: 'normal', label: '正常流程', description: '标准告警处理流程' },
];

export const logicFlowConnections = [
  { from: 'detect', to: 'stock_check' },
  { from: 'stock_check', to: 'emergency', label: '是' },
  { from: 'stock_check', to: 'supplier_check', label: '否' },
  { from: 'supplier_check', to: 'supplier_alert', label: '是' },
  { from: 'supplier_check', to: 'threshold_check', label: '否' },
  { from: 'threshold_check', to: 'noise_reduction', label: '是' },
  { from: 'threshold_check', to: 'normal', label: '否' },
];
