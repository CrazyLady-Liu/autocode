import { create } from 'zustand';
import type { 
  Warehouse, 
  SKU, 
  SKUWithRisk, 
  RiskAlert, 
  ReplenishmentSuggestion,
  KPIData 
} from '@/types';
import { mockWarehouses } from '@/data/mockWarehouses';
import { mockSKUs } from '@/data/mockSKUs';
import { mockSuppliers } from '@/data/mockSuppliers';
import { mockRiskAlerts, mockReplenishmentSuggestions } from '@/data/mockOrders';
import { calculateRiskLevel } from '@/utils/riskCalculator';
import { batchCalculateReplenishment } from '@/utils/replenishmentEngine';

interface InventoryState {
  warehouses: Warehouse[];
  skus: SKU[];
  skusWithRisk: SKUWithRisk[];
  alerts: RiskAlert[];
  suggestions: ReplenishmentSuggestion[];
  selectedSKUId: string | null;
  selectedWarehouseId: string | null;
  filterRiskLevel: string;
  linkedSkuId: string | null;
  isLoading: boolean;
  lastUpdate: string;
  
  loadData: () => void;
  setSelectedSKU: (id: string | null) => void;
  setSelectedWarehouse: (id: string | null) => void;
  setFilterRiskLevel: (level: string) => void;
  setLinkedSkuId: (id: string | null) => void;
  clearLinkedSkuId: () => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  approveSuggestion: (suggestionId: string) => void;
  orderSuggestion: (suggestionId: string) => void;
  getKPIs: () => KPIData[];
  getFilteredSKUs: () => SKUWithRisk[];
  getSKUById: (id: string) => SKUWithRisk | undefined;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  warehouses: [],
  skus: [],
  skusWithRisk: [],
  alerts: [],
  suggestions: [],
  selectedSKUId: null,
  selectedWarehouseId: null,
  filterRiskLevel: 'all',
  linkedSkuId: null,
  isLoading: true,
  lastUpdate: '',

  loadData: () => {
    set({ isLoading: true });
    
    setTimeout(() => {
      const skusWithRisk: SKUWithRisk[] = mockSKUs.map(sku => {
        const risk = calculateRiskLevel(sku);
        const supplier = sku.supplierId 
          ? mockSuppliers.find(s => s.id === sku.supplierId) 
          : null;
        return { ...sku, risk, supplier };
      });

      const suggestions = batchCalculateReplenishment(mockSKUs, mockSuppliers);

      set({
        warehouses: mockWarehouses,
        skus: mockSKUs,
        skusWithRisk,
        alerts: mockRiskAlerts,
        suggestions: suggestions.length > 0 ? suggestions : mockReplenishmentSuggestions,
        isLoading: false,
        lastUpdate: new Date().toISOString(),
      });
    }, 500);
  },

  setSelectedSKU: (id) => set({ selectedSKUId: id }),
  setSelectedWarehouse: (id) => set({ selectedWarehouseId: id }),
  setFilterRiskLevel: (level) => set({ filterRiskLevel: level }),
  setLinkedSkuId: (id) => set({ linkedSkuId: id }),
  clearLinkedSkuId: () => set({ linkedSkuId: null }),

  acknowledgeAlert: (alertId) => {
    set(state => ({
      alerts: state.alerts.map(a => 
        a.id === alertId ? { ...a, status: 'acknowledged' } : a
      ),
    }));
  },

  resolveAlert: (alertId) => {
    set(state => ({
      alerts: state.alerts.map(a => 
        a.id === alertId ? { ...a, status: 'resolved' } : a
      ),
    }));
  },

  approveSuggestion: (suggestionId) => {
    set(state => ({
      suggestions: state.suggestions.map(s => 
        s.id === suggestionId ? { ...s, status: 'approved' } : s
      ),
    }));
  },

  orderSuggestion: (suggestionId) => {
    set(state => ({
      suggestions: state.suggestions.map(s => 
        s.id === suggestionId ? { ...s, status: 'ordered' } : s
      ),
    }));
  },

  getKPIs: () => {
    const state = get();
    const totalValue = state.skus.reduce((sum, sku) => sum + sku.currentStock * sku.unitCost, 0);
    const outOfStock = state.skusWithRisk.filter(s => s.risk.reason === 'STOCK_ZERO').length;
    const noSupplier = state.skusWithRisk.filter(s => s.risk.reason === 'NO_SUPPLIER').length;
    const pendingOrders = state.suggestions.filter(s => s.status === 'pending' || s.status === 'approved').length;
    const newAlerts = state.alerts.filter(a => a.status === 'new').length;
    const totalSKUs = state.skus.length;
    const healthScore = Math.round(
      (state.skusWithRisk.filter(s => s.risk.level === 'low').length / totalSKUs) * 100
    );

    return [
      {
        label: '库存总价值',
        value: `¥${(totalValue / 10000).toFixed(1)}万`,
        change: 3.2,
        trend: 'up' as const,
        icon: 'DollarSign',
        color: '#3B82F6',
      },
      {
        label: '断货 SKU',
        value: outOfStock,
        change: outOfStock,
        trend: 'up' as const,
        icon: 'AlertTriangle',
        color: '#EF4444',
      },
      {
        label: '无供应商 SKU',
        value: noSupplier,
        change: noSupplier,
        trend: 'up' as const,
        icon: 'UserX',
        color: '#F97316',
      },
      {
        label: '待处理订单',
        value: pendingOrders,
        change: -2,
        trend: 'down' as const,
        icon: 'ShoppingCart',
        color: '#8B5CF6',
      },
      {
        label: '新告警',
        value: newAlerts,
        change: newAlerts,
        trend: 'up' as const,
        icon: 'Bell',
        color: '#F59E0B',
      },
      {
        label: '库存健康度',
        value: `${healthScore}%`,
        change: -2.1,
        trend: 'down' as const,
        icon: 'Heart',
        color: '#10B981',
      },
    ];
  },

  getFilteredSKUs: () => {
    const state = get();
    if (state.filterRiskLevel === 'all') {
      return state.skusWithRisk;
    }
    return state.skusWithRisk.filter(s => s.risk.level === state.filterRiskLevel);
  },

  getSKUById: (id) => {
    return get().skusWithRisk.find(s => s.id === id);
  },
}));
