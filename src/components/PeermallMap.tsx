
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  ZoomControl,
  LayersControl,
  FeatureGroup,
  Circle,
  Polyline,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import MarkerClusterGroup from 'react-leaflet-cluster';

// Fix for Leaflet default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Custom markers
const restaurantIcon = '/markers/restaurant-marker.png';
const hotelIcon = '/markers/hotel-marker.png';
const attractionIcon = '/markers/attraction-marker.png';

// Set up default icons
const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for different location types
const icons = {
  restaurant: L.icon({
    iconUrl: restaurantIcon || icon,
    shadowUrl: iconShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  hotel: L.icon({
    iconUrl: hotelIcon || icon,
    shadowUrl: iconShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  attraction: L.icon({
    iconUrl: attractionIcon || icon,
    shadowUrl: iconShadow,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  }),
  default: DefaultIcon
};

// Define interface for Nominatim search results
interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
}

interface Location {
  id?: string;
  lat: number;
  lng: number;
  address: string;
  title: string;
  type?: 'restaurant' | 'hotel' | 'attraction' | 'default';
  description?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
}

interface PeermallMapProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation?: Location | null;
  allLocations?: Location[];
}

// Component to handle map center changes
const ChangeView = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
};

// Current location component
const LocationMarker = () => {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    }
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker 
      position={position}
      icon={L.divIcon({
        html: `
          <div style="
            background-color: #4285F4;
            border: 2px solid white;
            border-radius: 50%;
            height: 16px;
            width: 16px;
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3), 0 0 10px rgba(66, 133, 244, 0.5);
          "></div>
        `,
        className: "current-location-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      })}
    >
      <Popup>현재 위���</Popup>
    </Marker>
  );
};

// Search component using Nominatim - 메모이제이션 적용
const SearchBox = memo(({ onSelectLocation }: { onSelectLocation: (location: Location) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.length < 3) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
      );
      const data: NominatimResult[] = await response.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('검색 중 오류가 발생했습니다:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (result: NominatimResult) => {
    onSelectLocation({
      id: `search-${result.place_id}`,
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      title: result.display_name.split(',')[0],
      address: result.display_name,
      type: 'default'
    });
    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-72">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="위치 검색..."
          className="w-full px-4 py-2 rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          {isSearching ? '검색 중...' : '🔍'}
        </button>
      </div>
      
      {showResults && results.length > 0 && (
        <div className="mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              <div className="font-medium">{result.display_name.split(',')[0]}</div>
              <div className="text-sm text-gray-500 truncate">{result.display_name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

// Control panel component - 메모이제이션 적용
const ControlPanel = ({
  onLocateMe,
  onToggleRouting,
  onToggleMeasure,
  isRoutingActive,
  isMeasureActive
}: {
  onLocateMe: () => void;
  onToggleRouting: () => void;
  onToggleMeasure: () => void;
  isRoutingActive: boolean;
  isMeasureActive: boolean;
}) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-md">
      <div className="flex flex-col p-2">
        <button
          onClick={onLocateMe}
          className="mb-2 p-2 rounded hover:bg-gray-100 flex items-center"
          title="내 위치 찾기"
        >
          <span role="img" aria-label="내 위치">📍</span>
          <span className="ml-2">내 위치</span>
        </button>
        
        {/* <button
          onClick={onToggleRouting}
          className={`mb-2 p-2 rounded hover:bg-gray-100 flex items-center ${isRoutingActive ? 'bg-blue-100' : ''}`}
          title="경로 찾기"
        >
          <span role="img" aria-label="경로">🔄</span>
          <span className="ml-2">경로 찾기</span>
        </button> */}
        
        {/* <button
          onClick={onToggleMeasure}
          className={`p-2 rounded hover:bg-gray-100 flex items-center ${isMeasureActive ? 'bg-blue-100' : ''}`}
          title="거리 측정"
        >
          <span role="img" aria-label="측정">📏</span>
          <span className="ml-2">거리 측정</span>
        </button> */}
      </div>
    </div>
  );
};

// InfoPanel component - 메모이제이션 적용 및 닫기 버튼 추가
const InfoPanel = memo(({ location, onClose }: { location: Location | null; onClose: () => void }) => {
  if (!location) return null;
  
  return (
    <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md p-4 w-72">
      <button 
        onClick={onClose} 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
        aria-label="정보 패널 닫기"
      >
        ✕
      </button>
      <h3 className="text-lg font-bold mb-2 pr-6">{location.title}</h3> {/* 제목과 닫기 버튼 겹침 방지 */}
      <p className="text-sm text-gray-600 mb-2">{location.address}</p>
      
      {location.description && (
        <p className="text-sm mb-2">{location.description}</p>
      )}
      
      {location.phone && (
        <div className="flex items-center mb-1">
          <span role="img" aria-label="전화" className="mr-2">📞</span>
          <a href={`tel:${location.phone}`} className="text-blue-500 hover:underline">{location.phone}</a>
        </div>
      )}
      
      {location.website && (
        <div className="flex items-center mb-1">
          <span role="img" aria-label="웹사이트" className="mr-2">🌐</span>
          <a href={location.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">웹사이트 방문</a>
        </div>
      )}
      
      {location.openingHours && (
        <div className="flex items-center">
          <span role="img" aria-label="영업시간" className="mr-2">🕒</span>
          <span>{location.openingHours}</span>
        </div>
      )}
    </div>
  );
});

// Routing control component
const RoutingControl = ({ 
  start, 
  end, 
  isActive 
}: { 
  start: [number, number] | null; 
  end: [number, number] | null; 
  isActive: boolean;
}) => {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null); 
  
  useEffect(() => {
    if (!isActive || !start || !end) {
      if (routingControlRef.current) {
        try {
          routingControlRef.current.remove();
        } catch (error) {
          console.error('Error removing routing control:', error);
        }
        routingControlRef.current = null;
      }
      return;
    }

    try {
      if (!routingControlRef.current && L.Routing && typeof L.Routing.control === 'function') { 
        routingControlRef.current = L.Routing.control({
          waypoints: [
            L.latLng(start[0], start[1]),
            L.latLng(end[0], end[1])
          ],
          routeWhileDragging: true,
          showAlternatives: true,
          altLineOptions: {
            styles: [
              { color: 'black', opacity: 0.15, weight: 9 },
              { color: 'white', opacity: 0.8, weight: 6 },
              { color: 'blue', opacity: 0.5, weight: 2 }
            ]
          },
          lineOptions: {
            styles: [
              { color: 'black', opacity: 0.15, weight: 9 },
              { color: 'white', opacity: 0.8, weight: 6 },
              { color: '#3388ff', opacity: 0.5, weight: 4 }
            ],
            extendToWaypoints: false,
            missingRouteTolerance: 0
          },
          addWaypoints: false,
          draggableWaypoints: true,
          fitSelectedRoutes: true,
          show: false
        }).addTo(map);
      } else if (routingControlRef.current) {
        routingControlRef.current.setWaypoints([
          L.latLng(start[0], start[1]),
          L.latLng(end[0], end[1])
        ]);
      }
    } catch (error) {
      console.error('Error with routing control:', error);
    }

    return () => {
      if (routingControlRef.current) {
        try {
          routingControlRef.current.remove();
        } catch (error) {
          console.error('Error removing routing control:', error);
        }
        routingControlRef.current = null;
      }
    };
  }, [map, start, end, isActive]);

  return null;
};

// Measure 컨트롤 수정
const MeasureControl = ({ isActive }: { isActive: boolean }) => {
  const map = useMap();
  const measureControlRef = useRef<any>(null);

  useEffect(() => {
    // 먼저 L.Control.Measure가 존재하는지 확인
    const hasMeasureControl = L.Control && (L.Control as any).Measure;
    
    if (!isActive) {
      if (measureControlRef.current) {
        try {
          map.removeControl(measureControlRef.current);
        } catch (error) {
          console.error('Error removing measure control:', error);
        }
        measureControlRef.current = null;
      }
      return;
    }

    if (!measureControlRef.current && hasMeasureControl) {
      try {
        measureControlRef.current = new (L.Control as any).Measure({
          position: 'topright',
          primaryLengthUnit: 'meters',
          secondaryLengthUnit: 'kilometers',
          primaryAreaUnit: 'sqmeters',
          secondaryAreaUnit: 'hectares',
          activeColor: '#3388ff',
          completedColor: '#33cc33',
          captureZIndex: 10000
        }).addTo(map);
      } catch (error) {
        console.error('Error initializing measure control:', error);
      }
    } else if (!hasMeasureControl) {
      console.warn('거리 측정 기능을 사용할 수 없습니다.');
    }

    return () => {
      if (measureControlRef.current) {
        try {
          map.removeControl(measureControlRef.current);
        } catch (error) {
          console.error('Error removing measure control:', error);
        }
        measureControlRef.current = null;
      }
    };
  }, [map, isActive]);

  return null;
};

// 지도 이벤트 감시하는 컴포넌트
const MapEventHandler = ({ onRouteEndChange, isRoutingActive, routeStart }: {
  onRouteEndChange: (end: [number, number]) => void;
  isRoutingActive: boolean;
  routeStart: [number, number] | null;
}) => {
  useMapEvents({
    click: (e) => {
      if (isRoutingActive && routeStart) {
        onRouteEndChange([e.latlng.lat, e.latlng.lng]);
      }
    },
    locationfound: (e) => {
      // 위치 찾기는 유지 (라우팅을 위해)
      if (isRoutingActive) {
        // 부모 컴포넌트의 상태를 업데이트하는 함수가 필요하면 추가
      }
    }
  });
  return null;
};

// Main Map Component
const PeermallMap = ({ isOpen, onClose, selectedLocation, allLocations = [] }: PeermallMapProps) => {
  // 모든 Hook을 최상위에 정의
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [37.5665, 126.9780]
  );
  const [mapZoom, setMapZoom] = useState(13);
  const [activeLocation, setActiveLocation] = useState<Location | null>(selectedLocation);
  const [isRoutingActive, setIsRoutingActive] = useState(false);
  const [isMeasureActive, setIsMeasureActive] = useState(false);
  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // 메모이제이션된 이벤트 핸들러
  const handleMapRef = useCallback((map: L.Map) => {
    mapRef.current = map;
    setMapInstance(map);
    setMapReady(true);
  }, []);

  // 내 위치 찾기 함수 수정
const handleLocateMe = () => {
  if (mapInstance && typeof mapInstance.locate === 'function') {
    mapInstance.locate({setView: true, maxZoom: 16});
  } else {
    console.warn("지도 위치 찾기 기능을 사용할 수 없습니다.");
    // 대안으로 현재 위치를 표시하는 메시지를 보여줄 수 있습니다
    alert("현재 위치를 찾을 수 없습니다. 브라우저의 위치 권한을 확인해주세요.");
  }
};

  const handleToggleRouting = useCallback(() => {
    setIsRoutingActive((prev) => !prev);
    if (!isRoutingActive) {
      setRouteStart(mapCenter);
      setRouteEnd(selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null);
      setIsMeasureActive(false);
    }
  }, [isRoutingActive, mapCenter, selectedLocation]);

  const handleToggleMeasure = useCallback(() => {
    setIsMeasureActive((prev) => !prev);
    if (!isMeasureActive) {
      setIsRoutingActive(false);
    }
  }, [isMeasureActive]);

  const handleSelectLocation = useCallback(
    (location: Location) => {
      setActiveLocation(location);
      setMapCenter([location.lat, location.lng]);
      setMapZoom(16);
      if (isRoutingActive) {
        setRouteEnd([location.lat, location.lng]);
      }
    },
    [isRoutingActive]
  );

  const handleRouteEndChange = useCallback((end: [number, number]) => {
    setRouteEnd(end);
  }, []);

  // InfoPanel 닫기 핸들러
  const handleCloseInfoPanel = useCallback(() => {
    setActiveLocation(null);
  }, []);

  // 조건문은 Hook 정의 이후에 배치
  if (!isOpen) return null;

  // 선택된 위치와 모든 위치에 대한 마커를 렌더링하는 함수
  const renderMarkers = () => {
    if (!allLocations.length) return null;

    return (
      <MarkerClusterGroup>
        {allLocations.map((location, index) => {
          const isSelected = selectedLocation && 
            location.lat === selectedLocation.lat && 
            location.lng === selectedLocation.lng;
          
          const locationType = location.type || 'default';
          const markerIcon = icons[locationType] || DefaultIcon;
          
          return (
            <Marker
              key={location.id || `location-${index}`}
              position={[location.lat, location.lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => handleSelectLocation(location)
              }}
            >
              <Popup>
                <div>
                  <strong>{location.title}</strong>
                  <p>{location.address}</p>
                  {location.description && <p>{location.description}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
    );
  };

  // 선택된 위치 주변의 원을 그리는 함수 (500m 반경)
  const renderCircle = () => {
    if (!selectedLocation) return null;
    
    return (
      <FeatureGroup>
        <Circle
          center={[selectedLocation.lat, selectedLocation.lng]}
          radius={500}
          pathOptions={{
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.1
          }}
        />
      </FeatureGroup>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{selectedLocation?.title || '지도'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2">✕</button>
        </div>

        <div className="flex-grow relative overflow-hidden">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
            zoomControl={false}
            ref={(mapRef) => {
              if (mapRef) {
                setMapInstance(mapRef);
                setMapReady(true);
              }
            }}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <ZoomControl position="bottomright" />
            
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="위성 지도">
                <TileLayer
                  attribution='© Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            
            <MapEventHandler 
              onRouteEndChange={handleRouteEndChange}
              isRoutingActive={isRoutingActive}
              routeStart={routeStart}
            />
            <LocationMarker />
            {renderMarkers()}
            {renderCircle()}
            
            {isRoutingActive && routeStart && routeEnd && (
              <RoutingControl 
                start={routeStart} 
                end={routeEnd} 
                isActive={isRoutingActive} 
              />
            )}
            
            {isMeasureActive && (
              <MeasureControl isActive={isMeasureActive} />
            )}
          </MapContainer>
          
          <SearchBox onSelectLocation={handleSelectLocation} />
          <InfoPanel location={activeLocation} onClose={handleCloseInfoPanel} />
          <ControlPanel 
            onLocateMe={handleLocateMe}
            onToggleRouting={handleToggleRouting}
            onToggleMeasure={handleToggleMeasure}
            isRoutingActive={isRoutingActive}
            isMeasureActive={isMeasureActive}
          />
        </div>
      </div>
    </div>
  );
};

export default PeermallMap;
