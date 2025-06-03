import React, { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Phone, MessageSquare, Navigation, Star, Loader2, X } from 'lucide-react';

interface Review {
  id?: string;
  rating: number;
  content: string;
  author?: string;
  date?: string;
  images?: string[];
  text?: string;
}

interface MapLocation {
  lat: number;
  lng: number;
  title: string;
  address: string;
  phone?: string;
  reviews?: Review[];
  id?: string;
}

interface ReviewSectionProps {
  location: MapLocation | null;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmit?: (review: Review) => void;
}

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
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
            disabled={sending}
          >
            취소
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={sending}
          >
            {sending ? '전송 중...' : '보내기'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  location, 
  isOpen, 
  onClose, 
  onReviewSubmit = () => {} 
}) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [calling, setCalling] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'write'>('reviews');
  const [newReview, setNewReview] = useState<Omit<Review, 'id' | 'author' | 'date'>>({
    rating: 0,
    content: '',
    images: [],
  });
  
  // Reset form when location changes or modal is opened/closed
  useEffect(() => {
    if (isOpen) {
      setNewReview({
        rating: 0,
        content: '',
        images: [],
      });
      setActiveTab('reviews');
    }
  }, [isOpen, location]);
  
  if (!location || !isOpen) return null;
  
  const { title, reviews = [], phone } = location; 
  
  const handleSendMessage = (msg: string) => {
    setToastMessage('메시지가 전송되었습니다.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      setToastMessage('별점을 선택해주세요.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    const review: Review = {
      ...newReview,
      id: Date.now().toString(),
      author: '사용자',
      date: new Date().toISOString(),
    };
    
    onReviewSubmit(review);
    
    setToastMessage('리뷰가 등록되었습니다.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    setNewReview({
      rating: 0,
      content: '',
      images: [],
    });
  };

  const handleCall = () => {
    if (!phone) {
      setToastMessage('전화번호가 등록되지 않았습니다.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }
    
    setCalling(true);
    setTimeout(() => {
      setCalling(false);
      window.location.href = `tel:${phone}`;
    }, 1500);
  };

  const handleNavigate = () => {
    if (location.lat && location.lng) {
      window.open(`https://www.google.com/maps?q=${location.lat},${location.lng}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b flex">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('reviews')}
          >
            리뷰 ({reviews.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'write' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('write')}
          >
            리뷰 작성
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'reviews' ? (
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review: any, index: number) => (
                  <div key={index} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < (review.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700 ml-2">
                        {review.author || '익명'}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {review.date ? new Date(review.date).toLocaleDateString('ko-KR') : ''}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{review.content || review.text || '내용 없음'}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.images.map((img: string, i: number) => (
                          <div key={i} className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={img} 
                              alt={`리뷰 이미지 ${i + 1}`} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">아직 리뷰가 없습니다.</p>
                  <Button 
                    onClick={() => setActiveTab('write')}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    첫 리뷰 작성하기
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  별점 평가 <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 focus:outline-none"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      aria-label={`${star}점`}
                    >
                      <Star 
                        className={`h-8 w-8 ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                  리뷰 작성 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="이 장소에 대한 솔직한 리뷰를 작성해주세요."
                  value={newReview.content}
                  onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                  required
                  aria-required="true"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사진 첨부 (선택)
                </label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center hover:border-blue-400 transition-colors"
                    onClick={() => {
                      // TODO: Implement image upload
                      setToastMessage('이미지 업로드 기능은 준비 중입니다.');
                      setShowToast(true);
                      setTimeout(() => setShowToast(false), 3000);
                    }}
                  >
                    <span className="text-gray-400 text-2xl">+</span>
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">최대 5장까지 첨부 가능합니다.</p>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  disabled={newReview.rating === 0 || !newReview.content.trim()}
                >
                  리뷰 등록하기
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}
      
      {/* Message Modal */}
      <MessageModal 
        open={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSend={handleSendMessage}
        to={title}
      />
    </div>
  );
};

export default ReviewSection;