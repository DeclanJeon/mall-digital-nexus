
import React, { useState } from 'react';
import PeermallMap from '../components/PeermallMap';
import { Map } from 'lucide-react';

const PeerMap: React.FC = () => {
  const [isMapOpen, setIsMapOpen] = useState(true);
  
  // Sample locations for the map
  const sampleLocations = [
    {
      id: 'loc1',
      lat: 37.5665, 
      lng: 126.9780,
      title: '서울시청',
      address: '서울특별시 중구 세종대로 110',
      type: 'attraction',
      description: '서울 중심부에 위치한 시청 건물'
    },
    {
      id: 'loc2',
      lat: 37.5759, 
      lng: 126.9768,
      title: '경복궁',
      address: '서울특별시 종로구 사직로 161',
      type: 'attraction',
      description: '조선시대 대표적인 궁궐'
    },
    {
      id: 'loc3',
      lat: 37.5139, 
      lng: 127.0592,
      title: '롯데월드',
      address: '서울특별시 송파구 올림픽로 240',
      type: 'attraction',
      description: '실내외 놀이공원'
    },
    {
      id: 'loc4',
      lat: 37.5546, 
      lng: 126.9706,
      title: '남산서울타워',
      address: '서울특별시 용산구 남산공원길 105',
      type: 'attraction',
      description: '서울의 상징적인 타워'
    },
    {
      id: 'loc5',
      lat: 37.5113, 
      lng: 127.0980,
      title: '올림픽공원',
      address: '서울특별시 송파구 올림픽로 424',
      type: 'attraction',
      description: '1988 서울올림픽 개최지'
    }
  ];

  // Default selected location (Seoul City Hall)
  const defaultLocation = {
    lat: 37.5665,
    lng: 126.9780,
    title: '서울시청',
    address: '서울특별시 중구 세종대로 110',
    type: 'default' as const
  };

  return (
    <div className="min-h-screen bg-bg-100">
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center mb-6">
          <Map className="h-6 w-6 mr-2 text-accent-200" />
          <h1 className="text-2xl font-bold text-primary-300">피어<span className="text-accent-200">맵</span></h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
          <PeermallMap 
            isOpen={isMapOpen} 
            onClose={() => setIsMapOpen(false)} 
            selectedLocation={defaultLocation}
            allLocations={sampleLocations}
          />
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>지도에서 장소를 선택하여 자세한 정보를 확인하세요.</p>
          <p>내 위치 찾기 기능을 이용하면 현재 위치 주변의 장소들을 확인할 수 있습니다.</p>
        </div>
      </div>
    </div>
  );
};

export default PeerMap;
