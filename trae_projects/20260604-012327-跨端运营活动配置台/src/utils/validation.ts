import { Activity, Rule, Channel, ValidationResult, ValidationError } from '../types'

export const validateActivity = (activity: Activity): ValidationResult => {
  const errors: ValidationError[] = []

  if (!activity.name.trim()) {
    errors.push({
      field: 'name',
      message: '活动名称不能为空',
      severity: 'error'
    })
  } else if (activity.name.length < 2) {
    errors.push({
      field: 'name',
      message: '活动名称至少需要2个字符',
      severity: 'warning'
    })
  }

  if (!activity.description.trim()) {
    errors.push({
      field: 'description',
      message: '活动描述为空，建议添加详细说明',
      severity: 'warning'
    })
  }

  if (!activity.startTime) {
    errors.push({
      field: 'startTime',
      message: '请设置活动开始时间',
      severity: 'error'
    })
  }

  if (!activity.endTime) {
    errors.push({
      field: 'endTime',
      message: '请设置活动结束时间',
      severity: 'error'
    })
  }

  if (activity.startTime && activity.endTime) {
    if (new Date(activity.startTime) >= new Date(activity.endTime)) {
      errors.push({
        field: 'endTime',
        message: '结束时间必须晚于开始时间',
        severity: 'error'
      })
    }
  }

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors
  }
}

export const validateRule = (rule: Rule, channels: Channel[]): ValidationResult => {
  const errors: ValidationError[] = []

  if (!rule.channelId) {
    errors.push({
      field: 'channelId',
      message: '请选择投放渠道',
      severity: 'error'
    })
  } else {
    const channel = channels.find(c => c.id === rule.channelId)
    if (channel && channel.status === 'unavailable') {
      errors.push({
        field: 'channelId',
        message: `渠道"${channel.name}"当前不可用，请选择其他渠道`,
        severity: 'error'
      })
    } else if (channel && channel.status === 'maintenance') {
      errors.push({
        field: 'channelId',
        message: `渠道"${channel.name}"正在维护中，投放可能受影响`,
        severity: 'warning'
      })
    }
  }

  switch (rule.type) {
    case 'discount':
      if (!rule.config.threshold) {
        errors.push({
          field: 'config.threshold',
          message: '请设置满减门槛',
          severity: 'error'
        })
      }
      if (!rule.config.value) {
        errors.push({
          field: 'config.value',
          message: '请设置折扣金额',
          severity: 'error'
        })
      } else if (rule.config.threshold && rule.config.value >= rule.config.threshold) {
        errors.push({
          field: 'config.value',
          message: '折扣金额不能大于等于门槛金额',
          severity: 'error'
        })
      }
      break
    case 'coupon':
      if (!rule.config.couponCode) {
        errors.push({
          field: 'config.couponCode',
          message: '请设置优惠券码',
          severity: 'error'
        })
      }
      if (!rule.config.value) {
        errors.push({
          field: 'config.value',
          message: '请设置优惠券金额',
          severity: 'error'
        })
      }
      break
    case 'points':
      if (!rule.config.points) {
        errors.push({
          field: 'config.points',
          message: '请设置赠送积分数量',
          severity: 'error'
        })
      } else if (rule.config.points < 0) {
        errors.push({
          field: 'config.points',
          message: '积分数量不能为负数',
          severity: 'error'
        })
      }
      break
    case 'gift':
      if (!rule.config.giftName) {
        errors.push({
          field: 'config.giftName',
          message: '请设置赠品名称',
          severity: 'error'
        })
      }
      break
  }

  return {
    isValid: errors.filter(e => e.severity === 'error').length === 0,
    errors
  }
}

export const validateActivityRules = (rules: Rule[], channels: Channel[]): ValidationResult => {
  const allErrors: ValidationError[] = []
  
  rules.forEach((rule, index) => {
    const result = validateRule(rule, channels)
    result.errors.forEach(error => {
      allErrors.push({
        ...error,
        field: `rules[${index}].${error.field}`
      })
    })
  })

  if (rules.length === 0) {
    allErrors.push({
      field: 'rules',
      message: '活动未配置任何规则，无法正常投放',
      severity: 'warning'
    })
  }

  const enabledRules = rules.filter(r => r.enabled)
  if (rules.length > 0 && enabledRules.length === 0) {
    allErrors.push({
      field: 'rules',
      message: '所有规则均未启用',
      severity: 'warning'
    })
  }

  return {
    isValid: allErrors.filter(e => e.severity === 'error').length === 0,
    errors: allErrors
  }
}
