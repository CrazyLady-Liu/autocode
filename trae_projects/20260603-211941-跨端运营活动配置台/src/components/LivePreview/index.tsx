import { useActivityStore } from '../../store/useActivityStore';
import { CHANNEL_TYPE_MAP, CHANNEL_STATUS_MAP, ACTIVITY_STATUS_MAP } from '../../types/activity';
import { Smartphone, Monitor, Tablet, Gift, Tag, Clock, Users, Play, Pause, FileText, CheckCircle, XCircle } from 'lucide-react';

export const LivePreview = () => {
  const {
    selectedActivity,
    previewChannelId,
    selectPreviewChannel,
    selectedChannelId,
    selectChannel,
  } = useActivityStore();

  if (!selectedActivity) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-gray-50">
        <div className="text-center">
          <Smartphone size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">请选择一个活动预览</p>
        </div>
      </div>
    );
  }

  const enabledChannels = selectedActivity.channels.filter(c => c.enabled && c.status === 'available');
  const activeChannelId = previewChannelId || selectedChannelId || enabledChannels[0]?.id;
  const activeChannel = selectedActivity.channels.find(c => c.id === activeChannelId);

  const handleChannelChange = (channelId: string) => {
    selectPreviewChannel(channelId);
    selectChannel(channelId);
  };

  const getActivityStatusIcon = () => {
    switch (selectedActivity.status) {
      case 'active': return <Play size={12} />;
      case 'paused': return <Pause size={12} />;
      case 'ended': return <XCircle size={12} />;
      case 'draft': return <FileText size={12} />;
      case 'pending': return <CheckCircle size={12} />;
      default: return <FileText size={12} />;
    }
  };

  const activeRules = selectedActivity.rules.filter(rule =>
    rule.channelRules.some(cr => cr.channelId === activeChannelId && cr.enabled)
  );

  const activeChannelRules = activeRules.map(rule => ({
    rule,
    channelRule: rule.channelRules.find(cr => cr.channelId === activeChannelId),
  })).filter(item => item.channelRule?.enabled);

  const formatValue = (type: string, value: any): string => {
    if (type === 'discount') return `${value}折`;
    if (type === 'coupon') return `${value.amount}元券(满${value.threshold}可用)`;
    if (type === 'points') return `${value}积分`;
    if (type === 'red_packet') return `${value}元红包`;
    if (type === 'gift') return value;
    if (type === 'user_level') return `LV${value}`;
    if (type === 'consume_amount') return `¥${value}`;
    if (type === 'sign_days') return `${value}天`;
    if (type === 'region') return value;
    if (type === 'time_range' && value) return `${value.start} 至 ${value.end}`;
    return String(value);
  };

  const operatorLabel: Record<string, string> = {
    eq: '=',
    ne: '≠',
    gt: '>',
    lt: '<',
    gte: '≥',
    lte: '≤',
    in: '包含',
    between: '介于',
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-800">实时预览</h3>
          <div className="flex gap-1">
            <button className="p-1.5 rounded bg-[#1E3A5F] text-white">
              <Smartphone size={14} />
            </button>
            <button className="p-1.5 rounded bg-gray-100 text-gray-500 hover:bg-gray-200">
              <Tablet size={14} />
            </button>
            <button className="p-1.5 rounded bg-gray-100 text-gray-500 hover:bg-gray-200">
              <Monitor size={14} />
            </button>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {enabledChannels.length === 0 ? (
            <span className="text-xs text-gray-400">暂无可用渠道</span>
          ) : (
            enabledChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => handleChannelChange(channel.id)}
                className={`px-2.5 py-1 text-xs rounded-md flex-shrink-0 transition-colors ${
                  activeChannelId === channel.id
                    ? 'bg-[#1E3A5F] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {CHANNEL_TYPE_MAP[channel.type]}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex justify-center">
        <div className="w-72 bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-gray-800">
          <div className="h-6 bg-gray-800 flex items-center justify-center">
            <div className="w-16 h-1.5 bg-gray-600 rounded-full"></div>
          </div>

          <div className="h-[500px] overflow-y-auto bg-gray-50">
            {selectedActivity.coverImage ? (
              <div className="relative h-32 overflow-hidden">
                <img
                  src={selectedActivity.coverImage}
                  alt="活动封面"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <h2 className="text-white font-bold text-sm truncate">
                    {selectedActivity.name || '活动名称'}
                  </h2>
                </div>
              </div>
            ) : (
              <div className="h-32 bg-gradient-to-br from-[#1E3A5F] to-[#2DD4BF] flex items-center justify-center">
                <Gift size={32} className="text-white/80" />
              </div>
            )}

            <div className="p-3">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-white ${ACTIVITY_STATUS_MAP[selectedActivity.status].color}`}>
                  {getActivityStatusIcon()}
                  {ACTIVITY_STATUS_MAP[selectedActivity.status].label}
                </div>
                <div className="flex items-center gap-1">
                  <Tag size={10} className="text-[#2DD4BF]" />
                  <span className="text-[10px] text-gray-500">
                    {activeChannel ? CHANNEL_TYPE_MAP[activeChannel.type] + '渠道' : '请选择渠道'}
                  </span>
                </div>
                {activeChannel && (
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full text-white ${CHANNEL_STATUS_MAP[activeChannel.status].color}`}>
                    {CHANNEL_STATUS_MAP[activeChannel.status].label}
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 mb-3">
                {selectedActivity.description || '暂无活动描述'}
              </p>

              <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{selectedActivity.startTime ? new Date(selectedActivity.startTime).toLocaleDateString() : '未设置'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{selectedActivity.metrics?.uv?.toLocaleString() || 0}人参与</span>
                </div>
              </div>

              {activeChannelRules.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Gift size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">暂无规则配置</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeChannelRules.map(({ rule, channelRule }) => (
                    <div key={rule.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">
                        {rule.name || '未命名规则'}
                      </h4>

                      {channelRule && channelRule.conditions.length > 0 && (
                        <div className="mb-2">
                          <p className="text-[10px] text-gray-400 mb-1">参与条件</p>
                          <div className="space-y-1">
                            {channelRule.conditions.map(cond => (
                              <div key={cond.id} className="flex items-center gap-1 text-xs text-gray-600">
                                <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">{cond.label}</span>
                                <span className="text-gray-400">{operatorLabel[cond.operator]}</span>
                                <span className="text-[#2DD4BF] font-medium">
                                  {formatValue(cond.type, cond.value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {channelRule && channelRule.actions.length > 0 && (
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">可获奖励</p>
                          <div className="space-y-1">
                            {channelRule.actions.map(action => (
                              <div key={action.id} className="flex items-center gap-1 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF]" />
                                <span className="text-gray-700">{action.label}：</span>
                                <span className="text-orange-500 font-medium">
                                  {formatValue(action.type, action.value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-6 bg-gray-800 flex items-center justify-center">
            <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
