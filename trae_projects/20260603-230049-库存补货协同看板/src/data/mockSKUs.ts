import type { SKU, InventoryLog, TrendDataPoint } from '@/types';

export const mockSKUs: SKU[] = [
  {
    id: 'SKU-001',
    skuCode: 'ELC-001-A',
    name: '智能控制器 Pro',
    category: '电子产品',
    currentStock: 0,
    safetyStock: 100,
    avgDailyConsumption: 25,
    leadTime: 7,
    warehouseId: 'WH-001',
    supplierId: 'SUP-001',
    unitCost: 128.5,
    lastRestockDate: '2026-05-15',
  },
  {
    id: 'SKU-002',
    skuCode: 'ELC-002-B',
    name: '蓝牙模块 V2.0',
    category: '电子产品',
    currentStock: 0,
    safetyStock: 200,
    avgDailyConsumption: 45,
    leadTime: 10,
    warehouseId: 'WH-004',
    supplierId: null,
    unitCost: 38.0,
    lastRestockDate: '2026-05-10',
  },
  {
    id: 'SKU-003',
    skuCode: 'ELC-003-C',
    name: '电源适配器 65W',
    category: '电子产品',
    currentStock: 20,
    safetyStock: 150,
    avgDailyConsumption: 30,
    leadTime: 5,
    warehouseId: 'WH-002',
    supplierId: 'SUP-001',
    unitCost: 45.0,
    lastRestockDate: '2026-05-20',
  },
  {
    id: 'SKU-004',
    skuCode: 'PLS-001-A',
    name: '环保包装盒 L',
    category: '包装材料',
    currentStock: 80,
    safetyStock: 300,
    avgDailyConsumption: 50,
    leadTime: 7,
    warehouseId: 'WH-001',
    supplierId: 'SUP-002',
    unitCost: 2.5,
    lastRestockDate: '2026-05-18',
  },
  {
    id: 'SKU-005',
    skuCode: 'PLS-002-B',
    name: '缓冲气泡膜',
    category: '包装材料',
    currentStock: 450,
    safetyStock: 500,
    avgDailyConsumption: 80,
    leadTime: 3,
    warehouseId: 'WH-003',
    supplierId: 'SUP-004',
    unitCost: 1.2,
    lastRestockDate: '2026-05-25',
  },
  {
    id: 'SKU-006',
    skuCode: 'MET-001-A',
    name: '不锈钢螺丝 M6',
    category: '五金配件',
    currentStock: 2500,
    safetyStock: 1000,
    avgDailyConsumption: 200,
    leadTime: 10,
    warehouseId: 'WH-002',
    supplierId: 'SUP-003',
    unitCost: 0.15,
    lastRestockDate: '2026-05-22',
  },
  {
    id: 'SKU-007',
    skuCode: 'MET-002-B',
    name: '铝合金支架',
    category: '五金配件',
    currentStock: 180,
    safetyStock: 200,
    avgDailyConsumption: 25,
    leadTime: 12,
    warehouseId: 'WH-004',
    supplierId: null,
    unitCost: 18.0,
    lastRestockDate: '2026-05-08',
  },
  {
    id: 'SKU-008',
    skuCode: 'INS-001-A',
    name: '数字温度计',
    category: '精密仪器',
    currentStock: 8,
    safetyStock: 50,
    avgDailyConsumption: 5,
    leadTime: 15,
    warehouseId: 'WH-005',
    supplierId: 'SUP-005',
    unitCost: 268.0,
    lastRestockDate: '2026-04-28',
  },
  {
    id: 'SKU-009',
    skuCode: 'TXT-001-A',
    name: '纯棉防尘罩',
    category: '纺织品',
    currentStock: 1200,
    safetyStock: 800,
    avgDailyConsumption: 60,
    leadTime: 12,
    warehouseId: 'WH-006',
    supplierId: 'SUP-007',
    unitCost: 8.5,
    lastRestockDate: '2026-05-20',
  },
  {
    id: 'SKU-010',
    skuCode: 'FOOD-001-A',
    name: '食品级干燥剂',
    category: '食品原料',
    currentStock: 0,
    safetyStock: 500,
    avgDailyConsumption: 100,
    leadTime: 4,
    warehouseId: 'WH-003',
    supplierId: 'SUP-008',
    unitCost: 0.25,
    lastRestockDate: '2026-05-28',
  },
  {
    id: 'SKU-011',
    skuCode: 'ELC-004-D',
    name: 'USB-C 数据线',
    category: '电子产品',
    currentStock: 580,
    safetyStock: 400,
    avgDailyConsumption: 70,
    leadTime: 5,
    warehouseId: 'WH-001',
    supplierId: 'SUP-001',
    unitCost: 12.0,
    lastRestockDate: '2026-05-26',
  },
  {
    id: 'SKU-012',
    skuCode: 'PLS-003-C',
    name: '封箱胶带 透明',
    category: '包装材料',
    currentStock: 320,
    safetyStock: 200,
    avgDailyConsumption: 40,
    leadTime: 3,
    warehouseId: 'WH-002',
    supplierId: 'SUP-004',
    unitCost: 3.5,
    lastRestockDate: '2026-05-28',
  },
  {
    id: 'SKU-013',
    skuCode: 'MET-003-C',
    name: '镀锌钢板 1mm',
    category: '金属制品',
    currentStock: 45,
    safetyStock: 80,
    avgDailyConsumption: 8,
    leadTime: 10,
    warehouseId: 'WH-004',
    supplierId: 'SUP-003',
    unitCost: 85.0,
    lastRestockDate: '2026-05-15',
  },
  {
    id: 'SKU-014',
    skuCode: 'INS-002-B',
    name: '电子秤 精密型',
    category: '精密仪器',
    currentStock: 35,
    safetyStock: 20,
    avgDailyConsumption: 2,
    leadTime: 15,
    warehouseId: 'WH-005',
    supplierId: 'SUP-005',
    unitCost: 580.0,
    lastRestockDate: '2026-05-10',
  },
  {
    id: 'SKU-015',
    skuCode: 'TXT-002-B',
    name: '无纺布收纳袋',
    category: '纺织品',
    currentStock: 950,
    safetyStock: 600,
    avgDailyConsumption: 45,
    leadTime: 12,
    warehouseId: 'WH-006',
    supplierId: 'SUP-007',
    unitCost: 5.8,
    lastRestockDate: '2026-05-22',
  },
  {
    id: 'SKU-016',
    skuCode: 'FOOD-002-B',
    name: '食品级保鲜剂',
    category: '食品原料',
    currentStock: 2800,
    safetyStock: 1500,
    avgDailyConsumption: 120,
    leadTime: 4,
    warehouseId: 'WH-003',
    supplierId: 'SUP-008',
    unitCost: 0.18,
    lastRestockDate: '2026-05-25',
  },
  {
    id: 'SKU-017',
    skuCode: 'ELC-005-E',
    name: '无线充电模块',
    category: '电子产品',
    currentStock: 120,
    safetyStock: 180,
    avgDailyConsumption: 20,
    leadTime: 7,
    warehouseId: 'WH-001',
    supplierId: 'SUP-001',
    unitCost: 42.0,
    lastRestockDate: '2026-05-20',
  },
  {
    id: 'SKU-018',
    skuCode: 'PLS-004-D',
    name: '快递防水袋',
    category: '包装材料',
    currentStock: 2500,
    safetyStock: 2000,
    avgDailyConsumption: 150,
    leadTime: 3,
    warehouseId: 'WH-004',
    supplierId: 'SUP-004',
    unitCost: 0.85,
    lastRestockDate: '2026-05-28',
  },
];

export const generateTrendData = (skuId: string, days: number = 30): TrendDataPoint[] => {
  const data: TrendDataPoint[] = [];
  const today = new Date();
  const baseValues: Record<string, { stock: number; consumption: number }> = {
    'SKU-001': { stock: 150, consumption: 25 },
    'SKU-002': { stock: 300, consumption: 45 },
    'SKU-003': { stock: 200, consumption: 30 },
    'SKU-004': { stock: 400, consumption: 50 },
    'SKU-005': { stock: 600, consumption: 80 },
    'SKU-006': { stock: 3000, consumption: 200 },
    'SKU-007': { stock: 300, consumption: 25 },
    'SKU-008': { stock: 80, consumption: 5 },
    'SKU-009': { stock: 1500, consumption: 60 },
    'SKU-010': { stock: 800, consumption: 100 },
  };

  const base = baseValues[skuId] || { stock: 500, consumption: 30 };
  let currentStock = base.stock;

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const consumption = Math.round(base.consumption * (0.8 + Math.random() * 0.4));
    currentStock = Math.max(0, currentStock - consumption);

    if (i === days) {
      data.push({ date: dateStr, stock: currentStock, consumption });
    } else if (i <= 7) {
      const forecast = Math.max(0, currentStock - base.consumption * (days - i));
      data.push({ date: dateStr, stock: currentStock, consumption, forecast });
    } else {
      data.push({ date: dateStr, stock: currentStock, consumption });
    }
  }

  return data;
};

export const generateInventoryLogs = (skuId: string, count: number = 20): InventoryLog[] => {
  const logs: InventoryLog[] = [];
  const now = Date.now();
  const reasons = ['销售出库', '补货入库', '调拨出库', '调拨入库', '盘点调整', '退货入库'];
  let balance = 500;

  for (let i = count - 1; i >= 0; i--) {
    const isInbound = Math.random() > 0.6;
    const change = isInbound 
      ? Math.round(50 + Math.random() * 200)
      : -Math.round(10 + Math.random() * 80);
    balance = Math.max(0, balance + change);

    logs.push({
      id: `LOG-${skuId}-${i}`,
      skuId,
      stockChange: change,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      timestamp: new Date(now - i * 3600000 * 6).toISOString(),
      balance,
    });
  }

  return logs;
};
