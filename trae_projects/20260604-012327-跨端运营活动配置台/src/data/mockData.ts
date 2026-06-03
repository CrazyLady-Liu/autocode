import { Activity, Channel, Rule, ActivityStats } from '../types'

export const mockChannels: Channel[] = [
  {
    id: '1',
    name: '微信小程序',
    code: 'wechat_mini',
    icon: 'MessageCircle',
    status: 'available',
    description: '微信小程序端投放'
  },
  {
    id: '2',
    name: 'APP首页',
    code: 'app_home',
    icon: 'Smartphone',
    status: 'available',
    description: 'APP首页Banner'
  },
  {
    id: '3',
    name: 'H5活动页',
    code: 'h5_activity',
    icon: 'Globe',
    status: 'available',
    description: 'H5活动页面'
  },
  {
    id: '4',
    name: '短信推送',
    code: 'sms',
    icon: 'MessageSquare',
    status: 'maintenance',
    description: '短信营销推送'
  },
  {
    id: '5',
    name: '抖音小程序',
    code: 'douyin_mini',
    icon: 'Music',
    status: 'unavailable',
    description: '抖音小程序端投放'
  }
]

export const mockActivities: Activity[] = [
  {
    id: '1',
    name: '618年中大促',
    description: '全场满减活动，低至5折',
    status: 'active',
    startTime: '2026-06-01T00:00:00',
    endTime: '2026-06-20T23:59:59',
    createdAt: '2026-05-20T10:00:00',
    updatedAt: '2026-06-03T15:30:00'
  },
  {
    id: '2',
    name: '新用户专享礼包',
    description: '新用户注册即送100元优惠券',
    status: 'active',
    startTime: '2026-05-01T00:00:00',
    endTime: '2026-07-31T23:59:59',
    createdAt: '2026-04-15T09:00:00',
    updatedAt: '2026-06-01T10:00:00'
  },
  {
    id: '3',
    name: '会员日特惠',
    description: '每月18日会员专属折扣',
    status: 'draft',
    startTime: '2026-06-18T00:00:00',
    endTime: '2026-06-18T23:59:59',
    createdAt: '2026-06-02T14:00:00',
    updatedAt: '2026-06-03T09:00:00'
  },
  {
    id: '4',
    name: '五一劳动节促销',
    description: '劳动节特惠活动',
    status: 'ended',
    startTime: '2026-05-01T00:00:00',
    endTime: '2026-05-05T23:59:59',
    createdAt: '2026-04-20T10:00:00',
    updatedAt: '2026-05-06T00:00:00'
  },
  {
    id: '5',
    name: '双11预热活动',
    description: '',
    status: 'draft',
    startTime: '',
    endTime: '',
    createdAt: '2026-06-01T10:00:00',
    updatedAt: '2026-06-01T10:00:00'
  }
]

export const mockRules: Rule[] = [
  {
    id: '1',
    activityId: '1',
    channelId: '1',
    type: 'discount',
    config: {
      threshold: 200,
      value: 20
    },
    conditions: {
      minAmount: 200,
      userLevel: ['normal', 'silver', 'gold'],
      region: ['北京', '上海', '广州', '深圳']
    },
    priority: 1,
    enabled: true
  },
  {
    id: '2',
    activityId: '1',
    channelId: '2',
    type: 'coupon',
    config: {
      threshold: 500,
      couponCode: '618COUPON50',
      value: 50
    },
    conditions: {
      minAmount: 500,
      userLevel: ['silver', 'gold']
    },
    priority: 2,
    enabled: true
  },
  {
    id: '3',
    activityId: '1',
    channelId: '3',
    type: 'points',
    config: {
      threshold: 100,
      points: 500
    },
    conditions: {
      minAmount: 100
    },
    priority: 3,
    enabled: true
  },
  {
    id: '4',
    activityId: '2',
    channelId: '1',
    type: 'gift',
    config: {
      giftName: '新人礼包',
      giftImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&h=100&fit=crop'
    },
    conditions: {},
    priority: 1,
    enabled: true
  },
  {
    id: '5',
    activityId: '3',
    channelId: '1',
    type: 'discount',
    config: {},
    conditions: {},
    priority: 1,
    enabled: false
  }
]

export const mockStats: ActivityStats[] = [
  {
    activityId: '1',
    totalViews: 125680,
    totalClicks: 15834,
    totalConversions: 3256,
    totalRevenue: 1256800,
    channelStats: [
      { channelId: '1', views: 65000, clicks: 8500, conversions: 1800, revenue: 720000 },
      { channelId: '2', views: 45000, clicks: 5200, conversions: 1056, revenue: 406800 },
      { channelId: '3', views: 15680, clicks: 2134, conversions: 400, revenue: 130000 }
    ],
    dailyData: [
      { date: '06-01', views: 15000, clicks: 1800, conversions: 380, revenue: 150000 },
      { date: '06-02', views: 18000, clicks: 2200, conversions: 450, revenue: 180000 },
      { date: '06-03', views: 22000, clicks: 2800, conversions: 580, revenue: 220000 },
      { date: '06-04', views: 25000, clicks: 3100, conversions: 620, revenue: 250000 },
      { date: '06-05', views: 28000, clicks: 3500, conversions: 700, revenue: 280000 },
      { date: '06-06', views: 17680, clicks: 2434, conversions: 526, revenue: 176800 }
    ]
  },
  {
    activityId: '2',
    totalViews: 89450,
    totalClicks: 9840,
    totalConversions: 4560,
    totalRevenue: 456000,
    channelStats: [
      { channelId: '1', views: 50000, clicks: 5500, conversions: 2800, revenue: 280000 },
      { channelId: '2', views: 39450, clicks: 4340, conversions: 1760, revenue: 176000 }
    ],
    dailyData: [
      { date: '05-27', views: 12000, clicks: 1300, conversions: 600, revenue: 60000 },
      { date: '05-28', views: 14000, clicks: 1550, conversions: 720, revenue: 72000 },
      { date: '05-29', views: 16000, clicks: 1750, conversions: 820, revenue: 82000 },
      { date: '05-30', views: 18000, clicks: 2000, conversions: 920, revenue: 92000 },
      { date: '05-31', views: 15000, clicks: 1650, conversions: 780, revenue: 78000 },
      { date: '06-01', views: 14450, clicks: 1590, conversions: 720, revenue: 72000 }
    ]
  }
]
