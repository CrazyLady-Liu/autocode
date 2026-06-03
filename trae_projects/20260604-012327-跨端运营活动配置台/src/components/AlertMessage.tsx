import React from 'react'
import { AlertCircle, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react'

interface AlertMessageProps {
  type: 'error' | 'warning' | 'success' | 'info'
  message: string
  onClose?: () => void
}

const typeConfig = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: XCircle
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: AlertTriangle
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: CheckCircle
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: AlertCircle
  }
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className={`flex items-start p-4 rounded-lg border ${config.bg} ${config.border}`}>
      <Icon className={`w-5 h-5 mr-3 mt-0.5 ${config.text}`} />
      <p className={`flex-1 text-sm ${config.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-3 p-1 rounded hover:bg-white/50 transition-colors ${config.text}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default AlertMessage
