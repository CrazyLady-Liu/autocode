import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  UserX,
  ShoppingCart,
  ChevronRight,
  Filter,
  Check,
  X,
  Phone,
  RefreshCw,
  Layers,
  AlertOctagon,
  Users,
  Volume2,
  VolumeX,
  ExternalLink,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import RiskTag from '@/components/common/RiskTag';
import StatusBadge from '@/components/common/StatusBadge';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSupplierStore } from '@/store/useSupplierStore';
import { findAlternativeSuppliers } from '@/utils/replenishmentEngine';
import { reduceAlertNoise, getRiskReasonText } from '@/utils/riskCalculator';
import { formatCurrency, formatStockDays, formatRelativeTime } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import type { SKUWithRisk } from '@/types';

export default function SkuRisk() {
  const { skusWithRisk, alerts, filterRiskLevel, setFilterRiskLevel, acknowledgeAlert, resolveAlert, getSKUById, linkedSkuId, setLinkedSkuId, clearLinkedSkuId } = useInventoryStore();
  const { suppliers } = useSupplierStore();
  const navigate = useNavigate();
  const [selectedSKUId, setSelectedSKUId] = useState<string | null>(null);
  const [showNoiseReducer, setShowNoiseReducer] = useState(false);
  const [noiseThreshold, setNoiseThreshold] = useState(5);

  useEffect(() => {
    if (linkedSkuId) {
      setSelectedSKUId(linkedSkuId);
      clearLinkedSkuId();
    }
  }, [linkedSkuId, clearLinkedSkuId]);

  const filters = [
    { value: 'all', label: '全部', color: '#6B7280' },
    { value: 'critical', label: '紧急', color: '#EF4444' },
    { value: 'high', label: '高风险', color: '#F59E0B' },
    { value: 'medium', label: '中风险', color: '#EAB308' },
    { value: 'low', label: '低风险', color: '#10B981' },
  ];

  const filteredSKUs = filterRiskLevel === 'all'
    ? skusWithRisk
    : skusWithRisk.filter(s => s.risk.level === filterRiskLevel);

  const sortedSKUs = [...filteredSKUs].sort((a, b) => {
    const levelOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    if (levelOrder[a.risk.level] !== levelOrder[b.risk.level]) {
      return levelOrder[a.risk.level] - levelOrder[b.risk.level];
    }
    return a.risk.safetyRatio - b.risk.safetyRatio;
  });

  const stockZeroSKUs = sortedSKUs.filter(s => s.risk.reason === 'STOCK_ZERO');
  const noSupplierSKUs = sortedSKUs.filter(s => s.risk.reason === 'NO_SUPPLIER');
  const otherAlerts = sortedSKUs.filter(s => s.risk.reason !== 'STOCK_ZERO' && s.risk.reason !== 'NO_SUPPLIER');

  const { alerts: reducedAlerts, suppressed, aggregated } = reduceAlertNoise(
    otherAlerts.map(s => ({ level: s.risk.level, skuId: s.id, type: s.risk.reason })),
    noiseThreshold
  );

  const selectedSKU = selectedSKUId ? getSKUById(selectedSKUId) : null;
  const alternativeSuppliers = selectedSKU && !selectedSKU.supplierId
    ? findAlternativeSuppliers(selectedSKU, suppliers)
    : [];

  const stockTrendOption = selectedSKU ? {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - 13 + i);
        return `${d.getMonth() + 1}/${d.getDate()}`;
      }),
      axisLabel: { color: '#94A3B8', fontSize: 10 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94A3B8' },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1E293B' } },
    },
    series: [
      {
        type: 'line',
        name: '库存',
        data: Array.from({ length: 14 }, (_, i) => {
          const base = selectedSKU.safetyStock * 1.5;
          const trend = base - (i / 14) * base * 0.8;
          return Math.max(0, Math.round(trend + (Math.random() - 0.5) * 20));
        }),
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
        markLine: {
          silent: true,
          lineStyle: { color: '#EF4444', type: 'dashed' },
          data: [{ yAxis: selectedSKU.safetyStock, label: { formatter: '安全库存', color: '#EF4444', fontSize: 10 } }],
        },
      },
    ],
  } : {};

  const SKURow = ({ sku, isHighlighted = false }: { sku: SKUWithRisk; isHighlighted?: boolean }) => (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
      onClick={() => setSelectedSKUId(selectedSKUId === sku.id ? null : sku.id)}
      className={cn(
        'cursor-pointer border-b border-slate-700/50 transition-colors',
        isHighlighted && 'bg-red-500/5',
        selectedSKUId === sku.id && 'bg-blue-500/10'
      )}
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{
              backgroundColor: sku.risk.level === 'critical' ? '#EF4444' : sku.risk.level === 'high' ? '#F59E0B' : '#EAB308',
            }}
          />
          <div>
            <p className="text-white font-medium">{sku.name}</p>
            <p className="text-slate-400 text-xs font-mono">{sku.skuCode}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-slate-400 text-sm">{sku.category}</td>
      <td className="py-4 px-4">
        <RiskTag level={sku.risk.level} reason={sku.risk.reason} showReason size="sm" pulse={sku.risk.level === 'critical'} />
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-mono font-bold',
            sku.currentStock === 0 ? 'text-red-400' : sku.currentStock < sku.safetyStock ? 'text-amber-400' : 'text-white'
          )}>
            {sku.currentStock}
          </span>
          <span className="text-slate-500">/</span>
          <span className="text-slate-400">{sku.safetyStock}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={cn(
          'font-medium',
          sku.risk.stockDays === 0 ? 'text-red-400' : sku.risk.stockDays < sku.leadTime ? 'text-amber-400' : 'text-white'
        )}>
          {formatStockDays(sku.risk.stockDays)}
        </span>
      </td>
      <td className="py-4 px-4">
        {sku.supplier ? (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-white text-sm">{sku.supplier.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">无供应商</span>
          </div>
        )}
      </td>
      <td className="py-4 px-4">
        <ChevronRight className={cn(
          'w-5 h-5 text-slate-400 transition-transform',
          selectedSKUId === sku.id && 'rotate-90'
        )} />
      </td>
    </motion.tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">SKU 风险</h1>
          <p className="text-slate-400 mt-1">监控库存异常，识别补货需求</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNoiseReducer(!showNoiseReducer)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              showNoiseReducer ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            )}
          >
            {showNoiseReducer ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            预警降噪
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {filters.map(filter => {
          const count = filter.value === 'all'
            ? skusWithRisk.length
            : skusWithRisk.filter(s => s.risk.level === filter.value).length;
          return (
            <button
              key={filter.value}
              onClick={() => setFilterRiskLevel(filter.value)}
              className={cn(
                'p-4 rounded-xl border transition-all text-left',
                filterRiskLevel === filter.value
                  ? 'bg-slate-800 border-blue-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: filter.color }} />
                <span className="text-slate-400 text-sm">{filter.label}</span>
              </div>
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-slate-500 text-xs">个 SKU</p>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showNoiseReducer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-medium">预警降噪设置</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">显示阈值: {noiseThreshold} 条</span>
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={noiseThreshold}
                  onChange={e => setNoiseThreshold(Number(e.target.value))}
                  className="w-32 accent-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-slate-400 text-sm">可见告警</p>
                <p className="text-xl font-bold text-white">{reducedAlerts.length}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-slate-400 text-sm">已抑制</p>
                <p className="text-xl font-bold text-amber-400">{suppressed}</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <p className="text-slate-400 text-sm">聚合分组</p>
                <p className="text-xl font-bold text-blue-400">{aggregated.length}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {stockZeroSKUs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b border-red-500/20 flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-red-400 animate-pulse" />
                <div>
                  <h3 className="text-red-400 font-semibold">紧急：库存归零</h3>
                  <p className="text-red-400/70 text-sm">{stockZeroSKUs.length} 个 SKU 已断货，需立即处理</p>
                </div>
              </div>
              <div className="p-4 bg-red-500/5">
                <div className="bg-slate-800 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-slate-700/50 border-b border-slate-600">
                    <div className="grid grid-cols-6 gap-4 text-xs text-slate-400 font-medium">
                      <span>SKU 信息</span>
                      <span>品类</span>
                      <span>风险原因</span>
                      <span>库存/安全库存</span>
                      <span>可售天数</span>
                      <span>供应商</span>
                      <span></span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-700/50">
                    {stockZeroSKUs.map(sku => (
                      <SKURow key={sku.id} sku={sku} isHighlighted />
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <h4 className="text-red-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    处理逻辑
                  </h4>
                  <ul className="text-sm text-red-300/80 space-y-1 list-disc list-inside">
                    <li>触发红色脉冲告警，锁定 SKU 状态</li>
                    <li>检查是否有备选供应商，如有则自动切换</li>
                    <li>如无备选供应商，立即推送采购紧急处理</li>
                    <li>生成紧急补货单，优先进入处理队列</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {noSupplierSKUs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-xl overflow-hidden"
            >
              <div className="p-4 border-b border-amber-500/20 flex items-center gap-3">
                <UserX className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-amber-400 font-semibold">警告：供应商缺失</h3>
                  <p className="text-amber-400/70 text-sm">{noSupplierSKUs.length} 个 SKU 缺少有效供应商</p>
                </div>
              </div>
              <div className="p-4 bg-amber-500/5">
                <div className="bg-slate-800 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-slate-700/50 border-b border-slate-600">
                    <div className="grid grid-cols-6 gap-4 text-xs text-slate-400 font-medium">
                      <span>SKU 信息</span>
                      <span>品类</span>
                      <span>风险原因</span>
                      <span>库存/安全库存</span>
                      <span>可售天数</span>
                      <span>供应商</span>
                      <span></span>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-700/50">
                    {noSupplierSKUs.map(sku => (
                      <SKURow key={sku.id} sku={sku} isHighlighted />
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <h4 className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    处理逻辑
                  </h4>
                  <ul className="text-sm text-amber-300/80 space-y-1 list-disc list-inside">
                    <li>触发黄色告警标记，禁止生成补货单</li>
                    <li>按品类推荐同品类高评级供应商</li>
                    <li>提供一键发起供应商询价功能</li>
                    <li>自动关联采购专员处理，3 个工作日内完成审核</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-white font-semibold">库存异常列表</h3>
                  <p className="text-slate-400 text-sm">{otherAlerts.length} 个 SKU 需要关注</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 text-sm">按风险等级排序</span>
              </div>
            </div>
            <div className="bg-slate-900/30">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-slate-700">
                      <th className="px-4 py-3 text-slate-400 font-medium text-sm">SKU 信息</th>
                      <th className="px-4 py-3 text-slate-400 font-medium text-sm">品类</th>
                      <th className="px-4 py-3 text-slate-400 font-medium text-sm">风险等级</th>
                      <th className="px-4 py-3 text-slate-400 font-medium text-sm">库存/安全库存</th>
                      <th className="px-4 py-3 text-slate-400 font-medium text-sm">可售天数</th>
                      <th className="px-4 py-3 text-slate-400 font-medium text-sm">供应商</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showNoiseReducer ? reducedAlerts.map(a => otherAlerts.find(s => s.id === a.skuId)).filter(Boolean) as SKUWithRisk[] : otherAlerts)
                      .map(sku => (
                        <SKURow key={sku.id} sku={sku} />
                      ))}
                    {showNoiseReducer && aggregated.length > 0 && (
                      <tr className="bg-slate-700/30 border-b border-slate-700">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="flex items-center gap-4">
                            <Layers className="w-5 h-5 text-blue-400" />
                            <span className="text-slate-400">已聚合 {suppressed} 条低优先级告警</span>
                            {aggregated.map((group, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 rounded-full text-sm"
                                style={{
                                  backgroundColor: group.level === 'high' ? '#F59E0B20' : group.level === 'medium' ? '#EAB30820' : '#10B98120',
                                  color: group.level === 'high' ? '#F59E0B' : group.level === 'medium' ? '#EAB308' : '#10B981',
                                }}
                              >
                                {group.level === 'high' ? '高风险' : group.level === 'medium' ? '中风险' : '低风险'} {group.count} 条
                              </span>
                            ))}
                            <button
                              onClick={() => setShowNoiseReducer(false)}
                              className="ml-auto text-blue-400 text-sm hover:text-blue-300"
                            >
                              展开全部
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedSKU ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden sticky top-0"
              >
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="text-white font-semibold">SKU 详情</h3>
                  <button
                    onClick={() => setSelectedSKUId(null)}
                    className="p-1 rounded hover:bg-slate-700"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-white font-medium text-lg">{selectedSKU.name}</h4>
                    <p className="text-slate-400 text-sm font-mono">{selectedSKU.skuCode}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">当前库存</p>
                      <p className={cn(
                        'text-xl font-bold',
                        selectedSKU.currentStock === 0 ? 'text-red-400' : selectedSKU.currentStock < selectedSKU.safetyStock ? 'text-amber-400' : 'text-white'
                      )}>
                        {selectedSKU.currentStock}
                      </p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">安全库存</p>
                      <p className="text-xl font-bold text-white">{selectedSKU.safetyStock}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">可售天数</p>
                      <p className="text-xl font-bold text-white">{formatStockDays(selectedSKU.risk.stockDays)}</p>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-3">
                      <p className="text-slate-400 text-xs mb-1">补货提前期</p>
                      <p className="text-xl font-bold text-white">{selectedSKU.leadTime} 天</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-white text-sm font-medium mb-2">库存趋势</h5>
                    <ReactECharts option={stockTrendOption} style={{ height: '160px' }} theme="dark" />
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-white text-sm font-medium">补货建议</h5>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <ShoppingCart className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm font-medium">建议补货</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-slate-400">建议数量: </span>
                          <span className="text-white font-medium">
                            {Math.max(0, Math.ceil(
                              selectedSKU.safetyStock + selectedSKU.avgDailyConsumption * (selectedSKU.leadTime + 7) - selectedSKU.currentStock
                            ))} 件
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">预计成本: </span>
                          <span className="text-white font-medium">
                            {formatCurrency(
                              Math.max(0, Math.ceil(
                                selectedSKU.safetyStock + selectedSKU.avgDailyConsumption * (selectedSKU.leadTime + 7) - selectedSKU.currentStock
                              )) * selectedSKU.unitCost
                            )}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setLinkedSkuId(selectedSKU.id);
                          navigate('/replenishment');
                        }}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        查看补货建议
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-white text-sm font-medium">供应商状态</h5>
                    {selectedSKU.supplier ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-white font-medium">{selectedSKU.supplier.name}</span>
                          </div>
                          <StatusBadge status={selectedSKU.supplier.status} size="sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-400">评级: </span>
                            <span className="text-yellow-400">{'★'.repeat(Math.floor(selectedSKU.supplier.rating))}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">准交率: </span>
                            <span className="text-white">{selectedSKU.supplier.onTimeRate}%</span>
                          </div>
                          <div>
                            <span className="text-slate-400">联系人: </span>
                            <span className="text-white">{selectedSKU.supplier.contact}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">电话: </span>
                            <span className="text-white font-mono">{selectedSKU.supplier.phone}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-500/20">
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <button className="text-emerald-400 text-sm hover:text-emerald-300">联系供应商</button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-3">
                          <UserX className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-sm">暂无关联供应商</span>
                        </div>
                        {alternativeSuppliers.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-slate-400 text-xs mb-2">推荐备选供应商:</p>
                            {alternativeSuppliers.map(supplier => (
                              <div key={supplier.id} className="bg-slate-700/50 rounded-lg p-2 flex items-center justify-between">
                                <div>
                                  <p className="text-white text-sm">{supplier.name}</p>
                                  <p className="text-slate-400 text-xs">
                                    {'★'.repeat(Math.floor(supplier.rating))} · 准交率 {supplier.onTimeRate}%
                                  </p>
                                </div>
                                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30">
                                  关联
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 text-sm">暂无匹配的备选供应商，请手动添加</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-white text-sm font-medium">关联告警</h5>
                    {alerts.filter(a => a.skuId === selectedSKU.id).length > 0 ? (
                      <div className="space-y-2">
                        {alerts.filter(a => a.skuId === selectedSKU.id).map(alert => (
                          <div key={alert.id} className="bg-slate-700/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <RiskTag level={alert.level} size="sm" pulse={alert.status === 'new'} />
                              <span className="text-slate-400 text-xs">{formatRelativeTime(alert.createdAt)}</span>
                            </div>
                            <p className="text-slate-300 text-sm">{alert.description}</p>
                            <div className="flex items-center gap-2 mt-3">
                              {alert.status === 'new' && (
                                <button
                                  onClick={() => acknowledgeAlert(alert.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-lg hover:bg-blue-500/30"
                                >
                                  <Check className="w-3 h-3" /> 确认
                                </button>
                              )}
                              {alert.status === 'acknowledged' && (
                                <button
                                  onClick={() => resolveAlert(alert.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500/30"
                                >
                                  <Check className="w-3 h-3" /> 解决
                                </button>
                              )}
                              <StatusBadge status={alert.status} size="sm" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm">暂无关联告警</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center sticky top-0"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-white font-medium mb-2">选择 SKU 查看详情</h3>
                <p className="text-slate-400 text-sm">点击左侧列表中的 SKU 查看详细信息、库存趋势和补货建议</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
