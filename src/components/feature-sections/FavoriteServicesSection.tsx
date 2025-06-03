import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { Plus, ExternalLink, Globe, Clock, ArrowRight, Loader2, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // 버튼 컴포넌트 추가
import AddServiceModal from './AddServiceModal';

// Swiper 스타일
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { getMyFavoriteService, registerMyFavoriteService } from '@/services/peerMallService';

interface FavoriteService {
  id: number;
  name: string;
  link: string;
  iconUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  domain?: string;
  isInternal?: boolean;
  usageCount?: number;
  lastUsed?: Date;
  addedAt?: Date;
  ogData?: OpenGraphData;
  og_image?: string;
  serviceLink: string;
  serviceName: string;
}

interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  type?: string;
  url?: string;
  favicon?: string;
  themeColor?: string;
}

const extractOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  try {
    const response = await fetch('https://api.peermall.com/v1/peerMalls/extractMetadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      throw new Error('메타데이터 추출 실패');
    }

    const ogData = await response.json();
    return ogData;
  } catch (error) {
    console.error('Open Graph 데이터 추출 실패:', error);
    
    const domain = new URL(url).hostname;
    return {
      title: domain,
      description: `${domain}에서 제공하는 서비스`,
      siteName: domain,
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      url: url
    };
  }
};

const FavoriteServicesSection: React.FC = () => {
  const [services, setServices] = useState<FavoriteService[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingServices, setLoadingServices] = useState<Set<string>>(new Set());
  const [windowWidth, setWindowWidth] = useState(0);
  const swiperRef = useRef<any>(null);

  // 화면 크기 감지 - 디바운싱 적용
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // 초기값 설정
    
    // 디바운싱 적용
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const favoriteService = await getMyFavoriteService();
        console.log(favoriteService)
        setServices(Array.isArray(favoriteService) ? favoriteService : []);
      } catch (error) {
        console.error('서비스 로드 실패:', error);
        setServices([]);
      }
    };
    loadServices();
  }, []);

  // 🔥 극강의 미니멀 카드 크기 설정
  const getResponsiveConfig = () => {
    if (windowWidth < 480) { // mobile xs
      return {
        cardWidth: 160, // 초소형 카드
        cardHeight: 190,
        imageHeight: 70,
        slidesPerView: 1.8, // 더 많이 보이게
        spaceBetween: 10,
        showNavigation: false,
        containerPadding: 'px-3'
      };
    } else if (windowWidth < 640) { // mobile
      return {
        cardWidth: 170,
        cardHeight: 200,
        imageHeight: 80,
        slidesPerView: 2.1,
        spaceBetween: 12,
        showNavigation: false,
        containerPadding: 'px-4'
      };
    } else if (windowWidth < 768) { // sm
      return {
        cardWidth: 180,
        cardHeight: 210,
        imageHeight: 85,
        slidesPerView: 2.8,
        spaceBetween: 14,
        showNavigation: false,
        containerPadding: 'px-4'
      };
    } else if (windowWidth < 1024) { // md
      return {
        cardWidth: 200,
        cardHeight: 230,
        imageHeight: 95,
        slidesPerView: 3.5,
        spaceBetween: 16,
        showNavigation: true,
        containerPadding: 'px-6'
      };
    } else if (windowWidth < 1280) { // lg
      return {
        cardWidth: 210,
        cardHeight: 240,
        imageHeight: 100,
        slidesPerView: 4.2,
        spaceBetween: 18,
        showNavigation: true,
        containerPadding: 'px-6'
      };
    } else { // xl and above
      return {
        cardWidth: 220,
        cardHeight: 250,
        imageHeight: 105,
        slidesPerView: 5.2,
        spaceBetween: 20,
        showNavigation: true,
        containerPadding: 'px-6'
      };
    }
  };

  const config = getResponsiveConfig();

  const handleServiceClick = (service: FavoriteService, e: React.MouseEvent) => {
    e.preventDefault();
    if (service.serviceLink) {
      window.open(service.serviceLink, '_blank', 'noopener,noreferrer');
    }
    
    setServices(prev => prev.map(s => 
      s.id === service.id 
        ? { ...s, usageCount: (s.usageCount || 0) + 1, lastUsed: new Date() }
        : s
    ));
  };

  const handleAddExternalService = async (name: string, link: string) => {
    const tempId = `temp-${Date.now()}`;
    setLoadingServices(prev => new Set(prev).add(tempId));
    
    try {
      const ogData = await extractOpenGraphData(link);
      const domain = new URL(link).hostname;
      
      // API 호출용 데이터 구성
      const serviceData = {
        serviceName: name || ogData.title || domain,
        serviceLink: link,
        domain: domain,
        description: ogData.description || `${domain}에서 제공하는 서비스`,
        favicon: ogData.favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        thumbnailUrl: ogData.image,
        ogData: {
          title: ogData.title,
          description: ogData.description,
          image: ogData.image,
          favicon: ogData.favicon
        }
      };

      const result = await registerMyFavoriteService(serviceData);
      
      // 성공 시 로컬 상태 업데이트
      const newService: FavoriteService = {
        id: result.serviceId || Date.now(),
        name: serviceData.serviceName,
        link: serviceData.serviceLink,
        description: serviceData.description,
        iconUrl: serviceData.favicon,
        thumbnailUrl: serviceData.thumbnailUrl,
        domain: serviceData.domain,
        usageCount: 0,
        lastUsed: new Date(),
        addedAt: new Date(),
        ogData: serviceData.ogData,
        serviceLink: serviceData.serviceLink,
        serviceName: serviceData.serviceName,
      };

      console.log(newService)

      setServices(prev => [...prev, newService]);
      
    } catch (error) {
      console.error('서비스 추가 실패:', error);
      
      // 에러 발생 시 fallback 처리
      const domain = new URL(link).hostname;
      const fallbackService: FavoriteService = {
        id: Date.now(),
        name: name || domain,
        link,
        description: `${domain}의 서비스`,
        iconUrl: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        domain: domain,
        usageCount: 0,
        lastUsed: new Date(),
        addedAt: new Date(),
        serviceLink: link,
        serviceName: name || domain
      };
      
      // 에러 시에도 로컬에만 추가 (서버 저장은 실패)
      setServices(prev => [...prev, fallbackService]);
      
      // 사용자에게 에러 알림
      alert('서비스 등록에 실패했지만 임시로 추가되었습니다.');
    } finally {
      setLoadingServices(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });
    }
  };


  const handleAddInternalServices = (serviceIds: string[]) => {
    const newInternalServices: FavoriteService[] = serviceIds.map((id, index) => ({
      id: Date.now() + index,
      name: `PeerTerra ${id.replace('service', '')}`,
      link: `/service/${id}`,
      description: `PeerTerra의 ${id} 서비스`,
      isInternal: true,
      domain: 'peerterra.com',
      iconUrl: '/favicon.ico',
      usageCount: 0,
      lastUsed: new Date(),
      addedAt: new Date(),
      serviceLink: '',
      serviceName: `PeerTerra ${id}`
    }));
    setServices(prev => [...prev, ...newInternalServices]);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString();
  };

  const getPopularityBadge = (usageCount: number) => {
    if (usageCount > 10) return { icon: Star, text: '인기', color: 'bg-yellow-100 text-yellow-800' };
    if (usageCount > 5) return { icon: TrendingUp, text: '상승', color: 'bg-green-100 text-green-800' };
    return null;
  };

  const shouldShowNavigation = config.showNavigation && services.length > Math.floor(config.slidesPerView);
  const isLoading = loadingServices.size > 0;
  
  return (
    <section className="mb-6 lg:mb-10">
      {/* 🎯 헤더 영역 - 서비스 추가 버튼을 여기로 이동! */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5 ${config.containerPadding}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            즐겨찾는 서비스
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {services.length}개
            </span>
            {services.length > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {services.reduce((acc, s) => acc + (s.usageCount || 0), 0)}회 사용
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* 🌟 서비스 추가 버튼 - 헤더에 위치 */}
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all duration-300 flex items-center gap-1.5 text-sm py-1.5 px-3 h-9 sm:h-9"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              추가 중...
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              서비스 추가
            </>
          )}
        </Button>
      </div>

      {/* 메인 스와이퍼 */}
      <div className={`relative ${config.containerPadding}`}>
        <div className="overflow-hidden"> {/* 중요: 오버플로우 문제 해결 */}
          <Swiper
            ref={swiperRef}
            modules={[Navigation, FreeMode]}
            spaceBetween={config.spaceBetween}
            slidesPerView={config.slidesPerView}
            freeMode={{
              enabled: true,
              sticky: false,
              momentumRatio: 0.25,
              momentumVelocityRatio: 0.25
            }}
            navigation={shouldShowNavigation ? {
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            } : false}
            className="!overflow-visible"
            breakpoints={{
              320: {
                slidesPerView: 1.8,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 2.1,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 2.8,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 3.5,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 4.2,
                spaceBetween: 18,
              },
              1280: {
                slidesPerView: 5.2,
                spaceBetween: 20,
              },
            }}
          >
            {/* 서비스 카드들 - 미니멀 사이즈 */}
            {services.map((service: FavoriteService) => {
              const popularityBadge = getPopularityBadge(service.usageCount || 0);
              
              return (
                <SwiperSlide key={service.id}>
                  <Card 
                    style={{ 
                      width: `${config.cardWidth}px`, 
                      height: `${config.cardHeight}px` 
                    }}
                    className="cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 flex flex-col bg-white rounded-lg overflow-hidden hover:-translate-y-1"
                    onClick={(e) => handleServiceClick(service, e)}
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* 썸네일 섹션 - 더 작게 */}
                      <div 
                        style={{ height: `${config.imageHeight}px` }}
                        className="relative bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden"
                      >
                        {service.serviceLink ? (
                          <img 
                            src={service.og_image}
                            alt={service.serviceName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
                            <Globe className="w-5 h-5 text-white opacity-80" />
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* 외부 링크 아이콘 - 미니멀 */}
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                          <div className="w-5 h-5 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm border border-white/20">
                            <ExternalLink className="w-2.5 h-2.5 text-gray-700" />
                          </div>
                        </div>

                        {/* 인기도 배지 - 미니멀 */}
                        {popularityBadge && (
                          <div className="absolute top-1 left-1">
                            <Badge className={`${popularityBadge.color} border-0 text-[10px] px-1 py-0 flex items-center gap-0.5`}>
                              <popularityBadge.icon className="w-2 h-2" />
                              {popularityBadge.text}
                            </Badge>
                          </div>
                        )}

                        {/* 도메인 배지 - 미니멀 */}
                        <div className="absolute bottom-1 left-1">
                          <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-[10px] px-1 py-0 max-w-[100px] truncate border-0 shadow-sm">
                            {service.domain}
                          </Badge>
                        </div>
                      </div>

                      {/* 콘텐츠 섹션 - 패딩 최소화 */}
                      <div className="p-2 flex flex-col flex-grow">
                        {/* 헤더 - 미니멀 */}
                        <div className="flex items-start gap-2 mb-1">
                          {/* 파비콘 - 미니멀 */}
                          <div className="flex-shrink-0 w-6 h-6 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200">
                            {service.iconUrl ? (
                              <img 
                                src={service.iconUrl} 
                                alt={service.serviceName}
                                className="w-4 h-4 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = `https://www.google.com/s2/favicons?domain=${service.domain}&sz=32`;
                                }}
                              />
                            ) : (
                              <Globe className="w-3 h-3 text-gray-400" />
                            )}
                          </div>

                          {/* 서비스 정보 - 텍스트 최소화 */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-xs leading-tight mb-0.5">
                              {service.serviceName}
                            </h3>
                            <p className="text-[10px] text-gray-600 leading-tight" 
                               style={{
                                 display: '-webkit-box',
                                 WebkitLineClamp: 2,
                                 WebkitBoxOrient: 'vertical',
                                 overflow: 'hidden',
                                 height: '1.4rem'
                               }}>
                              {service.description}ㅊ
                            </p>
                          </div>
                        </div>

                        {/* Open Graph 타입 - 조건부 표시 */}
                        {service.ogData?.type && config.cardHeight > 220 && (
                          <div className="mb-1">
                            <Badge variant="outline" className="text-[9px] px-1 py-0 bg-blue-50 text-blue-700 border-blue-200">
                              {service.ogData.type}
                            </Badge>
                          </div>
                        )}

                        {/* 푸터 - 최소화 */}
                        <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-0.5 font-medium">
                              <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                              {service.usageCount || 0}
                            </span>
                            {service.lastUsed && config.cardWidth > 180 && (
                              <div className="flex items-center gap-0.5">
                                <Clock className="w-2 h-2" />
                                <span className="hidden sm:inline">{formatTimeAgo(service.lastUsed)}</span>
                                <span className="sm:hidden">최근</span>
                              </div>
                            )}
                          </div>
                          
                          <ArrowRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 text-blue-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* 네비게이션 버튼 - 미니멀 스타일 */}
        {shouldShowNavigation && (
          <>
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-20 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 hidden lg:flex group">
              <svg className="w-3 h-3 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-20 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200 flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all duration-300 hidden lg:flex group">
              <svg className="w-3 h-3 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 📱 모바일 전용 서비스 추가 플로팅 버튼 (선택사항) */}
      {windowWidth < 768 && services.length > 0 && (
        <div className="fixed bottom-6 right-4 z-30 sm:hidden">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </Button>
        </div>
      )}

      {/* 📝 빈 상태 처리 */}
      {services.length === 0 && !isLoading && (
        <div className={`text-center py-12 ${config.containerPadding}`}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            아직 즐겨찾는 서비스가 없어요
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            자주 사용하는 웹 서비스를 추가해서 빠르게 접근해보세요
          </p>
          {/* <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            첫 번째 서비스 추가하기
          </Button> */}
        </div>
      )}

      {/* 모달 */}
      <AddServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExternalService={handleAddExternalService}
        onAddInternalServices={handleAddInternalServices}
      />
    </section>
  );
};

export default FavoriteServicesSection;