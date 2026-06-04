import { useState } from 'react'
import { Route, Play, Zap, Clock, Fuel, MapPin, ArrowRight, Loader2 } from 'lucide-react'

export default function EulerOptimization({ graphData, optimizationData, onOptimize, loading }) {
  const [priority, setPriority] = useState('all')

  const handleOptimize = () => {
    onOptimize(priority)
  }

  const analytics = optimizationData?.analytics
  const route = optimizationData?.route || []
  const eulerInfo = optimizationData?.euler_result?.info

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="glass-card-static p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Route className="w-5 h-5 text-green-400" />
              Euler Path Route Optimization
            </h3>
            <p className="text-gray-400 text-sm">
              Generate an optimized collection route using Graph Theory algorithms.
              The system checks for Euler Path/Circuit and generates the minimum-repetition traversal.
            </p>
          </div>
          <button
            onClick={handleOptimize}
            disabled={loading}
            className="btn-primary whitespace-nowrap"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Generate Collection Route
              </>
            )}
          </button>
        </div>

        {/* Priority Filters */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs text-gray-500 self-center mr-2">Priority:</span>
          {[
            { id: 'all', label: 'All Bins' },
            { id: 'full', label: 'Full Only' },
            { id: 'critical', label: 'Critical Only' },
            { id: 'critical_full', label: 'Critical + Full' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPriority(p.id)}
              className={`btn-secondary text-xs py-1.5 px-3 ${priority === p.id ? 'active' : ''}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {optimizationData && (
        <>
          {/* Euler Info */}
          {eulerInfo && (
            <div className={`glass-card-static p-5 border-l-4 ${eulerInfo.has_euler_circuit ? 'border-l-green-400' : eulerInfo.has_euler_path ? 'border-l-blue-400' : 'border-l-orange-400'}`}>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4" style={{ color: eulerInfo.has_euler_circuit ? '#00ff88' : eulerInfo.has_euler_path ? '#00d4ff' : '#ff6b35' }} />
                <span className="text-sm font-semibold text-white">Algorithm Result</span>
              </div>
              <p className="text-gray-400 text-sm">{eulerInfo.message}</p>
              <div className="mt-2 text-xs text-gray-500">
                Route Type: <span className="text-white font-mono capitalize">{optimizationData.euler_result?.type}</span>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Roads Covered', value: analytics?.roads_covered, icon: MapPin, color: '#00ff88' },
              { label: 'Distance Saved', value: `${analytics?.distance_saved_pct || 0}%`, icon: Route, color: '#00d4ff' },
              { label: 'Time Saved', value: `${analytics?.time_saved_minutes || 0}m`, icon: Clock, color: '#7c3aed' },
              { label: 'Fuel Saved', value: `${analytics?.fuel_saved_liters || 0}L`, icon: Fuel, color: '#ff6b35' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="glass-card p-4">
                  <Icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              )
            })}
          </div>

          {/* Route Details */}
          <div className="glass-card-static p-5">
            <h3 className="text-white font-semibold mb-4">Optimized Route Sequence</h3>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {route.map((step, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #00ff8820, #00d4ff20)', color: '#00ff88' }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 flex items-center gap-2 text-sm">
                    <span className="text-white font-mono">{step.from}</span>
                    <ArrowRight className="w-3 h-3 text-gray-500" />
                    <span className="text-white font-mono">{step.to}</span>
                  </div>
                  <div className="text-xs text-gray-400">{step.distance}m</div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Summary */}
          {analytics && (
            <div className="glass-card-static p-5">
              <h3 className="text-white font-semibold mb-4">Collection Summary</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Algorithm Used</span>
                    <span className="text-white font-mono capitalize">{analytics.algorithm}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Collection Efficiency</span>
                    <span className="text-green-400 font-mono">{analytics.collection_efficiency}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Bins</span>
                    <span className="text-white font-mono">{analytics.total_bins}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Average Fill Level</span>
                    <span className="text-white font-mono">{analytics.avg_bin_fill}%</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Traditional Distance</span>
                    <span className="text-red-400 font-mono">{analytics.optimized_distance + analytics.distance_saved}m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Optimized Distance</span>
                    <span className="text-green-400 font-mono">{analytics.optimized_distance}m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Traditional Time</span>
                    <span className="text-red-400 font-mono">{analytics.traditional_time_minutes}m</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Optimized Time</span>
                    <span className="text-green-400 font-mono">{analytics.optimized_time_minutes}m</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!optimizationData && !loading && (
        <div className="glass-card-static p-12 text-center">
          <Route className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">No Route Generated</h3>
          <p className="text-gray-400 text-sm">Select your area and click "Generate Collection Route" to optimize waste collection paths.</p>
        </div>
      )}
    </div>
  )
}
