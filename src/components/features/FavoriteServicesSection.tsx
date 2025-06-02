import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { Plus, ExternalLink, Globe, Star, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddServiceModal from './AddServiceModal';
import { cn } from '@/lib/utils';

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

// Open Graph 메타데이터 추출 함수 - 클라이언트 사이드
const extractOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  try {
    // 백엔드 API를 통해 Open Graph 데이터 추출
    const response = await fetch('/api/extract-opengraph', {
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
    
    // 폴백: 기본 정보 생성
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
  const [services, setServices] = useState<FavoriteService[]>();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingServices, setLoadingServices] = useState<Set<string>>(new Set());
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const loadServices = async () => {
      const favoriteService = await getMyFavoriteService();
      setServices(favoriteService);
    };

    loadServices();
  }, []);

  const handleServiceClick = (service: FavoriteService, e: React.MouseEvent) => {
    e.preventDefault();
    
    // 사용 횟수 증가 및 마지막 사용 시간 업데이트
    setServices(prev => prev.map(s => 
      s.id === service.id 
        ? { ...s, usageCount: (s.usageCount || 0) + 1, lastUsed: new Date() }
        : s
    ));

    // 부드러운 클릭 피드백
    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.98)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
      window.open(service.serviceLink, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  const handleAddExternalService = async (name: string, link: string) => {
    const tempId = `temp-${Date.now()}`;
    setLoadingServices(prev => new Set(prev).add(tempId));
    try {
      // Open Graph 데이터 추출
      const ogData = await extractOpenGraphData(link);
      const domain = new URL(link).hostname;

      const newService: FavoriteService = {
        id: Date.now(),
        name: name || ogData.title || domain,
        link,
        description: ogData.description || `${domain}에서 제공하는 서비스`,
        iconUrl: ogData.favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        thumbnailUrl: ogData.image,
        domain: domain,
        usageCount: 0,
        lastUsed: new Date(),
        addedAt: new Date(),
        ogData: ogData,
        serviceLink: link,
        serviceName: name,
      };

      await registerMyFavoriteService(newService);
      setServices(services ? prev => [...prev, newService] : [newService]);
      
      // 성공 피드백
      console.log('서비스 추가 완료:', newService.name);
      
    } catch (error) {
      console.error('서비스 추가 실패:', error);
      
      // 에러 시에도 기본 정보로 추가
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
        serviceLink: '',
        serviceName: ''
      };
      
      setServices(services ? prev => [...prev, fallbackService] : [fallbackService]);
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
      iconUrl: '/favicon.ico', // PeerTerra 파비콘
      usageCount: 0,
      lastUsed: new Date(),
      addedAt: new Date(),
      serviceLink: '',
      serviceName: ''
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
  
  return (
    <section className="mb-10">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between mb-6">
        {/* <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{services.length}개 서비스</span>
          <span>•</span>
          <span>{services.length > 0 && services.reduce((acc, s) => acc + (s.usageCount || 0), 0)} 총 사용</span>
        </div> */}
      </div>

      {/* 메인 스와이퍼 */}
      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView="auto"
          freeMode={true}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          className="!overflow-visible"
        >
          {/* 서비스 카드들 */}
          {services && services.map((service) => (
            <SwiperSlide key={service.id} style={{ width: 'auto' }}>
              <Card 
                className="w-80 cursor-pointer group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
                onClick={(e) => handleServiceClick(service, e)}
              >
                <CardContent className="p-0">
                  {/* 썸네일 섹션 - Open Graph 이미지 우선 사용 */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg overflow-hidden">
                    {/* {service.ogData?.image || service.thumbnailUrl ? (
                      <img 
                        src={service.ogData?.image || service.thumbnailUrl} 
                        alt={service.ogData?.title || service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      /> */}
                      {service.serviceLink ? (
                      <img 
                        src={service.serviceLink}
                        alt={service.serviceName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                        <Globe className="w-12 h-12 text-white opacity-70" />
                      </div>
                    )}
                    
                    {/* 오버레이 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    
                    {/* 외부 링크 아이콘 */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                        <ExternalLink className="w-4 h-4 text-gray-600" />
                      </div>
                    </div>

                    {/* 사이트명 배지 (Open Graph siteName 사용) */}
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-xs px-2 py-1">
                        {service.serviceName}
                      </Badge>
                    </div>
                  </div>

                  {/* 콘텐츠 섹션 */}
                  <div className="p-4 space-y-3">
                    {/* 헤더 */}
                    <div className="flex items-start space-x-3">
                      {/* 파비콘 - Open Graph favicon 우선 사용 */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {service.iconUrl ? (
                          <img 
                            src={service.iconUrl} 
                            alt={service.serviceName}
                            className="w-8 h-8 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://www.google.com/s2/favicons?domain=${service.domain}&sz=32`;
                            }}
                          />
                        ) : (
                          <Globe className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      {/* 서비스 정보 - Open Graph 데이터 우선 사용 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {service.serviceName}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Open Graph 타입 표시 */}
                    {service.ogData?.type && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                          {service.ogData.type}
                        </Badge>
                      </div>
                    )}

                    {/* 푸터 */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                          <span>{service.usageCount}회 사용</span>
                        {service.lastUsed && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeAgo(service.lastUsed)}</span>
                          </div>
                        )}
                      </div>
                      
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}

          {/* 서비스 추가 버튼 */}
          <SwiperSlide style={{ width: 'auto' }}>
            <Card className="w-80 h-[280px] border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 group cursor-pointer">
              <CardContent 
                className="h-full flex flex-col items-center justify-center space-y-4 p-6"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors duration-300">
                  {loadingServices.size > 0 ? (
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  ) : (
                    <Plus className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    새 서비스 추가
                  </h3>
                  <p className="text-sm text-gray-600">
                    URL을 입력하면 Open Graph로<br />
                    자동으로 정보를 가져옵니다
                  </p>
                </div>

                {loadingServices.size > 0 && (
                  <div className="flex items-center space-x-2 text-blue-600">
                    <span className="text-sm">Open Graph 정보 수집 중...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </SwiperSlide>
        </Swiper>

        {/* 네비게이션 버튼 */}
        {/* {services.length > 2 && ( */}
        {services && (
          <>
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* 서비스 추가 모달 */}
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