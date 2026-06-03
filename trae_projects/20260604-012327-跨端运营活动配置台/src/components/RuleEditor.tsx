import React, { useState, useEffect } from 'react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Rule, Channel } from '../types'
import { validateRule } from '../utils/validation'
import AlertMessage from './AlertMessage'

interface RuleEditorProps {
  rule: Rule
  channels: Channel[]
  onSave: (rule: Partial<Rule>) => void
  onDelete: () => void
  onClose: () => void
}

const ruleTypes = [
  { value: 'discount', label: '满减折扣', icon: '💰' },
  { value: 'coupon', label: '优惠券', icon: '🎫' },
  { value: 'points', label: '积分赠送', icon: '⭐' },
  { value: 'gift', label: '赠品', icon: '🎁' }
]

const userLevels = [
  { value: 'normal', label: '普通用户' },
  { value: 'silver', label: '银卡会员' },
  { value: 'gold', label: '金卡会员' },
  { value: 'platinum', label: '白金会员' }
]

const regions = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安']

const RuleEditor: React.FC<RuleEditorProps> = ({ rule, channels, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState<Rule>(rule)
  const [errors, setErrors] = useState<string[]>([])
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const result = validateRule(formData, channels)
    setErrors(result.errors.map(e => e.message))
  }, [formData, channels])

  const handleChange = (field: keyof Rule, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleConfigChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }))
  }

  const handleConditionChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: { ...prev.conditions, [key]: value }
    }))
  }

  const handleSave = () => {
    onSave(formData)
    onClose()
  }

  const getChannelName = (channelId: string) => {
    return channels.find(c => c.id === channelId)?.name || '未知渠道'
  }

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div
        className="flex items-center justify-between p-4 bg-white cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            className="p-1 text-red-500 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <div>
            <div className="font-medium text-gray-900">
              {ruleTypes.find(t => t.value === formData.type)?.label || '选择规则类型'}
              <span className="ml-2 text-sm text-gray-500">
                - {getChannelName(formData.channelId)}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              优先级: {formData.priority} | {formData.enabled ? '已启用' : '未启用'}
            </div>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          {errors.length > 0 && (
            <div className="space-y-2">
              {errors.map((error, index) => (
                <AlertMessage key={index} type="warning" message={error} />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">投放渠道</label>
              <select
                value={formData.channelId}
                onChange={(e) => handleChange('channelId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">选择渠道</option>
                {channels.map(channel => (
                  <option key={channel.id} value={channel.id} disabled={channel.status === 'unavailable'}>
                    {channel.name} {channel.status !== 'available' && `(${channel.status === 'maintenance' ? '维护中' : '不可用'})`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">规则类型</label>
              <select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value as Rule['type'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ruleTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">优先级（数字越小越优先）</label>
              <input
                type="number"
                min="1"
                value={formData.priority}
                onChange={(e) => handleChange('priority', parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(e) => handleChange('enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">启用此规则</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">规则配置</h4>
            
            {formData.type === 'discount' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">满减门槛（元）</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.config.threshold || ''}
                    onChange={(e) => handleConfigChange('threshold', parseFloat(e.target.value))}
                    placeholder="例如：200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">减免金额（元）</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.config.value || ''}
                    onChange={(e) => handleConfigChange('value', parseFloat(e.target.value))}
                    placeholder="例如：20"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {formData.type === 'coupon' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">优惠券码</label>
                  <input
                    type="text"
                    value={formData.config.couponCode || ''}
                    onChange={(e) => handleConfigChange('couponCode', e.target.value)}
                    placeholder="例如：SAVE50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">优惠金额（元）</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.config.value || ''}
                    onChange={(e) => handleConfigChange('value', parseFloat(e.target.value))}
                    placeholder="例如：50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">使用门槛（元）</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.config.threshold || ''}
                    onChange={(e) => handleConfigChange('threshold', parseFloat(e.target.value))}
                    placeholder="例如：300"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {formData.type === 'points' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">赠送积分</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.config.points || ''}
                    onChange={(e) => handleConfigChange('points', parseInt(e.target.value))}
                    placeholder="例如：500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">消费门槛（元）</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.config.threshold || ''}
                    onChange={(e) => handleConfigChange('threshold', parseFloat(e.target.value))}
                    placeholder="例如：100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {formData.type === 'gift' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">赠品名称</label>
                  <input
                    type="text"
                    value={formData.config.giftName || ''}
                    onChange={(e) => handleConfigChange('giftName', e.target.value)}
                    placeholder="例如：精美礼盒"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">赠品图片URL</label>
                  <input
                    type="text"
                    value={formData.config.giftImage || ''}
                    onChange={(e) => handleConfigChange('giftImage', e.target.value)}
                    placeholder="图片链接"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3">适用条件</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最低消费金额（元）</label>
                <input
                  type="number"
                  min="0"
                  value={formData.conditions.minAmount || ''}
                  onChange={(e) => handleConditionChange('minAmount', parseFloat(e.target.value))}
                  placeholder="不限制请留空"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户等级</label>
                <select
                  multiple
                  value={formData.conditions.userLevel || []}
                  onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions, option => option.value)
                    handleConditionChange('userLevel', values)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                >
                  {userLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">适用地区</label>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <label
                    key={region}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm cursor-pointer border ${
                      formData.conditions.region?.includes(region)
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.conditions.region?.includes(region) || false}
                      onChange={(e) => {
                        const current = formData.conditions.region || []
                        const next = e.target.checked
                          ? [...current, region]
                          : current.filter(r => r !== region)
                        handleConditionChange('region', next.length > 0 ? next : undefined)
                      }}
                      className="sr-only"
                    />
                    {region}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存规则
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RuleEditor
