import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Truck, MapPin, BarChart3, Leaf, ArrowRight, 
  Recycle, Zap, Route, Clock, Fuel, TrendingDown,
  CheckCircle2, ChevronRight, Building2
} from 'lucide-react'

const stats = [
  { label: 'Routes Optimized', value: '2,847', icon: Route, color: '#00ff88', suffix: '+' },
  { label: 'Fuel Saved', value: '34.2', icon: Fuel, color: '#00d4ff', suffix: 'K L' },
  { label: 'Distance Reduced', value: '42', icon: TrendingDown, color: '#7c3aed', suffix: '%' },
  { label: 'Collection Efficiency', value: '96.8', icon: Zap, color: '#ff6b35', suffix: '%' },
]

const features = [
  {
    icon: MapPin,
    title: 'Euler Path Optimization',
    desc: 'Uses Graph Theory to find the shortest path covering all roads without repetition.',
    gradient: 'from-green-400 to-blue-500'
  },
  {
    icon: Recycle,
    title: 'Smart Bin Monitoring',
    desc: 'Real-time fill level tracking with IoT-enabled smart waste bins across the city.',
    gradient: 'from-purple-400 to-pink-500'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    desc: 'Comprehensive analytics with fuel savings, route efficiency, and environmental impact.',
    gradient: 'from-orange-400 to-red-500'
  },
  {
    icon: Truck,
    title: 'Fleet Management',
    desc: 'Track and manage your garbage collection fleet with real-time route visualization.',
    gradient: 'from-cyan-400 to-blue-500'
  },
]

const cities = ['Bangalore', 'Mysore', 'Hubli', 'Belagavi']

export default function LandingPage() {
  const [hoveredStat, setHoveredStat] = useState(null)

  return (
    <div className="min-h-screen animated-gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00ff88, #00d4ff)' }}>
              <Leaf className="w-5 h-5 text-black" />
            </div>
            <span className="text-lg font-bold text-white">EcoRoute <span className="text-green-400">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How It Works</a>
            <a href="#cities" className="text-sm text-gray-400 hover:text-white transition-colors">Cities</a>
          </div>
          <Link to="/dashboard">
            <button className="btn-primary text-sm">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)' }} />
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
          <div className="absolute bottom-10 left-1/3 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8" style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88' }}>
              <Zap className="w-3 h-3" /> Smart City Infrastructure
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              EcoRoute <span className="gradient-text">AI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-3 leading-relaxed">
              Smart Waste Collection & Route Optimization Platform
            </p>
            <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
              Optimizing garbage collection routes using Euler Path Graph Theory. 
              Cover all streets with minimum repetition, reduced fuel consumption, 
              and faster collection times.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link to="/dashboard">
                <button className="btn-primary text-base px-8 py-4">
                  Launch Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <a href="#how-it-works">
                <button className="btn-secondary text-base px-8 py-4">
                  Learn More <ChevronRight className="w-5 h-5" />
                </button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  onMouseEnter={() => setHoveredStat(i)}
                  onMouseLeave={() => setHoveredStat(null)}
                  className="glass-card p-6 text-center cursor-default"
                  style={{
                    borderColor: hoveredStat === i ? stat.color + '40' : undefined,
                    boxShadow: hoveredStat === i ? `0 0 30px ${stat.color}15` : undefined,
                  }}
                >
                  <Icon className="w-6 h-6 mx-auto mb-3" style={{ color: stat.color }} />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}<span className="text-sm font-normal ml-1" style={{ color: stat.color }}>{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Built for modern smart city waste management with cutting-edge technology</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-8"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${f.gradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-lg mx-auto">Graph Theory powered route optimization in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: '01', title: 'Map the Network', desc: 'Roads become edges, junctions become vertices in a graph' },
              { step: '02', title: 'Analyze Degrees', desc: 'Calculate vertex degrees to determine Euler path feasibility' },
              { step: '03', title: 'Generate Route', desc: 'Find optimal Euler Path or Circuit for minimum repetition' },
              { step: '04', title: 'Optimize & Deploy', desc: 'Dispatch trucks on the optimized route for maximum efficiency' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center relative"
              >
                <div className="text-4xl font-black gradient-text mb-4">{s.step}</div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-gray-600">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Cities */}
      <section id="cities" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Supported Cities</h2>
            <p className="text-gray-400">Currently optimizing routes across Karnataka</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {cities.map((city, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card px-6 py-4 flex items-center gap-3"
              >
                <Building2 className="w-5 h-5" style={{ color: '#00d4ff' }} />
                <span className="text-white font-medium">{city}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00ff88, #00d4ff)' }}>
              <Leaf className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-semibold text-white">EcoRoute <span className="text-green-400">AI</span></span>
          </div>
          <p className="text-xs text-gray-600">Smart Waste Collection & Route Optimization Platform. Built for Smart Cities.</p>
        </div>
      </footer>
    </div>
  )
}
