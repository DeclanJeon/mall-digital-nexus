
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryNav from '../components/CategoryNav';
import PeermallGrid from '../components/PeermallGrid';
import QRFeature from '../components/QRFeature';
import CreatePeermall from '../components/CreatePeermall';
import ActivityFeed from '../components/ActivityFeed';
import { Filter, TrendingUp, Bell, MapPin } from 'lucide-react';

const Index = () => {
  // Mock data for trending peermalls
  const trendingMalls = [
    {
      title: "디자인 스튜디오",
      description: "전문 그래픽 디자이너가 제공하는 고품질 디자인 서비스와 템플릿",
      owner: "김민지",
      imageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80",
      category: "디자인",
      rating: 4.9,
      reviewCount: 124,
      featured: true
    },
    {
      title: "친환경 생활용품",
      description: "지속가능한 생활을 위한 친환경 제품과 제로웨이스트 솔루션",
      owner: "에코라이프",
      imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80",
      category: "리빙",
      rating: 4.7,
      reviewCount: 89
    },
    {
      title: "수제 베이커리",
      description: "천연 재료로 만든 건강한 빵과 디저트, 주문 제작 케이크 전문",
      owner: "달콤한숲",
      imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80",
      category: "푸드",
      rating: 4.8,
      reviewCount: 156
    },
    {
      title: "디지털 아트 갤러리",
      description: "현대 디지털 아티스트들의 작품을 소개하고 판매하는 온라인 갤러리",
      owner: "아트스페이스",
      imageUrl: "https://images.unsplash.com/photo-1561838709-3acc98cf0d2d?auto=format&fit=crop&q=80",
      category: "아트",
      rating: 4.6,
      reviewCount: 73
    }
  ];

  // Mock data for recent peermalls
  const recentMalls = [
    {
      title: "핸드메이드 액세서리",
      description: "정성을 담아 수작업으로 제작하는 유니크한 액세서리",
      owner: "손끝공방",
      imageUrl: "https://images.unsplash.com/photo-1619037961378-80713ad5edf4?auto=format&fit=crop&q=80",
      category: "패션",
      rating: 4.5,
      reviewCount: 42
    },
    {
      title: "스마트 홈 솔루션",
      description: "최신 기술로 편리한 생활을 디자인하는 스마트 홈 제품",
      owner: "테크홈",
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055908a4e4d?auto=format&fit=crop&q=80",
      category: "테크",
      rating: 4.3,
      reviewCount: 67
    },
    {
      title: "유기농 농장",
      description: "친환경 방식으로 재배한 신선한 제철 유기농 농산물",
      owner: "초록농장",
      imageUrl: "https://images.unsplash.com/photo-1501226597177-87b1fa873152?auto=format&fit=crop&q=80",
      category: "식품",
      rating: 4.9,
      reviewCount: 103
    },
    {
      title: "여행 콘텐츠",
      description: "숨겨진 여행지와 현지 경험을 공유하는 여행 큐레이션",
      owner: "세계여행자",
      imageUrl: "https://images.unsplash.com/photo-1501446529957-6226bd447c46?auto=format&fit=crop&q=80",
      category: "여행",
      rating: 4.7,
      reviewCount: 91
    }
  ];

  // Mock data for recommended peermalls
  const recommendedMalls = [
    {
      title: "건강한 식단",
      description: "영양사가 제안하는 맞춤형 식단과 건강 레시피",
      owner: "푸드닥터",
      imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&q=80",
      category: "건강",
      rating: 4.8,
      reviewCount: 86
    },
    {
      title: "북 커뮤니티",
      description: "독서 취향 기반 추천과 독서 모임을 제공하는 북 커뮤니티",
      owner: "책향기",
      imageUrl: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&q=80",
      category: "문화",
      rating: 4.6,
      reviewCount: 72
    },
    {
      title: "홈가드닝",
      description: "도시 속 정원을 위한 식물과 가드닝 제품, 케어 가이드",
      owner: "그린핑거",
      imageUrl: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80",
      category: "취미",
      rating: 4.7,
      reviewCount: 58
    },
    {
      title: "러닝 클럽",
      description: "초보부터 마라토너까지 함께하는 러닝 커뮤니티",
      owner: "런앤펀",
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80",
      category: "스포츠",
      rating: 4.5,
      reviewCount: 63
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <CategoryNav />
      
      <main className="flex-grow bg-bg-100">
        <div className="container mx-auto px-4 py-6">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-accent-100" />
                    인기 카테고리
                  </h2>
                  <div className="flex gap-2">
                    <button className="btn-outline text-xs py-1 px-2 flex items-center">
                      <Filter className="h-3 w-3 mr-1" />
                      필터
                    </button>
                    <button className="btn-outline text-xs py-1 px-2 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      지도
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  {['전체', '디자인', '푸드', '패션', '테크', '아트', '라이프', '취미', '여행'].map((category, index) => (
                    <button 
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        index === 0 
                          ? 'bg-accent-100 text-white' 
                          : 'bg-bg-200 text-text-200 hover:bg-primary-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <PeermallGrid 
                title="인기 피어몰" 
                malls={trendingMalls} 
              />
            </div>
            
            <div>
              <ActivityFeed />
            </div>
          </section>
          
          <QRFeature />
          
          <PeermallGrid 
            title="최근 피어몰" 
            malls={recentMalls} 
          />
          
          <CreatePeermall />
          
          <PeermallGrid 
            title="추천 피어몰" 
            malls={recommendedMalls}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
