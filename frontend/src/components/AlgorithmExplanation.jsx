import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight, GitBranch, Circle, ArrowRight, Check, X } from 'lucide-react'

const sections = [
  {
    id: 'graph',
    title: 'Graph Representation',
    icon: GitBranch,
    content: `In Graph Theory, a graph is a structure consisting of vertices (nodes) and edges (connections between nodes). In our EcoRoute AI platform, we represent the road network as a graph:

• Vertices (V) = Road intersections/junctions
• Edges (E) = Road segments connecting intersections
• Edge Weight = Physical distance of the road segment

This representation allows us to apply powerful graph algorithms to optimize collection routes.`,
  },
  {
    id: 'vertices',
    title: 'Vertices (Junctions)',
    icon: Circle,
    content: `Each road intersection in the network is represented as a vertex. Each vertex has a "degree" — the number of roads connected to it.

Key properties:
• Degree: Number of edges connected to a vertex
• Even Degree: Vertex with an even number of connected roads
• Odd Degree: Vertex with an odd number of connected roads

The degree of vertices determines whether an Euler Path or Circuit exists.`,
    visualization: 'degree'
  },
  {
    id: 'edges',
    title: 'Edges (Road Segments)',
    icon: ArrowRight,
    content: `Each road segment between two junctions is an edge. Edges have weights representing the physical distance.

Properties:
• Undirected: Roads can be traversed in both directions
• Weighted: Each road has a distance cost
• Connected: All roads form a connected network`,
  },
  {
    id: 'euler-path',
    title: 'Euler Path',
    icon: ChevronRight,
    content: `An Euler Path is a trail in a graph that visits every edge exactly once.

Conditions for Euler Path existence:
• The graph must be connected
• Exactly 2 vertices have odd degree

The path starts at one odd-degree vertex and ends at the other.

In waste collection, an Euler Path means the truck covers every street exactly once with no repetition — the most fuel-efficient route possible.`,
    visualization: 'euler-path'
  },
  {
    id: 'euler-circuit',
    title: 'Euler Circuit',
    icon: Check,
    content: `An Euler Circuit is an Euler Path that starts and ends at the same vertex.

Conditions for Euler Circuit existence:
• The graph must be connected
• ALL vertices must have even degree

When an Euler Circuit exists, the collection truck can start from the depot, cover every street exactly once, and return to the starting point — the optimal route.`,
    visualization: 'euler-circuit'
  },
  {
    id: 'algorithm',
    title: 'Our Algorithm Flow',
    icon: GitBranch,
    content: `Step 1: Build the Graph
• Convert the selected area's road network into a graph
• Create vertices for each junction
• Create edges for each road segment with distance weights

Step 2: Analyze Vertex Degrees
• Calculate the degree of each vertex
• Count vertices with odd degrees

Step 3: Determine Route Type
• 0 odd vertices → Euler Circuit exists (best case)
• 2 odd vertices → Euler Path exists (optimal)
• >2 odd vertices → Use heuristic optimization (Hierholzer's algorithm with edge duplication)

Step 4: Generate Route
• Use NetworkX library to find Euler path/circuit
• For non-Eulerian graphs, duplicate minimum edges to make it Eulerian

Step 5: Visualize
• Display the optimized route on the map
• Show statistics and comparisons`,
    visualization: 'flow'
  },
]

function DegreeVisualization() {
  const examples = [
    { degree: 2, type: 'Even', color: '#00ff88', desc: 'Through road - truck passes straight through' },
    { degree: 4, type: 'Even', color: '#00ff88', desc: 'Cross intersection - truck can traverse all roads' },
    { degree: 3, type: 'Odd', color: '#ff006e', desc: 'T-junction - one road will need repetition' },
    { degree: 1, type: 'Odd', color: '#ff006e', desc: 'Dead end - truck must come back' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {examples.map((ex, i) => (
        <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${ex.color}20` }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${ex.color}20` }}>
              <span className="text-sm font-bold" style={{ color: ex.color }}>{ex.degree}</span>
            </div>
            <span className="text-xs font-semibold" style={{ color: ex.color }}>{ex.type}</span>
          </div>
          <p className="text-xs text-gray-400">{ex.desc}</p>
        </div>
      ))}
    </div>
  )
}

function FlowVisualization() {
  const steps = [
    { num: '01', title: 'Build Graph', desc: 'Map roads to edges', color: '#00ff88' },
    { num: '02', title: 'Analyze Degrees', desc: 'Count odd vertices', color: '#00d4ff' },
    { num: '03', title: 'Check Euler', desc: 'Path or Circuit?', color: '#7c3aed' },
    { num: '04', title: 'Generate Route', desc: 'Find optimal path', color: '#ff6b35' },
    { num: '05', title: 'Visualize', desc: 'Display on map', color: '#ff006e' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-1" style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
              <span className="text-sm font-bold" style={{ color: step.color }}>{step.num}</span>
            </div>
            <div className="text-xs text-white font-medium">{step.title}</div>
            <div className="text-xs text-gray-500">{step.desc}</div>
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function AlgorithmExplanation({ graphData }) {
  const [openSection, setOpenSection] = useState('graph')

  return (
    <div className="space-y-4">
      <div className="glass-card-static px-5 py-3 flex items-center gap-3">
        <BookOpen className="w-5 h-5 text-green-400" />
        <h3 className="text-white font-semibold">Graph Theory & Algorithm Guide</h3>
      </div>

      {/* Quick Reference */}
      {graphData && (
        <div className="glass-card-static p-5">
          <h4 className="text-white font-semibold mb-3 text-sm">Current Graph Analysis</h4>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-3 rounded-xl" style={{ background: 'rgba(0,255,136,0.05)' }}>
              <div className="text-xs text-gray-400 mb-1">Vertices with Even Degree</div>
              <div className="text-xl font-bold text-green-400">
                {graphData.nodes?.filter(n => !n.is_odd).length || 0}
              </div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'rgba(255,0,110,0.05)' }}>
              <div className="text-xs text-gray-400 mb-1">Vertices with Odd Degree</div>
              <div className="text-xl font-bold text-red-400">
                {graphData.nodes?.filter(n => n.is_odd).length || 0}
              </div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.05)' }}>
              <div className="text-xs text-gray-400 mb-1">Euler Status</div>
              <div className="text-sm font-bold text-blue-400">
                {graphData.euler_info?.has_euler_circuit ? 'Circuit Found' :
                 graphData.euler_info?.has_euler_path ? 'Path Found' :
                 'Heuristic Route'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-2">
        {sections.map(section => {
          const Icon = section.icon
          const isOpen = openSection === section.id
          return (
            <div key={section.id} className="glass-card-static overflow-hidden">
              <button
                onClick={() => setOpenSection(isOpen ? null : section.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
              >
                <Icon className="w-5 h-5 text-green-400 shrink-0" />
                <span className="text-white font-medium flex-1">{section.title}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' }}>
                    {section.content}
                  </div>
                  {section.visualization === 'degree' && <DegreeVisualization />}
                  {section.visualization === 'flow' && <FlowVisualization />}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Euler's Theorem */}
      <div className="glass-card-static p-5">
        <h4 className="text-white font-semibold mb-4 text-sm">Euler's Theorem Quick Reference</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="text-left text-gray-400 font-medium py-2 px-3">Condition</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3">Result</th>
                <th className="text-left text-gray-400 font-medium py-2 px-3">Route Quality</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="py-3 px-3 text-white">Connected + 0 odd vertices</td>
                <td className="py-3 px-3 text-green-400">Euler Circuit</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-400">Optimal</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td className="py-3 px-3 text-white">Connected + 2 odd vertices</td>
                <td className="py-3 px-3 text-blue-400">Euler Path</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400">Very Good</span></td>
              </tr>
              <tr>
                <td className="py-3 px-3 text-white">Connected + more odd vertices</td>
                <td className="py-3 px-3 text-orange-400">Heuristic Route</td>
                <td className="py-3 px-3"><span className="px-2 py-0.5 rounded text-xs bg-orange-500/10 text-orange-400">Good (with duplication)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
