
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
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';

// Mock chat groups data
const MOCK_CHAT_GROUPS = [
  {
    id: 1,
    name: "피어몰 창업가 모임",
    members: ["창업왕", "디자이너K", "마케팅전문가", "신입몰러"],
    lastMessage: "오늘 세미나 자료 공유해 드립니다.",
    lastMessageTime: "10:30",
    unreadCount: 3,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group1"
  },
  {
    id: 2,
    name: "디지털 아트 크리에이터",
    members: ["일러스트레이터", "3D아티스트", "디자이너K", "NFT작가"],
    lastMessage: "새 작품에 대한 피드백 부탁드립니다.",
    lastMessageTime: "어제",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group2"
  },
  {
    id: 3,
    name: "한국 수공예품 판매자",
    members: ["도예가", "자수작가", "목공예가", "가죽공예가"],
    lastMessage: "다음 오프라인 전시회 참가 신청하셨나요?",
    lastMessageTime: "어제",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group3"
  },
  {
    id: 4,
    name: "콘텐츠 마케팅 전략가",
    members: ["SEO전문가", "카피라이터", "마케팅전문가", "콘텐츠기획자"],
    lastMessage: "요즘 트렌드는 숏폼 콘텐츠입니다. 참고하세요.",
    lastMessageTime: "월요일",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group4"
  }
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
    <div className="flex h-[calc(100vh-14rem)] rounded-lg overflow-hidden border">
      {/* Sidebar with chat groups */}
      <div className="w-full sm:w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Input
              placeholder="채팅방 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                    activeGroup.id === group.id ? 'bg-accent' : 'hover:bg-accent/50'
                  }`}
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
                    <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{group.name}</p>
                      <span className="text-xs text-muted-foreground">{group.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{group.lastMessage}</p>
                  </div>
                  {group.unreadCount > 0 && (
                    <Badge className="ml-auto">{group.unreadCount}</Badge>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
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
      </div>
    </div>
  );
};

export default GroupChat;
