import { useState, useEffect } from 'react';
import { MessageSquare, Phone, Calendar, Clock, Star, Shield, Zap, Verified } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// 메시징 플랫폼 아이콘 컴포넌트들
const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.8 1.8 5.26 4.5 6.75L5.5 21l3.75-2.25c.92.16 1.88.25 2.75.25 5.52 0 10-3.58 10-8S17.52 3 12 3z"/>
  </svg>
);

const LineIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

const SmsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);

export default function EnhancedMessageModal({ 
  messageModalOpen, 
  setMessageModalOpen, 
  owner, 
  title, 
  displayImageUrl, 
  imageError, 
}) {
  const [messageText, setMessageText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['message']); // 기본값: 일반 메시지
  const [senderEmail, setSenderEmail] = useState('');
  const [isEmailSelected, setIsEmailSelected] = useState(false);

  // 메시징 플랫폼 옵션들
  const messagingPlatforms = [
    {
      id: 'kakao',
      name: '카카오톡',
      icon: KakaoIcon,
      color: 'yellow',
      bgColor: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-700',
    },
    {
      id: 'line',
      name: '라인',
      icon: LineIcon,
      color: 'green',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
    },
    {
      id: 'message',
      name: '메시지',
      icon: SmsIcon,
      color: 'blue',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700',
    },
    {
      id: 'email',
      name: '이메일',
      icon: EmailIcon,
      color: 'purple',
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-50',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700',
    }
  ];

  // 플랫폼 선택/해제 핸들러
  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        if (platformId === 'email') {
          setIsEmailSelected(false);
        }
        return prev.filter(id => id !== platformId);
      } else {
        if (platformId === 'email') {
          setIsEmailSelected(true);
        }
        return [...prev, platformId];
      }
    });
  };

  // 이메일 플랫폼이 선택/해제될 때마다 isEmailSelected 업데이트
  useEffect(() => {
    setIsEmailSelected(selectedPlatforms.includes('email'));
  }, [selectedPlatforms]);

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (!messageText.trim() || selectedPlatforms.length === 0) {
      alert('메시지 내용과 전송 방법을 선택해주세요! 📱');
      return;
    }

    try {
      // 각 플랫폼별로 메시지 전송 로직
      const sendPromises = selectedPlatforms.map(platform => {
        switch (platform) {
          case 'kakao':
            return sendKakaoMessage(messageText, owner);
          case 'line':
            return sendLineMessage(messageText, owner);
          case 'message':
            return sendSmsMessage(messageText, owner);
          case 'email':
            return sendEmailMessage(messageText, owner, title);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(sendPromises);
      
      // 성공 메시지
      const platformNames = selectedPlatforms.map(id => 
        messagingPlatforms.find(p => p.id === id)?.name
      ).join(', ');
      
      alert(`${platformNames}로 메시지가 성공적으로 전송되었습니다! ✨`);
      setMessageModalOpen(false);
      setMessageText('');
      setSelectedPlatforms(['message']);
      
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요. 😅');
    }
  };

  // 각 플랫폼별 전송 함수들 (실제 구현 필요)
  const sendKakaoMessage = async (message, recipient) => {
    // 카카오톡 API 연동 로직
    console.log('카카오톡 메시지 전송:', { message, recipient });
  };

  const sendLineMessage = async (message, recipient) => {
    // 라인 API 연동 로직
    console.log('라인 메시지 전송:', { message, recipient });
  };

  const sendSmsMessage = async (message, recipient) => {
    // SMS API 연동 로직
    console.log('SMS 메시지 전송:', { message, recipient });
  };

  const sendEmailMessage = (message, recipient, subject) => {
    if (!senderEmail) {
      alert('보내는 사람 이메일을 입력해주세요.');
      return Promise.reject('No sender email provided');
    }
    
    // Gmail 웹 메일로 전송
    const emailBody = encodeURIComponent(
      `안녕하세요 ${owner}님,\n\n` +
      `${message}\n\n` +
      `감사합니다.\n${senderEmail} 드림`
    );
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(`[${title}] 문의드립니다`)}&body=${emailBody}`;
    
    // 새 창에서 Gmail 열기
    window.open(gmailUrl, '_blank');
    
    return Promise.resolve();
  };

  const handleQuickCall = () => {
    // 통화 기능 구현
    console.log('즉시 통화 시도');
  };

  return (
    <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
      <DialogContent className="sm:max-w-[700px] border-0 shadow-2xl max-h-[90vh] overflow-y-auto z-[1001]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center space-x-3 text-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent font-bold">
                {owner}님에게 메시지
              </span>
              <p className="text-sm text-gray-500 font-normal">다양한 방법으로 빠른 응답을 받으세요</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          {/* 피어몰 정보 카드 - 기존과 동일 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg">
                  {!imageError ? (
                    <img
                      src={displayImageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl">
                      🏪
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-900">{title}</h4>
                {/* <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">운영자: {owner}</span>
                  {(isFamilyCertified || certified) && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                      <Verified className="w-3 h-3 mr-1" />
                      인증됨
                    </Badge>
                  )}
                </div> */}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  {/* <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>평균 응답: 5분</span>
                  </div> */}
                  {/* <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span>{premiumStats.displayRating} 평점</span>
                  </div> */}
                  {/* <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>{premiumStats.trustScore}% 신뢰도</span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* 🚀 NEW: 메시징 플랫폼 선택 */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              전송 방법 선택 (복수 선택 가능)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {messagingPlatforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                const IconComponent = platform.icon;
                
                return (
                  <Button
                    key={platform.id}
                    variant="outline"
                    size="sm"
                    className={`h-16 relative transition-all duration-300 ${
                      isSelected 
                        ? `${platform.bgColor} text-white border-transparent shadow-lg scale-105` 
                        : `${platform.hoverColor} ${platform.borderColor} hover:scale-102`
                    }`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20' : platform.bgColor}`}>
                        <IconComponent />
                      </div>
                      <div className="text-center">
                        <div className={`font-medium text-xs ${isSelected ? 'text-white' : platform.textColor}`}>
                          {platform.name}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
            
            {/* 이메일 발신자 입력 필드 */}
            {isEmailSelected && (
              <div className="space-y-2 mt-4">
                <label className="text-sm font-medium text-gray-700">
                  보내는 사람 이메일
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
                <p className="text-xs text-gray-500">
                  이 이메일 주소로 답변을 받으실 수 있습니다.
                </p>
              </div>
            )}
            
            {selectedPlatforms.length === 0 && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span>⚠️</span>
                최소 하나의 전송 방법을 선택해주세요
              </p>
            )}
          </div>
          
          {/* 메시지 입력 영역 - 기존과 동일하지만 약간 개선 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                메시지 내용
              </label>
              <Textarea 
                placeholder="안녕하세요! 귀하의 피어몰에 관심이 있어서 연락드립니다.&#10;&#10;• 궁금한 점이나 문의사항을 자세히 적어주세요&#10;&#10;• 구체적인 질문일수록 빠른 답변을 받으실 수 있습니다&#10;• 예: 제품 문의, 가격 정보, 배송 관련 등"
                className="resize-none h-40 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-sm leading-relaxed"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                maxLength={1000}
              />
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span>빠른 응답 보장</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>안전한 메시지</span>
                  </div>
                  {selectedPlatforms.length > 1 && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-blue-500" />
                      <span>{selectedPlatforms.length}개 방법으로 전송</span>
                    </div>
                  )}
                </div>
                <span className={`font-medium ${
                  messageText.length > 800 ? "text-orange-500" : "text-gray-500"
                }`}>
                  {messageText.length}/1000
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="space-x-3 pt-6 border-t border-gray-100">
          <Button 
            variant="outline" 
            onClick={() => setMessageModalOpen(false)}
            className="border-gray-200 hover:bg-gray-50 px-6"
          >
            취소
          </Button>
          <Button 
            onClick={handleSendMessage}
            disabled={!messageText.trim() || selectedPlatforms.length === 0 || (selectedPlatforms.includes('email') && !senderEmail.trim())}
            className={`bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg hover:shadow-xl px-8 py-2 font-semibold transition-all duration-300`}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            메시지 보내기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
