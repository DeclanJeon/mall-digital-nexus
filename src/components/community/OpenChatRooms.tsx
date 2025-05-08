import React, { useState } from 'react';
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
import { toast } from 'sonner';
import { MessageSquare, Mic, Video, FileText, ScreenShare, Globe, Lock, LockOpen, User, Users, Share2 } from 'lucide-react';
import { ChatRoom } from './types';



const OpenChatRooms = () => {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      name: '취미 공유방',
      type: 'text',
      description: '다양한 취미에 대해 이야기해요',
      creator: '사용자123',
      participantsCount: 15,
      isPrivate: false,
      features: ['파일전송', '화면공유'],
      timestamp: new Date('2025-04-16T14:30:00')
    },
    {
      id: '2',
      name: '음악 감상회',
      type: 'voice',
      description: '좋아하는 음악을 들으며 대화해요',
      creator: '음악매니아',
      participantsCount: 8,
      isPrivate: false,
      features: ['텍스트채팅', '파일전송'],
      timestamp: new Date('2025-04-16T18:45:00')
    },
    {
      id: '3',
      name: '온라인 스터디 그룹',
      type: 'video',
      description: '함께 공부하고 질문해요',
      creator: '스터디장',
      participantsCount: 5,
      isPrivate: true,
      features: ['텍스트채팅', '화면공유', '웹공유'],
      timestamp: new Date('2025-04-17T09:00:00')
    },
  ]);
  
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  
  const [newRoom, setNewRoom] = useState<Omit<ChatRoom, 'id' | 'participantsCount' | 'timestamp'>>({
    name: '',
    type: 'text',
    description: '',
    creator: '익명 사용자',
    isPrivate: false,
    features: []
  });

  const filteredRooms = chatRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateRoom = () => {
    if (!newRoom.name.trim()) {
      toast.error("채팅방 이름을 입력해주세요.");
      return;
    }

    const createdRoom: ChatRoom = {
      ...newRoom,
      id: Math.random().toString(36).substring(2, 9),
      participantsCount: 1,
      timestamp: new Date(),
    };

    setChatRooms([createdRoom, ...chatRooms]);
    setCreateDialogOpen(false);
    toast.success(`'${createdRoom.name}' 채팅방이 생성되었습니다.`);
    
    setNewRoom({
      name: '',
      type: 'text',
      description: '',
      creator: '익명 사용자',
      isPrivate: false,
      features: []
    });
  };

  const handleJoinRoom = (room: ChatRoom) => {
    navigate(`/community/chat/${room.id}`, { 
      state: { 
        room: {
          ...room,
          creator: room.creator || '시스템',
          participantsCount: room.participantsCount || 1,
          members: room.members || ['기본참여자'],
          features: room.features || []
        }
      }
    });
    toast.success(`'${room.name}' 채팅방에 입장합니다.`);
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return '방금 전';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="채팅방 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="모든 채팅방" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">모든 채팅방</SelectItem>
              <SelectItem value="text">텍스트 채팅방</SelectItem>
              <SelectItem value="voice">음성 채팅방</SelectItem>
              <SelectItem value="video">화상 채팅방</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setCreateDialogOpen(true)}>
            채팅방 만들기
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-300px)] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div 
              key={room.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full 
                      ${room.type === 'text' ? 'bg-blue-100 text-blue-600' : 
                        room.type === 'voice' ? 'bg-green-100 text-green-600' : 
                        'bg-purple-100 text-purple-600'}`}>
                      {getRoomTypeIcon(room.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <p className="text-sm text-gray-500">
                        {room.creator} • {formatTimeAgo(room.timestamp)}
                      </p>
                    </div>
                  </div>
                  {room.isPrivate && (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3" /> 비공개
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-gray-600">{room.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    {room.participantsCount}명 참여 중
                  </div>
                  <Button size="sm" onClick={() => handleJoinRoom(room)}>
                    입장하기
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredRooms.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-gray-500">
              <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
              <p className="text-lg">검색 결과가 없습니다</p>
              <p className="text-sm">새로운 채팅방을 만들어보세요!</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setCreateDialogOpen(true)}
              >
                채팅방 만들기
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>새 오픈채팅방 만들기</DialogTitle>
            <DialogDescription>
              원하는 주제의 오픈채팅방을 만들어 다른 사용자들과 소통하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">채팅방 이름</Label>
              <Input
                id="roomName"
                placeholder="채팅방 이름을 입력하세요"
                value={newRoom.name}
                onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomDescription">설명 (선택사항)</Label>
              <Input
                id="roomDescription"
                placeholder="채팅방에 대한 간단한 설명을 입력하세요"
                value={newRoom.description}
                onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>채팅방 유형</Label>
              <Tabs 
                defaultValue={newRoom.type} 
                onValueChange={(value) => setNewRoom({...newRoom, type: value as 'text' | 'voice' | 'video'})}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> 텍스트
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="flex items-center gap-2">
                    <Mic className="h-4 w-4" /> 음성
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="h-4 w-4" /> 화상
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="space-y-2">
              <Label>사용 기능</Label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {newRoom.type !== 'text' && (
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="textChat" 
                      checked={newRoom.features.includes('텍스트채팅')}
                      onCheckedChange={() => toggleFeature('텍스트채팅')}
                    />
                    <Label htmlFor="textChat" className="flex items-center gap-1">
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
                    />
                    <Label htmlFor="voiceChat" className="flex items-center gap-1">
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
                    />
                    <Label htmlFor="videoChat" className="flex items-center gap-1">
                      <Video className="h-4 w-4" /> 화상채팅
                    </Label>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="fileTransfer" 
                    checked={newRoom.features.includes('파일전송')}
                    onCheckedChange={() => toggleFeature('파일전송')}
                  />
                  <Label htmlFor="fileTransfer" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" /> 파일전송
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="screenShare" 
                    checked={newRoom.features.includes('화면공유')}
                    onCheckedChange={() => toggleFeature('화면공유')}
                  />
                  <Label htmlFor="screenShare" className="flex items-center gap-1">
                    <ScreenShare className="h-4 w-4" /> 화면공유
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="webShare" 
                    checked={newRoom.features.includes('웹공유')}
                    onCheckedChange={() => toggleFeature('웹공유')}
                  />
                  <Label htmlFor="webShare" className="flex items-center gap-1">
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
              />
              <Label htmlFor="isPrivate" className="flex items-center gap-1">
                {newRoom.isPrivate ? (
                  <><Lock className="h-4 w-4" /> 비공개 채팅방</>
                ) : (
                  <><LockOpen className="h-4 w-4" /> 공개 채팅방</>
                )}
              </Label>
            </div>
            
            {newRoom.isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="roomPassword">비밀번호</Label>
                <Input
                  id="roomPassword"
                  type="password"
                  placeholder="채팅방 비밀번호를 입력하세요"
                  value={newRoom.password || ''}
                  onChange={(e) => setNewRoom({...newRoom, password: e.target.value})}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateRoom}>
              채팅방 만들기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpenChatRooms;
