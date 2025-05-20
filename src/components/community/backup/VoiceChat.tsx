
import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Headphones,
  Volume2,
  VolumeX,
  User,
  UserPlus,
  MoreHorizontal,
  Settings,
  X,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Mock voice channels
const VOICE_CHANNELS = [
  {
    id: 1,
    name: "피어몰 네트워킹 채널",
    description: "피어몰 사업자들 간의 네트워킹과 정보 공유를 위한 보이스 채널입니다.",
    participants: [
      { name: "창업왕", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1", isSpeaking: true, isMuted: false },
      { name: "디자이너K", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2", isSpeaking: false, isMuted: false },
      { name: "마케팅전문가", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3", isSpeaking: false, isMuted: true }
    ]
  },
  {
    id: 2,
    name: "콘텐츠 기획 토론방",
    description: "효과적인 피어몰 콘텐츠 기획에 대해 토론하는 음성 채널입니다.",
    participants: [
      { name: "콘텐츠기획자", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user4", isSpeaking: true, isMuted: false },
      { name: "영상편집자", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user5", isSpeaking: false, isMuted: false }
    ]
  },
  {
    id: 3,
    name: "디자인 멘토링",
    description: "피어몰 디자인 향상을 위한 멘토링과 피드백 세션입니다.",
    participants: []
  },
  {
    id: 4,
    name: "음식 콘텐츠 크리에이터 모임",
    description: "음식 관련 콘텐츠를 제작하는 크리에이터들의 교류 채널입니다.",
    participants: [
      { name: "요리연구가", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user6", isSpeaking: false, isMuted: false }
    ]
  }
];

const VoiceChat = () => {
  const [channels, setChannels] = useState(VOICE_CHANNELS);
  const [activeChannel, setActiveChannel] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  
  const handleJoinChannel = (channel) => {
    // If already in a channel, leave it first
    if (activeChannel) {
      setChannels(channels.map(ch => 
        ch.id === activeChannel.id 
          ? { ...ch, participants: ch.participants.filter(p => p.name !== "익명 사용자") } 
          : ch
      ));
    }
    
    // Join the new channel
    setActiveChannel(channel);
    setChannels(channels.map(ch => 
      ch.id === channel.id 
        ? { 
            ...ch, 
            participants: [
              ...ch.participants, 
              { name: "익명 사용자", avatar: "", isSpeaking: false, isMuted }
            ] 
          } 
        : ch
    ));
    
    toast.success(`'${channel.name}' 채널에 참여했습니다.`);
  };
  
  const handleLeaveChannel = () => {
    if (!activeChannel) return;
    
    setChannels(channels.map(ch => 
      ch.id === activeChannel.id 
        ? { ...ch, participants: ch.participants.filter(p => p.name !== "익명 사용자") } 
        : ch
    ));
    
    setActiveChannel(null);
    toast.info(`'${activeChannel.name}' 채널에서 나왔습니다.`);
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    
    if (activeChannel) {
      setChannels(channels.map(ch => 
        ch.id === activeChannel.id 
          ? { 
              ...ch, 
              participants: ch.participants.map(p => 
                p.name === "익명 사용자" ? { ...p, isMuted: !isMuted } : p
              ) 
            } 
          : ch
      ));
    }
    
    toast.info(isMuted ? "마이크가 활성화되었습니다." : "마이크가 비활성화되었습니다.");
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
      id: channels.length + 1,
      name: newChannelName,
      description: newChannelDescription || `${newChannelName} 음성 채널입니다.`,
      participants: []
    };
    
    setChannels([...channels, newChannel]);
    setNewChannelName("");
    setNewChannelDescription("");
    setIsSettingsOpen(false);
    toast.success(`'${newChannelName}' 채널이 생성되었습니다.`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">음성 채널</h2>
          <Button onClick={() => setIsSettingsOpen(true)}>
            <Plus className="h-4 w-4 mr-1" />
            새 채널 생성
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channels.map((channel) => (
            <Card key={channel.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{channel.name}</CardTitle>
                  <Badge variant="outline">
                    {channel.participants.length} 명
                  </Badge>
                </div>
                <CardDescription className="line-clamp-1">{channel.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-0">
                {channel.participants.length > 0 ? (
                  <div className="space-y-2">
                    {channel.participants.map((participant, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          {participant.isSpeaking && (
                            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                          {participant.isMuted && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-white flex items-center justify-center">
                              <MicOff className="h-3 w-3 text-red-500" />
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium">{participant.name}</span>
                        {participant.isSpeaking && <Volume2 className="h-4 w-4 ml-auto text-green-500" />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">아직 참가자가 없습니다.</p>
                )}
              </CardContent>
              
              <CardFooter className="pt-4">
                {activeChannel?.id === channel.id ? (
                  <Button variant="destructive" className="w-full" onClick={handleLeaveChannel}>
                    <X className="h-4 w-4 mr-1" />
                    나가기
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => handleJoinChannel(channel)}>
                    <Headphones className="h-4 w-4 mr-1" />
                    참여하기
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Voice controls panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">음성 컨트롤</CardTitle>
            <CardDescription>
              {activeChannel 
                ? `'${activeChannel.name}' 채널에 연결됨` 
                : "아직 채널에 참여하지 않았습니다."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            {activeChannel ? (
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarFallback className="text-2xl">익명</AvatarFallback>
                </Avatar>
                <h3 className="font-medium">익명 사용자</h3>
                <p className="text-sm text-muted-foreground mb-6">참여 중</p>
                
                <div className="grid grid-cols-3 gap-3 w-full">
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
                
                <Separator className="my-6" />
                
                <Button variant="destructive" size="lg" className="w-full" onClick={handleLeaveChannel}>
                  채널 나가기
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6">
                <Headphones className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">음성 채널에 참여하세요</h3>
                <p className="text-sm text-muted-foreground text-center mb-6">
                  왼쪽에서 원하는 음성 채널을 선택하고<br/> 참여 버튼을 눌러 대화를 시작하세요.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Current participants if in a channel */}
        {activeChannel && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">채널 참여자</CardTitle>
            </CardHeader>
            <CardContent>
              {activeChannel.participants.length > 0 ? (
                <div className="space-y-3">
                  {activeChannel.participants.map((participant, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        {participant.isSpeaking && (
                          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                        {participant.isMuted && (
                          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-white flex items-center justify-center">
                            <MicOff className="h-3 w-3 text-red-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">{participant.name}</span>
                      {participant.isSpeaking && <Volume2 className="h-4 w-4 ml-auto text-green-500" />}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm py-2">아직 참가자가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Create channel dialog */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">새 음성 채널 만들기</h3>
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

export default VoiceChat;
