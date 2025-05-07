
import React from 'react';
import { MessageSquare, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupportChannelsProps {
  onSwitchTab: (tab: string) => void;
}

const SupportChannels: React.FC<SupportChannelsProps> = ({ onSwitchTab }) => {
  return (
    <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-6 mb-8">
      <h2 className="text-xl font-semibold mb-6">지원 채널</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#cccbc8] rounded-lg p-5 bg-[#f5f4f1]">
          <div className="mb-4 h-12 w-12 rounded-full bg-[#d4eaf7] flex items-center justify-center text-[#00668c]">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">1:1 문의하기</h3>
          <p className="text-gray-600 mb-4">
            FAQ에서 찾지 못한 질문이 있으신가요? 1:1 문의를 통해 자세한 답변을 받으실 수 있습니다.
          </p>
          <Button 
            onClick={() => onSwitchTab('inquiry')}
            className="w-full bg-[#00668c] hover:bg-[#00668c]/90"
          >
            문의하기
          </Button>
        </div>
        
        <div className="border border-[#cccbc8] rounded-lg p-5 bg-[#f5f4f1]">
          <div className="mb-4 h-12 w-12 rounded-full bg-[#d4eaf7] flex items-center justify-center text-[#00668c]">
            <Headphones className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">TIE 실시간 지원</h3>
          <p className="text-gray-600 mb-4">
            복잡한 문제는 TIE 실시간 지원을 통해 빠르게 해결하세요. 전문 상담사가 도와드립니다.
          </p>
          <div className="text-sm text-gray-500 mb-2">
            운영시간: 평일 오전 9시 ~ 오후 6시
          </div>
          <Button 
            variant="outline" 
            className="w-full border-[#00668c] text-[#00668c] hover:bg-[#d4eaf7] hover:text-[#00668c]"
          >
            TIE 연결하기
          </Button>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-[#d4eaf7] rounded-md flex items-center justify-between">
        <div>
          <h4 className="font-medium">나의 문의 내역</h4>
          <p className="text-sm text-gray-600">이전 문의 내역을 확인하고 관리하세요</p>
        </div>
        <Button 
          onClick={() => onSwitchTab('my-inquiries')}
          variant="outline" 
          className="border-[#00668c] bg-white text-[#00668c] hover:bg-[#f5f4f1]"
        >
          문의 내역 보기
        </Button>
      </div>
    </div>
  );
};

export default SupportChannels;
