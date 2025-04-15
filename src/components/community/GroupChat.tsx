
import React, { useState } from 'react';
import { 
  Send, 
  Smile, 
  PaperclipIcon, 
  Image, 
  UserPlus, 
  MoreHorizontal,
  Search,
  ChevronDown,
  MessageSquare,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Headphones,
  Volume2,
  VolumeX,
  User,
  Settings,
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock chat groups data
const MOCK_CHAT_GROUPS = [
  {
    id: 1,
    name: "피어몰 창업가 모임",
    members: ["창업왕", "디자이너K", "마케팅전문가", "신입몰러"],
    lastMessage: "오늘 세미나 자료 공유해 드립니다.",
    lastMessageTime: "10:30",
    unreadCount: 3,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group1",
    type: "text",
    isActive: true
  },
  {
    id: 2,
    name: "디지털 아트 크리에이터",
    members: ["일러스트레이터", "3D아티스트", "디자이너K", "NFT작가"],
    lastMessage: "새 작품에 대한 피드백 부탁드립니다.",
    lastMessageTime: "어제",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group2",
    type: "voice",
    isActive: true
  },
  {
    id: 3,
    name: "한국 수공예품 판매자",
    members: ["도예가", "자수작가", "목공예가", "가죽공예가"],
    lastMessage: "다음 오프라인 전시회 참가 신청하셨나요?",
    lastMessageTime: "어제",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group3",
    type: "text",
    isActive: false
  },
  {
    id: 4,
    name: "콘텐츠 마케팅 전략가",
    members: ["SEO전문가", "카피라이터", "마케팅전문가", "콘텐츠기획자"],
    lastMessage: "요즘 트렌드는 숏폼 콘텐츠입니다. 참고하세요.",
    lastMessageTime: "월요일",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group4",
    type: "text",
    isActive: false
  },
  {
    id: 5,
    name: "웹 개발자 네트워킹",
    members: ["프론트엔드개발자", "백엔드개발자", "디자이너K", "프로젝트매니저"],
    lastMessage: "다음 웨비나 주제는 React 18 입니다.",
    lastMessageTime: "화요일",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group5",
    type: "video",
    isActive: true
  },
  {
    id: 6,
    name: "스타트업 투자자 모임",
    members: ["엔젤투자자", "VC매니저", "스타트업CEO", "인큐베이터매니저"],
    lastMessage: "다음 피칭 세션은 언제인가요?",
    lastMessageTime: "수요일",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group6",
    type: "video",
    isActive: false
  },
];

// Mock messages for active chat
const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "창업왕",
    content: "여러분 안녕하세요! 오늘 세미나에 참석해주셔서 감사합니다.",
    time: "10:15",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 2,
    sender: "디자이너K",
    content: "좋은 정보 감사합니다. 발표자료도 공유해주실 수 있을까요?",
    time: "10:18",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2",
    isMe: false
  },
  {
    id: 3,
    sender: "창업왕",
    content: "네, 물론이죠! 세미나 자료 공유해드립니다.",
    time: "10:20",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 4,
    sender: "마케팅전문가",
    content: "정말 유익한 시간이었습니다. 다음 세미나도 기대할게요.",
    time: "10:23",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3",
    isMe: false
  },
  {
    id: 5,
    sender: "신입몰러",
    content: "처음 참여했는데 많은 도움이 되었어요! 다음에도 참여하고 싶습니다.",
    time: "10:25",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user4",
    isMe: false
  },
  {
    id: 6,
    sender: "창업왕",
    content: "다음 세미나는 '피어몰 매출 증대를 위한 SNS 마케팅 전략'을 주제로 진행할 예정입니다. 많은 참여 부탁드립니다!",
    time: "10:28",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 7,
    sender: "창업왕",
    content: "오늘 세미나 자료 공유해 드립니다.",
    time: "10:30",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 8,
    sender: "익명 사용자",
    content: "감사합니다! 잘 보겠습니다.",
    time: "10:32",
    avatar: "",
    isMe: true
  }
];

// Mock active members
const ACTIVE_MEMBERS = [
  { name: "창업왕", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1" },
  { name: "디자이너K", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2" },
  { name: "마케팅전문가", status: "away", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3" },
  { name: "신입몰러", status: "offline", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user4" },
];

const GroupChat = () => {
  const [chatGroups, setChatGroups] = useState(MOCK_CHAT_GROUPS);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [channelType, setChannelType] = useState("text");
  const [activeView, setActiveView] = useState("rooms");
  
  const filteredGroups = chatGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "익명 사용자",
        content: newMessage.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        avatar: "",
        isMe: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Update last message in groups
      setChatGroups(chatGroups.map(group => 
        group.id === activeGroup?.id 
          ? { ...group, lastMessage: newMessage.trim(), lastMessageTime: "방금", unreadCount: 0 }
          : group
      ));
    }
  };

  const handleJoinChannel = (group) => {
    // If already in a channel, leave it first
    if (activeGroup) {
      handleLeaveChannel();
    }
    
    setActiveGroup(group);
    setActiveView("chat");
    
    // Reset controls when joining a new room
    setIsMuted(false);
    setIsVideoOff(true);
    if (group.type !== "text") {
      toast.success(`'${group.name}' 채널에 참여했습니다.`);
    }
  };
  
  const handleLeaveChannel = () => {
    if (!activeGroup) return;
    
    toast.info(`'${activeGroup.name}' 채널에서 나왔습니다.`);
    setActiveGroup(null);
    setActiveView("rooms");
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "마이크가 활성화되었습니다." : "마이크가 비활성화되었습니다.");
  };
  
  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast.info(isVideoOff ? "비디오가 활성화되었습니다." : "비디오가 비활성화되었습니다.");
  };
  
  const handleToggleDeafen = () => {
    setIsDeafened(!isDeafened);
    toast.info(isDeafened ? "음성을 다시 들을 수 있습니다." : "음성이 음소거되었습니다.");
  };
  
  const handleCreateChannel = () => {
    if (!newChannelName.trim()) {
      toast.error("채널 이름을 입력해주세요.");
      return;
    }
    
    const newChannel = {
      id: chatGroups.length + 1,
      name: newChannelName,
      members: [],
      lastMessage: `${newChannelName} 채널이 생성되었습니다.`,
      lastMessageTime: "방금",
      unreadCount: 0,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=group${chatGroups.length + 1}`,
      type: channelType,
      isActive: true
    };
    
    setChatGroups([...chatGroups, newChannel]);
    setNewChannelName("");
    setNewChannelDescription("");
    setIsSettingsOpen(false);
    toast.success(`'${newChannelName}' 채널이 생성되었습니다.`);
  };

  const getChannelTypeIcon = (type, isActive = false) => {
    switch (type) {
      case "voice":
        return <Headphones className={`h-4 w-4 ${isActive ? "text-green-500" : ""}`} />;
      case "video":
        return <Video className={`h-4 w-4 ${isActive ? "text-green-500" : ""}`} />;
      default:
        return <MessageSquare className={`h-4 w-4 ${isActive ? "text-green-500" : ""}`} />;
    }
  };

  const renderChatInterface = () => {
    if (!activeGroup) return null;
    
    switch (activeGroup.type) {
      case "voice":
        return (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={activeGroup.avatar} alt={activeGroup.name} />
                <AvatarFallback>{activeGroup.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{activeGroup.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">음성 채팅 중</p>
              <Badge className="mb-4">{activeGroup.members.length}명 참여 중</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <Button 
                variant={isMuted ? "destructive" : "outline"} 
                size="lg" 
                className="flex flex-col items-center h-20"
                onClick={handleToggleMute}
              >
                {isMuted ? <MicOff className="h-8 w-8 mb-1" /> : <Mic className="h-8 w-8 mb-1" />}
                {isMuted ? "음소거됨" : "마이크"}
              </Button>
              
              <Button 
                variant={isDeafened ? "destructive" : "outline"} 
                size="lg" 
                className="flex flex-col items-center h-20"
                onClick={handleToggleDeafen}
              >
                {isDeafened ? <VolumeX className="h-8 w-8 mb-1" /> : <Headphones className="h-8 w-8 mb-1" />}
                {isDeafened ? "오디오 꺼짐" : "오디오"}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="flex flex-col items-center h-20"
              >
                <Settings className="h-8 w-8 mb-1" />
                설정
              </Button>
            </div>
            
            <Separator className="my-6 w-full max-w-md" />
            
            <Button variant="destructive" size="lg" className="w-full max-w-md" onClick={handleLeaveChannel}>
              채널 나가기
            </Button>
          </div>
        );
      
      case "video":
        return (
          <div className="flex flex-col h-full">
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {activeGroup.members.slice(0, 3).map((member, idx) => (
                <div key={idx} className="relative bg-slate-800 rounded-lg aspect-video flex items-center justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${member}`} alt={member} />
                    <AvatarFallback>{member.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">
                    {member}
                  </div>
                </div>
              ))}
              
              <div className="relative bg-slate-800 rounded-lg aspect-video flex items-center justify-center">
                {isVideoOff ? (
                  <Avatar className="h-24 w-24">
                    <AvatarFallback>나</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-full h-full bg-slate-700"></div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">
                  나 (익명 사용자)
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t bg-background flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Button 
                  variant={isMuted ? "destructive" : "outline"} 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={handleToggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant={isVideoOff ? "destructive" : "outline"} 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={handleToggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full h-12 w-12"
                  onClick={handleLeaveChannel}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={activeGroup.avatar} alt={activeGroup.name} />
                  <AvatarFallback>{activeGroup.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activeGroup.name}</h3>
                  <p className="text-xs text-muted-foreground">{activeGroup.members.length}명 참여 중</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setShowMembers(!showMembers)}>
                  <UserPlus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Chat area with messages */}
            <div className="flex flex-1 overflow-hidden">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isMe ? 'justify-end' : 'items-start gap-3'}`}
                    >
                      {!message.isMe && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.avatar} alt={message.sender} />
                          <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`max-w-[80%] ${
                          message.isMe ? 'bg-primary text-white' : 'bg-muted'
                        } rounded-lg px-4 py-2`}
                      >
                        {!message.isMe && (
                          <p className="text-xs font-medium mb-1">{message.sender}</p>
                        )}
                        <p>{message.content}</p>
                        <p className="text-xs text-right mt-1 opacity-70">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Members sidebar */}
              {showMembers && (
                <div className="w-60 border-l p-4 hidden md:block">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">참여자 목록</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowMembers(false)}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Collapsible defaultOpen>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span>온라인 (2)</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-3 mt-1">
                        {ACTIVE_MEMBERS.filter(m => m.status === "online").map((member, idx) => (
                          <div key={idx} className="flex items-center gap-2 py-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span>자리비움 (1)</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-3 mt-1">
                        {ACTIVE_MEMBERS.filter(m => m.status === "away").map((member, idx) => (
                          <div key={idx} className="flex items-center gap-2 py-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                          <span>오프라인 (1)</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-3 mt-1">
                        {ACTIVE_MEMBERS.filter(m => m.status === "offline").map((member, idx) => (
                          <div key={idx} className="flex items-center gap-2 py-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{member.name}</span>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <PaperclipIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Image className="h-5 w-5" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="메시지 입력..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button onClick={handleSendMessage}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        );
    }
  };

  const renderChatRooms = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="채팅방 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <Button onClick={() => setIsSettingsOpen(true)} className="ml-4">
              <Plus className="h-4 w-4 mr-1" />
              새 채널 생성
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="text">텍스트 채팅</TabsTrigger>
              <TabsTrigger value="voice">음성 채팅</TabsTrigger>
              <TabsTrigger value="video">화상 채팅</TabsTrigger>
              <TabsTrigger value="active">활성화된 채널</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
            
            <TabsContent value="text">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(group => group.type === "text").map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
            
            <TabsContent value="voice">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(group => group.type === "voice").map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
            
            <TabsContent value="video">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(group => group.type === "video").map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(group => group.isActive).map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };
  
  const renderChatRoomCard = (group) => {
    return (
      <Card key={group.id} className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <CardTitle className="text-lg mr-2">{group.name}</CardTitle>
              {getChannelTypeIcon(group.type, group.isActive)}
            </div>
            {group.isActive && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                활성화됨
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-1 flex items-center">
            <span className="mr-1">{group.members.length}명 참여 중</span> 
            {group.unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">{group.unreadCount}</Badge>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-0">
          {group.members.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden mb-2">
              {group.members.slice(0, 4).map((member, idx) => (
                <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${member}`} alt={member} />
                  <AvatarFallback>{member.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
              {group.members.length > 4 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{group.members.length - 4}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">아직 참가자가 없습니다</p>
          )}
          <p className="text-sm text-muted-foreground truncate">{group.lastMessage}</p>
          <p className="text-xs text-muted-foreground mt-1">{group.lastMessageTime}</p>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button 
            className="w-full" 
            variant={group.type === "text" ? "default" : (group.type === "voice" ? "outline" : "secondary")}
            onClick={() => handleJoinChannel(group)}
          >
            {group.type === "text" ? "채팅 참여" : group.type === "voice" ? "음성 채팅 참여" : "화상 채팅 참여"}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  // Main component render
  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col rounded-lg border overflow-hidden">
      {activeView === "rooms" ? (
        // Room selection view
        renderChatRooms()
      ) : (
        // Active chat view
        <div className="flex flex-col h-full">
          {/* Back button when in a chat */}
          <div className="bg-muted/50 p-2 flex items-center">
            <Button variant="ghost" size="sm" className="mr-2" onClick={() => setActiveView("rooms")}>
              <ChevronDown className="h-4 w-4 mr-1" />
              채팅방 목록으로
            </Button>
            {activeGroup && (
              <p className="text-sm text-muted-foreground">
                {activeGroup.name} ({activeGroup.type === "text" ? "텍스트" : activeGroup.type === "voice" ? "음성" : "화상"} 채팅)
              </p>
            )}
          </div>
          
          {/* Chat interface */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderChatInterface()}
          </div>
        </div>
      )}
      
      {/* Create channel dialog */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">새 채널 만들기</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="channel-name" className="text-sm font-medium block mb-1">채널 이름</label>
                <input 
                  id="channel-name"
                  type="text"
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="채널 이름"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="channel-description" className="text-sm font-medium block mb-1">채널 설명 (선택사항)</label>
                <textarea 
                  id="channel-description"
                  className="w-full border rounded-md px-3 py-2 h-24 resize-none"
                  placeholder="채널에 대한 간략한 설명을 입력하세요."
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">채널 유형</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button" 
                    variant={channelType === "text" ? "default" : "outline"} 
                    onClick={() => setChannelType("text")}
                    className="flex items-center justify-center"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    텍스트
                  </Button>
                  <Button 
                    type="button" 
                    variant={channelType === "voice" ? "default" : "outline"} 
                    onClick={() => setChannelType("voice")}
                    className="flex items-center justify-center"
                  >
                    <Headphones className="h-4 w-4 mr-1" />
                    음성
                  </Button>
                  <Button 
                    type="button" 
                    variant={channelType === "video" ? "default" : "outline"} 
                    onClick={() => setChannelType("video")}
                    className="flex items-center justify-center"
                  >
                    <Video className="h-4 w-4 mr-1" />
                    화상
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>취소</Button>
                <Button onClick={handleCreateChannel}>채널 생성</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
