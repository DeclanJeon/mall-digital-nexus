import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, GitPullRequest, X } from 'lucide-react';

interface NetworkUser {
  id: string;
  name: string;
  image?: string;
  role?: string;    // 예: '가디언', '퍼실리테이터', '일반'
  level?: string;   // 예: '인증회원', '비인증회원'
}

const STORAGE_KEYS = {
  recommenders: 'peer_recommenders',
  family: 'peer_family'
};

function loadFromStorage(key: string): NetworkUser[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
function saveToStorage(key: string, users: NetworkUser[]) {
  localStorage.setItem(key, JSON.stringify(users));
}

const NetworkSection: React.FC = () => {
  // 추천인 및 패밀리 멤버 스테이트
  const [recommenders, setRecommenders] = useState<NetworkUser[]>([]);
  const [family, setFamily] = useState<NetworkUser[]>([]);

  // 입력값
  const [recommenderName, setRecommenderName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyRole, setFamilyRole] = useState('일반');

  // 로컬 스토리지에서 불러오기
  useEffect(() => {
    setRecommenders(loadFromStorage(STORAGE_KEYS.recommenders));
    setFamily(loadFromStorage(STORAGE_KEYS.family));
  }, []);

  // 저장 함수
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.recommenders, recommenders);
  }, [recommenders]);
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.family, family);
  }, [family]);

  // 추천인 추가
  const handleAddRecommender = () => {
    if (recommenders.length >= 7) {
      alert('추천인은 최대 7명까지 등록할 수 있습니다.');
      return;
    }
    if (recommenderName.trim() === '') return;
    const newUser: NetworkUser = {
      id: String(Date.now()),
      name: recommenderName.trim(),
      level: '인증회원'
    };
    setRecommenders([...recommenders, newUser]);
    setRecommenderName('');
  };
  // 추천인 삭제
  const handleRemoveRecommender = (id: string) => {
    setRecommenders(recommenders.filter(u => u.id !== id));
  };

  // 패밀리 멤버 추가
  const handleAddFamily = () => {
    if (familyName.trim() === '') return;
    const newFamily: NetworkUser = {
      id: String(Date.now()),
      name: familyName.trim(),
      role: familyRole
    };
    setFamily([...family, newFamily]);
    setFamilyName('');
    setFamilyRole('일반');
  };
  // 패밀리 멤버 삭제
  const handleRemoveFamily = (id: string) => {
    setFamily(family.filter(u => u.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-primary" />
          내 네트워크
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trust">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="trust">신뢰 그룹</TabsTrigger>
            <TabsTrigger value="family">패밀리</TabsTrigger>
            {/* 확장: 친구, 팔로우 등 */}
          </TabsList>

          {/* 신뢰 그룹(추천인) */}
          <TabsContent value="trust" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">
                  신뢰 그룹 (추천인) <span className="text-xs text-muted-foreground">(최대 7명)</span>
                </h3>
                <div className="text-xs text-muted-foreground">
                  7인의 추천인을 등록해야 전체 기능이 활성화됩니다.
                </div>
              </div>
              <Button variant="outline" size="sm">
                <GitPullRequest className="h-4 w-4 mr-2" />
                신뢰 그룹 시각화
              </Button>
            </div>
            <div>
              <form
                className="flex gap-2 mb-2"
                onSubmit={e => {
                  e.preventDefault();
                  handleAddRecommender();
                }}
              >
                <input
                  type="text"
                  placeholder="추천인 이름 입력"
                  value={recommenderName}
                  maxLength={12}
                  onChange={e => setRecommenderName(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                />
                <Button type="submit" size="sm" disabled={recommenders.length >= 7}>추가</Button>
              </form>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {recommenders.map(user => (
                  <div key={user.id} className="flex items-center p-2 bg-muted rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="ml-2 text-sm">{user.name}</span>
                    <span className="ml-2 text-xs text-green-600">{user.level}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveRecommender(user.id)}
                      className="ml-auto"
                      title="삭제"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {recommenders.length < 7 && (
                <div className="text-xs text-muted-foreground mt-2">
                  {7 - recommenders.length}명 더 등록 필요
                </div>
              )}
              {recommenders.length === 7 && (
                <div className="text-xs text-green-600 mt-2">
                  7인 추천인 등록 완료! 모든 기능이 활성화됩니다.
                </div>
              )}
            </div>
          </TabsContent>

          {/* 패밀리 멤버 */}
          <TabsContent value="family" className="space-y-4">
            <h3 className="font-medium">패밀리 멤버</h3>
            <form
              className="flex gap-2 items-center mb-2"
              onSubmit={e => {
                e.preventDefault();
                handleAddFamily();
              }}
            >
              <input
                type="text"
                placeholder="패밀리 멤버 이름"
                value={familyName}
                maxLength={12}
                onChange={e => setFamilyName(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
              <select
                value={familyRole}
                onChange={e => setFamilyRole(e.target.value)}
                className="border rounded px-1 py-1 text-sm"
              >
                <option value="일반">일반</option>
                <option value="가디언">가디언</option>
                <option value="퍼실리테이터">퍼실리테이터</option>
              </select>
              <Button type="submit" size="sm">추가</Button>
            </form>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {family.map(member => (
                <div key={member.id} className="flex items-center p-2 bg-muted rounded-md">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm">{member.name}</span>
                  <span className="ml-2 text-xs text-blue-500">{member.role}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveFamily(member.id)}
                    className="ml-auto"
                    title="삭제"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NetworkSection;
