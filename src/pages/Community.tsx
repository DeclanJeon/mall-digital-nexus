
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Users, Send, Globe, Circle, Star, Bell, Plus, Edit, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

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
  htmlContent?: string; // HTML 형식의 콘텐츠 (Toast UI Editor용)
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

// Define forum post form data
interface ForumPostFormData {
  title: string;
  content: string;
  tags: string;
}

const Community = () => {
  const [activePlanet, setActivePlanet] = useState<Planet | null>(null);
  const [showBoardView, setShowBoardView] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('서울, 대한민국');
  const [activeTab, setActiveTab] = useState('posts');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState<string>("");
  const [darkMode, setDarkMode] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();
  
  // Form for new posts
  const form = useForm<ForumPostFormData>({
    defaultValues: {
      title: '',
      content: '',
      tags: ''
    }
  });

  // Mock data - Planets
  const planets: Planet[] = [
    {
      id: 'earth',
      name: '지구',
      description: '글로벌 커뮤니티 허브, 지역별 게시판 이용 가능',
      color: '#1E88E5',
      position: [0, 0, 0],
      size: 2,
      activeUsers: 2453,
      recentPosts: 178
    },
    {
      id: 'techverse',
      name: '테크버스',
      description: '기술 토론, 코딩 도움, 가젯 리뷰',
      color: '#E53935',
      position: [6, 1, -3],
      size: 1.3,
      activeUsers: 982,
      recentPosts: 76
    },
    {
      id: 'artsphere',
      name: '아트스피어',
      description: '디지털 및 전통 아티스트를 위한 창조적 예술 커뮤니티',
      color: '#43A047',
      position: [-5, -1, -4],
      size: 1.5,
      activeUsers: 754,
      recentPosts: 92
    },
    {
      id: 'marketjupiter',
      name: '마켓주피터',
      description: '이커머스 논의, 판매 팁, 시장 트렌드',
      color: '#FB8C00',
      position: [8, -2, 1],
      size: 1.8,
      activeUsers: 534,
      recentPosts: 43
    }
  ];
  
  // IndexedDB 함수들
  const initDB = () => {
    const request = indexedDB.open("CommunityDB", 1);
    
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;
      
      // posts 객체 스토어 생성
      if (!db.objectStoreNames.contains("posts")) {
        const objectStore = db.createObjectStore("posts", { keyPath: "id" });
        objectStore.createIndex("author", "author", { unique: false });
        objectStore.createIndex("date", "date", { unique: false });
      }
    };
    
    request.onsuccess = () => {
      console.log("IndexedDB 초기화 성공");
      loadPosts();
    };
    
    request.onerror = (event: Event) => {
      console.error("IndexedDB 초기화 오류:", (event.target as IDBRequest).error);
    };
  };
  
  // 게시글 불러오기
  const loadPosts = () => {
    const request = indexedDB.open("CommunityDB", 1);
    
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;
      const transaction = db.transaction(["posts"], "readonly");
      const objectStore = transaction.objectStore("posts");
      const getAllRequest = objectStore.getAll();
      
      getAllRequest.onsuccess = () => {
        if (getAllRequest.result.length > 0) {
          setPosts(getAllRequest.result);
        } else {
          // 기본 샘플 데이터 사용
          const initialPosts = [
            {
              id: '1',
              title: '새로운 피어몰 기능 업데이트 안내',
              content: '안녕하세요, 피어몰 커뮤니티에 새로운 기능이 업데이트되었습니다. 이제 3D 인터랙션을 통해 더욱 직관적인 커뮤니케이션이 가능해졌습니다.',
              htmlContent: '<p>안녕하세요, 피어몰 커뮤니티에 새로운 기능이 업데이트되었습니다. 이제 3D 인터랙션을 통해 더욱 직관적인 커뮤니케이션이 가능해졌습니다.</p><h3>주요 업데이트 내용</h3><ul><li>3D 우주 인터페이스</li><li>실시간 채팅 개선</li><li>게시판 기능 향상</li></ul>',
              author: '관리자',
              authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=admin',
              date: '2025-05-01',
              likes: 42,
              comments: 7,
              tags: ['공지사항', '업데이트'],
              country: '대한민국'
            },
            {
              id: '2',
              title: '디자인 포트폴리오 피드백 부탁드립니다',
              content: '안녕하세요, UX/UI 디자이너로 활동하고 있는 김디자인입니다. 최근 작업한 포트폴리오에 대한 피드백을 부탁드립니다.',
              htmlContent: '<p>안녕하세요, UX/UI 디자이너로 활동하고 있는 김디자인입니다. 최근 작업한 포트폴리오에 대한 피드백을 부탁드립니다.</p><p>포트폴리오 링크: <a href="#">포트폴리오 보기</a></p><p>특히 색상 선택과 사용자 흐름에 대한 의견을 듣고 싶습니다.</p>',
              author: '김디자인',
              authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=design',
              date: '2025-04-30',
              likes: 15,
              comments: 23,
              tags: ['디자인', '포트폴리오', '피드백'],
              country: '대한민국'
            },
            {
              id: '3',
              title: '서울 지역 디자이너 모임 안내',
              content: '다음 주 토요일 오후 2시, 강남역 인근 카페에서 디자이너 네트워킹 모임을 갖습니다. 관심 있으신 분들은 댓글 남겨주세요.',
              htmlContent: '<p>다음 주 토요일 오후 2시, 강남역 인근 카페에서 디자이너 네트워킹 모임을 갖습니다.</p><h4>모임 정보</h4><ul><li>일시: 2025년 5월 10일 오후 2시</li><li>장소: 강남역 2번 출구 카페</li><li>주제: 최신 UX 트렌드와 포트폴리오 공유</li></ul><p>관심 있으신 분들은 댓글 남겨주세요.</p>',
              author: '이기획',
              authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=planner',
              date: '2025-04-29',
              likes: 28,
              comments: 15,
              tags: ['모임', '네트워킹', '서울'],
              country: '대한민국'
            },
            {
              id: '4',
              title: 'AI 기반 디자인 도구 추천해주세요',
              content: '요즘 AI 기반 디자인 도구들이 많이 나오는데, 실제로 업무에 활용하기 좋은 툴이 있을까요? 경험담 공유 부탁드립니다.',
              htmlContent: '<p>요즘 AI 기반 디자인 도구들이 많이 나오는데, 실제로 업무에 활용하기 좋은 툴이 있을까요?</p><p>현재 Figma와 Adobe XD를 주로 사용하고 있지만, AI 기능이 통합된 도구로 전환을 고려하고 있습니다. 실제 사용 경험과 장단점을 알려주시면 많은 도움이 될 것 같습니다.</p>',
              author: '박테크',
              authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=tech',
              date: '2025-04-28',
              likes: 32,
              comments: 19,
              tags: ['AI', '디자인툴', '추천'],
              country: '대한민국'
            },
          ];
          
          // IndexedDB에 저장
          saveInitialPostsToDB(initialPosts);
          setPosts(initialPosts);
        }
      };
    };
  };
  
  // 초기 게시글 저장
  const saveInitialPostsToDB = (initialPosts: Post[]) => {
    const request = indexedDB.open("CommunityDB", 1);
    
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;
      const transaction = db.transaction(["posts"], "readwrite");
      const objectStore = transaction.objectStore("posts");
      
      initialPosts.forEach(post => {
        objectStore.add(post);
      });
    };
  };
  
  // 게시글 저장
  const savePostToDB = (post: Post) => {
    const request = indexedDB.open("CommunityDB", 1);
    
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;
      const transaction = db.transaction(["posts"], "readwrite");
      const objectStore = transaction.objectStore("posts");
      
      const addRequest = objectStore.add(post);
      
      addRequest.onsuccess = () => {
        toast({
          title: "게시글이 등록되었습니다.",
          description: "성공적으로 게시글이 저장되었습니다.",
        });
        
        setPosts(prevPosts => [...prevPosts, post]);
        setShowNewPostForm(false);
        form.reset();
      };
      
      addRequest.onerror = () => {
        toast({
          title: "게시글 등록 실패",
          description: "게시글을 저장하는 중 오류가 발생했습니다.",
          variant: "destructive"
        });
      };
    };
  };
  
  // 게시글 업데이트
  const updatePostInDB = (post: Post) => {
    const request = indexedDB.open("CommunityDB", 1);
    
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;
      const transaction = db.transaction(["posts"], "readwrite");
      const objectStore = transaction.objectStore("posts");
      
      const updateRequest = objectStore.put(post);
      
      updateRequest.onsuccess = () => {
        toast({
          title: "게시글이 수정되었습니다.",
          description: "성공적으로 게시글이 수정되었습니다.",
        });
        
        setPosts(prevPosts => prevPosts.map(p => p.id === post.id ? post : p));
        setEditingPost(null);
        setShowNewPostForm(false);
        form.reset();
      };
    };
  };
  
  // 게시글 삭제
  const deletePostFromDB = (postId: string) => {
    const request = indexedDB.open("CommunityDB", 1);
    
    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBRequest).result as IDBDatabase;
      const transaction = db.transaction(["posts"], "readwrite");
      const objectStore = transaction.objectStore("posts");
      
      const deleteRequest = objectStore.delete(postId);
      
      deleteRequest.onsuccess = () => {
        toast({
          title: "게시글이 삭제되었습니다.",
          description: "성공적으로 게시글이 삭제되었습니다.",
        });
        
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
      };
    };
  };
  
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
      author: '김민지',
      authorAvatar: 'https://api.dicebear.com/7.x/personas/svg?seed=minji',
      content: '안녕하세요! 서울에서 접속했습니다.',
      timestamp: '10:32 AM',
      country: '대한민국'
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
      author: '李伟',
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
    
    // Initialize IndexedDB
    initDB();
  }, []);
  
  // 게시글 작성 폼 제출 처리
  const onSubmit = useCallback((data: ForumPostFormData) => {
    // Convert form textarea content to simple HTML
    const htmlContent = `<p>${data.content.replace(/\n/g, '</p><p>')}</p>`;
    const tagsArray = data.tags.split(',').map(tag => tag.trim());
    
    if (editingPost) {
      // 게시글 수정
      const updatedPost: Post = {
        ...editingPost,
        title: data.title,
        content: data.content,
        htmlContent,
        tags: tagsArray,
      };
      
      updatePostInDB(updatedPost);
    } else {
      // 새 게시글 작성
      const newPost: Post = {
        id: `post-${Date.now()}`,
        title: data.title,
        content: data.content,
        htmlContent,
        author: username,
        authorAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
        date: new Date().toISOString().split('T')[0],
        likes: 0,
        comments: 0,
        tags: tagsArray,
        country: '대한민국'
      };
      
      savePostToDB(newPost);
    }
  }, [username, editingPost, form]);
  
  // 게시글 수정 시작
  const handleEditPost = useCallback((post: Post) => {
    setEditingPost(post);
    setShowNewPostForm(true);
    
    form.setValue('title', post.title);
    form.setValue('content', post.content);
    form.setValue('tags', post.tags.join(', '));
  }, [form]);
  
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
      timestamp: new Intl.DateTimeFormat('ko-KR', {
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date()),
      country: '대한민국'
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
                    <span>{activePlanet.activeUsers.toLocaleString()} 활동 사용자</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4 text-yellow-400" />
                    <span>{activePlanet.recentPosts.toLocaleString()} 최근 게시물</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* 2D Universe Canvas with animated effects */}
            <div className="w-full h-[80vh] rounded-2xl overflow-hidden bg-[#0a0a1a] relative">
              {/* Stars background with parallax effect */}
              <div className="absolute inset-0 stars-small"></div>
              <div className="absolute inset-0 stars-medium"></div>
              <div className="absolute inset-0 stars-large"></div>
              
              {/* Nebula effect */}
              <div className="absolute inset-0 opacity-30" 
                style={{ 
                  background: 'radial-gradient(circle at 50% 40%, rgba(76, 0, 255, 0.3), rgba(125, 0, 125, 0.2) 40%, transparent 70%)'
                }}>
              </div>
              
              {/* Planets */}
              {planets.map((planet) => {
                // Calculate position for 2D representation
                const left = 50 + (planet.position[0] * 5);
                const top = 50 + (planet.position[1] * 5);
                const size = planet.size * 40;
                
                return (
                  <div
                    key={planet.id}
                    className="absolute rounded-full cursor-pointer transition-transform hover:scale-110 planet-pulse"
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
              
              {/* Shooting stars effect */}
              <div className="shooting-star" style={{ 
                left: '10%', 
                top: '20%', 
                animationDelay: '0s' 
              }}></div>
              <div className="shooting-star" style={{ 
                left: '60%', 
                top: '50%', 
                animationDelay: '3s' 
              }}></div>
              <div className="shooting-star" style={{ 
                left: '30%', 
                top: '70%', 
                animationDelay: '6s' 
              }}></div>
              
              {/* Particle effects */}
              <div className="particles"></div>
              
              {/* Active user points with pulse effect */}
              {Array.from({ length: 50 }).map((_, i) => {
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                const size = Math.random() * 2 + 1;
                const opacity = Math.random() * 0.8 + 0.2;
                const pulseDelay = Math.random() * 5;
                
                return null;
              })}
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center bg-black/60 backdrop-blur-md p-3 rounded-full">
              <p className="text-sm">행성을 클릭하여 다양한 커뮤니티를 탐색하세요</p>
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
                    <span>우주로 돌아가기</span>
                  </button>
                </div>
                <h1 className="text-2xl font-bold">{selectedLocation} 커뮤니티</h1>
              </div>
              
              <div className="flex space-x-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="게시글 검색..."
                    className="pl-9 bg-white/10 border-white/20 text-white"
                  />
                </div>
                <Button 
                  onClick={() => {
                    setEditingPost(null);
                    setShowNewPostForm(true);
                    form.reset();
                  }}
                >새 글쓰기</Button>
              </div>
            </div>
            
            {/* New Post Form - Modified to use simple textarea instead of Toast UI Editor */}
            {showNewPostForm && (
              <Card className="bg-white/5 border-white/10 mb-6 overflow-hidden">
                <CardHeader>
                  <CardTitle>{editingPost ? '게시글 수정' : '새 게시글 작성'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>제목</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="제목을 입력하세요" 
                                className="bg-white/10 border-white/20 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>태그</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="쉼표로 구분하여 태그를 입력하세요 (예: 디자인, 포트폴리오)" 
                                className="bg-white/10 border-white/20 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>내용</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="내용을 입력하세요..." 
                                className="min-h-[300px] bg-white/10 border-white/20 text-white resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => {
                            setShowNewPostForm(false);
                            setEditingPost(null);
                          }}
                        >
                          취소
                        </Button>
                        <Button type="submit">
                          {editingPost ? '수정하기' : '게시하기'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4 bg-white/5">
                    <TabsTrigger value="posts">게시글</TabsTrigger>
                    <TabsTrigger value="trending">인기글</TabsTrigger>
                    <TabsTrigger value="following">팔로우</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="posts" className="space-y-4">
                    {posts.map(post => (
                      <Card key={post.id} className="bg-white/5 border-white/10 animate-fade-in">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
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
                            
                            {post.author === username && (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEditPost(post)}
                                  className="text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => deletePostFromDB(post.id)}
                                  className="text-gray-400 hover:text-red-400 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                          {post.htmlContent ? (
                            <div 
                              className="text-gray-300 mb-4 prose-sm prose-invert max-w-none" 
                              dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                            />
                          ) : (
                            <p className="text-gray-300 mb-4">{post.content}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-blue-300 border-blue-300/30">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex justify-between text-sm text-gray-400">
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 hover:text-blue-300 transition-colors">
                                <Star className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </button>
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-400">
                              자세히 보기
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="trending">
                    <div className="p-8 text-center">
                      <p>인기 콘텐츠가 여기에 표시됩니다.</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="following">
                    <div className="p-8 text-center">
                      <p>팔로우한 사용자의 콘텐츠가 여기에 표시됩니다.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Live Chat */}
              <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col h-[700px]">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold">글로벌 채팅</h3>
                  <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30">
                    <Circle className="h-2 w-2 mr-1 fill-green-500" />
                    <span>42명 온라인</span>
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
                      placeholder="메시지를 입력하세요..."
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
      
      {/* CSS for animations */}
      <style>
        {`
        /* Star backgrounds with parallax */
        .stars-small {
          background-image: radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 200px 200px;
          animation: twinkle 7s ease-in-out infinite alternate;
        }
        
        .stars-medium {
          background-image: radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 300px 300px;
          animation: twinkle 15s ease-in-out infinite alternate;
        }
        
        .stars-large {
          background-image: radial-gradient(2px 2px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(2px 2px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 400px 400px;
          animation: twinkle 20s ease-in-out infinite alternate;
        }
        
        @keyframes twinkle {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        /* Shooting stars */
        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: white;
          border-radius: 50%;
          opacity: 0;
          animation: shoot 10s linear infinite;
        }
        
        @keyframes shoot {
          0% {
            transform: translate(0, 0) rotate(-45deg) scale(1);
            opacity: 0;
          }
          5% {
            opacity: 1;
            transform: translate(20px, 20px) rotate(-45deg) scale(1);
          }
          10% {
            transform: translate(100px, 100px) rotate(-45deg) scale(0);
            opacity: 0;
          }
          100% {
            transform: translate(100px, 100px) rotate(-45deg) scale(0);
            opacity: 0;
          }
        }
        
        /* Planet pulse effect */
        .planet-pulse {
          animation: pulse 4s ease-in-out infinite alternate;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 15px 5px rgba(100, 100, 255, 0.5); }
          100% { box-shadow: 0 0 25px 10px rgba(100, 100, 255, 0.8); }
        }
        
        /* User point pulse effect */
        .user-pulse {
          animation: userPulse 3s ease-in-out infinite;
        }
        
        @keyframes userPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        /* Particle effects */
        .particles {
          background-image: 
            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(100, 100, 255, 0.3), transparent),
            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(100, 100, 255, 0.3), transparent),
            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, rgba(100, 100, 255, 0.3), transparent);
          background-size: 300px 300px;
          animation: drift 30s linear infinite;
          opacity: 0.3;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
        }
        
        @keyframes drift {
          0% { background-position: 0 0; }
          100% { background-position: 300px 300px; }
        }
        
        /* Fade in animation */
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
};

export default Community;
