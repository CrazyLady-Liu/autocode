import type {
  Activity,
  ActivityRule,
  Channel,
  ChannelRule,
  RuleCondition,
  RuleAction,
  ActivityMetrics,
  ChannelType,
  ChannelStatus,
  ActivityStatus,
} from '../types/activity';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const generateDate = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const generateDateTime = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

export const generateCondition = (): RuleCondition => {
  const types = ['user_level', 'consume_amount', 'sign_days', 'region', 'time_range'] as const;
  const operators = ['eq', 'ne', 'gt', 'lt', 'gte', 'lte', 'in', 'between'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  const operator = operators[Math.floor(Math.random() * operators.length)];

  const labelMap: Record<string, string> = {
    user_level: '用户等级',
    consume_amount: '消费金额',
    sign_days: '签到天数',
    region: '所在地区',
    time_range: '时间范围',
  };

  const valueMap: Record<string, any> = {
    user_level: Math.floor(Math.random() * 5) + 1,
    consume_amount: Math.floor(Math.random() * 500) + 100,
    sign_days: Math.floor(Math.random() * 30) + 1,
    region: ['北京', '上海', '广州', '深圳'][Math.floor(Math.random() * 4)],
    time_range: { start: generateDate(-7), end: generateDate(7) },
  };

  return {
    id: generateId(),
    type,
    operator,
    value: valueMap[type],
    label: labelMap[type],
  };
};

export const generateAction = (): RuleAction => {
  const types = ['discount', 'coupon', 'points', 'gift', 'red_packet'] as const;
  const type = types[Math.floor(Math.random() * types.length)];

  const labelMap: Record<string, string> = {
    discount: '折扣优惠',
    coupon: '优惠券',
    points: '积分奖励',
    gift: '实物礼品',
    red_packet: '红包奖励',
  };

  const valueMap: Record<string, any> = {
    discount: Math.floor(Math.random() * 30) + 70,
    coupon: { amount: Math.floor(Math.random() * 50) + 10, threshold: Math.floor(Math.random() * 200) + 50 },
    points: Math.floor(Math.random() * 500) + 50,
    gift: ['精美礼品A', '精美礼品B', '精美礼品C'][Math.floor(Math.random() * 3)],
    red_packet: Math.floor(Math.random() * 50) + 5,
  };

  return {
    id: generateId(),
    type,
    value: valueMap[type],
    label: labelMap[type],
  };
};

export const generateChannel = (type: ChannelType, status: ChannelStatus = 'available'): Channel => {
  const nameMap: Record<ChannelType, string> = {
    wechat: '微信公众号',
    alipay: '支付宝生活号',
    app: 'APP首页',
    h5: 'H5活动页',
    miniprogram: '微信小程序',
  };

  return {
    id: generateId(),
    name: nameMap[type],
    type,
    status,
    enabled: status === 'available' && Math.random() > 0.3,
    unavailableReason: status === 'unavailable' ? '渠道接口升级中' : status === 'maintenance' ? '计划维护' : undefined,
    params: {
      position: ['top', 'middle', 'bottom'][Math.floor(Math.random() * 3)],
      priority: Math.floor(Math.random() * 10) + 1,
    },
  };
};

export const generateChannelRule = (channelId: string): ChannelRule => ({
  channelId,
  conditions: [generateCondition(), generateCondition()],
  actions: [generateAction(), generateAction()],
  enabled: true,
});

export const generateRule = (channels: Channel[]): ActivityRule => {
  const ruleNames = ['新用户专属优惠', '老用户回馈活动', '节假日特惠', '会员日专享', '消费满减活动'];
  const ruleDescriptions = [
    '针对新用户的专属优惠活动，提升首单转化率',
    '回馈老用户的忠诚度，增加用户粘性',
    '节假日期间的特殊优惠活动，刺激消费',
    '会员日专享优惠，提升会员活跃度',
    '消费满额立减活动，提升客单价',
  ];
  const idx = Math.floor(Math.random() * ruleNames.length);

  return {
    id: generateId(),
    name: ruleNames[idx],
    description: ruleDescriptions[idx],
    channelRules: channels.filter(c => c.enabled).map(c => generateChannelRule(c.id)),
  };
};

export const generateMetrics = (): ActivityMetrics => {
  const dailyTrend = Array.from({ length: 7 }, (_, i) => ({
    date: generateDate(-6 + i),
    pv: Math.floor(Math.random() * 50000) + 10000,
    uv: Math.floor(Math.random() * 20000) + 5000,
    conversion: Math.floor(Math.random() * 5000) + 1000,
  }));

  const channelData = [
    { channel: '微信', pv: Math.floor(Math.random() * 30000) + 10000, uv: Math.floor(Math.random() * 10000) + 3000, conversion: Math.floor(Math.random() * 2000) + 500 },
    { channel: '支付宝', pv: Math.floor(Math.random() * 20000) + 5000, uv: Math.floor(Math.random() * 8000) + 2000, conversion: Math.floor(Math.random() * 1500) + 300 },
    { channel: 'APP', pv: Math.floor(Math.random() * 40000) + 15000, uv: Math.floor(Math.random() * 15000) + 4000, conversion: Math.floor(Math.random() * 3000) + 800 },
    { channel: 'H5', pv: Math.floor(Math.random() * 25000) + 8000, uv: Math.floor(Math.random() * 10000) + 3000, conversion: Math.floor(Math.random() * 2000) + 500 },
    { channel: '小程序', pv: Math.floor(Math.random() * 35000) + 12000, uv: Math.floor(Math.random() * 12000) + 4000, conversion: Math.floor(Math.random() * 2500) + 600 },
  ];

  const totalPv = channelData.reduce((sum, c) => sum + c.pv, 0);
  const totalUv = channelData.reduce((sum, c) => sum + c.uv, 0);
  const totalConversion = channelData.reduce((sum, c) => sum + c.conversion, 0);

  return {
    pv: totalPv,
    uv: totalUv,
    participateCount: totalConversion,
    conversionRate: Number((totalConversion / totalUv).toFixed(4)),
    cost: Math.floor(Math.random() * 50000) + 10000,
    roi: Number((Math.random() * 5 + 1).toFixed(2)),
    dailyTrend,
    channelData,
  };
};

export const generateActivity = (status: ActivityStatus = 'active'): Activity => {
  const names = [
    '618年中大促活动',
    '双11狂欢购物节',
    '新春特惠活动',
    '会员专享福利',
    '新用户注册有礼',
    '消费满减活动',
    '限时秒杀活动',
    '品牌周年庆',
  ];
  const descriptions = [
    '全场商品低至5折，满额再享优惠',
    '百万优惠券大放送，购物更省钱',
    '新春好礼相送，福气满满一整年',
    '会员专享价格，积分翻倍',
    '新用户注册即送百元大礼包',
    '消费满200减50，上不封顶',
    '每日限时秒杀，爆款超低价',
    '感谢一路有你，全场狂欢',
  ];
  const idx = Math.floor(Math.random() * names.length);

  const coverImages = [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=promotional%20banner%20with%20blue%20gradient%20modern%20design&image_size=landscape_16_9',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shopping%20festival%20promotion%20banner%20red%20theme&image_size=landscape_16_9',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=spring%20festival%20promotion%20golden%20red%20elegant&image_size=landscape_16_9',
  ];

  const channels: Channel[] = [
    generateChannel('wechat', 'available'),
    generateChannel('alipay', 'available'),
    generateChannel('app', 'available'),
    generateChannel('h5', Math.random() > 0.7 ? 'unavailable' : 'available'),
    generateChannel('miniprogram', Math.random() > 0.8 ? 'maintenance' : 'available'),
  ];

  return {
    id: generateId(),
    name: names[idx],
    description: descriptions[idx],
    status,
    startTime: generateDate(Math.floor(Math.random() * 7) - 7),
    endTime: generateDate(Math.floor(Math.random() * 14) + 7),
    coverImage: coverImages[Math.floor(Math.random() * coverImages.length)],
    rules: [generateRule(channels), generateRule(channels)],
    channels,
    metrics: generateMetrics(),
    createdAt: generateDateTime(-30),
    updatedAt: generateDateTime(0),
  };
};

export const generateActivities = (count: number = 8): Activity[] => {
  const statuses: ActivityStatus[] = ['draft', 'pending', 'active', 'active', 'active', 'paused', 'ended'];
  return Array.from({ length: count }, () =>
    generateActivity(statuses[Math.floor(Math.random() * statuses.length)])
  );
};

export const createEmptyActivity = (): Activity => {
  const channels: Channel[] = [
    generateChannel('wechat', 'available'),
    generateChannel('alipay', 'available'),
    generateChannel('app', 'available'),
    generateChannel('h5', 'available'),
    generateChannel('miniprogram', 'available'),
  ];
  channels.forEach(c => c.enabled = false);

  return {
    id: generateId(),
    name: '',
    description: '',
    status: 'draft',
    startTime: '',
    endTime: '',
    coverImage: '',
    rules: [],
    channels,
    metrics: {
      pv: 0,
      uv: 0,
      participateCount: 0,
      conversionRate: 0,
      cost: 0,
      roi: 0,
      dailyTrend: [],
      channelData: [],
    },
    createdAt: generateDateTime(0),
    updatedAt: generateDateTime(0),
  };
};
