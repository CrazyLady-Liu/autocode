import React from 'react';
import { Phone, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Supplier } from '../../data/types';
import { getSupplierStatusColor, getSupplierStatusText } from '../../utils/riskCalculator';

interface SupplierPanelProps {
  suppliers: Supplier[];
}

export const SupplierPanel: React.FC<SupplierPanelProps> = ({ suppliers }) => {
  const activeSuppliers = suppliers.filter(s => s.status === 'active');
  const avgOnTimeRate = Math.round(
    activeSuppliers.reduce((sum, s) => sum + s.onTimeRate, 0) / (activeSuppliers.length || 1)
  );

  return (
    <Card hover={false}>
      <CardHeader 
        title="供应商协同" 
        subtitle={`${activeSuppliers.length}/${suppliers.length} 家活跃供应商`}
      />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{avgOnTimeRate}%</p>
          <p className="text-xs text-gray-500">平均准时交付率</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {Math.round(suppliers.reduce((sum, s) => sum + s.averageDeliveryTime, 0) / suppliers.length)}天
          </p>
          <p className="text-xs text-gray-500">平均交付周期</p>
        </div>
      </div>

      <div className="space-y-3 max-h-56 overflow-y-auto">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm">{supplier.name}</h4>
                  <p className="text-xs text-gray-500">
                    联系人: {supplier.contactPerson}
                  </p>
                </div>
              </div>
              <Badge 
                variant={supplier.status === 'active' ? 'success' : supplier.status === 'delayed' ? 'warning' : 'default'}
              >
                {getSupplierStatusText(supplier.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center text-gray-600">
                <Clock className="w-3 h-3 mr-1 text-blue-500" />
                交付周期: <span className="font-medium ml-1">{supplier.averageDeliveryTime}天</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CheckCircle className="w-3 h-3 mr-1 text-emerald-500" />
                准时率: <span className="font-medium ml-1">{supplier.onTimeRate}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {supplier.supportedCategories.slice(0, 2).map((cat) => (
                  <span key={cat} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {cat}
                  </span>
                ))}
                {supplier.supportedCategories.length > 2 && (
                  <span className="text-xs text-gray-400">+{supplier.supportedCategories.length - 2}</span>
                )}
              </div>
              <button className="flex items-center text-xs text-blue-600 hover:text-blue-700">
                <Phone className="w-3 h-3 mr-1" />
                联系
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SupplierPanel;
