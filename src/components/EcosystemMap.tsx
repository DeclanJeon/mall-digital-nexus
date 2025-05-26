import React, { useState, useRef, useEffect, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, ChevronUp, ChevronDown, MapPin, Phone, MessageSquare, Navigation, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Peermall } from '@/types/peermall';
import ReviewSection from './peermall-features/ReviewSection';
import { peermallStorage } from '@/services/storage/peermallStorage';

const DEFAULT_CENTER: [number, number] = [37.5665, 126.9780];

interface MapLocation {
  lat: number;
  lng: number;
  title: string;
  address: string;
  phone: string;
  reviews?: any[];
  id?: string;
}

interface EcosystemMapProps {
  onLocationSelect?: (location: MapLocation) => void;
}

const EcosystemMap: React.FC<EcosystemMapProps> = ({ onLocationSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState('street');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [locations, setLocations] = useState<MapLocation[]>([]);

  // 피어몰 데이터 로드 함수
  const loadPeermalls = useCallback(() => {
    try {
      const peermalls = peermallStorage.getAll();
      
      const mappedLocations = peermalls
        .filter(peermall => peermall.lat && peermall.lng) // 위치 정보가 있는 피어몰만 필터링
        .map(peermall => ({
          id: peermall.id,
          lat: peermall.location?.lat ?? peermall.lat,
          lng: peermall.location?.lng ?? peermall.lng,
          title: peermall.title || '피어몰',
          address: peermall.location?.address ?? peermall.address ?? '주소 정보 없음',
          phone: (peermall as any).phone || '전화번호 없음',
          reviews: (peermall as any).reviews || []
        }));
      
      setLocations(mappedLocations);
    } catch (error) {
      console.error('피어몰 데이터 로드 중 오류 발생:', error);
    }
  }, []);

  // 초기 데이터 로드 및 이벤트 리스너 설정
  useEffect(() => {
    // 초기 로드
    loadPeermalls();
    
    // peermallStorage 변경 이벤트 리스너 등록
    const removeListener = peermallStorage.addEventListener(loadPeermalls);
    
    return () => {
      removeListener();
    };
  }, [loadPeermalls]);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 13
    });

    // 기본 타일 레이어 추가 (street 모드)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 피어몰 마커 아이콘
  const peermallIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // 위치 데이터가 변경될 때마다 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current) return;
    
    // 기존 마커 제거
    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    // 새 마커 추가
    locations.forEach(loc => {
      if (!loc.lat || !loc.lng) return; // 유효한 위치 정보가 있는 경우에만 마커 추가
      
      const marker = L.marker([loc.lat, loc.lng], { icon: peermallIcon })
        .addTo(mapInstance.current!)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold">${loc.title}</h3>
            <p class="text-sm">${loc.address}</p>
            ${loc.phone ? `<p class="text-sm">${loc.phone}</p>` : ''}
            <button class="view-details text-sm text-blue-500 mt-1">상세 보기</button>
          </div>
        `);
      
      // 상세 보기 버튼 클릭 이벤트
      marker.on('popupopen', (e) => {
        const popup = e.popup;
        const button = popup.getElement()?.querySelector('.view-details');
        
        if (button) {
          button.addEventListener('click', () => {
            setSelectedLocation(loc);
            popup.close();
          });
        }
      });
      
      // 마커 클릭 시 지도 중앙으로 이동
      marker.on('click', () => {
        mapInstance.current?.setView([loc.lat, loc.lng], 15);
        
        // Call onLocationSelect if provided
        if (onLocationSelect) {
          onLocationSelect(loc);
        }
      });
    });
    
    // 위치가 하나만 있는 경우 해당 위치로 지도 이동
    if (locations.length === 1) {
      const loc = locations[0];
      mapInstance.current.setView([loc.lat, loc.lng], 15);
    } else if (locations.length > 1) {
      // 여러 위치가 있는 경우 모든 마커가 보이도록 지도 범위 조정
      const bounds = L.latLngBounds(locations.map(loc => [loc.lat, loc.lng]));
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations]);

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

  const findMyLocation = useCallback(() => {
    if (!mapInstance.current) return;
    
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const userLoc = { lat: latitude, lng: longitude };
      
      setUserLocation(userLoc);
      mapInstance.current?.flyTo([latitude, longitude], 15);
      
      // 기존 내 위치 마커 제거
      mapInstance.current.eachLayer(layer => {
        if (layer instanceof L.Marker && layer.options.icon?.options?.className === 'my-location-marker') {
          mapInstance.current?.removeLayer(layer);
        }
      });

      // 새 내 위치 마커 추가
      L.marker([latitude, longitude], {
        icon: L.divIcon({
          className: 'my-location-marker',
          html: '<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(mapInstance.current)
      .bindPopup('내 위치');
      
      // 가장 가까운 피어몰 찾기 (선택사항)
      if (locations.length > 0) {
        let closest = locations[0];
        let minDistance = Infinity;
        
        locations.forEach(loc => {
          const distance = Math.sqrt(
            Math.pow(loc.lat - latitude, 2) + 
            Math.pow(loc.lng - longitude, 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            closest = loc;
          }
        });
        
        // 가장 가까운 피어몰로 이동 (선택사항)
        // mapInstance.current.flyTo([closest.lat, closest.lng], 15);
      }
    };
    
    const handleError = (error: GeolocationPositionError) => {
      console.error('위치 정보 가져오기 실패:', error);
      alert('위치 정보를 가져올 수 없습니다. 위치 서비스가 활성화되어 있는지 확인해주세요.');
    };
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      alert('이 브라우저는 위치 정보 기능을 지원하지 않습니다.');
    }
  }, [locations]);

  const searchPeermall = useCallback(() => {
    if (!mapInstance.current || !searchQuery.trim()) return;
    
    // 제목 또는 주소로 검색 (대소문자 구분 없이)
    const query = searchQuery.toLowerCase().trim();
    const foundLocations = locations.filter(loc => 
      loc.title.toLowerCase().includes(query) || 
      (loc.address && loc.address.toLowerCase().includes(query))
    );
    
    if (foundLocations.length > 0) {
      if (foundLocations.length === 1) {
        // 검색 결과가 하나면 해당 위치로 이동
        const found = foundLocations[0];
        mapInstance.current.flyTo([found.lat, found.lng], 15);
        setSelectedLocation(found);
      } else {
        // 여러 개의 결과가 있으면 모두 보이도록 지도 범위 조정
        const bounds = L.latLngBounds(foundLocations.map(loc => [loc.lat, loc.lng]));
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
        
        // 첫 번째 결과를 선택된 위치로 설정
        setSelectedLocation(foundLocations[0]);
      }
    } else {
      alert('해당하는 피어몰을 찾을 수 없습니다.');
    }
  }, [searchQuery, locations]);

  const toggleControls = useCallback(() => {
    setShowControls(prev => !prev);
  }, []);
  
  // 검색어 입력 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // 엔터 키로 검색
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchPeermall();
    }
  }; 
  
  // 선택된 위치로 지도 이동
  const flyToLocation = useCallback((location: MapLocation) => {
    if (!mapInstance.current) return;
    mapInstance.current.flyTo([location.lat, location.lng], 15);
  }, []);

  // 검색 결과 목록 렌더링
  const renderSearchResults = () => {
    if (!searchQuery.trim() || !selectedLocation) return null;
    
    const query = searchQuery.toLowerCase().trim();
    const results = locations.filter(loc => 
      loc.title.toLowerCase().includes(query) || 
      (loc.address && loc.address.toLowerCase().includes(query))
    );
    
    if (results.length <= 1) return null;
    
    return (
      <div className="absolute top-20 left-4 z-[1000] bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto w-64">
        <div className="p-2 text-sm font-medium text-gray-700 border-b">
          검색 결과 ({results.length}개)
        </div>
        <div className="divide-y">
          {results.map((result, index) => (
            <div 
              key={`${result.id || index}-${result.lat}-${result.lng}`}
              className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedLocation === result ? 'bg-blue-50' : ''}`}
              onClick={() => {
                setSelectedLocation(result);
                flyToLocation(result);
              }}
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-xs text-gray-500 truncate">{result.address}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 선택된 위치 정보 패널 렌더링
  const renderSelectedLocationPanel = () => {
    if (!selectedLocation) return null;
    
    return (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-md w-[calc(100%-2rem)]">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{selectedLocation.title}</h3>
            <p className="text-sm text-gray-600">{selectedLocation.address}</p>
            {selectedLocation.phone && (
              <p className="text-sm text-gray-600 mt-1">
                <Phone className="inline-block w-4 h-4 mr-1" />
                {selectedLocation.phone}
              </p>
            )}
          </div>
          <button 
            onClick={() => setSelectedLocation(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3 flex space-x-2">
          <button 
            onClick={() => {
              if (selectedLocation) {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
                window.open(url, '_blank');
              }
            }}
            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md text-sm flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <Navigation className="w-4 h-4 mr-1" />
            길찾기
          </button>
          <button 
            onClick={() => {
              if (selectedLocation) {
                const url = `https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`;
                window.open(url, '_blank');
              }
            }}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-4 h-4 mr-1" />
            지도에서 보기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="sticky top-0">
      <div className="relative w-full h-[500px] rounded-lg shadow-md overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{backgroundColor: '#f5f5f5'}}
        />
        
        {/* 검색창 */}
        <div className="absolute top-4 left-4 z-[1000] w-64">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={handleKeyDown}
              placeholder="피어몰 검색..."
              className="w-full p-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {renderSearchResults()}
        </div>
        
        {/* 컨트롤 버튼 */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
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
        
        {/* 맵 컨트롤 패널 */}
        {showControls && (
          <div className="absolute top-14 right-4 z-[1000] bg-white p-3 rounded-lg shadow-md flex flex-col gap-3">
            <div className="flex gap-2">
              <button 
                onClick={() => setMapType('street')}
                className={`p-2 rounded-md flex items-center justify-center ${mapType === 'street' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                title="일반 지도 보기"
              >
                <MapPin className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setMapType('satellite')}
                className={`p-2 rounded-md flex items-center justify-center ${mapType === 'satellite' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                title="위성 지도 보기"
              >
                <MapPin className="w-4 h-4" />
              </button>
              <button 
                onClick={findMyLocation}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                title="내 위치 찾기"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
                placeholder="피어몰 검색..."
                className="w-full pl-9 pr-8 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                  title="검색어 지우기"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {renderSearchResults()}
          </div>
        )}
        
        {/* 선택된 위치 정보 패널 */}
        {selectedLocation && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[900] bg-white p-4 rounded-lg shadow-lg max-w-md w-[calc(100%-2rem)]">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{selectedLocation.title}</h3>
                <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                {selectedLocation.phone && (
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-1.5" />
                    {selectedLocation.phone}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mt-3 flex space-x-2">
              <button 
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
                  window.open(url, '_blank');
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md text-sm flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Navigation className="w-4 h-4 mr-1.5" />
                길찾기
              </button>
              <button 
                onClick={() => {
                  const url = `https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat},${selectedLocation.lng}`;
                  window.open(url, '_blank');
                }}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <MapPin className="w-4 h-4 mr-1.5" />
                지도에서 보기
              </button>
            </div>
          </div>
        )}
        
        {/* 피어몰 개수 표시 */}
        <div className="absolute bottom-4 left-4 z-[900] bg-white bg-opacity-90 px-3 py-2 rounded-lg shadow-sm flex items-center">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-red-500" />
          <span className="text-sm font-medium text-gray-700">표시된 피어몰: {locations.length}개</span>
        </div>
      </div>
      
      {/* 리뷰 섹션 모달 */}
      <ReviewSection 
        location={selectedLocation} 
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        onReviewSubmit={(review) => {
          // 리뷰 제출 처리 로직 (필요시 구현)
          console.log('새 리뷰 제출됨:', review);
          
          // 리뷰가 제출되면 선택 해제
          setSelectedLocation(null);
        }}
      />
    </div>
  );
};

export default EcosystemMap;