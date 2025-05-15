import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { List, RadioTower, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post, Planet, ChatRoom } from '@/components/community/types';

interface HighlightChatRoom {
  id: string;
  name: string;
  topic?: string;
  participantCount: number;
  link: string;
  createdAt?: string | Date;
  planetId?: string; 
}

const formatTimeAgo = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return '';
  let dateObj: Date;

  if (typeof dateInput === 'string' && /^\d+$/.test(dateInput)) {
    const timestamp = parseInt(dateInput, 10);
    if (timestamp > 100000000000) { 
       dateObj = new Date(timestamp);
    } else {
       return '';
    }
  } else {
    dateObj = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  }

  if (isNaN(dateObj.getTime())) {
    return ''; 
  }

  const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
  if (seconds < 0) return '방금 전'; 

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "년 전";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "달 전";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "일 전";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "시간 전";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "분 전";
  return Math.max(0, Math.floor(seconds)) + "초 전";
};

const CHAT_ROOMS_STORAGE_KEY = 'chatRooms';

const CommunityHighlightsComponent = () => { // 컴포넌트 이름 변경 (내부용)
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [activeChatRooms, setActiveChatRooms] = useState<HighlightChatRoom[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    try {
      const storedPlanets = localStorage.getItem('planets');
      if (storedPlanets) {
        setPlanets(JSON.parse(storedPlanets));
      }
    } catch (error) {
      console.error('Error loading planets from localStorage:', error);
      setPlanets([]);
    }

    try {
      const storedPosts = localStorage.getItem('peerspace_posts');
      if (storedPosts) {
        const allPosts: Post[] = JSON.parse(storedPosts);
        const sortedPosts = allPosts.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          return dateB - dateA;
        });
        setLatestPosts(sortedPosts.slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading posts from localStorage:', error);
      setLatestPosts([]);
    }

    try {
      const storedChatRooms = localStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
      if (storedChatRooms) {
        const allChatRooms: ChatRoom[] = JSON.parse(storedChatRooms).map((room: ChatRoom) => ({ // 타입 ChatRoom으로 명시
          ...room,
          timestamp: room.timestamp ? new Date(room.timestamp) : undefined,
        }));
        
        const sortedRooms = allChatRooms.sort((a, b) => (b.participantsCount || 0) - (a.participantsCount || 0));
        
        setActiveChatRooms(sortedRooms.slice(0, 3).map(room => ({
            id: room.id,
            name: room.name,
            topic: room.description, 
            participantCount: room.participantsCount || room.participants || 0,
            link: `/community/planet/${room.planetId || 'global'}/chat/${room.id}`, 
            planetId: room.planetId, 
            createdAt: room.timestamp 
        })));
      } else {
         setActiveChatRooms([
           { id: 'chat1', name: '자유 토크방 💬', topic: '피어몰 관련 자유로운 대화', participantCount: 15, link: `/community/planet/global/chat/chat1`, planetId: 'global', createdAt: new Date(Date.now() - 3600000) },
           { id: 'chat2', name: '신규 피어몰 홍보방 ✨', topic: '새로 만든 피어몰을 소개해주세요!', participantCount: 8, link: `/community/planet/global/chat/chat2`, planetId: 'global', createdAt: new Date(Date.now() - 7200000) },
           { id: 'chat3', name: '개발자 Q&A 💻', topic: '피어몰 개발 관련 질문과 답변', participantCount: 22, link: `/community/planet/global/chat/chat3`, planetId: 'global', createdAt: new Date(Date.now() - 10800000) },
         ].sort((a, b) => b.participantCount - a.participantCount).slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading chat rooms from localStorage:', error);
      setActiveChatRooms([]);
    }
  }, []);

  const getPlanetNameById = (planetId: string): string | undefined => {
    const planet = planets.find(p => p.id === planetId);
    return planet?.name;
  };

  return (
    <section className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary-300">커뮤니티 소식</h2>
        <Link to="/community">
          <Button variant="link" className="text-accent-200 text-sm">
            더보기
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6">
        {/* Latest Posts Section */}
        <div className="p-4">
          <div className="flex items-center mb-4">
            <List className="h-5 w-5 mr-2 text-accent-200" />
            <h3 className="font-bold text-primary-300">최신 게시글</h3>
          </div>
          
          <div className="space-y-3">
            {latestPosts.length > 0 ? (
              latestPosts.map(post => {

                console.log(post)

                const planetName = getPlanetNameById(post.planetId);
                return (
                  <Card key={post.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <Link to={`/community/planet/${post.planetId}/post/${post.id}`} className="block mb-2 hover:text-accent-200">
                        <h4 className="font-medium text-primary-300 truncate">{post.title}</h4>
                      </Link>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={post.authorAvatar || `https://api.dicebear.com/7.x/personas/svg?seed=${post.author}`} />
                            <AvatarFallback>{post.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-600">
                            {post.author} {planetName && <span className="text-gray-400">in {planetName}</span>}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">{formatTimeAgo(post.date)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">최신 게시글이 없습니다.</p>
            )}
          </div>
        </div>
        
        {/* Active Open Chat Rooms Section */}
        <div className="p-4 border-t md:border-t-0 md:border-l border-gray-100">
          <div className="flex items-center mb-4">
            <RadioTower className="h-5 w-5 mr-2 text-accent-200" />
            <h3 className="font-bold text-primary-300">오픈 채팅방</h3>
          </div>
          
          <div className="space-y-3">
            {activeChatRooms.length > 0 ? (
              activeChatRooms.map(room => (
                <Card key={room.id} className="hover:shadow-md transition-shadow">
                  <Link to={room.link} className="block">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-primary-300 mb-1 truncate">{room.name}</h4>
                      {room.topic && <p className="text-xs text-gray-600 mb-2 truncate">{room.topic}</p>}
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        <span>{room.participantCount}명 참여중</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))
            ) : (
               <p className="text-sm text-gray-500 text-center py-4">활성화된 오픈 채팅방이 없습니다.</p>
            )}
          </div>
        </div>
        
      </div>
    </section>
  );
};

const CommunityHighlights = React.memo(CommunityHighlightsComponent); // React.memo 적용

export default CommunityHighlights;
