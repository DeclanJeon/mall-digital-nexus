import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Send, 
  X, 
  Clock, 
  User, 
  Star, 
  Shield,
  Zap,
  Phone,
  Image,
  Paperclip,
  Smile,
  CheckCheck,
  AtSign,
  FileText,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: {
    title: string;
    owner?: string;
    imageUrl?: string;
    trustScore?: number;
    responseTime?: string;
    isOnline?: boolean;
    email?: string; // 🎯 피어몰 이메일 추가
  };
}

const MessageModal: React.FC<EmailMessageModalProps> = ({
  open,
  onOpenChange,
  location
}) => {
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // 🎯 Gmail 전송 핸들러
  const handleSendEmail = useCallback(async () => {
    if (!senderEmail.trim() || !messageText.trim()) {
      alert('발신자 이메일과 메시지 내용을 입력해주세요!');
      return;
    }

    setIsSending(true);
    
    try {
      // 🎯 Gmail 전송 URL 생성
      const recipientEmail = location.email || 'contact@example.com'; // 피어몰 이메일
      const emailSubject = subject || `[${location.title}] 문의 메시지`;
      const emailBody = `
안녕하세요, ${location.title} 관계자님!

발신자: ${senderEmail}
문의 내용:

${messageText}

---
이 메시지는 피어몰 플랫폼을 통해 전송되었습니다.
      `;

      // Gmail 작성 URL 생성
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // 새 창에서 Gmail 열기
      window.open(gmailUrl, '_blank');
      
      // 전송 완료 처리
      setTimeout(() => {
        setIsSending(false);
        setEmailSent(true);
        
        // 3초 후 모달 닫기
        setTimeout(() => {
          setEmailSent(false);
          setSenderEmail('');
          setSubject('');
          setMessageText('');
          onOpenChange(false);
        }, 3000);
      }, 1000);
      
    } catch (error) {
      console.error('이메일 전송 중 오류:', error);
      setIsSending(false);
      alert('이메일 전송 중 오류가 발생했습니다.');
    }
  }, [senderEmail, subject, messageText, location, onOpenChange]);

  // 🎯 빠른 제목 설정
  const handleQuickSubject = useCallback((subjectText: string) => {
    setSubject(subjectText);
  }, []);

  // 🎯 빠른 메시지 설정
  const handleQuickMessage = useCallback((text: string) => {
    setMessageText(text);
  }, []);

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[85vh] border-0 shadow-2xl bg-gradient-to-br from-white to-purple-50 overflow-hidden z-[1001]">
        <DialogHeader className="space-y-3 pb-2">
            <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg flex-shrink-0">
                <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                <span className="bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent font-bold text-lg">
                    이메일 쪽지
                </span>
                <p className="text-sm text-gray-500 font-normal truncate">
                    {location.title}에게 메시지 보내기
                </p>
                </div>
            </div>
            
            </DialogTitle>
        </DialogHeader>

        {/* 🎯 전송 완료 화면 */}
        <AnimatePresence>
            {emailSent && (
            <motion.div
                className="absolute inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div className="text-center p-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4"
                >
                    ✓
                </motion.div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">이메일 전송 완료!</h3>
                <p className="text-gray-600 text-sm">Gmail이 열렸습니다. 전송 버튼을 눌러주세요.</p>
                </div>
            </motion.div>
            )}
        </AnimatePresence>

        {/* 🎯 스크롤 가능한 컨텐츠 영역 */}
        <div className="space-y-4 overflow-y-auto max-h-[calc(85vh-120px)] pr-1">
            {/* 📞 수신자 정보 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden shadow-lg">
                    {location.imageUrl ? (
                    <img
                        src={location.imageUrl}
                        alt={location.title}
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm">
                        🏪
                    </div>
                    )}
                </div>
                {location.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
                    <div className="w-full h-full bg-green-400 rounded-full animate-pulse" />
                    </div>
                )}
                </div>
                
                <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{location.title}</h3>
                {location.owner && (
                    <p className="text-xs text-gray-600 truncate">운영자: {location.owner}</p>
                )}
                <div className="flex items-center gap-1 mt-1 text-xs">
                    <AtSign className="w-3 h-3 text-purple-500 flex-shrink-0" />
                    <span className="text-purple-600 font-medium truncate">
                    {location.email || 'contact@example.com'}
                    </span>
                </div>
                </div>

                <Button
                variant="outline"
                size="sm"
                className="border-green-200 hover:bg-green-50 flex-shrink-0 text-xs px-2"
                onClick={() => {
                    onOpenChange(false);
                }}
                >
                <Phone className="w-3 h-3 mr-1 text-green-600" />
                통화
                </Button>
            </div>
            </div>

            {/* 📧 이메일 작성 폼 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            {/* 발신자 이메일 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <AtSign className="w-4 h-4 text-purple-500" />
                발신자 이메일 *
                </label>
                <Input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                required
                />
            </div>

            {/* 제목 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                제목
                </label>
                <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={`[${location.title}] 문의 메시지`}
                className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 text-sm"
                />
                
                {/* 빠른 제목 버튼들 - 수정됨 */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                    '일반 문의',
                    '가격 문의',
                    '예약 문의',
                    '서비스 문의'
                ].map((subjectText, index) => (
                    <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSubject(`[${location.title}] ${subjectText}`)}
                    className="text-xs h-7 px-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 truncate"
                    >
                    {subjectText}
                    </Button>
                ))}
                </div>
            </div>

            {/* 메시지 내용 */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                메시지 내용 *
                </label>
                <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="안녕하세요! 문의드릴 내용이 있어서 연락드립니다..."
                className="min-h-[100px] border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none text-sm"
                maxLength={1000}
                required
                />
                
                {/* 빠른 메시지 버튼들 - 수정됨 */}
                {!messageText && (
                <div className="space-y-2">
                    <p className="text-xs text-gray-600 font-medium">빠른 메시지:</p>
                    <div className="space-y-2">
                    {[
                        '안녕하세요! 문의드릴 내용이 있어서 연락드립니다.',
                        '운영시간과 위치 정보를 알고 싶습니다.',
                        '서비스 가격과 이용 방법이 궁금합니다.',
                        '예약이 필요한지 알고 싶습니다.'
                    ].map((text, index) => (
                        <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickMessage(text)}
                        className="w-full text-xs h-8 px-3 border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-left justify-start"
                        >
                        <span className="truncate">{text}</span>
                        </Button>
                    ))}
                    </div>
                </div>
                )}
                
                <div className="flex justify-between items-center text-xs text-gray-500">
                <span>💡 정중하고 명확한 메시지를 작성해주세요</span>
                <span>{messageText.length}/1000</span>
                </div>
            </div>

            {/* 전송 버튼 */}
            <div className="pt-3 border-t border-gray-100">
                <Button
                onClick={handleSendEmail}
                disabled={!senderEmail.trim() || !messageText.trim() || isSending}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg hover:shadow-xl h-11 text-sm"
                >
                {isSending ? (
                    <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Gmail 열고 있는 중...
                    </>
                ) : (
                    <>
                    <Send className="w-4 h-4 mr-2" />
                    Gmail로 전송하기
                    </>
                )}
                </Button>
                
                <p className="text-xs text-gray-500 text-center mt-2">
                🔒 Gmail을 통해 안전하게 전송됩니다
                </p>
            </div>
            </div>
        </div>
        </DialogContent>
    </Dialog>
    );
};

export default MessageModal;