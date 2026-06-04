import { useMemo } from 'react'
import { BarChart3, TrendingUp, Fuel, Clock, MapPin, Zap, Truck, Recycle, Leaf, Weight } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const CHART_COLORS = ['#00ff88', '#00d4ff', '#7c3aed', '#ff6b35', '#ff006e']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-white">
          {p.name}: <span style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard({ data, optimizationData }) {
  const analytics = optimizationData?.analytics || data

  const binDistribution = useMemo(() => {
    if (!analytics) return []
    const dist = analytics.bin_distribution || {}
    return [
      { name: 'Critical', value: dist.critical || 0, color: '#ff006e' },
      { name: 'Full', value: dist.full || 0, color: '#ff6b35' },
      { name: 'Medium', value: dist.medium || 0, color: '#ffd60a' },
      { name: 'Empty', value: dist.empty || 0, color: '#00ff88' },
    ]
  }, [analytics])

  if (!analytics) {
    return (
      <div className="glass-card-static p-12 text-center">
        <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">No Analytics Data</h3>
        <p className="text-gray-400 text-sm">Generate a route first to view analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Roads Covered', value: analytics.roads_covered || 0, icon: MapPin, color: '#00ff88', suffix: '' },
          { label: 'Fuel Saved', value: `${analytics.fuel_saved_liters || 0}`, icon: Fuel, color: '#00d4ff', suffix: 'L' },
          { label: 'Distance Reduced', value: `${analytics.distance_saved_pct || 0}`, icon: TrendingUp, color: '#7c3aed', suffix: '%' },
          { label: 'Collection Efficiency', value: `${analytics.collection_efficiency || 0}`, icon: Zap, color: '#ff6b35', suffix: '%' },
          { label: 'Waste Collected', value: `${analytics.total_waste_collected_kg || 0}`, icon: Weight, color: '#ffd60a', suffix: 'kg' },
          { label: 'CO₂ Reduction', value: `${analytics.co2_reduction_kg || 0}`, icon: Leaf, color: '#00ff88', suffix: 'kg' },
        ].map((kpi, i) => {
          const Icon = kpi.icon
          return (
            <div key={i} className="glass-card p-5">
              <Icon className="w-5 h-5 mb-3" style={{ color: kpi.color }} />
              <div className="text-2xl font-bold text-white">
                {kpi.value}<span className="text-sm font-normal ml-1" style={{ color: kpi.color }}>{kpi.suffix}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Daily Collection */}
        {data?.daily_collection_data && (
          <div className="glass-card-static p-5">
            <h4 className="text-white font-semibold mb-4 text-sm">Daily Collection Performance</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.daily_collection_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="day" tick={{ fill: '#666', fontSize: 12 }} />
                <YAxis tick={{ fill: '#666', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="collected" stackId="1" stroke="#00ff88" fill="#00ff8830" name="Collected" />
                <Area type="monotone" dataKey="skipped" stackId="1" stroke="#ff006e" fill="#ff006e30" name="Skipped" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weekly Distance */}
        {data?.weekly_distance_data && (
          <div className="glass-card-static p-5">
            <h4 className="text-white font-semibold mb-4 text-sm">Weekly Distance Comparison</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.weekly_distance_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis dataKey="week" tick={{ fill: '#666', fontSize: 12 }} />
                <YAxis tick={{ fill: '#666', fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#888' }} />
                <Bar dataKey="traditional" fill="#ff006e80" name="Traditional" radius={[4,4,0,0]} />
                <Bar dataKey="optimized" fill="#00ff8880" name="Optimized" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Bin Distribution */}
        <div className="glass-card-static p-5">
          <h4 className="text-white font-semibold mb-4 text-sm">Bin Fill Distribution</h4>
          <div className="flex items-center justify-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={binDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {binDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {binDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ background: item.color }} />
                  <span className="text-gray-400 text-xs">{item.name}</span>
                  <span className="text-white text-xs font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fuel Consumption */}
        {data?.fuel_consumption && (
          <div className="glass-card-static p-5">
            <h4 className="text-white font-semibold mb-4 text-sm">Fuel Consumption by Type</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.fuel_consumption} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                <XAxis type="number" tick={{ fill: '#666', fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#666', fontSize: 12 }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#888' }} />
                <Bar dataKey="traditional" fill="#ff006e80" name="Traditional" radius={[0,4,4,0]} />
                <Bar dataKey="optimized" fill="#00ff8880" name="Optimized" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Efficiency Gauge */}
      <div className="glass-card-static p-5">
        <h4 className="text-white font-semibold mb-4 text-sm">Efficiency Metrics</h4>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Time Efficiency', value: analytics.optimized_time_minutes || 0, max: analytics.traditional_time_minutes || 60, color: '#00ff88' },
            { label: 'Fuel Efficiency', value: analytics.fuel_saved_pct || 0, max: 100, color: '#00d4ff' },
            { label: 'Route Efficiency', value: analytics.collection_efficiency || 0, max: 100, color: '#7c3aed' },
          ].map((g, i) => (
            <div key={i} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={g.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(g.value / g.max) * 251.2} 251.2`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{g.value}%</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">{g.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
