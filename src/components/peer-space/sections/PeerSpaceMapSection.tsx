import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, LocateFixed, Satellite, Map as MapIcon, Edit, Check, X, Eye } from 'lucide-react'; // Eye 아이콘 추가
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L, { LatLng, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

// Leaflet 아이콘 깨짐 방지
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

interface PeerSpaceMapSectionProps {
  location?: LocationData;
  title: string;
  isOwner: boolean;
  onLocationUpdate: (newLocation: LocationData) => void;
}

// Nominatim API 결과 중 필요한 부분만 타입으로 정의
interface GeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
}

const PeerSpaceMapSection: React.FC<PeerSpaceMapSectionProps> = ({ location, title, isOwner, onLocationUpdate }) => {
  const [manualAddress, setManualAddress] = useState(location?.address || ""); // 사용자가 입력하거나 API로 받은 주소 (최종 저장될 주소)
  const [tempMarkerCoords, setTempMarkerCoords] = useState<L.LatLng | null>(
    location ? new L.LatLng(location.lat, location.lng) : null
  );
  const [mapViewType, setMapViewType] = useState<'street' | 'satellite'>('street');
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>(
    location ? [location.lat, location.lng] : [37.5665, 126.9780]
  );
  const [mapZoom, setMapZoom] = useState(location ? 15 : 7);
  const markerRef = useRef<L.Marker>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false); // 주소 검색 로딩 상태

  useEffect(() => {
    if (location) {
      setManualAddress(location.address);
      const newLatLng = new L.LatLng(location.lat, location.lng);
      setTempMarkerCoords(newLatLng);
      if (!isEditing) {
        setMapCenter([location.lat, location.lng]);
        setMapZoom(15);
      }
    } else {
      setManualAddress("");
      setTempMarkerCoords(null);
      if (!isEditing) {
        setMapCenter([37.5665, 126.9780]);
        setMapZoom(7);
      }
    }
  }, [location, isEditing]);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ko`);
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return `위도: ${lat.toFixed(5)}, 경도: ${lng.toFixed(5)}`;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return `위도: ${lat.toFixed(5)}, 경도: ${lng.toFixed(5)} (주소 변환 실패)`;
    }
  }, []);

  const MapEvents = () => {
    const map = useMap();
    useMapEvents({
      click(e) {
        if (isOwner && (!location || isEditing)) {
          const { lat, lng } = e.latlng;
          setTempMarkerCoords(e.latlng);
          map.setView(e.latlng);
          reverseGeocode(lat, lng).then(address => {
            setManualAddress(address); // 지도 클릭 시 manualAddress 업데이트
            toast({ title: "지도에 위치 선택됨", description: `주소: ${address}. 확인 후 등록/수정하세요.` });
          });
        }
      },
    });
    return null;
  };
  
  const MapController = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(mapCenter, mapZoom);
    }, [mapCenter, mapZoom, map]);

    useEffect(() => {
      if (tempMarkerCoords && markerRef.current) {
        let dynamicTitle = title; // 기본값은 props로 받은 title
        let addressForPopup = manualAddress; // 기본값은 현재 manualAddress

        if (isEditing) {
          dynamicTitle = '수정 중인 위치';
        } else if (location) {
          // "내 위치 찾기"로 tempMarkerCoords가 location과 다르게 설정된 경우
          if (tempMarkerCoords.lat !== location.lat || tempMarkerCoords.lng !== location.lng) {
            dynamicTitle = '현재 찾은 내 위치';
            // addressForPopup는 handleFindMyLocation에서 설정된 manualAddress (현재 위치 주소)
          } else {
            // 기존 location을 표시하는 경우
            dynamicTitle = title;
            addressForPopup = location.address; // 명시적으로 location.address 사용
          }
        } else { // 신규 등록 모드 (location 없음)
          dynamicTitle = '선택된 위치';
          // addressForPopup는 사용자가 클릭/검색한 주소 (manualAddress)
        }

        const popupContent = addressForPopup.startsWith("위도:") && !addressForPopup.includes("주소 변환 실패")
          ? addressForPopup // 위도, 경도만 표시 (주소 변환 실패 메시지 포함 가능)
          : `<b>${dynamicTitle}</b><br>${addressForPopup || (canEditOrRegister ? '주소를 입력하거나 지도에서 선택하세요.' : '주소 정보 없음')}`;
        
        markerRef.current.bindPopup(popupContent);
        // 팝업 자동 열기 조건 수정: 주소가 있고, (위도/경도만 있거나 "주소 변환 실패"를 포함하는 경우가 아니고), 팝업이 닫혀있을 때
        if (addressForPopup &&
            !((addressForPopup.startsWith("위도:") && !addressForPopup.includes("주소 변환 실패")) || addressForPopup.includes("주소 변환 실패")) &&
            !markerRef.current.isPopupOpen()) {
           markerRef.current.openPopup();
        }
      }
    }, [tempMarkerCoords, manualAddress, map, location, title, isEditing, canEditOrRegister]); // canEditOrRegister 추가
    return null;
  };

  const handleMarkerDragEnd = async (event: L.LeafletEvent) => {
    if (isOwner && (!location || isEditing)) {
      const marker = event.target as L.Marker;
      const newLatLng = marker.getLatLng();
      setTempMarkerCoords(newLatLng);
      const address = await reverseGeocode(newLatLng.lat, newLatLng.lng);
      setManualAddress(address); // 마커 드래그 시 manualAddress 업데이트
      toast({ title: "마커 위치 변경됨", description: `새 주소: ${address}` });
    }
  };

  const handleRegisterLocation = () => {
    if (isOwner && !location && tempMarkerCoords && manualAddress.trim() !== "") {
      onLocationUpdate({
        lat: tempMarkerCoords.lat,
        lng: tempMarkerCoords.lng,
        address: manualAddress.trim(),
      });
      toast({ title: "위치 등록 완료", description: `새로운 위치가 등록되었습니다: ${manualAddress.trim()}` });
    } else if (isOwner && !location) {
      toast({ title: "정보 부족", description: "주소를 검색하거나 지도에서 위치를 선택하고, 주소를 확인해주세요.", variant: "destructive" });
    }
  };

  const handleStartEdit = () => {
    if (isOwner && location) {
      setIsEditing(true);
      setTempMarkerCoords(new L.LatLng(location.lat, location.lng));
      setManualAddress(location.address); // 수정 시작 시 기존 주소로 manualAddress 설정
      setMapCenter([location.lat, location.lng]);
      setMapZoom(16);
      toast({ title: "위치 수정 시작", description: "지도나 주소 입력창에서 위치를 변경하세요." });
    }
  };
  
  const handleConfirmUpdate = () => {
    if (isOwner && location && isEditing && tempMarkerCoords && manualAddress.trim() !== "") {
      onLocationUpdate({
        lat: tempMarkerCoords.lat,
        lng: tempMarkerCoords.lng,
        address: manualAddress.trim(),
      });
      toast({ title: "위치 수정 완료", description: `위치가 업데이트되었습니다: ${manualAddress.trim()}` });
      setIsEditing(false);
    } else if (isOwner && location && isEditing) {
      toast({ title: "정보 부족", description: "주소를 확인해주세요.", variant: "destructive" });
    }
  };

  const handleCancelEdit = () => {
    if (isOwner && location && isEditing) {
      setIsEditing(false);
      // useEffect에 의해 location 값으로 상태 복원
      toast({ title: "위치 수정 취소", description: "변경사항이 취소되었습니다." });
    }
  };
  
  const handleSearchAddressAndPreview = async () => {
    const addressToSearch = manualAddress.trim(); // manualAddress에서 직접 검색
    if (addressToSearch === "") {
      toast({ title: "주소 입력 필요", description: "검색할 주소를 입력해주세요.", variant: "destructive" });
      return;
    }

    if (!isOwner || (location && !isEditing)) {
        toast({ title: "알림", description: "위치 수정 모드 또는 신규 등록 시에만 주소로 위치를 변경할 수 있습니다."});
        return;
    }

    setIsLoadingSearch(true); // 로딩 시작
    try {
      // 한국 결과 우선 검색
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressToSearch)}&limit=1&addressdetails=1&accept-language=ko&countrycodes=kr`;
      const response = await fetch(searchUrl);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `주소 검색 API 오류: ${response.status}`);
      }
      const data: GeocodingResult[] = await response.json();

      if (data && data.length > 0) {
        const found = data[0];
        const newLat = parseFloat(found.lat);
        const newLng = parseFloat(found.lon);
        
        setManualAddress(found.display_name); // API 결과로 manualAddress 업데이트
        setTempMarkerCoords(new L.LatLng(newLat, newLng));
        setMapCenter([newLat, newLng]);
        setMapZoom(17);
        toast({ title: "주소 검색 완료", description: `지도에서 '${found.display_name}' 위치를 확인하세요.` });
      } else {
        toast({ title: "검색 결과 없음", description: "해당 주소를 찾을 수 없습니다. 좀 더 자세히 입력해보세요.", variant: "destructive" });
      }
    } catch (error: unknown) {
      console.error("Geocoding API error:", error);
      const errorMessage = error instanceof Error ? error.message : "주소 검색 중 오류가 발생했습니다.";
      toast({ title: "주소 검색 오류", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoadingSearch(false); // 로딩 종료
    }
  };

  const handleDirection = () => {
    if (location) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
        '_blank'
      );
    } else {
      toast({ title: "위치 정보 없음", description: "길찾기를 하려면 먼저 위치가 등록되어야 합니다.", variant: "destructive" });
    }
  };

  const handleFindMyLocation = async () => {
    // 보기 모드 (로직 동일)
    if (!isOwner || (location && !isEditing)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => { // async 추가
            const currentLatLng = new L.LatLng(position.coords.latitude, position.coords.longitude);
            setTempMarkerCoords(currentLatLng); // 마커 위치 업데이트
            setMapCenter([position.coords.latitude, position.coords.longitude]);
            setMapZoom(16);
            try { // reverseGeocode 호출 및 주소 업데이트
              const address = await reverseGeocode(position.coords.latitude, position.coords.longitude);
              setManualAddress(address); // 주소 상태 업데이트
              toast({ title: "내 위치 확인 완료", description: `지도에서 현재 위치를 확인하세요: ${address}` });
            } catch (e) {
              console.warn("Reverse geocoding failed in view mode for current location:", e);
              setManualAddress(`위도: ${position.coords.latitude.toFixed(5)}, 경도: ${position.coords.longitude.toFixed(5)} (주소 조회 실패)`);
              toast({ title: "내 위치 확인 완료", description: "지도에서 현재 위치를 확인하세요. 주소는 가져오지 못했습니다." });
            }
          },
          (error) => {
            console.error("Error getting current location (view mode):", error);
            let message = "현재 위치를 가져올 수 없습니다. ";
            if (error.code === error.PERMISSION_DENIED) message += "위치 정보 접근 권한을 확인해주세요.";
            else if (error.code === error.POSITION_UNAVAILABLE) message += "현재 위치를 파악할 수 없습니다.";
            else if (error.code === error.TIMEOUT) message += "시간이 초과되었습니다.";
            toast({ title: "위치 찾기 실패", description: message, variant: "destructive" });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        toast({ title: "위치 찾기 실패", description: "브라우저에서 위치 정보 기능을 지원하지 않습니다.", variant: "destructive" });
       }
      return;
    }

    // 등록/수정 모드
    if (navigator.geolocation) {
      toast({ title: "현재 위치 찾는 중...", description: "잠시만 기다려주세요."});
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = new L.LatLng(latitude, longitude);
          setTempMarkerCoords(newCoords);
          setMapCenter([latitude, longitude]);
          setMapZoom(16);
          const address = await reverseGeocode(latitude, longitude);
          setManualAddress(address); // 내 위치 찾기 시 manualAddress 업데이트
          toast({ title: "현재 위치 확인", description: address });
        },
        (error) => { 
            console.error("Error getting current location (edit/register mode):", error);
            let message = "현재 위치를 가져올 수 없습니다. ";
            if (error.code === error.PERMISSION_DENIED) message += "위치 정보 접근 권한을 확인해주세요.";
            else if (error.code === error.POSITION_UNAVAILABLE) message += "현재 위치를 파악할 수 없습니다.";
            else if (error.code === error.TIMEOUT) message += "시간이 초과되었습니다.";
            toast({ title: "위치 찾기 실패", description: message, variant: "destructive" });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else { 
        toast({ title: "위치 찾기 실패", description: "브라우저에서 위치 정보 기능을 지원하지 않습니다.", variant: "destructive" });
    }
  };

  const handleChangeMapView = (type: 'street' | 'satellite') => {
    setMapViewType(type);
  };

  const canEditOrRegister = isOwner && (!location || isEditing);

  const renderAddressInput = (idSuffix: string) => (
    <div className="space-y-1">
      <label htmlFor={`manualAddressInput${idSuffix}`} className="text-sm font-medium text-gray-700">
        주소
      </label>
      <div className="flex gap-2">
        <Input
          id={`manualAddressInput${idSuffix}`} // ID 변경 (manualAddress 상태와 구분)
          type="text"
          value={manualAddress} // manualAddress 직접 바인딩
          onChange={(e) => setManualAddress(e.target.value)}
          placeholder="정확한 주소를 입력 후 검색하세요"
          className="flex-grow"
          disabled={(!canEditOrRegister && !!location) || isLoadingSearch} // 뷰 모드 또는 로딩 중 비활성화
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (canEditOrRegister || !location) && !isLoadingSearch) {
              handleSearchAddressAndPreview();
            }
          }}
        />
        <Button 
          onClick={handleSearchAddressAndPreview} 
          variant="outline" 
          size="sm" 
          disabled={(!canEditOrRegister && !!location) || isLoadingSearch} // 뷰 모드 또는 로딩 중 비활성화
        >
          {isLoadingSearch ? "검색 중..." : "검색"}
        </Button>
      </div>
    </div>
  );

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">위치 정보</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleFindMyLocation} title="내 위치 찾기">
            <LocateFixed className="h-4 w-4" />
          </Button>
          <Button
            variant={mapViewType === 'street' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChangeMapView('street')}
            title="일반 지도"
          >
            <MapIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={mapViewType === 'satellite' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleChangeMapView('satellite')}
            title="위성 지도"
          >
            <Satellite className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2 relative">
            <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                style={{ height: '300px', width: '100%' }} 
                className={`${canEditOrRegister ? 'cursor-crosshair' : ''}`}
            >
              {mapViewType === 'street' && (
                <TileLayer
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              )}
              {mapViewType === 'satellite' && (
                <TileLayer
                  attribution='Tiles © Esri — Source: Esri, ...'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              )}
              {tempMarkerCoords && (
                // TODO: tempMarkerCoords의 위도/경도는 사용자의 직접적인 지도 인터랙션(클릭, 드래그, 검색) 또는
                // props로 전달된 location 값(location.lat, location.lng)에 의해 설정됩니다.
                // 만약 props.location.address만 있고 lat/lng가 부정확(예: 0,0)하다면,
                // 이 컴포넌트가 마운트될 때 또는 location prop이 변경될 때 해당 주소를 지오코딩하여
                // 정확한 tempMarkerCoords(위도/경도)를 설정하는 로직이 필요할 수 있습니다.
                // 현재는 reverseGeocode 함수(좌표->주소)만 있고, 정방향 지오코딩(주소->좌표)은 handleSearchAddressAndPreview에서 Nominatim API를 사용합니다.
                <Marker
                    position={tempMarkerCoords}
                    ref={markerRef}
                    draggable={canEditOrRegister}
                    eventHandlers={{
                        dragend: handleMarkerDragEnd,
                    }}
                >
                </Marker>
              )}
              <MapEvents />
              <MapController />
            </MapContainer>
          </div>
          
          <div className="p-6 flex flex-col">
            {isOwner && !location && !isEditing && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  피어스페이스 위치를 등록합니다. 주소를 입력하여 검색하거나 지도에서 직접 위치를 클릭 후 '위치 등록' 버튼을 눌러주세요.
                </p>
                {renderAddressInput('Reg')}
                <Button onClick={handleRegisterLocation} className="w-full bg-green-500 hover:bg-green-600">
                  위치 등록
                </Button>
              </div>
            )}

            {location && !isEditing && (
              <>
                <h3 className="font-medium text-lg mb-2">{title}</h3>
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-gray-700 flex-grow">{location.address}</p>
                </div>
                <div className="space-y-2 mt-auto">
                  <Button onClick={handleDirection} className="w-full bg-blue-500 hover:bg-blue-600">
                    <Navigation className="h-4 w-4 mr-2" /> 길찾기
                  </Button>
                  {/* Street View 버튼 추가됨 */}
                  <Button
                    onClick={() => {
                      if (location) {
                        window.open(
                          `https://www.google.com/maps?q&layer=c&cbll=${location.lat},${location.lng}&cbp=12,0,0,0,0`,
                          '_blank'
                        );
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    <Eye className="h-4 w-4 mr-2" /> 스트리트 뷰
                  </Button>
                  {isOwner && (
                    <Button onClick={handleStartEdit} variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" /> 위치 수정
                    </Button>
                  )}
                </div>
              </>
            )}

            {isOwner && location && isEditing && (
              <div className="space-y-4">
                <p className="text-gray-600 text-sm">
                  위치를 수정합니다. 주소를 변경하여 검색하거나 지도에서 직접 위치를 클릭/드래그 후 '수정 완료' 버튼을 눌러주세요.
                </p>
                {renderAddressInput('Edit')}
                <Button onClick={handleConfirmUpdate} className="w-full bg-orange-500 hover:bg-orange-600">
                  <Check className="h-4 w-4 mr-2" /> 수정 완료
                </Button>
                <Button onClick={handleCancelEdit} variant="ghost" className="w-full">
                  <X className="h-4 w-4 mr-2" /> 취소
                </Button>
              </div>
            )}

            {!isOwner && !location && (
              <p className="text-gray-500">등록된 위치 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default PeerSpaceMapSection;