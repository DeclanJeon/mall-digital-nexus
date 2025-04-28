import React, { useState, useEffect, useCallback } from 'react';
import { openDB, DBSchema } from 'idb';

interface PeermallDB extends DBSchema {
  peermalls: {
    key: number;
    value: PeerMall;
    indexes: { 'by-name': string };
  };
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, User, Search, Plus, Minus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CreatePeermallModal from '@/components/CreatePeermallModal';

interface Service {
  id: number;
  title: string;
  owner: string;
  description: string;
  tags: string[];
  views: number;
  rating: number;
}

interface PeerMall {
  id: number;
  name: string;
  type: string;
  createdAt: string;
}

const initDB = async () => {
  return await openDB<PeermallDB>('peermall-db', 1, {
    upgrade(db) {
      const store = db.createObjectStore('peermalls', {
        keyPath: 'id',
        autoIncrement: true
      });
      store.createIndex('by-name', 'name');
    }
  });
};

const MyInfoPage = () => {
  const [activeTab, setActiveTab] = useState('내 정보');
  const [services, setServices] = useState<Service[]>([]);
  const [peerMalls, setPeerMalls] = useState<PeerMall[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: '김민지',
    peerNumber: 'PN7829354',
    email: 'example@peermall.com',
    phone: '',
    profileImage: 'https://api.dicebear.com/7.x/personas/svg?seed=currentUser',
    badges: ['디자인', '푸드', '테크', '아트'],
    recommenders: 5
  });

  const [newBadge, setNewBadge] = useState('');

  const handleAddBadge = () => {
    if (newBadge.trim() && userProfile.badges.length < 10 && !userProfile.badges.includes(newBadge)) {
      setUserProfile({
        ...userProfile,
        badges: [...userProfile.badges, newBadge]
      });
      setNewBadge('');
    }
  };

  const handleRemoveBadge = (badgeToRemove: string) => {
    setUserProfile({
      ...userProfile,
      badges: userProfile.badges.filter(badge => badge !== badgeToRemove)
    });
  };

  const loadPeermalls = useCallback(async () => {
    const db = await initDB();
    const peermalls = await db.getAll('peermalls');
    setPeerMalls(peermalls);
  }, []);

  const addPeermall = async (peermall: Omit<PeerMall, 'id'>) => {
    const db = await initDB();
    const id = await db.add('peermalls', {
      ...peermall,
      id: Date.now(), // 임시 ID 생성
      createdAt: new Date().toISOString()
    });
    loadPeermalls();
    return id;
  };

  useEffect(() => {
    loadPeermalls();
    
    setServices([
      {
        id: 1,
        title: '디자인 스튜디오',
        owner: '김민지',
        description: '저품 그래픽 디자이너가 제공하는 그룹화 디자인 서비스와 팁들',
        tags: ['디자인', '그래픽', '#템플릿'],
        views: 124,
        rating: 4.9
      },
      {
        id: 2,
        title: '친환경 생활용품',
        owner: '에코라이프',
        description: '지속가능한 생활을 위한 친환경 제품과 제로웨이스트 솔루션',
        tags: ['에코', '친환경'],
        views: 89,
        rating: 4.7
      }
    ]);

    setPeerMalls([
      { id: 1, name: '나의 첫 피어몰', type: '쇼핑몰', createdAt: '2023-01-15' },
      { id: 2, name: '디자인 커뮤니티', type: '커뮤니티', createdAt: '2023-03-22' }
    ]);
  }, []);

  const ProfileSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userProfile.profileImage} />
            <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
            <CardDescription>피어넘버: {userProfile.peerNumber}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">이메일</p>
          <Input 
            value={userProfile.email}
            onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
            className="mt-1"
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">전화번호</p>
          <Input 
            value={userProfile.phone}
            onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
            className="mt-1"
            placeholder="전화번호를 입력하세요"
          />
        </div>
        <div className="col-span-2">
          <p className="text-sm text-muted-foreground">관심 분야 (최대 10개)</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {userProfile.badges.map((badge, index) => (
              <div key={index} className="relative">
                <span className="px-3 py-1 bg-muted rounded-full text-sm">
                  #{badge}
                </span>
                <button 
                  onClick={() => handleRemoveBadge(badge)}
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          {userProfile.badges.length < 10 && (
            <div className="flex gap-2 mt-2">
              <Input
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                placeholder="새 관심 분야 추가"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={handleAddBadge}
                disabled={!newBadge.trim()}
              >
                추가
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const MyPeerMallsSection = () => (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>내 피어몰</CardTitle>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> 새 피어몰 만들기
        </Button>
      </CardHeader>
      <CardContent>
        {peerMalls.map(mall => (
          <div key={mall.id} className="flex justify-between items-center p-4 border rounded-lg mb-4">
            <div>
              <h3 className="font-semibold">{mall.name}</h3>
              <p className="text-sm text-muted-foreground">{mall.type} • {mall.createdAt}</p>
            </div>
            <Button variant="outline">관리</Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  const MyNetworkSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>내 네트워크</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">추천인 / 피추천인</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold">{userProfile.recommenders}</p>
            <p className="text-sm text-muted-foreground">추천인</p>
            <Button variant="outline" className="w-full mt-2">신뢰 그룹 보기</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">친구 / 팔로우</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold">23</p>
            <p className="text-sm text-muted-foreground">팔로잉</p>
            <Button variant="outline" className="w-full mt-2">관계 관리</Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );

  const MyActivitySection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>내 활동</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">28</p>
          <p className="text-sm text-muted-foreground">작성한 콘텐츠</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">16</p>
          <p className="text-sm text-muted-foreground">참여 퀘스트</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">7</p>
          <p className="text-sm text-muted-foreground">획득 뱃지</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">내 정보 관리</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProfileSection />
          <MyPeerMallsSection />
          <MyNetworkSection />
          <MyActivitySection />
        </div>
        
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-0">
              <div className="relative h-96 bg-muted">
                <iframe 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=126.9%2C37.5%2C127.1%2C37.6&layer=mapnik"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="absolute inset-0"
                ></iframe>
                <div className="absolute top-2 right-2 flex flex-col space-y-2">
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="absolute top-2 left-2 flex bg-background rounded-md shadow">
                  <Button variant="default" size="sm">
                    일반지도
                  </Button>
                  <Button variant="ghost" size="sm">
                    위성지도
                  </Button>
                </div>
                <div className="absolute bottom-24 right-2">
                  <Button variant="outline" size="sm">
                    내 위치
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex bg-background rounded-md shadow">
                  <input
                    type="text"
                    placeholder="피어몰 검색"
                    className="flex-1 p-2 outline-none bg-transparent"
                  />
                  <Button variant="ghost" size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">피어몰 리뷰</h3>
                <p className="text-sm text-muted-foreground">선택한 피어몰의 리뷰가 없습니다.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreatePeermallModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={async (peermallData) => {
          await addPeermall({
            name: peermallData.name,
            type: peermallData.type || '기타',
            createdAt: new Date().toISOString()
          });
        }}
      />
    </div>
  );
};

export default MyInfoPage;
