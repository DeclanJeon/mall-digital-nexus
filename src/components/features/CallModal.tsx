import React, { useState, useCallback, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneCall, 
  X, 
  Clock, 
  User, 
  Star, 
  Shield,
  Zap,
  Video,
  MessageSquare,
  PhoneOff
} from 'lucide-react';
import userService from '@/services/userService';

interface CallModalProps {
  open: boolean;
  owner: string;
  peerMallKey: string;
  onOpenChange: (open: boolean) => void;
  location: {
    title: string;
    owner?: string;
    phone?: string;
    email?: string;
    imageUrl?: string;
    trustScore?: number;
    responseTime?: string;
    isOnline?: boolean;
  };
}

const CallModal: React.FC<CallModalProps> = ({
  open,
  onOpenChange,
  owner,
  peerMallKey,
  location
}) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);

  // 🎯 통화 시작 핸들러
  const handleStartCall = useCallback(() => {
    setCallStatus('calling');
    const url = `https://peerterra.com/one/channel/${location.title}?mk=${peerMallKey}`;
    
    // 실제 통화 연결 시뮬레이션
    const timerId = setTimeout(async () => {
      setCallStatus('connected');
      
      // 통화 시간 카운터 시작
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      await userService.requestCall(location.email, url);

      // 새 창에서 통화 페이지 열기
      const childWindow = window.open(url, '_blank');

      if (childWindow) {
        // 주기적으로 자식 창의 닫힘 여부 확인
        const checkChildClosed = setInterval(() => {
          if (childWindow.closed) {
            
            handleEndCall();
    
            // 더 이상 확인하지 않도록 setInterval을 해제합니다.
            clearInterval(checkChildClosed);
          }
        }, 1000);
    
        // 선택 사항: 부모 창이 먼저 닫히거나 페이지가 이동될 경우 setInterval을 정리
        window.addEventListener('beforeunload', () => {
          clearInterval(checkChildClosed);
        });
      } else {
        console.error('팝업이 차단되었거나 새 창을 열 수 없습니다.');
        alert('팝업이 차단되었거나 새 창을 열 수 없습니다. 팝업 차단을 해제해주세요.');
      }
      
      // 컴포넌트 언마운트 시 타이머 정리
      return () => clearInterval(timer);
    }, 2000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearTimeout(timerId);
  }, [owner, peerMallKey]);

  // 🎯 통화 종료 핸들러
  const handleEndCall = useCallback(() => {
    setCallStatus('ended');
    setTimeout(() => {
      setCallStatus('idle');
      setCallDuration(0);
      onOpenChange(false);
    }, 2000);
  }, [onOpenChange]);

  // 🕐 통화 시간 포맷터
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 z-[1001]">
        <DialogHeader className="space-y-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent font-bold text-lg">
                  피어몰 전화
                </span>
                <p className="text-sm text-gray-500 font-normal">
                  {location.title}
                </p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 📞 통화 상대 정보 */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                  {location.imageUrl ? (
                    <img
                      src={location.imageUrl}
                      alt={location.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl">
                      🏪
                    </div>
                  )}
                </div>
                {location.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900">{location.title}</h3>
                {location.owner && (
                  <p className="text-sm text-gray-600 mt-1">
                    운영자: {location.owner}
                  </p>
                )}
                {location.phone && (
                  <p className="text-sm font-mono text-green-700 mt-1">
                    📞 {location.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 📱 통화 상태 표시 */}
          <AnimatePresence mode="wait">
            {callStatus === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-4"
              >
                <div className="text-gray-600">
                  <Phone className="w-16 h-16 mx-auto mb-3 text-green-500" />
                  <p className="text-lg font-semibold">통화 준비 완료</p>
                  <p className="text-sm">버튼을 눌러 통화를 시작하세요</p>
                </div>
              </motion.div>
            )}

            {callStatus === 'calling' && (
              <motion.div
                key="calling"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <PhoneCall className="w-16 h-16 mx-auto text-green-500" />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-green-200 border-t-green-500 rounded-full animate-spin opacity-50" />
                  </div>
                </div>
                <div className="text-green-700">
                  <p className="text-lg font-semibold">연결 중...</p>
                  <p className="text-sm">잠시만 기다려주세요</p>
                </div>
              </motion.div>
            )}

            {callStatus === 'connected' && (
              <motion.div
                key="connected"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-4"
              >
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <PhoneCall className="w-16 h-16 mx-auto text-green-500" />
                  </motion.div>
                </div>
                <div className="text-green-700">
                  <p className="text-lg font-semibold">통화 중</p>
                  <p className="text-2xl font-mono font-bold text-green-600">
                    {formatDuration(callDuration)}
                  </p>
                </div>
              </motion.div>
            )}

            {callStatus === 'ended' && (
              <motion.div
                key="ended"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-4"
              >
                <PhoneOff className="w-16 h-16 mx-auto text-gray-500" />
                <div className="text-gray-600">
                  <p className="text-lg font-semibold">통화 종료</p>
                  <p className="text-sm">통화 시간: {formatDuration(callDuration)}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🎮 액션 버튼들 */}
          <div className="space-y-3">
            {callStatus === 'idle' && (
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={handleStartCall}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all h-12"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  통화 하기
                </Button>
              </div>
            )}

            {(callStatus === 'calling' || callStatus === 'connected') && (
              <Button
                onClick={handleEndCall}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all h-12"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                통화 종료
              </Button>
            )}
          </div>

          {/* 📋 통화 팁 */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              통화 팁
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• 조용한 곳에서 통화해주세요</li>
              <li>• 궁금한 점을 미리 정리해두세요</li>
              <li>• 예의를 지켜 대화해주세요</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;
