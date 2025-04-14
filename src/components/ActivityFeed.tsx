import React, { useState } from 'react';
import { MessageSquare, ShoppingBag, Heart, Star, Activity, Send, User, ChevronDown, ChevronUp, X } from 'lucide-react';

export const useActivities = () => {
  return [
    {
      type: 'message',
      icon: <MessageSquare className="h-4 w-4 text-green-500" />,
      text: '박성민님이 새로운 메시지를 보냈습니다.',
      time: '5분 전'
    },
    {
      type: 'purchase',
      icon: <ShoppingBag className="h-4 w-4 text-blue-500" />,
      text: '홍길동님이 디지털 아트워크를 구매했습니다.',
      time: '25분 전'
    },
    {
      type: 'like',
      icon: <Heart className="h-4 w-4 text-red-500" />,
      text: '김영희님이 당신의 피어몰을 좋아합니다.',
      time: '1시간 전'
    },
    {
      type: 'review',
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      text: '최우진님이 상품에 5점 리뷰를 남겼습니다.',
      time: '3시간 전'
    },
    {
      type: 'trending',
      icon: <Activity className="h-4 w-4 text-purple-500" />,
      text: '당신의 피어몰이 디자인 카테고리에서 인기 상승 중입니다.',
      time: '5시간 전'
    }
  ];
};

const ActivityFeed = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const chatMessages = [
    { user: '김민지', message: '안녕하세요! 디자인 관련 질문이 있습니다.', time: '5분 전' },
    { user: '박서준', message: '새로 오픈한 피어몰 어떻게 생각하세요?', time: '10분 전' },
    { user: '이지은', message: '큐레이션 링크 기능 정말 유용한 것 같아요!', time: '15분 전' },
    { user: '최우진', message: '누구 지금 라이브 세션 참여중이신가요?', time: '20분 전' },
    { user: '정소민', message: '디지털 명함 서비스 사용법 공유해주세요!', time: '30분 전' }
  ];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    // 실제 구현에서는 여기에 메시지 전송 로직 추가
    setChatMessage('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* 채팅 토글 버튼 */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="bg-accent-100 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
      >
        {isChatOpen ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
      </button>

      {/* 라이브 채팅 섹션 */}
      {isChatOpen && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-2 w-80">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">라이브 채팅</h3>
            <button onClick={() => setIsChatOpen(false)}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="h-[300px] flex flex-col">
            <div className="flex-1 overflow-y-auto mb-3 space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-primary-100 p-2 rounded-full mr-2">
                    <User className="h-4 w-4 text-primary-300" />
                  </div>
                  <div className="flex-1 bg-bg-100 rounded-lg p-2">
                    <p className="text-sm font-medium">{msg.user}</p>
                    <p className="text-sm">{msg.message}</p>
                    <span className="text-xs text-text-200">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="mt-auto flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="메시지 입력..."
                className="flex-1 rounded-md border border-bg-200 p-2 text-sm"
              />
              <button type="submit" className="bg-accent-100 text-white p-2 rounded-md">
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
