import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  AlertTriangle,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  ChevronDown,
  Search,
  Filter,
  Zap,
  Target,
  Activity,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import RiskTag from '@/components/common/RiskTag';
import { useInventoryStore } from '@/store/useInventoryStore';
import { formatCurrency, formatDate, truncateText } from '@/utils/formatters';
import { generateTrendData } from '@/data/mockSKUs';
import type { SKUWithRisk, TrendDataPoint } from '@/types';

export default function Trends() {
  const { skusWithRisk, warehouses, suggestions, isLoading } = useInventoryStore();
  const [selectedSKUId, setSelectedSKUId] = useState<string | null>(skusWithRisk[0]?.id || null);
  const [timeRange, setTimeRange] = useState<string>('30');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = new Set(skusWithRisk.map((s) => s.category));
    return ['all', ...Array.from(cats)];
  }, [skusWithRisk]);

  const filteredSKUs = useMemo(() => {
    return skusWithRisk.filter((s) => {
      const matchCategory = categoryFilter === 'all' || s.category === categoryFilter;
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.skuCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [skusWithRisk, categoryFilter, searchQuery]);

  const selectedSKU = useMemo(() => {
    return skusWithRisk.find((s) => s.id === selectedSKUId);
  }, [skusWithRisk, selectedSKUId]);

  const trendData = useMemo(() => {
    if (!selectedSKUId) return [];
    return generateTrendData(selectedSKUId, parseInt(timeRange));
  }, [selectedSKUId, timeRange]);

  const totalStockValue = useMemo(() => {
    return skusWithRisk.reduce((sum, s) => sum + s.currentStock * s.unitCost, 0);
  }, [skusWithRisk]);

  const totalConsumption = useMemo(() => {
    return skusWithRisk.reduce((sum, s) => sum + s.avgDailyConsumption, 0);
  }, [skusWithRisk]);

  const stockTurnoverRate = useMemo(() => {
    const avgStock = skusWithRisk.reduce((sum, s) => sum + (s.currentStock + s.safetyStock) / 2, 0);
    const monthlyConsumption = totalConsumption * 30;
    return avgStock > 0 ? (monthlyConsumption / avgStock).toFixed(2) : '0';
  }, [skusWithRisk, totalConsumption]);

  const outOfStockCount = useMemo(() => {
    return skusWithRisk.filter((s) => s.currentStock === 0).length;
  }, [skusWithRisk]);

  const kpis = [
    {
      label: '库存总价值',
      value: formatCurrency(totalStockValue),
      change: 3.2,
      trend: 'up' as const,
      icon: 'DollarSign',
      color: '#3B82F6',
    },
    {
      label: '日均总消耗',
      value: totalConsumption,
      change: 5.8,
      trend: 'up' as const,
      icon: 'Activity',
      color: '#10B981',
    },
    {
      label: '库存周转率',
      value: stockTurnoverRate,
      change: -0.1,
      trend: 'down' as const,
      icon: 'TrendingUp',
      color: '#8B5CF6',
    },
    {
      label: '断货 SKU',
      value: outOfStockCount,
      change: outOfStockCount,
      trend: 'up' as const,
      icon: 'AlertTriangle',
      color: '#EF4444',
    },
  ];

  const stockTrendOption = useMemo(() => {
    if (!selectedSKU || trendData.length === 0) return {};

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        data: ['实际库存', '日均消耗', '预测库存'],
        textStyle: { color: '#94A3B8', fontSize: 11 },
        top: 0,
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: trendData.map((d) => d.date.slice(5)),
        axisLabel: { color: '#94A3B8', fontSize: 10, rotate: 45 },
        axisLine: { lineStyle: { color: '#334155' } },
      },
      yAxis: [
        {
          type: 'value',
          name: '库存数量',
          axisLabel: { color: '#94A3B8' },
          axisLine: { lineStyle: { color: '#334155' } },
          splitLine: { lineStyle: { color: '#1E293B' } },
        },
        {
          type: 'value',
          name: '消耗量',
          axisLabel: { color: '#94A3B8' },
          axisLine: { lineStyle: { color: '#334155' } },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: '实际库存',
          type: 'line',
          data: trendData.map((d) => d.stock),
          smooth: true,
          lineStyle: { color: '#3B82F6', width: 3 },
          itemStyle: { color: '#3B82F6' },
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
          markLine: {
            silent: true,
            lineStyle: { color: '#F59E0B', type: 'dashed', width: 2 },
            data: [{ yAxis: selectedSKU.safetyStock, label: { formatter: '安全库存', color: '#F59E0B' } }],
          },
        },
        {
          name: '日均消耗',
          type: 'bar',
          yAxisIndex: 1,
          data: trendData.map((d) => d.consumption),
          itemStyle: {
            color: 'rgba(16, 185, 129, 0.6)',
            borderRadius: [4, 4, 0, 0],
          },
          barWidth: '40%',
        },
        {
          name: '预测库存',
          type: 'line',
          data: trendData.map((d) => (d.forecast !== undefined ? d.forecast : null)),
          smooth: true,
          lineStyle: { color: '#8B5CF6', width: 2, type: 'dashed' },
          itemStyle: { color: '#8B5CF6' },
        },
      ],
    };
  }, [selectedSKU, trendData]);

  const categoryDistributionOption = useMemo(() => {
    const categoryData: Record<string, { value: number; stock: number; consumption: number }> = {};

    skusWithRisk.forEach((sku) => {
      if (!categoryData[sku.category]) {
        categoryData[sku.category] = { value: 0, stock: 0, consumption: 0 };
      }
      categoryData[sku.category].value++;
      categoryData[sku.category].stock += sku.currentStock;
      categoryData[sku.category].consumption += sku.avgDailyConsumption;
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}个SKU ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        textStyle: { color: '#94A3B8', fontSize: 11 },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#0F172A',
            borderWidth: 2,
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#fff' },
          },
          data: Object.entries(categoryData).map(([name, data], index) => ({
            value: data.value,
            name,
            itemStyle: {
              color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899'][index % 6],
            },
          })),
        },
      ],
    };
  }, [skusWithRisk]);

  const replenishmentEffectOption = useMemo(() => {
    const weeks = ['第1周', '第2周', '第3周', '第4周'];
    const replenishmentQty = [1200, 1800, 1500, 2200];
    const consumptionQty = [1000, 1200, 1400, 1600];
    const stockLevel = [800, 1400, 1500, 2100];

    return {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      legend: {
        data: ['补货数量', '消耗数量', '库存水平'],
        textStyle: { color: '#94A3B8', fontSize: 11 },
        top: 0,
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: weeks,
        axisLabel: { color: '#94A3B8', fontSize: 11 },
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
          name: '补货数量',
          type: 'bar',
          data: replenishmentQty,
          itemStyle: { color: '#10B981', borderRadius: [4, 4, 0, 0] },
          barWidth: '25%',
        },
        {
          name: '消耗数量',
          type: 'bar',
          data: consumptionQty,
          itemStyle: { color: '#F59E0B', borderRadius: [4, 4, 0, 0] },
          barWidth: '25%',
        },
        {
          name: '库存水平',
          type: 'line',
          data: stockLevel,
          smooth: true,
          lineStyle: { color: '#3B82F6', width: 3 },
          itemStyle: { color: '#3B82F6' },
          symbol: 'circle',
          symbolSize: 8,
        },
      ],
    };
  }, []);

  const riskTrendOption = useMemo(() => {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    return {
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['紧急', '高风险', '中风险', '低风险'],
        textStyle: { color: '#94A3B8', fontSize: 11 },
        top: 0,
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: days,
        axisLabel: { color: '#94A3B8', fontSize: 11 },
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
          name: '紧急',
          type: 'line',
          data: [3, 2, 4, 3, 5, 4, 3],
          stack: 'total',
          areaStyle: { color: 'rgba(239, 68, 68, 0.3)' },
          lineStyle: { color: '#EF4444', width: 2 },
          itemStyle: { color: '#EF4444' },
        },
        {
          name: '高风险',
          type: 'line',
          data: [5, 6, 4, 7, 5, 6, 4],
          stack: 'total',
          areaStyle: { color: 'rgba(249, 115, 22, 0.3)' },
          lineStyle: { color: '#F97316', width: 2 },
          itemStyle: { color: '#F97316' },
        },
        {
          name: '中风险',
          type: 'line',
          data: [8, 7, 9, 6, 8, 7, 9],
          stack: 'total',
          areaStyle: { color: 'rgba(245, 158, 11, 0.3)' },
          lineStyle: { color: '#F59E0B', width: 2 },
          itemStyle: { color: '#F59E0B' },
        },
        {
          name: '低风险',
          type: 'line',
          data: [12, 15, 10, 14, 12, 16, 13],
          stack: 'total',
          areaStyle: { color: 'rgba(16, 185, 129, 0.3)' },
          lineStyle: { color: '#10B981', width: 2 },
          itemStyle: { color: '#10B981' },
        },
      ],
    };
  }, []);

  const topConsumingSKUs = useMemo(() => {
    return [...skusWithRisk]
      .sort((a, b) => b.avgDailyConsumption - a.avgDailyConsumption)
      .slice(0, 5);
  }, [skusWithRisk]);

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
          <h1 className="text-2xl font-bold text-white">趋势概览</h1>
          <p className="text-slate-400 mt-1">库存趋势、消耗预测、补货效果分析</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          数据实时更新
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
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-400" />
                {selectedSKU ? `${selectedSKU.name} 库存趋势` : '库存趋势分析'}
              </h3>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="7">最近7天</option>
                  <option value="14">最近14天</option>
                  <option value="30">最近30天</option>
                  <option value="60">最近60天</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? '全部品类' : cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {filteredSKUs.map((sku) => (
                  <button
                    key={sku.id}
                    onClick={() => setSelectedSKUId(sku.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      selectedSKUId === sku.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {sku.skuCode}
                  </button>
                ))}
              </div>
            </div>

            {selectedSKU && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-slate-400 text-xs">当前库存</p>
                  <p className="text-white text-lg font-semibold">{selectedSKU.currentStock}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-slate-400 text-xs">安全库存</p>
                  <p className="text-amber-400 text-lg font-semibold">{selectedSKU.safetyStock}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-slate-400 text-xs">日均消耗</p>
                  <p className="text-emerald-400 text-lg font-semibold">
                    {selectedSKU.avgDailyConsumption}
                  </p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-slate-400 text-xs">风险等级</p>
                  <RiskTag level={selectedSKU.risk.level} size="sm" />
                </div>
              </div>
            )}

            <ReactECharts
              option={stockTrendOption}
              style={{ height: '320px' }}
              theme="dark"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
            >
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                补货效果分析
              </h3>
              <ReactECharts
                option={replenishmentEffectOption}
                style={{ height: '250px' }}
                theme="dark"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
            >
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-purple-400" />
                风险趋势
              </h3>
              <ReactECharts
                option={riskTrendOption}
                style={{ height: '250px' }}
                theme="dark"
              />
            </motion.div>
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
              <PieChart className="w-5 h-5 text-amber-400" />
              品类分布
            </h3>
            <ReactECharts
              option={categoryDistributionOption}
              style={{ height: '220px' }}
              theme="dark"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-red-400" />
              高消耗 SKU
            </h3>
            <div className="space-y-3">
              {topConsumingSKUs.map((sku, index) => (
                <div
                  key={sku.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedSKUId(sku.id)}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{
                      backgroundColor:
                        index === 0
                          ? '#EF4444'
                          : index === 1
                          ? '#F97316'
                          : index === 2
                          ? '#F59E0B'
                          : '#3B82F6',
                    }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {truncateText(sku.name, 15)}
                    </p>
                    <p className="text-slate-400 text-xs">{sku.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-sm font-medium">
                      {sku.avgDailyConsumption}/天
                    </p>
                    <RiskTag level={sku.risk.level} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-400" />
              预测指标
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">7天缺货风险</span>
                  <span className="text-red-400 text-sm font-medium">23%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full"
                    style={{ width: '23%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">30天库存充足率</span>
                  <span className="text-emerald-400 text-sm font-medium">78%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    style={{ width: '78%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">预测补货成本</span>
                  <span className="text-blue-400 text-sm font-medium">¥12.5万</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-sm">库存周转优化空间</span>
                  <span className="text-purple-400 text-sm font-medium">+15%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                    style={{ width: '15%' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              趋势分析说明
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 font-medium mb-1">库存趋势</p>
                <p className="text-slate-400 text-xs">
                  蓝色实线为实际库存，紫色虚线为基于当前消耗率的预测库存，橙色虚线为安全库存线
                </p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 font-medium mb-1">补货效果</p>
                <p className="text-slate-400 text-xs">
                  对比每周补货量与消耗量，评估补货策略的有效性
                </p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-slate-300 font-medium mb-1">预测模型</p>
                <p className="text-slate-400 text-xs">
                  采用移动平均法结合季节性因子，预测准确率约 85%
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
