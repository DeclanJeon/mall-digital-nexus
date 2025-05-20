import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, Smile, Mic, Image, Users, Settings, Search, MoreHorizontal, Video, Phone, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ChatRoom, ChatMessage } from '../types';

interface Message extends ChatMessage {
  isMe: boolean;
}

const CHAT_ROOMS_STORAGE_KEY = 'chatRooms'; // OpenChatRooms.tsx와 동일한 키

const ChatRoomView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { planetId, roomId } = useParams<{ planetId: string; roomId: string }>();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editableRoomData, setEditableRoomData] = useState<Partial<ChatRoom>>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const mockParticipants = Array.from({ length: 8 }, (_, i) => ({
    id: `user_${i + 1}`,
    name: `참여자 ${i + 1}`,
    avatar: `https://i.pravatar.cc/40?img=${i + 5}`,
    status: i % 3 === 0 ? 'online' : 'offline',
  }));

  const mockMessages: Message[] = [
    { id: 'm1', author: '참여자 1', authorAvatar: 'https://i.pravatar.cc/40?img=5', content: '안녕하세요! 이 채팅방은 처음이네요.', timestamp: new Date(Date.now() - 5 * 60000).toISOString(), isMe: false, planetId: roomId },
    { id: 'm2', author: '참여자 3', authorAvatar: 'https://i.pravatar.cc/40?img=7', content: '반갑습니다! 저도 방금 들어왔어요.', timestamp: new Date(Date.now() - 4 * 60000).toISOString(), isMe: false, planetId: roomId },
    { id: 'm3', author: 'Me', authorAvatar: '', content: '안녕하세요 여러분!', timestamp: new Date(Date.now() - 3 * 60000).toISOString(), isMe: true, planetId: roomId },
    { id: 'm4', author: '참여자 2', authorAvatar: 'https://i.pravatar.cc/40?img=6', content: '여기서 어떤 이야기를 주로 나누나요?', timestamp: new Date(Date.now() - 2 * 60000).toISOString(), isMe: false, planetId: roomId },
  ];

  useEffect(() => {
    setIsLoading(true);
    let foundRoom: ChatRoom | null = null;
    const timer = setTimeout(() => { // Simulate async data fetching
      if (location.state?.room) {
        const roomFromState = location.state.room as ChatRoom;
        if (roomFromState.id === roomId && roomFromState.planetId === planetId) {
          foundRoom = roomFromState;
        } else {
          console.warn("Room data in state does not match URL params. Fetching from storage.");
        }
      }
      
      if (!foundRoom && roomId && planetId) {
        try {
          const storedRooms = localStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
          if (storedRooms) {
            const allRooms: ChatRoom[] = JSON.parse(storedRooms);
            foundRoom = allRooms.find(r => r.id === roomId && r.planetId === planetId) || null;
          }
        } catch (error) {
          console.error("Error loading chat room from localStorage:", error);
        }
      }

      if (foundRoom) {
        setRoom(foundRoom);
        const initialMessages = mockMessages.map(m => ({...m, planetId: foundRoom!.id }));
        setMessages(initialMessages);
      } else {
        console.warn(`Room data not found for planetId: ${planetId}, roomId: ${roomId}.`);
        setRoom(null); 
      }
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, [planetId, roomId, location.state, navigate]); // 의존성 배열에 planetId 추가

  useEffect(() => {
    if (room) {
      setEditableRoomData({ name: room.name, description: room.description });
    }
  }, [room]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  useEffect(() => {
    if (isLoading || !room) return; 

    const intervalId = setInterval(() => {
      const randomParticipant = mockParticipants[Math.floor(Math.random() * mockParticipants.length)];
      const newMessageContent = `새로운 메시지입니다! (${new Date().toLocaleTimeString()})`;

      const incomingMsg: Message = {
        id: `m${Date.now()}`, 
        author: randomParticipant.name,
        authorAvatar: randomParticipant.avatar,
        content: newMessageContent,
        timestamp: new Date().toISOString(),
        isMe: false,
        planetId: roomId,
      };
      setMessages(prev => [...prev, incomingMsg]);
    }, 5000); 

    return () => clearInterval(intervalId);
  }, [isLoading, room, roomId]); 

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newMessage]);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim()) {
      const msg: Message = {
        id: `m${messages.length + 1}`,
        author: 'Me',
        authorAvatar: '', 
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        isMe: true,
        planetId: roomId,
      };
      setMessages(prev => [...prev, msg]);
      setNewMessage('');

      const textarea = textareaRef.current;
      if (textarea) {
        setTimeout(() => { textarea.style.height = 'auto'; }, 0);
      }
    }
  }, [newMessage, messages, roomId]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGoBack = () => {
    // 이전 페이지가 행성 상세 페이지일 경우 해당 URL로, 아니면 커뮤니티 메인으로
    if (planetId) {
      navigate(`/community/planet/${planetId}`);
    } else {
      navigate('/community');
    }
  };

  const handleJoinCall = (callType: 'voice' | 'video') => {
    if (room?.channelAddress) {
      const callUrl = `https://peerterra.com/many/channel/${room.channelAddress}`;
      window.open(callUrl, '_blank', 'noopener,noreferrer');
      const announceMsg: Message = {
        id: `sys-${Date.now()}`,
        author: 'System', 
        authorAvatar: '', 
        content: `Me님이 ${callType === 'voice' ? '음성' : '화상'} 통화 참여를 시도했습니다.`,
        timestamp: new Date().toISOString(),
        isMe: false, 
        planetId: roomId,
      };
      setMessages(prev => [...prev, announceMsg]);
      console.log(`${callType} call attempt for room: ${room.channelAddress}`);
    } else {
      console.error("Channel address is missing for this room.");
    }
  };

  const handleMoreOptions = () => {
    alert("더보기 옵션:\n- 채팅방 나가기\n- 사용자 신고하기\n- 알림 설정");
  };

  const handleOpenSettings = () => {
    if (room) {
      setEditableRoomData({ name: room.name, description: room.description }); 
      setIsSettingsOpen(true);
    }
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableRoomData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    if (room) {
      setRoom(prevRoom => ({
        ...prevRoom!,
        name: editableRoomData.name || prevRoom!.name,
        description: editableRoomData.description || prevRoom!.description,
      }));
      // TODO: 로컬 스토리지에도 변경 사항 저장
      try {
        const storedRooms = localStorage.getItem(CHAT_ROOMS_STORAGE_KEY);
        if (storedRooms) {
          let allRooms: ChatRoom[] = JSON.parse(storedRooms);
          allRooms = allRooms.map(r => 
            r.id === room.id ? { ...r, name: editableRoomData.name || r.name, description: editableRoomData.description || r.description } : r
          );
          localStorage.setItem(CHAT_ROOMS_STORAGE_KEY, JSON.stringify(allRooms));
        }
      } catch (error) {
        console.error("Error saving updated room to localStorage:", error);
      }
    }
    setIsSettingsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="flex flex-col items-center">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="mt-2 text-lg font-medium">채팅방 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
       <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8 text-center">
         <X className="h-12 w-12 text-red-500 mb-4" />
         <h2 className="text-xl font-semibold mb-2">채팅방 정보를 불러올 수 없습니다.</h2>
         <p className="text-gray-400 mb-6">URL을 확인하거나, 채팅방이 존재하는지 확인해주세요.</p>
         <Button variant="outline" onClick={handleGoBack} className="border-gray-600 text-gray-300 hover:bg-gray-700">
           뒤로가기
         </Button>
       </div>
     );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/20 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" onClick={handleGoBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className={`p-2 rounded-full
              ${room.type === 'text' ? 'bg-blue-900/50 text-blue-300' :
                room.type === 'voice' ? 'bg-green-900/50 text-green-300' :
                'bg-purple-900/50 text-purple-300'}`}>
              {room.type === 'voice' ? <Mic className="h-5 w-5" /> : room.type === 'video' ? <Video className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="font-semibold text-lg text-gray-100">{room.name}</h2>
              <p className="text-xs text-gray-400">{room.participants}명 참여 중</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {room.type === 'voice' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-green-400 hover:text-green-300 hover:bg-white/10" onClick={() => handleJoinCall('voice')}>
                      <Phone className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>음성 통화 참여</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {room.type === 'video' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-purple-400 hover:text-purple-300 hover:bg-white/10" onClick={() => handleJoinCall('video')}>
                      <Video className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>화상 통화 참여</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10" onClick={handleOpenSettings}>
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>채팅방 설정</p></TooltipContent>
               </Tooltip>
             </TooltipProvider>
             <TooltipProvider>
               <Tooltip>
                 <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-white hover:bg-white/10" onClick={handleMoreOptions}>
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>더보기</p></TooltipContent>
               </Tooltip>
             </TooltipProvider>
          </div>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="space-y-5 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                {!msg.isMe && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={msg.authorAvatar} alt={msg.author} />
                    <AvatarFallback>{msg.author.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                  {!msg.isMe && (
                    <span className="text-xs font-medium text-gray-400 mb-0.5 px-1">{msg.author}</span>
                  )}
                  <div className={`px-3.5 py-2 rounded-2xl ${
                    msg.isMe
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-br-lg shadow-md'
                      : 'bg-gray-700/60 text-gray-100 rounded-bl-lg shadow-md'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 ${msg.isMe ? 'mr-1' : 'ml-1'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <footer className="p-4 border-t border-white/10 bg-black/10 flex-shrink-0">
          <div className="flex items-end gap-2 bg-gray-800/50 rounded-xl p-2 border border-gray-700/50 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/30">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="flex-shrink-0 rounded-full h-9 w-9 p-0 text-gray-400 hover:text-sky-300">
                    <Smile className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>이모지</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="메시지 입력..."
              className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-1.5 px-2 text-sm text-gray-100 placeholder-gray-500 outline-none max-h-28 overflow-y-auto"
              rows={1}
            />
            <div className="flex items-center flex-shrink-0">
              <TooltipProvider>
                {[
                  { icon: Paperclip, label: '파일 첨부' },
                  { icon: Image, label: '이미지 첨부' },
                  { icon: Mic, label: '음성 메시지' }
                ].map(({ icon: Icon, label }, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 p-0 text-gray-400 hover:text-sky-300">
                        <Icon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{label}</p></TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <Button
              onClick={handleSendMessage}
              className="flex-shrink-0 rounded-lg h-9 w-9 p-0 bg-sky-600 hover:bg-sky-700 transition-all duration-200 disabled:opacity-50 disabled:bg-gray-600"
              disabled={!newMessage.trim()}
              aria-label="메시지 보내기"
              size="icon"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
        </footer>
      </div>

      {/* Participants Sidebar (Right) */}
      <aside className="w-64 border-l border-white/10 bg-black/10 flex-col hidden lg:flex">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <h3 className="font-semibold text-base text-gray-100 mb-2">참여자 ({mockParticipants.length})</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            <Input
              placeholder="참여자 검색"
              className="pl-9 bg-gray-800/50 border-gray-700/50 rounded-lg text-sm text-gray-200 placeholder:text-gray-500 focus:border-sky-500/50 focus:ring-sky-500/30"
            />
          </div>
        </div>

        {/* Participant List */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1 pb-2">
            {mockParticipants.map(participant => (
              <div key={participant.id} className="p-2 rounded-lg hover:bg-white/5 cursor-pointer flex items-center group">
                <div className="relative flex-shrink-0 mr-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback>{participant.name.substring(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-800 ${participant.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{participant.name}</p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-7 w-7 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>옵션</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800 text-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-100">채팅방 설정</DialogTitle>
            <DialogDescription className="text-gray-400">
              채팅방 이름과 설명을 수정할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="settings-name" className="text-right text-gray-300">
                이름
              </Label>
              <Input
                id="settings-name"
                name="name" 
                value={editableRoomData.name || ''}
                onChange={handleSettingsChange}
                className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="settings-description" className="text-right text-gray-300">
                설명
              </Label>
              <Input
                id="settings-description"
                name="description" 
                value={editableRoomData.description || ''}
                onChange={handleSettingsChange}
                className="col-span-3 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="border-gray-700 text-gray-300 hover:bg-gray-700">취소</Button>
            <Button onClick={handleSaveSettings} className="bg-sky-600 hover:bg-sky-700 text-white">변경사항 저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatRoomView;