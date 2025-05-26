import React, { useState, useEffect } from 'react';
import ProfileSection from '@/components/my-info/ProfileSection';
import SecuritySection from '@/components/my-info/SecuritySection';
import NetworkSection from '@/components/my-info/NetworkSection';
import ActivitySection from '@/components/my-info/ActivitySection';
import PeermallManagementSection from '@/components/my-info/PeermallManagementSection';
import ContentSection from '@/components/my-info/ContentSection';
import CommunicationSection from '@/components/my-info/CommunicationSection';
import QRCodeSection from '@/components/my-info/QRCodeSection';
import SettingsSection from '@/components/my-info/SettingsSection';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { openDB } from 'idb';

import { TransactionItem } from '@/components/my-info/ActivitySection';
import NetworkSectionProps from '@/components/my-info/Network';

// Make sure to match the interface from PeermallManagementSection
interface PeerMall {
  id: number;
  name: string;
  type: string;
  image?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
  visibility: 'public' | 'partial' | 'private';
  isCertified?: boolean;
  stats?: {
    visitors: number;
    followers: number;
    reviews?: number;
  };
}

const MyInfoPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '김민지',
    nickname: '디자인마스터',
    peerNumber: 'PN7829354',
    email: 'example@peermall.com',
    phone: '010-1234-5678',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=currentUser',
    bio: '디자인과 UX에 관심이 많은 디자이너입니다. 다양한 디자인 아이디어를 공유하고 싶어요!',
    badges: ['디자인', '푸드', '테크', '아트'],
    recommenders: 5,
    socialAccounts: [
      { type: 'Instagram', username: 'design_master', connected: true },
      { type: 'Twitter', username: 'k_designr', connected: false }
    ]
  });

  const [createdMalls, setCreatedMalls] = useState<PeerMall[]>([]);
  
  const authMethods = [
    { type: '이메일', value: 'example@peermall.com', verified: true, primary: true },
    { type: '휴대폰', value: '010-1234-5678', verified: true, primary: false }
  ];
  
  const loginRecords = [
    { device: '데스크톱 - Chrome', location: '서울', ip: '123.456.789.0', time: '지금', current: true },
    { device: '모바일 - Safari', location: '서울', ip: '123.456.789.1', time: '2시간 전', current: false },
    { device: '태블릿 - Chrome', location: '부산', ip: '234.567.890.1', time: '3일 전', current: false }
  ];
  
  const privacySettings = {
    profileVisibility: 'public' as const,
    activityVisibility: 'friends' as const,
    searchable: true
  };

  // Define network data
  const networkData: NetworkSectionProps = {
    backupRecommenders: [],
    friends: [
      { id: '1', name: '박지민', image: 'https://api.dicebear.com/7.x/personas/svg?seed=park', status: 'online' },
      { id: '2', name: '이현우', image: 'https://api.dicebear.com/7.x/personas/svg?seed=lee', status: 'offline', lastActive: '2시간 전' },
      { id: '3', name: '정다온', image: 'https://api.dicebear.com/7.x/personas/svg?seed=jung', status: 'away' },
      { id: '4', name: '김유진', image: 'https://api.dicebear.com/7.x/personas/svg?seed=kim', status: 'online' },
      { id: '5', name: '최서윤', image: 'https://api.dicebear.com/7.x/personas/svg?seed=choi', status: 'offline', lastActive: '1일 전' }
    ],
    followers: [
      { id: '1', name: '박지민', image: 'https://api.dicebear.com/7.x/personas/svg?seed=park' },
      { id: '3', name: '정다온', image: 'https://api.dicebear.com/7.x/personas/svg?seed=jung' },
      { id: '6', name: '한지우', image: 'https://api.dicebear.com/7.x/personas/svg?seed=han' },
      { id: '7', name: '임수현', image: 'https://api.dicebear.com/7.x/personas/svg?seed=lim' }
    ],
    following: [
      { id: '2', name: '이현우', image: 'https://api.dicebear.com/7.x/personas/svg?seed=lee' },
      { id: '4', name: '김유진', image: 'https://api.dicebear.com/7.x/personas/svg?seed=kim' },
      { id: '5', name: '최서윤', image: 'https://api.dicebear.com/7.x/personas/svg?seed=choi' }
    ],
    recommenders: [
      {
        id: '8', name: '신현준', image: 'https://api.dicebear.com/7.x/personas/svg?seed=shin',
        certified: true, trustLevel: 3, lastAction: '3일 전'
      },
      {
        id: '9', name: '권지영', image: 'https://api.dicebear.com/7.x/personas/svg?seed=kwon',
        certified: false, trustLevel: 2, lastAction: '1일 전'
      }
    ],
    recommendees: [
      {
        id: '10', name: '이지훈', image: 'https://api.dicebear.com/7.x/personas/svg?seed=jihoon',
        certified: true, trustLevel: 1, lastAction: '2시간 전'
      },
      {
        id: '11', name: '서하은', image: 'https://api.dicebear.com/7.x/personas/svg?seed=seo',
        certified: false, trustLevel: 1, lastAction: '1일 전'
      },
      {
        id: '12', name: '김민준', image: 'https://api.dicebear.com/7.x/personas/svg?seed=minjun',
        certified: true, trustLevel: 2, lastAction: '5일 전'
      }
    ],
    family: [
      {
        id: '13', name: '김지영', image: 'https://api.dicebear.com/7.x/personas/svg?seed=jiyoung',
        level: '가디언' as const, certified: true, description: '피어몰 인증/사업권 담당'
      },
      {
        id: '14', name: '김지훈', image: 'https://api.dicebear.com/7.x/personas/svg?seed=jihun',
        level: '퍼실리테이터' as const, certified: false, description: '운영 지원 및 컨설팅'
      },
      {
        id: '15', name: '이지은', image: 'https://api.dicebear.com/7.x/personas/svg?seed=jiyeon',
        level: '기본' as const, certified: false, description: '기본 사용자'
      }
    ]
  };

  const activities = [
    { 
      id: '1', 
      type: '콘텐츠', 
      title: '디자인 가이드 작성', 
      timestamp: '오늘 14:30',
      details: '디자인 트렌드에 관한 가이드 작성'
    },
    { 
      id: '2', 
      type: '리뷰',
      title: '푸드 마켓 방문 리뷰', 
      timestamp: '어제',
      image: 'https://images.unsplash.com/photo-1581931668943-4696bef379c4?auto=format&fit=crop&w=300'
    },
    { 
      id: '3', 
      type: '퀘스트', 
      title: '디자인 퀘스트 완료', 
      timestamp: '3일 전',
      details: '디자인 마스터 퀘스트 3단계 완료'
    }
  ];
  
  const transactions = [
    {
      id: '1',
      type: 'purchase' as const,
      title: '디자인 툴킷 구매',
      amount: -45000,
      timestamp: '어제',
      status: 'completed' as const
    },
    {
      id: '2',
      type: 'reward' as const,
      title: '리뷰 작성 보상',
      amount: 5000,
      timestamp: '3일 전',
      status: 'completed' as const
    },
    {
      id: '3',
      type: 'refund' as const,
      title: '상품 반품 환불',
      amount: 25000,
      timestamp: '일주일 전',
      status: 'pending' as const
    }
  ];
  
  const badges = [
    {
      id: '1',
      name: '디자인 마스터',
      image: 'https://api.dicebear.com/7.x/icons/svg?seed=design',
      rarity: 'rare' as const,
      acquiredDate: '2023-12-15',
      description: '10개 이상의 디자인 가이드를 작성한 사용자'
    },
    {
      id: '2',
      name: '리뷰어',
      image: 'https://api.dicebear.com/7.x/icons/svg?seed=review',
      rarity: 'common' as const,
      acquiredDate: '2023-10-05',
      description: '5개 이상의 리뷰를 작성한 사용자'
    },
    {
      id: '3',
      name: '퀘스트 마스터',
      image: 'https://api.dicebear.com/7.x/icons/svg?seed=quest',
      rarity: 'uncommon' as const,
      acquiredDate: '2024-01-20',
      description: '20개 이상의 퀘스트를 완료한 사용자'
    },
    {
      id: '4',
      name: '얼리 어답터',
      image: 'https://api.dicebear.com/7.x/icons/svg?seed=early',
      rarity: 'epic' as const,
      acquiredDate: '2023-05-10',
      description: '피어몰 초기 사용자'
    },
    {
      id: '5',
      name: '소셜 버터플라이',
      image: 'https://api.dicebear.com/7.x/icons/svg?seed=social',
      rarity: 'uncommon' as const,
      acquiredDate: '2023-11-25',
      description: '10명 이상과 친구를 맺은 사용자'
    },
    {
      id: '6',
      name: '콘텐츠 크리에이터',
      image: 'https://api.dicebear.com/7.x/icons/svg?seed=content',
      rarity: 'rare' as const,
      acquiredDate: '2024-02-05',
      description: '20개 이상의 콘텐츠를 작성한 사용자'
    }
  ];
  
  const quests = [
    {
      id: '1',
      title: '디자인 가이드 시리즈',
      progress: 70,
      deadline: '2024-05-15',
      reward: '디자인 마스터 뱃지 + 10,000 포인트'
    },
    {
      id: '2',
      title: '리뷰어 육성',
      progress: 40,
      reward: '리뷰어 뱃지 + 5,000 포인트'
    },
    {
      id: '3',
      title: '커뮤니티 빌더',
      progress: 25,
      deadline: '2024-06-30',
      reward: '커뮤니티 뱃지 + 15,000 포인트'
    }
  ];
  
  const points = {
    total: 45600,
    history: [
      { period: '이번 달', amount: 12500 },
      { period: '지난 달', amount: 8700 },
      { period: '3개월 전', amount: -1500 }
    ]
  };
  
  const followedMalls: PeerMall[] = [
    { 
      id: 101, 
      name: '이지우의 디자인 랩',
      type: '디자인 커뮤니티',
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=design',
      createdAt: '2023-05-15',
      status: 'active',
      visibility: 'public'
    },
    { 
      id: 102, 
      name: '푸드 히어로즈',
      type: '식품 쇼핑몰',
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=food',
      createdAt: '2023-07-22',
      status: 'active',
      visibility: 'public'
    },
    { 
      id: 103, 
      name: '테크 인사이더',
      type: '기술 커뮤니티',
      image: 'https://api.dicebear.com/7.x/shapes/svg?seed=tech',
      createdAt: '2023-09-10',
      status: 'active',
      visibility: 'public'
    }
  ];

  const contents = [
    {
      id: '1',
      title: '2024년 UI/UX 디자인 트렌드',
      type: '가이드',
      createdAt: '2024-03-15',
      status: 'published' as const,
      views: 1234,
      likes: 87
    },
    {
      id: '2',
      title: '푸드 스타일링 기초 가이드',
      type: '튜토리얼',
      createdAt: '2024-02-10',
      status: 'published' as const,
      views: 856,
      likes: 42
    },
    {
      id: '3',
      title: '디지털 아트 작업 과정',
      type: '프로세스',
      createdAt: '2024-04-02',
      status: 'draft' as const,
      thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300'
    },
    {
      id: '4',
      title: '초보자를 위한 웹 디자인 가이드',
      type: '가이드',
      createdAt: '2024-01-20',
      status: 'published' as const,
      views: 2145,
      likes: 156
    }
  ];

  const savedItems = [
    {
      id: '1',
      title: '효과적인 브랜딩 전략',
      type: 'content' as const,
      source: '디자인 랩',
      savedAt: '2024-04-10',
      thumbnail: 'https://images.unsplash.com/photo-1672701527516-d11ec74c1fc3?auto=format&fit=crop&w=300'
    },
    {
      id: '2',
      title: '프리미엄 스케치북 세트',
      type: 'product' as const,
      source: '아트 서플라이',
      savedAt: '2024-03-28'
    },
    {
      id: '3',
      title: '디자인 씽킹의 5단계',
      type: 'content' as const,
      source: '이지우의 디자인 랩',
      savedAt: '2024-03-15'
    },
    {
      id: '4',
      title: '아이패드 프로 M2',
      type: 'product' as const,
      source: '테크 마켓',
      savedAt: '2024-02-20',
      thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300'
    },
    {
      id: '5',
      title: '사용자 인터뷰 기법 10가지',
      type: 'content' as const,
      source: 'UX 리서치 허브',
      savedAt: '2024-02-10'
    }
  ];

  const reviews = [
    {
      id: '1',
      title: '놀라운 디자인 경험',
      content: '이 디자인 툴킷은 정말 훌륭합니다. 다양한 템플릿과 에셋이 포함되어 있어 작업 효율이 크게 향상되었습니다. 특히 색상 팔레트 기능이 매우 유용했습니다. 디자인 작업을 하시는 분들께 강력 추천합니다.',
      target: '프리미엄 디자인 툴킷',
      rating: 5,
      createdAt: '2024-03-25',
      likes: 12
    },
    {
      id: '2',
      title: '괜찮은 푸드 마켓',
      content: '제품의 신선도는 ��았으나, 배송이 조금 늦어서 아쉬웠습니다. 그래도 전체적인 품질과 서비스는 만족스러웠습니다. 특히 유기농 채소의 품질이 매우 좋았습니다.',
      target: '에코 푸드 마켓',
      rating: 4,
      createdAt: '2024-02-18',
      likes: 5
    },
    {
      id: '3',
      title: '획기적인 디자인 도구',
      content: '사용하기 쉽고 직관적인 인터페이스로 디자인 작업이 훨씬 수월해졌습니다. 다양한 기능과 플러그인 지원도 인상적입니다. 디자이너라면 꼭 사용해보세요.',
      target: '디자인 캔버스 프로',
      rating: 5,
      createdAt: '2024-01-10',
      likes: 28
    }
  ];

  const messages = [
    {
      id: '1',
      from: {
        name: '이지우',
        image: 'https://api.dicebear.com/7.x/personas/svg?seed=jiwoo'
      },
      preview: '안녕하세요! 디자인 프로젝트 관련 문의드립니다.',
      time: '10분 전',
      unread: true
    },
    {
      id: '2',
      from: {
        name: '테크마켓',
        image: 'https://api.dicebear.com/7.x/shapes/svg?seed=techmarket'
      },
      preview: '주문하신 상품이 발송되었습니다. 배송 조회는...',
      time: '2시간 전',
      unread: true
    },
    {
      id: '3',
      from: {
        name: '김유진',
        image: 'https://api.dicebear.com/7.x/personas/svg?seed=kim'
      },
      preview: '지난번 협업 감사합니다. 다음 프로젝트도 함께 진행하면 좋겠네요.',
      time: '어제',
      unread: false
    }
  ];

  const notificationSettings = [
    {
      id: '1',
      type: '메시지 알림',
      description: '새로운 메시지가 도착했을 때 알림을 받습니다',
      enabled: true
    },
    {
      id: '2',
      type: '비공개 방 초대',
      description: '비공개 방 초대를 받았을 때 알림을 받습니다',
      enabled: true
    },
    {
      id: '3',
      type: '리뷰 반응',
      description: '내가 작성한 리뷰에 반응이 있을 때 알림을 받습니다',
      enabled: false
    }
  ];

  const qrCodes = [
    {
      id: '1',
      name: '내 피어몰 QR',
      purpose: '디자인 스튜디오 접속용',
      createdAt: '2024-01-15',
      image: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://peermall.com/space/design-studio',
      usageCount: 142
    },
    {
      id: '2',
      name: '디지털 명함',
      purpose: '프로필 공유용',
      createdAt: '2024-02-20',
      image: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://peermall.com/user/PN7829354',
      usageCount: 87
    },
    {
      id: '3',
      name: '이벤트 QR',
      purpose: '디자인 세미나 참가 인증',
      createdAt: '2024-03-05',
      image: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://peermall.com/event/design-seminar',
      usageCount: 34
    }
  ];

  const dataExportOptions = [
    {
      id: '1',
      name: '프로필 정보',
      description: '기본 프로필 및 개인정보',
      selected: true
    },
    {
      id: '2',
      name: '활동 내역',
      description: '피어몰 내 모든 활동 기록',
      selected: true
    },
    {
      id: '3',
      name: '콘텐츠 데이터',
      description: '작성한 글, 리뷰, 댓글 등',
      selected: true
    },
    {
      id: '4',
      name: '메시지 기록',
      description: '모든 메시지 내역',
      selected: false
    }
  ];

  const analyticsData = [
    {
      label: '방문한 피어몰',
      value: 24,
      change: 12,
      trend: 'up' as const
    },
    {
      label: '작성 콘텐츠',
      value: 18,
      change: 5,
      trend: 'up' as const
    },
    {
      label: '획득 포인트',
      value: 12500,
      change: 8,
      trend: 'up' as const
    },
    {
      label: '월간 활동일',
      value: 22,
      change: 0,
      trend: 'neutral' as const
    }
  ];

  const initDB = async () => {
    return await openDB('peermall-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('peermalls')) {
          const store = db.createObjectStore('peermalls', {
            keyPath: 'id',
            autoIncrement: true
          });
          store.createIndex('by-name', 'name');
        }
      }
    });
  };

  const loadPeermalls = async () => {
    try {
      const db = await initDB();
      const peermalls = await db.getAll('peermalls');
      if (peermalls.length > 0) {
        // Add visibility property to PeerMall objects
        const updatedPeermalls = peermalls.map(mall => ({
          ...mall,
          status: 'active' as const,
          visibility: 'public' as const,
          stats: {
            visitors: Math.floor(Math.random() * 1000),
            followers: Math.floor(Math.random() * 100),
            reviews: Math.floor(Math.random() * 50)
          }
        }));
        setCreatedMalls(updatedPeermalls);
      } else {
        setCreatedMalls([{ 
          id: 1, 
          name: '디자인 스튜디오', 
          type: '디자인 커뮤니티', 
          createdAt: '2024-01-15',
          status: 'active',
          visibility: 'public',
          stats: {
            visitors: 324,
            followers: 52,
            reviews: 18
          }
        }]);
      }
    } catch (error) {
      console.error("피어몰 로딩 실패:", error);
    }
  };

  const handleCreatePeermall = () => {
    setIsCreateModalOpen(true);
  };

  useEffect(() => {
    loadPeermalls();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">내 정보 관리</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <input
              placeholder="검색..."
              className="pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <Tabs orientation="vertical" defaultValue="profile" className="w-full lg:flex lg:flex-row">
          <div className="w-full lg:w-64 mb-6 lg:mb-0">
            <TabsList className="flex lg:flex-col justify-start lg:justify-start gap-2 lg:gap-4">
              <TabsTrigger value="profile" className="w-full justify-start">내 정보</TabsTrigger>
              {/* <TabsTrigger value="content" className="w-full justify-start">콘텐츠</TabsTrigger> */}
              {/* <TabsTrigger value="network" className="w-full justify-start">네트워크</TabsTrigger> */}
              {/* <TabsTrigger value="peermall" className="w-full justify-start">피어몰 관리</TabsTrigger> */}
            </TabsList>
          </div>
          <div className="flex-1">
            <TabsContent value="profile">
              <div className="space-y-6">
                <ProfileSection userProfile={userProfile} setUserProfile={setUserProfile} />
                {/* <SecuritySection
                  authMethods={authMethods}
                  loginRecords={loginRecords}
                  privacySettings={privacySettings}
                /> */}
                {/* <SettingsSection
                  darkMode={false}
                  language="ko"
                  dataExportOptions={dataExportOptions}
                  analyticsData={analyticsData}
                /> */}
              </div>
            </TabsContent>
            <TabsContent value="content">
              <div className="space-y-6">
                <ContentSection
                  contents={contents}
                  savedItems={savedItems}
                  reviews={reviews}
                />
                {/* <ActivitySection
                  activities={activities}
                  transactions={transactions}
                  level={14}
                  maxLevel={50}
                  experience={7500}
                  nextLevelExperience={10000}
                  badges={badges}
                  quests={quests}
                  points={points}
                /> */}
              </div>
            </TabsContent>
            <TabsContent value="network">
              <div className="space-y-6">
                <NetworkSection {...networkData} />
                {/* <CommunicationSection
                  messages={messages}
                  notificationSettings={notificationSettings}
                /> */}
                {/* <QRCodeSection qrCodes={qrCodes} /> */}
              </div>
            </TabsContent>
            <TabsContent value="peermall">
              <div className="space-y-6">
                <PeermallManagementSection
                  createdMalls={createdMalls}
                  followedMalls={followedMalls}
                  onCreatePeermall={handleCreatePeermall}
                  onManageMall={(id) => console.log('Managing mall:', id)}
                  onDeleteMall={(id) => console.log('Deleting mall:', id)}
                  onTransferMall={(id) => console.log('Transferring mall:', id)}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      
      {/* <CreatePeermallModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={async (peermallData) => {
          try {
            const db = await initDB();
            await db.add('peermalls', {
              name: peermallData.name,
              type: peermallData.type || '기타',
              createdAt: new Date().toISOString().slice(0, 10),
              visibility: 'public',
              status: 'active',
              stats: {
                visitors: 0,
                followers: 0,
                reviews: 0
              }
            });
            loadPeermalls();
          } catch (error) {
            console.error("피어몰 생성 실패:", error);
          }
        }}
      /> */}
    </div>
  );
};

export default MyInfoPage;
