
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  MessageSquare, 
  Star, 
  Users, 
  CirclePlus, 
  Send, 
  Edit, 
  Trash2,
  Star as StarIcon,
  Circle
} from 'lucide-react';
import { Planet, ForumPost, ChatMessage } from './types';
import { useToast } from '@/hooks/use-toast';

interface PlanetDashboardProps {
  planet: Planet;
  onBack: () => void;
  username: string;
}

const growthRequirements = {
  asteroid: {
    activities: 10,
    members: 30,
    days: 14,
    nextStage: 'planet'
  },
  planet: {
    activities: 100, 
    members: 100,
    days: 30,
    nextStage: 'gasGiant'
  },
  gasGiant: {
    activities: 1000,
    members: 500,
    days: 90,
    nextStage: 'star'
  }
};

const PlanetDashboard: React.FC<PlanetDashboardProps> = ({ planet, onBack, username }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: '' });
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: `${planet.name}에 오신 것을 환영합니다!`,
      content: `이 행성은 ${planet.description}을 위한 공간입니다. 다양한 의견과 아이디어를 공유해보세요.`,
      htmlContent: `<p>이 행성은 ${planet.description}을 위한 공간입니다.</p><p>다양한 의견과 아이디어를 공유해보세요.</p>`,
      author: planet.owner.name,
      authorAvatar: planet.owner.avatar,
      date: new Date().toISOString().substring(0, 10),
      likes: 1,
      comments: 0,
      tags: planet.topics,
      planetId: planet.id
    }
  ]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      author: planet.owner.name,
      authorAvatar: planet.owner.avatar,
      content: `${planet.name} 행성에 오신 것을 환영합니다! 이곳에서 자유롭게 소통하세요.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      country: '대한민국',
      planetId: planet.id
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  const { toast } = useToast();
  
  // Growth calculation
  const getGrowthData = () => {
    if (planet.stage === 'star') return { progress: 100, nextStage: null };
    
    const requirements = growthRequirements[planet.stage];
    const activityProgress = Math.min(100, (planet.activities / requirements.activities) * 100);
    const memberProgress = Math.min(100, (planet.members / requirements.members) * 100);
    
    // Assume the planet is X days old (for demonstration)
    const daysOld = 7;
    const daysProgress = Math.min(100, (daysOld / requirements.days) * 100);
    
    // Total progress is the average
    const totalProgress = Math.floor((activityProgress + memberProgress + daysProgress) / 3);
    
    return {
      progress: totalProgress,
      activityProgress,
      memberProgress,
      daysProgress,
      nextStage: requirements.nextStage,
      activityTarget: requirements.activities,
      memberTarget: requirements.members,
      daysTarget: requirements.days,
      currentActivities: planet.activities,
      currentMembers: planet.members,
      currentDays: daysOld
    };
  };
  
  const growth = getGrowthData();
  
  // Handle post creation
  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;
    
    const tags = newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    const post: ForumPost = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      htmlContent: `<p>${newPost.content.replace(/\n/g, '</p><p>')}</p>`,
      author: username,
      authorAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
      date: new Date().toISOString().substring(0, 10),
      likes: 0,
      comments: 0,
      tags: tags.length > 0 ? tags : ['일반'],
      planetId: planet.id
    };
    
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', tags: '' });
    setShowNewPostForm(false);
    
    toast({
      title: "게시물이 작성되었습니다",
      description: "행성에 새 게시물이 추가되었습니다.",
    });
  };
  
  // Handle message sending
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: username,
      authorAvatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      country: '대한민국',
      planetId: planet.id
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  // Calculate which stage icon to show
  const StageIcon = () => {
    switch (planet.stage) {
      case 'asteroid': 
        return <Circle className="h-5 w-5 text-gray-300" />;
      case 'planet': 
        return <Circle className="h-5 w-5 text-blue-400" />;
      case 'gasGiant': 
        return <Circle className="h-5 w-5 text-purple-400" />;
      case 'star': 
        return <StarIcon className="h-5 w-5 text-orange-400" />;
    }
  };
  
  // Convert stage name to Korean
  const stageToKorean = (stage: string) => {
    switch (stage) {
      case 'asteroid': return '소행성';
      case 'planet': return '표준 행성';
      case 'gasGiant': return '가스 거인';
      case 'star': return '항성';
      default: return stage;
    }
  };
  
  return (
    <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button 
              onClick={onBack}
              variant="ghost" 
              className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 p-0"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>우주로 돌아가기</span>
            </Button>
          </div>
          <div className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center ${
                planet.isPrivate ? 'bg-[#4caf50]' : 'bg-[#3e9bff]'
              }`}
            >
              <StageIcon />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{planet.name}</h1>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-black/30 text-xs">
                  {stageToKorean(planet.stage)} 단계
                </Badge>
                <span className="text-sm text-gray-400">멤버 {planet.members}명</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Growth indicator */}
        {planet.stage !== 'star' && growth && (
          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center mb-1">
              <span className="text-sm font-medium mr-2">다음 단계까지</span>
              <Progress value={growth.progress} className="w-32 h-2" />
              <span className="text-sm ml-2">{growth.progress}%</span>
            </div>
            <p className="text-xs text-gray-400">
              {stageToKorean(growth.nextStage as string)} 단계까지 {100 - growth.progress}% 남음
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-white/5">
              <TabsTrigger value="posts">게시글</TabsTrigger>
              <TabsTrigger value="growth">행성 성장</TabsTrigger>
              <TabsTrigger value="members">멤버</TabsTrigger>
            </TabsList>
            
            {/* Posts tab */}
            <TabsContent value="posts" className="space-y-4">
              <div className="flex justify-between mb-4">
                <div></div>
                <Button 
                  onClick={() => setShowNewPostForm(true)}
                  className="bg-[#3e9bff] hover:bg-[#3e9bff]/80"
                >
                  <CirclePlus className="h-4 w-4 mr-2" />
                  새 글쓰기
                </Button>
              </div>
              
              {/* New post form */}
              {showNewPostForm && (
                <Card className="mb-6 bg-white/5 border-white/10">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Input
                        placeholder="제목"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        className="bg-white/10 border-white/20"
                      />
                      <Textarea
                        placeholder="내용을 작성해주세요..."
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        className="min-h-[200px] bg-white/10 border-white/20 resize-none"
                      />
                      <Input
                        placeholder="태그 (쉼표로 구분, 예: 질문, 토론, 정보)"
                        value={newPost.tags}
                        onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                        className="bg-white/10 border-white/20"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowNewPostForm(false)}
                        >
                          취소
                        </Button>
                        <Button 
                          onClick={handleCreatePost}
                          disabled={!newPost.title || !newPost.content}
                        >
                          게시하기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Post list */}
              {posts.length > 0 ? (
                posts.map(post => (
                  <Card key={post.id} className="bg-white/5 border-white/10">
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
                            <button className="text-gray-400 hover:text-gray-200 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-400 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                      <div 
                        className="text-gray-300 mb-4 prose-sm prose-invert max-w-none" 
                        dangerouslySetInnerHTML={{ __html: post.htmlContent || `<p>${post.content}</p>` }}
                      />
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-blue-300 border-blue-300/30">
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
                ))
              ) : (
                <div className="text-center py-12 border rounded-lg bg-white/5 border-white/10">
                  <p className="text-gray-400">아직 게시물이 없습니다.</p>
                  <Button 
                    onClick={() => setShowNewPostForm(true)}
                    variant="outline"
                    className="mt-3"
                  >
                    첫 번째 게시글 작성하기
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Growth tab */}
            <TabsContent value="growth">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold mb-1">행성 성장 정보</h2>
                    <p className="text-gray-400">현재 단계: {stageToKorean(planet.stage)}</p>
                  </div>
                  
                  {planet.stage !== 'star' && growth && (
                    <div className="space-y-6">
                      <div className="text-center bg-white/5 rounded-lg p-4">
                        <h3 className="font-medium mb-2">다음 단계: {stageToKorean(growth.nextStage as string)}</h3>
                        <div className="inline-flex items-center mb-3">
                          <Progress value={growth.progress} className="w-40 h-3" />
                          <span className="ml-3 font-bold">{growth.progress}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">활동량</span>
                            <span className="text-sm">{growth.currentActivities}/{growth.activityTarget}</span>
                          </div>
                          <Progress value={growth.activityProgress} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">멤버 수</span>
                            <span className="text-sm">{growth.currentMembers}/{growth.memberTarget}</span>
                          </div>
                          <Progress value={growth.memberProgress} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">유지 기간</span>
                            <span className="text-sm">{growth.currentDays}/{growth.daysTarget}일</span>
                          </div>
                          <Progress value={growth.daysProgress} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="font-medium mb-2">성장 혜택</h3>
                        <ul className="space-y-2 text-sm">
                          {planet.stage === 'asteroid' && (
                            <>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>표준 행성으로 진화 시 멤버 제한이 200명으로 증가</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>확장된 게시판 기능</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>TIE 통합 기능</span>
                              </li>
                            </>
                          )}
                          
                          {planet.stage === 'planet' && (
                            <>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>가스 거인으로 진화 시 멤버 제한 무제한으로 증가</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>VI 통합 기능</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>위성(서브 커뮤니티) 생성 가능</span>
                              </li>
                            </>
                          )}
                          
                          {planet.stage === 'gasGiant' && (
                            <>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>항성으로 진화 시 커스텀 기능 개발 가능</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>행성 간 이벤트 주최 권한</span>
                              </li>
                              <li className="flex items-start">
                                <span className="text-blue-400 mr-2">▸</span>
                                <span>별자리(콘스텔레이션) 생성 권한</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {planet.stage === 'star' && (
                    <div className="text-center p-6">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#ff9800] flex items-center justify-center animate-pulse">
                        <StarIcon className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">최고 단계 달성!</h3>
                      <p className="text-gray-300 mb-4">
                        이 행성은 이미 항성 단계에 도달했습니다. 최대 성장 단계를 달성했습니다!
                      </p>
                      <div className="bg-white/5 rounded-lg p-4">
                        <h4 className="font-medium mb-2">항성 특권</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="text-yellow-400 mr-2">★</span>
                            <span>커스텀 기능 개발 가능</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-400 mr-2">★</span>
                            <span>행성 간 이벤트 주최 권한</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-yellow-400 mr-2">★</span>
                            <span>별자리(콘스텔레이션) 생성 권한</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Members tab */}
            <TabsContent value="members">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">멤버 목록</h2>
                    <div className="text-sm text-gray-400">
                      총 {planet.members}명
                      {planet.stage === 'asteroid' && ' (최대 50명)'}
                      {planet.stage === 'planet' && ' (최대 200명)'}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Owner */}
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={planet.owner.avatar} alt={planet.owner.name} />
                          <AvatarFallback>{planet.owner.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{planet.owner.name}</p>
                          <Badge className="bg-blue-500/80 text-xs">소유자</Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        행성 생성일: {planet.createdAt.substring(0, 10)}
                      </div>
                    </div>
                    
                    {/* Current user */}
                    <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${username}`} alt={username} />
                          <AvatarFallback>{username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{username}</p>
                          <Badge variant="outline" className="text-xs border-white/20">멤버</Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        오늘 참여
                      </div>
                    </div>
                    
                    {/* Placeholder members */}
                    {planet.members > 2 && Array.from({ length: Math.min(5, planet.members - 2) }).map((_, idx) => {
                      const fakeName = `멤버${idx + 1}`;
                      return (
                        <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${fakeName}`} alt={fakeName} />
                              <AvatarFallback>{fakeName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{fakeName}</p>
                              <Badge variant="outline" className="text-xs border-white/20">멤버</Badge>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-400">
                            {Math.floor(Math.random() * 7) + 1}일 전 참여
                          </div>
                        </div>
                      );
                    })}
                    
                    {planet.members > 7 && (
                      <Button variant="outline" className="w-full">
                        멤버 더 보기 ({planet.members - 7}명)
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Live Chat */}
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-bold">행성 채팅</h3>
            <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30">
              <Circle className="h-2 w-2 mr-1 fill-green-500" />
              <span>{Math.floor(Math.random() * 10) + 2}명 온라인</span>
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
                disabled={!newMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetDashboard;
