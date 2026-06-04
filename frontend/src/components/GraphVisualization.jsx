import { useMemo } from 'react'
import { GitBranch, Circle, ArrowRight } from 'lucide-react'

export default function GraphVisualization({ graphData, loading }) {
  const nodes = graphData?.nodes || []
  const edges = graphData?.edges || []
  const stats = graphData?.stats
  const eulerInfo = graphData?.euler_info

  const nodePositions = useMemo(() => {
    if (!nodes.length) return {}
    const lats = nodes.map(n => n.lat)
    const lngs = nodes.map(n => n.lng)
    const minLat = Math.min(...lats), maxLat = Math.max(...lats)
    const minLng = Math.min(...lngs), maxLng = Math.max(...lngs)
    const rangeL = Math.max(maxLat - minLat, 0.001)
    const rangeG = Math.max(maxLng - minLng, 0.001)
    
    const positions = {}
    nodes.forEach(node => {
      positions[node.id] = {
        x: ((node.lng - minLng) / rangeG) * 80 + 10,
        y: ((node.lat - minLat) / rangeL) * 70 + 15,
      }
    })
    return positions
  }, [nodes])

  if (loading) {
    return (
      <div className="glass-card-static p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-t-green-400 border-gray-700 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Building road network graph...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Graph Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Junctions (Vertices)', value: stats?.total_nodes || 0, color: '#00ff88' },
          { label: 'Roads (Edges)', value: stats?.total_edges || 0, color: '#00d4ff' },
          { label: 'Avg Degree', value: stats?.avg_degree?.toFixed(1) || 0, color: '#7c3aed' },
          { label: 'Total Distance', value: `${((stats?.total_distance || 0) / 1000).toFixed(1)}km`, color: '#ff6b35' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4">
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Euler Info */}
      {eulerInfo && (
        <div className="glass-card-static p-5">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Euler Path Analysis</h3>
          </div>
          <div className={`p-4 rounded-xl text-sm ${eulerInfo.has_euler_circuit ? 'bg-green-500/10 border border-green-500/20' : eulerInfo.has_euler_path ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <div className="flex items-center gap-2 mb-2">
              {eulerInfo.has_euler_circuit ? (
                <div className="w-3 h-3 rounded-full bg-green-400" />
              ) : eulerInfo.has_euler_path ? (
                <div className="w-3 h-3 rounded-full bg-blue-400" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-red-400" />
              )}
              <span className={`font-semibold ${eulerInfo.has_euler_circuit ? 'text-green-400' : eulerInfo.has_euler_path ? 'text-blue-400' : 'text-red-400'}`}>
                {eulerInfo.has_euler_circuit ? 'Euler Circuit Found' : eulerInfo.has_euler_path ? 'Euler Path Found' : 'Heuristic Route'}
              </span>
            </div>
            <p className="text-gray-400">{eulerInfo.message}</p>
            {eulerInfo.odd_degree_nodes?.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                Odd degree nodes: {eulerInfo.odd_degree_nodes.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Graph */}
      <div className="glass-card-static p-5">
        <h3 className="text-white font-semibold mb-4">Road Network Graph</h3>
        <div className="relative rounded-xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', height: '400px' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Edges */}
            {edges.map((edge, i) => {
              const from = nodePositions[edge.source]
              const to = nodePositions[edge.target]
              if (!from || !to) return null
              return (
                <line
                  key={`e-${i}`}
                  x1={`${from.x}%`} y1={`${from.y}%`}
                  x2={`${to.x}%`} y2={`${to.y}%`}
                  stroke="#3a3a60"
                  strokeWidth="0.3"
                  opacity="0.7"
                />
              )
            })}
          </svg>
          
          {/* Nodes overlay */}
          {nodes.map(node => {
            const pos = nodePositions[node.id]
            if (!pos) return null
            return (
              <div
                key={node.id}
                className="absolute group"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-150"
                  style={{
                    background: node.is_odd ? '#ff006e' : '#00ff88',
                    boxShadow: `0 0 10px ${node.is_odd ? '#ff006e' : '#00ff88'}60`,
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-white/50" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-10">
                  <div className="px-2 py-1 rounded-lg text-xs" style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="text-white font-medium">{node.name}</div>
                    <div className="text-gray-400">Degree: {node.degree}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
            <span className="text-gray-400">Even Degree ({nodes.filter(n => !n.is_odd).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff006e]" />
            <span className="text-gray-400">Odd Degree ({nodes.filter(n => n.is_odd).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-[#3a3a60]" />
            <span className="text-gray-400">Road Edge</span>
          </div>
        </div>
      </div>

      {/* Node List */}
      <div className="glass-card-static p-5">
        <h3 className="text-white font-semibold mb-4">Junction Details</h3>
        <div className="grid gap-2 max-h-64 overflow-y-auto">
          {nodes.map(node => (
            <div key={node.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: node.is_odd ? '#ff006e' : '#00ff88' }}
                />
                <div>
                  <div className="text-white text-sm font-medium">{node.name}</div>
                  <div className="text-gray-500 text-xs">{node.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-white text-sm font-mono">{node.degree}</div>
                  <div className="text-gray-500 text-xs">degree</div>
                </div>
                <div className={`px-2 py-0.5 rounded text-xs font-medium ${node.is_odd ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                  {node.is_odd ? 'ODD' : 'EVEN'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
