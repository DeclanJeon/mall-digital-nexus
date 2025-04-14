import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Phone, Video, X, ChevronUp, Send, Search, MoreHorizontal, User, Clock, Settings, Menu, Bell, Share2, Star, Paperclip, Smile, Mic, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { Tooltip } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CommunicationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
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
      avatar: `/api/placeholder/${32}/${32}`,
      status: i % 5 === 0 ? 'away' : i % 7 === 0 ? 'busy' : 'online'
    }))
  );

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'voice' || tab === 'video') {
      setShowRequestDialog(true);
    }
  };

  const handleRequestCall = () => {
    setShowRequestDialog(false);
    alert(`${peerNumber}님에게 ${activeTab === 'voice' ? '음성' : '화상'} 통화 요청을 보냈습니다.`);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: 'Me',
          text: message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true
        }
      ]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 메인 토글 버튼 - 프리미엄 느낌의 그라데이션 적용 */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 p-0 shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 ease-in-out"
      >
        {isOpen ? <ChevronUp className="h-6 w-6 text-white" /> : <Users className="h-6 w-6 text-white" />}
      </Button>

      {/* 확장된 위젯 내용 */}
      {isOpen && (
        <div className="bg-white rounded-xl shadow-2xl p-5 mt-3 w-72 border border-gray-100 animate-fadeIn">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-lg bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">통신 옵션</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* 1:1 채팅 */}
            <div 
              className={`p-4 rounded-lg cursor-pointer flex items-center transition-all duration-200 ${
                activeTab === 'chat' 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTabClick('chat')}
            >
              <div className={`p-2 rounded-lg ${activeTab === 'chat' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <MessageSquare className={`h-5 w-5 ${activeTab === 'chat' ? 'text-indigo-600' : 'text-gray-500'}`} />
              </div>
              <span className={`ml-3 font-medium ${activeTab === 'chat' ? 'text-indigo-700' : 'text-gray-700'}`}>1:1 채팅</span>
            </div>

            {/* 오픈 채팅방 */}
            <div 
              className={`p-4 rounded-lg cursor-pointer flex items-center transition-all duration-200 ${
                activeTab === 'live' 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTabClick('live')}
            >
              <div className={`p-2 rounded-lg ${activeTab === 'live' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <Users className={`h-5 w-5 ${activeTab === 'live' ? 'text-indigo-600' : 'text-gray-500'}`} />
              </div>
              <div className="ml-3">
                <span className={`font-medium ${activeTab === 'live' ? 'text-indigo-700' : 'text-gray-700'}`}>오픈 채팅방</span>
                <span className="block text-xs text-indigo-400">현재 24명 참여 중</span>
              </div>
            </div>

            {/* 음성 통화 */}
            <div 
              className={`p-4 rounded-lg cursor-pointer flex items-center transition-all duration-200 ${
                activeTab === 'voice' 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTabClick('voice')}
            >
              <div className={`p-2 rounded-lg ${activeTab === 'voice' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <Phone className={`h-5 w-5 ${activeTab === 'voice' ? 'text-indigo-600' : 'text-gray-500'}`} />
              </div>
              <span className={`ml-3 font-medium ${activeTab === 'voice' ? 'text-indigo-700' : 'text-gray-700'}`}>음성 통화</span>
            </div>

            {/* 화상 통화 */}
            <div 
              className={`p-4 rounded-lg cursor-pointer flex items-center transition-all duration-200 ${
                activeTab === 'video' 
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500' 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleTabClick('video')}
            >
              <div className={`p-2 rounded-lg ${activeTab === 'video' ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <Video className={`h-5 w-5 ${activeTab === 'video' ? 'text-indigo-600' : 'text-gray-500'}`} />
              </div>
              <span className={`ml-3 font-medium ${activeTab === 'video' ? 'text-indigo-700' : 'text-gray-700'}`}>화상 통화</span>
            </div>
          </div>

          {/* 선택된 탭에 따른 UI */}
          {activeTab && (
            <div className="mt-5 p-4 bg-gray-50 rounded-lg border border-gray-100">
              {activeTab === 'chat' ? (
                <>
                  <Input
                    placeholder="피어 넘버 입력"
                    value={peerNumber}
                    onChange={(e) => setPeerNumber(e.target.value)}
                    className="mb-3 border-indigo-200 focus:border-indigo-500 rounded-lg"
                  />
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg transition-colors">
                    채팅 시작
                  </Button>
                </>
              ) : activeTab === 'live' ? (
                <div className="text-center">
                  <p className="text-sm mb-3 text-gray-600">피어몰의 모든 이용자가 참여할 수 있는 오픈 채팅방입니다</p>
                  <Button 
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg transition-colors"
                    onClick={() => setShowChatModal(true)}
                  >
                    채팅방 입장
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  {activeTab === 'voice' ? '음성' : '화상'} 통화를 시작하려면 상대방의 동의가 필요합니다.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* 통화 요청 다이얼로그 */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="bg-white rounded-xl border-0 shadow-2xl max-w-md p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
            <DialogTitle className="text-xl font-semibold">
              {activeTab === 'voice' ? '음성' : '화상'} 통화 요청
            </DialogTitle>
            <p className="text-indigo-100 mt-1 text-sm">
              상대방에게 연결 요청을 보냅니다
            </p>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">상대방 피어 넘버</label>
              <Input
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
              >
                요청 보내기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 오픈 채팅방 모달 - 프리미엄 디자인 */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 rounded-xl border-0 shadow-2xl bg-white overflow-hidden">
          <div className="flex h-full">
            {/* 왼쪽 사이드바 - 채팅방 목록 */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    피어 채팅
                  </h3>
                  <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0">
                    <Settings className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="검색"
                    className="pl-9 bg-white rounded-lg text-sm border-gray-200"
                  />
                </div>
              </div>
              
              <Tabs defaultValue="all" className="flex-1 flex flex-col">
                <TabsList className="flex bg-transparent p-0 justify-between px-4 pt-2">
                  <TabsTrigger 
                    value="all" 
                    className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 rounded-none text-sm font-medium"
                  >
                    전체
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unread" 
                    className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 rounded-none text-sm font-medium"
                  >
                    안 읽음
                  </TabsTrigger>
                  <TabsTrigger 
                    value="groups" 
                    className="flex-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-700 rounded-none text-sm font-medium"
                  >
                    그룹
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="flex-1 pt-2 m-0">
                  <ScrollArea className="h-full">
                    <div className="space-y-1 px-2">
                      {Array.from({length: 5}).map((_, i) => (
                        <div 
                          key={i} 
                          className={`p-3 rounded-lg cursor-pointer flex items-center ${i === 0 ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                              {i === 0 ? "OP" : `U${i+1}`}
                            </div>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${i % 3 === 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                              <h4 className="font-medium text-gray-900 truncate">
                                {i === 0 ? "오픈 채팅방" : `사용자${i + 1}`}
                              </h4>
                              <span className="text-xs text-gray-500">09:4{i}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {i === 0 ? "현재 24명 참여 중" : "안녕하세요! 반갑습니다."}
                            </p>
                          </div>
                          {i % 2 === 0 && (
                            <div className="ml-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                              {i + 1}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="unread" className="flex-1 pt-2 m-0">
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>안 읽은 메시지가 없습니다</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="groups" className="flex-1 pt-2 m-0">
                  <ScrollArea className="h-full">
                    <div className="space-y-1 px-2">
                      <div className="p-3 rounded-lg cursor-pointer flex items-center bg-indigo-50">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                          OP
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-medium text-gray-900 truncate">오픈 채팅방</h4>
                            <span className="text-xs text-gray-500">지금</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">현재 24명 참여 중</p>
                        </div>
                        <div className="ml-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs">
                          3
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
              
              <div className="p-4 border-t border-gray-200 mt-auto">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold">
                    ME
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">내 계정</h4>
                    <p className="text-xs text-gray-500">피어몰 이용자</p>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-auto rounded-full h-8 w-8 p-0">
                    <Menu className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* 메인 채팅 영역 */}
            <div className="flex-1 flex flex-col h-full">
              {/* 채팅방 헤더 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                    OP
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-gray-900">오픈 채팅방</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" /> 24명 참여 중
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> 실시간 채팅
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button size="sm" variant="ghost" className="rounded-full h-9 w-9 p-0">
                    <Search className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full h-9 w-9 p-0">
                    <Bell className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full h-9 w-9 p-0">
                    <Star className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full h-9 w-9 p-0">
                    <Share2 className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-full h-9 w-9 p-0">
                    <MoreHorizontal className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
              
              {/* 채팅 메시지 영역 */}
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${msg.isMe ? 'order-2' : 'order-2'}`}>
                        {!msg.isMe && (
                          <div className="flex items-center mb-1">
                            <span className="font-medium text-gray-900">{msg.user}</span>
                            <span className="text-xs text-gray-500 ml-2">{msg.time}</span>
                          </div>
                        )}
                        <div className={`p-3 rounded-2xl ${
                          msg.isMe 
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                        {msg.isMe && (
                          <div className="flex justify-end mt-1">
                            <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>
                        )}
                      </div>
                      {!msg.isMe && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center text-white text-sm order-1 mr-2 mt-1">
                          {msg.user.charAt(0)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* 메시지 입력 영역 */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end gap-2">
                  <div className="flex-1 bg-gray-100 rounded-2xl p-1">
                    <div className="flex items-center px-2">
                      <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 text-gray-500 hover:text-indigo-600">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <div className="flex-1 px-1">
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="메시지 입력..."
                          className="w-full bg-transparent border-0 focus:ring-0 resize-none py-2 px-1 text-gray-800 placeholder-gray-400 outline-none"
                          rows={1}
                          style={{ minHeight: '24px', maxHeight: '120px' }}
                        />
                      </div>
                      <div className="flex items-center">
                        <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 text-gray-500 hover:text-indigo-600">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 text-gray-500 hover:text-indigo-600">
                          <Image className="h-5 w-5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="rounded-full h-8 w-8 p-0 text-gray-500 hover:text-indigo-600">
                          <Mic className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="rounded-full h-10 w-10 p-0 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    <Send className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* 오른쪽 사이드바 - 참여자 목록 */}
            <div className="w-64 border-l border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-800 mb-2">참여자 (24)</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="참여자 검색"
                    className="pl-9 bg-white rounded-lg text-sm border-gray-200"
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">온라인 - {participants.filter(p => p.online).length}</div>
                                      {participants
                    .filter(participant => participant.online)
                    .map(participant => (
                      <div key={participant.id} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center">
                        <div className="relative">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm">
                            {participant.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${
                            participant.status === 'away' ? 'bg-yellow-400' : 
                            participant.status === 'busy' ? 'bg-red-500' : 
                            'bg-green-500'
                          }`}></div>
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{participant.name}</p>
                        </div>
                      </div>
                    ))}
                    
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 mt-2">오프라인 - {participants.filter(p => !p.online).length}</div>
                  {participants
                    .filter(participant => !participant.online)
                    .map(participant => (
                      <div key={participant.id} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center opacity-60">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm">
                          {participant.name.charAt(0)}
                        </div>
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-500 truncate">{participant.name}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-gray-200">
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>친구 초대하기</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunicationWidget;