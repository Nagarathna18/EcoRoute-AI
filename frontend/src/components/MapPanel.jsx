import { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Navigation, Play, Pause, RotateCcw, Maximize2, MapPinOff, LocateFixed } from 'lucide-react'

const createIcon = (color, size = 12) => {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid ${color}40;box-shadow:0 0 10px ${color}60;"></div>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  })
}

const truckIcon = L.divIcon({
  className: '',
  html: `<div style="font-size:24px;line-height:1;" class="truck-animated">🚛</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;border-radius:50%;background:#00d4ff;border:3px solid white;box-shadow:0 0 15px #00d4ff80;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

const nodeIcon = createIcon('#00ff88', 10)
const oddNodeIcon = createIcon('#ff006e', 12)
const binIconMap = {
  Empty: createIcon('#00ff88'),
  Medium: createIcon('#ffd60a'),
  Full: createIcon('#ff6b35'),
  Critical: createIcon('#ff006e', 14),
}

function MapController({ center, zoom, userPosition }) {
  const map = useMap()
  useEffect(() => {
    if (userPosition) {
      map.setView(userPosition, 16)
    } else if (center) {
      map.setView(center, zoom || 15)
    }
  }, [center, zoom, userPosition, map])
  return null
}

export default function MapPanel({ graphData, optimizationData, center }) {
  const [showBins, setShowBins] = useState(true)
  const [showRoute, setShowRoute] = useState(true)
  const [truckPosition, setTruckPosition] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [routeIndex, setRouteIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [userPosition, setUserPosition] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState(null)
  const timerRef = useRef(null)

  const mapCenter = center || [12.9716, 77.5946]
  const route = optimizationData?.route || []
  const bins = optimizationData?.bins || graphData?.bins || []
  const nodes = graphData?.nodes || []
  const edges = graphData?.edges || []

  useEffect(() => {
    if (isPlaying && route.length > 0) {
      timerRef.current = setInterval(() => {
        setRouteIndex(prev => {
          if (prev >= route.length - 1) {
            setIsPlaying(false)
            return prev
          }
          const next = prev + 1
          const step = route[next]
          if (step) {
            setTruckPosition([step.from_lat, step.from_lng])
          }
          return next
        })
      }, 800)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, route])

  const handlePlay = () => {
    if (route.length === 0) return
    if (routeIndex >= route.length - 1) {
      setRouteIndex(0)
      setTruckPosition([route[0].from_lat, route[0].from_lng])
    }
    setIsPlaying(!isPlaying)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setRouteIndex(0)
    setTruckPosition(null)
    clearInterval(timerRef.current)
  }

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      setTimeout(() => setLocationError(null), 3000)
      return
    }
    setLocationLoading(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([position.coords.latitude, position.coords.longitude])
        setLocationLoading(false)
      },
      (error) => {
        setLocationLoading(false)
        if (error.code === 1) {
          setLocationError('Location permission denied. Please enable location access.')
        } else if (error.code === 2) {
          setLocationError('Location unavailable. Please try again.')
        } else {
          setLocationError('Location request timed out. Please try again.')
        }
        setTimeout(() => setLocationError(null), 4000)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 p-4' : ''}`} style={{ background: isFullscreen ? '#0a0a0f' : undefined }}>
      {/* Map Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="glass-card-static px-4 py-2 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-green-400" />
          <span className="text-sm text-white font-medium">Interactive Map</span>
        </div>
        
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          <button
            onClick={handleLocate}
            disabled={locationLoading}
            className="btn-secondary text-xs py-2 px-3"
            title="Use my current location"
          >
            <LocateFixed className={`w-3 h-3 ${locationLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">My Location</span>
          </button>

          <button
            onClick={() => setShowBins(!showBins)}
            className={`btn-secondary text-xs py-2 px-3 ${showBins ? 'active' : ''}`}
          >
            Bins
          </button>
          <button
            onClick={() => setShowRoute(!showRoute)}
            className={`btn-secondary text-xs py-2 px-3 ${showRoute ? 'active' : ''}`}
          >
            Route
          </button>
          
          {route.length > 0 && (
            <>
              <div className="w-px h-6 bg-white/10" />
              <button onClick={handlePlay} className="btn-secondary text-xs py-2 px-3">
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                {isPlaying ? 'Pause' : 'Play Route'}
              </button>
              <button onClick={handleReset} className="btn-secondary text-xs py-2 px-3">
                <RotateCcw className="w-3 h-3" />
              </button>
            </>
          )}
          
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="btn-secondary text-xs py-2 px-3">
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="glass-card-static p-3 flex items-center gap-2 text-sm" style={{ borderLeft: '3px solid #ff6b35' }}>
          <MapPinOff className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="text-gray-300">{locationError}</span>
        </div>
      )}

      {/* User Location Info */}
      {userPosition && (
        <div className="glass-card-static p-3 flex items-center gap-2 text-sm" style={{ borderLeft: '3px solid #00d4ff' }}>
          <div className="w-3 h-3 rounded-full bg-blue-400 shrink-0" style={{ boxShadow: '0 0 8px #00d4ff80' }} />
          <span className="text-gray-300">
            Your location: <span className="text-white font-mono">{userPosition[0].toFixed(4)}, {userPosition[1].toFixed(4)}</span>
          </span>
        </div>
      )}

      {/* Map */}
      <div className="glass-card-static overflow-hidden" style={{ height: isFullscreen ? 'calc(100vh - 120px)' : '500px' }}>
        <MapContainer
          center={userPosition || mapCenter}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapController center={mapCenter} zoom={15} userPosition={userPosition} />
          
          {/* Edges */}
          {edges.map((edge, i) => (
            <Polyline
              key={`edge-${i}`}
              positions={[[edge.source_lat, edge.source_lng], [edge.target_lat, edge.target_lng]]}
              pathOptions={{ color: '#3a3a60', weight: 2, opacity: 0.6 }}
            />
          ))}

          {/* Route */}
          {showRoute && route.length > 0 && route.map((step, i) => (
            <Polyline
              key={`route-${i}`}
              positions={[[step.from_lat, step.from_lng], [step.to_lat, step.to_lng]]}
              pathOptions={{
                color: i <= routeIndex ? '#00ff88' : '#00ff8840',
                weight: i <= routeIndex ? 4 : 2,
                opacity: i <= routeIndex ? 0.9 : 0.3,
              }}
            />
          ))}

          {/* Nodes */}
          {nodes.map(node => (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={node.is_odd ? oddNodeIcon : nodeIcon}
            >
              <Popup>
                <div style={{ color: '#333', fontSize: '12px' }}>
                  <strong>{node.name}</strong><br />
                  Degree: {node.degree} {node.is_odd ? '(Odd)' : '(Even)'}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Bins */}
          {showBins && bins.map(bin => (
            <Marker
              key={bin.id}
              position={[bin.lat, bin.lng]}
              icon={binIconMap[bin.status] || binIconMap.Empty}
            >
              <Popup>
                <div style={{ color: '#333', fontSize: '12px' }}>
                  <strong>{bin.id}</strong><br />
                  {bin.name}<br />
                  Fill: {bin.fill_level}%<br />
                  Status: <span style={{ color: bin.status === 'Critical' ? '#ff006e' : bin.status === 'Full' ? '#ff6b35' : bin.status === 'Medium' ? '#ffd60a' : '#00ff88' }}>{bin.status}</span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Truck */}
          {truckPosition && (
            <Marker position={truckPosition} icon={truckIcon}>
              <Popup>
                <div style={{ color: '#333', fontSize: '12px' }}>
                  <strong>Collection Truck</strong><br />
                  Step {routeIndex + 1} of {route.length}
                </div>
              </Popup>
            </Marker>
          )}

          {/* User Location */}
          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>
                <div style={{ color: '#333', fontSize: '12px' }}>
                  <strong>Your Location</strong><br />
                  {userPosition[0].toFixed(4)}, {userPosition[1].toFixed(4)}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="glass-card-static p-4 flex flex-wrap gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
          <span className="text-gray-400">Even Degree Junction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff006e]" />
          <span className="text-gray-400">Odd Degree Junction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-[#00ff88]" />
          <span className="text-gray-400">Optimized Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-[#3a3a60]" />
          <span className="text-gray-400">Road Segment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff6b35]" />
          <span className="text-gray-400">Full Bin</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ffd60a]" />
          <span className="text-gray-400">Medium Bin</span>
        </div>
        {userPosition && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00d4ff]" style={{ boxShadow: '0 0 6px #00d4ff80' }} />
            <span className="text-gray-400">Your Location</span>
          </div>
        )}
      </div>

      {route.length > 0 && (
        <div className="glass-card-static p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Route Progress</span>
            <span className="text-white font-mono">{routeIndex + 1} / {route.length}</span>
          </div>
          <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${((routeIndex + 1) / route.length) * 100}%`,
                background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
