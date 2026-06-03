import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Package, Users, TrendingUp } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import KPICard from '@/components/common/KPICard';
import StatusBadge from '@/components/common/StatusBadge';
import RiskTag from '@/components/common/RiskTag';
import { useInventoryStore } from '@/store/useInventoryStore';
import { useSupplierStore } from '@/store/useSupplierStore';
import { formatCurrency, formatRelativeTime, truncateText } from '@/utils/formatters';
import { getRiskLevelColor } from '@/utils/riskCalculator';

export default function Dashboard() {
  const navigate = useNavigate();
  const { getKPIs, alerts, suggestions, warehouses, skusWithRisk, isLoading } = useInventoryStore();
  const { suppliers, getTopSuppliers } = useSupplierStore();

  const kpis = getKPIs();
  const topSuppliers = getTopSuppliers(5);

  const riskDistributionOption = {
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: '#94A3B8' },
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#0F172A',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff',
          },
        },
        data: [
          { value: skusWithRisk.filter(s => s.risk.level === 'critical').length, name: '紧急', itemStyle: { color: '#EF4444' } },
          { value: skusWithRisk.filter(s => s.risk.level === 'high').length, name: '高风险', itemStyle: { color: '#F59E0B' } },
          { value: skusWithRisk.filter(s => s.risk.level === 'medium').length, name: '中风险', itemStyle: { color: '#EAB308' } },
          { value: skusWithRisk.filter(s => s.risk.level === 'low').length, name: '低风险', itemStyle: { color: '#10B981' } },
        ],
      },
    ],
  };

  const warehouseCapacityOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: warehouses.map(w => w.name),
      axisLabel: { color: '#94A3B8', fontSize: 11, rotate: 30 },
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
        type: 'bar',
        data: warehouses.map(w => Math.round((w.usedCapacity / w.totalCapacity) * 100)),
        itemStyle: {
          color: (params: any) => {
            const val = params.value;
            if (val > 90) return '#EF4444';
            if (val > 75) return '#F59E0B';
            return '#10B981';
          },
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '50%',
      },
      {
        type: 'line',
        data: warehouses.map(w => w.healthScore),
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { color: '#3B82F6', width: 2 },
        itemStyle: { color: '#3B82F6' },
        yAxisIndex: 0,
      },
    ],
  };

  const newAlerts = alerts.filter(a => a.status === 'new').slice(0, 5);

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
          <h1 className="text-2xl font-bold text-white">总览看板</h1>
          <p className="text-slate-400 mt-1">实时监控库存状态与供应链健康度</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          系统运行正常
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.label} data={kpi} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              实时告警
            </h3>
            <button
              onClick={() => navigate('/sku-risk')}
              className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
            >
              全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {newAlerts.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">暂无新告警</p>
            ) : (
              newAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer border border-transparent hover:border-slate-600"
                  onClick={() => navigate('/sku-risk')}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0 animate-pulse"
                    style={{ backgroundColor: getRiskLevelColor(alert.level) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <RiskTag level={alert.level} size="sm" />
                      <span className="text-slate-400 text-xs">
                        {formatRelativeTime(alert.createdAt)}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium truncate">
                      {alert.skuName}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {alert.description}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              风险分布
            </h3>
            <button
              onClick={() => navigate('/sku-risk')}
              className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
            >
              详情 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <ReactECharts
            option={riskDistributionOption}
            style={{ height: '240px' }}
            theme="dark"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              核心供应商
            </h3>
            <button
              onClick={() => navigate('/suppliers')}
              className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
            >
              全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {topSuppliers.map((supplier, index) => (
              <div
                key={supplier.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/30 transition-colors cursor-pointer"
                onClick={() => navigate('/suppliers')}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {supplier.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {supplier.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xs">
                      {'★'.repeat(Math.floor(supplier.rating))}
                      {'☆'.repeat(5 - Math.floor(supplier.rating))}
                    </span>
                    <span className="text-slate-400 text-xs">
                      准交率 {supplier.onTimeRate}%
                    </span>
                  </div>
                </div>
                <StatusBadge status={supplier.status} size="sm" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              仓库库容与健康度
            </h3>
            <button
              onClick={() => navigate('/warehouses')}
              className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
            >
              详情 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <ReactECharts
            option={warehouseCapacityOption}
            style={{ height: '280px' }}
            theme="dark"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-400" />
              补货建议队列
            </h3>
            <button
              onClick={() => navigate('/replenishment')}
              className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
            >
              全部 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <div
                key={suggestion.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                onClick={() => navigate('/replenishment')}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{
                    backgroundColor: index === 0 ? '#EF4444' : index === 1 ? '#F97316' : '#3B82F6',
                  }}
                >
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {suggestion.skuName}
                  </p>
                  <p className="text-slate-400 text-xs">
                    建议补货 {suggestion.suggestedQuantity} 件 · {formatCurrency(suggestion.estimatedCost)}
                  </p>
                </div>
                <StatusBadge status={suggestion.status} size="sm" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
