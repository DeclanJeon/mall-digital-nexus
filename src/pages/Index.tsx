
import React, { useState, useCallback, useEffect } from 'react';
import PeermallGrid from '@/components/peermall-features/PeermallGrid';
import HashtagFilter, { HashtagFilterOption, PeermallType } from '@/components/navigation/HashtagFilter';
import PeermallMap from '@/components/peermall-features/PeermallMap';
import FavoriteServicesSection from '@/components/feature-sections/FavoriteServicesSection';
import EcosystemMap from '@/components/EcosystemMap';
import CommunityHighlights from '@/components/CommunityHighlights';
import CreatePeermall from '@/components/peermall-features/CreatePeermall';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  id?: string;
  createdAt: string;
}

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

const themeVars = {
  "--primary-100": "#1E2022",
  "--primary-200": "#34373b",
  "--primary-300": "#F0F5F9",
  "--accent-100": "#788189",
  "--accent-200": "#e1e4e6",
  "--text-100": "#1E2022",
  "--text-200": "#52616B",
  "--bg-100": "#F0F5F9",
  "--bg-200": "#C9D6DF",
  "--bg-300": "#bfc7d1"
};

const Index = () => {
  const navigate = useNavigate();
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);
  const [isMySpacesOpen, setIsMySpacesOpen] = useState(false);
  const [mySpaces, setMySpaces] = useState<Peermall[]>([]);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrModalTitle, setQrModalTitle] = useState('');

  useEffect(() => {
    // localStorage 로딩
    const loadFromLocalStorage = () => {
      try {
        const storedPeermalls = localStorage.getItem('peermalls');
        if (storedPeermalls) {
          const peermallsFromStorage: Peermall[] = JSON.parse(storedPeermalls);
          setPeermalls(peermallsFromStorage);
          setMySpaces(peermallsFromStorage.filter((mall: Peermall) => mall.owner === '나'));
        } else {
          const initialPeermalls: Peermall[] = [
            {
              id: '1', title: '첫번째 피어몰', description: '설명입니다.', owner: '나', imageUrl: 'https://via.placeholder.com/300x200?text=Peermall+1', category: '#디자인', tags: ['#디자인', '#아트'], rating: 4.5, reviewCount: 10, type: 'shop', location: { lat: 37.5665, lng: 126.9780, address: '서울시 중구' },
              createdAt: ''
            },
            {
              id: '2', title: '푸드 마켓', description: '맛있는 음식이 가득!', owner: '다른사람', imageUrl: 'https://via.placeholder.com/300x200?text=Food+Market', category: '#푸드', tags: ['#푸드'], rating: 4.0, reviewCount: 5, type: 'market', location: { lat: 37.5519, lng: 126.9918, address: '서울시 용산구' },
              createdAt: ''
            },
          ];
          setPeermalls(initialPeermalls);
          localStorage.setItem('peermalls', JSON.stringify(initialPeermalls));
          setMySpaces(initialPeermalls.filter((mall: Peermall) => mall.owner === '나'));
        }
      } catch (error) {
        setPeermalls([]);
        setMySpaces([]);
      }
    };
    loadFromLocalStorage();
  }, []);

  const handleCreatePeermall = (newMallData: Omit<Peermall, 'id' | 'rating' | 'reviewCount'>) => {
    const newPeermallWithDefaults: Peermall = {
      id: `pm-${Date.now().toString()}-${Math.random().toString(36).substring(2, 7)}`,
      rating: 0,
      reviewCount: 0,
      owner: newMallData.owner || '나',
      ...newMallData,
    };
    setPeermalls(prevMalls => {
      const updatedMalls = [newPeermallWithDefaults, ...prevMalls];
      try {
        localStorage.setItem('peermalls', JSON.stringify(updatedMalls));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
      if (newPeermallWithDefaults.owner === '나') {
        setMySpaces(prevMySpaces => [newPeermallWithDefaults, ...prevMySpaces]);
      }
      return updatedMalls;
    });
    // handleCreateModalClose();
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

  const [filteredMalls, setFilteredMalls] = useState<Peermall[]>(peermalls);

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

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
  const handleCloseMap = useCallback(() => setIsMapOpen(false), []);
  const handleOpenMySpaces = () => setIsMySpacesOpen(true);
  const handleCloseMySpaces = () => setIsMySpacesOpen(false);

  const handleSelectSpace = (id: string) => {
    handleCloseMySpaces();
    navigate(`/space/${id}`);
  };

  const handleShowPeermallQrCode = useCallback((peermallId: string, peermallTitle: string) => {
    setQrCodeUrl(`${window.location.origin}/space/${peermallId}`);
    setQrModalTitle(`${peermallTitle} QR 코드`);
    setQrModalOpen(true);
  }, []);

  const POPULAR_MALL_COUNT = 4;
  const NEWEST_MALL_COUNT = 4;

  // 인기/신규 피어몰 분리
  const popularMalls = [...filteredMalls]
    .sort((a, b) =>
      (b.rating || 0) - (a.rating || 0) ||
      (b.reviewCount || 0) - (a.reviewCount || 0)
    )
    .slice(0, POPULAR_MALL_COUNT);

  const newestMalls = [...filteredMalls]
    .sort((a, b) =>
      (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
      (a.createdAt ? new Date(a.createdAt).getTime() : 0)
    )
    .slice(0, NEWEST_MALL_COUNT);


  // ---------- UI ----------
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow" style={{ background: 'var(--bg-100)' }}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* 즐겨찾기/서비스 카드 */}
          <section className="mb-8 flex justify-between items-center">
            <FavoriteServicesSection />
          </section>

          {/* 해시태그 필터 */}
          <HashtagFilter
            hashtags={hashtagOptions}
            onFilterChange={handleFilterChange}
          />

          {/* 피어몰 생성 */}
          <CreatePeermall />

          {/* 메인 그리드+지도 */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* 피어몰 메인 리스트 영역 */}
            <div className="md:col-span-2 flex flex-col gap-10">
              {/* 인기 피어몰 */}
              <section className="bg-white rounded-2xl shadow-md border border-[color:var(--accent-200)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-[color:var(--primary-200)] mr-3" />
                    <h2 className="text-xl font-bold text-[color:var(--primary-100)]">인기 피어몰</h2>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-sm flex items-center text-[color:var(--accent-100)] hover:text-[color:var(--primary-100)]"
                  >
                    더 보기 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <PeermallGrid
                  title=""
                  malls={popularMalls}
                  onOpenMap={handleOpenMap}
                  viewMore={false}
                  viewMode="grid"
                  onShowQrCode={handleShowPeermallQrCode}
                  isPopularSection={true}
                />
              </section>

              {/* 신규 피어몰 */}
              <section className="bg-white rounded-2xl shadow-md border border-[color:var(--accent-200)] p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="inline-block w-3 h-3 rounded-full bg-[color:var(--accent-100)] mr-3" />
                    <h2 className="text-xl font-bold text-[color:var(--primary-100)]">신규 피어몰</h2>
                  </div>
                  <Button
                    variant="ghost"
                    className="text-sm flex items-center text-[color:var(--accent-100)] hover:text-[color:var(--primary-100)]"
                  >
                    더 보기 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <PeermallGrid
                  title=""
                  malls={newestMalls}
                  onOpenMap={handleOpenMap}
                  viewMore={false}
                  viewMode="grid"
                  onShowQrCode={handleShowPeermallQrCode}
                />
              </section>
            </div>

            {/* 지도/리뷰 영역 */}
            <div className="md:col-span-1 flex flex-col">
              <section className="bg-white rounded-2xl shadow-md border border-[color:var(--accent-200)] p-6 mb-8">
                <div className="flex items-center mb-4">
                  <span className="inline-block w-3 h-3 rounded-full bg-[color:var(--accent-100)] mr-3" />
                  <h2 className="text-lg font-bold text-[color:var(--primary-100)]">피어맵 & 리뷰</h2>
                </div>
                <EcosystemMap />
              </section>
              {/* (추가로 다른 사이드 콘텐츠/피드 등 확장 가능) */}
            </div>
          </section>

          {/* 커뮤니티 하이라이트 */}
          <section className="mb-12">
            <CommunityHighlights />
          </section>
        </div>
      </main>

      {/* 피어몰 지도 모달 */}
      <PeermallMap 
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        selectedLocation={selectedLocation}
        allLocations={allLocations}
      />

      {/* 내 스페이스 다이얼로그 */}
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
                  className="flex items-center p-3 border rounded-lg hover:bg-[color:var(--bg-200)] cursor-pointer"
                  onClick={() => handleSelectSpace(space.id!)}
                >
                  <div className="w-12 h-12 bg-[color:var(--bg-300)] rounded-lg overflow-hidden mr-4">
                    <img
                      src={space.imageUrl}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[color:var(--text-100)]">{space.title}</h3>
                    <p className="text-sm text-[color:var(--text-200)]">{space.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[color:var(--text-200)]">생성된 스페이스가 없습니다.</p>
                <p className="text-sm text-[color:var(--accent-100)] mt-2">새로운 피어몰을 만들어보세요!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <QRCodeModal
        open={qrModalOpen}
        onOpenChange={setQrModalOpen}
        url={qrCodeUrl}
        title={qrModalTitle}
      />
    </div>
  );
};

export default Index;
