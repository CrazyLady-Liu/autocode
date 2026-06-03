import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useActivityStore } from '../../store/useActivityStore';
import {
  RULE_CONDITION_OPTIONS,
  RULE_ACTION_OPTIONS,
  COMPARISON_OPERATORS,
  CHANNEL_TYPE_MAP,
} from '../../types/activity';
import type { RuleCondition, RuleAction, ActivityRule } from '../../types/activity';

interface RuleCardProps {
  rule: ActivityRule;
  ruleIndex: number;
  errorFields: Set<string>;
}

const RuleCard = ({ rule, ruleIndex, errorFields }: RuleCardProps) => {
  const {
    selectedActivity,
    selectedChannelId,
    selectChannel,
    updateRule,
    deleteRule,
    addCondition,
    updateCondition,
    deleteCondition,
    addAction,
    updateAction,
    deleteAction,
    toggleChannelRule,
  } = useActivityStore();

  const [expanded, setExpanded] = useState(true);

  if (!selectedActivity) return null;

  const enabledChannels = selectedActivity.channels.filter(c => c.enabled && c.status === 'available');
  const activeChannelId = selectedChannelId || enabledChannels[0]?.id;
  const activeChannel = selectedActivity.channels.find(c => c.id === activeChannelId);
  const channelRule = rule.channelRules.find(cr => cr.channelId === activeChannelId);

  const hasError = errorFields.has(`rules-${rule.id}`) || errorFields.has(`rules-${rule.id}-${activeChannelId}`);

  const renderConditionValue = (condition: RuleCondition, onChange: (value: any) => void) => {
    if (condition.type === 'region') {
      return (
        <select
          value={condition.value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
        >
          <option value="">请选择地区</option>
          {['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉'].map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      );
    }
    if (condition.type === 'time_range') {
      return (
        <div className="flex-1 flex gap-2">
          <input
            type="date"
            value={condition.value?.start || ''}
            onChange={e => onChange({ ...condition.value, start: e.target.value })}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <span className="text-gray-400 self-center">至</span>
          <input
            type="date"
            value={condition.value?.end || ''}
            onChange={e => onChange({ ...condition.value, end: e.target.value })}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      );
    }
    return (
      <input
        type="number"
        value={condition.value}
        onChange={e => onChange(Number(e.target.value))}
        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
        placeholder="请输入值"
      />
    );
  };

  const renderActionValue = (action: RuleAction, onChange: (value: any) => void) => {
    if (action.type === 'coupon') {
      return (
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="number"
            value={action.value?.amount || ''}
            onChange={e => onChange({ ...action.value, amount: Number(e.target.value) })}
            className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="金额"
          />
          <span className="text-gray-500 text-sm">元，满</span>
          <input
            type="number"
            value={action.value?.threshold || ''}
            onChange={e => onChange({ ...action.value, threshold: Number(e.target.value) })}
            className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="门槛"
          />
          <span className="text-gray-500 text-sm">元可用</span>
        </div>
      );
    }
    if (action.type === 'gift') {
      return (
        <input
          type="text"
          value={action.value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="请输入礼品名称"
        />
      );
    }
    return (
      <input
        type="number"
        value={action.value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-24 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
        placeholder={action.type === 'discount' ? '1-100' : '请输入值'}
      />
    );
  };

  if (!activeChannel || !channelRule) return null;

  return (
    <div className={`border rounded-lg mb-3 transition-all ${hasError ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}>
      <div
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-t-lg cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <GripVertical size={16} className="text-gray-400 cursor-move" />
        {expanded ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}

        <div className="flex-1">
          <input
            type="text"
            value={rule.name}
            onChange={e => updateRule(rule.id, { name: e.target.value })}
            placeholder="规则名称"
            className={`w-full bg-transparent font-medium text-gray-800 focus:outline-none ${
              errorFields.has(`rules-${rule.id}`) ? 'text-red-500 placeholder-red-300' : ''
            }`}
            onClick={e => e.stopPropagation()}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{rule.channelRules.filter(cr => cr.enabled).length} 个渠道</span>
          <button
            onClick={e => { e.stopPropagation(); deleteRule(rule.id); }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            title="删除规则"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-3">
          <input
            type="text"
            value={rule.description}
            onChange={e => updateRule(rule.id, { description: e.target.value })}
            placeholder="规则描述（可选）"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />

          <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
            {selectedActivity.channels.filter(c => c.enabled).map(channel => {
              const cr = rule.channelRules.find(r => r.channelId === channel.id);
              const isActive = activeChannelId === channel.id;
              const channelError = errorFields.has(`rules-${rule.id}-${channel.id}`);
              return (
                <div key={channel.id} className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => selectChannel(channel.id)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#1E3A5F] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${channelError ? 'ring-2 ring-red-400' : ''}`}
                  >
                    {CHANNEL_TYPE_MAP[channel.type]}
                  </button>
                  {cr && (
                    <button
                      onClick={e => { e.stopPropagation(); toggleChannelRule(rule.id, channel.id, !cr.enabled); }}
                      className={`w-2 h-2 rounded-full ${cr.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                      title={cr.enabled ? '已启用' : '已禁用'}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {channelRule && channelRule.enabled && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700">触发条件</h5>
                  <button
                    onClick={() => addCondition(rule.id, activeChannelId)}
                    className="flex items-center gap-1 text-xs text-[#2DD4BF] hover:text-teal-600"
                  >
                    <Plus size={14} /> 添加条件
                  </button>
                </div>
                <div className="space-y-2">
                  {channelRule.conditions.map((condition, idx) => (
                    <div key={condition.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
                      <select
                        value={condition.type}
                        onChange={e => updateCondition(rule.id, activeChannelId, condition.id, {
                          type: e.target.value as any,
                          label: RULE_CONDITION_OPTIONS.find(o => o.value === e.target.value)?.label || '',
                          value: undefined,
                        })}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        {RULE_CONDITION_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        value={condition.operator}
                        onChange={e => updateCondition(rule.id, activeChannelId, condition.id, { operator: e.target.value as any })}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        {COMPARISON_OPERATORS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {renderConditionValue(condition, (value) =>
                        updateCondition(rule.id, activeChannelId, condition.id, { value })
                      )}
                      <button
                        onClick={() => deleteCondition(rule.id, activeChannelId, condition.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-700">执行动作</h5>
                  <button
                    onClick={() => addAction(rule.id, activeChannelId)}
                    className="flex items-center gap-1 text-xs text-[#2DD4BF] hover:text-teal-600"
                  >
                    <Plus size={14} /> 添加动作
                  </button>
                </div>
                <div className="space-y-2">
                  {channelRule.actions.map((action, idx) => (
                    <div key={action.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-400 w-6">{idx + 1}.</span>
                      <select
                        value={action.type}
                        onChange={e => updateAction(rule.id, activeChannelId, action.id, {
                          type: e.target.value as any,
                          label: RULE_ACTION_OPTIONS.find(o => o.value === e.target.value)?.label || '',
                          value: undefined,
                        })}
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500"
                      >
                        {RULE_ACTION_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <span className="text-sm text-gray-500">:</span>
                      {renderActionValue(action, (value) =>
                        updateAction(rule.id, activeChannelId, action.id, { value })
                      )}
                      <button
                        onClick={() => deleteAction(rule.id, activeChannelId, action.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {channelRule && !channelRule.enabled && (
            <div className="text-center py-4 text-gray-400 text-sm">
              该渠道规则已禁用，点击左侧小圆点启用
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const RuleEditor = () => {
  const { selectedActivity, addRule, validationResult } = useActivityStore();

  if (!selectedActivity) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p>请选择一个活动开始编辑</p>
        </div>
      </div>
    );
  }

  const errorFields = new Set(validationResult?.errors.map(e => e.location) || []);
  const enabledChannels = selectedActivity.channels.filter(c => c.enabled && c.status === 'available');

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">活动规则</h2>
          <button
            onClick={addRule}
            disabled={enabledChannels.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2DD4BF] text-white text-sm rounded-lg hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            添加规则
          </button>
        </div>

        {enabledChannels.length === 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 mb-3">
            请先在「投放渠道」中选择至少一个可用渠道
          </div>
        )}

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">活动名称</label>
          <input
            type="text"
            value={selectedActivity.name}
            onChange={e => useActivityStore.getState().updateActivityBasicInfo({ name: e.target.value })}
            placeholder="请输入活动名称"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
              errorFields.has('basic-info') && !selectedActivity.name ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
          <textarea
            value={selectedActivity.description}
            onChange={e => useActivityStore.getState().updateActivityBasicInfo({ description: e.target.value })}
            placeholder="请输入活动描述"
            rows={2}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none ${
              errorFields.has('basic-info') && !selectedActivity.description ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
            <input
              type="datetime-local"
              value={selectedActivity.startTime ? selectedActivity.startTime.slice(0, 16) : ''}
              onChange={e => useActivityStore.getState().updateActivityBasicInfo({ startTime: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                errorFields.has('basic-info') && !selectedActivity.startTime ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束时间</label>
            <input
              type="datetime-local"
              value={selectedActivity.endTime ? selectedActivity.endTime.slice(0, 16) : ''}
              onChange={e => useActivityStore.getState().updateActivityBasicInfo({ endTime: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 ${
                errorFields.has('basic-info') && !selectedActivity.endTime ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
          <div className="flex gap-3">
            {selectedActivity.coverImage ? (
              <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={selectedActivity.coverImage}
                  alt="封面"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => useActivityStore.getState().updateActivityBasicInfo({ coverImage: '' })}
                  className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded hover:bg-black/70"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ) : (
              <div className={`w-32 h-20 rounded-lg border-2 border-dashed flex items-center justify-center text-sm ${
                errorFields.has('basic-info') ? 'border-red-400 text-red-400' : 'border-gray-300 text-gray-400'
              }`}>
                无封面图
              </div>
            )}
            <input
              type="text"
              value={selectedActivity.coverImage}
              onChange={e => useActivityStore.getState().updateActivityBasicInfo({ coverImage: e.target.value })}
              placeholder="请输入封面图片URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {selectedActivity.rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <p className="text-sm mb-2">暂无规则配置</p>
            <button
              onClick={addRule}
              disabled={enabledChannels.length === 0}
              className="text-[#2DD4BF] text-sm hover:underline disabled:opacity-50"
            >
              添加第一条规则
            </button>
          </div>
        ) : (
          selectedActivity.rules.map((rule, idx) => (
            <RuleCard key={rule.id} rule={rule} ruleIndex={idx} errorFields={errorFields} />
          ))
        )}
      </div>
    </div>
  );
};
