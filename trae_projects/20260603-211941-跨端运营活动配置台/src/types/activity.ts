export type ActivityStatus = 'draft' | 'pending' | 'active' | 'paused' | 'ended';

export type ChannelType = 'wechat' | 'alipay' | 'app' | 'h5' | 'miniprogram';

export type ChannelStatus = 'available' | 'unavailable' | 'maintenance';

export type RuleConditionType = 'user_level' | 'consume_amount' | 'sign_days' | 'region' | 'time_range';

export type RuleActionType = 'discount' | 'coupon' | 'points' | 'gift' | 'red_packet';

export type ComparisonOperator = 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'between';

export interface Channel {
  id: string;
  name: string;
  type: ChannelType;
  status: ChannelStatus;
  enabled: boolean;
  unavailableReason?: string;
  params: Record<string, any>;
}

export interface RuleCondition {
  id: string;
  type: RuleConditionType;
  operator: ComparisonOperator;
  value: any;
  label: string;
}

export interface RuleAction {
  id: string;
  type: RuleActionType;
  value: any;
  label: string;
}

export interface ChannelRule {
  channelId: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  enabled: boolean;
}

export interface ActivityRule {
  id: string;
  name: string;
  description: string;
  channelRules: ChannelRule[];
}

export interface ActivityMetrics {
  pv: number;
  uv: number;
  participateCount: number;
  conversionRate: number;
  cost: number;
  roi: number;
  dailyTrend: { date: string; pv: number; uv: number; conversion: number }[];
  channelData: { channel: string; pv: number; uv: number; conversion: number }[];
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  status: ActivityStatus;
  startTime: string;
  endTime: string;
  coverImage: string;
  rules: ActivityRule[];
  channels: Channel[];
  metrics: ActivityMetrics;
  createdAt: string;
  updatedAt: string;
}

export interface ValidationItem {
  id: string;
  type: 'error' | 'warning';
  field: string;
  message: string;
  location: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationItem[];
  warnings: ValidationItem[];
}

export interface ActivityState {
  activities: Activity[];
  selectedActivityId: string | null;
  selectedChannelId: string | null;
  previewChannelId: string | null;
  validationResult: ValidationResult | null;
  isLoading: boolean;
}

export type ActivityAction =
  | { type: 'SET_ACTIVITIES'; payload: Activity[] }
  | { type: 'SELECT_ACTIVITY'; payload: string | null }
  | { type: 'SELECT_CHANNEL'; payload: string | null }
  | { type: 'SELECT_PREVIEW_CHANNEL'; payload: string | null }
  | { type: 'ADD_ACTIVITY'; payload: Activity }
  | { type: 'UPDATE_ACTIVITY'; payload: Activity }
  | { type: 'DELETE_ACTIVITY'; payload: string }
  | { type: 'SET_VALIDATION'; payload: ValidationResult | null }
  | { type: 'SET_LOADING'; payload: boolean };

export const RULE_CONDITION_OPTIONS: { value: RuleConditionType; label: string }[] = [
  { value: 'user_level', label: '用户等级' },
  { value: 'consume_amount', label: '消费金额' },
  { value: 'sign_days', label: '签到天数' },
  { value: 'region', label: '所在地区' },
  { value: 'time_range', label: '时间范围' },
];

export const RULE_ACTION_OPTIONS: { value: RuleActionType; label: string }[] = [
  { value: 'discount', label: '折扣优惠' },
  { value: 'coupon', label: '优惠券' },
  { value: 'points', label: '积分奖励' },
  { value: 'gift', label: '实物礼品' },
  { value: 'red_packet', label: '红包奖励' },
];

export const COMPARISON_OPERATORS: { value: ComparisonOperator; label: string }[] = [
  { value: 'eq', label: '等于' },
  { value: 'ne', label: '不等于' },
  { value: 'gt', label: '大于' },
  { value: 'lt', label: '小于' },
  { value: 'gte', label: '大于等于' },
  { value: 'lte', label: '小于等于' },
  { value: 'in', label: '包含' },
  { value: 'between', label: '介于' },
];

export const CHANNEL_TYPE_MAP: Record<ChannelType, string> = {
  wechat: '微信',
  alipay: '支付宝',
  app: 'APP',
  h5: 'H5',
  miniprogram: '小程序',
};

export const ACTIVITY_STATUS_MAP: Record<ActivityStatus, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'bg-gray-400' },
  pending: { label: '待审核', color: 'bg-yellow-500' },
  active: { label: '进行中', color: 'bg-green-500' },
  paused: { label: '已暂停', color: 'bg-orange-500' },
  ended: { label: '已结束', color: 'bg-red-500' },
};

export const CHANNEL_STATUS_MAP: Record<ChannelStatus, { label: string; color: string }> = {
  available: { label: '可用', color: 'bg-green-500' },
  unavailable: { label: '不可用', color: 'bg-red-500' },
  maintenance: { label: '维护中', color: 'bg-yellow-500' },
};
