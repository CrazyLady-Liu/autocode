import { formatDistanceToNow, format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(num: number): string {
  if (num >= 100000000) {
    return `¥${(num / 100000000).toFixed(2)}亿`;
  }
  if (num >= 10000) {
    return `¥${(num / 10000).toFixed(2)}万`;
  }
  return `¥${num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'yyyy-MM-dd');
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'yyyy-MM-dd HH:mm');
  } catch {
    return dateStr;
  }
}

export function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { 
      addSuffix: true, 
      locale: zhCN 
    });
  } catch {
    return dateStr;
  }
}

export function formatPercent(num: number, total: number): string {
  if (total === 0) return '0%';
  return `${((num / total) * 100).toFixed(1)}%`;
}

export function formatStockDays(days: number): string {
  if (days === 0) return '已断货';
  if (days < 1) return `${Math.round(days * 24)}小时`;
  if (days < 30) return `${days.toFixed(1)}天`;
  return `${(days / 30).toFixed(1)}个月`;
}

export function truncateText(text: string, maxLength: number = 20): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    approved: '已批准',
    ordered: '已下单',
    completed: '已完成',
    new: '新告警',
    acknowledged: '已确认',
    resolved: '已解决',
    active: '正常',
    inactive: '停用',
    normal: '正常',
    warning: '警告',
    critical: '异常',
  };
  return statusMap[status] || status;
}

export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: '#F59E0B',
    approved: '#3B82F6',
    ordered: '#8B5CF6',
    completed: '#10B981',
    new: '#EF4444',
    acknowledged: '#F59E0B',
    resolved: '#10B981',
    active: '#10B981',
    inactive: '#6B7280',
    normal: '#10B981',
    warning: '#F59E0B',
    critical: '#EF4444',
    'on-time': '#10B981',
    early: '#3B82F6',
    late: '#EF4444',
  };
  return colorMap[status] || '#6B7280';
}
