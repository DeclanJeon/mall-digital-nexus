import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useRef, useCallback
import { MessageSquare, Users, Phone, Video, X, ChevronUp, Send, Search, MoreHorizontal, User, Clock, Settings, Menu, Bell, Share2, Star, Paperclip, Smile, Mic, Image } from 'lucide-react';
import {Button} from '@/components/ui/button'; // Assuming these paths are correct
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// Removed unused Avatar import: import { Avatar } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CommunicationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // Default to 'chat'
  const [peerNumber, setPeerNumber] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, user: '사용자1', text: '안녕하세요! 오픈 채팅방에 오신 것을 환영합니다.', time: '09:30', isMe: false },
    { id: 2, user: '사용자2', text: '반갑습니다! 모두들 오늘 하루는 어떠셨나요?', time: '09:32', isMe: false },
    { id: 3, user: '사용자3', text: '저는 오늘 새 프로젝트를 시작했어요. 너무 신나네요!', time: '09:35', isMe: false },
    { id: 4, user: 'Me', text: '안녕하세요! 저도 참여하고 싶어요.', time: '09:36', isMe: true },
    { id: 5, user: '사용자4', text: '환영합니다! 어떤 프로젝트에 관심이 있으신가요?', time: '09:38', isMe: false },
    { id: 6, user: '사용자5', text: '여기 좋은 정보가 많아요. 저도 많이 배우고 있습니다.', time: '09:40', isMe: false }
  ]);

  const [participants, setParticipants] = useState(
    Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      name: `사용자${i + 1}`,
      online: Math.random() > 0.3,
      // avatar: `/api/placeholder/${32}/${32}`, // Kept for reference, but not used in rendering below
      status: i % 5 === 0 ? 'away' : i % 7 === 0 ? 'busy' : 'online'
    }))
  );

  // Track window size for better responsive behavior
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Ref for textarea auto-resizing
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        // Initial set
        handleResize();
    }
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', handleResize);
        }
    };
  }, []);

  // Effect for textarea auto-resizing
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
    }
  }, [message]); // Re-run when message changes

  const isMobile = windowWidth < 768;

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // No need to open dialog here, buttons have their own onClick
  };

  const handleRequestCall = () => {
    // Basic validation
    if (!peerNumber.trim()) {
      alert('피어 넘버를 입력해주세요.');
      return;
    }
    setShowRequestDialog(false);
    alert(`${peerNumber}님에게 ${activeTab === 'voice' ? '음성' : '화상'} 통화 요청을 보냈습니다.`);
    // Reset peer number after request (optional)
    // setPeerNumber('');
  };

   const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: 'Me',
        text: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');

      // Reset textarea height after sending
       const textarea = textareaRef.current;
       if (textarea) {
         setTimeout(() => { // Use timeout to allow state update and re-render
             textarea.style.height = 'auto';
         }, 0);
       }
    }
  }, [message, messages.length]); // Add dependencies

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => { // Type the event target
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Placeholder handlers for chat input buttons
  const handleEmojiClick = () => console.log('Emoji clicked');
  const handleAttachClick = () => console.log('Attach clicked');
  const handleImageClick = () => console.log('Image clicked');
  const handleMicClick = () => console.log('Mic clicked');

  const handleOpenChat = () => {
      // Basic validation (optional, could start chat without peer number if it's a general room)
      // if (!peerNumber.trim()) {
      //   alert('피어 넘버를 입력해주세요.');
      //   return;
      // }
      setShowChatModal(true);
      // You might want to use the peerNumber here to load a specific chat
      // console.log("Opening chat, peer number:", peerNumber);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Main toggle button */}
      <TooltipProvider>
          <Tooltip>
              <TooltipTrigger asChild>
                  <Button
                      onClick={() => setIsOpen(!isOpen)}
                      className="rounded-full w-14 h-14 p-0 shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out flex items-center justify-center"
                      aria-label={isOpen ? "통신 옵션 닫기" : "통신 옵션 열기"}
                  >
                      {isOpen ? <ChevronUp className="h-6 w-6 text-white" /> : <Users className="h-6 w-6 text-white" />}
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                  <p>{isOpen ? "닫기" : "통신 옵션"}</p>
              </TooltipContent>
          </Tooltip>
      </TooltipProvider>


      {/* Expanded widget content */}
      {isOpen && (
        // Ensure tailwindcss-animate plugin is installed and configured for animations
        <div className="bg-white rounded-xl shadow-2xl p-5 mt-3 w-72 border border-gray-100 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">통신 옵션</h3>
            <Button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              variant="ghost"
              size="icon" // Make it icon size for consistency
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Corrected default value */}
          <Tabs value={activeTab} onValueChange={handleTabClick} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4"> {/* Adjusted grid-cols to 3 */}
              <TabsTrigger value="chat"><span>채팅</span></TabsTrigger>
              <TabsTrigger value="voice"><span>음성</span></TabsTrigger>
              <TabsTrigger value="video"><span>화상</span></TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4 outline-none"> {/* Added outline-none */}
              <div className="space-y-2">
                <label htmlFor="peerNumberChat" className="text-sm font-medium text-gray-700">피어 넘버 입력</label>
                <Input
                  id="peerNumberChat"
                  placeholder="피어 넘버 (선택 사항)"
                  value={peerNumber}
                  onChange={(e) => setPeerNumber(e.target.value)}
                  className="border-indigo-200 focus:border-indigo-500 rounded-lg"
                />
                 {/* Added onClick handler */}
                <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg transition-colors"
                    onClick={handleOpenChat}
                >
                  채팅 시작/열기
                </Button>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium mb-2">최근 대화</div>
                <div className="space-y-1"> {/* Reduced spacing */}
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center p-2 hover:bg-indigo-50 rounded-lg cursor-pointer" onClick={handleOpenChat}>
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 text-xs font-semibold">
                        {`U${i}`}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className="text-sm font-medium truncate">사용자 {i}</div>
                        <div className="text-xs text-gray-500">5분 전</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4 outline-none"> {/* Added outline-none */}
              <div className="space-y-2">
                 <label htmlFor="peerNumberVoice" className="text-sm font-medium text-gray-700">피어 넘버 입력</label>
                <Input
                  id="peerNumberVoice"
                  placeholder="피어 넘버 입력"
                  value={peerNumber}
                  onChange={(e) => setPeerNumber(e.target.value)}
                  className="border-indigo-200 focus:border-indigo-500 rounded-lg"
                />
                <Button
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg transition-colors"
                  onClick={() => setShowRequestDialog(true)} // Open dialog on click
                  disabled={!peerNumber.trim()} // Disable if no peer number
                >
                  음성 통화 요청
                </Button>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium mb-2">음성 통화 기록</div>
                <div className="space-y-1"> {/* Reduced spacing */}
                  {[1, 2].map(i => (
                    <div key={i} className="flex items-center p-2 hover:bg-green-50 rounded-lg cursor-pointer group">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className="text-sm font-medium truncate">사용자 {i}</div>
                        <div className="text-xs text-gray-500">어제 {i === 1 ? '오후 3:14' : '오전 11:32'}</div>
                      </div>
                      <Button size="icon" variant="ghost" className="ml-auto h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Phone className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4 outline-none"> {/* Added outline-none */}
              <div className="space-y-2">
                <label htmlFor="peerNumberVideo" className="text-sm font-medium text-gray-700">피어 넘버 입력</label>
                <Input
                  id="peerNumberVideo"
                  placeholder="피어 넘버 입력"
                  value={peerNumber}
                  onChange={(e) => setPeerNumber(e.target.value)}
                  className="border-indigo-200 focus:border-indigo-500 rounded-lg"
                />
                <Button
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg transition-colors"
                  onClick={() => setShowRequestDialog(true)} // Open dialog on click
                  disabled={!peerNumber.trim()} // Disable if no peer number
                >
                  화상 통화 요청
                </Button>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm text-center text-gray-500 py-2">
                  화상 통화를 통해 실시간으로 소통하세요
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex items-center justify-center gap-1 text-gray-600">
                    <Video className="h-4 w-4" />
                    <span>설정</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center justify-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>그룹</span>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Call Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="bg-white rounded-xl border-0 shadow-2xl sm:max-w-md p-0 overflow-hidden"> {/* Adjusted max-width */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
            <DialogHeader> {/* Use DialogHeader for structure */}
                <DialogTitle className="text-xl font-semibold">
                {activeTab === 'voice' ? '음성' : '화상'} 통화 요청
                </DialogTitle>
                <p className="text-indigo-100 mt-1 text-sm"> {/* Use DialogDescription if needed */}
                상대방에게 연결 요청을 보냅니다
                </p>
            </DialogHeader>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label htmlFor="peerNumberDialog" className="text-sm font-medium text-gray-700">상대방 피어 넘버</label>
              <Input
                id="peerNumberDialog"
                placeholder="피어 넘버 입력"
                value={peerNumber}
                onChange={(e) => setPeerNumber(e.target.value)}
                className="rounded-lg border-gray-300 focus:border-indigo-500"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowRequestDialog(false)}
                className="flex-1 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                취소
              </Button>
              <Button
                onClick={handleRequestCall}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg transition-colors"
                disabled={!peerNumber.trim()} // Disable if no peer number
              >
                요청 보내기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Open Chat Room Modal */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        {/* Removed DialogHeader, DialogTitle from here as they are inside the custom layout */}
        <DialogContent className={`max-w-5xl w-full ${isMobile ? 'h-screen max-h-screen' : 'h-[85vh]'} p-0 rounded-none sm:rounded-xl border-0 shadow-2xl bg-white overflow-hidden flex`}> {/* Added flex */}
          {/* Left sidebar - Chat room list */}
            {!isMobile && (
              <div className="w-72 border-r border-gray-200 bg-gray-50 flex flex-col flex-shrink-0"> {/* Increased width slightly */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      피어 채팅
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 p-0">
                            <Settings className="h-4 w-4 text-gray-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>설정</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" /> {/* Centered icon */}
                    <Input
                      placeholder="검색"
                      className="pl-9 bg-white rounded-lg text-sm border-gray-200"
                    />
                  </div>
                </div>

                <Tabs defaultValue="all" className="flex-1 flex flex-col min-h-0"> {/* Added min-h-0 for flex child scroll */}
                  <TabsList className="flex-shrink-0 grid grid-cols-3 px-2 pt-2 bg-transparent"> {/* Adjusted grid-cols */}
                    {['all', 'unread', 'groups'].map((value) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 rounded-none text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        {value === 'all' ? '전체' : value === 'unread' ? '안 읽음' : '그룹'}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="all" className="flex-1 pt-2 m-0 overflow-hidden"> {/* Added overflow-hidden */}
                    <ScrollArea className="h-full px-2">
                      <div className="space-y-1 pb-2">
                        {Array.from({length: 5}).map((_, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg cursor-pointer flex items-center group ${i === 0 ? 'bg-indigo-50 hover:bg-indigo-100' : 'hover:bg-gray-100'}`} // Added group for hover effects
                          >
                            <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm"> {/* Adjusted gradient */}
                                {i === 0 ? "OP" : `U${i+1}`}
                              </div>
                              {/* Online/Offline Indicator */}
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${i % 3 === 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-sm text-gray-900 truncate">
                                  {i === 0 ? "오픈 채팅방" : `사용자${i + 1}`}
                                </h4>
                                <span className="text-xs text-gray-500 flex-shrink-0 ml-1">{`09:4${i}`}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                  <p className="text-xs text-gray-500 truncate pr-1">
                                  {i === 0 ? "현재 24명 참여 중" : "안녕하세요! 반갑습니다."}
                                  </p>
                                  {i % 2 === 0 && (
                                  <div className="flex-shrink-0 ml-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-semibold">
                                      {i + 1}
                                  </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="unread" className="flex-1 m-0">
                    <div className="h-full flex items-center justify-center text-gray-500 text-sm p-4 text-center">
                      <p>안 읽은 메시지가 없습니다</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="groups" className="flex-1 pt-2 m-0 overflow-hidden">
                    <ScrollArea className="h-full px-2">
                      <div className="space-y-1 pb-2">
                        {/* Example Group Chat */}
                        <div className="p-3 rounded-lg cursor-pointer flex items-center bg-indigo-50 hover:bg-indigo-100 group">
                           <div className="relative flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                                OP
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
                           </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-sm text-gray-900 truncate">오픈 채팅방</h4>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-1">지금</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500 truncate pr-1">현재 24명 참여 중</p>
                                <div className="flex-shrink-0 ml-1 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[10px] font-semibold">
                                    3
                                </div>
                              </div>
                          </div>
                        </div>
                        {/* Add more group items here */}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-200 mt-auto flex-shrink-0">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                      ME
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 truncate">내 계정</h4>
                      <p className="text-xs text-gray-500 truncate">피어몰 이용자</p>
                    </div>
                    <Button size="icon" variant="ghost" className="ml-auto rounded-full h-8 w-8 p-0 flex-shrink-0">
                      <Menu className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Main chat area */}
            <div className="flex-1 flex flex-col h-full min-w-0"> {/* Added min-w-0 */}
              {/* Chat room header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 flex-shrink-0"> {/* Adjusted padding */}
                <div className="flex items-center min-w-0"> {/* Added min-w-0 */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                    OP
                  </div>
                  <div className="ml-3 min-w-0"> {/* Added min-w-0 */}
                    <h3 className="font-semibold text-base text-gray-900 truncate">오픈 채팅방</h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" /> {participants.length}명 참여 중
                      </span>
                      {/* <span className="hidden sm:inline">•</span> */}
                      <span className="hidden sm:flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 실시간 채팅
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  {isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      onClick={() => setShowChatModal(false)}
                      aria-label="채팅 닫기"
                    >
                      <X className="h-5 w-5 text-gray-600" />
                    </Button>
                  )}
                  {!isMobile && (
                    <>
                      <TooltipProvider>
                         {[
                            { icon: Search, label: '검색' },
                            { icon: Bell, label: '알림 설정' },
                            { icon: Star, label: '즐겨찾기' },
                            { icon: Share2, label: '공유' },
                            { icon: MoreHorizontal, label: '더보기' }
                          ].map(({ icon: Icon, label }, index) => (
                           <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                  <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 p-0">
                                      <Icon className="h-4 w-4 text-gray-500" />
                                  </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>{label}</p></TooltipContent>
                           </Tooltip>
                         ))}
                      </TooltipProvider>
                    </>
                  )}
                </div>
              </div>

              {/* Chat messages area */}
              <ScrollArea className="flex-1 p-4 sm:p-6 bg-gray-50"> {/* Added background */}
                <div className="space-y-4 pb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                       {!msg.isMe && (
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm font-medium">
                             {/* Use first letter or a generic icon */}
                             {msg.user.substring(0, 1).toUpperCase()}
                          </div>
                       )}
                       <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[75%] sm:max-w-[65%]`}>
                         {!msg.isMe && (
                           <span className="text-xs font-medium text-gray-700 mb-0.5 px-1">{msg.user}</span>
                         )}
                         <div className={`px-3 py-2 rounded-2xl ${
                            msg.isMe
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-lg' // Adjusted rounding
                              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-lg' // Adjusted rounding and style
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p> {/* Allow line breaks */}
                          </div>
                          <span className={`text-xs text-gray-400 mt-1 ${msg.isMe ? 'mr-1' : 'ml-1'}`}>{msg.time}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message input area */}
              <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-end gap-2">
                   <div className="flex-1 bg-gray-100 rounded-2xl flex items-end p-1">
                      <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <Button onClick={handleEmojiClick} size="icon" variant="ghost" className="flex-shrink-0 rounded-full h-8 w-8 p-0 text-gray-500 hover:text-indigo-600">
                                      <Smile className="h-5 w-5" />
                                  </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>이모지</p></TooltipContent>
                          </Tooltip>
                      </TooltipProvider>
                      <textarea
                          ref={textareaRef}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="메시지 입력..."
                          className="flex-1 bg-transparent border-0 focus:ring-0 resize-none py-1.5 px-2 text-sm text-gray-800 placeholder-gray-500 outline-none max-h-28 overflow-y-auto" // Adjusted styles
                          rows={1}
                      />
                      <div className="flex items-center flex-shrink-0">
                         <TooltipProvider>
                             {[
                                { icon: Paperclip, label: '파일 첨부', handler: handleAttachClick },
                                { icon: Image, label: '이미지 첨부', handler: handleImageClick },
                                { icon: Mic, label: '음성 메시지', handler: handleMicClick }
                              ].map(({ icon: Icon, label, handler }, index) => (
                               <Tooltip key={index}>
                                   <TooltipTrigger asChild>
                                      <Button onClick={handler} size="icon" variant="ghost" className="rounded-full h-8 w-8 p-0 text-gray-500 hover:text-indigo-600">
                                          <Icon className="h-5 w-5" />
                                      </Button>
                                   </TooltipTrigger>
                                   <TooltipContent><p>{label}</p></TooltipContent>
                               </Tooltip>
                             ))}
                         </TooltipProvider>
                      </div>
                   </div>
                  <Button
                    onClick={handleSendMessage}
                    className="flex-shrink-0 rounded-full h-10 w-10 p-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                    disabled={!message.trim()} // Disable if message is empty
                    aria-label="메시지 보내기"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right sidebar - Participants list */}
            {!isMobile && (
              <div className="w-64 border-l border-gray-200 bg-gray-50 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-base text-gray-800 mb-2">참여자 ({participants.length})</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="참여자 검색"
                      className="pl-9 bg-white rounded-lg text-sm border-gray-200"
                    />
                  </div>
                </div>

                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-1 pb-2">
                     {/* Online Participants */}
                     <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                         온라인 — {participants.filter(p => p.online).length}
                     </div>
                     {participants
                        .filter(participant => participant.online)
                        .map(participant => (
                        <div key={participant.id} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center group">
                          <div className="relative flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-medium">
                              {participant.name.substring(0, 1).toUpperCase()}
                            </div>
                            {/* Status Indicator */}
                            <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-50 ${ // Adjusted border color
                              participant.status === 'away' ? 'bg-yellow-400' :
                              participant.status === 'busy' ? 'bg-red-500' :
                              'bg-green-500'
                            }`}></div>
                          </div>
                          <div className="ml-2 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{participant.name}</p>
                             {/* Optional: Show status text */}
                             {/* <p className="text-xs text-gray-500 capitalize">{participant.status}</p> */}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>옵션</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}

                     {/* Offline Participants */}
                     <div className="px-2 py-1 mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                         오프라인 — {participants.filter(p => !p.online).length}
                     </div>
                     {participants
                        .filter(participant => !participant.online)
                        .map(participant => (
                        <div key={participant.id} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center group opacity-60">
                          <div className="relative flex-shrink-0">
                             <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-medium">
                               {participant.name.substring(0, 1).toUpperCase()}
                             </div>
                             {/* Optional: Offline indicator */}
                             {/* <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-gray-50 bg-gray-400"></div> */}
                          </div>
                          <div className="ml-2 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-500 truncate">{participant.name}</p>
                          </div>
                           <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>옵션</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      ))}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group transition-colors"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>친구 초대하기</span>
                  </Button>
                </div>
              </div>
            )}
          {/* </DialogHeader> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunicationWidget;