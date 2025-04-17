
import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, ChevronUp, ChevronDown, MapPin } from 'lucide-react';

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
}

const ReviewSection = ({ location }: { location: Location | null }) => {
  if (!location || !location.reviews || location.reviews.length === 0) {
    return (
      <div className="bg-white p-4 border-t">
        <h3 className="font-bold text-lg mb-3">피어몰 리뷰</h3>
        <p className="text-gray-500 text-sm">선택한 피어몰의 리뷰가 없습니다.</p>
      </div>
    );
  }

  // Only show up to 2 reviews as requested
  const displayedReviews = location.reviews.slice(0, 2);
  
  // Calculate average rating
  const avgRating = location.reviews.reduce((sum, review) => sum + review.rating, 0) / location.reviews.length;
  const formattedRating = avgRating.toFixed(1);
  const reviewCount = location.reviews.length.toLocaleString();

  return (
    <div className="bg-white p-4 border-t">
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

  // All locations matching the peermall list
  const locations: Location[] = [
    {
      lat: 37.5665,
      lng: 126.9780,
      title: "서울시청 피어몰",
      address: "서울특별시 중구 세종대로 110",
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
        },
        {
          author: "김서연",
          rating: 5,
          text: "피어몰의 서비스가 정말 마음에 들어요. 상품 품질이 좋고 가격도 합리적이에요. 특히 배송이 빨라서 놀랐어요!",
          likes: 18,
          dislikes: 1,
          date: "2025-04-08",
          stats: {
            satisfaction: 95,
            quality: 82,
            service: 78,
            valueForMoney: 74
          }
        }
      ]
    },
    {
      lat: 37.5796,
      lng: 126.9770, 
      title: "광화문 피어몰",
      address: "서울특별시 종로구 율곡로 99",
      reviews: [
        {
          author: "박지민",
          rating: 4.2,
          text: "광화문 피어몰은 위치가 정말 좋아요. 접근성이 뛰어나고 다양한 상품을 구경할 수 있어서 좋았습니다. 직원분들도 친절하시고 매장 분위기도 좋았어요.",
          likes: 15,
          dislikes: 2,
          date: "2025-04-12",
          stats: {
            satisfaction: 84,
            quality: 68,
            service: 72,
            valueForMoney: 65
          }
        }
      ]
    },
    {
      lat: 37.5635,
      lng: 126.9845,
      title: "핸드메이드 액세서리",
      address: "서울시 용산구 이태원로 45-8",
      reviews: [
        {
          author: "최유진",
          rating: 4.5,
          text: "정성이 가득 담긴 액세서리들을 만나볼 수 있어요. 특히 귀걸이 컬렉션이 다양해서 좋았습니다. 직접 제작하시는 모습도 볼 수 있어 특별한 경험이었어요.",
          likes: 12,
          dislikes: 1,
          date: "2025-04-05",
          stats: {
            satisfaction: 90,
            quality: 85,
            service: 75,
            valueForMoney: 70
          }
        },
        {
          author: "이민수",
          rating: 4.3,
          text: "선물용으로 구매했는데 포장도 예쁘고 받는 사람이 매우 좋아했어요. 다만 가격이 조금 높은 편입니다.",
          likes: 8,
          dislikes: 2,
          date: "2025-03-28",
          stats: {
            satisfaction: 86,
            quality: 88,
            service: 79,
            valueForMoney: 62
          }
        }
      ]
    },
    {
      lat: 37.5115,
      lng: 127.0227,
      title: "건강한 식단",
      address: "서울시 강남구 테헤란로 152",
      reviews: [
        {
          author: "정다윤",
          rating: 4.8,
          text: "건강을 생각하는 식단이 정말 맛있어요! 칼로리와 영양소가 균형있게 구성되어 있어 다이어트 중에도 부담없이 즐길 수 있었습니다.",
          likes: 22,
          dislikes: 0,
          date: "2025-04-15",
          stats: {
            satisfaction: 96,
            quality: 92,
            service: 88,
            valueForMoney: 82
          }
        },
        {
          author: "한지훈",
          rating: 4.7,
          text: "매일 배송되는 신선한 식단이 일상의 활력소가 됩니다. 다양한 메뉴로 질리지 않고 건강하게 식사할 수 있어 좋습니다.",
          likes: 16,
          dislikes: 1,
          date: "2025-04-02",
          stats: {
            satisfaction: 94,
            quality: 90,
            service: 85,
            valueForMoney: 80
          }
        }
      ]
    },
    {
      lat: 37.5565,
      lng: 126.9340,
      title: "디자인 스튜디오",
      address: "서울시 마포구 양화로 45",
      reviews: [
        {
          author: "송태환",
          rating: 4.9,
          text: "전문적인 디자인 서비스에 매우 만족합니다. 요구사항을 정확히 이해하고 기대 이상의 결과물을 제공해 주셨어요.",
          likes: 31,
          dislikes: 0,
          date: "2025-04-14",
          stats: {
            satisfaction: 98,
            quality: 95,
            service: 92,
            valueForMoney: 88
          }
        }
      ]
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
            <button class="view-reviews text-sm text-blue-500 mt-1">리뷰 보기</button>
          </div>
        `)
        .on('popupopen', (e) => {
          // Find the button inside the popup and add click handler
          const button = document.querySelector('.view-reviews');
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
      setSelectedLocation(found);
    } else {
      alert('해당하는 피어몰을 찾을 수 없습니다.');
    }
  };

  // 컨트롤 위젯 토글
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <>
      <div className="relative w-full h-[400px] rounded-lg shadow-md overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-full"
          style={{backgroundColor: '#f5f5f5'}}
        />
        
        {/* 컨트롤 토글 버튼 */}
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
        
        {/* 지도 컨트롤 위젯 */}
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
        
        {/* 피어몰 표시 레이블 */}
        <div className="absolute bottom-4 left-4 z-[900] bg-white bg-opacity-80 px-3 py-1 rounded-md shadow-sm">
          <div className="flex items-center text-xs text-gray-700">
            <MapPin className="h-3 w-3 mr-1 text-red-500" />
            <span>표시된 피어몰: {locations.length}개</span>
          </div>
        </div>
      </div>

      <ReviewSection location={selectedLocation} />
    </>
  );
};

export default EcosystemMap;
