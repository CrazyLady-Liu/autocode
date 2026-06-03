export interface Activity {
  id: string
  name: string
  description: string
  status: 'draft' | 'active' | 'paused' | 'ended'
  startTime: string
  endTime: string
  createdAt: string
  updatedAt: string
}

export interface Channel {
  id: string
  name: string
  code: string
  icon: string
  status: 'available' | 'unavailable' | 'maintenance'
  description: string
}

export interface Rule {
  id: string
  activityId: string
  channelId: string
  type: 'discount' | 'coupon' | 'points' | 'gift'
  config: {
    threshold?: number
    value?: number
    couponCode?: string
    points?: number
    giftName?: string
    giftImage?: string
  }
  conditions: {
    minAmount?: number
    userLevel?: string[]
    region?: string[]
  }
  priority: number
  enabled: boolean
}

export interface ActivityStats {
  activityId: string
  totalViews: number
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  channelStats: {
    channelId: string
    views: number
    clicks: number
    conversions: number
    revenue: number
  }[]
  dailyData: {
    date: string
    views: number
    clicks: number
    conversions: number
    revenue: number
  }[]
}

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}
