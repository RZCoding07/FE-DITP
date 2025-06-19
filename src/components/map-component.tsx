import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface Location {
  name: string
  lat: number
  lon: number
  kodering?: string
}

interface MapComponentProps {
  locations: Location[]
  showFilters?: boolean
  children?: React.ReactNode
  onMarkerClick?: (kodering: string) => void
}

export function MapComponent({ locations, showFilters = true, children, onMarkerClick }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const filtersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([-2.5, 118], 15)

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "",
          maxZoom: 18,
        }
      ).addTo(mapInstanceRef.current)

      L.control.zoom({
        position: 'bottomright'
      }).addTo(mapInstanceRef.current)

      L.control.attribution({
        position: 'bottomleft',
        prefix: '<a href="https://leafletjs.com/" target="_blank">Leaflet</a>'
      }).addTo(mapInstanceRef.current)
    }

    // Create custom HTML for the marker
    const createCustomMarker = (color = '#50cd89') => {
      const markerHtml = `
        <div class="leaflet-marker-icon custom-marker" style="
          margin-left: -12px;
          margin-top: -34px;
          width: 24px;
          height: 34px;
          position: relative;
        ">
          <div class="marker-pin" style="
            background-color: ${color}; 
            border: 3px solid #ffffff;
            box-shadow: 0 0 15px rgba(80, 205, 137, 0.7), 0 0 5px ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <img src="/ptpn4.png" alt="PTPN Logo" style="
              width: 16px;
              height: 16px;
              object-fit: contain;
              z-index: 2;
            "/>
            <div class="marker-pulse" style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: 2px solid ${color};
              opacity: 0.6;
              animation: pulse 2s infinite;
              z-index: 1;
            "></div>
          </div>
          <div class="marker-arrow" style="
            position: absolute;
            top: 24px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid ${color};
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.7));
          "></div>
        </div>
      `;
      return markerHtml;
    };

    // Create custom icon
    const customIcon = L.divIcon({
      html: createCustomMarker(),
      className: 'custom-marker-icon',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    // Add CSS for pulse animation
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.6;
        }
        70% {
          transform: translate(-50%, -50%) scale(1.3);
          opacity: 0;
        }
        100% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Clear existing markers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current?.removeLayer(layer)
      }
    })

    // Filter out locations with lat/lon 0
    const validLocations = locations.filter(loc => loc.lat !== 0 && loc.lon !== 0);

    // Add markers for each valid location
    if (validLocations.length > 0) {
      const bounds = L.latLngBounds([])
      
      validLocations.forEach((location) => {
        const marker = L.marker([location.lat, location.lon], { icon: customIcon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`<b>${location.name}</b>`)
        
        // Add click handler if provided
        if (onMarkerClick && location.kodering) {
          marker.on('click', () => {
            onMarkerClick(location.kodering || '')
          })
        }
        
        bounds.extend([location.lat, location.lon])
      })
      
      // Fit map to bounds if we have locations
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 15
        })
      }
    }

    // Handle map resize when filters are shown/hidden
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize()
    }, 300)

    return () => {
      document.head.removeChild(style);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize()
      }
    }
  }, [locations, onMarkerClick])

  useEffect(() => {
    const handleResize = () => {
      mapInstanceRef.current?.invalidateSize()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="h-full w-100 relative overflow-hidden">      
      {/* Map Container */}
      <div ref={mapRef} className="absolute inset-0 z-0 h-100 w-full" />
      
      {/* Filter Overlay */}
      {showFilters && (
        <div 
          ref={filtersRef}
          className="absolute top-4 left-4 right-4 z-10 p-4 rounded-xl transition-all duration-300"
          style={{
            maxWidth: 'calc(100% - 2rem)',
            maxHeight: 'calc(100% - 2rem)',
            overflow: 'auto'
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}