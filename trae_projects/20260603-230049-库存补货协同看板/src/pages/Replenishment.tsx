import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Check,
  Send,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Package,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Search,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import RiskTag from '@/components/common/RiskTag';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSupplierStore } from '@/store/useSupplierStore';
import {
  formatCurrency,
  formatDate,
  formatStockDays,
  truncateText,
} from '@/utils/formatters';
import {
  getPriorityLabel,
  getPriorityColor,
  calculateTotalEstimatedCost,
  findAlternativeSuppliers,
} from '@/utils/replenishmentEngine';
import type { ReplenishmentSuggestion, SKUWithRisk } from '@/types';

export default function Replenishment() {
  const { suggestions, skusWithRisk, approveSuggestion, orderSuggestion, isLoading } = useInventoryStore();
  const { suppliers } = useSupplierStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuggestions = suggestions.filter((s) => {
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchPriority =
      filterPriority === 'all' ||
      (filterPriority === 'critical' && s.priority >= 80) ||
      (filterPriority === 'urgent' && s.priority >= 60 && s.priority < 80) ||
      (filterPriority === 'high' && s.priority >= 40 && s.priority < 60) ||
      (filterPriority === 'normal' && s.priority < 40);
    const matchSearch =
      s.skuName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.skuCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const pendingCount = suggestions.filter((s) => s.status === 'pending').length;
  const approvedCount = suggestions.filter((s) => s.status === 'approved').length;
  const orderedCount = suggestions.filter((s) => s.status === 'ordered').length;
  const totalCost = calculateTotalEstimatedCost(suggestions.filter((s) => s.status !== 'completed'));

  const kpis = [
    {
      label: '待处理建议',
      value: pendingCount,
      change: pendingCount,
      trend: 'up' as const,
      icon: 'ShoppingCart',
      color: '#F59E0B',
    },
    {
      label: '已批准',
      value: approvedCount,
      change: 2,
      trend: 'up' as const,
      icon: 'Check',
      color: '#10B981',
    },
    {
      label: '已下单',
      value: orderedCount,
      change: -1,
      trend: 'down' as const,
      icon: 'Send',
      color: '#3B82F6',
    },
    {
      label: '预估总成本',
      value: formatCurrency(totalCost),
      change: 5.2,
      trend: 'up' as const,
      icon: 'DollarSign',
      color: '#8B5CF6',
    },
  ];

  const priorityDistributionOption = {
    tooltip: { trigger: 'item' },
    legend: {
      bottom: 0,
      textStyle: { color: '#94A3B8', fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#0F172A',
          borderWidth: 2,
        },
        label: { show: false },
        data: [
          {
            value: suggestions.filter((s) => s.priority >= 80).length,
            name: '极紧急',
            itemStyle: { color: '#EF4444' },
          },
          {
            value: suggestions.filter((s) => s.priority >= 60 && s.priority < 80).length,
            name: '紧急',
            itemStyle: { color: '#F97316' },
          },
          {
            value: suggestions.filter((s) => s.priority >= 40 && s.priority < 60).length,
            name: '高',
            itemStyle: { color: '#F59E0B' },
          },
          {
            value: suggestions.filter((s) => s.priority >= 20 && s.priority < 40).length,
            name: '中',
            itemStyle: { color: '#EAB308' },
          },
          {
            value: suggestions.filter((s) => s.priority < 20).length,
            name: '普通',
            itemStyle: { color: '#10B981' },
          },
        ],
      },
    ],
  };

  const costTrendOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#94A3B8', formatter: '{value}K' },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1E293B' } },
    },
    series: [
      {
        type: 'line',
        data: [12.5, 15.2, 13.8, 18.6, 22.1, 19.4, 25.8],
        smooth: true,
        lineStyle: { color: '#3B82F6', width: 2 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: '#3B82F6' },
      },
    ],
  };

  const getSKUForSuggestion = (suggestion: ReplenishmentSuggestion): SKUWithRisk | undefined => {
    return skusWithRisk.find((s) => s.id === suggestion.skuId);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredSuggestions.filter((s) => s.status === 'pending').length) {
      setSelectedIds(new Set());
    } else {
      const pendingIds = filteredSuggestions.filter((s) => s.status === 'pending').map((s) => s.id);
      setSelectedIds(new Set(pendingIds));
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBatchApprove = () => {
    selectedIds.forEach((id) => approveSuggestion(id));
    setSelectedIds(new Set());
  };

  const handleBatchOrder = () => {
    selectedIds.forEach((id) => orderSuggestion(id));
    setSelectedIds(new Set());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'ordered':
        return <Send className="w-4 h-4 text-blue-400" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">补货建议</h1>
          <p className="text-slate-400 mt-1">智能补货计算、优先级排序、一键生成订单</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          补货引擎运行中
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} data={kpi} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索 SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-56"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="all">全部状态</option>
                  <option value="pending">待处理</option>
                  <option value="approved">已批准</option>
                  <option value="ordered">已下单</option>
                  <option value="completed">已完成</option>
                </select>
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">全部优先级</option>
                <option value="critical">极紧急</option>
                <option value="urgent">紧急</option>
                <option value="high">高</option>
                <option value="normal">普通</option>
              </select>
            </div>
          </div>

          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-between"
            >
              <span className="text-blue-400 text-sm">
                已选择 <span className="font-bold">{selectedIds.size}</span> 条建议
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBatchApprove}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  批量批准
                </button>
                <button
                  onClick={handleBatchOrder}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  批量下单
                </button>
              </div>
            </motion.div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3 px-2 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === filteredSuggestions.filter((s) => s.status === 'pending').length &&
                        filteredSuggestions.filter((s) => s.status === 'pending').length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/50"
                    />
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    优先级
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    SKU 信息
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    补货数量
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    预估成本
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    供应商
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="py-3 px-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredSuggestions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      暂无补货建议
                    </td>
                  </tr>
                ) : (
                  filteredSuggestions.map((suggestion, index) => {
                    const sku = getSKUForSuggestion(suggestion);
                    const isExpanded = expandedId === suggestion.id;
                    const alternativeSuppliers = sku
                      ? findAlternativeSuppliers(sku, suppliers)
                      : [];
                    const hasSupplierIssue = suggestion.supplierId === '' || !sku?.supplier;

                    return (
                      <Fragment key={suggestion.id}>
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`hover:bg-slate-700/30 transition-colors ${
                            hasSupplierIssue ? 'bg-orange-500/5' : ''
                          }`}
                        >
                          <td className="py-3 px-2">
                            {suggestion.status === 'pending' && (
                              <input
                                type="checkbox"
                                checked={selectedIds.has(suggestion.id)}
                                onChange={() => handleSelect(suggestion.id)}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500/50"
                              />
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <div
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${getPriorityColor(suggestion.priority)}20`,
                                color: getPriorityColor(suggestion.priority),
                              }}
                            >
                              {suggestion.priority >= 80 && (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {getPriorityLabel(suggestion.priority)}
                              <span className="opacity-60">{suggestion.priority}</span>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">
                                  {truncateText(suggestion.skuName, 20)}
                                </p>
                                <p className="text-slate-400 text-xs">{suggestion.skuCode}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div>
                              <p className="text-white text-sm font-medium">
                                {suggestion.suggestedQuantity} 件
                              </p>
                              <p className="text-slate-400 text-xs">
                                当前 {suggestion.currentStock} / 安全 {suggestion.safetyStock}
                              </p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <p className="text-white text-sm font-medium">
                              {formatCurrency(suggestion.estimatedCost)}
                            </p>
                          </td>
                          <td className="py-3 px-2">
                            {hasSupplierIssue ? (
                              <div className="flex items-center gap-1 text-orange-400 text-xs">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>待分配</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                  {suggestion.supplierName.charAt(0)}
                                </div>
                                <span className="text-slate-300 text-sm">
                                  {truncateText(suggestion.supplierName, 10)}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1.5">
                              {getStatusIcon(suggestion.status)}
                              <StatusBadge status={suggestion.status} size="sm" />
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : suggestion.id)}
                                className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              {suggestion.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => approveSuggestion(suggestion.id)}
                                    className="p-1.5 hover:bg-emerald-500/20 rounded-lg transition-colors text-emerald-400 hover:text-emerald-300"
                                    title="批准"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => orderSuggestion(suggestion.id)}
                                    className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400 hover:text-blue-300"
                                    title="下单"
                                  >
                                    <Send className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <td colSpan={8} className="py-0">
                                <div className="p-4 bg-slate-900/50 border-t border-slate-700">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {sku && (
                                      <div className="space-y-3">
                                        <h4 className="text-white font-medium flex items-center gap-2">
                                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                                          库存风险状态
                                        </h4>
                                        <div className="p-3 bg-slate-800/50 rounded-lg space-y-2">
                                          <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">风险等级</span>
                                            <RiskTag level={sku.risk.level} size="sm" />
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">风险原因</span>
                                            <span className="text-slate-300 text-sm">{sku.risk.reason}</span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">可售天数</span>
                                            <span className="text-white text-sm">
                                              {formatStockDays(sku.risk.stockDays)}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">安全库存比例</span>
                                            <span className="text-white text-sm">
                                              {Math.round(sku.risk.safetyRatio * 100)}%
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    <div className="space-y-3">
                                      <h4 className="text-white font-medium flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-400" />
                                        补货详情
                                      </h4>
                                      <div className="p-3 bg-slate-800/50 rounded-lg space-y-2">
                                        <div className="flex items-center justify-between">
                                          <span className="text-slate-400 text-sm">补货数量</span>
                                          <span className="text-white text-sm font-medium">
                                            {suggestion.suggestedQuantity} 件
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-slate-400 text-sm">目标库存</span>
                                          <span className="text-white text-sm">
                                            {suggestion.safetyStock + suggestion.suggestedQuantity} 件
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-slate-400 text-sm">预计到货</span>
                                          <span className="text-white text-sm">
                                            {formatDate(suggestion.expectedDate)}
                                          </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className="text-slate-400 text-sm">预估成本</span>
                                          <span className="text-emerald-400 text-sm font-medium">
                                            {formatCurrency(suggestion.estimatedCost)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <h4 className="text-white font-medium flex items-center gap-2">
                                        <Users className="w-4 h-4 text-purple-400" />
                                        供应商信息
                                      </h4>
                                      {hasSupplierIssue ? (
                                        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                          <div className="flex items-center gap-2 text-orange-400 text-sm mb-3">
                                            <XCircle className="w-4 h-4" />
                                            <span>当前无供应商</span>
                                          </div>
                                          <p className="text-slate-400 text-xs mb-2">推荐备选供应商：</p>
                                          <div className="space-y-2">
                                            {alternativeSuppliers.slice(0, 2).map((sup) => (
                                              <div
                                                key={sup.id}
                                                className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg"
                                              >
                                                <div className="flex items-center gap-2">
                                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                                                    {sup.name.charAt(0)}
                                                  </div>
                                                  <div>
                                                    <p className="text-white text-xs font-medium">
                                                      {sup.name}
                                                    </p>
                                                    <p className="text-slate-400 text-xs">
                                                      准交率 {sup.onTimeRate}%
                                                    </p>
                                                  </div>
                                                </div>
                                                <button className="text-xs text-blue-400 hover:text-blue-300">
                                                  分配
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="p-3 bg-slate-800/50 rounded-lg space-y-2">
                                          <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                              {suggestion.supplierName.charAt(0)}
                                            </div>
                                            <div>
                                              <p className="text-white text-sm font-medium">
                                                {suggestion.supplierName}
                                              </p>
                                              <p className="text-slate-400 text-xs">
                                                {sku?.supplier?.categories?.[0] || '多品类'}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">评级</span>
                                            <span className="text-yellow-400 text-sm">
                                              {'★'.repeat(Math.floor(sku?.supplier?.rating || 0))}
                                              {'☆'.repeat(5 - Math.floor(sku?.supplier?.rating || 0))}
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">准交率</span>
                                            <span className="text-emerald-400 text-sm">
                                              {sku?.supplier?.onTimeRate}%
                                            </span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                            <span className="text-slate-400 text-sm">平均交付</span>
                                            <span className="text-white text-sm">
                                              {sku?.supplier?.avgDeliveryTime} 天
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {hasSupplierIssue && (
                                    <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                      <h4 className="text-orange-400 text-sm font-medium mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        处理逻辑
                                      </h4>
                                      <ul className="text-sm text-orange-300/80 space-y-1 list-disc list-inside">
                                        <li>禁止生成正式采购订单，标记为"待分配"</li>
                                        <li>自动匹配同品类评分最高的备选供应商</li>
                                        <li>推送采购专员进行供应商资质审核</li>
                                        <li>3个工作日内完成供应商分配，否则升级告警</li>
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              优先级分布
            </h3>
            <ReactECharts option={priorityDistributionOption} style={{ height: '220px' }} theme="dark" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              补货成本趋势
            </h3>
            <ReactECharts option={costTrendOption} style={{ height: '220px' }} theme="dark" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
              补货计算逻辑
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 font-medium mb-1">目标库存公式</p>
                <code className="text-xs text-emerald-400 bg-slate-800 px-2 py-1 rounded block">
                  目标库存 = 安全库存 + (日均消耗 × (补货提前期 + 7))
                </code>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 font-medium mb-1">补货数量</p>
                <code className="text-xs text-blue-400 bg-slate-800 px-2 py-1 rounded block">
                  补货数量 = Max(0, 目标库存 - 当前库存)
                </code>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 font-medium mb-2">优先级计算因素</p>
                <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                  <li>库存为0: +100分</li>
                  <li>无供应商: +80分</li>
                  <li>安全库存&lt;30%: +60分</li>
                  <li>可售天数&lt;提前期: +30分</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
