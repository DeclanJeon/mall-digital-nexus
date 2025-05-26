import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, ChevronUp, ChevronDown, MapPin, Phone, MessageSquare, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Location } from '@/types/map';
import ReviewSection from './peermall-features/ReviewSection';

const LOCAL_STORAGE_PEERMALL_KEY_PREFIX = 'peermall-';

const EcosystemMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState('street');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showControls, setShowControls] = useState(true);

  const [locations, setLocations] = useState<Location[]>([]);

  // 로컬 스토리지에서 피어몰 데이터 로드
  useEffect(() => {
    const loadPeermalls = () => {
      try {
        const allPeermallIds = JSON.parse(localStorage.getItem('all_peermall_addresses') || '[]');
        const peermalls = allPeermallIds.map((id: string) => {
          const peermallStr = localStorage.getItem(`${LOCAL_STORAGE_PEERMALL_KEY_PREFIX}${id}`);
          if (!peermallStr) return null;
          
          const peermall = JSON.parse(peermallStr);
          return {
            lat: peermall.location?.lat || 37.5665 + (Math.random() - 0.5) * 0.1,
            lng: peermall.location?.lng || 126.9780 + (Math.random() - 0.5) * 0.1,
            title: peermall.title || '피어몰',
            address: peermall.address || '주소 정보 없음',
            phone: peermall.phone || '전화번호 없음',
            reviews: peermall.reviews || []
          };
        }).filter(Boolean);
        
        setLocations(peermalls);
      } catch (error) {
        console.error('피어몰 데이터 로드 중 오류 발생:', error);
      }
    };

    // 초기 로드
    loadPeermalls();
    
    // 스토리지 변경 이벤트 리스너 등록
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'all_peermall_addresses' || e.key?.startsWith(LOCAL_STORAGE_PEERMALL_KEY_PREFIX)) {
        loadPeermalls();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('peermallUpdated', loadPeermalls);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('peermallUpdated', loadPeermalls);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [37.5665, 126.9780],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const peermallIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    locations.forEach(loc => {
      L.marker([loc.lat, loc.lng], {icon: peermallIcon})
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${loc.title}</h3>
            <p class="text-sm">${loc.address}</p>
            <button class="view-reviews text-sm text-blue-500 mt-1">리뷰 보기</button>
          </div>
        `)
        .on('popupopen', (e) => {
          const button = e.popup.getElement().querySelector('.view-reviews');
          if (button) {
            button.addEventListener('click', () => {
              setSelectedLocation(loc);
              e.popup.closePopup();
            });
          }
        });
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;

    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        mapInstance.current.removeLayer(layer);
      }
    });

    if (mapType === 'street') {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);
    } else {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(mapInstance.current);
    }
  }, [mapType]);

  const findMyLocation = () => {
    if (!mapInstance.current) return;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          mapInstance.current.flyTo([latitude, longitude], 15);
          
          mapInstance.current.eachLayer(layer => {
            if (layer instanceof L.Marker && layer.options.icon?.options?.className === 'my-location-marker') {
              mapInstance.current.removeLayer(layer);
            }
          });

          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'my-location-marker',
              html: '<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })
          }).addTo(mapInstance.current)
          .bindPopup('내 위치');
        },
        (error) => {
          alert('위치 정보를 가져올 수 없습니다.');
        }
      );
    } else {
      alert('이 브라우저는 위치 정보 기능을 지원하지 않습니다.');
    }
  };

  const searchPeermall = () => {
    if (!mapInstance.current || !searchQuery.trim()) return;
    
    const found = locations.find(loc => 
      loc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (found) {
      mapInstance.current.flyTo([found.lat, found.lng], 15);
      setSelectedLocation(found);
    } else {
      alert('해당하는 피어몰을 찾을 수 없습니다.');
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <div className="sticky top-0">
      <div className="relative w-full h-[400px] rounded-lg shadow-md overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{backgroundColor: '#f5f5f5'}}
        />
        
        <div className="absolute top-4 right-4 z-[1000]">
          <button
            onClick={toggleControls}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors mb-2 flex items-center justify-center"
            title={showControls ? "컨트롤 숨기기" : "컨트롤 표시하기"}
          >
            {showControls ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
        
        {showControls && (
          <div className="absolute top-14 right-4 z-[1000] bg-white p-3 rounded-lg shadow-md flex flex-col gap-2">
            <div className="flex gap-2">
              <button 
                onClick={() => setMapType('street')}
                className={`px-3 py-1 rounded text-sm ${mapType === 'street' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              >
                일반지도
              </button>
              <button 
                onClick={() => setMapType('satellite')}
                className={`px-3 py-1 rounded text-sm ${mapType === 'satellite' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
              >
                위성지도
              </button>
            </div>
            
            <button 
              onClick={findMyLocation}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              내 위치
            </button>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="피어몰 이름 검색"
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <button 
                onClick={searchPeermall}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                검색
              </button>
            </div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 z-[900] bg-white bg-opacity-80 px-3 py-1 rounded-md shadow-sm">
          <div className="flex items-center text-xs text-gray-700">
            <MapPin className="h-3 w-3 mr-1 text-red-500" />
            <span>표시된 피어몰: {locations.length}개</span>
          </div>
        </div>
      </div>
      
      <ReviewSection location={selectedLocation} />
    </div>
  );
};

export default EcosystemMap;