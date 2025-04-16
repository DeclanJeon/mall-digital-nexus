import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ReviewSection = ({ locations }) => {
  return (
    <div className="bg-white p-4 border-t">
      <h3 className="font-bold text-lg mb-3">피어몰 리뷰 요약</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {locations.map(location => (
          <div key={location.title} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{location.title}</h4>
              <div className="flex items-center">
                <span className="text-yellow-500">★★★★☆</span>
                <span className="text-sm ml-1">(4.2)</span>
              </div>
            </div>
            <div className="text-sm space-y-2">
              <p className="line-clamp-2">"이 피어몰에서 정말 좋은 경험을 했어요. 직원들이 친절했고..."</p>
              <p className="text-gray-500 text-xs">- 최근 리뷰 3개 중</p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

const EcosystemMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState('street');
  const [userLocation, setUserLocation] = useState(null);

  const locations = [
    {
      lat: 37.5665,
      lng: 126.9780,
      title: "서울시청 피어몰",
      address: "서울특별시 중구 세종대로 110"
    },
    {
      lat: 37.5796,
      lng: 126.9770, 
      title: "광화문 피어몰",
      address: "서울특별시 종로구 율곡로 99"
    }
  ];

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [37.5665, 126.9780],
      zoom: 13
    });

    // 기본 지도 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 마커 추가
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
          </div>
        `);
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 지도 타입 변경
  useEffect(() => {
    if (!mapInstance.current) return;

    mapInstance.current.eachLayer(layer => {
      if (layer._url?.includes('openstreetmap') || layer._url?.includes('arcgisonline')) {
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

  // 내 위치 찾기
  const findMyLocation = () => {
    if (!mapInstance.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          mapInstance.current.flyTo([latitude, longitude], 15);
          
          // 기존 내 위치 마커 제거
          mapInstance.current.eachLayer(layer => {
            if (layer instanceof L.Marker && layer.options.icon?.options?.className === 'my-location-marker') {
              mapInstance.current.removeLayer(layer);
            }
          });

          // 새 내 위치 마커 추가
          L.marker([latitude, longitude], {
            icon: L.divIcon({
              className: 'my-location-marker',
              html: '<div style="background-color: #4285F4; width: 20px; height: 20px; border-radius of 50%; border: 2px solid white;"></div>',
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

  // 피어몰 검색
  const searchPeermall = () => {
    if (!mapInstance.current || !searchQuery.trim()) return;
    
    const found = locations.find(loc => 
      loc.title.includes(searchQuery)
    );
    
    if (found) {
      mapInstance.current.flyTo([found.lat, found.lng], 15);
    } else {
      alert('해당하는 피어몰을 찾을 수 없습니다.');
    }
  };

  return (
    <>
      <div className="relative w-full h-[600px] rounded-lg shadow-md overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{backgroundColor: '#f5f5f5'}}
        />
        
        <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-lg shadow-md flex flex-col gap-2">
          <div className="flex gap-2">
            <button 
              onClick={() => setMapType('street')}
              className={`px-3 py-1 rounded ${mapType === 'street' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              일반지도
            </button>
            <button 
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1 rounded ${mapType === 'satellite' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
            >
              위성지도
            </button>
          </div>
          
          <button 
            onClick={findMyLocation}
            className="px-3 py-1 bg-green-500 text-white rounded"
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
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              검색
            </button>
          </div>
        </div>
      </div>

      <ReviewSection locations={locations} />
    </>
  );
};

export default EcosystemMap;
