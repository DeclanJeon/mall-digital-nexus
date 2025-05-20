
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import GlobeMap from '@/components/community/GlobeMap';
import CommunityBoard from '@/components/community/CommunityBoard';
import { getCommunityStatistics } from "@/utils/storageUtils";

// Initial sample posts for the community board
const dummyPosts = [
  {
    id: "1",
    title: "커뮤니티 활동 가이드라인 공지",
    author: "관리자",
    date: "2025-05-15",
    content: "안녕하세요, 피어몰 커뮤니티 가이드라인을 공유합니다...",
    likes: 124,
    comments: 35,
    tags: ["공지", "가이드라인"],
    isNotice: true
  },
  {
    id: "2",
    title: "여름 이벤트 준비 중입니다!",
    author: "이벤트매니저",
    date: "2025-05-14",
    content: "다가오는 여름 시즌을 맞아 특별 이벤트를 준비 중입니다...",
    likes: 87,
    comments: 23,
    tags: ["이벤트", "여름"]
  },
  {
    id: "3",
    title: "새로운 커뮤니티 기능 소개",
    author: "개발팀",
    date: "2025-05-13",
    content: "안녕하세요, 새롭게 추가된 커뮤니티 기능을 소개합니다...",
    likes: 56,
    comments: 12,
    tags: ["기능", "업데이트"]
  }
];

interface CommunityStats {
  totalCommunities: number;
  activeCommunities: number;
  activeUsers: number;
  todayPosts: number;
}

const Community = () => {
  const [activeTab, setActiveTab] = useState("board");
  const [statistics, setStatistics] = useState<CommunityStats>({
    totalCommunities: 0,
    activeCommunities: 0,
    activeUsers: 0,
    todayPosts: 0
  });

  // Load community statistics
  useEffect(() => {
    // Load statistics from local storage
    const stats = getCommunityStatistics();
    
    // If we have real data, use it; otherwise use some default values
    if (stats.totalCommunities > 0) {
      setStatistics(stats);
    } else {
      // Fallback default statistics
      setStatistics({
        totalCommunities: 23,
        activeCommunities: 18,
        activeUsers: 487,
        todayPosts: 41
      });
    }
  }, []);

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] py-4">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          {/* <h1 className="text-2xl font-bold">피어몰 커뮤니티</h1> */}
          <div className="flex gap-2">
            <Badge variant="outline">총 커뮤니티: {statistics.totalCommunities.toLocaleString()}</Badge>
            <Badge variant="outline">활성 사용자: {statistics.activeUsers.toLocaleString()}</Badge>
            <Badge variant="outline">오늘 게시글: {statistics.todayPosts.toLocaleString()}</Badge>
          </div>
        </div>
        
        <Tabs
          defaultValue="board"
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col"
        >
          {/* <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="globe">지구 지도</TabsTrigger>
            <TabsTrigger value="board">게시판</TabsTrigger>
            <TabsTrigger value="stats">커뮤니티 통계</TabsTrigger>
          </TabsList> */}
          
          {/* <TabsContent value="globe" className="flex-1">
            <div className="w-full h-full rounded-lg overflow-hidden">
              <GlobeMap />
            </div>
          </TabsContent> */}
          
          <TabsContent value="board" className="flex-1">
            <CommunityBoard zoneName="디지털 도시" posts={dummyPosts} />
          </TabsContent>
          
          <TabsContent value="stats" className="flex-1">
            <div className="w-full h-full bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">커뮤니티 통계</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="text-gray-500 text-sm mb-1">총 커뮤니티</div>
                  <div className="text-2xl font-bold">{statistics.totalCommunities.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">활성: {statistics.activeCommunities.toLocaleString()}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="text-gray-500 text-sm mb-1">활성 사용자</div>
                  <div className="text-2xl font-bold">{statistics.activeUsers.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">지난 30일 기준</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="text-gray-500 text-sm mb-1">오늘 게시글</div>
                  <div className="text-2xl font-bold">{statistics.todayPosts.toLocaleString()}</div>
                  <div className="text-xs text-gray-400 mt-1">지난 게시글: {(statistics.todayPosts * 1.2).toFixed(0)}</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="text-gray-500 text-sm mb-1">총 이벤트</div>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-gray-400 mt-1">진행중: 3</div>
                </div>
              </div>
              
              <p className="mt-8 text-gray-500 text-sm">
                더 자세한 통계 대시보드는 향후 업데이트에서 제공될 예정입니다.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Community;
