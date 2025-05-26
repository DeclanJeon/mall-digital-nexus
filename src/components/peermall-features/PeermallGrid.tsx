import React, { useEffect, useState, useCallback } from 'react';
import { ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import PeerMallCard from './PeermallCard';
import { peermallStorage, Peermall } from '@/services/storage/peermallStorage';
import { useToast } from '@/hooks/use-toast';
import { PeermallGridProps } from '@/types/peermall';

const PeermallGrid = ({ 
  title, 
  malls: initialMalls = [], 
  viewMore = true, 
  onOpenMap, 
  viewMode, 
  onShowQrCode,
  isPopularSection = false 
}: PeermallGridProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [malls, setMalls] = useState<Peermall[]>(initialMalls);
  const [error, setError] = useState<string | null>(null);

  // ✅ 스토리지에서 데이터 로드 (의존성 배열 최적화)
  const loadPeermalls = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 피어몰 데이터 로드 시작...');

      // 스토리지에서 피어몰 데이터 가져오기
      const peermalls = peermallStorage.getAll();
      // console.log('📦 스토리지에서 로드된 피어몰:', peermalls);
      
      if (peermalls && peermalls.length > 0) {
        // 최신순으로 정렬
        const sortedPeermalls = [...peermalls].sort((a, b) => {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 
                      a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 
                      b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        setMalls(sortedPeermalls);
        console.log('✅ 피어몰 데이터 설정 완료:', sortedPeermalls.length, '개');
      } else {
        // ✅ 스토리지에 데이터가 없으면 initialMalls 사용
        console.log('📝 스토리지가 비어있음, initialMalls 사용:', initialMalls.length, '개');
        setMalls(initialMalls);
      }
      
    } catch (error) {
      console.error('❌ 피어몰 데이터 로드 중 오류:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      
      // ✅ 에러 발생 시 initialMalls로 폴백
      setMalls(initialMalls);
      
      toast({
        title: '데이터 로드 오류',
        description: '피어몰 데이터를 불러오는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [initialMalls, toast]); // ✅ 의존성 최소화

  // ✅ 초기 로드 및 스토리지 이벤트 리스너 (한 번만 실행)
  useEffect(() => {
    let isMounted = true;
    
    // 초기 로드
    const initLoad = async () => {
      if (isMounted) {
        await loadPeermalls();
      }
    };
    
    initLoad();

    // ✅ 스토리지 변경 이벤트 리스너 (디바운싱 적용)
    let debounceTimer: NodeJS.Timeout;
    const removeListener = peermallStorage.addEventListener((peermalls) => {
      if (!isMounted) return;
      
      console.log('🔔 스토리지 업데이트 감지:', peermalls?.length || 0, '개');
      
      // ✅ 디바운싱으로 과도한 업데이트 방지
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (isMounted && peermalls) {
          setMalls([...peermalls]); // 새 배열로 복사하여 리렌더링 트리거
        }
      }, 300);
    });

    // ✅ 컴포넌트 언마운트 시 정리
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
      removeListener?.();
    };
  }, []); // ✅ 빈 의존성 배열로 한 번만 실행

  // ✅ initialMalls가 변경될 때만 업데이트
  useEffect(() => {
    if (initialMalls.length > 0) {
      console.log('🔄 initialMalls 업데이트:', initialMalls.length, '개');
      setMalls(initialMalls);
    }
  }, [initialMalls]);

  const gridLayoutClasses = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6";
  const listLayoutClasses = "flex flex-col gap-4";

  // ✅ 로딩 스켈레톤 개선
  const renderSkeleton = () => (
    <div className={viewMode === 'grid' ? gridLayoutClasses : listLayoutClasses}>
      {[...Array(viewMode === 'grid' ? 4 : 2)].map((_, index) => (
        <div 
          key={index} 
          className={`bg-white rounded-xl shadow-sm border animate-pulse ${
            viewMode === 'list' ? 'flex flex-row h-32' : 'h-80'
          }`}
        >
          <div className={`bg-gray-200 rounded-lg ${
            viewMode === 'list' ? 'w-32 h-full mr-4' : 'h-48 mb-4'
          }`}></div>
          <div className="flex-1 p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            {viewMode === 'list' && (
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            )}
            <div className="flex space-x-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ✅ 에러 상태 렌더링
  if (error && malls.length === 0) {
    return (
      <section className="my-6">
        {title && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700 mb-2">데이터 로드 실패</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadPeermalls}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="my-6">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}
      
      {isLoading ? (
        renderSkeleton()
      ) : malls.length > 0 ? (
        <div className={viewMode === 'grid' ? gridLayoutClasses : listLayoutClasses}>
          {malls.map((peermall, index) => (
            <div key={peermall.id || `peermall-${index}`} className="w-full">
              <PeerMallCard
                id={peermall.id || ''}
                title={peermall.title}
                owner={peermall.owner}
                description={peermall.description}
                imageUrl={peermall.imageUrl || "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"}
                likes={peermall.likes || 0}
                rating={peermall.rating || 0}
                followers={peermall.followers || 0}
                tags={peermall.tags || []}
                isPopular={isPopularSection || peermall.featured || false}
                isFamilyCertified={peermall.certified || false}
                isRecommended={peermall.recommended || false}
                className={viewMode === 'grid' ? 'h-full' : 'h-32'}
                onShowQrCode={onShowQrCode ? () => onShowQrCode(peermall.id || '', peermall.title) : undefined}
                onOpenMap={onOpenMap && peermall.location ? () => onOpenMap({
                  lat: peermall.location?.lat || 37.5665,
                  lng: peermall.location?.lng || 126.9780,
                  address: peermall.location?.address || '주소 없음',
                  title: peermall.title
                }) : undefined}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏪</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {isPopularSection ? '인기 피어몰이 없어요' : '피어몰이 없습니다'}
          </h3>
          <p className="text-gray-500 mb-4">
            {isPopularSection 
              ? '첫 번째 피어몰을 만들어 인기 순위에 도전해보세요!' 
              : '새 피어몰을 만들어보세요!'
            }
          </p>
        </div>
      )}

      {viewMore && malls.length > 0 && (
        <div className="flex items-center justify-end mt-6">
          <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors font-medium">
            더보기 <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      )}
    </section>
  );
};

export default PeermallGrid;