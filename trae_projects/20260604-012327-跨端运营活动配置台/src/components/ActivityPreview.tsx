import React from 'react'
import { Activity, Rule, Channel } from '../types'
import { MessageCircle, Smartphone, Globe, MessageSquare, Music, Gift, Ticket, Star, Percent } from 'lucide-react'

interface ActivityPreviewProps {
  activity: Activity
  rules: Rule[]
  channels: Channel[]
}

const channelIcons: Record<string, React.FC<any>> = {
  MessageCircle,
  Smartphone,
  Globe,
  MessageSquare,
  Music
}

const ruleTypeIcons: Record<string, React.FC<any>> = {
  discount: Percent,
  coupon: Ticket,
  points: Star,
  gift: Gift
}

const ActivityPreview: React.FC<ActivityPreviewProps> = ({ activity, rules, channels }) => {
  const getChannel = (channelId: string) => channels.find(c => c.id === channelId)
  const enabledRules = rules.filter(r => r.enabled)

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '未设置'
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getRuleDescription = (rule: Rule) => {
    switch (rule.type) {
      case 'discount':
        return `满${rule.config.threshold}元减${rule.config.value}元`
      case 'coupon':
        return `满${rule.config.threshold}元可用${rule.config.value}元优惠券`
      case 'points':
        return `消费满${rule.config.threshold}元赠送${rule.config.points}积分`
      case 'gift':
        return `赠送${rule.config.giftName || '礼品'}`
      default:
        return '未配置'
    }
  }

  const getConditionsText = (rule: Rule) => {
    const conditions: string[] = []
    if (rule.conditions.minAmount) {
      conditions.push(`最低消费${rule.conditions.minAmount}元`)
    }
    if (rule.conditions.userLevel?.length) {
      conditions.push(`指定用户等级`)
    }
    if (rule.conditions.region?.length) {
      conditions.push(`${rule.conditions.region.length}个地区可用`)
    }
    return conditions.length > 0 ? conditions.join(' | ') : '无限制'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <h3 className="text-xl font-bold mb-2">{activity.name || '未命名活动'}</h3>
        <p className="text-white/80 text-sm">
          {activity.description || '暂无活动描述'}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span>📅 {formatDate(activity.startTime)} - {formatDate(activity.endTime)}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">投放渠道</h4>
          {enabledRules.length === 0 ? (
            <p className="text-gray-500 text-sm">暂未配置启用的规则</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(enabledRules.map(r => r.channelId))).map(channelId => {
                const channel = getChannel(channelId)
                if (!channel) return null
                const Icon = channelIcons[channel.icon] || Globe
                return (
                  <div
                    key={channelId}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                  >
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{channel.name}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">活动规则预览</h4>
          {enabledRules.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Gift className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">暂未配置活动规则</p>
            </div>
          ) : (
            <div className="space-y-3">
              {enabledRules.sort((a, b) => a.priority - b.priority).map(rule => {
                const channel = getChannel(rule.channelId)
                const RuleIcon = ruleTypeIcons[rule.type] || Gift
                return (
                  <div
                    key={rule.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <RuleIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-gray-900">{getRuleDescription(rule)}</h5>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {channel?.name || '未知渠道'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          适用条件：{getConditionsText(rule)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityPreview
