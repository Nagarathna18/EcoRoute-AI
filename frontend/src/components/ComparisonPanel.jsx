import { ArrowLeftRight, Clock, Fuel, Route, Repeat, TrendingDown, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-white">
          {p.name}: <span style={{ color: p.fill || p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function ComparisonPanel({ data }) {
  if (!data) {
    return (
      <div className="glass-card-static p-12 text-center">
        <ArrowLeftRight className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-white text-lg font-semibold mb-2">No Comparison Data</h3>
        <p className="text-gray-400 text-sm">Generate an optimized route first to see the comparison.</p>
      </div>
    )
  }

  const { traditional: t, optimized: o } = data

  const chartData = [
    { name: 'Distance', traditional: t.distance_meters, optimized: o.distance_meters },
    { name: 'Time', traditional: t.time_minutes, optimized: o.time_minutes },
    { name: 'Fuel', traditional: t.fuel_liters, optimized: o.fuel_liters },
  ]

  const radarData = [
    { metric: 'Distance', traditional: 100, optimized: Math.round((o.distance_meters / t.distance_meters) * 100) },
    { metric: 'Time', traditional: 100, optimized: Math.round((o.time_minutes / t.time_minutes) * 100) },
    { metric: 'Fuel', traditional: 100, optimized: Math.round((o.fuel_liters / t.fuel_liters) * 100) },
    { metric: 'Repeated Roads', traditional: 100, optimized: t.repeated_roads > 0 ? Math.round((o.repeated_roads / t.repeated_roads) * 100) : 0 },
    { metric: 'Efficiency', traditional: Math.round(t.efficiency), optimized: Math.round(o.efficiency) },
  ]

  const improvements = [
    {
      label: 'Distance',
      icon: Route,
      traditional: `${t.distance_meters}m`,
      optimized: `${o.distance_meters}m`,
      saving: `${Math.round((1 - o.distance_meters / t.distance_meters) * 100)}%`,
      positive: o.distance_meters < t.distance_meters,
    },
    {
      label: 'Time',
      icon: Clock,
      traditional: `${t.time_minutes}min`,
      optimized: `${o.time_minutes}min`,
      saving: `${Math.round((1 - o.time_minutes / t.time_minutes) * 100)}%`,
      positive: o.time_minutes < t.time_minutes,
    },
    {
      label: 'Fuel',
      icon: Fuel,
      traditional: `${t.fuel_liters}L`,
      optimized: `${o.fuel_liters}L`,
      saving: `${Math.round((1 - o.fuel_liters / t.fuel_liters) * 100)}%`,
      positive: o.fuel_liters < t.fuel_liters,
    },
    {
      label: 'Repeated Roads',
      icon: Repeat,
      traditional: t.repeated_roads,
      optimized: o.repeated_roads,
      saving: `${Math.max(0, t.repeated_roads - o.repeated_roads)} fewer`,
      positive: o.repeated_roads < t.repeated_roads,
    },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-card-static px-5 py-3 flex items-center gap-3">
        <ArrowLeftRight className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-semibold">Traditional vs Optimized Route</h3>
      </div>

      {/* Improvement Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {improvements.map((imp, i) => {
          const Icon = imp.icon
          return (
            <div key={i} className="glass-card p-5">
              <Icon className="w-5 h-5 mb-3 text-gray-400" />
              <div className="text-xs text-gray-500 mb-2">{imp.label}</div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-lg text-red-400 line-through font-mono">{imp.traditional}</span>
                <span className="text-lg text-green-400 font-bold font-mono">{imp.optimized}</span>
              </div>
              <div className="flex items-center gap-1">
                {imp.positive ? (
                  <TrendingDown className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingUp className="w-3 h-3 text-red-400" />
                )}
                <span className={`text-xs font-semibold ${imp.positive ? 'text-green-400' : 'text-red-400'}`}>
                  {imp.saving} saved
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="glass-card-static p-5">
          <h4 className="text-white font-semibold mb-4 text-sm">Direct Comparison</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 12 }} />
              <YAxis tick={{ fill: '#666', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#888' }} />
              <Bar dataKey="traditional" fill="#ff006e80" name="Traditional" radius={[4,4,0,0]} />
              <Bar dataKey="optimized" fill="#00ff8880" name="Optimized" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="glass-card-static p-5">
          <h4 className="text-white font-semibold mb-4 text-sm">Performance Radar</h4>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#ffffff10" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#666', fontSize: 11 }} />
              <Radar name="Traditional" dataKey="traditional" stroke="#ff006e" fill="#ff006e30" fillOpacity={0.3} />
              <Radar name="Optimized" dataKey="optimized" stroke="#00ff88" fill="#00ff8830" fillOpacity={0.3} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#888' }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card-static p-5">
        <h4 className="text-white font-semibold mb-4 text-sm">Optimization Summary</h4>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,0,110,0.05)' }}>
            <div className="text-xs text-gray-400 mb-2">Traditional Approach</div>
            <div className="text-2xl font-bold text-red-400">{Math.round((1 - o.efficiency / t.efficiency) * 100)}%</div>
            <div className="text-xs text-gray-500">less efficient</div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,255,136,0.05)' }}>
            <div className="text-xs text-gray-400 mb-2">Euler Optimized</div>
            <div className="text-2xl font-bold text-green-400">{Math.round(o.efficiency)}%</div>
            <div className="text-xs text-gray-500">collection efficiency</div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)' }}>
            <div className="text-xs text-gray-400 mb-2">Overall Improvement</div>
            <div className="text-2xl font-bold text-blue-400">
              {Math.round(((t.distance_meters - o.distance_meters) / t.distance_meters) * 100)}%
            </div>
            <div className="text-xs text-gray-500">distance reduction</div>
          </div>
        </div>
      </div>
    </div>
  )
}
