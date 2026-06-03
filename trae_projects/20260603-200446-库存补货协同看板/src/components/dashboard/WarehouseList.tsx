import React from 'react';
import { MapPin, Package, AlertTriangle, Truck } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Warehouse } from '../../data/types';

interface WarehouseListProps {
  warehouses: Warehouse[];
  selectedId?: string;
  onSelect: (warehouse: Warehouse) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical':
      return 'danger';
    case 'warning':
      return 'warning';
    default:
      return 'success';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'critical':
      return '异常';
    case 'warning':
      return '警告';
    default:
      return '正常';
  }
};

export const WarehouseList: React.FC<WarehouseListProps> = ({
  warehouses,
  selectedId,
  onSelect,
}) => {
  return (
    <Card hover={false}>
      <CardHeader title="仓库列表" subtitle="点击切换查看详情" />
      
      <div className="space-y-3">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            onClick={() => onSelect(warehouse)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedId === warehouse.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{warehouse.name}</h4>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {warehouse.location}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusColor(warehouse.status) as any}>
                {getStatusText(warehouse.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded">
                <Package className="w-4 h-4 mx-auto text-gray-500 mb-1" />
                <p className="text-lg font-bold text-gray-800">{warehouse.totalSkus}</p>
                <p className="text-xs text-gray-500">SKU总数</p>
              </div>
              <div className="text-center p-2 bg-red-50 rounded">
                <AlertTriangle className="w-4 h-4 mx-auto text-red-500 mb-1" />
                <p className="text-lg font-bold text-red-600">{warehouse.outOfStock}</p>
                <p className="text-xs text-gray-500">缺货</p>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded">
                <Truck className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                <p className="text-lg font-bold text-blue-600">{warehouse.inTransit}</p>
                <p className="text-xs text-gray-500">在途</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">健康度评分</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      warehouse.healthScore >= 80
                        ? 'bg-emerald-500'
                        : warehouse.healthScore >= 60
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${warehouse.healthScore}%` }}
                  />
                </div>
                <span className={`text-sm font-bold ${
                  warehouse.healthScore >= 80
                    ? 'text-emerald-600'
                    : warehouse.healthScore >= 60
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}>
                  {warehouse.healthScore}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WarehouseList;
