import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Star,
  Clock,
  TrendingUp,
  ChevronDown,
  Search,
  Filter,
  Phone,
  Package,
  AlertCircle,
  BarChart3,
  Zap,
  Award,
  AlertOctagon,
  MessageSquare,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import { useSupplierStore } from '@/store/useSupplierStore';
import { useInventoryStore } from '@/store/useInventoryStore';
import { formatDate, truncateText } from '@/utils/formatters';
import type { DeliveryRecord } from '@/types';

export default function Suppliers() {
  const { suppliers, getRecordsBySupplier, isLoading } = useSupplierStore();
  const { skusWithRisk } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredSuppliers = suppliers.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeSuppliers = suppliers.filter((s) => s.status === 'active').length;
  const avgOnTimeRate =
    suppliers.length > 0
      ? Math.round(suppliers.reduce((sum, s) => sum + s.onTimeRate, 0) / suppliers.length)
      : 0;
  const avgRating =
    suppliers.length > 0
      ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length
      : 0;
  const avgDeliveryTime =
    suppliers.length > 0
      ? Math.round(suppliers.reduce((sum, s) => sum + s.avgDeliveryTime, 0) / suppliers.length)
      : 0;

  const pendingSuppliers = suppliers.filter((s) => s.status === 'pending').length;
  const lowPerformanceSuppliers = suppliers.filter((s) => s.rating < 4.0).length;

  const kpis = [
    {
      label: '活跃供应商',
      value: activeSuppliers,
      change: 1,
      trend: 'up' as const,
      icon: 'Users',
      color: '#10B981',
    },
    {
      label: '平均准交率',
      value: avgOnTimeRate + '%',
      change: -1.2,
      trend: 'down' as const,
      icon: 'CheckCircle',
      color: '#3B82F6',
    },
    {
      label: '平均评级',
      value: avgRating.toFixed(1),
      change: 0.1,
      trend: 'up' as const,
      icon: 'Star',
      color: '#F59E0B',
    },
    {
      label: '平均交付时效',
      value: avgDeliveryTime + ' 天',
      change: -0.5,
      trend: 'down' as const,
      icon: 'Clock',
      color: '#8B5CF6',
    },
  ];

  const ratingDistributionOption = {
    tooltip: { trigger: 'item' as const },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value' as const,
      max: 5,
      axisLabel: { color: '#94A3B8' },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'category' as const,
      data: filteredSuppliers.slice(0, 6).map((s) => truncateText(s.name, 8)),
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    series: [
      {
        type: 'bar' as const,
        data: filteredSuppliers.slice(0, 6).map((s) => ({
          value: s.rating,
          itemStyle: {
            color: s.rating >= 4.5 ? '#10B981' : s.rating >= 4.0 ? '#F59E0B' : '#EF4444',
            borderRadius: [0, 4, 4, 0],
          },
        })),
        barWidth: '60%',
      },
    ],
  };

  const deliveryTrendOption = {
    tooltip: { trigger: 'axis' as const },
    legend: {
      data: ['提前', '准时', '延迟'],
      textStyle: { color: '#94A3B8', fontSize: 11 },
      bottom: 0,
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
      axisLabel: { color: '#94A3B8', fontSize: 11 },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: '#94A3B8' },
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1E293B' } },
    },
    series: [
      {
        name: '提前',
        type: 'bar' as const,
        stack: 'total',
        data: [12, 15, 18, 14, 20, 22],
        itemStyle: { color: '#10B981' },
      },
      {
        name: '准时',
        type: 'bar' as const,
        stack: 'total',
        data: [25, 28, 22, 30, 28, 32],
        itemStyle: { color: '#3B82F6' },
      },
      {
        name: '延迟',
        type: 'bar' as const,
        stack: 'total',
        data: [3, 5, 8, 4, 6, 3],
        itemStyle: { color: '#EF4444' },
      },
    ],
  };

  const getSupplierSKUCount = (supplierId: string) => {
    return skusWithRisk.filter((s) => s.supplierId === supplierId).length;
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case 'early':
        return 'text-emerald-400';
      case 'on-time':
        return 'text-blue-400';
      case 'late':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getDeliveryStatusText = (status: string) => {
    switch (status) {
      case 'early':
        return '提前';
      case 'on-time':
        return '准时';
      case 'late':
        return '延迟';
      default:
        return status;
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
          <h1 className="text-2xl font-bold text-white">供应商协同</h1>
          <p className="text-slate-400 mt-1">供应商评级、交付时效、订单状态追踪</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          数据实时同步中
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} data={kpi} index={index} />
        ))}
      </div>

      {(pendingSuppliers > 0 || lowPerformanceSuppliers > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {pendingSuppliers > 0 && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-amber-400 font-medium">待审核供应商</h4>
                  <p className="text-amber-300/80 text-sm mt-1">
                    有 {pendingSuppliers} 个供应商等待资质审核
                  </p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-amber-500/5 rounded-lg">
                <h5 className="text-amber-400/80 text-xs font-medium mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  处理逻辑
                </h5>
                <ul className="text-amber-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>限制生成采购订单，标记为"待审核"</li>
                  <li>推送采购专员进行资质审核</li>
                  <li>审核通过后自动激活供应商</li>
                  <li>审核不通过则列入黑名单</li>
                </ul>
              </div>
            </div>
          )}

          {lowPerformanceSuppliers > 0 && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertOctagon className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="text-red-400 font-medium">低绩效供应商</h4>
                  <p className="text-red-300/80 text-sm mt-1">
                    有 {lowPerformanceSuppliers} 个供应商评级低于 4.0
                  </p>
                </div>
              </div>
              <div className="mt-3 p-3 bg-red-500/5 rounded-lg">
                <h5 className="text-red-400/80 text-xs font-medium mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  处理逻辑
                </h5>
                <ul className="text-red-300/70 text-xs space-y-1 list-disc list-inside">
                  <li>自动降低采购优先级</li>
                  <li>启动备选供应商评估</li>
                  <li>连续3个月低绩效启动淘汰流程</li>
                  <li>发送绩效改进通知</li>
                </ul>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索供应商..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="all">全部状态</option>
                <option value="active">活跃</option>
                <option value="pending">待审核</option>
                <option value="inactive">已停用</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredSuppliers.length === 0 ? (
              <p className="text-center text-slate-400 py-8">暂无供应商</p>
            ) : (
              filteredSuppliers.map((supplier, index) => {
                const records = getRecordsBySupplier(supplier.id);
                const skuCount = getSupplierSKUCount(supplier.id);
                const isExpanded = expandedId === supplier.id;
                const isLowPerformance = supplier.rating < 4.0;
                const isPending = supplier.status === 'pending';
                const cardClass = isPending
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : isLowPerformance
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-slate-700/30 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600';

                return (
                  <motion.div
                    key={supplier.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={'rounded-xl border transition-all ' + cardClass}
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : supplier.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                            {supplier.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-semibold">{supplier.name}</h3>
                              <StatusBadge status={supplier.status} size="sm" />
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-yellow-400 text-sm">
                                {'★'.repeat(Math.floor(supplier.rating))}
                                {'☆'.repeat(5 - Math.floor(supplier.rating))}
                                <span className="text-slate-400 ml-1">{supplier.rating.toFixed(1)}</span>
                              </span>
                              <span className="text-slate-500">|</span>
                              <span className="text-slate-400 text-sm">联系人: {supplier.contact}</span>
                              <span className="text-slate-500">|</span>
                              <span className="text-slate-400 text-sm">{supplier.categories.slice(0, 2).join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right hidden sm:block">
                            <p className="text-slate-400 text-xs">准交率</p>
                            <p
                              className="text-lg font-semibold"
                              style={{ color: supplier.onTimeRate >= 90 ? '#10B981' : supplier.onTimeRate >= 80 ? '#F59E0B' : '#EF4444' }}
                            >
                              {supplier.onTimeRate}%
                            </p>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="text-slate-400 text-xs">平均交付</p>
                            <p className="text-white text-lg font-semibold">{supplier.avgDeliveryTime}天</p>
                          </div>
                          <div className="text-right hidden md:block">
                            <p className="text-slate-400 text-xs">供应SKU</p>
                            <p className="text-white text-lg font-semibold">{skuCount}个</p>
                          </div>
                          <ChevronDown
                            className={'w-5 h-5 text-slate-400 transition-transform ' + (isExpanded ? 'rotate-180' : '')}
                          />
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 border-t border-slate-700/50 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="text-white font-medium flex items-center gap-2">
                                  <BarChart3 className="w-4 h-4 text-blue-400" />
                                  详细信息
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="p-3 bg-slate-800/50 rounded-lg">
                                    <p className="text-slate-400 text-xs">联系电话</p>
                                    <p className="text-white text-sm font-medium flex items-center gap-1.5 mt-1">
                                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                                      {supplier.phone}
                                    </p>
                                  </div>
                                  <div className="p-3 bg-slate-800/50 rounded-lg">
                                    <p className="text-slate-400 text-xs">累计订单</p>
                                    <p className="text-white text-sm font-medium">{supplier.totalOrders} 单</p>
                                  </div>
                                  <div className="p-3 bg-slate-800/50 rounded-lg">
                                    <p className="text-slate-400 text-xs">质量评分</p>
                                    <p
                                      className="text-sm font-medium"
                                      style={{ color: supplier.qualityScore >= 90 ? '#10B981' : supplier.qualityScore >= 80 ? '#F59E0B' : '#EF4444' }}
                                    >
                                      {supplier.qualityScore} 分
                                    </p>
                                  </div>
                                  <div className="p-3 bg-slate-800/50 rounded-lg">
                                    <p className="text-slate-400 text-xs">供应品类</p>
                                    <p className="text-white text-sm font-medium">{supplier.categories.join(', ')}</p>
                                  </div>
                                </div>

                                {isPending && (
                                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                      <AlertCircle className="w-4 h-4 text-amber-400" />
                                      <span className="text-amber-400 text-sm font-medium">待审核供应商处理流程</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-lg transition-colors">通过审核</button>
                                      <button className="flex-1 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-lg transition-colors">拒绝</button>
                                      <button className="py-1.5 px-3 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded-lg transition-colors flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        联系
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-4">
                                <h4 className="text-white font-medium flex items-center gap-2">
                                  <Package className="w-4 h-4 text-purple-400" />
                                  最近交付记录
                                </h4>
                                {records.length === 0 ? (
                                  <p className="text-slate-400 text-sm text-center py-4">暂无交付记录</p>
                                ) : (
                                  <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {records.map((record: DeliveryRecord) => (
                                      <div key={record.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                                        <div>
                                          <p className="text-white text-sm font-medium">{record.orderId}</p>
                                          <p className="text-slate-400 text-xs">{formatDate(record.date)}</p>
                                        </div>
                                        <div className="text-right">
                                          <p className={'text-sm font-medium ' + getDeliveryStatusColor(record.status)}>
                                            {getDeliveryStatusText(record.status)}
                                          </p>
                                          <p className="text-slate-400 text-xs">
                                            实际 {record.actualDays}天 / 预计 {record.expectedDays}天
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
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
              <Award className="w-5 h-5 text-yellow-400" />
              供应商评级分布
            </h3>
            <ReactECharts option={ratingDistributionOption} style={{ height: '250px' }} theme="dark" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              交付时效趋势
            </h3>
            <ReactECharts option={deliveryTrendOption} style={{ height: '250px' }} theme="dark" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-blue-400" />
              供应商评级标准
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 font-medium mb-1">评级计算维度</p>
                <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                  <li>准交率: 40%</li>
                  <li>质量评分: 30%</li>
                  <li>响应速度: 20%</li>
                  <li>价格竞争力: 10%</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 font-medium mb-1">评级等级</p>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 text-xs">★★★★★ 4.5+</span>
                    <span className="text-slate-400 text-xs">优秀供应商</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-xs">★★★★☆ 4.0-4.4</span>
                    <span className="text-slate-400 text-xs">良好供应商</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 text-xs">★★★☆☆ 3.5-3.9</span>
                    <span className="text-slate-400 text-xs">合格供应商</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 text-xs">{'★★★☆☆ <3.5'}</span>
                    <span className="text-slate-400 text-xs">待改进供应商</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
