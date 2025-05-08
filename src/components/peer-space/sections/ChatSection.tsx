
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Send, Users, Plus, Lock, Globe, Circle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type ChatMessage = {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
};

type ChatRoom = {
  id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  participants: number;
  messages: ChatMessage[];
};

const initialChatRooms: ChatRoom[] = [
  {
    id: 'room-1',
    name: '공개 채팅방',
    description: '모든 사용자가 참여할 수 있는 공개 채팅방입니다.',
    isPrivate: false,
    participants: 15,
    messages: [
      {
        id: 'msg-1',
        author: '시스템',
        authorAvatar: '',
        content: '채팅방에 오신 것을 환영합니다!',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'msg-2',
        author: '참여자1',
        authorAvatar: '',
        content: '안녕하세요! 반갑습니다.',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ]
  },
  {
    id: 'room-2',
    name: '개발자 채팅',
    description: '개발 관련 주제를 나누는 채팅방입니다.',
    isPrivate: false,
    participants: 8,
    messages: [
      {
        id: 'msg-1',
        author: '시스템',
        authorAvatar: '',
        content: '개발자 채팅방에 오신 것을 환영합니다!',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ]
  }
];

const ChatSection = () => {
  const [chatRooms, setChatRooms] = useLocalStorage<ChatRoom[]>('chat_rooms', initialChatRooms);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useLocalStorage<string>('chat_username', `게스트_${Math.floor(Math.random() * 1000)}`);
  const [showCreateRoomDialog, setShowCreateRoomDialog] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: '',
    description: '',
    isPrivate: false
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const selectedRoom = chatRooms.find(room => room.id === selectedRoomId);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedRoom?.messages]);
  
  const handleSelectRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoomId) return;
    
    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      author: username,
      authorAvatar: '',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setChatRooms(chatRooms.map(room => {
      if (room.id === selectedRoomId) {
        return {
          ...room,
          messages: [...room.messages, message]
        };
      }
      return room;
    }));
    
    setNewMessage('');
  };
  
  const handleCreateRoom = () => {
    if (!newRoomData.name.trim()) return;
    
    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      name: newRoomData.name,
      description: newRoomData.description,
      isPrivate: newRoomData.isPrivate,
      participants: 1,
      messages: [{
        id: `msg-${Date.now()}`,
        author: '시스템',
        authorAvatar: '',
        content: `${newRoomData.name} 채팅방이 생성되었습니다.`,
        timestamp: new Date().toISOString()
      }]
    };
    
    setChatRooms([...chatRooms, newRoom]);
    setNewRoomData({ name: '', description: '', isPrivate: false });
    setShowCreateRoomDialog(false);
    setSelectedRoomId(newRoom.id);
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-primary-300 mb-6">채팅</h2>
      
      <div className="flex space-x-4 h-[600px]">
        {/* Chat Room List */}
        <div className="w-1/3 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">채팅방</h3>
            <Button size="sm" onClick={() => setShowCreateRoomDialog(true)}>
              <Plus className="h-4 w-4 mr-1" /> 생성
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chatRooms.map(room => (
              <div 
                key={room.id} 
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${room.id === selectedRoomId ? 'bg-blue-50' : ''}`}
                onClick={() => handleSelectRoom(room.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{room.name}</h4>
                  {room.isPrivate ? (
                    <Badge variant="outline" className="text-xs">
                      <Lock className="h-3 w-3 mr-1" /> 비공개
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-gray-500 mt-1">{room.description}</p>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <Users className="h-3 w-3 mr-1" />
                  <span>{room.participants} 명 참여 중</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Room Content */}
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          {selectedRoom ? (
            <>
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{selectedRoom.name}</h3>
                    <p className="text-sm text-gray-500">{selectedRoom.description}</p>
                  </div>
                  <Badge className="flex items-center">
                    <Circle className="h-2 w-2 mr-1 fill-green-500 text-green-500" />
                    {selectedRoom.participants} 명 접속 중
                  </Badge>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedRoom.messages.map(message => (
                  <div key={message.id} className={`flex ${message.author === username ? 'justify-end' : 'justify-start'}`}>
                    {message.author !== username && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.authorAvatar} alt={message.author} />
                        <AvatarFallback>{message.author[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[70%] mx-2 ${message.author === username ? 'bg-blue-500 text-white' : 'bg-gray-100'} rounded-lg p-3`}>
                      {message.author !== username && (
                        <div className="text-xs font-medium mb-1">{message.author}</div>
                      )}
                      <div className="break-words">{message.content}</div>
                      <div className="text-xs mt-1 text-right">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    
                    {message.author === username && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.authorAvatar} alt={message.author} />
                        <AvatarFallback>{message.author[0]}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-3 border-t">
                <div className="flex space-x-2">
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
                  <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">채팅방을 선택하세요</h3>
              <p className="text-gray-500 mb-4">왼쪽의 채팅방 목록에서 참여할 채팅방을 선택하거나 새로운 채팅방을 만드세요.</p>
              <Button onClick={() => setShowCreateRoomDialog(true)}>
                <Plus className="h-4 w-4 mr-1" /> 새 채팅방 만들기
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Create Chat Room Dialog */}
      <Dialog open={showCreateRoomDialog} onOpenChange={setShowCreateRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 채팅방 만들기</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">채팅방 이름</Label>
              <Input
                id="roomName"
                value={newRoomData.name}
                onChange={(e) => setNewRoomData({ ...newRoomData, name: e.target.value })}
                placeholder="채팅방 이름을 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomDescription">설명 (선택사항)</Label>
              <Input
                id="roomDescription"
                value={newRoomData.description}
                onChange={(e) => setNewRoomData({ ...newRoomData, description: e.target.value })}
                placeholder="채팅방에 대한 설명을 입력하세요"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isPrivate"
                checked={newRoomData.isPrivate}
                onCheckedChange={(checked) => setNewRoomData({ ...newRoomData, isPrivate: checked })}
              />
              <Label htmlFor="isPrivate" className="flex items-center">
                {newRoomData.isPrivate ? (
                  <><Lock className="h-4 w-4 mr-1" /> 비공개 채팅방</>
                ) : (
                  <><Globe className="h-4 w-4 mr-1" /> 공개 채팅방</>
                )}
              </Label>
            </div>
            
            <div className="text-sm text-gray-500">
              {newRoomData.isPrivate 
                ? '비공개 채팅방은 초대를 통해서만 참여할 수 있습니다.'
                : '공개 채팅방은 모든 사용자가 검색하고 참여할 수 있습니다.'}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateRoomDialog(false)}>
              취소
            </Button>
            <Button onClick={handleCreateRoom} disabled={!newRoomData.name.trim()}>
              채팅방 만들기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ChatSection;
