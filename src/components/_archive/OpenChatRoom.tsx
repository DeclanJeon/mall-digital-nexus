
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Send, 
  Smile, 
  PaperclipIcon, 
  Image as ImageIcon, 
  UserPlus, 
  MoreHorizontal,
  ChevronDown,
  Mic,
  Video,
  ScreenShare,
  Globe,
  Settings,
  ArrowLeft,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  avatar: string;
  isMe: boolean;
}

interface RoomMember {
  id: string;
  name: string;
  status: 'online' | 'away' | 'offline';
  avatar: string;
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'text' | 'voice' | 'video';
  description: string;
  creator: string;
  participantsCount: number;
  isPrivate: boolean;
  password?: string;
  features: string[];
  timestamp: Date;
}

const OpenChatRoom: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomData = location.state?.room as ChatRoom;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState<Record<string, boolean>>({
    voice: false,
    video: false,
    screenShare: false,
    webSync: false
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Mock members data - in a real app, this would come from backend
  const [members] = useState<RoomMember[]>([
    { id: '1', name: roomData?.creator || '방장', status: 'online', avatar: `https://api.dicebear.com/7.x/personas/svg?seed=admin` },
    { id: '2', name: '참여자1', status: 'online', avatar: `https://api.dicebear.com/7.x/personas/svg?seed=user1` },
    { id: '3', name: '참여자2', status: 'online', avatar: `https://api.dicebear.com/7.x/personas/svg?seed=user2` },
    { id: '4', name: '참여자3', status: 'away', avatar: `https://api.dicebear.com/7.x/personas/svg?seed=user3` },
    { id: '5', name: '참여자4', status: 'offline', avatar: `https://api.dicebear.com/7.x/personas/svg?seed=user4` },
  ]);

  // Initialize with welcome message
  useEffect(() => {
    if (!roomData) {
      navigate('/community');
      return;
    }

    // Welcome message
    setMessages([
      {
        id: 1,
        sender: roomData.creator,
        content: `${roomData.name} 채팅방에 오신 것을 환영합니다!`,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        avatar: `https://api.dicebear.com/7.x/personas/svg?seed=admin`,
        isMe: false
      }
    ]);
  }, [roomData, navigate]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: "나",
        content: newMessage.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        avatar: "",
        isMe: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  const toggleFeature = (feature: string) => {
    setActiveFeatures(prev => {
      const newState = { ...prev, [feature]: !prev[feature] };
      
      // Show toast based on activation/deactivation
      if (newState[feature]) {
        toast.success(`${getFeatureName(feature)} 기능이 활성화되었습니다.`);
      } else {
        toast.info(`${getFeatureName(feature)} 기능이 비활성화되었습니다.`);
      }
      
      return newState;
    });
  };

  const getFeatureName = (feature: string): string => {
    switch (feature) {
      case 'voice': return '음성 채팅';
      case 'video': return '화상 채팅';
      case 'screenShare': return '화면 공유';
      case 'webSync': return '웹 공유 (WebSync)';
      default: return feature;
    }
  };

  const handleLeaveRoom = () => {
    toast.info(`${roomData?.name} 채팅방에서 나갔습니다.`);
    navigate('/community');
  };

  // If no room data was passed, redirect back
  if (!roomData) {
    return <div className="p-8 text-center">잘못된 접근입니다. <Button onClick={() => navigate('/community')}>돌아가기</Button></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header with room info and controls */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLeaveRoom}
              className="mr-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/shapes/svg?seed=${roomData.id}`} 
                alt={roomData.name} 
              />
              <AvatarFallback className="bg-accent-200 text-white">
                {roomData.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-lg">
                {roomData.name}
                {roomData.isPrivate && (
                  <Badge variant="outline" className="ml-2 gap-1 text-xs">비공개</Badge>
                )}
              </h3>
              <div className="flex items-center text-sm text-gray-500 gap-1">
                <span>{members.length}명 참여 중</span>
                <span className="mx-1">•</span>
                <span>
                  {roomData.type === 'text' ? '텍스트 채팅방' : 
                   roomData.type === 'voice' ? '음성 채팅방' : '화상 채팅방'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMembers(!showMembers)} 
              className={showMembers ? "bg-primary-100 text-accent-200" : ""}
            >
              <UserPlus className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Feature toggle buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {roomData.type !== 'voice' && (
            <Button
              size="sm"
              variant={activeFeatures.voice ? "default" : "outline"}
              className={activeFeatures.voice ? "bg-accent-200 hover:bg-accent-200/90" : ""}
              onClick={() => toggleFeature('voice')}
            >
              <Mic className="h-4 w-4 mr-1" />
              음성 채팅
            </Button>
          )}
          
          {roomData.type !== 'video' && (
            <Button
              size="sm"
              variant={activeFeatures.video ? "default" : "outline"}
              className={activeFeatures.video ? "bg-accent-200 hover:bg-accent-200/90" : ""}
              onClick={() => toggleFeature('video')}
            >
              <Video className="h-4 w-4 mr-1" />
              화상 채팅
            </Button>
          )}
          
          {roomData.features.includes('화면공유') && (
            <Button
              size="sm"
              variant={activeFeatures.screenShare ? "default" : "outline"}
              className={activeFeatures.screenShare ? "bg-accent-200 hover:bg-accent-200/90" : ""}
              onClick={() => toggleFeature('screenShare')}
            >
              <ScreenShare className="h-4 w-4 mr-1" />
              화면 공유
            </Button>
          )}
          
          {roomData.features.includes('웹공유') && (
            <Button
              size="sm"
              variant={activeFeatures.webSync ? "default" : "outline"}
              className={activeFeatures.webSync ? "bg-accent-200 hover:bg-accent-200/90" : ""}
              onClick={() => toggleFeature('webSync')}
            >
              <Globe className="h-4 w-4 mr-1" />
              웹 공유 (WebSync)
            </Button>
          )}
        </div>
      </div>
      
      {/* Main content area with chat and members sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Audio/video area */}
          {(activeFeatures.voice || activeFeatures.video || activeFeatures.screenShare) && (
            <div className="bg-gray-100 p-4 border-b">
              {activeFeatures.video && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {members.filter(m => m.status === 'online').slice(0, 4).map((member) => (
                    <div key={member.id} className="relative bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-accent-100 text-white">{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs py-1 px-2 rounded-md">
                        {member.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeFeatures.voice && !activeFeatures.video && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {members.filter(m => m.status === 'online').slice(0, 6).map((member) => (
                    <div key={member.id} className="flex items-center bg-white rounded-full border px-3 py-1">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-accent-100 text-white text-xs">{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                      <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeFeatures.screenShare && (
                <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center mb-4">
                  <div className="text-white text-center">
                    <ScreenShare className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p>화면 공유 중...</p>
                  </div>
                </div>
              )}
              
              {activeFeatures.webSync && (
                <div className="bg-white rounded-lg border p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">WebSync 세션</h3>
                    <Badge>활성화됨</Badge>
                  </div>
                  <div className="flex items-center bg-gray-100 rounded-md p-2">
                    <Globe className="h-4 w-4 mr-2 text-accent-200" />
                    <Input 
                      placeholder="웹사이트 URL 입력..." 
                      className="border-0 bg-transparent focus-visible:ring-0 h-8"
                    />
                    <Button size="sm" className="ml-2">공유</Button>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center gap-2">
                {activeFeatures.voice && (
                  <Button variant="outline" size="sm" onClick={() => toggleFeature('voice')}>
                    <Mic className="h-4 w-4 mr-1" />
                    음성 채팅 종료
                  </Button>
                )}
                
                {activeFeatures.video && (
                  <Button variant="outline" size="sm" onClick={() => toggleFeature('video')}>
                    <Video className="h-4 w-4 mr-1" />
                    화상 채팅 종료
                  </Button>
                )}
                
                {activeFeatures.screenShare && (
                  <Button variant="outline" size="sm" onClick={() => toggleFeature('screenShare')}>
                    <ScreenShare className="h-4 w-4 mr-1" />
                    화면 공유 종료
                  </Button>
                )}
                
                {activeFeatures.webSync && (
                  <Button variant="outline" size="sm" onClick={() => toggleFeature('webSync')}>
                    <Globe className="h-4 w-4 mr-1" />
                    웹 공유 종료
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {/* Messages area */}
          <ScrollArea className="flex-1 p-4 bg-gray-50">
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
          
          {/* Message input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center gap-2">
              {roomData.features.includes('파일전송') && (
                <Button variant="ghost" size="icon" className="text-accent-200 hover:bg-primary-100">
                  <PaperclipIcon className="h-5 w-5" />
                </Button>
              )}
              
              {roomData.features.includes('파일전송') && (
                <Button variant="ghost" size="icon" className="text-accent-200 hover:bg-primary-100">
                  <ImageIcon className="h-5 w-5" />
                </Button>
              )}
              
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
        
        {/* Members sidebar */}
        {showMembers && (
          <div className="w-60 border-l p-4 bg-white hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-primary-300">참여자 목록</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary-100" onClick={() => setShowMembers(false)}>
                <X className="h-4 w-4 text-accent-200" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Online members */}
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium w-full">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>온라인 ({members.filter(m => m.status === "online").length})</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-3 mt-1">
                  {members.filter(m => m.status === "online").map((member, idx) => (
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
              
              {/* Away members */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium w-full">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span>자리비움 ({members.filter(m => m.status === "away").length})</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-3 mt-1">
                  {members.filter(m => m.status === "away").map((member, idx) => (
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
              
              {/* Offline members */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium w-full">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span>오프라인 ({members.filter(m => m.status === "offline").length})</span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-auto" />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-3 mt-1">
                  {members.filter(m => m.status === "offline").map((member, idx) => (
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
      
      {/* Room settings dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>채팅방 설정</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">알림 설정</Label>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sound">소리 알림</Label>
                <Switch id="sound" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="block">채팅방 나가기</Label>
                  <p className="text-sm text-gray-500">채팅 기록이 유지됩니다</p>
                </div>
                <Button variant="outline" onClick={handleLeaveRoom}>나가기</Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenChatRoom;
