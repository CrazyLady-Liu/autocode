import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Package, AlertTriangle, TrendingUp, ChevronRight, X, Activity } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import StatusBadge from '@/components/common/StatusBadge';
import { useInventoryStore } from '@/store/useInventoryStore';
import { formatNumber, formatPercent } from '@/utils/formatters';
import { cn } from '@/lib/utils';

export default function Warehouses() {
  const { warehouses, skusWithRisk, setSelectedWarehouse, selectedWarehouseId } = useInventoryStore();
  const [expandedWarehouse, setExpandedWarehouse] = useState<string | null>(null);

  const selectedWarehouse = warehouses.find(w => w.id === selectedWarehouseId);
  const warehouseSKUs = selectedWarehouse
    ? skusWithRisk.filter(s => s.warehouseId === selectedWarehouse.id)
    : [];

  const getCapacityColor = (used: number, total: number) => {
    const ratio = used / total;
    if (ratio > 0.9) return '#EF4444';
    if (ratio > 0.75) return '#F59E0B';
    return '#10B981';
  };

  const capacityTrendOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLabel: { color: '#94A3B8' },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94A3B8', formatter: '{value}%' },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1E293B' } },
    },
    series: [
      {
        type: 'line',
        data: [65, 72, 68, 75, 78, 82],
        smooth: true,
        lineStyle: { color: '#3B82F6', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' },
            ],
          },
        },
      },
    ],
  };

  const skuRiskDistributionOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        itemStyle: { borderRadius: 4, borderColor: '#0F172A', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: warehouseSKUs.filter(s => s.risk.level === 'critical').length, name: '紧急', itemStyle: { color: '#EF4444' } },
          { value: warehouseSKUs.filter(s => s.risk.level === 'high').length, name: '高风险', itemStyle: { color: '#F59E0B' } },
          { value: warehouseSKUs.filter(s => s.risk.level === 'medium').length, name: '中风险', itemStyle: { color: '#EAB308' } },
          { value: warehouseSKUs.filter(s => s.risk.level === 'low').length, name: '低风险', itemStyle: { color: '#10B981' } },
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">仓库列表</h1>
          <p className="text-slate-400 mt-1">管理和监控所有仓库的库存状态</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 bg-emerald-400 rounded-full" />
            正常 {warehouses.filter(w => w.status === 'normal').length}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 bg-amber-400 rounded-full" />
            警告 {warehouses.filter(w => w.status === 'warning').length}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="w-2 h-2 bg-red-400 rounded-full" />
            异常 {warehouses.filter(w => w.status === 'critical').length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {warehouses.map((warehouse, index) => {
          const capacityRatio = warehouse.usedCapacity / warehouse.totalCapacity;
          const capacityColor = getCapacityColor(warehouse.usedCapacity, warehouse.totalCapacity);
          const isExpanded = expandedWarehouse === warehouse.id;

          return (
            <motion.div
              key={warehouse.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={cn(
                'bg-slate-800/50 border rounded-xl overflow-hidden transition-all cursor-pointer',
                isExpanded ? 'border-blue-500' : 'border-slate-700 hover:border-slate-600'
              )}
              onClick={() => {
                setExpandedWarehouse(isExpanded ? null : warehouse.id);
                setSelectedWarehouse(isExpanded ? null : warehouse.id);
              }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{warehouse.name}</h3>
                      <p className="text-slate-400 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {warehouse.location}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={warehouse.status} pulse={warehouse.status === 'critical'} />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <Package className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">{formatNumber(warehouse.skuCount)}</p>
                    <p className="text-slate-400 text-xs">SKU 数量</p>
                  </div>
                  <div className="text-center">
                    <AlertTriangle className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">{warehouse.alertCount}</p>
                    <p className="text-slate-400 text-xs">告警数量</p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                    <p className="text-white font-semibold">{warehouse.healthScore}</p>
                    <p className="text-slate-400 text-xs">健康评分</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">库容使用率</span>
                    <span className="text-white font-medium">
                      {formatPercent(warehouse.usedCapacity, warehouse.totalCapacity)}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${capacityRatio * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: capacityColor }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{formatNumber(warehouse.usedCapacity)} 已用</span>
                    <span>{formatNumber(warehouse.totalCapacity)} 总量</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                  <span className="text-sm text-slate-400">查看详情</span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-slate-700"
                  >
                    <div className="p-5 bg-slate-900/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-white text-sm font-medium mb-3">库容趋势</h4>
                          <ReactECharts
                            option={capacityTrendOption}
                            style={{ height: '180px' }}
                            theme="dark"
                          />
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-medium mb-3">SKU 风险分布</h4>
                          <ReactECharts
                            option={skuRiskDistributionOption}
                            style={{ height: '180px' }}
                            theme="dark"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-white text-sm font-medium mb-2">高风险 SKU</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {warehouseSKUs
                            .filter(s => s.risk.level === 'critical' || s.risk.level === 'high')
                            .slice(0, 5)
                            .map(sku => (
                              <div
                                key={sku.id}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50"
                              >
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: capacityColor }}
                                  />
                                  <span className="text-white text-sm">{sku.name}</span>
                                </div>
                                <span className="text-slate-400 text-xs">
                                  库存 {sku.currentStock} / {sku.safetyStock}
                                </span>
                              </div>
                            ))}
                          {warehouseSKUs.filter(s => s.risk.level === 'critical' || s.risk.level === 'high').length === 0 && (
                            <p className="text-slate-400 text-sm text-center py-4">暂无高风险 SKU</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedWarehouse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
            onClick={() => {
              setExpandedWarehouse(null);
              setSelectedWarehouse(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedWarehouse.name}</h2>
                  <p className="text-slate-400 text-sm">{selectedWarehouse.location}</p>
                </div>
                <button
                  onClick={() => {
                    setExpandedWarehouse(null);
                    setSelectedWarehouse(null);
                  }}
                  className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                    <Package className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedWarehouse.skuCount}</p>
                    <p className="text-slate-400 text-sm">SKU 总数</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedWarehouse.alertCount}</p>
                    <p className="text-slate-400 text-sm">待处理告警</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                    <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{selectedWarehouse.healthScore}</p>
                    <p className="text-slate-400 text-sm">健康评分</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">
                      {formatPercent(selectedWarehouse.usedCapacity, selectedWarehouse.totalCapacity)}
                    </p>
                    <p className="text-slate-400 text-sm">库容使用率</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold">SKU 清单</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-slate-700">
                          <th className="pb-3 text-slate-400 font-medium text-sm">SKU 编码</th>
                          <th className="pb-3 text-slate-400 font-medium text-sm">名称</th>
                          <th className="pb-3 text-slate-400 font-medium text-sm">品类</th>
                          <th className="pb-3 text-slate-400 font-medium text-sm">当前库存</th>
                          <th className="pb-3 text-slate-400 font-medium text-sm">安全库存</th>
                          <th className="pb-3 text-slate-400 font-medium text-sm">风险等级</th>
                        </tr>
                      </thead>
                      <tbody>
                        {warehouseSKUs.map(sku => (
                          <tr key={sku.id} className="border-b border-slate-700/50">
                            <td className="py-3 text-white font-mono text-sm">{sku.skuCode}</td>
                            <td className="py-3 text-white text-sm">{sku.name}</td>
                            <td className="py-3 text-slate-400 text-sm">{sku.category}</td>
                            <td className="py-3 text-white text-sm">{sku.currentStock}</td>
                            <td className="py-3 text-slate-400 text-sm">{sku.safetyStock}</td>
                            <td className="py-3">
                              <span
                                className="px-2 py-1 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: `${getCapacityColor(1, 1)}20`,
                                  color: getCapacityColor(
                                    sku.currentStock < sku.safetyStock ? 1 : 0,
                                    1
                                  ),
                                }}
                              >
                                {sku.currentStock < sku.safetyStock ? '低库存' : '正常'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
