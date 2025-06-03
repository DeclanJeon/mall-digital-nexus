import React, { useState, useEffect } from 'react';
import { Map, MapPin, Bell, Megaphone, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';

const RightSidebar = ({ 
  className = "",
  showLocationSection = true,
  showNotificationSection = false,
  showAlertSection = false,
  showSponsorSection = false,
  customSections = [] // 커스텀 섹션들
}) => {
  const { address } = useParams();
  const [config, setConfig] = useState(null);
  const [notificationsData, setNotificationsData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [sponsorsData, setSponsorsData] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);

  // 🎯 피어몰 설정 정보 로드
  useEffect(() => {
    const loadPeerMallData = async () => {
      if (!address) return;
      
      try {
        // localStorage에서 설정 정보 가져오기
        const savedConfig = localStorage.getItem(`peer_mall_config_${address}`);
        if (savedConfig) {
          const parsedConfig = JSON.parse(savedConfig);
          setConfig(parsedConfig);
        } else {
          // 기본 설정
          setConfig({
            peerMallName: '피어몰',
            location: null
          });
        }

        // 알림 데이터 로드
        if (showNotificationSection) {
          const notifications = await loadNotifications(address);
          setNotificationsData(notifications);
        }

        // 알림 데이터 로드
        if (showAlertSection) {
          const alerts = await loadAlerts(address);
          setAlertsData(alerts);
        }

        // 스폰서 데이터 로드
        if (showSponsorSection) {
          const sponsors = await loadSponsors(address);
          setSponsorsData(sponsors);
        }

      } catch (error) {
        console.error('피어몰 데이터 로드 실패:', error);
        setConfig({
          peerMallName: '피어몰',
          location: null
        });
      }
    };

    loadPeerMallData();
  }, [address, showNotificationSection, showAlertSection, showSponsorSection]);

  // 🎯 공지사항 데이터 로드
  const loadNotifications = async (address) => {
    try {
      // 실제 API 호출 또는 localStorage에서 로드
      const saved = localStorage.getItem(`peer_mall_notifications_${address}`);
      if (saved) {
        return JSON.parse(saved);
      }
      
      // 목업 데이터
      return [
        {
          id: 1,
          title: "새로운 제품이 출시되었습니다! 🎉",
          date: "2024-12-28",
          important: true
        },
        {
          id: 2,
          title: "연말 특가 이벤트 진행중",
          date: "2024-12-27",
          important: false
        },
        {
          id: 3,
          title: "배송 지연 안내",
          date: "2024-12-26",
          important: false
        }
      ];
    } catch (error) {
      console.error('공지사항 로드 실패:', error);
      return [];
    }
  };

  // 🎯 알림 데이터 로드
  const loadAlerts = async (address) => {
    try {
      const saved = localStorage.getItem(`peer_mall_alerts_${address}`);
      if (saved) {
        return JSON.parse(saved);
      }
      
      // 목업 데이터
      return [
        {
          id: 1,
          title: "새 주문이 들어왔어요!",
          message: "iPhone 15 Pro 주문이 접수되었습니다.",
          time: "5분 전",
          read: false
        },
        {
          id: 2,
          title: "리뷰가 등록되었어요",
          message: "MacBook Air에 5점 리뷰가 달렸습니다.",
          time: "1시간 전",
          read: false
        },
        {
          id: 3,
          title: "재고 부족 알림",
          message: "AirPods Pro 재고가 부족합니다.",
          time: "3시간 전",
          read: true
        }
      ];
    } catch (error) {
      console.error('알림 로드 실패:', error);
      return [];
    }
  };

  // 🎯 스폰서 데이터 로드
  const loadSponsors = async (address) => {
    try {
      const saved = localStorage.getItem(`peer_mall_sponsors_${address}`);
      if (saved) {
        return JSON.parse(saved);
      }
      
      // 목업 데이터
      return [
        {
          id: 1,
          title: "겨울 특가 세일",
          description: "최대 70% 할인 혜택",
          imageUrl: "https://via.placeholder.com/300x120/3B82F6/FFFFFF?text=Winter+Sale"
        },
        {
          id: 2,
          title: "신제품 출시",
          description: "혁신적인 기술의 만남",
          imageUrl: "https://via.placeholder.com/300x120/10B981/FFFFFF?text=New+Product"
        }
      ];
    } catch (error) {
      console.error('스폰서 로드 실패:', error);
      return [];
    }
  };

  // 🎯 지도 열기
  const handleOpenMap = () => {
    if (!config?.location) {
      toast({
        title: '위치 정보 없음 📍',
        description: '등록된 위치 정보가 없어요.',
        variant: 'destructive'
      });
      return;
    }

    // 지도 모달 열기 이벤트
    window.dispatchEvent(new CustomEvent('openMapModal', {
      detail: { 
        location: config.location,
        peerMallName: config.peerMallName 
      }
    }));
  };

  // 🎯 Google Maps로 열기
  const handleOpenGoogleMaps = () => {
    if (!config?.location || typeof config.location === 'string') {
      toast({
        title: '위치 정보 없음 📍',
        description: '등록된 위치 정보가 없어요.',
        variant: 'destructive'
      });
      return;
    }

    const { lat, lng } = config.location;
    const googleMapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  // 🎯 좌표 복사
  const handleCopyCoordinates = async () => {
    if (!config?.location || typeof config.location === 'string') {
      toast({
        title: '위치 정보 없음 📍',
        description: '등록된 위치 정보가 없어요.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const coordinates = `${config.location.lat}, ${config.location.lng}`;
      await navigator.clipboard.writeText(coordinates);
      toast({
        title: '좌표 복사 완료! 📋',
        description: '클립보드에 좌표가 복사되었어요.',
      });
    } catch (error) {
      console.error('좌표 복사 실패:', error);
      toast({
        title: '복사 실패 😅',
        description: '다시 시도해주세요.',
        variant: 'destructive'
      });
    }
  };

  // 🎯 공지사항 전체 보기
  const handleViewAllNotifications = () => {
    window.dispatchEvent(new CustomEvent('viewAllNotifications', {
      detail: { address }
    }));
  };

  // 로딩 중이면 스켈레톤 표시
  if (!config) {
    return (
      <div className={`w-80 flex-shrink-0 ${className}`}>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
          <div className="p-4 border-b">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="p-4 space-y-3">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-16 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 flex-shrink-0 ${className}`}>
      {/* 공지사항 섹션 */}
      {/* {showNotificationSection && notificationsData.length > 0 && (
        <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              <h3 className="font-bold text-lg">공지사항</h3>
            </div>
          </div>
          <div className="p-4">
            {notificationsData.slice(0, 3).map(notice => (
              <div 
                key={notice.id} 
                className={`p-3 mb-2 last:mb-0 rounded-lg cursor-pointer transition-all duration-200 ${
                  notice.important 
                    ? 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100' 
                    : 'bg-gray-50 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                <h4 className="font-medium text-sm">{notice.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
              </div>
            ))}
            
            <Button 
              variant="link" 
              className="w-full mt-2 text-blue-600 hover:text-blue-700"
              onClick={handleViewAllNotifications}
            >
              모든 공지 보기
            </Button>
          </div>
        </div>
      )} */}
      
      {/* 알림 섹션 */}
      {/* {showAlertSection && alertsData.length > 0 && (
        <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h3 className="font-bold text-lg">최근 알림</h3>
            </div>
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
              {alertsData.filter(a => !a.read).length}
            </Badge>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {alertsData.slice(0, 3).map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 bg-gray-50 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm ${
                    alert.read ? 'border-gray-300' : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    {!alert.read && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}
      
      {/* 스폰서 섹션 */}
      {/* {showSponsorSection && sponsorsData.length > 0 && (
        <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <h3 className="font-bold text-lg">스폰서</h3>
            </div>
          </div>
          <div className="p-4">
            {sponsorsData.map(sponsor => (
              <div key={sponsor.id} className="mb-4 last:mb-0 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
                <div className="h-32 overflow-hidden">
                  <img 
                    src={sponsor.imageUrl} 
                    alt={sponsor.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm">{sponsor.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{sponsor.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* 커스텀 섹션들 */}
      {/* {customSections.map((section, index) => (
        <div key={`custom-${index}`} className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              {section.icon && <section.icon className="w-5 h-5" />}
              <h3 className="font-bold text-lg">{section.title}</h3>
            </div>
          </div>
          <div className="p-4">
            {section.content}
          </div>
        </div>
      ))} */}
      
      {/* 위치 섹션 */}
      {showLocationSection && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <h3 className="font-bold text-lg">위치</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="bg-gray-100 rounded-lg overflow-hidden h-48 relative mb-3 group">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Button 
                  onClick={handleOpenMap} 
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-md border border-blue-200 transition-all duration-200"
                >
                  <Map className="w-4 h-4 mr-2" />
                  지도 보기
                </Button>
              </div>
              <div 
                className="absolute inset-0 opacity-60 cursor-pointer hover:opacity-40 transition-opacity duration-200" 
                onClick={handleOpenMap}
              >
                {/* 배경 패턴 */}
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100"></div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    {config.location && typeof config.location !== 'string' 
                      ? config.location.address 
                      : '위치 정보 없음'
                    }
                  </p>
                  {config.location && typeof config.location !== 'string' && (
                    <>
                      <p className="text-xs text-gray-500 mt-1">
                        좌표: {config.location.lat.toFixed(6)}, {config.location.lng.toFixed(6)}
                      </p>
                      
                      {/* 추가 액션 버튼들 */}
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs hover:bg-blue-50 hover:border-blue-300"
                          onClick={handleOpenGoogleMaps}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Google Maps
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs hover:bg-green-50 hover:border-green-300"
                          onClick={handleCopyCoordinates}
                        >
                          📋 좌표 복사
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;