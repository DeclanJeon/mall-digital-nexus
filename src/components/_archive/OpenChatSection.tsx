
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
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';

// Mock chat rooms data
const MOCK_CHAT_ROOMS = [
  {
    id: 1,
    name: "피어몰 오픈 채팅",
    members: ["창업왕", "디자이너K", "마케팅전문가", "신입몰러", "참여자1", "참여자2"],
    lastMessage: "피어몰 런칭 기념 이벤트 안내입니다.",
    lastMessageTime: "10:30",
    unreadCount: 3,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group1"
  },
  {
    id: 2,
    name: "디지털 마케팅 모임",
    members: ["광고전문가", "콘텐츠크리에이터", "SEO전문가", "마케터1"],
    lastMessage: "오늘 webinar 참여하신 분들 후기 부탁드립니다.",
    lastMessageTime: "어제",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group2"
  },
  {
    id: 3,
    name: "프리랜서 네트워킹",
    members: ["개발자A", "디자이너Z", "마케터B", "번역가C"],
    lastMessage: "협업 프로젝트 구인 중입니다. 관심 있으신 분들은 DM 주세요!",
    lastMessageTime: "어제",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group3"
  },
  {
    id: 4,
    name: "온라인 쇼핑몰 운영자",
    members: ["쇼핑몰CEO", "MD전문가", "고객서비스", "물류담당"],
    lastMessage: "명절 전 주문량 증가에 대한 대응 방안 논의합시다.",
    lastMessageTime: "월요일",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group4"
  },
  {
    id: 5,
    name: "스타트업 네트워킹",
    members: ["창업가A", "투자자B", "개발자C", "디자이너D"],
    lastMessage: "다음 주 피칭 행사에 대한 안내사항입니다.",
    lastMessageTime: "화요일",
    unreadCount: 2,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group5"
  },
  {
    id: 6,
    name: "취미 공유 모임",
    members: ["사진작가", "여행가", "요리사", "공예가"],
    lastMessage: "이번 주말 오프라인 모임 장소가 변경되었습니다.",
    lastMessageTime: "수요일",
    unreadCount: 1,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group6"
  }
];

// Mock messages for active chat
const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "운영자",
    content: "피어몰 오픈 채팅방에 오신 것을 환영합니다! 이곳은 피어몰 관련 정보와 소식을 나누는 공간입니다.",
    time: "10:15",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=admin",
    isMe: false
  },
  {
    id: 2,
    sender: "디자이너K",
    content: "안녕하세요! 피어몰 디자인 관련해서 질문이 있으신 분들은 저에게 언제든 문의해주세요.",
    time: "10:18",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2",
    isMe: false
  },
  {
    id: 3,
    sender: "창업왕",
    content: "피어몰 런칭 기념 이벤트가 다음 주부터 시작됩니다. 많은 참여 부탁드립니다!",
    time: "10:20",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 4,
    sender: "마케팅전문가",
    content: "홍보 전략에 대해 의견 나눌 분들 계신가요? 함께 아이디어를 모아보면 좋을 것 같습니다.",
    time: "10:23",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3",
    isMe: false
  },
  {
    id: 5,
    sender: "신입몰러",
    content: "피어몰 시작한 지 얼마 안 된 초보입니다. 좋은 조언 부탁드려요!",
    time: "10:25",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user4",
    isMe: false
  },
  {
    id: 6,
    sender: "창업왕",
    content: "이벤트 상세 정보는 공지사항에 올려드릴게요. 많은 관심 부탁드립니다.",
    time: "10:28",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 7,
    sender: "운영자",
    content: "피어몰 런칭 기념 이벤트 안내입니다.",
    time: "10:30",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=admin",
    isMe: false
  },
  {
    id: 8,
    sender: "익명 사용자",
    content: "감사합니다! 이벤트 기대할게요.",
    time: "10:32",
    avatar: "",
    isMe: true
  }
];

// Mock active members
const ACTIVE_MEMBERS = [
  { name: "운영자", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=admin" },
  { name: "창업왕", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1" },
  { name: "디자이너K", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2" },
  { name: "마케팅전문가", status: "away", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3" },
  { name: "신입몰러", status: "offline", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user4" },
  { name: "참여자1", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user5" },
  { name: "참여자2", status: "away", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user6" },
];

const OpenChatComponent = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [chatGroups, setChatGroups] = useState(MOCK_CHAT_ROOMS);
  const [activeGroup, setActiveGroup] = useState(chatGroups[0]);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
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
        group.id === activeGroup.id 
          ? { ...group, lastMessage: newMessage.trim(), lastMessageTime: "방금", unreadCount: 0 }
          : group
      ));
    }
  };

  return (
    <div className="min-h-screen bg-bg-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-primary-300">오픈 채팅방</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-2 mb-6 bg-bg-200 text-text-200">
            <TabsTrigger value="chats" className="data-[state=active]:bg-accent-100 data-[state=active]:text-white">채팅방</TabsTrigger>
            <TabsTrigger value="popular" className="data-[state=active]:bg-accent-100 data-[state=active]:text-white">인기 채팅방</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chats" className="animate-fade-in">
            <div className="flex h-[calc(100vh-14rem)] rounded-lg overflow-hidden border bg-white shadow-lg">
              {/* Sidebar with chat groups */}
              <div className="w-full sm:w-80 border-r flex flex-col bg-bg-100">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Input
                      placeholder="채팅방 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-accent-200/20 focus:border-accent-200"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-200/70" />
                  </div>
                </div>
                
                {/* Chat rooms list */}
                <ScrollArea className="flex-grow">
                  <div className="p-2">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((group) => (
                        <div 
                          key={group.id}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer ${
                            activeGroup.id === group.id ? 'bg-primary-100' : 'hover:bg-primary-100/50'
                          } transition-all duration-200`}
                          onClick={() => {
                            setActiveGroup(group);
                            // Mark as read when clicking on chat
                            setChatGroups(chatGroups.map(g => 
                              g.id === group.id ? { ...g, unreadCount: 0 } : g
                            ));
                          }}
                        >
                          <Avatar>
                            <AvatarImage src={group.avatar} alt={group.name} />
                            <AvatarFallback className="bg-accent-200 text-white">{group.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className="font-medium truncate text-text-100">{group.name}</p>
                              <span className="text-xs text-text-200/70">{group.lastMessageTime}</span>
                            </div>
                            <p className="text-sm text-text-200 truncate">{group.lastMessage}</p>
                            <div className="flex items-center mt-1">
                              <div className="flex -space-x-2 mr-2">
                                {group.members.slice(0, 3).map((member, idx) => (
                                  <div key={idx} className="h-4 w-4 rounded-full bg-accent-100 border border-white flex items-center justify-center text-[8px] text-white">
                                    {member.substring(0, 1)}
                                  </div>
                                ))}
                                {group.members.length > 3 && (
                                  <div className="h-4 w-4 rounded-full bg-gray-300 border border-white flex items-center justify-center text-[8px] text-white">
                                    +{group.members.length - 3}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-text-200/70">{group.members.length}명</span>
                            </div>
                          </div>
                          {group.unreadCount > 0 && (
                            <Badge className="bg-accent-200">{group.unreadCount}</Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-text-200">
                        검색 결과가 없습니다.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Chat area */}
              <div className="flex-1 flex flex-col">
                {/* Chat header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={activeGroup.avatar} alt={activeGroup.name} />
                      <AvatarFallback className="bg-accent-200 text-white">{activeGroup.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg text-primary-300">{activeGroup.name}</h3>
                      <p className="text-xs text-text-200">{activeGroup.members.length}명 참여 중</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowMembers(!showMembers)}
                      className="hover:bg-primary-100 text-accent-200"
                    >
                      <UserPlus className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-primary-100 text-accent-200">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-1 overflow-hidden">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4 bg-bg-100/50">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.isMe ? 'justify-end' : 'items-start gap-3'} animate-fade-in`}
                        >
                          {!message.isMe && (
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.avatar} alt={message.sender} />
                              <AvatarFallback className="bg-accent-100 text-white">{message.sender.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          )}
                          <div 
                            className={`max-w-[80%] ${
                              message.isMe ? 'bg-accent-100 text-white' : 'bg-white border border-gray-100'
                            } rounded-lg px-4 py-2 shadow-sm`}
                          >
                            {!message.isMe && (
                              <p className="text-xs font-medium mb-1 text-accent-200">{message.sender}</p>
                            )}
                            <p className={`${message.isMe ? 'text-white' : 'text-text-100'}`}>{message.content}</p>
                            <p className="text-xs text-right mt-1 opacity-70">{message.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {/* Members sidebar */}
                  {showMembers && (
                    <div className="w-60 border-l p-4 hidden md:block bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-primary-300">참여자 목록</h3>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-100" onClick={() => setShowMembers(false)}>
                          <ChevronDown className="h-4 w-4 text-accent-200" />
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <Collapsible defaultOpen>
                          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span>온라인 ({ACTIVE_MEMBERS.filter(m => m.status === "online").length})</span>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-3 mt-1">
                            {ACTIVE_MEMBERS.filter(m => m.status === "online").map((member, idx) => (
                              <div key={idx} className="flex items-center gap-2 py-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback className="bg-accent-100 text-white">{member.name.substring(0, 2)}</AvatarFallback>
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
                              <span>자리비움 ({ACTIVE_MEMBERS.filter(m => m.status === "away").length})</span>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-3 mt-1">
                            {ACTIVE_MEMBERS.filter(m => m.status === "away").map((member, idx) => (
                              <div key={idx} className="flex items-center gap-2 py-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback className="bg-accent-100 text-white">{member.name.substring(0, 2)}</AvatarFallback>
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
                              <span>오프라인 ({ACTIVE_MEMBERS.filter(m => m.status === "offline").length})</span>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-3 mt-1">
                            {ACTIVE_MEMBERS.filter(m => m.status === "offline").map((member, idx) => (
                              <div key={idx} className="flex items-center gap-2 py-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback className="bg-accent-100 text-white">{member.name.substring(0, 2)}</AvatarFallback>
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
                <div className="p-4 border-t bg-white">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-accent-200 hover:bg-primary-100">
                      <PaperclipIcon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-accent-200 hover:bg-primary-100">
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
                        className="pr-10 border-accent-200/20 focus:border-accent-200"
                      />
                      <Button variant="ghost" size="icon" className="absolute right-0 top-0 text-accent-200">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <Button onClick={handleSendMessage} className="bg-accent-200 hover:bg-accent-200/90">
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="popular" className="animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_CHAT_ROOMS.map((room) => (
                  <div 
                    key={room.id}
                    className="border rounded-lg p-4 hover:border-accent-100 transition-colors cursor-pointer hover:shadow-md"
                    onClick={() => {
                      setActiveGroup(room);
                      setActiveTab("chats");
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarImage src={room.avatar} alt={room.name} />
                        <AvatarFallback className="bg-accent-200 text-white">{room.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-primary-300">{room.name}</h3>
                        <p className="text-xs text-text-200">참여자 {room.members.length}명</p>
                      </div>
                    </div>
                    <p className="text-sm text-text-200 mb-3 line-clamp-2">{room.lastMessage}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-2">
                        {room.members.slice(0, 3).map((member, idx) => (
                          <Avatar key={idx} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="bg-accent-100 text-white text-xs">{member.substring(0, 1)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {room.members.length > 3 && (
                          <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                            +{room.members.length - 3}
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs border-accent-200 text-accent-200 hover:bg-accent-100 hover:text-white"
                      >
                        참여하기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OpenChatComponent;
