import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

const AREAS = {
  bangalore: {
    name: 'Bangalore',
    localities: {
      koramangala: 'Koramangala',
      indiranagar: 'Indiranagar',
      whitefield: 'Whitefield',
    }
  },
  mysore: {
    name: 'Mysore',
    localities: {
      gokulam: 'Gokulam',
      'jayalakshmipuram': 'Jayalakshmipuram',
      'saraswathipuram': 'Saraswathipuram',
      vijayanagar: 'Vijayanagar',
      'kuvempu-nagar': 'Kuvempu Nagar',
      hebbal: 'Hebbal',
    }
  },
  hubli: {
    name: 'Hubli',
    localities: {
      vidyanagar: 'Vidyanagar',
      'deshpande-nagar': 'Deshpande Nagar',
    }
  },
  belagavi: {
    name: 'Belagavi',
    localities: {
      'sadashiv-nagar': 'Sadashiv Nagar',
      tilakwadi: 'Tilakwadi',
    }
  }
}

export default function AreaSelection({ selectedCity, selectedLocality, onChange }) {
  const [cityOpen, setCityOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)

  const currentCity = AREAS[selectedCity]
  const currentLocality = currentCity?.localities[selectedLocality]

  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Location</label>
      
      {/* City Selector */}
      <div className="relative">
        <button
          onClick={() => { setCityOpen(!cityOpen); setLocOpen(false) }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <div className="text-xs text-gray-500">City</div>
            <div className="text-white font-medium">{currentCity?.name}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${cityOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {cityOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50" style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
            {Object.entries(AREAS).map(([id, city]) => (
              <button
                key={id}
                onClick={() => {
                  const firstLoc = Object.keys(city.localities)[0]
                  onChange(id, firstLoc)
                  setCityOpen(false)
                }}
                className={`w-full px-3 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${id === selectedCity ? 'text-green-400' : 'text-white'}`}
              >
                {city.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locality Selector */}
      <div className="relative">
        <button
          onClick={() => { setLocOpen(!locOpen); setCityOpen(false) }}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <div className="text-xs text-gray-500">Locality</div>
            <div className="text-white font-medium">{currentLocality}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${locOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {locOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50" style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
            {Object.entries(currentCity?.localities || {}).map(([id, name]) => (
              <button
                key={id}
                onClick={() => { onChange(selectedCity, id); setLocOpen(false) }}
                className={`w-full px-3 py-2.5 text-left text-sm hover:bg-white/5 transition-colors ${id === selectedLocality ? 'text-green-400' : 'text-white'}`}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
