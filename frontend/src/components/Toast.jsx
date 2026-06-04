import { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
}

const colors = {
  success: { bg: 'rgba(0,255,136,0.15)', border: 'rgba(0,255,136,0.3)', text: '#00ff88' },
  error: { bg: 'rgba(255,0,110,0.15)', border: 'rgba(255,0,110,0.3)', text: '#ff006e' },
  info: { bg: 'rgba(0,212,255,0.15)', border: 'rgba(0,212,255,0.3)', text: '#00d4ff' },
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [visible, setVisible] = useState(true)
  const Icon = icons[type] || icons.success
  const color = colors[type] || colors.success

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 8px 32px ${color.border}`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
      }}
    >
      <Icon className="w-5 h-5 shrink-0" style={{ color: color.text }} />
      <span className="text-sm text-white font-medium">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="ml-2 text-gray-400 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
