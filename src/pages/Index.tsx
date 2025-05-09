
import React, { useState, useCallback, useEffect } from 'react';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import CommunicationWidget from '@/components/user-interaction/CommunicationWidget';
import HashtagFilter, { HashtagFilterOption, PeermallType } from '@/components/navigation/HashtagFilter';
import PeermallMap from '@/components/peermall-features/PeermallMap';
import ServiceCardsSection from '@/components/feature-sections/ServiceCardsSection';
import FavoriteServicesSection from '@/components/feature-sections/FavoriteServicesSection';
import EcosystemMap from '@/components/EcosystemMap';
import CommunityHighlights from '@/components/CommunityHighlights';
import CreatePeermall from '@/components/peermall-features/CreatePeermall';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
// import { getDB, STORES } from '@/utils/indexedDB'; // IndexedDB 관련 import 주석 처리

export interface Peermall {
  title: string;
  description: string;
  owner: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  type?: string;
  feedDate?: string;
  recommended?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  id?: string; // Added ID for routing
}

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);
  const [isMySpacesOpen, setIsMySpacesOpen] = useState(false);
  const [mySpaces, setMySpaces] = useState<Peermall[]>([]);

  // Load data from localStorage on initial mount
  useEffect(() => {
    // // IndexedDB 로딩 로직 주석 처리 시작
    // const loadFromIndexedDB = async () => {
    //   try {
    //     const db = await getDB();
    //     const transaction = db.transaction(STORES.PEER_SPACES, 'readonly');
    //     const store = transaction.objectStore(STORES.PEER_SPACES);
    //     const request = store.getAll();
    //     const peermallsFromDB: Peermall[] = await new Promise<Peermall[]>((resolve, reject) => {
    //       request.onsuccess = (event) => {
    //         resolve((event.target as IDBRequest).result as Peermall[]);
    //       };
    //       request.onerror = (event) => {
    //         reject((event.target as IDBRequest).error);
    //       };
    //     });
    //     setPeermalls(peermallsFromDB);
    //     setMySpaces(peermallsFromDB.filter((mall: Peermall) => mall.owner === '나'));
    //   } catch (error) {
    //     console.error('Error loading peermalls from indexedDB:', error);
    //   }
    // };
    // loadFromIndexedDB();
    // // IndexedDB 로딩 로직 주석 처리 끝

    // localStorage 로딩 로직
    const loadFromLocalStorage = () => {
      // Load Peermalls
      try {
        const storedPeermalls = localStorage.getItem('peermalls');
        if (storedPeermalls) {
          const peermallsFromStorage: Peermall[] = JSON.parse(storedPeermalls);
          setPeermalls(peermallsFromStorage);
          setMySpaces(peermallsFromStorage.filter((mall: Peermall) => mall.owner === '나'));
        } else {
          // localStorage에 데이터가 없으면 초기 데이터 설정 (선택적)
          const initialPeermalls: Peermall[] = [
             { id: '1', title: '첫번째 피어몰', description: '설명입니다.', owner: '나', imageUrl: 'https://via.placeholder.com/300x200?text=Peermall+1', category: '#디자인', tags: ['#디자인', '#아트'], rating: 4.5, reviewCount: 10, type: 'shop', location: { lat: 37.5665, lng: 126.9780, address: '서울시 중구' } },
             { id: '2', title: '푸드 마켓', description: '맛있는 음식이 가득!', owner: '다른사람', imageUrl: 'https://via.placeholder.com/300x200?text=Food+Market', category: '#푸드', tags: ['#푸드'], rating: 4.0, reviewCount: 5, type: 'market', location: { lat: 37.5519, lng: 126.9918, address: '서울시 용산구' } },
          ];
          setPeermalls(initialPeermalls);
          localStorage.setItem('peermalls', JSON.stringify(initialPeermalls));
          setMySpaces(initialPeermalls.filter((mall: Peermall) => mall.owner === '나'));
        }
      } catch (error) {
        console.error('Error loading peermalls from localStorage:', error);
        setPeermalls([]); // 에러 발생 시 빈 배열로 초기화
        setMySpaces([]);
      }

      // Load Favorite Service IDs (즐겨찾기 기능이 있다면)
      // try {
      //   const storedFavoriteIds = localStorage.getItem('favoriteServiceIds');
      //   if (storedFavoriteIds) {
      //     setFavoriteServiceIds(JSON.parse(storedFavoriteIds));
      //   }
      // } catch (error) {
      //   console.error('Error loading favoriteServiceIds from localStorage:', error);
      //   setFavoriteServiceIds([]);
      // }
    };

    loadFromLocalStorage();

  }, []); // 최초 마운트 시 한 번만 실행

  // 피어몰 생성 핸들러 (localStorage 저장 로직 추가/확인)
  const handleCreatePeermall = (newMallData: Omit<Peermall, 'id' | 'rating' | 'reviewCount'>) => {
    const newPeermallWithDefaults: Peermall = {
      id: `pm-${Date.now().toString()}-${Math.random().toString(36).substring(2, 7)}`,
      rating: 0,
      reviewCount: 0,
      owner: newMallData.owner || '나', // 실제 앱에서는 로그인 사용자 정보 사용
      ...newMallData,
    };

    setPeermalls(prevMalls => {
      const updatedMalls = [newPeermallWithDefaults, ...prevMalls];
      // localStorage에 업데이트된 피어몰 목록 저장
      try {
        localStorage.setItem('peermalls', JSON.stringify(updatedMalls));
      } catch (error) {
        console.error('Error saving peermalls to localStorage:', error);
        // 필요시 사용자에게 오류 알림
      }
      // '내 스페이스' 목록 업데이트
      if (newPeermallWithDefaults.owner === '나') {
        setMySpaces(prevMySpaces => [newPeermallWithDefaults, ...prevMySpaces]);
      }
      return updatedMalls;
    });
    handleCreateModalClose(); // 모달 닫기 (CreatePeermall 컴포넌트에서 호출될 수도 있음)
  };


  const hashtagOptions: HashtagFilterOption[] = [
    { label: '전체', value: '전체' },
    { label: '#디자인', value: '#디자인' },
    { label: '#푸드', value: '#푸드' },
    { label: '#패션', value: '#패션' },
    { label: '#테크', value: '#테크' },
    { label: '#아트', value: '#아트' },
    { label: '#라이프', value: '#라이프' },
    { label: '#취미', value: '#취미' },
    { label: '#여행', value: '#여행' },
  ];

  // 날짜 포맷팅 함수
  const formatDate = (daysAgo: number) => {
    return `${daysAgo}일 전`;
  };

  const [filteredMalls, setFilteredMalls] = useState<Peermall[]>(peermalls);
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateModalOpen = () => setIsCreateModalOpen(true);
  const handleCreateModalClose = () => setIsCreateModalOpen(false);

  // Update filtered malls when peermalls change
  useEffect(() => {
    setFilteredMalls(peermalls);
  }, [peermalls]);

  const allLocations = peermalls
    .filter(mall => mall.location)
    .map(mall => ({
      lat: mall.location!.lat,
      lng: mall.location!.lng,
      address: mall.location!.address,
      title: mall.title
    }));

  const handleFilterChange = useCallback((selectedHashtags: string[], selectedTypes: PeermallType[]) => {
    if (selectedHashtags.includes('전체') && (selectedTypes.includes('all') || selectedTypes.length === 0)) {
      setFilteredMalls(peermalls);
      return;
    }
    
    let filtered = peermalls;
    
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
      filtered = filtered.filter(mall => selectedTypes.includes(mall.type as PeermallType));
    }
    
    if (selectedHashtags.length > 0 && !selectedHashtags.includes('전체')) {
      filtered = filtered.filter(mall => 
        mall.tags && mall.tags.some(tag => selectedHashtags.includes(tag))
      );
    }
    
    setFilteredMalls(filtered);
  }, [peermalls]);

  const handleOpenMap = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsMapOpen(true);
  }, []);

  const handleCloseMap = useCallback(() => {
    setIsMapOpen(false);
  }, []);

  const handleOpenMySpaces = () => {
    setIsMySpacesOpen(true);
  };

  const handleCloseMySpaces = () => {
    setIsMySpacesOpen(false);
  };

  const handleSelectSpace = (id: string) => {
    handleCloseMySpaces();
    navigate(`/space/${id}`);
  };

  const [scrollY, setScrollY] = useState(0);
  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-bg-100">
        <div className="container mx-auto px-4 py-6">
          
          <section className="mb-8 flex justify-between items-center">
            <FavoriteServicesSection />
          </section>
          
          <HashtagFilter
            hashtags={hashtagOptions}
            onFilterChange={handleFilterChange}
          />
          
          {/* Create Peermall Section */}
          <CreatePeermall />
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-2">
              <PeermallGrid 
                title="피어몰 탐색" 
                malls={filteredMalls}
                onOpenMap={handleOpenMap}
                viewMore={false}
              />
            </div>
            
            <div className="md:col-span-1">
              <div className="mb-8">
                <EcosystemMap />
              </div>

            </div>
          </section>
          
          <section className="mb-12">
            <CommunityHighlights />
          </section>
        </div>
      </main>
      
      {/* <CommunicationWidget /> */}

      <PeermallMap 
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        selectedLocation={selectedLocation}
        allLocations={allLocations}
      />

      {/* My Spaces Dialog */}
      <Dialog open={isMySpacesOpen} onOpenChange={handleCloseMySpaces}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>내 스페이스</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {mySpaces.length > 0 ? (
              mySpaces.map((space) => (
                <div 
                  key={space.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectSpace(space.id!)}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4">
                    <img 
                      src={space.imageUrl} 
                      alt={space.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{space.title}</h3>
                    <p className="text-sm text-gray-500">{space.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">생성된 스페이스가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">새로운 피어몰을 만들어보세요!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Index;
