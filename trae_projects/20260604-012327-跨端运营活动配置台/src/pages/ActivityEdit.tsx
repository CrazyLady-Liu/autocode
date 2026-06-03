import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save, Plus, Eye, CheckCircle, AlertTriangle } from 'lucide-react'
import { useActivity } from '../contexts/ActivityContext'
import { Activity, Rule } from '../types'
import { validateActivity, validateActivityRules } from '../utils/validation'
import RuleEditor from '../components/RuleEditor'
import ActivityPreview from '../components/ActivityPreview'
import AlertMessage from '../components/AlertMessage'

const emptyActivity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  description: '',
  status: 'draft',
  startTime: '',
  endTime: ''
}

const emptyRule: Omit<Rule, 'id'> = {
  activityId: '',
  channelId: '',
  type: 'discount',
  config: {},
  conditions: {},
  priority: 1,
  enabled: false
}

const ActivityEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { activities, channels, addActivity, updateActivity, getActivityRules } = useActivity()
  
  const [activity, setActivity] = useState<Activity | null>(null)
  const [activityRules, setActivityRules] = useState<Rule[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [validationWarnings, setValidationWarnings] = useState<string[]>([])
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [showValidation, setShowValidation] = useState(false)

  const isNew = id === 'new'

  useEffect(() => {
    if (!isNew && id) {
      const found = activities.find(a => a.id === id)
      if (found) {
        setActivity(found)
        setActivityRules(getActivityRules(id))
      }
    } else {
      setActivity({ ...emptyActivity, id: 'temp', createdAt: '', updatedAt: '' })
      setActivityRules([])
    }
  }, [id, activities, isNew, getActivityRules])

  useEffect(() => {
    if (activity) {
      const activityResult = validateActivity(activity)
      const rulesResult = validateActivityRules(activityRules, channels)
      
      setValidationErrors([
        ...activityResult.errors.filter(e => e.severity === 'error').map(e => e.message),
        ...rulesResult.errors.filter(e => e.severity === 'error').map(e => e.message)
      ])
      setValidationWarnings([
        ...activityResult.errors.filter(e => e.severity === 'warning').map(e => e.message),
        ...rulesResult.errors.filter(e => e.severity === 'warning').map(e => e.message)
      ])
    }
  }, [activity, activityRules, channels])

  const handleActivityChange = (field: keyof Activity, value: any) => {
    if (activity) {
      setActivity({ ...activity, [field]: value })
    }
  }

  const handleSave = () => {
    setShowValidation(true)
    if (validationErrors.length > 0) {
      return
    }

    if (isNew) {
      addActivity({
        name: activity!.name,
        description: activity!.description,
        status: activity!.status,
        startTime: activity!.startTime,
        endTime: activity!.endTime
      })
    } else {
      updateActivity(id!, activity!)
    }
    navigate('/activities')
  }

  const handleAddRule = () => {
    if (activity) {
      const newRule: Rule = {
        ...emptyRule,
        id: Date.now().toString(),
        activityId: activity.id,
        priority: activityRules.length + 1
      }
      setEditingRule(newRule)
    }
  }

  const handleSaveRule = (ruleData: Partial<Rule>) => {
    if (editingRule) {
      const isNewRule = !activityRules.find(r => r.id === editingRule.id)
      if (isNewRule) {
        setActivityRules([...activityRules, { ...editingRule, ...ruleData } as Rule])
      } else {
        setActivityRules(activityRules.map(r => 
          r.id === editingRule.id ? { ...r, ...ruleData } : r
        ))
      }
    }
    setEditingRule(null)
  }

  const handleDeleteRule = (ruleId: string) => {
    setActivityRules(activityRules.filter(r => r.id !== ruleId))
    if (editingRule?.id === ruleId) {
      setEditingRule(null)
    }
  }

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/activities"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? '新建活动' : '编辑活动'}
            </h1>
            <p className="text-gray-500 mt-1">
              {isNew ? '创建新的运营活动' : '修改活动信息和规则'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              showPreview
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Eye className="w-5 h-5 mr-2" />
            预览
          </button>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-5 h-5 mr-2" />
            保存
          </button>
        </div>
      </div>

      {showValidation && (validationErrors.length > 0 || validationWarnings.length > 0) && (
        <div className="mb-6 space-y-3">
          {validationErrors.length > 0 && validationErrors.map((error, index) => (
            <AlertMessage key={`error-${index}`} type="error" message={error} />
          ))}
          {validationWarnings.length > 0 && validationWarnings.map((warning, index) => (
            <AlertMessage key={`warning-${index}`} type="warning" message={warning} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  活动名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={activity.name}
                  onChange={(e) => handleActivityChange('name', e.target.value)}
                  placeholder="请输入活动名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
                <textarea
                  value={activity.description}
                  onChange={(e) => handleActivityChange('description', e.target.value)}
                  placeholder="请输入活动描述"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={activity.startTime ? activity.startTime.slice(0, 16) : ''}
                    onChange={(e) => handleActivityChange('startTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={activity.endTime ? activity.endTime.slice(0, 16) : ''}
                    onChange={(e) => handleActivityChange('endTime', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">活动规则</h2>
              <button
                onClick={handleAddRule}
                className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                添加规则
              </button>
            </div>

            {editingRule && (
              <div className="mb-4">
                <RuleEditor
                  rule={editingRule}
                  channels={channels}
                  onSave={handleSaveRule}
                  onDelete={() => handleDeleteRule(editingRule.id)}
                  onClose={() => setEditingRule(null)}
                />
              </div>
            )}

            <div className="space-y-3">
              {activityRules.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500">暂未配置规则</p>
                  <p className="text-gray-400 text-sm mt-1">点击上方按钮添加活动规则</p>
                </div>
              ) : (
                activityRules.sort((a, b) => a.priority - b.priority).map(rule => (
                  <div
                    key={rule.id}
                    onClick={() => setEditingRule(rule)}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {rule.type === 'discount' && '满减折扣'}
                          {rule.type === 'coupon' && '优惠券'}
                          {rule.type === 'points' && '积分赠送'}
                          {rule.type === 'gift' && '赠品'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {channels.find(c => c.id === rule.channelId)?.name || '未选择渠道'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">优先级: {rule.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          {showPreview ? (
            <ActivityPreview
              activity={activity}
              rules={activityRules}
              channels={channels}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">校验状态</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  {validationErrors.length > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">活动配置校验</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {validationErrors.length > 0
                        ? `发现 ${validationErrors.length} 个错误需要修复`
                        : '所有必填项已完成'}
                    </p>
                  </div>
                </div>

                {validationWarnings.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">优化建议</p>
                      <p className="text-sm text-yellow-600 mt-1">
                        发现 {validationWarnings.length} 项可以优化的内容
                      </p>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-gray-900 mb-3">配置摘要</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">规则数量</span>
                      <span className="text-gray-900">{activityRules.length} 条</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">已启用规则</span>
                      <span className="text-gray-900">{activityRules.filter(r => r.enabled).length} 条</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">覆盖渠道</span>
                      <span className="text-gray-900">
                        {new Set(activityRules.filter(r => r.enabled).map(r => r.channelId)).size} 个
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 点击右上角「预览」按钮查看活动效果
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityEdit
