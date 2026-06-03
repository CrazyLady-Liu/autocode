import React from 'react'
import { Activity, Channel } from '../types'

interface StatusBadgeProps {
  status: Activity['status'] | Channel['status']
}

const statusConfig = {
  draft: { label: '草稿', bg: 'bg-gray-100', text: 'text-gray-600' },
  active: { label: '进行中', bg: 'bg-green-100', text: 'text-green-600' },
  paused: { label: '已暂停', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  ended: { label: '已结束', bg: 'bg-red-100', text: 'text-red-600' },
  available: { label: '可用', bg: 'bg-green-100', text: 'text-green-600' },
  unavailable: { label: '不可用', bg: 'bg-red-100', text: 'text-red-600' },
  maintenance: { label: '维护中', bg: 'bg-yellow-100', text: 'text-yellow-600' }
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.draft
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  )
}

export default StatusBadge
