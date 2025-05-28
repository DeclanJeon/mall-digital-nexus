import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, MapPin as MapPinIcon, AlertCircle, Plus, Minus, LocateFixed, Info } from 'lucide-react';

// Leaflet 마커 아이콘 설정
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// 유틸리티 함수: 위경도로부터 주소 가져오기 (전역에서 한 번만 정의)
const fetchAddress = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || '주소를 찾을 수 없음';
  } catch (error) {
    console.error('주소 조회 오류:', error);
    return '주소를 가져오는 중 오류 발생';
  }
};

interface MapMarkerSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialPosition?: { lat: number; lng: number };
  initialAddress?: string;
}

// 지도 클릭 이벤트 핸들러
const MapClickHandler: React.FC<{ onMapClick: (latlng: L.LatLng) => void }> = ({ onMapClick }) => {
  const map = useMap();

  const handleClick = useCallback((e: L.LeafletMouseEvent) => {
    onMapClick(e.latlng);
  }, [onMapClick]);

  useEffect(() => {
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, handleClick]);

  return null;
};

// 드래그 가능한 마커 컴포넌트
const DraggableMarker: React.FC<{
  initialPosition: { lat: number; lng: number };
  onPositionChange: (position: { lat: number; lng: number }) => void;
  onAddressChange: (address: string) => void;
}> = ({ initialPosition, onPositionChange, onAddressChange }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const map = useMap();

  // 마커 드래그 종료 시 호출
  const handleDragEnd = useCallback(async (e: L.LeafletEvent) => {
    const marker = e.target as L.Marker;
    const newPosition = marker.getLatLng();
    const positionObj = { lat: newPosition.lat, lng: newPosition.lng };
    
    setPosition(positionObj);
    onPositionChange(positionObj);
    
    // 주소 업데이트
    try {
      const address = await fetchAddress(newPosition.lat, newPosition.lng);
      onAddressChange(address);
    } catch (error) {
      console.error('주소 조회 실패:', error);
      onAddressChange('주소를 가져올 수 없습니다');
    }
    
    setIsDragging(false);
  }, [onPositionChange, onAddressChange]);

  // 초기 위치가 변경될 때만 position 업데이트
  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.lat, initialPosition.lng]);

  const eventHandlers = useMemo(
    () => ({
      dragstart: () => {
        setIsDragging(true);
      },
      dragend: handleDragEnd,
    }),
    [handleDragEnd]
  );

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      icon={DefaultIcon}
    >
      <Popup>
        {isDragging ? '위치 설정 중...' : '이 위치로 설정되었습니다'}
      </Popup>
    </Marker>
  );
};

export const MapMarkerSelector: React.FC<MapMarkerSelectorProps> = ({
  onLocationSelect,
  initialPosition = { lat: 37.5665, lng: 126.9780 },
  initialAddress = ''
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>(initialPosition);
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const mapRef = useRef<L.Map>(null);
  
  // 초기화 로직 - 한 번만 실행
  useEffect(() => {
    if (!isInitialized) {
      const initializeLocation = async () => {
        try {
          let finalAddress = initialAddress;
          
          // 초기 주소가 없을 때만 주소 조회
          if (!finalAddress) {
            finalAddress = await fetchAddress(initialPosition.lat, initialPosition.lng);
            setAddress(finalAddress);
          }
          
          // 상위 컴포넌트에 초기 위치 정보 전달
          onLocationSelect({
            lat: initialPosition.lat,
            lng: initialPosition.lng,
            address: finalAddress
          });
          
          setIsInitialized(true);
        } catch (error) {
          console.error('초기화 중 오류 발생:', error);
          setError('초기 위치 설정 중 오류가 발생했습니다.');
          setIsInitialized(true);
        }
      };
      
      initializeLocation();
    }
  }, [initialPosition.lat, initialPosition.lng, initialAddress, onLocationSelect, isInitialized]);

  // 주소 검색 함수
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('주소 검색에 실패했습니다.');
      }
      
      const data = await response.json();
      
      if (data && data[0]) {
        const { lat, lon, display_name } = data[0];
        const newPos = { 
          lat: parseFloat(lat), 
          lng: parseFloat(lon) 
        };
        
        // 위치 업데이트하고 지도 이동
        setPosition(newPos);
        setAddress(display_name);
        
        // 상위 컴포넌트에 위치 정보 전달
        onLocationSelect({
          lat: newPos.lat,
          lng: newPos.lng,
          address: display_name
        });
        
        // 지도 이동
        if (mapRef.current) {
          mapRef.current.setView(newPos, 17);
        }
      } else {
        setError('검색 결과를 찾을 수 없습니다. 다른 주소로 시도해주세요.');
      }
    } catch (error) {
      console.error('검색 오류:', error);
      setError('주소 검색 중 오류가 발생했습니다. 나중에 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 위치 변경 핸들러
  const handlePositionChange = useCallback((newPosition: { lat: number; lng: number }) => {
    setPosition(newPosition);
  }, []);

  // 주소 변경 핸들러
  const handleAddressChange = useCallback((newAddress: string) => {
    setAddress(newAddress);
    
    // 상위 컴포넌트에 업데이트된 정보 전달
    onLocationSelect({
      lat: position.lat,
      lng: position.lng,
      address: newAddress
    });
  }, [position.lat, position.lng, onLocationSelect]);

  // 현재 위치로 이동
  const handleCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          
          try {
            const newAddress = await fetchAddress(latitude, longitude);
            setPosition(newPos);
            setAddress(newAddress);
            
            onLocationSelect({
              lat: newPos.lat,
              lng: newPos.lng,
              address: newAddress
            });
            
            if (mapRef.current) {
              mapRef.current.flyTo(newPos, 17);
            }
          } catch (error) {
            console.error('주소 조회 실패:', error);
            setError('현재 위치의 주소를 가져올 수 없습니다.');
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          console.error('현재 위치를 가져오는 중 오류 발생:', err);
          setError('현재 위치를 가져올 수 없습니다. 위치 접근 권한을 확인해주세요.');
          setIsLoading(false);
        }
      );
    } else {
      setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
    }
  }, [onLocationSelect]);

  // 수동 주소 입력 핸들러
  const handleManualAddressChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    
    // 디바운싱을 위해 타이머 사용 (실제 구현에서는 useDebounce 훅 사용 권장)
    if (newAddress.length > 5) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newAddress)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data[0]) {
          const { lat, lon } = data[0];
          const newPos = { 
            lat: parseFloat(lat), 
            lng: parseFloat(lon) 
          };
          
          setPosition(newPos);
          if (mapRef.current) {
            mapRef.current.setView(newPos, 17);
          }
          
          onLocationSelect({
            lat: newPos.lat,
            lng: newPos.lng,
            address: newAddress
          });
        }
      } catch (error) {
        console.error('주소로 위치 조회 실패:', error);
      }
    }
  }, [onLocationSelect]);

  // 지도 클릭 이벤트 핸들러
  const handleMapClick = useCallback(async (latlng: L.LatLng) => {
    const newPos = { lat: latlng.lat, lng: latlng.lng };
    setPosition(newPos);
    
    try {
      const newAddress = await fetchAddress(latlng.lat, latlng.lng);
      setAddress(newAddress);
      
      onLocationSelect({
        lat: newPos.lat,
        lng: newPos.lng,
        address: newAddress
      });
    } catch (error) {
      console.error('주소 조회 실패:', error);
      setError('주소 조회 실패');
    }
  }, [onLocationSelect]);

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주소를 검색하세요 (예: 서울시 강남구 역삼동)"
            className="pr-10"
            disabled={isLoading}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
        <Button type="submit" size="sm" disabled={isLoading || !searchQuery.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-1" />
          )}
          검색
        </Button>
      </form>
      
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md flex items-start">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="h-96 relative rounded-md overflow-hidden border border-gray-200">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <DraggableMarker 
            initialPosition={position}
            onPositionChange={handlePositionChange}
            onAddressChange={handleAddressChange}
          />
          {/* MapClickHandler 추가 */}
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
        
        {/* 커스텀 줌 컨트롤 */}
        <div className="absolute right-4 bottom-4 z-[1000] flex flex-col space-y-2">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="확대"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="축소"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
        
        {/* 현재 위치 버튼 */}
        <button
          onClick={handleCurrentLocation}
          className="absolute left-4 bottom-4 z-[1000] w-8 h-8 bg-white rounded-md shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="현재 위치로 이동"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="h-4 w-4" />
          )}
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="address" className="text-sm font-medium flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1 text-muted-foreground" />
            선택한 주소
          </label>
          <span className="text-xs text-muted-foreground">
            마커를 드래그하여 위치 조정
          </span>
        </div>
        <Input 
          id="address"
          value={address} 
          onChange={handleManualAddressChange}
          placeholder="지도에서 위치를 클릭하거나 주소를 검색하세요"
          className="font-medium"
        />
      </div>
      
      <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-md flex items-start">
        <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium">위치 선택 팁 💡</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>지도를 클릭하면 해당 위치로 마커가 이동하고 주소가 자동 입력됩니다.</li>
            <li>마커를 드래그하여 원하는 위치로 미세 조정할 수 있습니다.</li>
            <li>상단의 검색창에 주소를 입력하여 원하는 위치를 찾을 수 있습니다.</li>
            <li>'현재 위치로 이동' 버튼을 클릭하여 현재 위치를 찾을 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// 유틸리티 함수 export
export const getAddressFromLatLng = fetchAddress;

export default MapMarkerSelector;