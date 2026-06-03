import React, { useState } from 'react';
import { AlertTriangle, Package, Clock, User, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Sku, Supplier } from '../../data/types';
import { getRiskColor, getRiskText, getSupplierById } from '../../utils/riskCalculator';

interface SkuRiskPanelProps {
  skus: Sku[];
  suppliers: Supplier[];
  onRestock?: (sku: Sku) => void;
}

type TabType = 'all' | 'high' | 'medium' | 'low';

export const SkuRiskPanel: React.FC<SkuRiskPanelProps> = ({ skus, suppliers, onRestock }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [expandedSku, setExpandedSku] = useState<string | null>(null);

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: skus.length },
    { key: 'high', label: '高风险', count: skus.filter(s => s.riskLevel === 'high').length },
    { key: 'medium', label: '中风险', count: skus.filter(s => s.riskLevel === 'medium').length },
    { key: 'low', label: '低风险', count: skus.filter(s => s.riskLevel === 'low').length },
  ];

  const filteredSkus = activeTab === 'all' 
    ? skus 
    : skus.filter(s => s.riskLevel === activeTab);

  const toggleExpand = (skuId: string) => {
    setExpandedSku(expandedSku === skuId ? null : skuId);
  };

  return (
    <Card hover={false} className="col-span-2">
      <CardHeader 
        title="SKU 风险监控" 
        subtitle="实时监控库存风险状态"
        action={
          <Button variant="ghost" size="sm">
            导出报表
          </Button>
        }
      />

      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="max-h-96 overflow-y-auto">
          {filteredSkus.map((sku, index) => {
            const supplier = getSupplierById(sku.supplierId);
            const isExpanded = expandedSku === sku.id;
            const isZeroStock = sku.currentStock === 0;
            const hasNoSupplier = !sku.supplierId;

            return (
              <div
                key={sku.id}
                className={`border-b border-gray-100 last:border-b-0 ${
                  isZeroStock ? 'bg-red-50/50' : hasNoSupplier ? 'bg-amber-50/50' : ''
                }`}
              >
                <div
                  className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpand(sku.id)}
                >
                  <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-800">{sku.name}</span>
                        {isZeroStock && (
                          <Badge variant="danger" pulse>
                            库存为0
                          </Badge>
                        )}
                        {hasNoSupplier && (
                          <Badge variant="warning" pulse>
                            无供应商
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{sku.code}</p>
                    </div>

                    <div className="text-center">
                      <p className={`text-lg font-bold ${
                        isZeroStock ? 'text-red-600' : 'text-gray-800'
                      }`}>
                        {sku.currentStock}
                      </p>
                      <p className="text-xs text-gray-500">当前库存</p>
                    </div>

                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-800">{sku.safetyStock}</p>
                      <p className="text-xs text-gray-500">安全库存</p>
                    </div>

                    <div className="text-center">
                      <Badge 
                        variant={sku.riskLevel === 'high' ? 'danger' : sku.riskLevel === 'medium' ? 'warning' : 'success'}
                        pulse={sku.riskLevel === 'high'}
                      >
                        {getRiskText(sku.riskLevel)}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-end">
                      <Clock className="w-4 h-4 text-gray-400 mr-1" />
                      <span className={`text-sm ${
                        sku.expectedDaysToOut <= 3 ? 'text-red-600 font-medium' : 'text-gray-600'
                      }`}>
                        {isZeroStock ? '已缺货' : `${sku.expectedDaysToOut}天后缺货`}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-gray-400 ml-2 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50/50">
                    <div className="pt-4 grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          供应商信息
                        </h5>
                        {supplier ? (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-500">名称</span>
                              <span className="font-medium">{supplier.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">状态</span>
                              <Badge variant={supplier.status === 'active' ? 'success' : supplier.status === 'delayed' ? 'warning' : 'default'}>
                                {supplier.status === 'active' ? '正常合作' : supplier.status === 'delayed' ? '交付延迟' : '暂停'}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">平均交付</span>
                              <span className="font-medium">{supplier.averageDeliveryTime}天</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">准时率</span>
                              <span className="font-medium">{supplier.onTimeRate}%</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                            <p className="text-amber-600 text-sm">该SKU暂无分配供应商</p>
                            <Button variant="secondary" size="sm" className="mt-2">
                              分配供应商
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          补货建议
                        </h5>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-500">建议补货量</span>
                            <span className="font-bold text-blue-600">
                              {Math.max(sku.safetyStock * 2 - sku.currentStock, 0)} 件
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">日均消耗</span>
                            <span className="font-medium">{sku.avgDailyConsumption} 件</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">上次补货</span>
                            <span className="font-medium">{sku.lastRestockDate}</span>
                          </div>
                          <Button 
                            variant={isZeroStock ? 'danger' : 'primary'} 
                            size="sm"
                            className="w-full mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRestock?.(sku);
                            }}
                          >
                            {isZeroStock ? '紧急补货' : '发起补货'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default SkuRiskPanel;
