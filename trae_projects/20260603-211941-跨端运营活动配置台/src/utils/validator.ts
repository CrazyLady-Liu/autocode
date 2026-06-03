import type { Activity, ValidationResult, ValidationItem, ActivityRule } from '../types/activity';
import { generateId } from './mockGenerator';

const createError = (field: string, message: string, location: string): ValidationItem => ({
  id: generateId(),
  type: 'error',
  field,
  message,
  location,
});

const createWarning = (field: string, message: string, location: string): ValidationItem => ({
  id: generateId(),
  type: 'warning',
  field,
  message,
  location,
});

export const validateActivity = (activity: Activity, allActivities: Activity[] = []): ValidationResult => {
  const errors: ValidationItem[] = [];
  const warnings: ValidationItem[] = [];

  if (!activity.name || activity.name.trim().length === 0) {
    errors.push(createError('name', '活动名称不能为空', 'basic-info'));
  } else if (activity.name.length < 2) {
    errors.push(createError('name', '活动名称至少需要2个字符', 'basic-info'));
  } else if (activity.name.length > 50) {
    errors.push(createError('name', '活动名称不能超过50个字符', 'basic-info'));
  }

  if (!activity.description || activity.description.trim().length === 0) {
    errors.push(createError('description', '活动描述不能为空', 'basic-info'));
  }

  if (!activity.startTime) {
    errors.push(createError('startTime', '请选择活动开始时间', 'basic-info'));
  }

  if (!activity.endTime) {
    errors.push(createError('endTime', '请选择活动结束时间', 'basic-info'));
  }

  if (activity.startTime && activity.endTime) {
    const start = new Date(activity.startTime);
    const end = new Date(activity.endTime);
    if (start >= end) {
      errors.push(createError('endTime', '结束时间必须晚于开始时间', 'basic-info'));
    }
  }

  if (!activity.coverImage || activity.coverImage.trim().length === 0) {
    errors.push(createError('coverImage', '请上传活动封面图', 'basic-info'));
  }

  if (!activity.rules || activity.rules.length === 0) {
    errors.push(createError('rules', '请至少配置一条活动规则', 'rules'));
  } else {
    activity.rules.forEach((rule, ruleIndex) => {
      validateRule(rule, ruleIndex, errors, warnings);
    });
  }

  const enabledChannels = activity.channels.filter(c => c.enabled);
  if (enabledChannels.length === 0) {
    errors.push(createError('channels', '请至少选择一个投放渠道', 'channels'));
  } else {
    activity.channels.forEach((channel, channelIndex) => {
      if (channel.enabled && channel.status !== 'available') {
        errors.push(createError(
          `channels[${channelIndex}].enabled`,
          `渠道「${channel.name}」当前不可用，无法启用`,
          `channels-${channel.id}`
        ));
      }

      if (channel.enabled) {
        const hasRuleForChannel = activity.rules.some(rule =>
          rule.channelRules.some(cr => cr.channelId === channel.id && cr.enabled)
        );
        if (!hasRuleForChannel) {
          warnings.push(createWarning(
            `channels[${channelIndex}].rules`,
            `渠道「${channel.name}」已启用但未配置专属规则，将使用默认规则`,
            `channels-${channel.id}`
          ));
        }

        if (!channel.params.position) {
          warnings.push(createWarning(
            `channels[${channelIndex}].params.position`,
            `渠道「${channel.name}」未配置展示位置`,
            `channels-${channel.id}`
          ));
        }
      }
    });
  }

  if (activity.startTime && activity.endTime && enabledChannels.length > 0) {
    const overlappingActivities = allActivities.filter(a => {
      if (a.id === activity.id) return false;
      const aEnabledChannels = a.channels.filter(c => c.enabled && enabledChannels.some(ec => ec.type === c.type));
      if (aEnabledChannels.length === 0) return false;
      const aStart = new Date(a.startTime);
      const aEnd = new Date(a.endTime);
      const start = new Date(activity.startTime);
      const end = new Date(activity.endTime);
      return start < aEnd && end > aStart;
    });

    if (overlappingActivities.length > 0) {
      const overlappingNames = overlappingActivities.map(a => `「${a.name}」`).join('、');
      warnings.push(createWarning(
        'timeRange',
        `活动时间与其他活动时间重叠: ${overlappingNames}，请注意渠道资源冲突`,
        'basic-info'
      ));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

const validateRule = (
  rule: ActivityRule,
  ruleIndex: number,
  errors: ValidationItem[],
  warnings: ValidationItem[]
): void => {
  if (!rule.name || rule.name.trim().length === 0) {
    errors.push(createError(
      `rules[${ruleIndex}].name`,
      `规则${ruleIndex + 1}名称不能为空`,
      `rules-${rule.id}`
    ));
  }

  if (!rule.description || rule.description.trim().length === 0) {
    warnings.push(createWarning(
      `rules[${ruleIndex}].description`,
      `规则「${rule.name || ruleIndex + 1}」建议添加描述说明`,
      `rules-${rule.id}`
    ));
  }

  rule.channelRules.forEach((channelRule, crIndex) => {
    if (!channelRule.enabled) return;

    if (!channelRule.conditions || channelRule.conditions.length === 0) {
      errors.push(createError(
        `rules[${ruleIndex}].channelRules[${crIndex}].conditions`,
        `规则「${rule.name || ruleIndex + 1}」请至少配置一个条件`,
        `rules-${rule.id}-${channelRule.channelId}`
      ));
    } else {
      channelRule.conditions.forEach((condition, condIndex) => {
        if (condition.value === null || condition.value === undefined || condition.value === '') {
          errors.push(createError(
            `rules[${ruleIndex}].channelRules[${crIndex}].conditions[${condIndex}].value`,
            `条件「${condition.label}」的值不能为空`,
            `rules-${rule.id}-${channelRule.channelId}`
          ));
        }

        if (condition.operator === 'between' && (!condition.value || !Array.isArray(condition.value) || condition.value.length !== 2)) {
          errors.push(createError(
            `rules[${ruleIndex}].channelRules[${crIndex}].conditions[${condIndex}].value`,
            `「介于」操作符需要提供两个值`,
            `rules-${rule.id}-${channelRule.channelId}`
          ));
        }

        if (condition.type === 'time_range' && (!condition.value || !condition.value.start || !condition.value.end)) {
          errors.push(createError(
            `rules[${ruleIndex}].channelRules[${crIndex}].conditions[${condIndex}].value`,
            `时间范围需要同时指定开始和结束时间`,
            `rules-${rule.id}-${channelRule.channelId}`
          ));
        }
      });
    }

    if (!channelRule.actions || channelRule.actions.length === 0) {
      errors.push(createError(
        `rules[${ruleIndex}].channelRules[${crIndex}].actions`,
        `规则「${rule.name || ruleIndex + 1}」请至少配置一个动作`,
        `rules-${rule.id}-${channelRule.channelId}`
      ));
    } else {
      channelRule.actions.forEach((action, actionIndex) => {
        if (action.value === null || action.value === undefined || action.value === '') {
          errors.push(createError(
            `rules[${ruleIndex}].channelRules[${crIndex}].actions[${actionIndex}].value`,
            `动作「${action.label}」的值不能为空`,
            `rules-${rule.id}-${channelRule.channelId}`
          ));
        }

        if (action.type === 'discount' && (typeof action.value !== 'number' || action.value < 1 || action.value > 100)) {
          errors.push(createError(
            `rules[${ruleIndex}].channelRules[${crIndex}].actions[${actionIndex}].value`,
            `折扣值必须在1-100之间`,
            `rules-${rule.id}-${channelRule.channelId}`
          ));
        }

        if (action.type === 'coupon' && (!action.value?.amount || !action.value?.threshold)) {
          errors.push(createError(
            `rules[${ruleIndex}].channelRules[${crIndex}].actions[${actionIndex}].value`,
            `优惠券需要指定金额和使用门槛`,
            `rules-${rule.id}-${channelRule.channelId}`
          ));
        }

        if ((action.type === 'points' || action.type === 'red_packet') && (typeof action.value !== 'number' || action.value <= 0)) {
          errors.push(createError(
            `rules[${ruleIndex}].channelRules[${crIndex}].actions[${actionIndex}].value`,
            `${action.label}值必须大于0`,
            `rules-${rule.id}-${channelRule.channelId}`
          ));
        }
      });
    }
  });
};
