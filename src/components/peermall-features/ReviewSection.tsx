import React, { useState } from 'react';
import { Location } from "@/types/map";
import { Button } from "../ui/button";
import { Phone, MessageSquare, Navigation, Star, Loader2 } from 'lucide-react';

// Toast 컴포넌트
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <div className="fixed bottom-8 right-6 z-[2000] bg-black/90 text-white rounded-lg px-4 py-3 shadow-lg flex items-center animate-fade-in">
    <span>{message}</span>
    <button className="ml-6 text-sm underline" onClick={onClose}>닫기</button>
  </div>
);

// 메시지 모달
const MessageModal = ({
  open,
  onClose,
  onSend,
  to
}: {
  open: boolean;
  onClose: () => void;
  onSend: (msg: string) => void;
  to: string;
}) => {
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!msg.trim()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSend(msg);
      setMsg('');
      onClose();
    }, 1000);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[3000] bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xs">
        <div className="font-bold text-lg mb-2">{to}에게 메시지 보내기</div>
        <textarea
          className="w-full border rounded p-2 h-24 mb-3"
          placeholder="메시지를 입력하세요"
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>취소</Button>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={sending || !msg.trim()}
            className={sending ? "opacity-60 cursor-not-allowed" : ""}
          >
            {sending ? <Loader2 className="animate-spin h-4 w-4" /> : "전송"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const ReviewSection = ({ location }: { location: Location | null }) => {
  const [toast, setToast] = useState<{ message: string; key: string } | null>(null);
  const [calling, setCalling] = useState(false);
  const [msgModal, setMsgModal] = useState(false);

  if (!location || !location.reviews || location.reviews.length === 0) {
    return (
      <div className="bg-white p-4 border-t mt-4 rounded-b-lg shadow-md">
        <h3 className="font-bold text-lg mb-3">피어몰 리뷰</h3>
        <p className="text-gray-500 text-sm">선택한 피어몰의 리뷰가 없습니다.</p>
      </div>
    );
  }

  const displayedReviews = location.reviews.slice(0, 3);
  const avgRating = location.reviews.reduce((sum, review) => sum + review.rating, 0) / location.reviews.length;
  const formattedRating = avgRating.toFixed(1);
  const reviewCount = location.reviews.length.toLocaleString();

  // 기능만 적용
  const handleCall = () => {
    if (!location.phone) {
      setToast({ message: '전화번호가 등록되지 않았습니다.', key: 'no-phone' });
      return;
    }
    setCalling(true);
    setToast(null);
    setTimeout(() => {
      setCalling(false);
      setToast({ message: `${location.title}에 전화를 연결했습니다!`, key: 'call' });
      // 실제 연결을 원하면: window.location.href = `tel:${location.phone}`;
    }, 1500);
  };

  const handleMessage = () => {
    setMsgModal(true);
  };

  const handleMessageSend = (msg: string) => {
    setToast({ message: `"${location.title}"에 메시지 전송 완료!`, key: 'msg' });
    // 실제 메시지 전송 로직 추가 가능
  };

  const handleNavigate = () => {
    if (location.lat && location.lng) {
      window.open(`https://maps.google.com/maps?q=${location.lat},${location.lng}`, '_blank');
    }
  };

  return (
    <div className="bg-white p-4 border-t mt-4 rounded-b-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">{location.title} 리뷰</h3>
        <div className="flex items-center gap-2">
          <div className="flex text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= Math.round(avgRating) ? "fill-yellow-500" : "fill-gray-200"}`} 
              />
            ))}
          </div>
          <span className="font-bold">{formattedRating}</span>
          <span className="text-gray-500 text-sm">({reviewCount})</span>
        </div>
      </div>
      
      <div className="flex gap-2 mb-4">
        <Button
          variant={calling ? "secondary" : "outline"}
          size="sm"
          onClick={handleCall}
          className={`flex items-center gap-1 transition-colors ${calling ? "bg-green-500 text-white" : ""}`}
          disabled={calling}
        >
          {calling ? <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg> : <Phone className="h-4 w-4" />}
          <span>{calling ? "통화 연결중..." : "통화"}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMessage}
          className="flex items-center gap-1"
        >
          <MessageSquare className="h-4 w-4" />
          <span>메시지</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleNavigate} className="flex items-center gap-1">
          <Navigation className="h-4 w-4" />
          <span>길찾기</span>
        </Button>
      </div>

      {/* 메시지 모달 */}
      <MessageModal
        open={msgModal}
        to={location.title}
        onClose={() => setMsgModal(false)}
        onSend={handleMessageSend}
      />

      {/* 토스트 알림 */}
      {toast && <Toast message={toast.message} onClose={() => setToast(null)} />}

      {displayedReviews.map((review, index) => (
        <div key={index} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-400 rounded-full text-white flex items-center justify-center">
                {review.author.slice(0, 1)}
              </div>
              <div>
                <div className="font-medium">{review.author}</div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
            </div>
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-500" : "fill-gray-200"}`} 
                />
              ))}
            </div>
          </div>
          
          <p className="text-sm mb-4">{review.text}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm font-medium">만족도</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${review.stats.satisfaction}%` }} 
                  ></div>
                </div>
                <span className="text-sm text-red-500 font-bold">{review.stats.satisfaction}%</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="text-sm font-medium">상품 품질</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${review.stats.quality}%` }} />
                </div>
                <span className="text-sm text-gray-500">{review.stats.quality}%</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="text-sm font-medium">서비스</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${review.stats.service}%` }} />
                </div>
                <span className="text-sm text-gray-500">{review.stats.service}%</span>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div className="text-sm font-medium">가격 대비 만족도</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${review.stats.valueForMoney}%` }} />
                </div>
                <span className="text-sm text-gray-500">{review.stats.valueForMoney}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-4 mt-3">
            <button className="flex items-center gap-1 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span>{review.likes}</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
              <span>{review.dislikes}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;