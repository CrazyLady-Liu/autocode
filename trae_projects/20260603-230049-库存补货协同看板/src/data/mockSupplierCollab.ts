import type { CommunicationRecord, ExpectedArrival } from '@/types';

export const mockCommunications: CommunicationRecord[] = [
  {
    id: 'comm-001',
    supplierId: 'sup-001',
    supplierName: '深圳电子科技有限公司',
    type: 'email',
    status: 'followup',
    subject: 'SKU-001 芯片交货延迟通知',
    content: '由于上游供应链问题，原定于 6 月 5 日的交货将延迟 3 天，请贵方理解。我们正在加急处理。',
    author: '采购部 - 李明',
    createdAt: '2026-06-03T09:30:00',
    followUpDate: '2026-06-05T10:00:00',
    relatedOrderId: 'PO-2026-0601',
  },
  {
    id: 'comm-002',
    supplierId: 'sup-003',
    supplierName: '东莞塑料制品厂',
    type: 'phone',
    status: 'pending',
    subject: '包装材料质量问题反馈',
    content: '最新批次的塑料包装存在轻微划痕，已致电供应商要求加强质量管控。',
    author: '质检部 - 王芳',
    createdAt: '2026-06-03T14:15:00',
    relatedOrderId: 'PO-2026-0598',
  },
  {
    id: 'comm-003',
    supplierId: 'sup-002',
    supplierName: '广州精密五金',
    type: 'meeting',
    status: 'resolved',
    subject: 'Q3 季度供应商评审会议',
    content: '会议讨论了 Q2 季度的交付表现和质量问题，Q3 将增加 20% 的订单量作为奖励。',
    author: '供应链 - 张伟',
    createdAt: '2026-06-02T15:00:00',
  },
  {
    id: 'comm-004',
    supplierId: 'sup-005',
    supplierName: '苏州电路板制造',
    type: 'email',
    status: 'completed',
    subject: 'PCB 样品确认',
    content: '样品已收到并通过测试，可进入批量生产阶段，预计 7 天内完成。',
    author: '研发部 - 陈工',
    createdAt: '2026-06-02T11:20:00',
  },
  {
    id: 'comm-005',
    supplierId: 'sup-001',
    supplierName: '深圳电子科技有限公司',
    type: 'system',
    status: 'pending',
    subject: '自动告警：准交率下降',
    content: '系统检测到该供应商近 30 天准交率从 95% 下降至 82%，建议重点关注。',
    author: '系统自动',
    createdAt: '2026-06-03T08:00:00',
  },
];

export const mockExpectedArrivals: ExpectedArrival[] = [
  {
    id: 'arr-001',
    supplierId: 'sup-001',
    supplierName: '深圳电子科技有限公司',
    orderId: 'PO-2026-0601',
    skuName: 'ARM 处理器芯片',
    quantity: 5000,
    expectedDate: '2026-06-08',
    adjustedDate: '2026-06-11',
    status: 'delayed',
    warehouse: '华南仓',
    trackingNumber: 'SF1234567890',
  },
  {
    id: 'arr-002',
    supplierId: 'sup-002',
    supplierName: '广州精密五金',
    orderId: 'PO-2026-0603',
    skuName: '不锈钢螺丝套件',
    quantity: 20000,
    expectedDate: '2026-06-04',
    status: 'arrived-today',
    warehouse: '华南仓',
    trackingNumber: 'YT9876543210',
  },
  {
    id: 'arr-003',
    supplierId: 'sup-004',
    supplierName: '上海化工原料',
    orderId: 'PO-2026-0605',
    skuName: '工业级环氧树脂',
    quantity: 500,
    expectedDate: '2026-06-06',
    status: 'in-transit',
    warehouse: '华东仓',
    trackingNumber: 'ZTO5678901234',
  },
  {
    id: 'arr-004',
    supplierId: 'sup-006',
    supplierName: '北京光学仪器',
    orderId: 'PO-2026-0602',
    skuName: '高精密镜头模组',
    quantity: 800,
    expectedDate: '2026-06-10',
    status: 'on-schedule',
    warehouse: '华北仓',
    trackingNumber: 'JD2345678901',
  },
  {
    id: 'arr-005',
    supplierId: 'sup-005',
    supplierName: '苏州电路板制造',
    orderId: 'PO-2026-0599',
    skuName: '8 层 PCB 主板',
    quantity: 3000,
    expectedDate: '2026-06-07',
    adjustedDate: '2026-06-05',
    status: 'early',
    warehouse: '华东仓',
    trackingNumber: 'EMS3456789012',
  },
];

export const getCommunicationTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    email: 'Email',
    phone: 'Phone',
    meeting: 'Users',
    system: 'Bot',
  };
  return icons[type] || 'MessageSquare';
};

export const getCommunicationStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#F59E0B',
    completed: '#10B981',
    followup: '#3B82F6',
    resolved: '#8B5CF6',
  };
  return colors[status] || '#6B7280';
};

export const getCommunicationStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待处理',
    completed: '已完成',
    followup: '跟进中',
    resolved: '已解决',
  };
  return texts[status] || status;
};

export const getArrivalStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'in-transit': '#3B82F6',
    delayed: '#EF4444',
    'arrived-today': '#10B981',
    'on-schedule': '#8B5CF6',
    early: '#F59E0B',
  };
  return colors[status] || '#6B7280';
};

export const getArrivalStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    'in-transit': '运输中',
    delayed: '已延迟',
    'arrived-today': '今日送达',
    'on-schedule': '按时中',
    early: '提前送达',
  };
  return texts[status] || status;
};
