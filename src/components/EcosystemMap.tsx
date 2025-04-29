import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, ChevronUp, ChevronDown, MapPin, Phone, MessageSquare, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface StoreReview {
  author: string;
  rating: number;
  text: string;
  likes: number;
  dislikes: number;
  date: string;
  stats: {
    satisfaction: number;
    quality: number;
    service: number;
    valueForMoney: number;
  };
}

interface Location {
  lat: number;
  lng: number;
  title: string;
  address: string;
  reviews?: StoreReview[];
  phone?: string;
}

const ReviewSection = ({ location }: { location: Location | null }) => {
  if (!location || !location.reviews || location.reviews.length === 0) {
    return (
      <div className="bg-white p-4 border-t mt-4 rounded-b-lg shadow-md">
        <h3 className="font-bold text-lg mb-3">피어몰 리뷰</h3>
        <p className="text-gray-500 text-sm">선택한 피어몰의 리뷰가 없습니다.</p>
      </div>
    );
  }

  const displayedReviews = location.reviews.slice(0, 3);
  
  const avgRating = location.reviews.reduce((sum, review) => sum + review.rating, 0) / location.reviews.length;
  const formattedRating = avgRating.toFixed(1);
  const reviewCount = location.reviews.length.toLocaleString();

  const handleCall = () => {
    if (location.phone) {
      window.location.href = `tel:${location.phone}`;
    } else {
      alert('전화번호가 등록되지 않았습니다.');
    }
  };

  const handleMessage = () => {
    alert(`${location.title}에 메시지를 보냅니다.`);
  };

  const handleNavigate = () => {
    if (location.lat && location.lng) {
      window.open(`https://maps.google.com/maps?q=${location.lat},${location.lng}`, '_blank');
    }
  };

  return (
    <div className="bg-white p-4 border-t mt-4 rounded-b-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{location.title} 리뷰</h3>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= Math.round(avgRating) ? "fill-yellow-500" : "fill-gray-200"}`} 
              />
            ))}
          </div>
          <span className="font-bold">{formattedRating}</span>
          <span className="text-gray-500 text-sm">({reviewCount})</span>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleCall} className="flex items-center gap-1">
          <Phone className="h-4 w-4" />
          <span>통화</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleMessage} className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>메시지</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleNavigate} className="flex items-center gap-1">
          <Navigation className="h-4 w-4" />
          <span>길찾기</span>
        </Button>
      </div>
      
      {displayedReviews.map((review, index) => (
        <div key={index} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-400 rounded-full text-white flex items-center justify-center">
                {review.author.slice(0, 1)}
              </div>
              <div>
                <div className="font-medium">{review.author}</div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
            </div>
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-500" : "fill-gray-200"}`} 
                />
              ))}
            </div>
          </div>
          
          <p className="text-sm mb-4">{review.text}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm font-medium">만족도</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${review.stats.satisfaction}%` }} 
                  ></div>
                </div>
                <span className="text-sm text-red-500 font-bold">{review.stats.satisfaction}%</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="text-sm font-medium">상품 품질</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${review.stats.quality}%` }} 
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{review.stats.quality}%</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="text-sm font-medium">서비스</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${review.stats.service}%` }} 
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{review.stats.service}%</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="text-sm font-medium">가격 대비 만족도</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${review.stats.valueForMoney}%` }} 
                  ></div>
                </div>
                <span className="text-sm text-gray-500">{review.stats.valueForMoney}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4 mt-3">
            <button className="flex items-center gap-1 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{review.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
              <span>{review.dislikes}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const EcosystemMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState('street');
  const [userLocation, setUserLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showControls, setShowControls] = useState(true);

  const locations: Location[] = [
    {
      lat: 37.5665,
      lng: 126.9780,
      title: "서울시청 피어몰",
      address: "서울특별시 중구 세종대로 110",
      phone: "02-1234-5678",
      reviews: [
        {
          author: "GPT카이",
          rating: 4.6,
          text: "최근 3개월의 리뷰를 모아봤어요. 이 서비스는 정말 편하고 직관적인 UI를 가지고 있어서 사용하기 쉬웠습니다. 특히 피어몰에서 제공하는 상품들의 품질이 우수하고 배송도 빨라서 만족스러웠습니다. 고객센터의 응대도 친절하고 문의사항에 빠르게 답변해 주셔서 좋았어요.",
          likes: 24,
          dislikes: 3,
          date: "2025-04-10",
          stats: {
            satisfaction: 93,
            quality: 74,
            service: 66,
            valueForMoney: 69
          }
        }
      ]
    }
  ];

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