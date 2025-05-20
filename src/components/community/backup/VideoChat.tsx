
import React, { useState } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff,
  MonitorSmartphone,
  ScreenShare,
  UserPlus,
  Settings,
  Layout,
  Grid,
  MessageSquare,
  X,
  Users,
  Hand
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Mock video participants
const MOCK_PARTICIPANTS = [
  {
    id: 1,
    name: "창업왕",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isSpeaking: true,
    isVideoOn: true,
    isMuted: false,
    isScreenSharing: false,
    isHandRaised: false
  },
  {
    id: 2,
    name: "디자이너K",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2",
    isSpeaking: false,
    isVideoOn: true,
    isMuted: false,
    isScreenSharing: false,
    isHandRaised: false
  },
  {
    id: 3,
    name: "마케팅전문가",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3",
    isSpeaking: false,
    isVideoOn: false,
    isMuted: true,
    isScreenSharing: false,
    isHandRaised: true
  }
];

const MOCK_MESSAGES = [
  { id: 1, sender: "창업왕", content: "안녕하세요! 오늘 미팅에 참석해주셔서 감사합니다.", time: "13:01" },
  { id: 2, sender: "디자이너K", content: "네, 반갑습니다.", time: "13:02" },
  { id: 3, sender: "마케팅전문가", content: "저도 참석했습니다. 오늘 안건은 무엇인가요?", time: "13:03" }
];

const VideoChat = () => {
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [layout, setLayout] = useState("grid");
  
  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toast.info(isVideoOn ? "비디오가 비활성화되었습니다." : "비디오가 활성화되었습니다.");
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "마이크가 활성화되었습니다." : "마이크가 비활성화되었습니다.");
  };
  
  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.info(isScreenSharing ? "화면 공유가 중지되었습니다." : "화면 공유가 시작되었습니다.");
  };
  
  const handleToggleHand = () => {
    setIsHandRaised(!isHandRaised);
    toast.info(isHandRaised ? "손을 내렸습니다." : "손을 들었습니다.");
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "익명 사용자",
        content: newMessage.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };
  
  const userParticipant = {
    id: 0,
    name: "익명 사용자",
    avatar: "",
    isSpeaking: false,
    isVideoOn: isVideoOn,
    isMuted: isMuted,
    isScreenSharing: isScreenSharing,
    isHandRaised: isHandRaised
  };
  
  const allParticipants = [...participants, userParticipant];
  
  // Move screen sharing participants to the top
  const sortedParticipants = allParticipants.sort((a, b) => {
    if (a.isScreenSharing && !b.isScreenSharing) return -1;
    if (!a.isScreenSharing && b.isScreenSharing) return 1;
    return 0;
  });
  
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      {/* Video chat area */}
      <div className="relative flex-grow bg-black rounded-lg overflow-hidden">
        {/* Participant videos grid */}
        <div className={`h-full w-full ${layout === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 p-1" : "flex flex-col"}`}>
          {layout === "grid" ? (
            sortedParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className={`relative ${participant.isScreenSharing ? "col-span-full row-span-2" : ""} ${layout === "grid" ? "aspect-video" : "h-full"}`}
              >
                {participant.isVideoOn || participant.isScreenSharing ? (
                  <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                    {participant.isScreenSharing ? (
                      <div className="text-white flex flex-col items-center">
                        <MonitorSmartphone className="h-10 w-10 mb-2" />
                        <span>{participant.name}님의 화면</span>
                      </div>
                    ) : (
                      <img 
                        src={participant.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=anonymous"}
                        alt={participant.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback className="text-xl">{participant.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                )}
                
                {/* Participant info overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/60 text-white px-2 py-1 rounded">
                    <span className="text-sm">{participant.name}</span>
                    {participant.isSpeaking && <Badge variant="default" className="bg-green-500">Speaking</Badge>}
                    {participant.isMuted && <MicOff className="h-4 w-4" />}
                    {participant.isHandRaised && <Hand className="h-4 w-4 text-yellow-400" />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Speaker view layout
            <>
              {/* Main speaker (first screen sharing participant or first participant) */}
              <div className="h-3/4 w-full relative">
                {sortedParticipants.length > 0 && (
                  <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                    {sortedParticipants[0].isScreenSharing ? (
                      <div className="text-white flex flex-col items-center">
                        <MonitorSmartphone className="h-10 w-10 mb-2" />
                        <span>{sortedParticipants[0].name}님의 화면</span>
                      </div>
                    ) : sortedParticipants[0].isVideoOn ? (
                      <img 
                        src={sortedParticipants[0].avatar || "https://api.dicebear.com/7.x/personas/svg?seed=anonymous"}
                        alt={sortedParticipants[0].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={sortedParticipants[0].avatar} alt={sortedParticipants[0].name} />
                        <AvatarFallback className="text-4xl">{sortedParticipants[0].name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}
                
                {/* Participant info overlay */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/60 text-white px-2 py-1 rounded">
                    <span className="text-sm">{sortedParticipants[0]?.name}</span>
                    {sortedParticipants[0]?.isSpeaking && <Badge variant="default" className="bg-green-500">Speaking</Badge>}
                    {sortedParticipants[0]?.isMuted && <MicOff className="h-4 w-4" />}
                  </div>
                </div>
              </div>
              
              {/* Filmstrip of other participants */}
              <div className="h-1/4 w-full flex gap-1 p-1 overflow-x-auto">
                {sortedParticipants.slice(1).map((participant) => (
                  <div key={participant.id} className="relative aspect-video h-full">
                    {participant.isVideoOn ? (
                      <img 
                        src={participant.avatar || "https://api.dicebear.com/7.x/personas/svg?seed=anonymous"}
                        alt={participant.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    
                    {/* Mini participant info */}
                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-black/60 text-white px-1 py-0.5 rounded text-xs">
                        {participant.name}
                        {participant.isMuted && <MicOff className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        {/* Chat sidebar */}
        {showChat && (
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-background border-l p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">대화창</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowChat(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-grow mb-4">
              <div className="space-y-4 pr-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{message.sender}</span>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-grow border rounded-md px-3 py-1 text-sm"
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
              <Button size="icon" className="h-8 w-8" onClick={handleSendMessage}>
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Participants sidebar */}
        {showParticipants && (
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-background border-r p-4 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">참여자 ({allParticipants.length}명)</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowParticipants(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-grow mb-4">
              <div className="space-y-2 pr-4">
                {allParticipants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} alt={participant.name} />
                        <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{participant.name}</span>
                    </div>
                    <div className="flex items-center">
                      {participant.isHandRaised && <Hand className="h-4 w-4 text-yellow-400 mr-1" />}
                      {participant.isSpeaking && <Badge variant="outline" className="text-xs">발언 중</Badge>}
                      {participant.isMuted && <MicOff className="h-4 w-4 text-muted-foreground" />}
                      {!participant.isVideoOn && <VideoOff className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <Separator className="my-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm">화상채팅 룸</span>
              <Button size="sm" variant="outline" className="h-7">
                <UserPlus className="h-3 w-3 mr-1" />
                초대
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Video controls */}
      <div className="bg-background p-3 rounded-lg mt-4 flex items-center justify-between">
        {/* Left controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowParticipants(!showParticipants)} className={showParticipants ? "bg-accent" : ""}>
            <Users className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Center controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={isMuted ? "destructive" : "outline"}
            size="icon"
            onClick={handleToggleMute}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isVideoOn ? "outline" : "destructive"}
            size="icon"
            onClick={handleToggleVideo}
          >
            {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "destructive" : "outline"}
            size="icon"
            onClick={handleToggleScreenShare}
          >
            <ScreenShare className="h-5 w-5" />
          </Button>
          
          <Button
            variant={isHandRaised ? "default" : "outline"}
            size="icon"
            onClick={handleToggleHand}
          >
            <Hand className="h-5 w-5" />
          </Button>
          
          <Button variant="destructive">
            통화 종료
          </Button>
        </div>
        
        {/* Right controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setLayout(layout === "grid" ? "speaker" : "grid")}>
            {layout === "grid" ? <Layout className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={() => setShowChat(!showChat)} className={showChat ? "bg-accent" : ""}>
            <MessageSquare className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;
