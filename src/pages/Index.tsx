
import React, { useState, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNav from '../components/CategoryNav';
import PeermallGrid from '../components/PeermallGrid';
import CreatePeermall from '../components/CreatePeermall';
import { Filter, Hash, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommunicationWidget from '@/components/CommunicationWidget';
import HashtagFilter, { HashtagFilterOption, PeermallType } from '@/components/HashtagFilter';
import PeermallMap from '@/components/PeermallMap';
import ServiceCardsSection from '@/components/ServiceCardsSection';
import FavoriteServicesSection from '@/components/FavoriteServicesSection'; // 추가
import ActivityFeed from '@/components/ActivityFeed';

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

const Index = () => {
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

  const trendingMalls = [
    {
      title: "디자인 스튜디오",
      description: "전문 그래픽 디자이너가 제공하는 고품질 디자인 서비스와 템플릿",
      owner: "김민지",
      imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80",
      category: "디자인",
      tags: ["#디자인", "#그래픽", "#템플릿"],
      rating: 4.9,
      reviewCount: 124,
      featured: true,
      type: 'trending',
      location: {
        lat: 37.5665, 
        lng: 126.9780, 
        address: "서울시 중구 명동길 14"
      }
    },
    {
      title: "친환경 생활용품",
      description: "지속가능한 생활을 위한 친환경 제품과 제로웨이스트 솔루션",
      owner: "에코라이프",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
      category: "리빙",
      tags: ["#라이프", "#친환경"],
      rating: 4.7,
      reviewCount: 89,
      featured: false,
      type: 'trending'
    },
    {
      title: "수제 베이커리",
      description: "천연 재료로 만든 건강한 빵과 디저트, 주문 제작 케이크 전문",
      owner: "달콤한숲",
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80",
      category: "푸드",
      tags: ["#푸드", "#베이커리"],
      rating: 4.8,
      reviewCount: 156,
      featured: false,
      type: 'trending'
    },
    {
      title: "디지털 아트 갤러리",
      description: "현대 디지털 아티스트들의 작품을 소개하고 판매하는 온라인 갤러리",
      owner: "아트스페이스",
      imageUrl: "https://images.unsplash.com/photo-1561838709-3acc98cf0d2d?auto=format&fit=crop&q=80",
      category: "아트",
      tags: ["#아트", "#디지털"],
      rating: 4.6,
      reviewCount: 73,
      featured: false,
      type: 'trending'
    }
  ];

  const recentMalls = [
    {
      title: "핸드메이드 액세서리",
      description: "정성을 담아 수작업으로 제작하는 유니크한 액세서리",
      owner: "손끝공방",
      imageUrl: "https://images.unsplash.com/photo-1619037961378-80713ad5edf4?auto=format&fit=crop&q=80",
      category: "패션",
      tags: ["#패션", "#핸드메이드"],
      rating: 4.5,
      reviewCount: 42,
      featured: false,
      type: 'recent',
      location: {
        lat: 37.5635, 
        lng: 126.9845, 
        address: "서울시 용산구 이태원로 45-8"
      }
    },
    {
      title: "스마트 홈 솔루션",
      description: "최신 기술로 편리한 생활을 디자인하는 스마트 홈 제품",
      owner: "테크홈",
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055908a4e4d?auto=format&fit=crop&q=80",
      category: "테크",
      tags: ["#테크", "#스마트홈"],
      rating: 4.3,
      reviewCount: 67,
      featured: false,
      type: 'recent'
    },
    {
      title: "유기농 농장",
      description: "친환경 방식으로 재배한 신선한 제철 유기농 농산물",
      owner: "초록농장",
      imageUrl: "https://images.unsplash.com/photo-1501226597177-87b1fa873152?auto=format&fit=crop&q=80",
      category: "식품",
      tags: ["#푸드", "#유기농"],
      rating: 4.9,
      reviewCount: 103,
      featured: false,
      type: 'recent'
    },
    {
      title: "여행 콘텐츠",
      description: "숨겨진 여행지와 현지 경험을 공유하는 여행 큐레이션",
      owner: "세계여행자",
      imageUrl: "https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&q=80",
      category: "여행",
      tags: ["#여행", "#콘텐츠"],
      rating: 4.7,
      reviewCount: 91,
      featured: false,
      type: 'recent'
    }
  ];

  const recommendedMalls = [
    {
      title: "건강한 식단",
      description: "영양사가 제안하는 맞춤형 식단과 건강 레시피",
      owner: "푸드닥터",
      imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80",
      category: "건강",
      tags: ["#푸드", "#건강"],
      rating: 4.8,
      reviewCount: 86,
      featured: false,
      type: 'recommended',
      location: {
        lat: 37.5115, 
        lng: 127.0227, 
        address: "서울시 강남구 테헤란로 152"
      }
    },
    {
      title: "북 커뮤니티",
      description: "독서 취향 기반 추천과 독서 모임을 제공하는 북 커뮤니티",
      owner: "책향기",
      imageUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&q=80",
      category: "문화",
      tags: ["#취미", "#독서"],
      rating: 4.6,
      reviewCount: 72,
      featured: false,
      type: 'recommended'
    },
    {
      title: "홈가드닝",
      description: "도시 속 정원을 위한 식물과 가드닝 제품, 케어 가이드",
      owner: "그린핑거",
      imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80",
      category: "취미",
      tags: ["#취미", "#라이프"],
      rating: 4.7,
      reviewCount: 58,
      featured: false,
      type: 'recommended'
    },
    {
      title: "러닝 클럽",
      description: "초보부터 마라토너까지 함께하는 러닝 커뮤니티",
      owner: "런앤펀",
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80",
      category: "스포츠",
      tags: ["#취미", "#스포츠"],
      rating: 4.5,
      reviewCount: 63,
      featured: false,
      type: 'recommended'
    }
  ];

  const allMalls = [...trendingMalls, ...recentMalls, ...recommendedMalls];

  const [filteredTrending, setFilteredTrending] = useState(trendingMalls);
  const [filteredRecent, setFilteredRecent] = useState(recentMalls);
  const [filteredRecommended, setFilteredRecommended] = useState(recommendedMalls);
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const allLocations = allMalls
    .filter(mall => mall.location)
    .map(mall => ({
      lat: mall.location!.lat,
      lng: mall.location!.lng,
      address: mall.location!.address,
      title: mall.title
    }));

  const handleFilterChange = useCallback((selectedHashtags: string[], selectedTypes: PeermallType[]) => {
    const filterMalls = (malls: typeof trendingMalls, type: 'trending' | 'recent' | 'recommended') => {
      if (!selectedTypes.includes(type) && !selectedTypes.includes('all')) {
        return [];
      }
      
      if (selectedHashtags.includes('전체')) {
        return malls;
      }
      
      return malls.filter(mall => 
        mall.tags && mall.tags.some(tag => selectedHashtags.includes(tag))
      );
    };
    
    setFilteredTrending(filterMalls(trendingMalls, 'trending'));
    setFilteredRecent(filterMalls(recentMalls, 'recent'));
    setFilteredRecommended(filterMalls(recommendedMalls, 'recommended'));
  }, []);

  const handleOpenMap = useCallback((location: Location) => {
    setSelectedLocation(location);
    setIsMapOpen(true);
  }, []);

  const handleCloseMap = useCallback(() => {
    setIsMapOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryNav />

      <main className="flex-grow bg-bg-100">
        <div className="container mx-auto px-4 py-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="col-span-1 md:col-span-2">
              {/* 즐겨찾는 서비스 섹션 추가 */}
              <FavoriteServicesSection />
              <HashtagFilter
                hashtags={hashtagOptions}
                onFilterChange={handleFilterChange}
              />

              {filteredTrending.length > 0 && (
                <PeermallGrid 
                  title="인기 피어몰" 
                  malls={filteredTrending}
                  onOpenMap={handleOpenMap}
                />
              )}
            </div>
            {/* <ActivityFeed /> */}
          </section>

          <section>
            <CreatePeermall />
          </section>
          
          {filteredRecent.length > 0 && (
            <PeermallGrid 
              title="최근 피어몰" 
              malls={filteredRecent}
              onOpenMap={handleOpenMap}
            />
          )}
          
          {filteredRecommended.length > 0 && (
            <PeermallGrid 
              title="추천 피어몰" 
              malls={filteredRecommended}
              onOpenMap={handleOpenMap}
            />
          )}
        </div>
        <ServiceCardsSection />
      </main>
      <Footer />

      <CommunicationWidget />

      <PeermallMap 
        isOpen={isMapOpen}
        onClose={handleCloseMap}
        selectedLocation={selectedLocation}
        allLocations={allLocations}
      />
    </div>
  );
};

export default Index;
