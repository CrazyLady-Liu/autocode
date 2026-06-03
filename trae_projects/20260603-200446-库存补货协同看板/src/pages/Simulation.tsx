import React, { useState, useMemo } from 'react';
import { Settings, AlertTriangle, Zap, Users, Layers, Play, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { skus, suppliers } from '../data/mockData';
import { SimulationConfig, SimulationScenario, Sku, ProcessingResult } from '../data/types';
import { handleZeroStock, handleMissingSupplier, handleTooManyAlerts, getRiskText } from '../utils/riskCalculator';

const scenarios: { key: SimulationScenario; label: string; description: string; icon: React.ReactNode }[] = [
  {
    key: 'zeroStock',
    label: '库存为0',
    description: '模拟SKU库存耗尽时的系统处理流程',
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  {
    key: 'missingSupplier',
    label: '供应商缺失',
    description: '模拟SKU无对应供应商时的处理逻辑',
    icon: <Users className="w-5 h-5" />,
  },
  {
    key: 'tooManyAlerts',
    label: '预警过多',
    description: '模拟大量预警时的批量处理机制',
    icon: <Layers className="w-5 h-5" />,
  },
  {
    key: 'normal',
    label: '正常状态',
    description: '查看正常状态下的基准数据',
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

export const Simulation: React.FC = () => {
  const [config, setConfig] = useState<SimulationConfig>({
    safetyStockThreshold: 50,
    highRiskDays: 3,
    mediumRiskDays: 7,
    maxAlerts: 10,
  });

  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>('zeroStock');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<ProcessingResult | null>(null);
  const [simulationStep, setSimulationStep] = useState(0);

  const testSku = useMemo(() => {
    switch (selectedScenario) {
      case 'zeroStock':
        return skus.find(s => s.currentStock === 0) || skus[0];
      case 'missingSupplier':
        return skus.find(s => !s.supplierId) || skus[4];
      case 'tooManyAlerts':
        return skus.filter(s => s.riskLevel === 'high')[0];
      default:
        return skus.find(s => s.riskLevel === 'low') || skus[5];
    }
  }, [selectedScenario]);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setSimulationResult(null);

    const steps = [500, 1000, 1500];
    steps.forEach((delay, index) => {
      setTimeout(() => {
        setSimulationStep(index + 2);
      }, delay);
    });

    setTimeout(() => {
      let result: ProcessingResult;
      switch (selectedScenario) {
        case 'zeroStock':
          result = handleZeroStock(testSku);
          break;
        case 'missingSupplier':
          result = handleMissingSupplier(testSku);
          break;
        case 'tooManyAlerts':
          const highRiskSkus = skus.filter(s => s.riskLevel === 'high');
          result = handleTooManyAlerts(highRiskSkus, config.maxAlerts);
          break;
        default:
          result = {
            level: 'normal',
            actions: ['系统运行正常', '无需特殊处理', '继续监控即可'],
          };
      }
      setSimulationResult(result);
      setIsSimulating(false);
      setSimulationStep(0);
    }, 2000);
  };

  const handleConfigChange = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">本地模拟预警</h2>
          <p className="text-gray-500 mt-1">自定义参数，模拟各类异常场景，验证处理逻辑</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card hover={false} className="col-span-1">
          <CardHeader title="参数配置" icon={<Settings className="w-5 h-5" />} />
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">安全库存阈值</span>
                <span className="font-medium text-blue-600">{config.safetyStockThreshold}</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                value={config.safetyStockThreshold}
                onChange={(e) => handleConfigChange('safetyStockThreshold', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">高风险天数</span>
                <span className="font-medium text-red-600">{config.highRiskDays}天</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={config.highRiskDays}
                onChange={(e) => handleConfigChange('highRiskDays', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">中风险天数</span>
                <span className="font-medium text-amber-600">{config.mediumRiskDays}天</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                value={config.mediumRiskDays}
                onChange={(e) => handleConfigChange('mediumRiskDays', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">预警批量阈值</span>
                <span className="font-medium text-emerald-600">{config.maxAlerts}条</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={config.maxAlerts}
                onChange={(e) => handleConfigChange('maxAlerts', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>
        </Card>

        <Card hover={false} className="col-span-1">
          <CardHeader title="场景选择" icon={<Zap className="w-5 h-5" />} />
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <button
                key={scenario.key}
                onClick={() => {
                  setSelectedScenario(scenario.key);
                  setSimulationResult(null);
                }}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedScenario === scenario.key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedScenario === scenario.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {scenario.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{scenario.label}</p>
                    <p className="text-xs text-gray-500">{scenario.description}</p>
                  </div>
                </div>
              </button>
            ))}

            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={runSimulation}
              disabled={isSimulating}
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  模拟中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  运行模拟
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card hover={false} className="col-span-2">
          <CardHeader title="模拟结果" />
          
          {isSimulating ? (
            <div className="py-8">
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">正在执行模拟流程...</span>
                  <span className="text-sm text-blue-600 font-medium">步骤 {simulationStep}/3</span>
                </div>
                <Progress value={simulationStep * 33} variant="default" height="h-3" />
                <div className="mt-6 space-y-3">
                  {['数据采集', '规则匹配', '生成建议'].map((step, index) => (
                    <div key={step} className="flex items-center space-x-3">
                      {simulationStep > index ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      ) : simulationStep === index + 1 ? (
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={`text-sm ${
                        simulationStep > index ? 'text-emerald-600' : 
                        simulationStep === index + 1 ? 'text-blue-600 font-medium' : 'text-gray-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : simulationResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    simulationResult.level === 'critical' ? 'bg-red-100 text-red-600' :
                    simulationResult.level === 'warning' ? 'bg-amber-100 text-amber-600' :
                    simulationResult.level === 'info' ? 'bg-blue-100 text-blue-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {simulationResult.level === 'critical' ? (
                      <XCircle className="w-6 h-6" />
                    ) : (
                      <CheckCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">测试SKU: {testSku.name}</p>
                    <p className="text-sm text-gray-500">
                      当前库存: {testSku.currentStock} | 风险等级: {getRiskText(testSku.riskLevel)}
                    </p>
                  </div>
                </div>
                <Badge variant={
                  simulationResult.level === 'critical' ? 'danger' :
                  simulationResult.level === 'warning' ? 'warning' :
                  simulationResult.level === 'info' ? 'info' : 'success'
                }>
                  {simulationResult.level === 'critical' ? '紧急' :
                   simulationResult.level === 'warning' ? '警告' :
                   simulationResult.level === 'info' ? '提示' : '正常'}
                </Badge>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  系统处理动作
                </h5>
                <div className="space-y-2">
                  {simulationResult.actions.map((action, index) => (
                    <div key={index} className="flex items-center p-3 bg-emerald-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {simulationResult.alternativeSuppliers && simulationResult.alternativeSuppliers.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    推荐替代供应商
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    {simulationResult.alternativeSuppliers.map((supplier) => (
                      <div key={supplier.id} className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-gray-800">{supplier.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          交付: {supplier.averageDeliveryTime}天 | 准时率: {supplier.onTimeRate}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {simulationResult.batchProcessList && simulationResult.batchProcessList.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                    <Layers className="w-4 h-4 mr-2" />
                    批量处理列表 (前{simulationResult.batchProcessList.length}项)
                  </h5>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {simulationResult.batchProcessList.map((sku, index) => (
                      <div key={sku.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                            {index + 1}
                          </span>
                          <span className="text-sm text-gray-700">{sku.name}</span>
                        </div>
                        <Badge variant={sku.riskLevel === 'high' ? 'danger' : sku.riskLevel === 'medium' ? 'warning' : 'success'}>
                          {getRiskText(sku.riskLevel)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">选择场景并点击"运行模拟"查看处理逻辑</p>
            </div>
          )}
        </Card>
      </div>

      <Card hover={false}>
        <CardHeader title="异常处理逻辑说明" subtitle="系统内置的核心业务规则" />
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h5 className="font-semibold text-red-800">库存为0处理</h5>
            </div>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• 自动标记为紧急补货优先级</li>
              <li>• 推送通知给采购和仓库人员</li>
              <li>• 搜索其他仓库库存建议调货</li>
              <li>• 推荐同品类替代SKU</li>
              <li>• 临时提升安全库存阈值</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-amber-600" />
              <h5 className="font-semibold text-amber-800">供应商缺失处理</h5>
            </div>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• 标记SKU为待分配状态</li>
              <li>• 匹配品类推荐历史供应商</li>
              <li>• 触发采购寻源工作流</li>
              <li>• 建议设置备用供应商</li>
              <li>• 定期巡检供应商覆盖度</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Layers className="w-5 h-5 text-blue-600" />
              <h5 className="font-semibold text-blue-800">预警过多处理</h5>
            </div>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• 按风险优先级排序批量处理</li>
              <li>• 建议配置自动补货规则</li>
              <li>• 分析高频预警优化安全库存</li>
              <li>• 核心供应商建议VMI模式</li>
              <li>• 生成库存健康度分析报告</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Simulation;
