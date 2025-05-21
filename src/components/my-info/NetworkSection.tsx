import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

// Friend 타입 정의
interface Friend {
  id: string;
  name: string;
  image: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
}

// Family Member 등급 및 역할 추가
interface FamilyMember {
  id: string;
  name: string;
  image: string;
  level?: '기본' | '가디언' | '퍼실리테이터';
  certified?: boolean;
  description?: string;
}

// 추천인 등 신뢰/인증 상태 표현
interface Recommender {
  id: string;
  name: string;
  image: string;
  trustLevel?: number;
  certified?: boolean;
  lastAction?: string;
}

export interface NetworkSectionProps {
  friends: Friend[];
  followers: { id: string; name: string; image: string }[];
  following: { id: string; name: string; image: string }[];
  recommenders: Recommender[];
  recommendees: Recommender[];
  family: FamilyMember[];
}

type NetworkItem = {
  id: string;
  name: string;
  image: string;
  certified?: boolean;
  trustLevel?: number;
  lastAction?: string;
  level?: '기본' | '가디언' | '퍼실리테이터';
  description?: string;
};

const NetworkSection: React.FC<NetworkSectionProps> = (props) => {
  // 1) 로컬 스토리지 키 선언
  const STORAGE_KEY_DATA = 'peerMall_networkData';
  const STORAGE_KEY_TAB = 'peerMall_activeTab';

  // 2) 네트워크 전체 데이터를 하나의 state로 관리
  const [networkData, setNetworkData] = useState<NetworkSectionProps>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // 파싱 실패 시 fallthrough
        }
      }
    }
    // 저장된 값 없으면 props 초기값 사용
    return { ...props };
  });

  // 3) 활성 탭 상태 관리 (로컬 스토리지 동기화)
  const [activeTab, setActiveTab] = useState<
    'recommenders' | 'recommendees' | 'family'
  >(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem(STORAGE_KEY_TAB);
      if (t === 'recommenders' || t === 'recommendees' || t === 'family') {
        return t;
      }
    }
    return 'recommenders';
  });

  // 4) 상태별 인디케이터 컬러
  const getStatusIndicatorClass = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  // 5) 검색 필터 함수
  const [searchQuery, setSearchQuery] = useState('');
  const filterBySearch = (items: NetworkItem[]) => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // 6) 로컬 스토리지에 데이터 동기화
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(networkData));
  }, [networkData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TAB, activeTab);
  }, [activeTab]);

  // 7) 인터랙션 핸들러들
  const removeRecommender = (id: string) => {
    setNetworkData((prev) => ({
      ...prev,
      recommenders: prev.recommenders.filter((u) => u.id !== id),
    }));
  };

  const removeRecommendee = (id: string) => {
    setNetworkData((prev) => ({
      ...prev,
      recommendees: prev.recommendees.filter((u) => u.id !== id),
    }));
  };

  const requestCertification = (id: string) => {
    setNetworkData((prev) => ({
      ...prev,
      family: prev.family.map((m) =>
        m.id === id ? { ...m, certified: true } : m
      ),
    }));
  };

  return (
    <Card className="overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as 'recommenders' | 'recommendees' | 'family')
        }
      >
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-wrap items-center justify-between">
            <CardTitle className="text-lg font-medium">내 네트워크</CardTitle>
            <div className="relative mt-2 sm:mt-0">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="이름으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 w-full sm:w-[180px]"
              />
            </div>
          </div>
          <TabsList className="mt-2 flex-wrap h-auto">
            <TabsTrigger value="recommenders">
              추천인 ({networkData.recommenders.length})
            </TabsTrigger>
            <TabsTrigger value="recommendees">
              피추천인 ({networkData.recommendees.length})
            </TabsTrigger>
            <TabsTrigger value="family">
              패밀리 멤버 ({networkData.family.length})
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="p-4">
          {/* 추천인 탭 */}
          <TabsContent value="recommenders">
            <div className="mb-4 text-xs text-gray-500">
              7명의 인증된 추천인이 필요해요! 인증회원은{' '}
              <Badge
                className="mx-1 bg-emerald-100 text-emerald-800 border-emerald-200"
                variant="outline"
              >
                인증
              </Badge>
              뱃지를 갖습니다.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(networkData.recommenders).map((u) => (
                <div
                  key={u.id}
                  className="flex items-center p-3 border border-green-100 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Avatar className="h-10 w-10 border border-green-200">
                    <AvatarImage src={u.image} alt={u.name} />
                    <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">{u.name}</p>
                      {u.certified && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                        >
                          인증
                        </Badge>
                      )}
                      {u.trustLevel && (
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-600 border-indigo-200 text-xs"
                        >
                          LV.{u.trustLevel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {u.lastAction || '최근 활동 정보 없음'}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRecommender(u.id)}
                  >
                    제거
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 피추천인 탭 */}
          <TabsContent value="recommendees">
            <div className="mb-4 text-xs text-gray-500">
              내가 신뢰를 부여한 피추천인 목록입니다.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(networkData.recommendees).map((u) => (
                <div
                  key={u.id}
                  className="flex items-center p-3 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Avatar className="h-10 w-10 border border-blue-200">
                    <AvatarImage src={u.image} alt={u.name} />
                    <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">{u.name}</p>
                      {u.certified && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                        >
                          인증
                        </Badge>
                      )}
                      {u.trustLevel && (
                        <Badge
                          variant="outline"
                          className="bg-indigo-50 text-indigo-600 border-indigo-200 text-xs"
                        >
                          LV.{u.trustLevel}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {u.lastAction || '최근 활동 정보 없음'}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeRecommendee(u.id)}
                  >
                    취소
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* 패밀리 멤버 탭 */}
          <TabsContent value="family">
            <div className="mb-4 text-xs text-gray-500">
              패밀리 멤버는 운영·인증을 지원합니다.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterBySearch(networkData.family).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center p-3 border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Avatar className="h-10 w-10 border border-rose-200">
                    <AvatarImage src={m.image} alt={m.name} />
                    <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">{m.name}</p>
                      {m.level && (
                        <Badge
                          variant="outline"
                          className={
                            m.level === '가디언'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200 text-xs'
                              : m.level === '퍼실리테이터'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 text-xs'
                              : 'bg-pink-50 text-pink-600 border-pink-200 text-xs'
                          }
                        >
                          {m.level}
                        </Badge>
                      )}
                      {m.certified && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                        >
                          인증됨
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {m.description || '운영 지원 멤버'}
                    </p>
                  </div>
                  <Button
                    variant={m.certified ? 'outline' : 'default'}
                    size="sm"
                    disabled={m.certified}
                    onClick={() => requestCertification(m.id)}
                  >
                    {m.certified ? '완료' : '인증 요청'}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default NetworkSection;
