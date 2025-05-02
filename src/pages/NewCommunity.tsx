
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Users, Send, Globe, Circle, Star, Bell } from 'lucide-react';

// Define planet types
interface Planet {
  id: string;
  name: string;
  description: string;
  color: string;
  position: [number, number, number];
  size: number;
  activeUsers: number;
  recentPosts: number;
  texture?: string;
}

// Define post type
interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  country: string;
}

// Define chat message type
interface ChatMessage {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  country: string;
}

const NewCommunity = () => {
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);
  const [showBoardView, setShowBoardView] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Seoul, South Korea');
  const [activeTab, setActiveTab] = useState('posts');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState<string>("");
  const [darkMode, setDarkMode] = useState(true);
  
  // Mock data - Planets
  const planets: Planet[] = [
    {
      id: 'earth',
      name: 'Earth',
      description: 'Global community hub with location-based boards',
      color: '#1E88E5',
      position: [0, 0, 0],
      size: 2,
      activeUsers: 2453,
      recentPosts: 178
    },
    {
      id: 'techverse',
      name: 'TechVerse',
      description: 'Technology discussions, coding help, and gadget reviews',
      color: '#E53935',
      position: [6, 1, -3],
      size: 1.3,
      activeUsers: 982,
      recentPosts: 76
    },
    {
      id: 'artsphere',
      name: 'ArtSphere',
      description: 'Creative arts community for digital and traditional artists',
      color: '#43A047',
      position: [-5, -1, -4],
      size: 1.5,
      activeUsers: 754,
      recentPosts: 92
    },
    {
      id: 'marketjupiter',
      name: 'MarketJupiter',
      description: 'E-commerce discussions, selling tips, market trends',
      color: '#FB8C00',
      position: [8, -2, 1],
      size: 1.8,
      activeUsers: 534,
      recentPosts: 43
    }
  ];

  // Mock data - Posts
  const posts: Post[] = [
    {
      id: '1',
      title: '새로운 피어몰 기능 업데이트 안내',
      content: '안녕하세요, 피어몰 커뮤니티에 새로운 기능이 업데이트되었습니다. 이제 3D 인터랙션을 통해 더욱 직관적인 커뮤니케이션이 가능해졌습니다.',
      author: '관리자',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=admin',
      date: '2025-05-01',
      likes: 42,
      comments: 7,
      tags: ['공지사항', '업데이트'],
      country: 'South Korea'
    },
    {
      id: '2',
      title: '디자인 포트폴리오 피드백 부탁드립니다',
      content: '안녕하세요, UX/UI 디자이너로 활동하고 있는 김디자인입니다. 최근 작업한 포트폴리오에 대한 피드백을 부탁드립니다.',
      author: '김디자인',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=design',
      date: '2025-04-30',
      likes: 15,
      comments: 23,
      tags: ['디자인', '포트폴리오', '피드백'],
      country: 'South Korea'
    },
    {
      id: '3',
      title: '서울 지역 디자이너 모임 안내',
      content: '다음 주 토요일 오후 2시, 강남역 인근 카페에서 디자이너 네트워킹 모임을 갖습니다. 관심 있으신 분들은 댓글 남겨주세요.',
      author: '이기획',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=planner',
      date: '2025-04-29',
      likes: 28,
      comments: 15,
      tags: ['모임', '네트워킹', '서울'],
      country: 'South Korea'
    },
    {
      id: '4',
      title: 'AI 기반 디자인 도구 추천해주세요',
      content: '요즘 AI 기반 디자인 도구들이 많이 나오는데, 실제로 업무에 활용하기 좋은 툴이 있을까요? 경험담 공유 부탁드립니다.',
      author: '박테크',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=tech',
      date: '2025-04-28',
      likes: 32,
      comments: 19,
      tags: ['AI', '디자인툴', '추천'],
      country: 'South Korea'
    },
  ];
  
  // Mock data - Chat messages
  const initialMessages: ChatMessage[] = [
    {
      id: '1',
      author: 'John Doe',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=john',
      content: 'Hello everyone! Joining from New York today.',
      timestamp: '10:30 AM',
      country: 'USA'
    },
    {
      id: '2',
      author: 'Kim Min-ji',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=minji',
      content: '안녕하세요! 서울에서 접속했습니다.',
      timestamp: '10:32 AM',
      country: 'South Korea'
    },
    {
      id: '3',
      author: 'Maria Garcia',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=maria',
      content: '¡Hola desde Madrid! ¿Alguien habla español aquí?',
      timestamp: '10:35 AM',
      country: 'Spain'
    },
    {
      id: '4',
      author: 'Li Wei',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=wei',
      content: '大家好！来自北京。',
      timestamp: '10:40 AM',
      country: 'China'
    }
  ];

  useEffect(() => {
    // Get username from local storage or generate a random animal name
    const storedUsername = localStorage.getItem('peerspace_username');
    const generatedUsername = storedUsername || getRandomAnimalName();
    
    if (!storedUsername) {
      localStorage.setItem('peerspace_username', generatedUsername);
    }
    
    setUsername(generatedUsername);
    setMessages(initialMessages);
  }, []);
  
  function getRandomAnimalName(): string {
    const animals = ['토끼', '사자', '호랑이', '기린', '코끼리', '팬더', '곰', '여우', '늑대', '사슴'];
    const randomIndex = Math.floor(Math.random() * animals.length);
    return `익명 ${animals[randomIndex]}`;
  }

  const handlePlanetClick = (planet: Planet) => {
    setActivePlanet(planet);
    if (planet.id === 'earth') {
      setShowBoardView(true);
    }
  };

  // Handle sending a chat message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newChatMessage: ChatMessage = {
      id: Date.now().toString(),
      author: username,
      authorAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
      content: newMessage,
      timestamp: new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date()),
      country: 'South Korea'
    };
    
    setMessages(prevMessages => [...prevMessages, newChatMessage]);
    setNewMessage('');
  };

  // Handle returning to universe view
  const handleReturnToUniverse = () => {
    setShowBoardView(false);
    setActivePlanet(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-[#0a0a1a] to-[#1a1a2e]' : 'bg-gray-50'} text-white`}>
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Globe className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold">피어스페이스 Universe</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10"
            >
              {darkMode ? (
                <Circle className="h-5 w-5 text-yellow-300" />
              ) : (
                <Star className="h-5 w-5 text-blue-300" />
              )}
            </button>
            
            <div className="relative">
              <Bell className="h-5 w-5 text-blue-300" />
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                3
              </span>
            </div>
            
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${username}`}
                alt={username}
              />
              <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Universe View */}
        {!showBoardView ? (
          <div className="relative">
            {/* Planet hover info */}
            {activePlanet && (
              <div className="absolute top-4 left-4 z-10 p-4 rounded-lg bg-black/60 backdrop-blur-md max-w-md">
                <h2 className="text-xl font-bold mb-2">{activePlanet.name}</h2>
                <p className="text-blue-300 mb-3">{activePlanet.description}</p>
                <div className="flex space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-green-400" />
                    <span>{activePlanet.activeUsers.toLocaleString()} active users</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4 text-yellow-400" />
                    <span>{activePlanet.recentPosts.toLocaleString()} recent posts</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* 2D Universe Canvas (Temporary until Three.js is working) */}
            <div className="w-full h-[80vh] rounded-2xl overflow-hidden bg-[#0a0a1a] relative">
              {/* Stars background */}
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px)',
                backgroundSize: '50px 50px',
                opacity: 0.5
              }}></div>
              
              {/* Planets */}
              {planets.map((planet) => {
                // Calculate position for 2D representation
                const left = 50 + (planet.position[0] * 5);
                const top = 50 + (planet.position[1] * 5);
                const size = planet.size * 40;
                
                return (
                  <div
                    key={planet.id}
                    className="absolute rounded-full cursor-pointer transition-transform hover:scale-110"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      backgroundColor: planet.color,
                      transform: 'translate(-50%, -50%)',
                      boxShadow: `0 0 ${size/2}px ${size/8}px ${planet.color}40`
                    }}
                    onClick={() => handlePlanetClick(planet)}
                    onMouseEnter={() => setActivePlanet(planet)}
                    onMouseLeave={() => setActivePlanet(null)}
                  >
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap">
                      {planet.name}
                    </div>
                  </div>
                );
              })}
              
              {/* Active user points */}
              {Array.from({ length: 50 }).map((_, i) => {
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const size = Math.random() * 2 + 1;
                const opacity = Math.random() * 0.8 + 0.2;
                
                return (
                  <div
                    key={`star-${i}`}
                    className="absolute rounded-full bg-blue-400"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: `${size}px`,
                      height: `${size}px`,
                      opacity
                    }}
                  />
                );
              })}
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center bg-black/60 backdrop-blur-md p-3 rounded-full">
              <p className="text-sm">Click on planets to explore different communities</p>
            </div>
          </div>
        ) : (
          /* Board View */
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <button 
                    onClick={handleReturnToUniverse}
                    className="text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Return to Universe</span>
                  </button>
                </div>
                <h1 className="text-2xl font-bold">{selectedLocation} Community</h1>
              </div>
              
              <div className="flex space-x-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search posts..."
                    className="pl-9 bg-white/10 border-white/20 text-white"
                  />
                </div>
                <Button>New Post</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 bg-white/5">
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="trending">Trending</TabsTrigger>
                    <TabsTrigger value="following">Following</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="posts" className="space-y-4">
                    {posts.map(post => (
                      <Card key={post.id} className="bg-white/5 border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                              <AvatarImage src={post.authorAvatar} alt={post.author} />
                              <AvatarFallback>{post.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{post.author}</p>
                              <p className="text-xs text-gray-400">{post.date}</p>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                          <p className="text-gray-300 mb-4">{post.content}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-blue-300 border-blue-300/30">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-400">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-400">
                              Read more
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="trending">
                    <div className="p-8 text-center">
                      <p>Trending content will appear here.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="following">
                    <div className="p-8 text-center">
                      <p>Content from users you follow will appear here.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Live Chat */}
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col h-[700px]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold">Global Chat</h3>
                  <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30">
                    <Circle className="h-2 w-2 mr-1 fill-green-500" />
                    <span>42 Online</span>
                  </Badge>
                </div>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.author === username ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex ${message.author === username ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.authorAvatar} alt={message.author} />
                          <AvatarFallback>{message.author[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div 
                          className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            message.author === username 
                              ? 'bg-blue-600 text-white rounded-br-none ml-2' 
                              : 'bg-white/10 text-white rounded-bl-none mr-2'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium">{message.author}</span>
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                          </div>
                          <p>{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-white/10 bg-black/20">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      className="bg-white/5 border-white/20"
                    />
                    <Button 
                      size="icon" 
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewCommunity;
