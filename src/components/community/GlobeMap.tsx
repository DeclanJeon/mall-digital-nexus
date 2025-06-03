
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  Building2, 
  Calendar,
  FileImage,
  Home, 
  MessageSquare, 
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import CommunityCreationForm, { CommunityFormValues } from "@/components/community/CommunityCreationForm";
import SeasonalSystem from "@/components/community/SeasonalSystem";
import UserLocationFeatures from "@/components/community/UserLocationFeatures";
import SosResponseSystem from "@/components/community/SosResponseSystem";
import WeatherOverlay from "@/components/community/WeatherOverlay";
import MapControls from "@/components/community/MapControls";
import MapLegend from "@/components/community/MapLegend";
import CommunityInfoPanel from "@/components/community/CommunityInfoPanel";

import { fetchGlobalWeather, WeatherData as ServiceWeatherData, WeatherType } from "@/services/weatherService";
import { 
  loadCommunitiesFromLocalStorage, 
  saveCommunityToLocalStorage, 
  saveCommunitiesToLocalStorage,
  getUserJoinedCommunities,
  joinCommunity,
  leaveCommunity,
  loadCommunityEvents,
  saveCommunityEvent
} from "@/utils/storageUtils";
import { CommunityZone, LocationInfo, WeatherData, CommunityMapEvent } from "@/types/community";

// Fix Leaflet icon issues
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Required to fix Leaflet icon display issues
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Set default marker icon globally
L.Marker.prototype.options.icon = DefaultIcon;

// Sample community zone data
const communitySampleData: CommunityZone[] = [
  {
    id: "zone-1",
    name: "디지털 도시",
    type: "city",
    status: "normal",
    privacy: "public",
    owner: "PeerMall Official",
    memberCount: 12543,
    postCount: 45670,
    vitalityIndex: 92,
    position: { x: 25, y: 20 },
    lastActive: "방금 전",
    weather: "sunny",
    hasEvent: false,
    hasSosSignal: false
  },
  {
    id: "zone-2",
    name: "크리에이터 마을",
    type: "village",
    status: "growing",
    privacy: "public",
    owner: "아트몰",
    memberCount: 5431,
    postCount: 12450,
    vitalityIndex: 78,
    position: { x: 65, y: 35 },
    lastActive: "3분 전",
    weather: "cloudy",
    hasEvent: true,
    hasSosSignal: false
  },
  {
    id: "zone-3",
    name: "게임 커뮤니티",
    type: "zone",
    status: "normal",
    privacy: "partial",
    owner: "게이머스",
    memberCount: 8721,
    postCount: 31250,
    vitalityIndex: 85,
    position: { x: 42, y: 65 },
    lastActive: "8분 전",
    weather: "sunny",
    hasEvent: false,
    hasSosSignal: false
  },
  {
    id: "zone-4",
    name: "미니몰 타운",
    type: "city",
    status: "normal",
    privacy: "public",
    owner: "쇼핑몰 연합",
    memberCount: 9870,
    postCount: 28760,
    vitalityIndex: 87,
    position: { x: 75, y: 70 },
    lastActive: "12분 전",
    weather: "sunny",
    hasEvent: false,
    hasSosSignal: false
  },
  {
    id: "zone-5",
    name: "취미 모임",
    type: "village",
    status: "growing",
    privacy: "public",
    owner: "취미몰",
    memberCount: 3240,
    postCount: 9870,
    vitalityIndex: 72,
    position: { x: 18, y: 52 },
    lastActive: "15분 전",
    weather: "rainy",
    hasEvent: false,
    hasSosSignal: false
  },
  {
    id: "zone-6",
    name: "학습 구역",
    type: "zone",
    status: "crisis",
    privacy: "public",
    owner: "에듀몰",
    memberCount: 4320,
    postCount: 15430,
    vitalityIndex: 45,
    position: { x: 55, y: 18 },
    lastActive: "30분 전",
    weather: "cloudy",
    hasEvent: false,
    hasSosSignal: true
  },
  {
    id: "zone-7",
    name: "프라이빗 클럽",
    type: "zone",
    status: "normal",
    privacy: "private",
    owner: "VIP 그룹",
    memberCount: 234,
    postCount: 5670,
    vitalityIndex: 68,
    position: { x: 82, y: 42 },
    lastActive: "45분 전",
    weather: "sunny",
    hasEvent: false,
    hasSosSignal: false
  },
  {
    id: "zone-8",
    name: "윤서의 작업실",
    type: "personal",
    status: "growing",
    privacy: "public",
    owner: "윤서",
    memberCount: 87,
    postCount: 320,
    vitalityIndex: 62,
    position: { x: 35, y: 85 },
    lastActive: "2시간 전",
    weather: "foggy",
    hasEvent: false,
    hasSosSignal: false
  },
  {
    id: "zone-9",
    name: "유령 마을",
    type: "village",
    status: "abandoned",
    privacy: "public",
    owner: "미확인",
    memberCount: 12,
    postCount: 1450,
    vitalityIndex: 8,
    position: { x: 15, y: 15 },
    lastActive: "3달 전",
    weather: "foggy",
    hasEvent: false,
    hasSosSignal: false
  },
  {
    id: "zone-10",
    name: "특별 이벤트 존",
    type: "zone",
    status: "normal",
    privacy: "timed",
    owner: "이벤트 매니저",
    memberCount: 1532,
    postCount: 4230,
    vitalityIndex: 91,
    position: { x: 50, y: 50 },
    lastActive: "방금 전",
    weather: "sunny",
    hasEvent: true,
    hasSosSignal: false
  }
];

// Custom markers for different zone types - 메모이제이션으로 최적화
// Fix: Changed from React.memo to a regular function with useMemo inside the component
const createCustomMarker = (zone: CommunityZone) => {
  const size = zone.vitalityIndex > 80 ? 48 : 
               zone.vitalityIndex > 60 ? 40 : 
               zone.vitalityIndex > 40 ? 32 : 
               zone.vitalityIndex > 20 ? 24 : 20;
  
  // Choose color based on status
  let color = '#7E69AB'; // normal (default)
  if (zone.status === 'growing') color = '#4CAF50';
  if (zone.status === 'crisis') color = '#F44336';
  if (zone.status === 'abandoned') color = '#9E9E9E';
  
  // Get icon type
  let iconType = '';
  switch(zone.type) {
    case 'city': iconType = 'building'; break;
    case 'village': iconType = 'home'; break;
    case 'personal': iconType = 'user'; break;
    default: iconType = 'map-pin';
  }
  
  // Create icon content - either emoji if present, or default icon
  const iconContent = zone.emoji 
    ? `<div style="font-size: ${size/1.8}px;">${zone.emoji}</div>`
    : `<div style="color: white; font-size: ${size/2}px;">
        ${iconType === 'building' ? '🏙️' : iconType === 'home' ? '🏡' : iconType === 'user' ? '👤' : '📍'}
      </div>`;
  
  // 최적화된 애니메이션 설정 - 성능 개선
  const hasEventIndicator = zone.hasEvent 
    ? '<div style="position: absolute; top: -5px; right: -5px; width: 15px; height: 15px; background: yellow; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: black; font-weight: bold; font-size: 10px;">!</div>' 
    : '';
  
  const sosSignalIndicator = zone.hasSosSignal 
    ? '<div style="position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; background: red; border-radius: 50%; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' 
    : '';
  
  // Create custom icon HTML with simplified animations for better performance
  const iconHtml = `
    <div class="custom-marker" style="width: ${size}px; height: ${size}px; background-color: ${color}; border-radius: 50%; 
    display: flex; justify-content: center; align-items: center; box-shadow: 0 0 5px rgba(214, 188, 250, 0.4);">
      ${iconContent}
      ${hasEventIndicator}
      ${sosSignalIndicator}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: `custom-marker-${zone.status}`,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2]
  });
};

// Weather Effects Component - 성능 최적화
const MapWeatherEffects = React.memo(({ weather, temperature, windSpeed }: { weather: WeatherType, temperature?: number, windSpeed?: number }) => {
  const map = useMap();
  
  useEffect(() => {
    // 비나 안개 같은 고성능이 필요한 효과일 때만 렌더링
    if (weather !== 'rainy' && weather !== 'foggy') return;
    
    // Add weather effect CSS
    const style = document.createElement('style');
    document.head.appendChild(style);
    
    if (weather === 'rainy') {
      style.sheet?.insertRule(`
        @keyframes raindrop {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 0.7; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `, 0);
      
      // 비 효과 최적화: 빗방울 개수 줄이기
      const rainContainer = L.DomUtil.create('div', 'weather-effect rain');
      rainContainer.style.position = 'absolute';
      rainContainer.style.top = '0';
      rainContainer.style.left = '0';
      rainContainer.style.width = '100%';
      rainContainer.style.height = '100%';
      rainContainer.style.pointerEvents = 'none';
      rainContainer.style.zIndex = '400';
      
      // 빗방울 수를 줄이고 DOM 조작 최소화
      const fragment = document.createDocumentFragment();
      const dropCount = window.innerWidth < 768 ? 40 : 70; // 모바일에서는 더 적게
      
      for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.style.position = 'absolute';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.top = `${Math.random() * 100}%`;
        drop.style.width = '1px';
        drop.style.height = `${5 + Math.random() * 10}px`;
        drop.style.backgroundColor = 'rgba(156, 207, 255, 0.6)';
        drop.style.animation = `raindrop ${1 + Math.random() * 2}s linear ${Math.random() * 2}s infinite`;
        fragment.appendChild(drop);
      }
      
      rainContainer.appendChild(fragment);
      map.getContainer().appendChild(rainContainer);
      
      return () => {
        if (map.getContainer().contains(rainContainer)) {
          map.getContainer().removeChild(rainContainer);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
    
    if (weather === 'foggy') {
      const fogOverlay = L.DomUtil.create('div', 'weather-effect fog');
      fogOverlay.style.position = 'absolute';
      fogOverlay.style.top = '0';
      fogOverlay.style.left = '0';
      fogOverlay.style.width = '100%';
      fogOverlay.style.height = '100%';
      fogOverlay.style.backgroundColor = 'rgba(200, 200, 200, 0.4)';
      // 모바일 기기에서는 블러 효과 제거하여 성능 향상
      const isMobile = window.innerWidth < 768;
      fogOverlay.style.backdropFilter = isMobile ? 'none' : 'blur(2px)';
      fogOverlay.style.pointerEvents = 'none';
      fogOverlay.style.zIndex = '400';
      
      map.getContainer().appendChild(fogOverlay);
      return () => {
        if (map.getContainer().contains(fogOverlay)) {
          map.getContainer().removeChild(fogOverlay);
        }
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      };
    }
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [weather, map]);
  
  return null;
});

// Location Picker Component - 메모이제이션
const LocationPicker = React.memo(({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) => {
  const map = useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  
  return null;
});

const GlobeMap: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<CommunityZone | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherType>("sunny");
  const [mapReady, setMapReady] = useState(false);
  const [globalWeather, setGlobalWeather] = useState<Record<string, ServiceWeatherData>>({});
  const [communityZones, setCommunityZones] = useState<CommunityZone[]>([]);
  const [isCreationMode, setIsCreationMode] = useState(false);
  const [newCommunityLocation, setNewCommunityLocation] = useState<[number, number] | null>(null);
  const [isCreationDialogOpen, setIsCreationDialogOpen] = useState(false);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  
  // My Community and Events state
  const [showMyCommunitiesOnly, setShowMyCommunitiesOnly] = useState(false);
  const [showEventsOnly, setShowEventsOnly] = useState(false);
  const [events, setEvents] = useState<CommunityMapEvent[]>([]);
  const [isEventsDialogOpen, setIsEventsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CommunityMapEvent | null>(null);
  
  // New state for user location features and seasonal system
  const [nearbyCommunitiesIds, setNearbyCommunitiesIds] = useState<string[]>([]);
  const [showNearbyCommunities, setShowNearbyCommunities] = useState(false);
  const [currentDate] = useState<Date>(new Date("2025-05-16"));
  const [currentSeason, setCurrentSeason] = useState<string>("봄");
  const [userJoinedCommunities, setUserJoinedCommunities] = useState<string[]>([]);
  
  const mapRef = useRef<L.Map | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if any filters are applied
  const hasFiltersApplied = showMyCommunitiesOnly || showEventsOnly || showNearbyCommunities || searchQuery !== "";
  
  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setShowMyCommunitiesOnly(false);
    setShowEventsOnly(false);
    setShowNearbyCommunities(false);
    setSearchQuery("");
  }, []);
  
  // Toggle functions for filters
  const toggleMyCommunitiesFilter = useCallback(() => {
    setShowMyCommunitiesOnly(prev => !prev);
    
    // Reset nearby communities filter if it was active
    if (showNearbyCommunities) {
      setShowNearbyCommunities(false);
    }
  }, [showNearbyCommunities]);
  
  const toggleEventsFilter = useCallback(() => {
    setShowEventsOnly(prev => !prev);
    
    // Reset nearby communities filter if it was active
    if (showNearbyCommunities) {
      setShowNearbyCommunities(false);
    }
  }, [showNearbyCommunities]);
  
  const toggleNearbyCommunities = useCallback(() => {
    setShowNearbyCommunities(prev => !prev);
    
    // Reset other filters if they were active
    if (showMyCommunitiesOnly) {
      setShowMyCommunitiesOnly(false);
    }
    
    if (showEventsOnly) {
      setShowEventsOnly(false);
    }
  }, [showMyCommunitiesOnly, showEventsOnly]);
  
  // Join community function
  const handleJoinCommunity = useCallback((communityId: string) => {
    joinCommunity(communityId);
    
    // Update the community zones with the new membership status
    setCommunityZones(prevZones => 
      prevZones.map(zone => 
        zone.id === communityId ? { ...zone, isMember: true } : zone
      )
    );
    
    // Update user joined communities
    setUserJoinedCommunities(prev => [...prev, communityId]);
    
    toast({
      title: "커뮤니티 가입 완료",
      description: "선택한 커뮤니티에 가입되었습니다.",
    });
  }, [toast]);
  
  // Leave community function
  const handleLeaveCommunity = useCallback((communityId: string) => {
    leaveCommunity(communityId);
    
    // Update the community zones with the new membership status
    setCommunityZones(prevZones => 
      prevZones.map(zone => 
        zone.id === communityId ? { ...zone, isMember: false } : zone
      )
    );
    
    // Update user joined communities
    setUserJoinedCommunities(prev => prev.filter(id => id !== communityId));
    
    toast({
      title: "커뮤니티 탈퇴 완료",
      description: "선택한 커뮤니티에서 탈퇴했습니다.",
    });
  }, [toast]);
  
  // Handle SOS status change
  const handleSosStatusChange = useCallback((zoneId: string, hasSignal: boolean) => {
    setCommunityZones(prevZones => 
      prevZones.map(zone => 
        zone.id === zoneId ? { ...zone, hasSosSignal: hasSignal } : zone
      )
    );
    
    // Update community in localStorage
    const updatedZone = communityZones.find(zone => zone.id === zoneId);
    if (updatedZone) {
      saveCommunityToLocalStorage({
        ...updatedZone,
        hasSosSignal: hasSignal
      });
    }
  }, [communityZones]);
  
  // Handle season change
  const handleSeasonChange = useCallback((season: string) => {
    setCurrentSeason(season);
    toast({
      title: `계절 변경: ${season}`,
      description: `맵이 ${season} 스타일로 업데이트되었습니다.`,
    });
  }, [toast]);
  
  // Handle nearby communities found
  const handleNearbyCommunitiesFound = useCallback((communityIds: string[]) => {
    setNearbyCommunitiesIds(communityIds);
    
    if (communityIds.length > 0) {
      setShowNearbyCommunities(true);
      
      toast({
        title: "주변 커뮤니티 발견",
        description: `${communityIds.length}개의 주변 커뮤니티를 찾았습니다.`,
      });
    } else {
      toast({
        title: "주변 커뮤니티 없음",
        description: "현재 위치 주변에 커뮤니티가 없습니다.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  // Load communities from localStorage on component mount
  useEffect(() => {
    const loadCommunities = () => {
      const storedCommunities = loadCommunitiesFromLocalStorage();
      
      // If there are stored communities, use them; otherwise use sample data
      if (storedCommunities && storedCommunities.length > 0) {
        // Get user joined communities
        const joinedCommunityIds = getUserJoinedCommunities();
        setUserJoinedCommunities(joinedCommunityIds);
        
        // Mark communities that the user is a member of
        const communitiesWithMembershipInfo = storedCommunities.map(community => ({
          ...community,
          isMember: joinedCommunityIds.includes(community.id)
        }));
        
        setCommunityZones(communitiesWithMembershipInfo);
        toast({
          title: "커뮤니티 데이터 로드 완료",
          description: `${storedCommunities.length}개의 커뮤니티를 로드했습니다.`,
        });
      } else {
        // Initialize with sample data
        // Mark some communities as joined by the user (for demo purposes)
        const communitiesWithMembershipInfo = communitySampleData.map((community, index) => ({
          ...community,
          isMember: index < 3 // Mark first 3 communities as joined for demo
        }));
        
        setCommunityZones(communitiesWithMembershipInfo);
        
        // Save sample data to localStorage for future use, including membership info
        saveCommunitiesToLocalStorage(communitiesWithMembershipInfo);
        
        // Save the joined community IDs
        const joinedCommunityIds = communitiesWithMembershipInfo
          .filter(c => c.isMember)
          .map(c => c.id);
        localStorage.setItem('userJoinedCommunities', JSON.stringify(joinedCommunityIds));
        
        toast({
          title: "샘플 커뮤니티 데이터 초기화",
          description: "로컬 스토리지에 샘플 데이터가 저장되었습니다.",
        });
      }
    };
    
    loadCommunities();
    
    // Load community events
    const storedEvents = loadCommunityEvents();
    if (storedEvents && storedEvents.length > 0) {
      setEvents(storedEvents);
    } else {
      // Create sample events if none exist
      const sampleEvents = createSampleEvents();
      setEvents(sampleEvents);
      
      // Save sample events to localStorage
      sampleEvents.forEach(event => {
        saveCommunityEvent(event);
      });
    }
  }, [toast]);
  
  // Create sample events for demo
  const createSampleEvents = (): CommunityMapEvent[] => {
    return [
      {
        id: "event-1",
        communityId: "zone-2", // "크리에이터 마을"
        title: "디지털 창작 축제",
        description: "다양한 디지털 창작물을 공유하고 전시하는 축제입니다.",
        startDate: "2025-05-20",
        endDate: "2025-05-25",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
        attendeeCount: 238,
        isHighlighted: true
      },
      {
        id: "event-2",
        communityId: "zone-10", // "특별 이벤트 존"
        title: "봄맞이 플리마켓",
        description: "봄을 맞아 특별 상품을 판매하고 교환하는 플리마켓입니다.",
        startDate: "2025-05-18",
        endDate: "2025-05-19",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        attendeeCount: 156,
        isHighlighted: true
      },
      {
        id: "event-3",
        communityId: "zone-4", // "미니몰 타운"
        title: "온라인 쇼핑 페스티벌",
        description: "다양한 온라인 쇼핑몰의 특별 할인 이벤트입니다.",
        startDate: "2025-05-25",
        endDate: "2025-05-30",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        attendeeCount: 412,
        isHighlighted: false
      }
    ];
  };
  
  // Transform percentage positions to latitude and longitude for Leaflet - 메모이제이션
  const transformPosition = useMemo(() => 
    (zone: CommunityZone): [number, number] => {
      const lat = 90 - ((zone.position.y / 100) * 180);
      const lng = (zone.position.x / 100) * 360 - 180;
      return [lat, lng];
    }, []);
  
  // Transform latitude and longitude to percentage positions - 메모이제이션
  const transformToPercentage = useMemo(() => 
    (lat: number, lng: number) => {
      const y = ((90 - lat) / 180) * 100;
      const x = ((lng + 180) / 360) * 100;
      return { x, y };
    }, []);

  // 필터링 로직 메모이제이션
  const filteredZones = useMemo(() => 
    communityZones.filter(zone => {
      const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        zone.owner.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesMyCommunities = !showMyCommunitiesOnly || zone.isMember;
      
      const matchesEvents = !showEventsOnly || zone.hasEvent;
      
      const matchesNearby = !showNearbyCommunities || nearbyCommunitiesIds.includes(zone.id);
      
      return matchesSearch && matchesMyCommunities && matchesEvents && matchesNearby;
    }), [communityZones, searchQuery, showMyCommunitiesOnly, showEventsOnly, showNearbyCommunities, nearbyCommunitiesIds]);
  
  // Handle zone click
  const handleZoneClick = useCallback((zone: CommunityZone) => {
    if (isCreationMode) return;
    
    setSelectedZone(zone);
    if (zone.weatherData) {
      setCurrentWeather(zone.weatherData.weatherType);
    }
  }, [isCreationMode]);
  
  // Handle map click for community creation
  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    if (!isCreationMode) return;
    
    setNewCommunityLocation([lat, lng]);
    
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();
      
      if (data) {
        const locationData: LocationInfo = {
          country: data.address?.country,
          region: data.address?.state || data.address?.county,
          city: data.address?.city || data.address?.town || data.address?.village,
          district: data.address?.suburb || data.address?.neighbourhood,
          displayName: data.display_name,
        };
        
        setLocationInfo(locationData);
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      toast({
        title: "위치 정보 가져오기 실패",
        description: "위치 정보를 가져오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
    
    setIsCreationDialogOpen(true);
  }, [isCreationMode, toast]);
  
  // Start community creation mode
  const startCommunityCreation = useCallback(() => {
    setIsCreationMode(true);
    toast({
      title: "커뮤니티 생성 모드",
      description: "지도에서 커뮤니티를 생성할 위치를 클릭하세요.",
    });
  }, [toast]);
  
  // Cancel community creation mode
  const cancelCommunityCreation = useCallback(() => {
    setIsCreationMode(false);
    setNewCommunityLocation(null);
    setLocationInfo(null);
    setIsCreationDialogOpen(false);
  }, []);
  
  // Handle community creation form submission
  const handleCommunityCreate = useCallback((communityData: CommunityFormValues) => {
    if (!newCommunityLocation) return;
    
    const position = transformToPercentage(newCommunityLocation[0], newCommunityLocation[1]);
    
    const newId = `zone-${Date.now()}`;
    
    const newCommunity: CommunityZone = {
      id: newId,
      name: communityData.name,
      type: communityData.type,
      status: communityData.status,
      privacy: communityData.privacy,
      owner: communityData.owner,
      memberCount: communityData.memberCount,
      postCount: communityData.postCount,
      vitalityIndex: communityData.vitalityIndex,
      position,
      lastActive: communityData.lastActive,
      weather: communityData.weather,
      hasEvent: communityData.hasEvent,
      hasSosSignal: communityData.hasSosSignal,
      description: communityData.description,
      imageUrl: communityData.imageUrl,
      imageType: communityData.imageType,
      emoji: communityData.emoji,
      weatherData: undefined,
      locationInfo: locationInfo || undefined,
      isMember: true
    };
    
    setCommunityZones(prevZones => [...prevZones, newCommunity]);
    
    toast({
      title: "커뮤니티 생성 완료",
      description: `"${newCommunity.name}" 커뮤니티가 생성되었습니다.`
    });
    
    cancelCommunityCreation();
    
    setSelectedZone(newCommunity);

    saveCommunityToLocalStorage(newCommunity);
    
    setUserJoinedCommunities(prev => [...prev, newId]);
    joinCommunity(newId);
  }, [newCommunityLocation, locationInfo, transformToPercentage, toast, cancelCommunityCreation]);
  
  // Navigate to community page
  const navigateToCommunity = useCallback((zone: CommunityZone) => {
    localStorage.setItem('selectedCommunity', JSON.stringify(zone));
    navigate(`/community/${zone.id}`, { state: { community: zone } });
  }, [navigate]);
  
  // Fetch weather data for all zones
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        // 모바일에서는 날씨 데이터 요청 수 제한
        const isMobile = window.innerWidth < 768;
        const samplesToFetch = isMobile ? 
          communityZones.filter((_, idx) => idx % 3 === 0) : // 모바일에서는 3개 중 1개만
          communityZones;
        
        const weatherMap = await fetchGlobalWeather(samplesToFetch);
        setGlobalWeather(weatherMap);
        
        setCommunityZones(prevZones => 
          prevZones.map(zone => {
            const zoneWeatherData = weatherMap[zone.id];
            if (zoneWeatherData) {
              const weatherData: WeatherData = {
                temperature: zoneWeatherData.temperature,
                weatherType: zoneWeatherData.weatherType,
                humidity: zoneWeatherData.humidity,
                windSpeed: zoneWeatherData.windSpeed,
                cloudCover: zoneWeatherData.cloudCover,
                isDay: zoneWeatherData.isDay,
                precipitation: zoneWeatherData.precipitation,
                snowfall: zoneWeatherData.snowfall,
              };
              
              return {
                ...zone,
                weather: zoneWeatherData.weatherType,
                weatherData: weatherData
              };
            }
            return zone;
          })
        );
        
        toast({
          title: "날씨 정보 업데이트",
          description: "모든 커뮤니티 지역의 날씨 정보가 업데이트되었습니다.",
        });
      } catch (error) {
        console.error("Error loading weather data:", error);
        toast({
          title: "날씨 정보 로딩 실패",
          description: "날씨 데이터를 가져오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    };
    
    if (mapReady) {
      // 초기 로딩 시 지연 시작하여 맵 렌더링 성능 향상
      const timeoutId = setTimeout(() => {
        loadWeatherData();
      }, 2000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [mapReady, toast]);
  
  // 정기적인 날씨 업데이트 - 별도 효과로 분리하여 최적화
  useEffect(() => {
    if (!mapReady) return;
    
    const intervalId = setInterval(() => {
      // 활성 탭에서만 업데이트하도록 개선
      if (!document.hidden) {
        fetchGlobalWeather(communityZones).then(weatherMap => {
          setGlobalWeather(weatherMap);
        }).catch(console.error);
      }
    }, 60 * 60 * 1000); // 1시간으로 간격 늘림
    
    return () => clearInterval(intervalId);
  }, [mapReady, communityZones]);
  
  // Effect to ensure map is properly sized and rendered
  useEffect(() => {
    setTimeout(() => {
      setMapReady(true);
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);
  
  // Show event details and fly to community
  const showEventDetails = useCallback((event: CommunityMapEvent) => {
    setSelectedEvent(event);
    
    const eventCommunity = communityZones.find(zone => zone.id === event.communityId);
    if (eventCommunity) {
      setSelectedZone(eventCommunity);
      
      const coordinates = transformPosition(eventCommunity);
      
      if (mapRef.current) {
        mapRef.current.flyTo(coordinates, 5, {
          duration: 1.5
        });
      }
    }
  }, [communityZones, transformPosition]);
  
  // Function to set map reference when the map is ready
  const setMap = useCallback((map: L.Map) => {
    mapRef.current = map;
  }, []);

  // MapControl component to get map instance
  const MapControl = React.memo(() => {
    const map = useMap();
    
    useEffect(() => {
      setMap(map);
      
      // 맵 성능 최적화 옵션 설정
      if (map) {
        // 좀 더 부드러운 줌 설정
        map.options.wheelDebounceTime = 100;
        map.options.wheelPxPerZoomLevel = 120;
        
        // 렌더링 최적화 옵션
        map.options.preferCanvas = true;
      }
    }, [map]);
    
    return null;
  });
  
  // 마커 렌더링 로직 최적화 - 메모이제이션된 마커 컴포넌트
  const ZoneMarkers = React.memo(() => {
    return (
      <>
        {filteredZones.map(zone => (
          <Marker 
            key={zone.id} 
            position={transformPosition(zone)} 
            icon={createCustomMarker(zone)}
            eventHandlers={{
              click: () => handleZoneClick(zone)
            }}
          />
        ))}
      </>
    );
  });
  
  return (
    <div className="relative w-full h-full">
      {/* Map Container */}
      {mapReady && (
        <div className="map-wrapper h-full w-full">
          <MapContainer 
            center={[45, 0]} 
            zoom={3} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%", zIndex: 1, borderRadius: "0.5rem" }}
            zoomControl={false}
            attributionControl={false}
            className="h-full w-full"
            // 성능 최적화 옵션 추가
            preferCanvas={true}
            renderer={L.canvas()}
          >
            <MapControl />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              // 타일 로딩 최적화
              eventHandlers={{
                loading: () => console.log("Tiles loading..."),
                load: () => console.log("Tiles loaded")
              }}
            />
            
            {/* Seasonal System */}
            <SeasonalSystem 
              currentDate={currentDate} 
              onSeasonChange={handleSeasonChange} 
            />
            
            {/* Weather Effect - 모바일에서는 표시하지 않음 */}
            {window.innerWidth > 768 && selectedZone?.weatherData && (
              <WeatherOverlay 
                weather={selectedZone.weatherData.weatherType || currentWeather} 
                temperature={selectedZone.weatherData.temperature}
                windSpeed={selectedZone.weatherData.windSpeed}
              />
            )}
            
            {/* User Location Features */}
            <UserLocationFeatures 
              onNearbyCommunitiesFound={handleNearbyCommunitiesFound}
              communityZones={communityZones}
              searchRadius={200}
            />
            
            {/* SOS Response System */}
            <SosResponseSystem 
              selectedZone={selectedZone}
              communityZones={communityZones}
              onSosStatusChange={handleSosStatusChange}
              userJoinedCommunities={userJoinedCommunities}
            />
            
            {/* Add map weather effects - 모바일에서는 표시하지 않음 */}
            {window.innerWidth > 768 && (
              <MapWeatherEffects 
                weather={selectedZone?.weatherData?.weatherType || currentWeather} 
                temperature={selectedZone?.weatherData?.temperature}
                windSpeed={selectedZone?.weatherData?.windSpeed}
              />
            )}
            
            {/* Location picker for community creation */}
            {isCreationMode && <LocationPicker onLocationSelect={handleMapClick} />}
            
            {/* New community location marker */}
            {isCreationMode && newCommunityLocation && (
              <Marker position={newCommunityLocation} />
            )}
            
            {/* 최적화된 마커 렌더링 - 새 컴포넌트 사용 */}
            <ZoneMarkers />
          </MapContainer>
        </div>
      )}

      {/* Search and Controls Bar */}
      <MapControls 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showMyCommunitiesOnly={showMyCommunitiesOnly}
        toggleMyCommunitiesFilter={toggleMyCommunitiesFilter}
        showEventsOnly={showEventsOnly}
        toggleEventsFilter={toggleEventsFilter}
        showNearbyCommunities={showNearbyCommunities}
        toggleNearbyCommunities={toggleNearbyCommunities}
        nearbyCommunitiesIds={nearbyCommunitiesIds}
        isCreationMode={isCreationMode}
        startCommunityCreation={startCommunityCreation}
        cancelCommunityCreation={cancelCommunityCreation}
        hasFiltersApplied={hasFiltersApplied}
        clearAllFilters={clearAllFilters}
      />
      
      {/* Legend and Season Info */}
      <MapLegend 
        currentSeason={currentSeason}
        currentDate={currentDate}
      />

      {/* Zone Info Panel */}
      {selectedZone && (
        <CommunityInfoPanel 
          selectedZone={selectedZone}
          navigateToCommunity={navigateToCommunity}
          handleJoinCommunity={handleJoinCommunity}
          handleLeaveCommunity={handleLeaveCommunity}
          setSelectedZone={setSelectedZone}
          setIsEventsDialogOpen={setIsEventsDialogOpen}
        />
      )}
      
      {/* Community Creation Dialog */}
      <Dialog open={isCreationDialogOpen} onOpenChange={setIsCreationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 커뮤니티 생성</DialogTitle>
            <DialogDescription>
              선택하신 위치에 새 커뮤니티를 생성합니다. 아래 정보를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          
          {locationInfo && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-1">선택 위치 정보</h3>
              <p className="text-sm text-gray-600">{locationInfo.displayName}</p>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                {locationInfo.country && (
                  <div>
                    <span className="text-gray-500">국가:</span> {locationInfo.country}
                  </div>
                )}
                {locationInfo.region && (
                  <div>
                    <span className="text-gray-500">지역:</span> {locationInfo.region}
                  </div>
                )}
                {locationInfo.city && (
                  <div>
                    <span className="text-gray-500">도시:</span> {locationInfo.city}
                  </div>
                )}
                {locationInfo.district && (
                  <div>
                    <span className="text-gray-500">지구:</span> {locationInfo.district}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <CommunityCreationForm 
            onSubmit={handleCommunityCreate}
            onCancel={cancelCommunityCreation}
            locationInfo={locationInfo}
          />
        </DialogContent>
      </Dialog>
      
      {/* Events Dialog */}
      <Dialog open={isEventsDialogOpen} onOpenChange={setIsEventsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>진행중인 이벤트</DialogTitle>
            <DialogDescription>
              현재 진행 중인 커뮤니티 이벤트 목록입니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            {events.length > 0 ? (
              events.map(event => {
                const eventCommunity = communityZones.find(zone => zone.id === event.communityId);
                
                return (
                  <Card 
                    key={event.id} 
                    className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => showEventDetails(event)}
                  >
                    <div className="flex gap-4">
                      {event.imageUrl && (
                        <div className="w-24 h-24 min-w-[6rem] overflow-hidden rounded-md">
                          <img 
                            src={event.imageUrl} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          {event.isHighlighted && (
                            <Badge className="bg-yellow-400 text-yellow-900">주목</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{eventCommunity?.name || '알 수 없는 커뮤니티'}</p>
                        <p className="text-sm line-clamp-2">{event.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-xs text-gray-500">
                            {event.startDate} ~ {event.endDate}
                          </div>
                          {event.attendeeCount !== undefined && (
                            <div className="text-xs flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{event.attendeeCount}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-40" />
                <p>현재 진행 중인 이벤트가 없습니다.</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventsDialogOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(GlobeMap);
