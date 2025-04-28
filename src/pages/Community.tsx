
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Outlet, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForumList from '@/components/community/ForumList';
import GroupChat from '@/components/community/GroupChat';
import OpenChatRooms from '@/components/community/OpenChatRooms';
import OpenChatRoom from '@/components/community/OpenChatRoom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Users, 
  Video, 
  Mic, 
  PenSquare,
  Calendar,
  Search,
  ArrowRight,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Community = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || "chat");
  const [username, setUsername] = useState<string>("");
  
  useEffect(() => {
    // Get username from local storage or generate a random animal name
    const storedUsername = localStorage.getItem('peerspace_username');
    const generatedUsername = storedUsername || getRandomAnimalName();
    
    if (!storedUsername) {
      localStorage.setItem('peerspace_username', generatedUsername);
    }
    
    setUsername(generatedUsername);
  }, []);
  
  function getRandomAnimalName(): string {
    const animals = ['토끼', '사자', '호랑이', '기린', '코끼리', '팬더', '곰', '여우', '늑대', '사슴'];
    const randomIndex = Math.floor(Math.random() * animals.length);
    return `익명 ${animals[randomIndex]}`;
  }
  
  // Mock popular topics
  const popularTopics = [
    { id: 1, name: '지속가능성', count: 254 },
    { id: 2, name: '디자인', count: 187 },
    { id: 3, name: '기술', count: 142 },
    { id: 4, name: '마케팅', count: 98 },
    { id: 5, name: '창업', count: 76 },
  ];
  
  // Mock upcoming events
  const upcomingEvents = [
    { 
      id: 1, 
      title: '디자인 워크샵', 
      date: '2025-05-15', 
      registrations: 24 
    },
    { 
      id: 2, 
      title: '아이디어 해커톤', 
      date: '2025-05-20', 
      registrations: 42 
    }
  ];
  
  // Mock active users
  const activeUsers = [
    { 
      id: 1, 
      name: '김디자이너', 
      image: 'https://api.dicebear.com/7.x/personas/svg?seed=KimDesigner',
      status: 'online' 
    },
    { 
      id: 2, 
      name: '이개발자', 
      image: 'https://api.dicebear.com/7.x/personas/svg?seed=LeeDev',
      status: 'online' 
    },
    { 
      id: 3, 
      name: '박마케터', 
      image: 'https://api.dicebear.com/7.x/personas/svg?seed=ParkMkt',
      status: 'away' 
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">피어스페이스 커뮤니티</h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90 mb-6">
            다양한 피어들과 소통하고, 경험을 공유하며, 함께 성장할 수 있는 공간입니다.
          </p>
          <div className="flex gap-3">
            <Button className="bg-white text-blue-600 hover:bg-white/90">
              활동 시작하기
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/20">
              가이드라인 보기
            </Button>
          </div>
        </div>
      </div>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${username}`} alt={username} />
                    <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{username}</p>
                    <p className="text-xs text-gray-500">커뮤니티에 참여 중</p>
                  </div>
                </div>
                <Button size="sm">내 활동</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full flex items-center text-sm">
                  <PenSquare className="h-4 w-4 mr-1" /> 게시글 작성
                </Button>
                <Button variant="outline" className="rounded-full flex items-center text-sm">
                  <MessageSquare className="h-4 w-4 mr-1" /> 대화 참여
                </Button>
                <Button variant="outline" className="rounded-full flex items-center text-sm">
                  <Video className="h-4 w-4 mr-1" /> 화상 채팅
                </Button>
              </div>
            </div>
            
            <Routes>
              <Route path="/" element={
                <>
                  <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="chat" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" /> 채팅
                      </TabsTrigger>
                      <TabsTrigger value="forum" className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> 포럼
                      </TabsTrigger>
                      <TabsTrigger value="openchat" className="flex items-center gap-2">
                        <Mic className="h-4 w-4" /> 오픈챗
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="chat">
                      <GroupChat />
                    </TabsContent>

                    <TabsContent value="forum">
                      <ForumList />
                    </TabsContent>

                    <TabsContent value="openchat">
                      <OpenChatRooms />
                    </TabsContent>
                  </Tabs>
                  <Outlet />
                </>
              } />
              <Route path="/chat/:chatId" element={<OpenChatRoom />} />
            </Routes>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">활발한 토픽</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTopics.map(topic => (
                    <Badge 
                      key={topic.id}
                      variant="outline"
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      {topic.name} ({topic.count})
                    </Badge>
                  ))}
                </div>
                
                <div className="relative mt-4">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="토픽 검색..."
                    className="pl-8"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> 다가오는 이벤트
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div 
                      key={event.id}
                      className="border rounded-md p-3 hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer"
                    >
                      <p className="font-medium">{event.title}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>{event.date}</span>
                        <span>{event.registrations}명 등록</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-2 flex items-center justify-center">
                  모든 이벤트 보기 <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" /> 활동 중인 사용자
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeUsers.map(user => (
                    <div 
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span 
                            className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
                              user.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                            }`} 
                          />
                        </div>
                        <span className="text-sm">{user.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="border-t mt-3 pt-3">
                  <p className="text-xs text-gray-500">현재 온라인: 42명</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
