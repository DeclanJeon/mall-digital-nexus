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
  Navigation2,
  ChevronLeft,
  ChevronRight,
  Menu,
  Grid3X3,
  Sparkles,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Peermall } from '@/types/peermall';
import ReviewSection from '@/components/peermall-features/ReviewSection';
import { peermallStorage } from '@/services/storage/peermallStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import CallModal from '@/components/features/CallModal';
import MessageModal from '@/components/features/MessageModal';
import EnhancedMessageModal from '@/components/features/EnhancedMessageModal';
import { useAuth } from '@/hooks/useAuth';
import { getAllPeerMallList } from  "@/services/peerMallService";
import { useNavigate } from 'react-router-dom';
import { MapLocation } from '@/types/map';
import { LocationPopup } from '@/components/map/LocationPopup';

const DEFAULT_CENTER: [number, number] = [37.5665, 126.9780];

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
  const [showUnifiedPanel, setShowUnifiedPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedLocationForAction, setSelectedLocationForAction] = useState<MapLocation | null>(null);
  
  // 🚀 새로운 상태: 컨트롤 패널 표시/숨김
  const [showControlPanel, setShowControlPanel] = useState(false);

  const navigate = useNavigate();

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
      let backgroundColor = '#6366f1'; // Indigo-500
      let borderColor = '#4f46e5'; // Indigo-600
      let emoji = '🏪';
      let size = 40;
      let glowColor = '#6366f1';

      if (location.isFeatured) {
        backgroundColor = '#f59e0b'; // Amber-500
        borderColor = '#d97706'; // Amber-600
        emoji = '⭐';
        size = 52;
        glowColor = '#f59e0b';
      } else if (location.isPopular) {
        backgroundColor = '#ef4444'; // Red-500
        borderColor = '#dc2626'; // Red-600
        emoji = '🔥';
        size = 46;
        glowColor = '#ef4444';
      } else if (location.isVerified) {
        backgroundColor = '#10b981'; // Emerald-500
        borderColor = '#059669'; // Emerald-600
        emoji = '✅';
        size = 44;
        glowColor = '#10b981';
      }

      return { backgroundColor, borderColor, emoji, size, glowColor };
    };

    const style = getMarkerStyle();
    
    return L.divIcon({
      className: 'premium-marker-container',
      html: `
        <div style="position: relative; filter: drop-shadow(0 0 8px ${style.glowColor}40);">
          <div style="
            width: ${style.size}px;
            height: ${style.size}px;
            background: linear-gradient(135deg, ${style.backgroundColor}, ${style.borderColor});
            border-radius: 50%;
            border: 3px solid rgba(255,255,255,0.9);
            box-shadow: 
              0 8px 32px rgba(0,0,0,0.12),
              0 4px 16px rgba(0,0,0,0.08),
              inset 0 1px 0 rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${style.size * 0.35}px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          " 
          onmouseover="
            this.style.transform='scale(1.15) translateY(-2px)';
            this.style.boxShadow='0 12px 40px rgba(0,0,0,0.16), 0 6px 20px rgba(0,0,0,0.12)';
          " 
          onmouseout="
            this.style.transform='scale(1) translateY(0)';
            this.style.boxShadow='0 8px 32px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)';
          ">
            <div style="
              position: absolute;
              inset: 0;
              background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
              animation: shimmer 2s infinite;
            "></div>
            ${style.emoji}
          </div>
          ${location.isOnline ? `
            <div style="
              position: absolute;
              top: -3px;
              right: -3px;
              width: 14px;
              height: 14px;
              background: linear-gradient(135deg, #10b981, #059669);
              border-radius: 50%;
              border: 3px solid rgba(255,255,255,0.9);
              box-shadow: 0 2px 8px rgba(16,185,129,0.4);
            ">
              <div style="
                position: absolute;
                inset: 2px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse 2s infinite;
              "></div>
            </div>
          ` : ''}
        </div>
        <style>
          @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(200%) rotate(45deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(0.9); }
          }
        </style>
      `,
      iconSize: [style.size, style.size],
      iconAnchor: [style.size/2, style.size],
      popupAnchor: [0, -style.size]
    });
  }, []);

  // 피어몰 데이터 로드 함수
  const loadPeermalls = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const peermalls = await getAllPeerMallList();

      const mappedLocations = peermalls
        .filter(peermall => {
          const hasLocation = (peermall.lat && peermall.lng);
          
          if (!hasLocation) {
            
          }
          
          return hasLocation;
        })
        .map(peermall => {
          const lat = peermall.lat;
          const lng = peermall.lng;
          
          if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
            return null;
          }

          // 🚀 개선된 이메일 추출
          const extractedEmail = extractEmail(peermall);

          const tags = peermall.tags || ['쇼핑', '서비스', '로컬'];
          
          return {
            peerMallKey: peermall.peerMallKey,
            lat: lat,
            lng: lng,
            title: peermall.peerMallName,
            peerMallName: peermall.peerMallName || '피어몰',
            address: peermall.address ?? '주소 정보 없음',
            email: extractedEmail,
            phone: (peermall as any).contact || '전화번호 없음',
            imageUrl: peermall.imageLocation || `https://picsum.photos/400/300?random=${peermall.peerMallKey}`,
            description: peermall.description || '멋진 피어몰입니다. 다양한 제품과 서비스를 만나보세요!',
            owner: (peermall as any).ownerName || `${peermall.peerMallName} 운영자`,
          };
        })
        .filter(Boolean);
      
      const emailCount = mappedLocations.filter(loc => loc?.email).length;
      
      setLocations(mappedLocations as MapLocation[]);
      
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
      return;
    }
    
    // 기존 마커 제거
    mapInstance.current.eachLayer(layer => {
      if (layer instanceof L.Marker && !(layer.options as any).isUserLocation) {
        mapInstance.current?.removeLayer(layer);
      }
    });

    const filteredLocations = locations.filter(loc => {
      const hasValidCoords = loc.lat && loc.lng && 
                            !isNaN(Number(loc.lat)) && 
                            !isNaN(Number(loc.lng)) &&
                            Math.abs(Number(loc.lat)) <= 90 && 
                            Math.abs(Number(loc.lng)) <= 180;
      
      if (!hasValidCoords) {
        return false;
      }

      const typeMatch = filterType === 'all' || 
        (filterType === 'popular' && loc.isPopular) ||
        (filterType === 'verified' && loc.isVerified) ||
        (filterType === 'featured' && loc.isFeatured);
      
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
        
        marker.on('click', (e) => {
          e.originalEvent.stopPropagation()
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
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full border-4 border-white shadow-xl animate-pulse"></div>
              <div class="absolute inset-0 w-8 h-8 bg-blue-400 rounded-full animate-ping opacity-60"></div>
              <div class="absolute inset-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <div class="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
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
    setCallModalOpen(true);
    // const url = `https://peerterra.com/one/channel/${location.peerMallName}?mk=${location.peerMallKey}`;
    // window.open(url, '_blank');
  }, []);

  // 메시지 모달 열기 함수
  const handleOpenMessageModal = useCallback((location: MapLocation) => {
    // console.log('🚀 메시지 모달 열기:', {
    //   title: location.title,
    //   email: location.email,
    //   owner: location.owner,
    //   hasEmail: !!location.email
    // });
    
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
      "relative overflow-hidden",
      mapFullscreen ? "fixed inset-0 z-[1000] w-full" : "w-full",
      mapFullscreen ? "h-screen" : "h-full min-h-[400px]",
      "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    )}>
      
      {/* 🎨 메인 지도 컨테이너 */}
      <div 
        ref={mapRef} 
        className={cn(
          "w-full h-full relative",
          "rounded-2xl shadow-2xl border border-white/20",
          "bg-gradient-to-br from-blue-50 to-indigo-100"
        )}
        style={{
          filter: 'contrast(1.02) saturate(1.05)',
        }}
      />
      
      {/* 🌟 글로우 효과 오버레이 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/5 via-indigo-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-400/5 via-pink-400/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/2 to-transparent"></div>
      </div>

      {/* 🎯 초소형 토글 버튼 */}
      <motion.div 
        className="absolute top-3 left-3 z-[1000]"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ 
          duration: 0.6, 
          type: "spring", 
          stiffness: 200,
          delay: 0.1 
        }}
      >
        <Button
          onClick={() => setShowControlPanel(!showControlPanel)}
          className={cn(
            "w-8 h-8 rounded-lg relative overflow-hidden group",
            "bg-white/90 backdrop-blur-xl border border-white/40",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-300 ease-out",
            "hover:scale-110 active:scale-95"
          )}
        >
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {showControlPanel ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-3.5 w-3.5 text-slate-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Grid3X3 className="h-3.5 w-3.5 text-slate-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Button>
      </motion.div>

      {/* 🎨 초소형 컨트롤 패널 */}
      <AnimatePresence>
        {showControlPanel && (
          <motion.div 
            className={cn(
              "absolute top-3 left-14 z-[1000]",
              "bg-white/95 backdrop-blur-xl border border-white/50",
              "rounded-xl shadow-lg",
              "transition-all duration-400"
            )}
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              x: -20, 
              filter: "blur(5px)" 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0, 
              filter: "blur(0px)" 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              x: -20, 
              filter: "blur(5px)" 
            }}
            transition={{ 
              duration: 0.3, 
              type: "spring", 
              stiffness: 200
            }}
          >
            <div className="p-3 space-y-3 w-64">
              
              {/* 🔍 미니 검색 바 */}
              <div className="relative">
                <div className="flex items-center gap-1 p-1 bg-white/80 rounded-lg border border-slate-200/60">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchPeermall()}
                      placeholder="검색..."
                      className="w-full pl-6 pr-2 py-1.5 bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-xs"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 hover:bg-slate-100 rounded text-slate-400 flex items-center justify-center"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                  <Button
                    onClick={searchPeermall}
                    size="sm"
                    className="h-6 w-6 p-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded"
                  >
                    <Search className="h-2.5 w-2.5" />
                  </Button>
                </div>
              </div>

              {/* 🎛️ 지도 타입 미니 토글 */}
              <div className="flex gap-1 p-1 bg-slate-100/80 rounded-lg">
                <Button
                  variant={mapType === 'street' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMapType('street')}
                  className={cn(
                    "flex-1 h-6 text-xs font-medium",
                    mapType === 'street' 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-800 hover:bg-white/70"
                  )}
                >
                  <MapPin className="w-2.5 h-2.5 mr-1" />
                  지도
                </Button>
                <Button
                  variant={mapType === 'satellite' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setMapType('satellite')}
                  className={cn(
                    "flex-1 h-6 text-xs font-medium",
                    mapType === 'satellite' 
                      ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm" 
                      : "text-slate-600 hover:text-slate-800 hover:bg-white/70"
                  )}
                >
                  <SatelliteIcon className="w-2.5 h-2.5 mr-1" />
                  위성
                </Button>
              </div>

              {/* 🎮 미니 액션 버튼 그리드 */}
              <div className="grid grid-cols-4 gap-1">
                {[
                  {
                    icon: LocateFixed,
                    action: findMyLocation,
                    gradient: "from-orange-400 to-red-500",
                    title: "내 위치"
                  },
                  {
                    icon: RefreshCw,
                    action: loadPeermalls,
                    gradient: "from-green-400 to-emerald-500",
                    title: "새로고침",
                    loading: isLoading
                  },
                  {
                    icon: Filter,
                    action: () => setShowUnifiedPanel(!showUnifiedPanel),
                    gradient: "from-purple-400 to-pink-500",
                    title: "필터"
                  },
                  {
                    icon: mapFullscreen ? Minimize2 : Maximize2,
                    action: () => setMapFullscreen(!mapFullscreen),
                    gradient: "from-blue-400 to-cyan-500",
                    title: mapFullscreen ? "축소" : "전체"
                  }
                ].map((btn, index) => (
                  <motion.button
                    key={index}
                    onClick={btn.action}
                    disabled={btn.loading}
                    className={cn(
                      "w-full h-7 rounded-lg transition-all duration-200",
                      "bg-white/80 hover:bg-gradient-to-r",
                      `hover:${btn.gradient} hover:text-white`,
                      "border border-slate-200/60 hover:border-transparent",
                      "shadow-sm hover:shadow-md",
                      "flex items-center justify-center group"
                    )}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    title={btn.title}
                  >
                    <btn.icon className={cn(
                      "w-3 h-3 text-slate-600 group-hover:text-white transition-colors",
                      btn.loading && "animate-spin"
                    )} />
                  </motion.button>
                ))}
              </div>

              {/* 📊 미니 통계 */}
              <div className="flex items-center justify-between p-2 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-lg border border-indigo-200/40">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-slate-700">
                    피어몰 <span className="text-indigo-600">{filteredCount}</span>개
                  </span>
                </div>
                {selectedHashtag && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-2 py-0.5 rounded-md text-xs font-medium">
                    <span>#{selectedHashtag}</span>
                    <button 
                      onClick={() => setSelectedHashtag(null)}
                      className="text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🎛️ 초소형 고급 필터 패널 */}
      <AnimatePresence>
        {showUnifiedPanel && (
          <motion.div
            className={cn(
              "absolute top-3 right-3 z-[1000] w-60",
              "bg-white/95 backdrop-blur-xl border border-white/50",
              "rounded-xl shadow-lg"
            )}
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              x: 20, 
              filter: "blur(5px)" 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: 0, 
              filter: "blur(0px)" 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              x: 20, 
              filter: "blur(5px)" 
            }}
            transition={{ 
              duration: 0.3, 
              type: "spring", 
              stiffness: 200
            }}
          >
            <div className="p-3 space-y-3">
              {/* 헤더 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Filter className="h-3 w-3 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">필터</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUnifiedPanel(false)}
                  className="h-6 w-6 p-0 hover:bg-slate-100 rounded-lg"
                >
                  <X className="h-3 w-3 text-slate-400" />
                </Button>
              </div>
              
              {/* 필터 타입 선택 - 2x2 그리드 */}
              {/* <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Zap className="h-2.5 w-2.5 text-amber-500" />
                  카테고리
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { 
                      value: 'all', 
                      label: '전체', 
                      icon: '🌟', 
                      gradient: 'from-slate-400 to-slate-600'
                    },
                    { 
                      value: 'featured', 
                      label: '추천', 
                      icon: '⭐', 
                      gradient: 'from-amber-400 to-orange-500'
                    },
                    { 
                      value: 'popular', 
                      label: '인기', 
                      icon: '🔥', 
                      gradient: 'from-red-400 to-pink-500'
                    },
                    { 
                      value: 'verified', 
                      label: '인증', 
                      icon: '✅', 
                      gradient: 'from-emerald-400 to-green-500'
                    }
                  ].map(type => (
                    <motion.button
                      key={type.value}
                      onClick={() => setFilterType(type.value as any)}
                      className={cn(
                        "p-2 rounded-lg border transition-all duration-200",
                        "transform hover:scale-105 active:scale-95",
                        filterType === type.value
                          ? `bg-gradient-to-br ${type.gradient} text-white border-white/30 shadow-md scale-105`
                          : "bg-white/80 text-slate-700 border-slate-200/60 hover:border-slate-300/80 hover:bg-white"
                      )}
                      whileHover={{ y: -1 }}
                      whileTap={{ y: 0 }}
                    >
                      <div className="text-sm mb-0.5">{type.icon}</div>
                      <div className="text-xs font-semibold">{type.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div> */}
              
              {/* 해시태그 필터 - 컴팩트 */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 text-purple-500" />
                  태그 <span className="text-xs text-slate-500 font-normal">({availableHashtags.size})</span>
                </label>
                <div className="max-h-24 overflow-y-auto p-1.5 bg-slate-50/80 rounded-lg border border-slate-200/60">
                  <div className="flex flex-wrap gap-1">
                    {Array.from(availableHashtags).slice(0, 8).map(tag => (
                      <motion.button
                        key={tag}
                        onClick={() => setSelectedHashtag(tag === selectedHashtag ? null : tag)}
                        className={cn(
                          "px-2 py-1 text-xs rounded-md border font-medium",
                          "transition-all duration-200 transform hover:scale-105 active:scale-95",
                          tag === selectedHashtag 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-white/30 shadow-sm scale-105'
                            : 'bg-white/80 text-slate-700 border-slate-200/60 hover:border-indigo-300/80 hover:bg-indigo-50 hover:text-indigo-700'
                        )}
                        whileHover={{ y: -0.5 }}
                        whileTap={{ y: 0 }}
                      >
                        #{tag}
                      </motion.button>
                    ))}
                    {availableHashtags.size > 8 && (
                      <div className="px-2 py-1 text-xs text-slate-400 font-medium">
                        +{availableHashtags.size - 8}개
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 필터 리셋 버튼 */}
              <Button
                onClick={() => {
                  setFilterType('all');
                  setSelectedHashtag(null);
                }}
                variant="outline"
                className="w-full h-7 border-slate-200/60 bg-white/80 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 hover:border-transparent text-slate-700 font-medium text-xs"
              >
                <RefreshCw className="h-2.5 w-2.5 mr-1" />
                초기화
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 선택된 위치 상세 패널 */}
      <LocationPopup 
        selectedLocation={selectedLocationForAction}
        setSelectedLocation={setSelectedLocationForAction}
        isAuthenticated={isAuthenticated}
        handleOpenCallModal={handleOpenCallModal}
        handleOpenMessageModal={handleOpenMessageModal}
      />

      {/* ✨ 미니 로딩 오버레이 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 z-[2000] flex items-center justify-center bg-white/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, filter: "blur(5px)" }}
              animate={{ scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.3 }}
            >
              {/* 미니 스피너 */}
              <div className="relative mb-4">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 border-2 border-indigo-200 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 border-2 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-1 border-2 border-transparent border-r-purple-600 rounded-full animate-spin animate-reverse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                로딩 중...
              </h3>
              <p className="text-slate-600 text-sm font-medium">
                🚀 피어몰 검색 중
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📱 모바일 최적화 FAB - 더 작게 */}
      {/* <motion.div 
        className="absolute bottom-3 right-3 z-[1000] md:hidden"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button
          onClick={() => setShowControls(!showControls)}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95"
        >
          {showControls ? <ChevronUp className="h-5 w-5" /> : <Settings className="h-5 w-5" />}
        </Button>
      </motion.div> */}

      {/* 🎮 통화 모달 */}
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
        owner={selectedLocationForAction && selectedLocationForAction.owner} 
        peerMallKey={selectedLocationForAction && selectedLocationForAction.peerMallKey}      
      />

      {/* 💬 개선된 메시지 모달 */}
      {selectedLocationForAction && (
        <EnhancedMessageModal 
          messageModalOpen={messageModalOpen}
          setMessageModalOpen={setMessageModalOpen}
          owner={selectedLocationForAction.owner || '운영자'}
          title={selectedLocationForAction.title}
          email={selectedLocationForAction.email}
          displayImageUrl={selectedLocationForAction.imageUrl}
          imageError={false}
        />
      )}
    </div>
  );
});

export default React.memo(EcosystemMap);