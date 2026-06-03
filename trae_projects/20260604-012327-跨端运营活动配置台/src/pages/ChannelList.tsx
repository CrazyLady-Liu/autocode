import React from 'react'
import { useActivity } from '../contexts/ActivityContext'
import StatusBadge from '../components/StatusBadge'
import { MessageCircle, Smartphone, Globe, MessageSquare, Music } from 'lucide-react'

const channelIcons: Record<string, React.FC<any>> = {
  MessageCircle,
  Smartphone,
  Globe,
  MessageSquare,
  Music
}

const ChannelList: React.FC = () => {
  const { channels, rules } = useActivity()

  const getChannelStats = (channelId: string) => {
    const channelRules = rules.filter(r => r.channelId === channelId && r.enabled)
    const activeActivities = new Set(channelRules.map(r => r.activityId)).size
    return {
      rules: channelRules.length,
      activities: activeActivities }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">渠道管理</h1>
        <p className="text-gray-500 mt-1">管理各投放渠道的配置和状态</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map(channel => {
        const Icon = channelIcons[channel.icon] || Globe
        const stats = getChannelStats(channel.id)
        return (
          <div key={channel.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    channel.status === 'available' ? 'bg-green-50' :
                    channel.status === 'maintenance' ? 'bg-yellow-50' : 'bg-red-50'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      channel.status === 'available' ? 'text-green-600' :
                    channel.status === 'maintenance' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{channel.name}</h3>
                    <p className="text-sm text-gray-500">{channel.code}</p>
                  </div>
                </div>
                <StatusBadge status={channel.status} />
              </div>

              <p className="text-gray-600 text-sm mb-4">{channel.description}</p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.activities}</p>
                  <p className="text-xs text-gray-500">活跃活动</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.rules}</p>
                  <p className="text-xs text-gray-500">启用规则</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {channel.status === 'available' ? '渠道正常运行' :
                  channel.status === 'maintenance' ? '渠道维护中' : '渠道暂不可用'}
                </span>
                {channel.status !== 'available' && (
                  <span className="text-xs text-gray-400">预计24小时内恢复</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">渠道使用说明</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">渠道状态说明</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <strong>可用</strong>：渠道正常，可正常投放活动</li>
              <li>• <strong>维护中</strong>：渠道临时维护，投放可能延迟</li>
              <li>• <strong>不可用</strong>：渠道故障，无法投放活动</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">渠道选择建议</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• 优先选择用户量较大的渠道进行投放</li>
              <li>• 根据活动目标用户选择合适渠道</li>
              <li>• 多渠道组合投放效果更佳</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChannelList
