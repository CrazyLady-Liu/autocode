import { useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle, Settings, CheckCircle2 } from 'lucide-react';
import { useActivityStore } from '../../store/useActivityStore';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { StatusBadge } from '../common/StatusBadge';
import { CHANNEL_TYPE_MAP } from '../../types/activity';
import type { Channel } from '../../types/activity';

interface ChannelCardProps {
  channel: Channel;
  hasError: boolean;
  hasWarning: boolean;
}

const ChannelCard = ({ channel, hasError, hasWarning }: ChannelCardProps) => {
  const { toggleChannel, updateChannelParams, validationResult, selectChannel, selectedChannelId, selectedActivity } = useActivityStore();
  const [expanded, setExpanded] = useState(false);

  const isSelected = selectedChannelId === channel.id;

  const handleToggle = (enabled: boolean) => {
    toggleChannel(channel.id, enabled);
    if (enabled && channel.status === 'available') {
      selectChannel(channel.id);
    } else if (!enabled && isSelected && selectedActivity) {
      const nextEnabledChannel = selectedActivity.channels.find(
        c => c.id !== channel.id && c.enabled && c.status === 'available'
      );
      selectChannel(nextEnabledChannel?.id || null);
    }
  };

  const isDisabled = channel.status !== 'available';
  const warnings = validationResult?.warnings.filter(w => w.location === `channels-${channel.id}`) || [];
  const errors = validationResult?.errors.filter(e => e.location === `channels-${channel.id}`) || [];

  const positionOptions = [
    { value: 'top', label: '顶部Banner' },
    { value: 'middle', label: '中部卡片' },
    { value: 'bottom', label: '底部浮层' },
    { value: 'popup', label: '弹窗' },
  ];

  const handleHeaderClick = (e: React.MouseEvent) => {
    setExpanded(!expanded);
    if (channel.enabled && channel.status === 'available') {
      selectChannel(channel.id);
    }
  };

  return (
    <div
      className={`border rounded-lg mb-2 transition-all ${
        isSelected && channel.enabled ? 'border-[#2DD4BF] ring-1 ring-[#2DD4BF] bg-teal-50/50' :
        hasError ? 'border-red-300 bg-red-50/30' :
        hasWarning ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-200'
      }`}
    >
      <div
        className={`flex items-center gap-3 p-3 cursor-pointer ${channel.enabled ? 'hover:bg-gray-50' : ''}`}
        onClick={handleHeaderClick}
      >
        {expanded ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}

        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E3A5F] to-[#2DD4BF] flex items-center justify-center text-white font-bold text-sm">
          {CHANNEL_TYPE_MAP[channel.type].charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-800 text-sm truncate">{channel.name}</h4>
            {isDisabled && (
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StatusBadge status={channel.status} type="channel" />
            {isDisabled && channel.unavailableReason && (
              <span className="text-xs text-red-500">{channel.unavailableReason}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {channel.enabled && !isDisabled && (
            <CheckCircle2 size={16} className="text-green-500" />
          )}
          <ToggleSwitch
            checked={channel.enabled}
            onChange={handleToggle}
            disabled={isDisabled}
          />
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-100">
          {(errors.length > 0 || warnings.length > 0) && (
            <div className="mt-3 space-y-1">
              {errors.map(err => (
                <div key={err.id} className="flex items-start gap-1.5 text-xs text-red-600">
                  <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{err.message}</span>
                </div>
              ))}
              {warnings.map(warn => (
                <div key={warn.id} className="flex items-start gap-1.5 text-xs text-yellow-600">
                  <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                  <span>{warn.message}</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <Settings size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">渠道参数</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">展示位置</label>
                <select
                  value={channel.params.position || ''}
                  onChange={e => updateChannelParams(channel.id, { position: e.target.value })}
                  disabled={!channel.enabled}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">请选择</option>
                  {positionOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">展示优先级</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={channel.params.priority || ''}
                  onChange={e => updateChannelParams(channel.id, { priority: Number(e.target.value) })}
                  disabled={!channel.enabled}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder="1-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">渠道备注</label>
              <textarea
                value={channel.params.remark || ''}
                onChange={e => updateChannelParams(channel.id, { remark: e.target.value })}
                disabled={!channel.enabled}
                rows={2}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-gray-100 disabled:text-gray-400 resize-none"
                placeholder="选填，渠道投放备注信息"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ChannelPanel = () => {
  const { selectedActivity, validationResult } = useActivityStore();

  if (!selectedActivity) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>请选择一个活动</p>
      </div>
    );
  }

  const errorFields = new Set(validationResult?.errors.map(e => e.location) || []);
  const warningFields = new Set(validationResult?.warnings.map(w => w.location) || []);

  const enabledCount = selectedActivity.channels.filter(c => c.enabled).length;
  const availableCount = selectedActivity.channels.filter(c => c.status === 'available').length;

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">投放渠道</h2>
          <span className="text-xs text-gray-500">
            已选 {enabledCount}/{availableCount} 个可用渠道
          </span>
        </div>

        {errorFields.has('channels') && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-center gap-1.5">
            <AlertCircle size={12} />
            <span>{validationResult?.errors.find(e => e.location === 'channels')?.message}</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {selectedActivity.channels.map(channel => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            hasError={errorFields.has(`channels-${channel.id}`)}
            hasWarning={warningFields.has(`channels-${channel.id}`)}
          />
        ))}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>可用 {selectedActivity.channels.filter(c => c.status === 'available').length}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>维护中 {selectedActivity.channels.filter(c => c.status === 'maintenance').length}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>不可用 {selectedActivity.channels.filter(c => c.status === 'unavailable').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
