import React, { useState } from 'react';
import { MessageSquare, Users, Phone, Video, X, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CommunicationWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [peerNumber, setPeerNumber] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'voice' || tab === 'video') {
      setShowRequestDialog(true);
    }
  };

  const handleRequestCall = () => {
    // 실제 구현에서는 여기에 통신 요청 로직 추가
    setShowRequestDialog(false);
    alert(`${peerNumber}님에게 ${activeTab === 'voice' ? '음성' : '화상'} 통화 요청을 보냈습니다.`);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 메인 토글 버튼 */}
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-12 h-12 p-0 shadow-lg"
      >
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <Users className="h-5 w-5" />}
      </Button>

      {/* 확장된 위젯 내용 */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-2 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">통신 옵션</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2">
            {/* 1:1 채팅 */}
            <div 
              className={`p-3 rounded-md cursor-pointer flex items-center ${activeTab === 'chat' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleTabClick('chat')}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              <span>1:1 채팅</span>
            </div>

            {/* 오픈 채팅방 */}
            <div 
              className={`p-3 rounded-md cursor-pointer flex items-center ${activeTab === 'live' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleTabClick('live')}
            >
              <Users className="h-5 w-5 mr-2" />
              <div>
                <span>오픈 채팅방</span>
                <span className="block text-xs text-gray-500">현재 24명 참여 중</span>
              </div>
            </div>

            {/* 음성 통화 */}
            <div 
              className={`p-3 rounded-md cursor-pointer flex items-center ${activeTab === 'voice' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleTabClick('voice')}
            >
              <Phone className="h-5 w-5 mr-2" />
              <span>음성 통화</span>
            </div>

            {/* 화상 통화 */}
            <div 
              className={`p-3 rounded-md cursor-pointer flex items-center ${activeTab === 'video' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => handleTabClick('video')}
            >
              <Video className="h-5 w-5 mr-2" />
              <span>화상 통화</span>
            </div>
          </div>

          {/* 선택된 탭에 따른 UI */}
          {activeTab && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              {activeTab === 'chat' ? (
                <>
                  <Input
                    placeholder="피어 넘버 입력"
                    value={peerNumber}
                    onChange={(e) => setPeerNumber(e.target.value)}
                    className="mb-2"
                  />
                  <Button className="w-full">채팅 시작</Button>
                </>
              ) : activeTab === 'live' ? (
                <div className="text-center">
                  <p className="text-sm mb-3">피어몰의 모든 이용자가 참여할 수 있는 오픈 채팅방입니다</p>
                  <Button 
                    className="w-full"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'voice' ? '음성' : '화상'} 통화 요청
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="피어 넘버 입력"
              value={peerNumber}
              onChange={(e) => setPeerNumber(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                취소
              </Button>
              <Button onClick={handleRequestCall}>
                요청 보내기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* 오픈 채팅방 모달 */}
      <Dialog open={showChatModal} onOpenChange={setShowChatModal}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>오픈 채팅방 (현재 24명 참여 중)</span>
              <button onClick={() => setShowChatModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-1 gap-4">
            {/* 채팅 메시지 영역 */}
            <div className="flex-1 flex flex-col border rounded-lg">
              <div className="flex-1 p-4 overflow-y-auto">
                {/* 채팅 메시지 목록 */}
                <div className="space-y-3">
                  {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="font-medium">사용자{i+1}:</div>
                      <div>안녕하세요! 오픈 채팅방 테스트 메시지입니다.</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 border-t">
                <div className="flex gap-2">
                  <Input 
                    placeholder="메시지 입력..."
                    className="flex-1"
                  />
                  <Button>전송</Button>
                </div>
              </div>
            </div>

            {/* 참여자 목록 */}
            <div className="w-48 border rounded-lg p-3">
              <h3 className="font-bold mb-2">참여자 (24)</h3>
              <div className="space-y-1">
                {Array.from({length: 10}).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>사용자{i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunicationWidget;