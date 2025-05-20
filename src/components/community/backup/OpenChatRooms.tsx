import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Mic, Video, FileText, ScreenShare, Globe, Lock, LockOpen, User, Users, Share2, Link, QrCode } from 'lucide-react';
import { ChatRoom } from './types';
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';

const CHAT_ROOMS_STORAGE_KEY = 'chatRooms';

const OpenChatRooms = ({ planetId }: { planetId?: string }) => {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    try {
      const storedRooms = localStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
      if (storedRooms) {
        return JSON.parse(storedRooms).map((room: ChatRoom) => ({ // 타입 명시
          ...room,
          timestamp: room.timestamp ? new Date(room.timestamp) : undefined,
        }));
      }
    } catch (error) {
      console.error("Error loading chat rooms from localStorage:", error);
    }
    return [
      {
        id: '1',
        name: '취미 공유방',
        type: 'text',
        description: '다양한 취미에 대해 이야기해요',
        creator: '사용자123',
        participants: 15,
        participantsCount: 15,
        isPrivate: false,
        features: ['파일전송', '화면공유'],
        timestamp: new Date('2025-04-16T14:30:00'),
        planetId: planetId,
        channelAddress: 'hobby-chat-1',
      },
      {
        id: '2',
        name: '음악 감상회',
        type: 'voice',
        description: '좋아하는 음악을 들으며 대화해요',
        creator: '음악매니아',
        participants: 8,
        participantsCount: 8,
        isPrivate: false,
        features: ['텍스트채팅', '파일전송'],
        timestamp: new Date('2025-04-16T18:45:00'),
        planetId: planetId,
        channelAddress: 'music-club-2',
      },
      {
        id: '3',
        name: '온라인 스터디 그룹',
        type: 'video',
        description: '함께 공부하고 질문해요',
        creator: '스터디장',
        participants: 5,
        participantsCount: 5,
        isPrivate: true,
        features: ['텍스트채팅', '화면공유', '웹공유'],
        timestamp: new Date('2025-04-17T09:00:00'),
        planetId: planetId,
        channelAddress: 'study-group-3',
      },
    ];
  });
  
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [selectedRoomForQR, setSelectedRoomForQR] = useState<ChatRoom | null>(null);
  
  const [newRoom, setNewRoom] = useState<Omit<ChatRoom, 'id' | 'participantsCount' | 'timestamp'>>({
    name: '',
    type: 'text',
    description: '',
    creator: '익명 사용자',
    isPrivate: false,
    features: [],
    participants: 0,
    planetId: planetId
  });

  const { toast } = useToast();

  const filteredRooms = chatRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || room.type === filterType;
    const matchesPlanet = planetId ? room.planetId === planetId : true;
    return matchesSearch && matchesType && matchesPlanet;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_ROOMS_STORAGE_KEY, JSON.stringify(chatRooms));
    } catch (error) {
      console.error("Error saving chat rooms to localStorage:", error);
    }
  }, [chatRooms]);

  const handleCreateRoom = () => {
    if (!newRoom.name.trim()) {
      toast({
        title: "오류",
        description: "채팅방 이름을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const roomId = Math.random().toString(36).substring(2, 9);
    const currentPlanetId = planetId || 'global'; 

    const createdRoom: ChatRoom = {
      ...newRoom,
      id: roomId,
      participantsCount: 1,
      participants: 1,
      timestamp: new Date(),
      channelAddress: `room-${roomId}`,
      planetId: currentPlanetId, 
      ...(newRoom.isPrivate && { password: newRoom.password || '' }),
    };

    const updatedRooms = [createdRoom, ...chatRooms];
    setChatRooms(updatedRooms);

    setCreateDialogOpen(false);
    toast({
      title: "채팅방 생성 완료",
      description: `'${createdRoom.name}' 채팅방이 생성되었습니다. 바로 입장합니다.`,
    });
    
    navigate(`/community/planet/${createdRoom.planetId}/chat/${createdRoom.id}`, {
      state: {
        room: {
          ...createdRoom,
          creator: createdRoom.creator || '시스템',
          participantsCount: createdRoom.participantsCount || createdRoom.participants || 1,
          participants: createdRoom.participants || createdRoom.participantsCount || 1,
          members: createdRoom.members || ['기본참여자'],
          features: createdRoom.features || [],
        }
      }
    });

    setNewRoom({
      name: '',
      type: 'text',
      description: '',
      creator: '익명 사용자',
      isPrivate: false,
      features: [],
      participants: 0,
      planetId: planetId
    });
  };

  const handleJoinRoom = (room: ChatRoom) => {
    if (room.isPrivate && room.password) {
      const enteredPassword = prompt(`비공개 채팅방입니다. 비밀번호를 입력하세요:`);
      if (enteredPassword !== room.password) {
        toast({
          title: "입장 실패",
          description: "비밀번호가 올바르지 않습니다.",
          variant: "destructive",
        });
        return;
      }
    }
    
    const targetPlanetId = room.planetId || 'global';
    navigate(`/community/planet/${targetPlanetId}/chat/${room.id}`, {
      state: {
        room: {
          ...room,
          creator: room.creator || '시스템',
          participantsCount: room.participantsCount || room.participants || 1,
          participants: room.participants || room.participantsCount || 1,
          members: room.members || ['기본참여자'],
          features: room.features || [],
          channelAddress: room.channelAddress || `room-${room.id}`,
          planetId: targetPlanetId 
        }
      }
    });
    toast({
      title: "채팅방 입장",
      description: `'${room.name}' 채팅방에 입장합니다.`,
    });
  };

  const handleShareRoom = (room: ChatRoom) => {
    setSelectedRoomForQR(room);
    setQrModalOpen(true);
  };

  const toggleFeature = (feature: string) => {
    setNewRoom(prev => {
      if (prev.features.includes(feature)) {
        return {
          ...prev,
          features: prev.features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...prev.features, feature]
        };
      }
    });
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return <Mic className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  const formatTimeAgo = (dateInput?: Date | string) => { 
    if (!dateInput) return '방금 전';
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (!(date instanceof Date) || isNaN(date.getTime())) {
        return '시간 정보 없음'; 
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 0) return '방금 전'; 
    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="채팅방 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-gray-200">
              <SelectValue placeholder="모든 채팅방" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
              <SelectItem value="all" className="hover:bg-gray-700">모든 채팅방</SelectItem>
              <SelectItem value="text" className="hover:bg-gray-700">텍스트 채팅방</SelectItem>
              <SelectItem value="voice" className="hover:bg-gray-700">음성 채팅방</SelectItem>
              <SelectItem value="video" className="hover:bg-gray-700">화상 채팅방</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white">
            채팅방 만들기
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(80vh-200px)] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div 
              key={room.id} 
              className="bg-white/10 border border-white/20 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:bg-white/15"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full
                      ${room.type === 'text' ? 'bg-blue-900/50 text-blue-300' :
                        room.type === 'voice' ? 'bg-green-900/50 text-green-300' :
                        'bg-purple-900/50 text-purple-300'}`}>
                      {getRoomTypeIcon(room.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-100">{room.name}</h3>
                      <p className="text-sm text-gray-300">
                        {room.creator} • {room.timestamp && formatTimeAgo(room.timestamp)}
                      </p>
                    </div>
                  </div>
                  {room.isPrivate && (
                    <Badge variant="outline" className="gap-1 border-red-600/50 text-red-400 bg-red-900/20">
                      <Lock className="h-3 w-3" /> 비공개
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-200">{room.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-white/10 text-gray-300">{feature}</Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center text-sm text-gray-300">
                    <Users className="h-4 w-4 mr-1" />
                    {room.participants || room.participantsCount || 0}명 참여 중
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                      onClick={() => handleShareRoom(room)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={() => handleJoinRoom(room)} className="bg-sky-600 hover:bg-sky-700 text-white">
                      입장하기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredRooms.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-300">
              <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">검색 결과가 없습니다</p>
              <p className="text-sm">새로운 채팅방을 만들어보세요!</p>
              <Button
                variant="outline"
                className="mt-4 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                onClick={() => setCreateDialogOpen(true)}
              >
                채팅방 만들기
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-100">새 오픈채팅방 만들기</DialogTitle>
            <DialogDescription className="text-gray-400">
              원하는 주제의 오픈채팅방을 만들어 다른 사용자들과 소통하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomName" className="text-gray-300">채팅방 이름</Label>
              <Input
                id="roomName"
                placeholder="채팅방 이름을 입력하세요"
                value={newRoom.name}
                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomDescription" className="text-gray-300">설명 (선택사항)</Label>
              <Input
                id="roomDescription"
                placeholder="채팅방에 대한 간단한 설명을 입력하세요"
                value={newRoom.description}
                onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">채팅방 유형</Label>
              <Tabs
                defaultValue={newRoom.type}
                onValueChange={(value) => setNewRoom({...newRoom, type: value as 'text' | 'voice' | 'video'})}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
                  <TabsTrigger value="text" className="flex items-center gap-2 text-gray-400 data-[state=active]:bg-sky-700 data-[state=active]:text-white">
                    <MessageSquare className="h-4 w-4" /> 텍스트
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="flex items-center gap-2 text-gray-400 data-[state=active]:bg-sky-700 data-[state=active]:text-white">
                    <Mic className="h-4 w-4" /> 음성
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2 text-gray-400 data-[state=active]:bg-sky-700 data-[state=active]:text-white">
                    <Video className="h-4 w-4" /> 화상
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">사용 기능</Label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {newRoom.type !== 'text' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="textChat"
                      checked={newRoom.features.includes('텍스트채팅')}
                      onCheckedChange={() => toggleFeature('텍스트채팅')}
                      className="data-[state=unchecked]:bg-gray-700"
                    />
                    <Label htmlFor="textChat" className="flex items-center gap-1 text-gray-300">
                      <MessageSquare className="h-4 w-4" /> 텍스트채팅
                    </Label>
                  </div>
                )}
                
                {newRoom.type !== 'voice' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="voiceChat"
                      checked={newRoom.features.includes('음성채팅')}
                      onCheckedChange={() => toggleFeature('음성채팅')}
                      className="data-[state=unchecked]:bg-gray-700"
                    />
                    <Label htmlFor="voiceChat" className="flex items-center gap-1 text-gray-300">
                      <Mic className="h-4 w-4" /> 음성채팅
                    </Label>
                  </div>
                )}
                
                {newRoom.type !== 'video' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="videoChat"
                      checked={newRoom.features.includes('화상채팅')}
                      onCheckedChange={() => toggleFeature('화상채팅')}
                      className="data-[state=unchecked]:bg-gray-700"
                    />
                    <Label htmlFor="videoChat" className="flex items-center gap-1 text-gray-300">
                      <Video className="h-4 w-4" /> 화상채팅
                    </Label>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fileTransfer"
                    checked={newRoom.features.includes('파일전송')}
                    onCheckedChange={() => toggleFeature('파일전송')}
                    className="data-[state=unchecked]:bg-gray-700"
                  />
                  <Label htmlFor="fileTransfer" className="flex items-center gap-1 text-gray-300">
                    <FileText className="h-4 w-4" /> 파일전송
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="screenShare"
                    checked={newRoom.features.includes('화면공유')}
                    onCheckedChange={() => toggleFeature('화면공유')}
                    className="data-[state=unchecked]:bg-gray-700"
                  />
                  <Label htmlFor="screenShare" className="flex items-center gap-1 text-gray-300">
                    <ScreenShare className="h-4 w-4" /> 화면공유
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="webShare"
                    checked={newRoom.features.includes('웹공유')}
                    onCheckedChange={() => toggleFeature('웹공유')}
                    className="data-[state=unchecked]:bg-gray-700"
                  />
                  <Label htmlFor="webShare" className="flex items-center gap-1 text-gray-300">
                    <Globe className="h-4 w-4" /> 웹공유 (WebSync)
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="isPrivate"
                checked={newRoom.isPrivate}
                onCheckedChange={(checked) => setNewRoom({...newRoom, isPrivate: checked})}
                className="data-[state=unchecked]:bg-gray-700"
              />
              <Label htmlFor="isPrivate" className="flex items-center gap-1 text-gray-300">
                {newRoom.isPrivate ? (
                  <><Lock className="h-4 w-4" /> 비공개 채팅방</>
                ) : (
                  <><LockOpen className="h-4 w-4" /> 공개 채팅방</>
                )}
              </Label>
            </div>
            
            {newRoom.isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="roomPassword" className="text-gray-300">비밀번호</Label>
                <Input
                  id="roomPassword"
                  type="password"
                  placeholder="채팅방 비밀번호를 입력하세요"
                  value={newRoom.password || ''}
                  onChange={(e) => setNewRoom({...newRoom, password: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-700">
              취소
            </Button>
            <Button onClick={handleCreateRoom} className="bg-sky-600 hover:bg-sky-700 text-white">
              채팅방 만들기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedRoomForQR && (
        <QRCodeModal
          open={qrModalOpen}
          onOpenChange={setQrModalOpen}
          url={`${window.location.origin}/community/planet/${selectedRoomForQR.planetId || 'global'}/chat/${selectedRoomForQR.id}`}
          title={selectedRoomForQR.name}
        />
      )}
    </div>
  );
};

export default OpenChatRooms;
