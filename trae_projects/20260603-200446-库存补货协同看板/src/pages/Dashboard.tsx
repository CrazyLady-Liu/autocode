import React, { useState } from 'react';
import { Package, AlertTriangle, Truck, Activity } from 'lucide-react';
import { KPICard } from '../components/dashboard/KPICard';
import { WarehouseList } from '../components/dashboard/WarehouseList';
import { SkuRiskPanel } from '../components/dashboard/SkuRiskPanel';
import { RestockSuggestions } from '../components/dashboard/RestockSuggestions';
import { SupplierPanel } from '../components/dashboard/SupplierPanel';
import { TrendChart } from '../components/dashboard/TrendChart';
import { warehouses, skus, suppliers, restockSuggestions, stockTrendData } from '../data/mockData';
import { Warehouse, Sku, RestockSuggestion as RestockSuggestionType } from '../data/types';

export const Dashboard: React.FC = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse>(warehouses[0]);

  const totalSkus = warehouses.reduce((sum, w) => sum + w.totalSkus, 0);
  const totalOutOfStock = warehouses.reduce((sum, w) => sum + w.outOfStock, 0);
  const totalInTransit = warehouses.reduce((sum, w) => sum + w.inTransit, 0);
  const avgHealthScore = Math.round(
    warehouses.reduce((sum, w) => sum + w.healthScore, 0) / warehouses.length
  );

  const handleRestock = (sku: Sku) => {
    alert(`已为 ${sku.name} 发起补货请求`);
  };

  const handleApproveRestock = (suggestion: RestockSuggestionType) => {
    alert(`已确认补货: ${suggestion.skuName} - ${suggestion.suggestedQuantity}件`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <KPICard
          title="SKU 总数"
          value={totalSkus.toLocaleString()}
          icon={Package}
          trend={5.2}
          trendLabel="较上周"
          color="blue"
        />
        <KPICard
          title="缺货数量"
          value={totalOutOfStock}
          icon={AlertTriangle}
          trend={-12.5}
          trendLabel="较上周"
          color="red"
        />
        <KPICard
          title="在途数量"
          value={totalInTransit}
          icon={Truck}
          trend={8.3}
          trendLabel="较上周"
          color="amber"
        />
        <KPICard
          title="平均健康度"
          value={`${avgHealthScore}%`}
          icon={Activity}
          trend={2.1}
          trendLabel="较上周"
          color="green"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <WarehouseList
            warehouses={warehouses}
            selectedId={selectedWarehouse.id}
            onSelect={setSelectedWarehouse}
          />
        </div>
        <div className="col-span-2">
          <SkuRiskPanel
            skus={skus}
            suppliers={suppliers}
            onRestock={handleRestock}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RestockSuggestions
            suggestions={restockSuggestions}
            onApprove={handleApproveRestock}
          />
        </div>
        <div className="col-span-1">
          <SupplierPanel suppliers={suppliers} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TrendChart data={stockTrendData} />
      </div>
    </div>
  );
};

export default Dashboard;
