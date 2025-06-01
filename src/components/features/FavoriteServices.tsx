import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { Plus, ExternalLink, Globe, Clock, ArrowRight, Loader2, Heart, TrendingUp, Grid3X3, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddServiceModal from '@/components/feature-sections/AddServiceModal';
import { cn } from '@/lib/utils';

// Swiper 스타일
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { FavoriteService, OpenGraphData } from '@/types/favoriteService';

// 뷰 모드 타입
type ViewMode = 'compact' | 'medium' | 'large';

// Open Graph 메타데이터 추출 함수
const extractOpenGraphData = async (url: string): Promise<OpenGraphData> => {
  try {
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
  const [services, setServices] = useState<FavoriteService[]>([
    {
      id: 1,
      name: "Notion",
      link: "https://notion.so",
      description: "올인원 워크스페이스로 노트, 데이터베이스, 칸반보드를 통합 관리",
      iconUrl: "https://www.notion.so/images/favicon.ico",
      thumbnailUrl: "https://www.notion.so/images/meta/default.png",
      domain: "notion.so",
      usageCount: 127,
      lastUsed: new Date(),
      addedAt: new Date(),
      ogData: {
        title: "Notion",
        description: "올인원 워크스페이스",
        image: "https://www.notion.so/images/meta/default.png",
        siteName: "Notion",
        favicon: "https://www.notion.so/images/favicon.ico"
      }
    },
    {
      id: 2,
      name: "Figma",
      link: "https://figma.com",
      description: "실시간 협업이 가능한 UI/UX 디자인 도구",
      iconUrl: "https://static.figma.com/app/icon/1/favicon.ico",
      thumbnailUrl: "https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png",
      domain: "figma.com",
      usageCount: 89,
      lastUsed: new Date(),
      addedAt: new Date(),
      ogData: {
        title: "Figma",
        description: "협업 디자인 도구",
        image: "https://cdn.sanity.io/images/599r6htc/localized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1024x1024.png",
        siteName: "Figma",
        favicon: "https://static.figma.com/app/icon/1/favicon.ico"
      }
    },
    {
      id: 3,
      name: "GitHub",
      link: "https://github.com",
      description: "개발자를 위한 코드 저장소 및 협업 플랫폼",
      iconUrl: "https://github.com/favicon.ico",
      domain: "github.com",
      usageCount: 203,
      lastUsed: new Date(),
      addedAt: new Date(),
      ogData: {
        title: "GitHub",
        description: "코드 저장소",
        siteName: "GitHub",
        favicon: "https://github.com/favicon.ico"
      }
    },
    {
      id: 4,
      name: "ChatGPT",
      link: "https://chat.openai.com",
      description: "AI 기반 대화형 어시스턴트",
      iconUrl: "https://chat.openai.com/favicon.ico",
      domain: "chat.openai.com",
      usageCount: 156,
      lastUsed: new Date(),
      addedAt: new Date(),
      ogData: {
        title: "ChatGPT",
        description: "AI 어시스턴트",
        siteName: "OpenAI",
        favicon: "https://chat.openai.com/favicon.ico"
      }
    }
  ]);
  
  const [viewMode, setViewMode] = useState<ViewMode>('medium');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingServices, setLoadingServices] = useState<Set<string>>(new Set());
  const swiperRef = useRef<any>(null);

  // 뷰 모드별 설정
  const viewConfig = {
    compact: {
      cardWidth: 'w-48',
      cardHeight: 'h-32',
      thumbnailHeight: 'h-12',
      iconSize: 'w-8 h-8',
      titleSize: 'text-sm',
      showDescription: false,
      slidesPerView: 5
    },
    medium: {
      cardWidth: 'w-60',
      cardHeight: 'h-40',
      thumbnailHeight: 'h-16',
      iconSize: 'w-10 h-10',
      titleSize: 'text-base',
      showDescription: true,
      slidesPerView: 4
    },
    large: {
      cardWidth: 'w-72',
      cardHeight: 'h-48',
      thumbnailHeight: 'h-20',
      iconSize: 'w-12 h-12',
      titleSize: 'text-lg',
      showDescription: true,
      slidesPerView: 3
    }
  };

  const currentConfig = viewConfig[viewMode];

  const handleServiceClick = (service: FavoriteService, e: React.MouseEvent) => {
    e.preventDefault();
    
    setServices(prev => prev.map(s => 
      s.id === service.id 
        ? { ...s, usageCount: (s.usageCount || 0) + 1, lastUsed: new Date() }
        : s
    ));

    const target = e.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.98)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
      window.open(service.link, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  const handleAddExternalService = async (name: string, link: string) => {
    const tempId = `temp-${Date.now()}`;
    setLoadingServices(prev => new Set(prev).add(tempId));
    
    try {
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
        ogData: ogData
      };
      
      setServices(prev => [...prev, newService]);
      
    } catch (error) {
      console.error('서비스 추가 실패:', error);
      
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
        addedAt: new Date()
      };
      
      setServices(prev => [...prev, fallbackService]);
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
      addedAt: new Date()
    }));
    setServices(prev => [...prev, ...newInternalServices]);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금';
    if (diffMins < 60) return `${diffMins}분`;
    if (diffHours < 24) return `${diffHours}시간`;
    if (diffDays < 7) return `${diffDays}일`;
    return date.toLocaleDateString();
  };

  return (
    <section className="space-y-4">
      {/* 헤더 - 통계 및 뷰 모드 선택 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="font-medium">{services.length}개</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-medium">{services.reduce((acc, s) => acc + (s.usageCount || 0), 0)} 사용</span>
          </div>
        </div>

        {/* 뷰 모드 선택 */}
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <Button
            variant={viewMode === 'compact' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('compact')}
            className={cn(
              "w-8 h-8 p-0",
              viewMode === 'compact' 
                ? "bg-white dark:bg-gray-700 shadow-sm" 
                : "hover:bg-white/50 dark:hover:bg-gray-700/50"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'medium' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('medium')}
            className={cn(
              "w-8 h-8 p-0",
              viewMode === 'medium' 
                ? "bg-white dark:bg-gray-700 shadow-sm" 
                : "hover:bg-white/50 dark:hover:bg-gray-700/50"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'large' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('large')}
            className={cn(
              "w-8 h-8 p-0",
              viewMode === 'large' 
                ? "bg-white dark:bg-gray-700 shadow-sm" 
                : "hover:bg-white/50 dark:hover:bg-gray-700/50"
            )}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 메인 스와이퍼 */}
      <div className="relative">
        <Swiper
          ref={swiperRef}
          modules={[Navigation, FreeMode]}
          spaceBetween={viewMode === 'compact' ? 8 : viewMode === 'medium' ? 12 : 16}
          slidesPerView="auto"
          freeMode={true}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          className="!overflow-visible"
        >
          {/* 서비스 카드들 */}
          {services.map((service) => (
            <SwiperSlide key={service.id} style={{ width: 'auto' }}>
              <Card 
                className={cn(
                  currentConfig.cardWidth,
                  currentConfig.cardHeight,
                  "cursor-pointer group transition-all duration-300",
                  "border border-gray-200 dark:border-gray-700",
                  "hover:shadow-md hover:shadow-gray-200/50 dark:hover:shadow-gray-800/50",
                  "hover:border-gray-300 dark:hover:border-gray-600",
                  "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                  "hover:scale-105"
                )}
                onClick={(e) => handleServiceClick(service, e)}
              >
                <CardContent className="p-0 h-full">
                  {viewMode === 'compact' ? (
                    // 컴팩트 뷰
                    <div className="h-full flex flex-col">
                      <div className={cn(
                        currentConfig.thumbnailHeight,
                        "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-lg flex items-center justify-center relative overflow-hidden"
                      )}>
                        {service.ogData?.favicon || service.iconUrl ? (
                          <img 
                            src={service.ogData?.favicon || service.iconUrl} 
                            alt={service.name}
                            className="w-6 h-6 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://www.google.com/s2/favicons?domain=${service.domain}&sz=32`;
                            }}
                          />
                        ) : (
                          <Globe className="w-5 h-5 text-gray-400" />
                        )}
                        
                        {/* 사용 횟수 뱃지 */}
                        {service.usageCount && service.usageCount > 0 && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {service.usageCount > 99 ? '99+' : service.usageCount}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 p-2 flex flex-col justify-center">
                        <h3 className={cn(
                          currentConfig.titleSize,
                          "font-medium text-gray-900 dark:text-white text-center line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        )}>
                          {service.ogData?.title || service.name}
                        </h3>
                      </div>
                    </div>
                  ) : (
                    // 미디엄/라지 뷰
                    <div className="h-full flex flex-col">
                      <div className="relative">
                        <div className={cn(
                          currentConfig.thumbnailHeight,
                          "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-t-lg overflow-hidden relative"
                        )}>
                          {service.ogData?.image || service.thumbnailUrl ? (
                            <img 
                              src={service.ogData?.image || service.thumbnailUrl} 
                              alt={service.ogData?.title || service.name}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-indigo-600/20">
                              <Globe className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* 플로팅 파비콘 */}
                        <div className={cn(
                          currentConfig.iconSize,
                          "absolute -bottom-4 left-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg border-2 border-white dark:border-gray-700 overflow-hidden flex items-center justify-center"
                        )}>
                          {service.ogData?.favicon || service.iconUrl ? (
                            <img 
                              src={service.ogData?.favicon || service.iconUrl} 
                              alt={service.name}
                              className="w-6 h-6 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://www.google.com/s2/favicons?domain=${service.domain}&sz=32`;
                              }}
                            />
                          ) : (
                            <Globe className="w-4 h-4 text-gray-400" />
                          )}
                        </div>

                        {/* 외부 링크 아이콘 */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-6 h-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md">
                            <ExternalLink className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 pt-6 px-3 pb-3 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className={cn(
                            currentConfig.titleSize,
                            "font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                          )}>
                            {service.ogData?.title || service.name}
                          </h3>
                          {service.usageCount && service.usageCount > 0 && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {service.usageCount}
                            </Badge>
                          )}
                        </div>
                        
                        {currentConfig.showDescription && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {service.ogData?.description || service.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs">
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            {service.ogData?.siteName || service.domain}
                          </Badge>
                          
                          {service.lastUsed && (
                            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(service.lastUsed)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}

          {/* 서비스 추가 버튼 */}
          <SwiperSlide style={{ width: 'auto' }}>
            <Card 
              className={cn(
                currentConfig.cardWidth,
                currentConfig.cardHeight,
                "border-2 border-dashed border-gray-300 dark:border-gray-600",
                "hover:border-blue-400 dark:hover:border-blue-500",
                "hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
                "transition-all duration-300 group cursor-pointer",
                "bg-gray-50/50 dark:bg-gray-800/50"
              )}
            >
              <CardContent 
                className="h-full flex flex-col items-center justify-center space-y-2 p-3"
                onClick={() => setIsModalOpen(true)}
              >
                <div className={cn(
                  viewMode === 'compact' ? 'w-8 h-8' : 'w-10 h-10',
                  "rounded-xl flex items-center justify-center transition-all duration-300",
                  "bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50",
                  "group-hover:scale-110"
                )}>
                  {loadingServices.size > 0 ? (
                    <Loader2 className={cn(
                      viewMode === 'compact' ? 'w-4 h-4' : 'w-5 h-5',
                      "text-blue-600 dark:text-blue-400 animate-spin"
                    )} />
                  ) : (
                    <Plus className={cn(
                      viewMode === 'compact' ? 'w-4 h-4' : 'w-5 h-5',
                      "text-blue-600 dark:text-blue-400"
                    )} />
                  )}
                </div>
                
                <div className="text-center space-y-1">
                  <h3 className={cn(
                    viewMode === 'compact' ? 'text-xs' : 'text-sm',
                    "font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                  )}>
                    {viewMode === 'compact' ? '추가' : '새 서비스'}
                  </h3>
                  {viewMode !== 'compact' && (
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      URL 입력으로<br />자동 추가
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        </Swiper>

        {/* 네비게이션 버튼 */}
        {services.length > currentConfig.slidesPerView && (
          <>
            <button className={cn(
              "swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10",
              "w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
              "flex items-center justify-center transition-all duration-300",
              "hover:shadow-xl hover:scale-110 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}>
              <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button className={cn(
              "swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10",
              "w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
              "flex items-center justify-center transition-all duration-300",
              "hover:shadow-xl hover:scale-110 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}>
              <svg className="w-3 h-3 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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