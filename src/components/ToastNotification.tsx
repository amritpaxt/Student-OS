import React, { useEffect } from 'react'
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface ToastNotificationProps {
  message: string
  type: 'success' | 'warning' | 'error'
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, type }) => {
  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    warning: <AlertCircle size={20} className="text-amber-600" />,
    error: <XCircle size={20} className="text-red-600" />,
  }

  const bgColors = {
    success: 'bg-green-100 border-green-300 text-green-800',
    warning: 'bg-amber-100 border-amber-300 text-amber-800',
    error: 'bg-red-100 border-red-300 text-red-800',
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColors[type]} shadow-md pointer-events-auto animate-in slide-in-from-right-full duration-300`}>
      {icons[type]}
      <span className="font-medium">{message}</span>
    </div>
  )
}
