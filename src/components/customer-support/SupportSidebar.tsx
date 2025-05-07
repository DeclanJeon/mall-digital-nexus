
import React from 'react';
import { User, HelpCircle, FileText, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface SupportSidebarProps {
  onSwitchTab: (tab: string) => void;
}

const SupportSidebar: React.FC<SupportSidebarProps> = ({ onSwitchTab }) => {
  return (
    <div className="space-y-6">
      {/* User Profile Summary */}
      <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#71c4ef] flex items-center justify-center text-white">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">피어 사용자</p>
            <p className="text-sm text-gray-500">P-12345-6789</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>도움말 레벨</span>
            <span className="font-medium">3/10</span>
          </div>
          <Progress value={30} className="h-2 bg-[#d4eaf7]" />
        </div>
        
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span>해결된 문의</span>
            <span>8</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>진행 중인 문의</span>
            <span className="text-[#ffc107] font-medium">2</span>
          </div>
          <div className="flex justify-between">
            <span>도움이 됨 평가</span>
            <span>12</span>
          </div>
        </div>
      </div>
      
      {/* Pending Inquiries */}
      <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-[#ffc107]" />
          <span>진행 중인 문의</span>
        </h3>
        
        <div className="space-y-3 mb-3">
          <div className="p-3 bg-[#f5f4f1] rounded-md">
            <p className="font-medium text-sm truncate">피어몰 상품 등록 오류</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">2일 전</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs border-[#71c4ef] text-[#71c4ef]"
                onClick={() => onSwitchTab('my-inquiries')}
              >
                보기
              </Button>
            </div>
          </div>
          
          <div className="p-3 bg-[#f5f4f1] rounded-md">
            <p className="font-medium text-sm truncate">결제 승인 지연 문의</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">3일 전</span>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs border-[#71c4ef] text-[#71c4ef]"
                onClick={() => onSwitchTab('my-inquiries')}
              >
                보기
              </Button>
            </div>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full text-[#71c4ef]"
          onClick={() => onSwitchTab('my-inquiries')}
        >
          모든 문의 보기
        </Button>
      </div>
      
      {/* Support Quests */}
      <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-5">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#71c4ef]" />
          <span>지원 퀘스트</span>
        </h3>
        
        <div className="space-y-3 mb-3">
          <div className="p-3 bg-[#f5f4f1] rounded-md">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">FAQ 마스터</p>
              <span className="text-xs bg-[#d4eaf7] text-[#00668c] px-2 py-0.5 rounded">진행중</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">20개의 FAQ 읽기</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>진행도</span>
                <span>12/20</span>
              </div>
              <Progress value={60} className="h-1.5 bg-[#d4eaf7]" />
            </div>
          </div>
          
          <div className="p-3 bg-[#f5f4f1] rounded-md">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">도움이 되는 피드백</p>
              <span className="text-xs bg-[#d4eaf7] text-[#00668c] px-2 py-0.5 rounded">60%</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">10개의 유용한 피드백 제공</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>진행도</span>
                <span>6/10</span>
              </div>
              <Progress value={60} className="h-1.5 bg-[#d4eaf7]" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Direct Contact */}
      <div className="bg-[#d4eaf7] rounded-lg border border-[#b6ccd8] p-5">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-5 w-5 text-[#00668c]" />
          <h3 className="font-semibold">빠른 문의</h3>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          아직 해결되지 않은 문제가 있으신가요? 1:1 문의를 통해 신속하게 해결해 드립니다.
        </p>
        <Button 
          className="w-full bg-[#00668c] hover:bg-[#00668c]/90"
          onClick={() => onSwitchTab('inquiry')}
        >
          1:1 문의하기
        </Button>
      </div>
    </div>
  );
};

export default SupportSidebar;
