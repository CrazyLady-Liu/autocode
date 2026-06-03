import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  RotateCcw,
  Settings,
  AlertTriangle,
  AlertCircle,
  Zap,
  Target,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Info,
  Layers,
  Activity,
  ShieldAlert,
  PackageX,
  Users,
  Gauge,
  Volume2,
  VolumeX,
} from 'lucide-react';
import KPICard from '@/components/common/KPICard';
import RiskTag from '@/components/common/RiskTag';
import { useSimulationStore } from '@/store/useSimulationStore';
import {
  scenarioConfigs,
  logicFlowSteps,
  logicFlowConnections,
  type SimulationScenario,
} from '@/utils/simulationEngine';
import { formatCurrency } from '@/utils/formatters';

export default function Simulation() {
  const {
    params,
    currentScenario,
    results,
    isSimulating,
    highlightedStep,
    activePath,
    setParams,
    setScenario,
    runSimulation,
    resetParams,
    setHighlightedStep,
  } = useSimulationStore();

  const [showFlowDetail, setShowFlowDetail] = useState<string | null>(null);

  const scenarios: SimulationScenario[] = [
    'baseline',
    'stock_zero',
    'supplier_outage',
    'demand_surge',
    'lead_time_delay',
    'multi_factor',
  ];

  const getScenarioIcon = (scenario: SimulationScenario) => {
    switch (scenario) {
      case 'baseline':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'stock_zero':
        return <PackageX className="w-5 h-5" />;
      case 'supplier_outage':
        return <Users className="w-5 h-5" />;
      case 'demand_surge':
        return <TrendingUp className="w-5 h-5" />;
      case 'lead_time_delay':
        return <Clock className="w-5 h-5" />;
      case 'multi_factor':
        return <ShieldAlert className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getScenarioColor = (scenario: SimulationScenario) => {
    switch (scenario) {
      case 'baseline':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' };
      case 'stock_zero':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
      case 'supplier_outage':
        return { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' };
      case 'demand_surge':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' };
      case 'lead_time_delay':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' };
      case 'multi_factor':
        return { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' };
      default:
        return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400' };
    }
  };

  const isStepActive = (stepId: string) => activePath.includes(stepId);
  const isStepHighlighted = (stepId: string) => highlightedStep === stepId;

  const getStepPosition = (stepId: string) => {
    const positions: Record<string, { x: number; y: number }> = {
      detect: { x: 50, y: 8 },
      stock_check: { x: 50, y: 28 },
      supplier_check: { x: 50, y: 48 },
      threshold_check: { x: 50, y: 68 },
      emergency: { x: 15, y: 48 },
      supplier_alert: { x: 85, y: 58 },
      noise_reduction: { x: 85, y: 78 },
      normal: { x: 15, y: 88 },
    };
    return positions[stepId] || { x: 50, y: 50 };
  };

  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case 'detect':
        return <Activity className="w-4 h-4" />;
      case 'stock_check':
        return <PackageX className="w-4 h-4" />;
      case 'supplier_check':
        return <Users className="w-4 h-4" />;
      case 'threshold_check':
        return <Gauge className="w-4 h-4" />;
      case 'emergency':
        return <AlertTriangle className="w-4 h-4" />;
      case 'supplier_alert':
        return <AlertCircle className="w-4 h-4" />;
      case 'noise_reduction':
        return <VolumeX className="w-4 h-4" />;
      case 'normal':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const resultKPIs = results
    ? [
        {
          label: '受影响 SKU',
          value: results.affectedSKUs,
          change: results.affectedSKUs,
          trend: 'up' as const,
          icon: 'Package',
          color: '#F59E0B',
        },
        {
          label: '紧急告警',
          value: results.criticalAlerts,
          change: results.criticalAlerts,
          trend: 'up' as const,
          icon: 'AlertTriangle',
          color: '#EF4444',
        },
        {
          label: '高风险告警',
          value: results.highAlerts,
          change: results.highAlerts,
          trend: 'up' as const,
          icon: 'AlertCircle',
          color: '#F97316',
        },
        {
          label: '成本影响',
          value: formatCurrency(results.costImpact),
          change: Math.round(results.costImpact / 1000),
          trend: 'up' as const,
          icon: 'DollarSign',
          color: '#8B5CF6',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">模拟预警</h1>
          <p className="text-slate-400 mt-1">参数配置、场景模拟、处理逻辑可视化</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          模拟引擎就绪
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-blue-400" />
              模拟场景
            </h3>
            <div className="space-y-2">
              {scenarios.map((scenario) => {
                const config = scenarioConfigs[scenario];
                const colors = getScenarioColor(scenario);
                const isSelected = currentScenario === scenario;

                return (
                  <button
                    key={scenario}
                    onClick={() => setScenario(scenario)}
                    className={`w-full p-3 rounded-xl border transition-all text-left ${
                      isSelected
                        ? `${colors.bg} ${colors.border} ring-2 ${colors.border}`
                        : 'bg-slate-700/30 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg} ${colors.text}`}
                      >
                        {getScenarioIcon(scenario)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`font-medium ${isSelected ? colors.text : 'text-white'}`}
                          >
                            {config.name}
                          </h4>
                          {isSelected && (
                            <CheckCircle2 className={`w-4 h-4 ${colors.text}`} />
                          )}
                        </div>
                        <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                          {config.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                参数配置
              </h3>
              <button
                onClick={resetParams}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                重置
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 text-sm flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    安全库存系数
                  </label>
                  <span className="text-white text-sm font-medium">
                    {params.safetyStockCoefficient.toFixed(1)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={params.safetyStockCoefficient}
                  onChange={(e) =>
                    setParams({ safetyStockCoefficient: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>0.5</span>
                  <span>1.5 (默认)</span>
                  <span>3.0</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 text-sm flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    预警阈值
                  </label>
                  <span className="text-white text-sm font-medium">
                    {Math.round(params.warningThreshold * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={params.warningThreshold}
                  onChange={(e) =>
                    setParams({ warningThreshold: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>30%</span>
                  <span>80% (默认)</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 text-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    交货期调整
                  </label>
                  <span className="text-white text-sm font-medium">
                    {params.leadTimeAdjustment > 0 ? '+' : ''}
                    {params.leadTimeAdjustment}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="100"
                  step="10"
                  value={params.leadTimeAdjustment}
                  onChange={(e) =>
                    setParams({ leadTimeAdjustment: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>-30%</span>
                  <span>0% (默认)</span>
                  <span>+100%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 text-sm flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    需求波动
                  </label>
                  <span className="text-white text-sm font-medium">
                    {params.demandFluctuation > 0 ? '+' : ''}
                    {params.demandFluctuation}%
                  </span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="100"
                  step="10"
                  value={params.demandFluctuation}
                  onChange={(e) =>
                    setParams({ demandFluctuation: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>-20%</span>
                  <span>0% (默认)</span>
                  <span>+100%</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 text-sm flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    预警降噪阈值
                  </label>
                  <span className="text-white text-sm font-medium">
                    {params.alertNoiseThreshold} 条
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={params.alertNoiseThreshold}
                  onChange={(e) =>
                    setParams({ alertNoiseThreshold: parseInt(e.target.value) })
                  }
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>5</span>
                  <span>10 (默认)</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  模拟运行中...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  运行模拟
                </>
              )}
            </button>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 border border-slate-700 rounded-xl p-5"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              异常处理逻辑流程图
            </h3>

            <div className="relative bg-slate-900/50 rounded-xl p-4" style={{ height: '420px' }}>
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                {logicFlowConnections.map((conn, index) => {
                  const fromPos = getStepPosition(conn.from);
                  const toPos = getStepPosition(conn.to);
                  const isActive =
                    activePath.includes(conn.from) && activePath.includes(conn.to);

                  const midX = (fromPos.x + toPos.x) / 2;
                  const midY = (fromPos.y + toPos.y) / 2;

                  return (
                    <g key={index}>
                      <line
                        x1={`${fromPos.x}%`}
                        y1={`${fromPos.y}%`}
                        x2={`${toPos.x}%`}
                        y2={`${toPos.y}%`}
                        stroke={isActive ? '#3B82F6' : '#334155'}
                        strokeWidth={isActive ? 2 : 1}
                        strokeDasharray={isActive ? 'none' : '5,5'}
                        className="transition-all duration-500"
                      />
                      {conn.label && (
                        <text
                          x={`${midX}%`}
                          y={`${midY}%`}
                          textAnchor="middle"
                          className={`text-xs ${isActive ? 'fill-blue-400' : 'fill-slate-500'}`}
                          style={{ transform: `translate(0, -5px)` }}
                        >
                          {conn.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              {logicFlowSteps.map((step) => {
                const pos = getStepPosition(step.id);
                const active = isStepActive(step.id);
                const highlighted = isStepHighlighted(step.id);
                const colors = getScenarioColor(currentScenario);

                return (
                  <motion.div
                    key={step.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                      highlighted ? 'z-20' : 'z-10'
                    }`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    onClick={() => setShowFlowDetail(showFlowDetail === step.id ? null : step.id)}
                    onMouseEnter={() => setHighlightedStep(step.id)}
                    onMouseLeave={() => setHighlightedStep(null)}
                  >
                    <div
                      className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                        active
                          ? `${colors.bg} ${colors.border} shadow-lg ${colors.text}`
                          : highlighted
                          ? 'bg-slate-700/50 border-slate-500 text-slate-300'
                          : 'bg-slate-800/80 border-slate-700 text-slate-500'
                      } ${highlighted ? 'scale-110' : ''}`}
                    >
                      {getStepIcon(step.id)}
                      <span className="text-[10px] mt-1 font-medium text-center leading-tight">
                        {step.label}
                      </span>
                    </div>

                    <AnimatePresence>
                      {showFlowDetail === step.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-slate-800 border border-slate-600 rounded-lg p-3 shadow-xl z-30"
                        >
                          <h4 className="text-white text-sm font-medium mb-1">{step.label}</h4>
                          <p className="text-slate-400 text-xs mb-2">{step.description}</p>
                          {step.condition && (
                            <p className="text-blue-400 text-xs font-mono bg-slate-900/50 px-2 py-1 rounded">
                              {step.condition}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-slate-400">当前路径</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-slate-600" />
                <span className="text-slate-400">其他分支</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                <span className="text-slate-400">库存归零</span>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX className="w-3 h-3 text-purple-400" />
                <span className="text-slate-400">预警降噪</span>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {resultKPIs.map((kpi, index) => (
                    <KPICard key={kpi.label} data={kpi} index={index} />
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-blue-400" />
                      模拟结果概要
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-slate-400 text-xs mb-1">模拟场景</p>
                        <p className="text-white font-medium">{results.scenario}</p>
                        <p className="text-slate-400 text-sm mt-1">{results.description}</p>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-slate-400 text-xs mb-1">告警分布</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1.5">
                            <RiskTag level="critical" size="sm" />
                            <span className="text-white font-medium">{results.criticalAlerts}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <RiskTag level="high" size="sm" />
                            <span className="text-white font-medium">{results.highAlerts}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <RiskTag level="medium" size="sm" />
                            <span className="text-white font-medium">{results.mediumAlerts}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-900/50 rounded-lg">
                        <p className="text-slate-400 text-xs mb-1">预计恢复周期</p>
                        <p className="text-emerald-400 font-medium">{results.timeline}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
                    <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-yellow-400" />
                      建议措施
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {results.recommendedActions.map((action, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/80 transition-colors"
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              index === 0
                                ? 'bg-red-500/20 text-red-400'
                                : index === 1
                                ? 'bg-orange-500/20 text-orange-400'
                                : index === 2
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            <span className="text-xs font-bold">{index + 1}</span>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">{action}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {(currentScenario === 'stock_zero' ||
                  currentScenario === 'supplier_outage' ||
                  currentScenario === 'multi_factor') && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`p-4 rounded-xl border ${
                      currentScenario === 'stock_zero'
                        ? 'bg-red-500/10 border-red-500/20'
                        : currentScenario === 'supplier_outage'
                        ? 'bg-orange-500/10 border-orange-500/20'
                        : 'bg-purple-500/10 border-purple-500/20'
                    }`}
                  >
                    <h4
                      className={`font-medium flex items-center gap-2 mb-3 ${
                        currentScenario === 'stock_zero'
                          ? 'text-red-400'
                          : currentScenario === 'supplier_outage'
                          ? 'text-orange-400'
                          : 'text-purple-400'
                      }`}
                    >
                      <AlertCircle className="w-5 h-5" />
                      特殊处理逻辑说明
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {currentScenario === 'stock_zero' && (
                        <>
                          <div className="p-3 bg-slate-900/30 rounded-lg">
                            <h5 className="text-red-400 text-xs font-medium mb-2">
                              库存归零紧急处理
                            </h5>
                            <ul className="text-slate-300/80 text-xs space-y-1 list-disc list-inside">
                              <li>触发红色脉冲告警，锁定 SKU 状态</li>
                              <li>检查是否有备选供应商，如有则自动切换</li>
                              <li>如无备选供应商，立即推送采购紧急处理</li>
                              <li>生成紧急补货单，优先进入处理队列</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-slate-900/30 rounded-lg">
                            <h5 className="text-red-400 text-xs font-medium mb-2">
                              应急响应机制
                            </h5>
                            <ul className="text-slate-300/80 text-xs space-y-1 list-disc list-inside">
                              <li>启动 24 小时应急值班机制</li>
                              <li>协调物流优先配送，必要时空运</li>
                              <li>与销售端沟通，调整促销节奏</li>
                              <li>每日跟踪补货进度，直到恢复正常</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {currentScenario === 'supplier_outage' && (
                        <>
                          <div className="p-3 bg-slate-900/30 rounded-lg">
                            <h5 className="text-orange-400 text-xs font-medium mb-2">
                              供应商缺失处理
                            </h5>
                            <ul className="text-slate-300/80 text-xs space-y-1 list-disc list-inside">
                              <li>触发黄色告警标记，禁止生成补货单</li>
                              <li>按品类推荐同品类高评级供应商</li>
                              <li>提供一键发起供应商询价功能</li>
                              <li>自动关联采购专员处理，3 个工作日内完成审核</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-slate-900/30 rounded-lg">
                            <h5 className="text-orange-400 text-xs font-medium mb-2">
                              备选供应商评估
                            </h5>
                            <ul className="text-slate-300/80 text-xs space-y-1 list-disc list-inside">
                              <li>自动匹配同品类评分前 3 名供应商</li>
                              <li>对比价格、交付期、准交率等指标</li>
                              <li>启动快速审核流程，24 小时内完成</li>
                              <li>小批量试单验证供应商能力</li>
                            </ul>
                          </div>
                        </>
                      )}
                      {currentScenario === 'multi_factor' && (
                        <>
                          <div className="p-3 bg-slate-900/30 rounded-lg">
                            <h5 className="text-purple-400 text-xs font-medium mb-2">
                              预警降噪处理
                            </h5>
                            <ul className="text-slate-300/80 text-xs space-y-1 list-disc list-inside">
                              <li>预警数量超过阈值时自动启动降噪</li>
                              <li>按风险等级聚合相似告警</li>
                              <li>自动抑制低优先级重复告警</li>
                              <li>生成摘要汇总通知，避免信息过载</li>
                            </ul>
                          </div>
                          <div className="p-3 bg-slate-900/30 rounded-lg">
                            <h5 className="text-purple-400 text-xs font-medium mb-2">
                              综合应急响应
                            </h5>
                            <ul className="text-slate-300/80 text-xs space-y-1 list-disc list-inside">
                              <li>成立应急小组，每日协调会议</li>
                              <li>临时放宽采购审批流程</li>
                              <li>按优先级分类处理告警</li>
                              <li>持续监控，直到风险解除</li>
                            </ul>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!results && !isSimulating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/50 border border-slate-700/50 border-dashed rounded-xl p-12 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                <Play className="w-10 h-10 text-slate-500" />
              </div>
              <h3 className="text-slate-300 text-lg font-medium mb-2">等待运行模拟</h3>
              <p className="text-slate-500 text-sm">
                选择场景并调整参数后，点击"运行模拟"查看结果
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
