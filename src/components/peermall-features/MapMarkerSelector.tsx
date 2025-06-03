import React, { useState, useEffect, useCallback, useMemo } from 'react'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, MapPin as MapPinIcon, AlertCircle, Plus, Minus, LocateFixed, Info } from 'lucide-react';

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

interface MapMarkerSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialPosition?: { lat: number; lng: number };
  initialAddress?: string;
}

const ChangeView: React.FC<{ center: L.LatLngExpression; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const MapClickHandler: React.FC<{ 
  onMapClick: (latlng: L.LatLng) => void 
}> = ({ onMapClick }) => {
  const map = useMap();
  const handleClick = useCallback((e: L.LeafletMouseEvent) => {
    onMapClick(e.latlng);
  }, [onMapClick, map]);

  useEffect(() => {
    map.on('click', handleClick);
    return () => { map.off('click', handleClick); };
  }, [map, handleClick]);
  return null;
};

const MapMarkerSelector: React.FC<MapMarkerSelectorProps> = ({
  onLocationSelect,
  initialPosition = { lat: 37.5665, lng: 126.9780 },
  initialAddress = ''
}) => {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialPosition ? L.latLng(initialPosition.lat, initialPosition.lng) : null
  );
  const [address, setAddress] = useState<string>(initialAddress || '주소를 불러오는 중...');
  const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
  const [loadingCurrentLocation, setLoadingCurrentLocation] = useState<boolean>(false);

  console.log('MapMarkerSelector - Step 4: Current Location Feature');

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setLoadingAddress(true);
    setAddress('주소 검색 중...');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=ko`);
      const data = await response.json();
      if (data && data.display_name) {
        const newAddress = data.display_name;
        setAddress(newAddress);
        return newAddress;
      } else {
        setAddress('주소를 찾을 수 없습니다.');
        return '주소를 찾을 수 없습니다.';
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('주소 정보를 가져오는 데 실패했습니다.');
      return '주소 정보를 가져오는 데 실패했습니다.';
    } finally {
      setLoadingAddress(false);
    }
  }, []);

  const handleMapClick = useCallback(async (latlng: L.LatLng) => {
    console.log('Map clicked at:', latlng);
    setPosition(latlng);
    const fetchedAddress = await fetchAddress(latlng.lat, latlng.lng);
    onLocationSelect({ lat: latlng.lat, lng: latlng.lng, address: fetchedAddress });
  }, [fetchAddress, onLocationSelect]);

  const handleMarkerDragEnd = useCallback(async (event: L.DragEndEvent) => {
    const marker = event.target;
    const latlng = marker.getLatLng();
    console.log('Marker dragged to:', latlng);
    setPosition(latlng);
    const fetchedAddress = await fetchAddress(latlng.lat, latlng.lng);
    onLocationSelect({ lat: latlng.lat, lng: latlng.lng, address: fetchedAddress });
  }, [fetchAddress, onLocationSelect]);

  const handleLocateUser = useCallback(() => {
    if (navigator.geolocation) {
      setLoadingCurrentLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (geoPosition) => {
          const latlng = L.latLng(geoPosition.coords.latitude, geoPosition.coords.longitude);
          setPosition(latlng);
          const fetchedAddress = await fetchAddress(latlng.lat, latlng.lng);
          onLocationSelect({ lat: latlng.lat, lng: latlng.lng, address: fetchedAddress });
          setLoadingCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('현재 위치를 가져올 수 없습니다. 위치 정보 접근 권한을 확인해주세요.');
          setLoadingCurrentLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('이 브라우저에서는 현재 위치 찾기 기능을 지원하지 않습니다.');
    }
  }, [fetchAddress, onLocationSelect]);

  const markerEventHandlers = useMemo(() => ({
    dragend: handleMarkerDragEnd,
  }), [handleMarkerDragEnd]);

  useEffect(() => {
    if (initialPosition) {
      const initialLatLng = L.latLng(initialPosition.lat, initialPosition.lng);
      setPosition(initialLatLng); 
      if (initialAddress) {
        setAddress(initialAddress);
        onLocationSelect({ lat: initialPosition.lat, lng: initialPosition.lng, address: initialAddress }); 
      } else {
        fetchAddress(initialPosition.lat, initialPosition.lng).then(fetchedAddress => {
          onLocationSelect({ lat: initialPosition.lat, lng: initialPosition.lng, address: fetchedAddress });
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [initialPosition, initialAddress, fetchAddress]); 

  if (typeof window === 'undefined') {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ height: '400px', width: '100%', border: '1px solid orange' }}> 
      <h2>MapMarkerSelector (Step 4: Current Location)</h2>
      
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p>Selected Address: {loadingAddress ? <Loader2 className="inline-block h-4 w-4 animate-spin" /> : address}</p>
        <Button onClick={handleLocateUser} disabled={loadingCurrentLocation || loadingAddress} size="sm">
          {loadingCurrentLocation ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LocateFixed className="mr-2 h-4 w-4" />
          )}
          현재 위치
        </Button>
      </div>
      <MapContainer 
        center={position ? [position.lat, position.lng] : [initialPosition.lat, initialPosition.lng]} 
        zoom={13} 
        style={{ height: 'calc(100% - 90px)', width: '100%' }} 
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />
        {position && (
          <Marker 
            position={position} 
            icon={DefaultIcon} 
            draggable={true} 
            eventHandlers={markerEventHandlers} 
          >
            <Popup>
              {loadingAddress ? '주소 로딩 중...' : address} <br />
              위도: {position.lat.toFixed(5)}, 경도: {position.lng.toFixed(5)}
            </Popup>
          </Marker>
        )}
        {position && <ChangeView center={position} zoom={16} />}
      </MapContainer>
    </div>
  );
};

export default MapMarkerSelector;