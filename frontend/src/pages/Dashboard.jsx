import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Leaf, Map, MapPin, GitBranch, Truck, BarChart3, 
  ArrowLeftRight, BookOpen, Home, ChevronDown, 
  Route, Recycle, Menu, X, FileText
} from 'lucide-react'
import MapPanel from '../components/MapPanel'
import AreaSelection from '../components/AreaSelection'
import GraphVisualization from '../components/GraphVisualization'
import EulerOptimization from '../components/EulerOptimization'
import SmartBinManagement from '../components/SmartBinManagement'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import ComparisonPanel from '../components/ComparisonPanel'
import AlgorithmExplanation from '../components/AlgorithmExplanation'
import Toast from '../components/Toast'
import PdfExport from '../components/PdfExport'

const API_BASE = '/api'

const navItems = [
  { id: 'map', icon: Map, label: 'Map View' },
  { id: 'graph', icon: GitBranch, label: 'Road Network' },
  { id: 'optimize', icon: Route, label: 'Route Optimization' },
  { id: 'bins', icon: Recycle, label: 'Smart Bins' },
  { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  { id: 'compare', icon: ArrowLeftRight, label: 'Comparison' },
  { id: 'learn', icon: BookOpen, label: 'Algorithm Guide' },
]

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('map')
  const [selectedCity, setSelectedCity] = useState('mysore')
  const [selectedLocality, setSelectedLocality] = useState('gokulam')
  const [graphData, setGraphData] = useState(null)
  const [optimizationData, setOptimizationData] = useState(null)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState(null)

  const fetchGraphData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/graph/${selectedCity}/${selectedLocality}`)
      const data = await res.json()
      setGraphData(data)
    } catch (err) {
      console.error('Failed to fetch graph data:', err)
    }
    setLoading(false)
  }, [selectedCity, selectedLocality])

  const fetchOptimization = useCallback(async (priority = 'all') => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/optimize/${selectedCity}/${selectedLocality}?priority=${priority}`)
      const data = await res.json()
      setOptimizationData(data)
    } catch (err) {
      console.error('Failed to fetch optimization:', err)
    }
    setLoading(false)
  }, [selectedCity, selectedLocality])

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/${selectedCity}/${selectedLocality}`)
      const data = await res.json()
      setAnalyticsData(data)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
    }
  }, [selectedCity, selectedLocality])

  useEffect(() => {
    fetchGraphData()
    fetchAnalytics()
  }, [fetchGraphData, fetchAnalytics])

  const handleAreaChange = (city, locality) => {
    setSelectedCity(city)
    setSelectedLocality(locality)
    setOptimizationData(null)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0a0f' }}>
      {/* Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        style={{ background: 'rgba(18,18,26,0.95)', borderRight: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
      >
        <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00ff88, #00d4ff)' }}>
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <span className="text-sm font-bold text-white">EcoRoute <span className="text-green-400">AI</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <AreaSelection
            selectedCity={selectedCity}
            selectedLocality={selectedLocality}
            onChange={handleAreaChange}
          />
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
                className={`sidebar-link w-full text-left ${activeSection === item.id ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="glass-card-static p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse-glow 2s infinite' }} />
              <span className="text-xs text-gray-400">System Status</span>
            </div>
            <div className="text-xs text-white font-medium">All Systems Operational</div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-white capitalize">
              {navItems.find(n => n.id === activeSection)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,255,136,0.1)' }}>
                <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse-glow 1s infinite' }} />
                <span className="text-xs text-green-400">Processing...</span>
              </div>
            )}
            <PdfExport
              graphData={graphData}
              optimizationData={optimizationData}
              selectedCity={selectedCity}
              selectedLocality={selectedLocality}
              onExport={() => setToast({ message: 'PDF report exported successfully!', type: 'success' })}
            />
            <div className="text-xs text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeSection === 'map' && (
            <MapPanel
              graphData={graphData}
              optimizationData={optimizationData}
              center={graphData?.center}
            />
          )}
          {activeSection === 'graph' && (
            <GraphVisualization graphData={graphData} loading={loading} />
          )}
          {activeSection === 'optimize' && (
            <EulerOptimization
              graphData={graphData}
              optimizationData={optimizationData}
              onOptimize={fetchOptimization}
              loading={loading}
            />
          )}
          {activeSection === 'bins' && (
            <SmartBinManagement
              bins={optimizationData?.bins || graphData?.bins || []}
              onRefresh={() => fetchOptimization('all')}
            />
          )}
          {activeSection === 'analytics' && (
            <AnalyticsDashboard
              data={analyticsData}
              optimizationData={optimizationData}
            />
          )}
          {activeSection === 'compare' && (
            <ComparisonPanel data={optimizationData?.comparison} />
          )}
          {activeSection === 'learn' && (
            <AlgorithmExplanation graphData={graphData} />
          )}
        </div>
      </main>
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}
