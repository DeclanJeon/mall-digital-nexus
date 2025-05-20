
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMap, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useToast } from '@/hooks/use-toast';
import { CommunityZone } from '@/types/community';
import { Loader, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserLocationFeaturesProps {
  onNearbyCommunitiesFound: (communityIds: string[]) => void;
  communityZones: CommunityZone[];
  searchRadius?: number; // in kilometers
}

// 최적화: 거리 계산 함수 개선 - Haversine 공식 사용
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  // 성능 최적화된 Haversine 공식 구현
  const R = 6371; // 지구 반경 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = 
    0.5 - Math.cos(dLat)/2 + 
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    (1 - Math.cos(dLon)) / 2;

  return R * 2 * Math.asin(Math.sqrt(a));
};

// 메모이제이션된 사용자 위치 아이콘 생성
const createUserLocationIcon = () => {
  return new L.DivIcon({
    className: 'user-location-marker',
    html: `
      <div style="
        background-color: #3388ff;
        border: 2px solid white;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        box-shadow: 0 0 6px rgba(51, 136, 255, 0.5);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const UserLocationFeatures: React.FC<UserLocationFeaturesProps> = ({ 
  onNearbyCommunitiesFound, 
  communityZones,
  searchRadius = 200
}) => {
  const map = useMap();
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showSearchRadius, setShowSearchRadius] = useState<boolean>(true);
  
  // 메모이제이션: 사용자 위치 아이콘
  const userLocationIcon = useMemo(() => createUserLocationIcon(), []);

  // 수정: 위치 변환 함수 개선 - 정확한 좌표계 변환 구현
  const transformPosition = useCallback((zone: CommunityZone): [number, number] => {
    // 수정: 정확한 좌표계 변환 구현
    const lat = zone.position.y === 0 ? 90 : 90 - ((zone.position.y / 100) * 180);
    const lng = zone.position.x === 0 ? -180 : ((zone.position.x / 100) * 360) - 180;
    return [lat, lng];
  }, []);

  // 성능 최적화: 최적화된 주변 커뮤니티 검색 알고리즘
  const findNearbyCommunities = useCallback(() => {
    if (!userLocation) return [];
    
    const [userLat, userLng] = userLocation;
    
    try {
      // 최적화 1: 먼저 대략적인 경계 상자 필터링을 수행
      // 1도는 대략 111km이므로, searchRadius를 도 단위로 변환
      const degRadius = searchRadius / 111;
      
      // 최적화 2: 필터 함수 대신 for 루프 사용 (성능 향상)
      const nearbyIds: string[] = [];
      const candidateZones: CommunityZone[] = [];
      
      // 1단계: 빠른 경계 상자 필터링으로 후보군 줄이기
      for (let i = 0; i < communityZones.length; i++) {
        const zone = communityZones[i];
        const [zoneLat, zoneLng] = transformPosition(zone);
        
        if (Math.abs(zoneLat - userLat) <= degRadius && 
            Math.abs(zoneLng - userLng) <= degRadius) {
          candidateZones.push(zone);
        }
      }
      
      // 2단계: 후보군에 대해서만 정확한 거리 계산
      for (let i = 0; i < candidateZones.length; i++) {
        const zone = candidateZones[i];
        const [zoneLat, zoneLng] = transformPosition(zone);
        const distance = calculateDistance(userLat, userLng, zoneLat, zoneLng);
        
        if (distance <= searchRadius) {
          nearbyIds.push(zone.id);
        }
      }
        
      onNearbyCommunitiesFound(nearbyIds);
      return nearbyIds;
    } catch (error) {
      console.error("주변 커뮤니티 검색 중 오류 발생:", error);
      toast({
        title: "검색 오류",
        description: "주변 커뮤니티를 검색하는 중 문제가 발생했습니다.",
        variant: "destructive"
      });
      return [];
    }
  }, [userLocation, communityZones, searchRadius, onNearbyCommunitiesFound, transformPosition, toast]);

  // 수정: 위치 확인 기능 개선 및 오류 처리 강화
  const getUserLocation = useCallback(() => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("지리적 위치 기능이 지원되지 않는 브라우저입니다.");
      setIsLocating(false);
      toast({
        title: "위치 서비스 오류",
        description: "지리적 위치 기능이 지원되지 않는 브라우저입니다.",
        variant: "destructive"
      });
      return;
    }
    
    // 토스트 알림 최소화
    toast({
      title: "위치 확인 중",
      description: "현재 위치를 확인하고 있습니다...",
      duration: 3000
    });
    
    // 위치 옵션 최적화: 모바일에서 더 빠른 응답을 위해 타임아웃 조정
    const positionOptions = {
      enableHighAccuracy: true, 
      timeout: 7000, // 타임아웃 연장
      maximumAge: 0
    };
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // 성능 최적화: 이전 위치와 같으면 상태 업데이트 생략
          if (userLocation && 
              userLocation[0] === latitude && 
              userLocation[1] === longitude) {
            setIsLocating(false);
            return;
          }
          
          console.log("위치 확인 성공:", latitude, longitude);
          setUserLocation([latitude, longitude]);
          setIsLocating(false);
          
          // 성능 개선: 지도 이동 애니메이션 최적화
          map.flyTo([latitude, longitude], 8, {
            animate: true,
            duration: 1.5, // 애니메이션 시간 적절히 조정
            easeLinearity: 0.5
          });
          
          // 비동기적으로 주변 커뮤니티 찾기 (렌더링 차단 방지)
          setTimeout(() => {
            const foundIds = findNearbyCommunities();
            console.log("찾은 주변 커뮤니티:", foundIds);
          }, 300);
        } catch (error) {
          console.error("위치 처리 중 오류:", error);
          setLocationError("위치 정보 처리 중 오류가 발생했습니다.");
          setIsLocating(false);
          toast({
            title: "위치 처리 오류",
            description: "위치 정보를 처리하는 중 문제가 발생했습니다.",
            variant: "destructive"
          });
        }
      },
      (error) => {
        console.error("위치 오류:", error.code, error.message);
        let errorMsg = "위치 정보를 가져올 수 없습니다.";
        
        // 오류 코드에 따른 더 자세한 메시지
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "위치 권한이 거부되었습니다. 브라우저 설정에서 위치 접근을 허용해주세요.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "현재 위치를 확인할 수 없습니다. 다시 시도해주세요.";
            break;
          case error.TIMEOUT:
            errorMsg = "위치 확인 시간이 초과되었습니다. 다시 시도해주세요.";
            break;
        }
        
        toast({
          title: "위치 서비스 오류",
          description: errorMsg,
          variant: "destructive",
          duration: 4000
        });
        
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      positionOptions
    );
  }, [map, toast, findNearbyCommunities, userLocation]);

  // 토글 함수 메모이제이션
  const toggleSearchRadius = useCallback(() => {
    setShowSearchRadius(prev => !prev);
  }, []);

  // 최적화: 주변 커뮤니티 업데이트 로직 개선
  useEffect(() => {
    if (userLocation) {
      // 디바운싱 적용으로 불필요한 연산 방지
      const timerId = setTimeout(() => {
        findNearbyCommunities();
      }, 300);
      
      return () => clearTimeout(timerId);
    }
  }, [userLocation, findNearbyCommunities]);

  // 최적화: 위치 컨트롤 추가 로직 개선
  useEffect(() => {
    // 맵 컨트롤 클래스 메모이제이션
    const locateControl = L.Control.extend({
      options: {
        position: 'bottomleft'
      },
      
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', 'locate-button', container);
        
        button.innerHTML = isLocating 
          ? '<div class="loading-spinner" style="width:16px;height:16px;"></div>' 
          : '<div style="display:flex;align-items:center;justify-content:center;font-size:16px;">📍</div>';
        button.title = '내 위치 찾기';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.cursor = 'pointer';
        button.style.position = 'relative';
        button.style.zIndex = '1000';
        
        if (userLocation) {
          button.style.backgroundColor = '#e6f2ff';
          button.style.color = '#0078A8';
        }
        
        L.DomEvent.on(button, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          getUserLocation();
        });
        
        return container;
      }
    });
    
    // 최적화: 컨트롤 생성 및 제거 최소화
    const control = new locateControl();
    map.addControl(control);
    
    return () => {
      map.removeControl(control);
    };
  }, [map, getUserLocation, isLocating, userLocation]);

  // 최적화: 조건부 렌더링으로 불필요한 요소 생성 방지
  return (
    <>
      {userLocation && (
        <>
          <Marker 
            position={userLocation} 
            icon={userLocationIcon}
            eventHandlers={{
              click: () => {
                map.flyTo(userLocation, map.getZoom());
              }
            }}
          >
            <Popup className="location-popup">
              <div className="text-center p-1">
                <p className="font-medium text-blue-600">내 위치</p>
                <p className="text-xs mt-1 text-gray-600">위도: {userLocation[0].toFixed(4)}, 경도: {userLocation[1].toFixed(4)}</p>
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={toggleSearchRadius}
                  >
                    {showSearchRadius ? '반경 숨기기' : '반경 표시하기'}
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
          
          {/* 검색 반경 표시 최적화: 사용자가 볼 때만 렌더링 */}
          {showSearchRadius && (
            <Circle 
              center={userLocation} 
              radius={searchRadius * 1000} 
              className="location-search-radius"
              pathOptions={{ 
                fillColor: '#3388ff', 
                fillOpacity: 0.05, // 투명도 낮춤
                color: '#3388ff', 
                weight: 1, // 선 두께 감소
                dashArray: '5, 5' 
              }} 
            />
          )}
        </>
      )}
    </>
  );
};

export default React.memo(UserLocationFeatures);
