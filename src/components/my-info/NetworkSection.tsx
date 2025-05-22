// src/components/my-info/NetworkSection.tsx

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

// 친구 타입
interface Friend {
  id: string;
  name: string;
  image: string;
  status?: 'online' | 'offline' | 'away';
  lastActive?: string;
}

// 패밀리 멤버 타입
interface FamilyMember {
  id: string;
  name: string;
  image: string;
  level?: '기본' | '가디언' | '퍼실리테이터';
  certified?: boolean;
  description?: string;
}

// 추천인/피추천인 타입
interface Recommender {
  id: string;
  name: string;
  image: string;
  trustLevel?: number;
  certified?: boolean;
  lastAction?: string;
}

// NetworkSection Props
export interface NetworkSectionProps {
  friends: Friend[];
  followers: { id: string; name: string; image: string }[];
  following: { id: string; name: string; image: string }[];
  recommenders: Recommender[];
  recommendees: Recommender[];
  family: FamilyMember[];
  backupRecommenders: Recommender[];
}

// 배열 필드는 무조건 빈 배열로 시작
const defaultNetwork: NetworkSectionProps = {
  friends: [],
  followers: [],
  following: [],
  recommenders: [],
  recommendees: [],
  family: [],
  backupRecommenders: [],
};

const STORAGE_KEY_DATA = 'peerMall_networkData';
const STORAGE_KEY_TAB = 'peerMall_activeTab';
const GRACE_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7일(ms)

const NetworkSection: React.FC<NetworkSectionProps> = (props) => {
  // 1) 전체 네트워크 상태 초기화 (로컬스토리지 병합 + 기본값 보장)
  const [networkData, setNetworkData] = useState<NetworkSectionProps>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...defaultNetwork,
            ...props,
            ...parsed,
          };
        } catch {
          // 파싱 실패 시 무시
        }
      }
    }
    return { ...defaultNetwork, ...props };
  });

  // 2) 활성 탭 관리 (로컬스토리지 동기화)
  const [activeTab, setActiveTab] = useState<
    'recommenders' | 'recommendees' | 'family' | 'backups'
  >(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem(STORAGE_KEY_TAB);
      if (
        t === 'recommenders' ||
        t === 'recommendees' ||
        t === 'family' ||
        t === 'backups'
      ) {
        return t;
      }
    }
    return 'recommenders';
  });

  // 검색 쿼리
  const [searchQuery, setSearchQuery] = useState('');

  // 인증 상태 & 비활성화 시각
  const [isCertified, setIsCertified] = useState(
    networkData.recommenders.length >= 7
  );
  const [deactivationTime, setDeactivationTime] = useState<number | null>(
    null
  );

  // 3) 추천인 수 변화에 따른 인증 상태 토글 & 데이터 저장
  useEffect(() => {
    const count = networkData.recommenders.length;
    const certifiedRecommenders = networkData.recommenders.filter(r => r.certified).length;
    
    // 7명 이상의 인증된 추천인이 있어야 완전한 인증 상태
    if (certifiedRecommenders >= 7) {
      setIsCertified(true);
      setDeactivationTime(null);
    } else if (isCertified) {
      setIsCertified(false);
      setDeactivationTime(Date.now());
    }
    localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(networkData));
  }, [networkData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TAB, activeTab);
  }, [activeTab]);

  // 4) 유예기간 남은 일수 계산
  const daysLeft =
    deactivationTime !== null
      ? Math.max(
          0,
          Math.ceil(
            (GRACE_PERIOD - (Date.now() - deactivationTime)) /
              (1000 * 60 * 60 * 24)
          )
        )
      : null;

  // 5) 이름 검색 필터
  const filterBySearch = <T extends { name: string }>(items: T[]) =>
    !searchQuery
      ? items
      : items.filter((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // 인증 상태에 따른 배지
  const CertificationBadge = ({ certified }: { certified?: boolean }) => (
    <Badge
      variant="outline"
      className={`${certified ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-amber-100 text-amber-800 border-amber-200'} text-xs`}
    >
      {certified ? '인증됨' : '미인증'}
    </Badge>
  );

  // 6) 인터랙션 핸들러
  const removeRecommender = (id: string) =>
    setNetworkData((prev) => ({
      ...prev,
      recommenders: prev.recommenders.filter((u) => u.id !== id),
    }));

  const removeRecommendee = (id: string) =>
    setNetworkData((prev) => ({
      ...prev,
      recommendees: prev.recommendees.filter((u) => u.id !== id),
    }));

  const requestCertification = (id: string) =>
    setNetworkData((prev) => ({
      ...prev,
      family: prev.family.map((m) =>
        m.id === id ? { ...m, certified: true } : m
      ),
    }));

  // 예비 추천인 추가/승격
  const [newBackup, setNewBackup] = useState<Recommender>({
    id: '',
    name: '',
    image: '',
    certified: false,
  });

  const addBackup = () => {
    if (newBackup.id && newBackup.name) {
      setNetworkData((prev) => ({
        ...prev,
        backupRecommenders: [...prev.backupRecommenders, newBackup],
      }));
      setNewBackup({ id: '', name: '', image: '', certified: false });
    }
  };

  const promoteBackup = (id: string) =>
    setNetworkData((prev) => {
      const sel = prev.backupRecommenders.find((b) => b.id === id)!;
      return {
        ...prev,
        recommenders: [
          ...prev.recommenders,
          { ...sel, certified: true, trustLevel: sel.trustLevel ?? 1 },
        ],
        backupRecommenders: prev.backupRecommenders.filter((b) => b.id !== id),
      };
    });

  // 7) 렌더링
  return (
    <Card className="overflow-hidden">
      <Tabs value={activeTab} onValueChange={(v: 'recommenders' | 'recommendees' | 'family' | 'backups') => setActiveTab(v)}>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-wrap items-center justify-between">
            <CardTitle className="text-lg font-medium">내 네트워크</CardTitle>
            {!isCertified && daysLeft! > 0 && (
              <div className="text-sm text-rose-600">
                인증이 일시 해제되었습니다. 유예기간 {daysLeft}일 남음.
              </div>
            )}
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
              추천인 ({networkData.recommenders?.length || 0}/7)
            </TabsTrigger>
            <TabsTrigger value="recommendees">
              피추천인 ({networkData.recommendees?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="family">
              패밀리 멤버 ({networkData.family?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="backups">
              예비 추천인 ({networkData.backupRecommenders?.length || 0})
            </TabsTrigger>
          </TabsList>
        </CardHeader>

        <CardContent className="p-4">
          {/* –– 추천인 탭 –– */}
          <TabsContent value="recommenders">
            <div className="mb-4 text-xs text-gray-500">
              <div className="flex items-center gap-2 mb-2">
                <span>7명의 인증된 추천인이 필요합니다:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  현재 {networkData.recommenders.filter(r => r.certified).length}/7
                </Badge>
              </div>
              <p>
                • 인증된 회원은 <CertificationBadge certified /> 뱃지를 갖습니다.
                <br />
                • 인증되지 않은 회원은 <CertificationBadge certified={false} />로 표시됩니다.
                <br />
                • 7명 미만 시 {daysLeft !== null ? `${daysLeft}일` : ''} 유예기간이 주어집니다.
              </p>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => promoteBackup(u.id)}
                      disabled={u.certified}
                    >
                      {u.certified ? '인증됨' : '인증'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeRecommender(u.id)}
                    >
                      제거
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* –– 피추천인 탭 –– */}
          <TabsContent value="recommendees">
            <div className="mb-4 text-xs text-gray-500">
              <div className="flex items-center gap-2 mb-2">
                <span>최소 3명의 예비 추천인 권장:</span>
                <Badge 
                  variant="outline" 
                  className={`${networkData.backupRecommenders.length >= 3 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                >
                  현재 {networkData.backupRecommenders.length}/3
                </Badge>
              </div>
              <p>• 메인 추천인 중 이탈 시 빠르게 대체할 수 있는 예비 추천인 목록입니다.</p>
              <p>• 예비 추천인은 인증된 회원이어야 메인 추천인으로 승격 가능합니다.</p>
              {networkData.backupRecommenders.length < 3 && (
                <p className="text-rose-600">• 경고: 예비 추천인이 부족합니다. 최소 3명 이상 추가하세요.</p>
              )}
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

          {/* –– 패밀리 멤버 탭 –– */}
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
                          {m.level === '가디언' && ' 👑'}
                          {m.level === '퍼실리테이터' && ' ✨'}
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

          {/* –– 예비 추천인 탭 –– */}
          <TabsContent value="backups">
            <div className="mb-4 text-xs text-gray-500">
              <div className="flex items-center gap-2 mb-2">
                <span>최소 3명의 예비 추천인 권장:</span>
                <Badge 
                  variant="outline" 
                  className={`${networkData.backupRecommenders.length >= 3 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                >
                  현재 {networkData.backupRecommenders.length}/3
                </Badge>
              </div>
              <p>• 메인 추천인 중 이탈 시 빠르게 대체할 수 있는 예비 추천인 목록입니다.</p>
              <p>• 예비 추천인은 인증된 회원이어야 메인 추천인으로 승격 가능합니다.</p>
              {networkData.backupRecommenders.length < 3 && (
                <p className="text-rose-600">• 경고: 예비 추천인이 부족합니다. 최소 3명 이상 추가하세요.</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <Input
                placeholder="ID"
                value={newBackup.id}
                onChange={(e) =>
                  setNewBackup({ ...newBackup, id: e.target.value })
                }
              />
              <Input
                placeholder="이름"
                value={newBackup.name}
                onChange={(e) =>
                  setNewBackup({ ...newBackup, name: e.target.value })
                }
              />
              <Button size="sm" onClick={addBackup}>
                추가
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {networkData.backupRecommenders.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-10 w-10 border border-gray-300">
                    <AvatarImage src={b.image} alt={b.name} />
                    <AvatarFallback>{b.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-medium">{b.name}</p>
                      {b.certified && (
                        <Badge
                          variant="outline"
                          className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                        >
                          인증됨
                        </Badge>
                      )}
                    </div>
                    {b.trustLevel && (
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < (b.trustLevel || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">(Lv.{b.trustLevel})</span>
                      </div>
                    )}
                  </div>
                  <Button size="sm" onClick={() => promoteBackup(b.id)}>
                    메인으로
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
