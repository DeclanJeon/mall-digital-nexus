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
import CallModal from '@/components/features/CallModal';
import MessageModal from '@/components/features/MessageModal';
import EnhancedMessageModal from './features/EnhancedMessageModal';
import { useAuth } from '@/hooks/useAuth';
import { getAllPeerMallList } from  "@/services/peerMallService";

const DEFAULT_CENTER: [number, number] = [37.5665, 126.9780];

interface MapLocation {
  isFamilyCertified: unknown;
  certified: unknown;
  premiumStats: unknown;
  lat: number;
  lng: number;
  title: string;
  address: string;
  phone: string;
  reviews?: any[];
  id?: string;
  email?: string;
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
  owner?: string;
  peerMallName?: string;
  peerMallKey?: string;
}

interface EcosystemMapProps {
  onLocationSelect?: (location: MapLocation) => void;
  isFullscreen?: boolean;
}

const EcosystemMap: React.FC<EcosystemMapProps> = React.memo(({ 
  onLocationSelect, 
  isFullscreen = false 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { isAuthenticated } = useAuth();
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
  
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedLocationForAction, setSelectedLocationForAction] = useState<MapLocation | null>(null);

  // 🚀 이메일 유효성 검증 함수
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 🚀 스마트 이메일 추출 함수
  const extractEmail = (peermall: any): string | undefined => {
    const possibleEmails = [
      peermall.email,
      peermall.contactEmail,
      peermall.ownerEmail,
      peermall.businessEmail,
      peermall.adminEmail
    ];
    
    // contact 필드에서 이메일 패턴 찾기
    if (peermall.contact && typeof peermall.contact === 'string' && peermall.contact.includes('@')) {
      possibleEmails.push(peermall.contact);
    }
    
    // 첫 번째 유효한 이메일 반환
    for (const email of possibleEmails) {
      if (email && typeof email === 'string' && isValidEmail(email.trim())) {
        return email.trim();
      }
    }
    
    return undefined;
  };

  // 프리미엄 마커 아이콘 생성 함수
  const createPremiumMarkerIcon = useCallback((location: MapLocation) => {
    const getMarkerStyle = () => {
      let backgroundColor = '#3B82F6'; // 기본 파란색
      let borderColor = '#1E40AF';
      let emoji = '🏪';
      let size = 36;

      if (location.isFeatured) {
        backgroundColor = '#F59E0B';
        borderColor = '#D97706';
        emoji = '⭐';
        size = 48;
      } else if (location.isPopular) {
        backgroundColor = '#EF4444';
        borderColor = '#DC2626';
        emoji = '🔥';
        size = 42;
      } else if (location.isVerified) {
        backgroundColor = '#10B981';
        borderColor = '#059669';
        emoji = '✅';
        size = 40;
      }

      return { backgroundColor, borderColor, emoji, size };
    };

    const style = getMarkerStyle();
    
    return L.divIcon({
      className: 'premium-marker-container',
      html: `
        <div style="position: relative;">
          <div style="
            width: ${style.size}px;
            height: ${style.size}px;
            background: linear-gradient(135deg, ${style.backgroundColor}, ${style.borderColor});
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${style.size * 0.4}px;
            cursor: pointer;
            transition: transform 0.3s ease;
          " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
            ${style.emoji}
          </div>
          ${location.isOnline ? `
            <div style="
              position: absolute;
              top: -2px;
              right: -2px;
              width: 12px;
              height: 12px;
              background: #10B981;
              border-radius: 50%;
              border: 2px solid white;
              animation: pulse 2s infinite;
            "></div>
          ` : ''}
        </div>
      `,
      iconSize: [style.size, style.size],
      iconAnchor: [style.size/2, style.size],
      popupAnchor: [0, -style.size]
    });
  }, []);

  // 팝업 생성 함수
  const createPremiumPopup = useCallback((location: MapLocation) => {
    const trustScore = location.trustScore || Math.floor((location.rating || 4.0) * 20);
    const responseTime = location.responseTime || '5';
    
    return `
      <div class="premium-popup-content w-80 h-[500px] p-0 overflow-hidden rounded-2xl shadow-2xl bg-white">
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
            ${location.email ? `
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-500">📧</span>
                <span class="text-gray-700">${location.email}</span>
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
  }, []);

  // 피어몰 데이터 로드 함수
  const loadPeermalls = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const peermalls = await getAllPeerMallList();
      console.log('원본 피어몰 데이터:', peermalls);

      const mappedLocations = peermalls
        .filter(peermall => {
          const hasLocation = (peermall.lat && peermall.lng);
          
          if (!hasLocation) {
            console.warn('위치 정보 없는 피어몰:', peermall.peerMallName || peermall.peerMallKey);
          }
          
          return hasLocation;
        })
        .map(peermall => {
          const lat = peermall.lat;
          const lng = peermall.lng;
          
          if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
            console.warn('잘못된 좌표:', { title: peermall.peerMallName, lat, lng });
            return null;
          }

          // 🚀 개선된 이메일 추출
          const extractedEmail = extractEmail(peermall);
          
          // 🚀 이메일 정보 로깅
          if (extractedEmail) {
            console.log(`📧 ${peermall.peerMallName} 이메일:`, extractedEmail);
          }

          const tags = peermall.tags || ['쇼핑', '서비스', '로컬'];
          
          return {
            peerMallKey: peermall.peerMallKey,
            lat: lat,
            lng: lng,
            peerMallName: peermall.peerMallName || '피어몰',
            address: peermall.address ?? '주소 정보 없음',
            email: extractedEmail, // 🚀 개선된 이메일 추출 사용
            phone: (peermall as any).contact || '전화번호 없음',
            imageUrl: peermall.imageLocation || `https://picsum.photos/400/300?random=${peermall.peerMallKey}`,
            description: peermall.description || '멋진 피어몰입니다. 다양한 제품과 서비스를 만나보세요!',
            owner: (peermall as any).ownerName || `${peermall.peerMallName} 운영자`,
          };
        })
        .filter(Boolean);
      
      console.log('매핑된 위치 데이터:', mappedLocations);
      
      // 🚀 이메일 통계 로깅
      const emailCount = mappedLocations.filter(loc => loc?.email).length;
      console.log(`📊 이메일 정보가 있는 피어몰: ${emailCount}/${mappedLocations.length}개`);
      
      setLocations(mappedLocations as MapLocation[]);
      
      // Extract all unique hashtags from all locations
      const allTags = new Set<string>();
      mappedLocations.forEach(location => {
        location?.tags?.forEach(tag => allTags.add(tag));
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
    if (!mapInstance.current || locations.length === 0) {
      console.log('지도 인스턴스 또는 위치 데이터 없음:', { 
        hasMap: !!mapInstance.current, 
        locationCount: locations.length 
      });
      return;
    }
    
    console.log('마커 업데이트 시작:', locations);
    
    // 기존 마커 제거
    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.Marker && !(layer.options as any).isUserLocation) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    const filteredLocations = locations.filter(loc => {
      // 위치 데이터 유효성 검사 강화
      const hasValidCoords = loc.lat && loc.lng && 
                            !isNaN(Number(loc.lat)) && 
                            !isNaN(Number(loc.lng)) &&
                            Math.abs(Number(loc.lat)) <= 90 && 
                            Math.abs(Number(loc.lng)) <= 180;
      
      if (!hasValidCoords) {
        console.warn('잘못된 좌표 데이터:', loc);
        return false;
      }

      // Apply filter type
      const typeMatch = filterType === 'all' || 
        (filterType === 'popular' && loc.isPopular) ||
        (filterType === 'verified' && loc.isVerified) ||
        (filterType === 'featured' && loc.isFeatured);
      
      // Apply hashtag filter if selected
      const hashtagMatch = !selectedHashtag || loc.tags?.includes(selectedHashtag);
      
      return typeMatch && hashtagMatch;
    });

    // 마커 추가
    filteredLocations.forEach((loc, index) => {
      try {
        const lat = Number(loc.lat);
        const lng = Number(loc.lng);
        
        const marker = L.marker([lat, lng], { 
          icon: createPremiumMarkerIcon(loc) 
        });

        marker.addTo(mapInstance.current!);
        
        // 클릭 이벤트 추가
        marker.on('click', () => {
          console.log('마커 클릭됨:', loc.title, '이메일:', loc.email);
          mapInstance.current?.setView([lat, lng], 15);
          setSelectedLocation(loc);
          setSelectedLocationForAction(loc);
          
          if (onLocationSelect) {
            onLocationSelect(loc);
          }
        });
      } catch (error) {
        console.error(`마커 추가 실패 (${loc.title}):`, error);
      }
    });
  
    // 지도 뷰 조정
    if (filteredLocations.length === 1) {
      const loc = filteredLocations[0];
      mapInstance.current.setView([Number(loc.lat), Number(loc.lng)], 15);
    } else if (filteredLocations.length > 1) {
      try {
        const bounds = L.latLngBounds(
          filteredLocations.map(loc => [Number(loc.lat), Number(loc.lng)])
        );
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error('지도 경계 설정 실패:', error);
      }
    }
  }, [locations, filterType, selectedHashtag, onLocationSelect, createPremiumMarkerIcon]);

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

  // 통화 모달 열기 함수
  const handleOpenCallModal = useCallback((location: MapLocation) => {
    setSelectedLocationForAction(location);
    const url = `https://peerterra.com/one/channel/${location.peerMallName}?mk=${location.peerMallKey}`;
    window.open(url, '_blank');
    //setCallModalOpen(true);
  }, []);

  // 🚀 메시지 모달 열기 함수 (디버깅 강화)
  const handleOpenMessageModal = useCallback((location: MapLocation) => {
    console.log('🚀 메시지 모달 열기:', {
      title: location.title,
      email: location.email,
      owner: location.owner,
      hasEmail: !!location.email
    });
    
    setSelectedLocationForAction(location);
    setMessageModalOpen(true);
  }, []);

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
      "relative rounded-2xl overflow-hidden shadow-2xl z-[1]",
      mapFullscreen ? "fixed inset-0 z-[1000] w-full" : "w-100",
      mapFullscreen ? "h-screen" : "h-full min-h-[250px]"
    )}>
      
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100"
      />
      
      {/* 프리미엄 컨트롤 패널 */}
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
            지도뷰
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
            위성뷰
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

      {/* 우측 상단 컨트롤 */}
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

      {/* 하단 통계 패널 */}
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
        </div>
      </motion.div>

      {/* 고급 필터 패널 */}
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 개선된 선택된 위치 상세 패널 */}
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
                    {/* 🚀 이메일 연동 가능 여부 표시 */}
                    {selectedLocation.email && (
                      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                        📧 이메일 연동 가능
                      </Badge>
                    )}
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

              {/* 🚀 개선된 정보 섹션 */}
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{selectedLocation.address}</span>
                </div>
                
                {/* 🚀 이메일 정보 표시 */}
                {selectedLocation.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">📧</span>
                    <span className="text-gray-700 text-xs">{selectedLocation.email}</span>
                  </div>
                )}
                
                {selectedLocation.description && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {selectedLocation.description}
                  </p>
                )}
              </div>

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
                {isAuthenticated && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                    onClick={() => handleOpenCallModal(selectedLocation)}
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    통화
                  </Button>
                )}
                
                {isAuthenticated && (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                    onClick={() => handleOpenMessageModal(selectedLocation)}
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    메시지
                  </Button>
                )}
                
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
                
                <Button
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
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 로딩 오버레이 */}
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

      {/* 통화 모달 */}
      <CallModal
        open={callModalOpen}
        onOpenChange={setCallModalOpen}
        location={selectedLocationForAction || {
          title: '',
          owner: '',
          phone: '',
          imageUrl: '',
          trustScore: 0,
          responseTime: '',
          isOnline: false
        }} 
        owner={''} 
        peerMallKey={''}      
      />

      {/* 🚀 개선된 메시지 모달 */}
      {selectedLocationForAction && (
        <EnhancedMessageModal 
          messageModalOpen={messageModalOpen}
          setMessageModalOpen={setMessageModalOpen}
          owner={selectedLocationForAction.owner || '운영자'}
          title={selectedLocationForAction.title}
          email={selectedLocationForAction.email} // 🚀 이메일 정보 전달
          displayImageUrl={selectedLocationForAction.imageUrl}
          imageError={false}
        />
      )}
    </div>
  );
});

export default React.memo(EcosystemMap);
    