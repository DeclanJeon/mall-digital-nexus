
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  PlusCircle, 
  MessageSquare, 
  Heart, 
  Share, 
  Calendar, 
  TrendingUp, 
  User,
  Users
} from "lucide-react";
import { getCommunityStatistics } from "@/utils/storageUtils";
import CommunityTopicList from './CommunityTopicList';
import CommunityFeedList from './CommunityFeedList';
import CommunityActivity from './CommunityActivity';

// 커뮤니티 탭 타입 정의
type CommunityTab = 'feed' | 'topics' | 'trending' | 'my';

const Community = () => {
  const [activeTab, setActiveTab] = useState<CommunityTab>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [statistics, setStatistics] = useState({
    totalCommunities: 0,
    activeCommunities: 0,
    activeUsers: 0,
    todayPosts: 0
  });

  // 커뮤니티 통계 로드
  useEffect(() => {
    const stats = getCommunityStatistics();
    
    if (stats.totalCommunities > 0) {
      setStatistics(stats);
    } else {
      setStatistics({
        totalCommunities: 23,
        activeCommunities: 18,
        activeUsers: 487,
        todayPosts: 41
      });
    }
  }, []);

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">커뮤니티</h1>
        <p className="text-gray-500">다양한 관심사를 가진 사람들과 교류하고 정보를 나눠보세요</p>
      </div>
      
      {/* 검색 및 필터 섹션 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="커뮤니티 검색" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-primary hover:bg-primary/90 flex gap-2">
          <PlusCircle size={18} />
          <span>새 글 작성</span>
        </Button>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 왼쪽 사이드바 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 커뮤니티 통계 카드 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">커뮤니티 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">전체 커뮤니티</span>
                  <span className="font-medium">{statistics.totalCommunities}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">활성 사용자</span>
                  <span className="font-medium">{statistics.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">오늘 게시글</span>
                  <span className="font-medium">{statistics.todayPosts}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 인기 토픽 카드 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">인기 토픽</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">#디자인</Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">#프로그래밍</Badge>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">#마케팅</Badge>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">#창업</Badge>
                <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200">#커리어</Badge>
                <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">#취미</Badge>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200">#여행</Badge>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">#음식</Badge>
              </div>
            </CardContent>
          </Card>

          {/* 활동 내역 */}
          <CommunityActivity />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="lg:col-span-6">
          {/* 탭 네비게이션 */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CommunityTab)} className="mb-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="feed" className="flex gap-1 items-center">
                <MessageSquare className="h-4 w-4" />
                <span>피드</span>
              </TabsTrigger>
              <TabsTrigger value="topics" className="flex gap-1 items-center">
                <Users className="h-4 w-4" /> 
                <span>토픽</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex gap-1 items-center">
                <TrendingUp className="h-4 w-4" />
                <span>인기</span>
              </TabsTrigger>
              <TabsTrigger value="my" className="flex gap-1 items-center">
                <User className="h-4 w-4" />
                <span>내 활동</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed">
              <CommunityFeedList />
            </TabsContent>
            
            <TabsContent value="topics">
              <CommunityTopicList />
            </TabsContent>
            
            <TabsContent value="trending">
              <div className="flex flex-col gap-6">
                {/* 트렌딩 게시물 샘플 (실제로는 API나 상태에서 데이터를 가져옵니다) */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=trendy" />
                        <AvatarFallback>트렌</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">트렌디한 사용자</p>
                        <p className="text-gray-500 text-sm">인기 크리에이터</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">2025년 디자인 트렌드 예측</h3>
                    <p className="text-gray-600 mb-4">
                      최신 기술 발전과 사용자 경험 향상을 위한 디자인 트렌드를 분석해보았습니다. 
                      뉴모픽에서 글라스모픽까지, 트렌드는 계속 변화하고 있습니다...
                    </p>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> 342</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> 86</span>
                        <span className="flex items-center gap-1"><Share className="h-4 w-4" /> 52</span>
                      </div>
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> 3일 전</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=tech" />
                        <AvatarFallback>테크</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">테크 리뷰어</p>
                        <p className="text-gray-500 text-sm">기술 전문가</p>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">최신 AI 기술로 일상을 바꾸는 방법</h3>
                    <p className="text-gray-600 mb-4">
                      AI 기술이 빠르게 발전하면서 우리 일상에 많은 변화를 가져오고 있습니다. 
                      이 글에서는 실용적으로 적용할 수 있는 AI 도구들을 소개합니다...
                    </p>
                    <div className="flex justify-between text-gray-500 text-sm">
                      <div className="flex gap-4">
                        <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> 278</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" /> 64</span>
                        <span className="flex items-center gap-1"><Share className="h-4 w-4" /> 41</span>
                      </div>
                      <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> 5일 전</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="my">
              <div className="text-center py-12 border rounded-lg bg-gray-50">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">내 활동</h3>
                <p className="text-gray-500 mb-6">로그인하여 커뮤니티에서 활동하고 기록을 남겨보세요.</p>
                <Button>로그인</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="lg:col-span-3 space-y-6">
          {/* 인기 글 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">인기 글</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=300&q=80" 
                    alt="Popular post" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm line-clamp-2">2025년 창업 트렌드: 주목해야 할 5가지 분야</h4>
                  <p className="text-xs text-gray-500 mt-1">조회 1,245 • 3일 전</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=300&q=80" 
                    alt="Popular post" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm line-clamp-2">원격 근무 5년차가 알려주는 효율적인 업무 방식</h4>
                  <p className="text-xs text-gray-500 mt-1">조회 982 • 5일 전</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1447078806655-40579c2520d6?auto=format&fit=crop&w=300&q=80" 
                    alt="Popular post" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm line-clamp-2">최고의 생산성을 위한 업무 환경 구성 꿀팁</h4>
                  <p className="text-xs text-gray-500 mt-1">조회 856 • 1주 전</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full text-primary">모든 인기글 보기</Button>
            </CardFooter>
          </Card>
          
          {/* 다가오는 이벤트 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">다가오는 이벤트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-3">
                <h4 className="font-medium">디자인 워크샵</h4>
                <p className="text-sm text-gray-500">5월 25일 (토) 14:00</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-3">
                <h4 className="font-medium">웹 개발 스터디</h4>
                <p className="text-sm text-gray-500">5월 27일 (월) 19:00</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-3">
                <h4 className="font-medium">스타트업 밋업</h4>
                <p className="text-sm text-gray-500">5월 30일 (목) 18:30</p>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" className="w-full text-primary">모든 이벤트 보기</Button>
            </CardFooter>
          </Card>
          
          {/* 추천 커뮤니티 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">추천 커뮤니티</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=design" />
                    <AvatarFallback>디자</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">디자인 스튜디오</p>
                    <p className="text-xs text-gray-500">멤버 1,245명</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">가입</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=tech" />
                    <AvatarFallback>테크</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">테크 얼리어답터</p>
                    <p className="text-xs text-gray-500">멤버 987명</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">가입</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=startup" />
                    <AvatarFallback>스타</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">스타트업 네트워크</p>
                    <p className="text-xs text-gray-500">멤버 756명</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">가입</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Community;
