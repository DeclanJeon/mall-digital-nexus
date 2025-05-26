import React, { useState, useRef, useEffect, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/styles/ecosystemmap.css';
import { 
  Star, 
  ChevronUp, 
  ChevronDown, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Search, 
  X, 
  SatelliteIcon, 
  LocateFixed, 
  Navigation,
  ExternalLink,
  Heart,
  Users,
  Shield,
  Crown,
  Verified,
  Clock,
  Award,
  Zap,
  Eye,
  Filter,
  Layers,
  Settings,
  RefreshCw,
  Maximize2,
  Minimize2,
  TrendingUp,
  Calendar,
  Gift,
  Camera,
  Share2,
  Bookmark,
  Route,
  Navigation2
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Peermall } from '@/types/peermall';
import ReviewSection from './peermall-features/ReviewSection';
import { peermallStorage } from '@/services/storage/peermallStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DEFAULT_CENTER: [number, number] = [37.5665, 126.9780];

interface MapLocation {
  lat: number;
  lng: number;
  title: string;
  address: string;
  phone: string;
  reviews?: any[];
  id?: string;
  imageUrl?: string;
  rating?: number;
  followers?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
  description?: string;
  tags?: string[];
  trustScore?: number;
  responseTime?: string;
  isOnline?: boolean;
}

interface EcosystemMapProps {
  onLocationSelect?: (location: MapLocation) => void;
  isFullscreen?: boolean;
}

const EcosystemMap: React.FC<EcosystemMapProps> = ({ 
  onLocationSelect, 
  isFullscreen = false 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapType, setMapType] = useState('street');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [mapFullscreen, setMapFullscreen] = useState(isFullscreen);
  const [filterType, setFilterType] = useState<'all' | 'popular' | 'verified' | 'featured'>('all');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [availableHashtags, setAvailableHashtags] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Peermall 데이터를 MapLocation 타입으로 변환하는 헬퍼 함수
  const convertPeermallToMapLocation = (peermall: Peermall): MapLocation => {
    return {
      id: peermall.id,
      lat: peermall.location?.lat || DEFAULT_CENTER[0], 
      lng: peermall.location?.lng || DEFAULT_CENTER[1], 
      title: peermall.title,
      address: peermall.location?.address || '주소 정보 없음', 
      phone: peermall.phone || '전화번호 정보 없음', 
      imageUrl: peermall.imageUrl,
      rating: peermall.rating,
      description: peermall.description,
      tags: peermall.tags,
      // 기타 필드들은 필요에 따라 추가
    };
  };

  useEffect(() => {
    // peermallStorage에서 데이터 로드 및 리스너 등록
    const unsubscribe = peermallStorage.addEventListener(peermalls => {
      const mappedLocations = peermalls.map(convertPeermallToMapLocation);
      setLocations(mappedLocations);

      // 해시태그 업데이트
      const allTags = new Set<string>();
      peermalls.forEach(p => p.tags?.forEach(tag => allTags.add(tag)));
      setAvailableHashtags(allTags);
    });

    return () => {
      unsubscribe(); // 컴포넌트 언마운트 시 리스너 해제
    };
  }, []);

  // 🎯 프리미엄 마커 아이콘 생성 함수
  const createPremiumMarkerIcon = useCallback((location: MapLocation) => {
    const getMarkerClasses = () => {
      if (location.isFeatured) return 'premium-marker-featured';
      if (location.isPopular) return 'premium-marker-popular';
      if (location.isVerified) return 'premium-marker-verified';
      if ((location.rating || 0) >= 4.5) return 'premium-marker-excellent';
      return 'premium-marker-default';
    };

    const getMarkerEmoji = () => {
      if (location.isFeatured) return '👑';
      if (location.isPopular) return '🔥';
      if (location.isVerified) return '✓';
      return '🏪';
    };

    const size = location.isFeatured ? 48 : location.isPopular ? 42 : 36;
    const markerClass = getMarkerClasses();
    
    return L.divIcon({
      className: 'premium-marker-container',
      html: `
        <div class="relative">
          <div class="w-${size/4} h-${size/4} rounded-full ${markerClass} 
                      shadow-2xl border-4 border-white flex items-center justify-center
                      transform hover:scale-110 transition-all duration-300 cursor-pointer
                      animate-pulse">
            <div class="text-white font-bold text-xs">
              ${getMarkerEmoji()}
            </div>
          </div>
          ${location.isOnline ? `
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          ` : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size],
      popupAnchor: [0, -size]
    });
  }, []);

  // 🎨 팝업 생성 함수
  const createPremiumPopup = (location: MapLocation) => {
    const trustScore = location.trustScore || Math.floor((location.rating || 4.0) * 20);
    const responseTime = location.responseTime || '평균 5분';
    
    return `
      <div class="premium-popup-content w-80 p-0 overflow-hidden rounded-2xl shadow-2xl bg-white">
        <!-- 헤더 이미지 영역 -->
        <div class="relative h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 overflow-hidden">
          ${location.imageUrl ? `
            <img src="${location.imageUrl}" alt="${location.title}" 
                 class="w-full h-full object-cover opacity-90" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
          ` : `
            <div class="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center">
              <div class="text-6xl opacity-80">🏪</div>
            </div>
          `}
          
          <!-- 하단 정보 오버레이 -->
          <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 class="font-bold text-lg mb-1 truncate">${location.title}</h3>
            <div class="flex items-center gap-2 text-sm opacity-90">
              <div class="flex items-center gap-1">
                ${location.rating ? `
                  <span class="text-yellow-400">⭐</span>
                  <span>${location.rating.toFixed(1)}</span>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
        
        <!-- 콘텐츠 영역 -->
        <div class="p-4 space-y-4">
          <!-- 기본 정보 -->
          <div class="space-y-2">
            <div class="flex items-start gap-2 text-sm">
              <span class="text-gray-500">📍</span>
              <span class="text-gray-700 flex-1">${location.address}</span>
            </div>
            ${location.phone ? `
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-500">📞</span>
                <span class="text-gray-700">${location.phone}</span>
              </div>
            ` : ''}
            ${location.description ? `
              <div class="text-sm text-gray-600 line-clamp-2 mt-2">
                ${location.description}
              </div>
            ` : ''}
          </div>
          
          <!-- 태그 -->
          ${location.tags && location.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1">
              ${location.tags.slice(0, 3).map(tag => `
                <span class="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs border border-blue-200">
                  #${tag}
                </span>
              `).join('')}
              ${location.tags.length > 3 ? `
                <span class="bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-xs border border-gray-200">
                  +${location.tags.length - 3}
                </span>
              ` : ''}
            </div>
          ` : ''}
          
          <!-- 액션 버튼들 -->
          <div class="grid grid-cols-2 gap-2 pt-2">
            <button class="premium-popup-btn call-btn bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl">
              📞 통화하기
            </button>
            <button class="premium-popup-btn message-btn bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl">
              💬 메시지
            </button>
            <button class="premium-popup-btn visit-btn bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl">
              🏪 방문하기
            </button>
            <button class="premium-popup-btn share-btn bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl">
              📤 공유하기
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // 피어몰 데이터 로드 함수
  const loadPeermalls = useCallback(() => {
    setIsLoading(true);
    try {
      const peermalls = peermallStorage.getAll();
      
      const mappedLocations = peermalls
        .filter(peermall => peermall.lat && peermall.lng)
        .map(peermall => {
          const tags = peermall.tags || ['쇼핑', '서비스', '로컬'];
          return {
            id: peermall.id,
            lat: peermall.location?.lat ?? peermall.lat,
            lng: peermall.location?.lng ?? peermall.lng,
            title: peermall.title || '피어몰',
            address: peermall.location?.address ?? peermall.address ?? '주소 정보 없음',
            phone: (peermall as any).phone || '전화번호 없음',
            reviews: (peermall as any).reviews || [],
            imageUrl: peermall.imageUrl || `https://picsum.photos/400/300?random=${peermall.id}`,
            rating: peermall.rating || (Math.random() * 2 + 3),
            followers: peermall.followers || Math.floor(Math.random() * 1000) + 50,
            isPopular: peermall.featured || Math.random() > 0.7,
            isFeatured: peermall.recommended || Math.random() > 0.8,
            isVerified: peermall.certified || Math.random() > 0.6,
            description: peermall.description || '멋진 피어몰입니다. 다양한 제품과 서비스를 만나보세요!',
            tags: tags,
            trustScore: Math.floor(Math.random() * 20) + 80,
            responseTime: ['즉시', '5분 이내', '10분 이내', '30분 이내'][Math.floor(Math.random() * 4)],
            isOnline: Math.random() > 0.3
          };
        });
      
      setLocations(mappedLocations);
      
      // Extract all unique hashtags from all locations
      const allTags = new Set<string>();
      mappedLocations.forEach(location => {
        location.tags?.forEach(tag => allTags.add(tag));
      });
      setAvailableHashtags(allTags);
    } catch (error) {
      console.error('피어몰 데이터 로드 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadPeermalls();
    const removeListener = peermallStorage.addEventListener(loadPeermalls);
    return () => removeListener();
  }, [loadPeermalls]);

  // 지도 초기화
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: DEFAULT_CENTER,
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // 프리미엄 마커 업데이트
  useEffect(() => {
    if (!mapInstance.current) return;
    
    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    const filteredLocations = locations.filter(loc => {
      // Apply filter type
      const typeMatch = filterType === 'all' || 
        (filterType === 'popular' && loc.isPopular) ||
        (filterType === 'verified' && loc.isVerified) ||
        (filterType === 'featured' && loc.isFeatured);
      
      // Apply hashtag filter if selected
      const hashtagMatch = !selectedHashtag || loc.tags?.includes(selectedHashtag);
      
      return typeMatch && hashtagMatch;
    });

    filteredLocations.forEach(loc => {
      if (!loc.lat || !loc.lng) return;
      
      const marker = L.marker([loc.lat, loc.lng], { 
        icon: createPremiumMarkerIcon(loc) 
      }).addTo(mapInstance.current!);

      // const popup = L.popup({
      //   maxWidth: 320,
      //   minWidth: 300,
      //   className: 'premium-popup',
      //   closeButton: true,
      //   autoClose: false,
      //   closeOnEscapeKey: true
      // }).setContent(createPremiumPopup(loc));

      // marker.bindPopup(popup);
      
      marker.on('popupopen', (e) => {
        const popupElement = e.popup.getElement();
        if (!popupElement) return;

        const callBtn = popupElement.querySelector('.call-btn');
        const messageBtn = popupElement.querySelector('.message-btn');
        const visitBtn = popupElement.querySelector('.visit-btn');
        const shareBtn = popupElement.querySelector('.share-btn');
        const bookmarkBtn = popupElement.querySelector('.bookmark-btn');
        const directionsBtn = popupElement.querySelector('.directions-btn');
        const likeBtn = popupElement.querySelector('.like-btn');

        callBtn?.addEventListener('click', () => {
          console.log('통화하기:', loc.title);
        });

        messageBtn?.addEventListener('click', () => {
          console.log('메시지 보내기:', loc.title);
        });

        visitBtn?.addEventListener('click', () => {
          console.log('방문하기:', loc.title);
          if (loc.id) {
            window.open(`/space/${loc.id}`, '_blank');
          }
        });

        shareBtn?.addEventListener('click', () => {
          console.log('공유하기:', loc.title);
        });

        bookmarkBtn?.addEventListener('click', () => {
          console.log('북마크:', loc.title);
        });

        directionsBtn?.addEventListener('click', () => {
          const url = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;
          window.open(url, '_blank');
        });

        likeBtn?.addEventListener('click', () => {
          console.log('좋아요:', loc.title);
        });
      });
      
      marker.on('click', () => {
        mapInstance.current?.setView([loc.lat, loc.lng], 15);
        setSelectedLocation(loc);
        
        if (onLocationSelect) {
          onLocationSelect(loc);
        }
      });
    });
    
    if (filteredLocations.length === 1) {
      const loc = filteredLocations[0];
      mapInstance.current.setView([loc.lat, loc.lng], 15);
    } else if (filteredLocations.length > 1) {
      const bounds = L.latLngBounds(filteredLocations.map(loc => [loc.lat, loc.lng]));
      mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, filterType, onLocationSelect]);

  // 맵 타입 변경
  useEffect(() => {
    if (!mapInstance.current) return;

    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.TileLayer) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    if (mapType === 'street') {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    } else {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      }).addTo(mapInstance.current);
    }
  }, [mapType]);

  // 내 위치 찾기
  const findMyLocation = useCallback(() => {
    if (!mapInstance.current) return;
    
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const userLoc = { lat: latitude, lng: longitude };
      
      setUserLocation(userLoc);
      mapInstance.current?.flyTo([latitude, longitude], 15);
      
      mapInstance.current?.eachLayer(layer => {
        if (layer instanceof L.Marker && (layer.options as any).isUserLocation) {
          mapInstance.current?.removeLayer(layer);
        }
      });

      const userMarker = L.marker([latitude, longitude], {
        icon: L.divIcon({
          className: 'user-location-marker',
          html: `
            <div class="relative">
              <div class="w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
              <div class="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        }),
        ...{ isUserLocation: true } as any
      }).addTo(mapInstance.current!).bindPopup('📍 내 위치');
    };
    
    const handleError = (error: GeolocationPositionError) => {
      console.error('위치 정보 가져오기 실패:', error);
      alert('위치 정보를 가져올 수 없습니다.');
    };
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    }
  }, []);

  // 검색 기능
  const searchPeermall = useCallback(() => {
    if (!mapInstance.current || !searchQuery.trim()) return;
    
    const query = searchQuery.toLowerCase().trim();
    const foundLocations = locations.filter(loc => 
      loc.title.toLowerCase().includes(query) || 
      (loc.address && loc.address.toLowerCase().includes(query)) ||
      (loc.tags && loc.tags.some(tag => tag.toLowerCase().includes(query)))
    );
    
    if (foundLocations.length > 0) {
      if (foundLocations.length === 1) {
        const found = foundLocations[0];
        mapInstance.current.flyTo([found.lat, found.lng], 15);
        setSelectedLocation(found);
      } else {
        const bounds = L.latLngBounds(foundLocations.map(loc => [loc.lat, loc.lng]));
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
        setSelectedLocation(foundLocations[0]);
      }
    } else {
      alert('해당하는 피어몰을 찾을 수 없습니다.');
    }
  }, [searchQuery, locations]);

  const filteredCount = locations.filter(loc => {
    switch (filterType) {
      case 'popular': return loc.isPopular;
      case 'verified': return loc.isVerified;
      case 'featured': return loc.isFeatured;
      default: return true;
    }
  }).length;

  return (
    <div className={cn(
      "relative rounded-2xl overflow-hidden shadow-2xl",
      mapFullscreen ? "fixed inset-0 z-50" : "w-full h-[600px]"
    )}>
      
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100"
      />
      
      {/* 🎯 프리미엄 컨트롤 패널 */}
      <motion.div 
        className="absolute top-6 left-6 z-[1000] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 검색 바 */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchPeermall()}
              placeholder="피어몰, 태그, 주소 검색..."
              className="w-64 pl-10 pr-12 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/80 backdrop-blur-sm"
            />
            {searchQuery && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 h-7 w-7 p-0 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button
            onClick={searchPeermall}
            className="absolute right-1 top-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium shadow-lg transition-all"
          >
            검색
          </Button>
        </div>

        {/* 필터 버튼들 */}
        {/* <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { key: 'all', label: '전체', icon: '🌟', count: locations.length },
            { key: 'featured', label: '추천', icon: '👑', count: locations.filter(l => l.isFeatured).length },
            { key: 'popular', label: '인기', icon: '🔥', count: locations.filter(l => l.isPopular).length },
            { key: 'verified', label: '인증', icon: '✅', count: locations.filter(l => l.isVerified).length }
          ].map(filter => (
            <Button
              key={filter.key}
              variant={filterType === filter.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(filter.key as any)}
              className={cn(
                "text-xs font-medium transition-all duration-300",
                filterType === filter.key 
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg" 
                  : "bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300"
              )}
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
              <Badge variant="secondary" className="ml-1 text-xs bg-white/20">
                {filter.count}
              </Badge>
            </Button>
          ))}
        </div> */}

        {/* 지도 타입 및 도구 */}
        <div className="flex gap-2">
          <Button
            variant={mapType === 'street' ? 'default' : 'outline'}
            size="sm"
                onClick={() => setMapType('street')}
            className={cn(
              "flex-1 text-xs transition-all",
              mapType === 'street' 
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white" 
                : "bg-white/80 hover:bg-white"
            )}
          >
            <MapPin className="w-3 h-3 mr-1" />
            일반
          </Button>
          <Button
            variant={mapType === 'satellite' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMapType('satellite')}
            className={cn(
              "flex-1 text-xs transition-all",
              mapType === 'satellite' 
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white" 
                : "bg-white/80 hover:bg-white"
            )}
          >
            <SatelliteIcon className="w-3 h-3 mr-1" />
            위성
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={findMyLocation}
            className="bg-white/80 hover:bg-white border-gray-200 hover:border-orange-300 text-xs"
            title="내 위치 찾기"
          >
            <LocateFixed className="w-3 h-3" />
            내 위치
          </Button>
        </div>
      </motion.div>

      {/* 🎮 우측 상단 컨트롤 */}
      <motion.div 
        className="absolute top-6 right-6 z-[1000] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl p-3 shadow-xl hover:shadow-2xl transition-all duration-500"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapFullscreen(!mapFullscreen)}
            className="bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300 text-xs"
            title={mapFullscreen ? "일반 모드" : "전체화면"}
          >
            {mapFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadPeermalls}
            disabled={isLoading}
            className="bg-white/80 hover:bg-white border-gray-200 hover:border-green-300 text-xs"
            title="새로고침"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/80 hover:bg-white border-gray-200 hover:border-purple-300 text-xs"
            title="고급 필터"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* 📊 하단 통계 패널 */}
      <motion.div 
        className="absolute bottom-6 left-6 z-[1000] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                표시된 피어몰: {filteredCount}개
              </span>
              {selectedHashtag && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                  <span>#{selectedHashtag}</span>
                  <button 
                    onClick={() => setSelectedHashtag(null)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* <div className="w-px h-4 bg-gray-300"></div> */}
          
          {/* <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
              <span>추천 {locations.filter(l => l.isFeatured).length}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>인기 {locations.filter(l => l.isPopular).length}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>인증 {locations.filter(l => l.isVerified).length}</span>
            </div>
          </div> */}
        </div>
      </motion.div>

      {/* 🎨 고급 필터 패널 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="absolute top-24 right-6 z-[1000] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl p-4 shadow-xl hover:shadow-2xl transition-all duration-500 w-72"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">필터</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {/* 해시태그 필터 */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">해시태그</label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                    {Array.from(availableHashtags).map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSelectedHashtag(tag === selectedHashtag ? null : tag)}
                        className={`px-2.5 py-1 text-xs rounded-full border ${
                          tag === selectedHashtag 
                            ? 'bg-blue-100 border-blue-300 text-blue-700' 
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                    {availableHashtags.size === 0 && (
                      <div className="text-xs text-gray-400 py-1">사용 가능한 해시태그가 없습니다</div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-100 my-2"></div>
                {/* <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">평점 기준</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['전체', '4.0+', '4.5+', '5.0'].map(rating => (
                      <Button
                        key={rating}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white/80 hover:bg-white border-gray-200 hover:border-yellow-300"
                      >
                        <Star className="w-3 h-3 mr-1 text-yellow-500" />
                        {rating}
                      </Button>
                    ))}
                  </div>
                </div> */}
                
                {/* <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">거리 기준</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['전체', '1km', '3km', '5km'].map(distance => (
                      <Button
                        key={distance}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white/80 hover:bg-white border-gray-200 hover:border-blue-300"
                      >
                        <Navigation className="w-3 h-3 mr-1 text-blue-500" />
                        {distance}
                      </Button>
                    ))}
                  </div>
                </div> */}
                
                {/* <div>
                  <label className="text-xs font-medium text-gray-700 mb-2 block">운영 상태</label>
                  <div className="space-y-2">
                    {[
                      { key: 'online', label: '현재 온라인', icon: '🟢' },
                      { key: 'quick', label: '빠른 응답', icon: '⚡' },
                      { key: 'verified', label: '인증된 업체', icon: '✅' }
                    ].map(option => (
                      <Button
                        key={option.key}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs bg-white/80 hover:bg-white border-gray-200 hover:border-green-300"
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

       {/* 🎯 선택된 위치 상세 패널 */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            className="absolute bottom-6 right-6 z-[1000] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl p-5 shadow-2xl w-80 max-h-96 overflow-y-auto"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="space-y-4">
              {/* 헤더 */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{selectedLocation.title}</h3>
                    {selectedLocation.isOnline && (
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {/* {selectedLocation.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-semibold">{selectedLocation.rating.toFixed(1)}</span>
                      </div>
                    )} */}
                    {/* <div className="flex gap-1">
                      {selectedLocation.isFeatured && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                          👑 추천
                        </Badge>
                      )}
                      {selectedLocation.isVerified && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                          ✅ 인증
                        </Badge>
                      )}
                    </div> */}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLocation(null)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 이미지 */}
              {selectedLocation.imageUrl && (
                <div className="relative h-32 rounded-xl overflow-hidden">
                  <img 
                    src={selectedLocation.imageUrl} 
                    alt={selectedLocation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}

              {/* 정보 */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{selectedLocation.address}</span>
                </div>
                {/* {selectedLocation.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{selectedLocation.phone}</span>
                  </div>
                )} */}
                {selectedLocation.description && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {selectedLocation.description}
                  </p>
                )}
              </div>

              {/* 통계 */}
              {/* <div className="grid grid-cols-3 gap-3 py-3 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-blue-600 font-bold text-sm">
                    {selectedLocation.trustScore}%
                  </div>
                  <div className="text-xs text-gray-500">신뢰도</div>
                </div>
                <div className="text-center">
                  <div className="text-green-600 font-bold text-sm">
                    {selectedLocation.responseTime}
                  </div>
                  <div className="text-xs text-gray-500">응답시간</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-600 font-bold text-sm">
                    {selectedLocation.followers}
                  </div>
                  <div className="text-xs text-gray-500">팔로워</div>
                </div>
              </div> */}

              {/* 태그 */}
              {selectedLocation.tags && selectedLocation.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedLocation.tags.slice(0, 3).map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {selectedLocation.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600">
                      +{selectedLocation.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* 액션 버튼들 */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                  onClick={() => console.log('통화하기:', selectedLocation.title)}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  통화
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                  onClick={() => console.log('메시지:', selectedLocation.title)}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  메시지
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => {
                    if (selectedLocation.id) {
                      window.open(`/space/${selectedLocation.id}`, '_blank');
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-1 text-purple-600" />
                  방문하기
                </Button>
                {/* <Button
                  size="sm"
                  variant="outline"
                  className="border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
                    window.open(url, '_blank');
                  }}
                >
                  <Navigation className="w-4 h-4 mr-1 text-orange-600" />
                  길찾기
                </Button> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎨 로딩 오버레이 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-white/80 backdrop-blur-sm z-[2000] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse"></div>
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-2">지도 로딩 중...</p>
              <p className="text-sm text-gray-500">최고의 피어몰들을 찾고 있습니다</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EcosystemMap;