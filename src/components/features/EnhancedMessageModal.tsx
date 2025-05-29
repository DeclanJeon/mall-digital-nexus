import { useState, useEffect } from 'react';
import { Mail, Send, User, FileText, Clock, Shield, Sparkles, Check, AlertCircle, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// 🎨 이메일 아이콘 컴포넌트
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

// 🌟 Props 타입 정의
interface EmailMessageModalProps {
  messageModalOpen: boolean;
  setMessageModalOpen: (open: boolean) => void;
  owner: string;
  title: string;
  email?: string;
  displayImageUrl?: string;
  imageError?: boolean;
}

export default function EmailMessageModal({ 
  messageModalOpen, 
  setMessageModalOpen, 
  owner, 
  email,
  title, 
  displayImageUrl, 
  imageError, 
}: EmailMessageModalProps) {
  const [messageText, setMessageText] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [isValidForm, setIsValidForm] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  // 🎯 이메일 유효성 검증 함수
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 🔮 폼 유효성 실시간 검증
  useEffect(() => {
    const isFormValid = 
      messageText.trim().length > 0 &&
      senderEmail.trim().length > 0 &&
      isValidEmail(senderEmail) &&
      senderName.trim().length > 0 &&
      emailSubject.trim().length > 0 &&
      email &&
      isValidEmail(email);
    
    setIsValidForm(isFormValid);
  }, [messageText, senderEmail, senderName, emailSubject, email]);

  // 💫 이메일 실시간 유효성 검사
  useEffect(() => {
    if (!senderEmail.trim()) {
      setEmailStatus('idle');
      return;
    }
    
    setEmailStatus('validating');
    const timer = setTimeout(() => {
      setEmailStatus(isValidEmail(senderEmail) ? 'valid' : 'invalid');
    }, 500);
    
    return () => clearTimeout(timer);
  }, [senderEmail]);

  // 🌈 초기값 설정
  useEffect(() => {
    if (messageModalOpen) {
      setEmailSubject(`[${title}] 문의드립니다`);
      setMessageText(`안녕하세요 ${owner}님,\n\n피어몰 "${title}"에 관심이 있어서 연락드립니다.\n\n\n\n감사합니다.`);
    }
  }, [messageModalOpen, title, owner]);

  // 🚀 이메일 전송 핸들러
  const handleSendEmail = async () => {
    if (!isValidForm) {
      alert('모든 필수 정보를 올바르게 입력해주세요! 📧');
      return;
    }

    try {
      const emailBody = encodeURIComponent(
        `${messageText}\n\n` +
        `───────────────────────\n` +
        `📧 발신자: ${senderName}\n` +
        `📧 이메일: ${senderEmail}\n` +
        `🏪 피어몰: ${title}\n` +
        `⏰ 문의일시: ${new Date().toLocaleString('ko-KR')}\n` +
        `───────────────────────`
      );
      
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email!)}&su=${encodeURIComponent(emailSubject)}&body=${emailBody}`;
      
      console.log('📬 이메일 전송:', {
        to: email,
        from: senderEmail,
        subject: emailSubject,
        sender: senderName
      });
      
      window.open(gmailUrl, '_blank');
      
      // 🎉 성공 처리
      setMessageModalOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      alert('이메일 전송 중 오류가 발생했습니다. 다시 시도해주세요. 😅');
    }
  };

  // 🔄 폼 초기화
  const resetForm = () => {
    setMessageText('');
    setSenderEmail('');
    setSenderName('');
    setEmailSubject('');
    setEmailStatus('idle');
  };

  // 📧 이메일 상태별 아이콘
  const getEmailStatusIcon = () => {
    switch (emailStatus) {
      case 'validating':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'valid':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
      <DialogContent className="sm:max-w-[800px] border-0 shadow-2xl max-h-[95vh] overflow-y-auto z-[1001] bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <DialogHeader className="space-y-4 pb-6">
          <DialogTitle className="flex items-center space-x-4 text-2xl">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <Mail className="h-7 w-7 relative z-10" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                ✨ {owner}님에게 이메일 보내기
              </div>
              <p className="text-sm text-gray-600 font-normal mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                전문적이고 안전한 이메일 커뮤니케이션
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8 py-6">
          {/* 🎨 피어몰 정보 카드 - 이메일 테마 */}
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-indigo-100 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    {!imageError && displayImageUrl ? (
                      <img
                        src={displayImageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white text-3xl">
                        🏪
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <Mail className="w-3 h-3 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-xl text-gray-900 mb-2">{title}</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-gray-700 font-medium">운영자: {owner}</span>
                    {email && (
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 text-sm px-3 py-1">
                        <Mail className="w-3 h-3 mr-1" />
                        이메일 연동 활성화
                      </Badge>
                    )}
                  </div>
                  
                  {email && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-indigo-200">
                      <div className="text-sm text-gray-600 mb-1">수신자 이메일</div>
                      <div className="font-mono text-indigo-700 font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {email}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span>빠른 응답</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>안전한 전송</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span>전문적 소통</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🌟 발신자 정보 입력 섹션 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              발신자 정보
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 이름 입력 */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  보내는 사람 이름 *
                </label>
                <Input
                  type="text"
                  placeholder="홍길동"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl text-base transition-all duration-300"
                />
              </div>
              
              {/* 이메일 입력 */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  보내는 사람 이메일 *
                </label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className={`h-12 border-2 rounded-xl text-base pr-12 transition-all duration-300 ${
                      emailStatus === 'valid' 
                        ? 'border-green-500 focus:border-green-500 focus:ring-green-500' 
                        : emailStatus === 'invalid'
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {getEmailStatusIcon()}
                  </div>
                </div>
                {emailStatus === 'invalid' && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    올바른 이메일 형식을 입력해주세요
                  </p>
                )}
                {emailStatus === 'valid' && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    유효한 이메일 주소입니다
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 📧 이메일 내용 섹션 */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              이메일 내용
            </h3>
            
            {/* 제목 입력 */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-pink-600" />
                이메일 제목 *
              </label>
              <Input
                type="text"
                placeholder="문의 제목을 입력해주세요"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="h-12 border-2 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl text-base transition-all duration-300"
                maxLength={100}
              />
              <div className="text-xs text-gray-500 text-right">
                {emailSubject.length}/100
              </div>
            </div>
            
            {/* 메시지 내용 */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-600" />
                메시지 내용 *
              </label>
              <Textarea 
                placeholder="문의하실 내용을 자세히 작성해주세요.&#10;&#10;• 구체적인 질문일수록 빠른 답변을 받으실 수 있습니다&#10;• 예: 제품 문의, 가격 정보, 배송 관련, 서비스 문의 등&#10;&#10;정중하고 명확한 문의를 통해 더 나은 답변을 받아보세요! ✨"
                className="resize-none h-48 border-2 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl text-base leading-relaxed transition-all duration-300"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                maxLength={2000}
              />
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    <span>전문적인 이메일 형식</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>안전한 전송 보장</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500" />
                    <span>빠른 응답 기대</span>
                  </div>
                </div>
                <span className={`font-medium ${
                  messageText.length > 1800 ? "text-orange-500" : "text-gray-500"
                }`}>
                  {messageText.length}/2000
                </span>
              </div>
            </div>
          </div>

          {/* 🎯 이메일 미리보기 */}
          {isValidForm && (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border-2 border-blue-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                이메일 미리보기
              </h4>
              <div className="bg-white rounded-xl p-4 border border-blue-200 space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">받는 사람:</span>
                  <span className="ml-2 font-mono text-blue-700">{email}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">보내는 사람:</span>
                  <span className="ml-2 font-mono text-purple-700">{senderName} &lt;{senderEmail}&gt;</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">제목:</span>
                  <span className="ml-2 font-medium text-gray-900">{emailSubject}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="text-sm text-gray-700 whitespace-pre-line max-h-32 overflow-y-auto">
                  {messageText.substring(0, 200)}{messageText.length > 200 && '...'}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="space-x-4 pt-8 border-t-2 border-gradient-to-r from-indigo-100 to-purple-100">
          <Button 
            variant="outline" 
            onClick={() => setMessageModalOpen(false)}
            className="border-2 border-gray-200 hover:bg-gray-50 px-8 py-3 h-12 text-base font-medium transition-all duration-300"
          >
            취소
          </Button>
          <Button 
            onClick={handleSendEmail}
            disabled={!isValidForm || !email}
            className={`h-12 px-8 py-3 text-base font-bold transition-all duration-300 ${
              isValidForm && email
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="h-5 w-5 mr-2" />
            ✨ 이메일 보내기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}