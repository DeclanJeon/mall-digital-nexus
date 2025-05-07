
import React, { useState } from 'react';
import { Headphones, Monitor, MessageCircle, Mic, Video, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const TIESupport = () => {
  const [step, setStep] = useState<'preparation' | 'waiting' | 'connected'>('preparation');
  const [supportType, setSupportType] = useState<'chat' | 'voice' | 'video'>('chat');
  const [problemDescription, setProblemDescription] = useState('');
  const [screenShare, setScreenShare] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  
  const startTIESupport = () => {
    if (problemDescription && termsAgreed) {
      setStep('waiting');
      
      // Simulating connection after 5 seconds
      setTimeout(() => {
        setStep('connected');
      }, 5000);
    }
  };
  
  const endSession = () => {
    // Handle session end logic
    setStep('preparation');
    setProblemDescription('');
    setScreenShare(false);
    setTermsAgreed(false);
  };
  
  return (
    <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-full bg-[#d4eaf7] flex items-center justify-center text-[#00668c]">
          <Headphones className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">TIE 지원 서비스</h2>
          <p className="text-gray-600">복잡한 문제는 실시간 상담으로 해결하세요</p>
        </div>
      </div>
      
      {step === 'preparation' && (
        <div className="space-y-6">
          <div className="bg-[#d4eaf7] rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-2">TIE 지원 안내</h3>
            <p className="text-sm text-gray-700 mb-3">
              TIE(Technical Interactive Engagement) 지원은 실시간 채팅, 음성, 화상 상담 및 화면 공유를 통해 보다 복잡한 문제를 해결해 드립니다.
            </p>
            <p className="text-sm text-gray-700">
              <strong>서비스 이용 가능 시간:</strong> 평일 오전 9시 ~ 오후 6시
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">문제 설명</h3>
            <Textarea
              placeholder="어떤 문제로 도움이 필요하신지 간략하게 설명해주세요"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="mb-4"
            />
            
            <h3 className="font-medium mb-3">지원 유형 선택</h3>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Button
                type="button"
                variant={supportType === 'chat' ? 'default' : 'outline'}
                className={`flex flex-col items-center py-6 ${
                  supportType === 'chat' ? 'bg-[#00668c]' : 'border-[#00668c] text-[#00668c]'
                }`}
                onClick={() => setSupportType('chat')}
              >
                <MessageCircle className="h-8 w-8 mb-2" />
                <span>채팅</span>
              </Button>
              
              <Button
                type="button"
                variant={supportType === 'voice' ? 'default' : 'outline'}
                className={`flex flex-col items-center py-6 ${
                  supportType === 'voice' ? 'bg-[#00668c]' : 'border-[#00668c] text-[#00668c]'
                }`}
                onClick={() => setSupportType('voice')}
              >
                <Mic className="h-8 w-8 mb-2" />
                <span>음성</span>
              </Button>
              
              <Button
                type="button"
                variant={supportType === 'video' ? 'default' : 'outline'}
                className={`flex flex-col items-center py-6 ${
                  supportType === 'video' ? 'bg-[#00668c]' : 'border-[#00668c] text-[#00668c]'
                }`}
                onClick={() => setSupportType('video')}
              >
                <Video className="h-8 w-8 mb-2" />
                <span>화상</span>
              </Button>
            </div>
            
            <div className="border border-[#cccbc8] rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-[#00668c]" />
                  <h3 className="font-medium">화면 공유 (VI 기능)</h3>
                </div>
                <Checkbox
                  id="screen-share"
                  checked={screenShare}
                  onCheckedChange={() => setScreenShare(!screenShare)}
                />
              </div>
              <p className="text-sm text-gray-600">
                상담사가 귀하의 화면을 볼 수 있도록 허용하면 문제 해결에 도움이 됩니다
              </p>
            </div>
            
            <div className="border border-[#cccbc8] rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">서비스 이용 동의</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={termsAgreed}
                    onCheckedChange={() => setTermsAgreed(!termsAgreed)}
                    className="mt-1"
                  />
                  <div>
                    <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                      TIE 서비스 이용 약관에 동의합니다
                    </label>
                    <p className="text-xs text-gray-500">
                      상담 내용은 서비스 품질 개선을 위해 기록될 수 있으며, 화면 공유 시 개인 정보가 포함된 화면은 가리고 진행해주세요.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                className="bg-[#00668c] hover:bg-[#00668c]/90"
                disabled={!problemDescription || !termsAgreed}
                onClick={startTIESupport}
              >
                TIE 연결 요청하기
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {step === 'waiting' && (
        <div className="text-center py-10">
          <div className="inline-block mb-6">
            <div className="h-20 w-20 rounded-full border-4 border-t-[#00668c] border-r-[#00668c] border-b-[#00668c] border-l-transparent animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold mb-2">TIE 상담사 연결 중...</h3>
          <p className="text-gray-600 mb-6">잠시만 기다려 주세요</p>
          <div className="flex justify-center mb-6">
            <div className="bg-[#f5f4f1] rounded-lg px-4 py-2">
              <p className="text-sm">예상 대기 시간: <strong>2분</strong></p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-[#dc3545] text-[#dc3545]"
            onClick={() => setStep('preparation')}
          >
            연결 취소
          </Button>
        </div>
      )}
      
      {step === 'connected' && (
        <div>
          <div className="bg-[#d4edda] border border-[#c3e6cb] text-[#155724] rounded-lg p-4 mb-6 flex items-center gap-3">
            <Check className="h-5 w-5" />
            <span>TIE 상담사와 연결되었습니다</span>
          </div>
          
          <div className="border border-[#cccbc8] rounded-lg mb-6">
            <div className="p-4 border-b border-[#cccbc8] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#71c4ef] flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">상담사 김지원</h3>
                  <p className="text-xs text-gray-500">TIE 지원 전문가</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={supportType === 'chat' ? 'bg-[#00668c] text-white' : ''}
                  onClick={() => setSupportType('chat')}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={supportType === 'voice' ? 'bg-[#00668c] text-white' : ''}
                  onClick={() => setSupportType('voice')}
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={supportType === 'video' ? 'bg-[#00668c] text-white' : ''}
                  onClick={() => setSupportType('video')}
                >
                  <Video className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={screenShare ? 'bg-[#00668c] text-white' : ''}
                  onClick={() => setScreenShare(!screenShare)}
                >
                  <Monitor className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 max-h-[400px] overflow-y-auto">
              {supportType === 'chat' && (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-[#f5f4f1] rounded-lg p-3 max-w-[80%]">
                      <p>{problemDescription}</p>
                      <p className="text-xs text-gray-500 text-right mt-1">14:30</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="bg-[#d4eaf7] rounded-lg p-3 max-w-[80%]">
                      <p>안녕하세요! TIE 상담사 김지원입니다. 문제 해결을 도와드리겠습니다. 추가적으로 어떤 어려움이 있으신지 더 자세히 알려주실 수 있을까요?</p>
                      <p className="text-xs text-gray-500 mt-1">14:31</p>
                    </div>
                  </div>
                </div>
              )}
              
              {supportType === 'voice' && (
                <div className="text-center py-10">
                  <div className="mb-4">
                    <div className="h-16 w-16 mx-auto rounded-full bg-[#d4eaf7] flex items-center justify-center text-[#00668c]">
                      <Mic className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">음성 통화 연결됨</h3>
                  <p className="text-sm text-gray-600 mb-4">통화 시간: 00:45</p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Mic className="h-6 w-6" />
                    </Button>
                    <Button variant="destructive" size="icon" className="rounded-full h-12 w-12 bg-[#dc3545]">
                      <PhoneOff className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              )}
              
              {supportType === 'video' && (
                <div className="text-center py-10">
                  <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <AlertTriangle className="h-10 w-10 text-gray-400" />
                    <p className="text-gray-500">카메라와 마이크 액세스를 허용해주세요</p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Mic className="h-6 w-6" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Video className="h-6 w-6" />
                    </Button>
                    <Button variant="destructive" size="icon" className="rounded-full h-12 w-12 bg-[#dc3545]">
                      <PhoneOff className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[#cccbc8]">
              {supportType === 'chat' && (
                <div className="flex gap-2">
                  <Textarea placeholder="메시지 입력..." className="resize-none" />
                  <Button className="bg-[#00668c] hover:bg-[#00668c]/90]">전송</Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              className="border-[#71c4ef] text-[#71c4ef]"
            >
              대화 요약 저장
            </Button>
            <Button 
              variant="destructive" 
              className="bg-[#dc3545]"
              onClick={endSession}
            >
              상담 종료
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Placeholder for icons
const User = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const PhoneOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"></path>
    <line x1="23" y1="1" x2="1" y2="23"></line>
  </svg>
);

export default TIESupport;
