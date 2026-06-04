import { useState, useMemo } from 'react'
import { Recycle, AlertTriangle, CheckCircle, AlertCircle, Circle, RefreshCw } from 'lucide-react'

const statusConfig = {
  Empty: { color: '#00ff88', bg: 'rgba(0,255,136,0.1)', icon: CheckCircle },
  Medium: { color: '#ffd60a', bg: 'rgba(255,214,10,0.1)', icon: Circle },
  Full: { color: '#ff6b35', bg: 'rgba(255,107,53,0.1)', icon: AlertCircle },
  Critical: { color: '#ff006e', bg: 'rgba(255,0,110,0.1)', icon: AlertTriangle },
}

export default function SmartBinManagement({ bins, onRefresh }) {
  const [filter, setFilter] = useState('all')

  const stats = useMemo(() => ({
    total: bins.length,
    empty: bins.filter(b => b.status === 'Empty').length,
    medium: bins.filter(b => b.status === 'Medium').length,
    full: bins.filter(b => b.status === 'Full').length,
    critical: bins.filter(b => b.status === 'Critical').length,
    avgFill: bins.length ? Math.round(bins.reduce((sum, b) => sum + b.fill_level, 0) / bins.length) : 0,
  }), [bins])

  const filtered = useMemo(() => {
    if (filter === 'all') return bins
    return bins.filter(b => b.status === filter)
  }, [bins, filter])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="glass-card-static px-5 py-3 flex items-center gap-3">
          <Recycle className="w-5 h-5 text-green-400" />
          <h3 className="text-white font-semibold">Smart Bin Management</h3>
        </div>
        <button onClick={onRefresh} className="btn-secondary text-xs">
          <RefreshCw className="w-3 h-3" /> Refresh Status
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total Bins', value: stats.total, color: '#fff' },
          { label: 'Empty', value: stats.empty, color: '#00ff88' },
          { label: 'Medium', value: stats.medium, color: '#ffd60a' },
          { label: 'Full', value: stats.full, color: '#ff6b35' },
          { label: 'Critical', value: stats.critical, color: '#ff006e' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fill Level Overview */}
      <div className="glass-card-static p-5">
        <h4 className="text-white text-sm font-semibold mb-3">Average Fill Level</h4>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${stats.avgFill}%`,
                background: stats.avgFill > 80 ? 'linear-gradient(90deg, #ff6b35, #ff006e)' :
                           stats.avgFill > 50 ? 'linear-gradient(90deg, #ffd60a, #ff6b35)' :
                           'linear-gradient(90deg, #00ff88, #00d4ff)',
              }}
            />
          </div>
          <span className="text-white font-mono text-sm font-bold w-12 text-right">{stats.avgFill}%</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['all', 'Critical', 'Full', 'Medium', 'Empty'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn-secondary text-xs py-1.5 px-3 ${filter === f ? 'active' : ''}`}
          >
            {f === 'all' ? 'All Bins' : f}
            {f !== 'all' && (
              <span className="ml-1 text-xs opacity-60">
                ({bins.filter(b => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bin Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(bin => {
          const cfg = statusConfig[bin.status]
          const StatusIcon = cfg.icon
          return (
            <div key={bin.id} className="glass-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <StatusIcon className="w-4 h-4" style={{ color: cfg.color }} />
                  <span className="text-white font-semibold text-sm">{bin.id}</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {bin.status}
                </span>
              </div>
              <div className="text-xs text-gray-400 mb-3 truncate">{bin.name}</div>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Fill Level</span>
                  <span className="text-white font-mono">{bin.fill_level}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${bin.fill_level}%`,
                      background: cfg.color,
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Lat: {bin.lat.toFixed(4)}</span>
                <span>Lng: {bin.lng.toFixed(4)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
