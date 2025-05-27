import React, { useEffect } from 'react';
import { Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatePeermallModal from './CreatePeermallModal';
import { toast } from '@/hooks/use-toast';
import { Peermall } from '@/services/storage/peermallStorage';
import { useModalRouter } from '@/hooks/useModalRouter';
import { useNavigate } from 'react-router-dom';

interface CreatePeermallProps {
  onCreatePeermall: (newMallData: Omit<Peermall, "id" | "rating" | "reviewCount" | "createdAt" | "updatedAt">) => void;
}

const CreatePeermall: React.FC<CreatePeermallProps> = ({ onCreatePeermall }) => {
  const navigate = useNavigate();
  
  const { isOpen, openModal, closeModal } = useModalRouter({
    modalKey: 'create-peermall',
    onClose: () => {
      console.log('피어몰 생성 모달이 닫혔어요! 👋');
    }
  });

  // 뒤로가기 버튼 처리 - 더 안전한 버전
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (isOpen) {
        event.preventDefault();
        closeModal();
      }
    };

    if (isOpen) {
      window.addEventListener('popstate', handlePopState);
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, closeModal]);

  const handleCreateSuccess = (peermallData: any) => {
    try {
      closeModal();
      
      toast({
        title: "피어몰 생성 완료! 🎉",
        description: "새로운 피어몰이 성공적으로 생성되었습니다.",
      });
      
      // 안전한 데이터 추출
      const mallName = peermallData?.name || peermallData?.title || 'new-peermall';
      const mallType = peermallData?.type || peermallData?.category || 'general';
      
      onCreatePeermall({
        title: mallName,
        category: mallType,
        description: peermallData?.description || '',
        owner: peermallData?.owner || peermallData?.representativeName || '',
        imageUrl: peermallData?.imageUrl || '',
      });

      // 네비게이션 - 에러 핸들링 포함
      setTimeout(() => {
        try {
          const urlFriendlyName = mallName
            .toLowerCase()
            .replace(/[^a-z0-9가-힣]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          navigate(`/space/${urlFriendlyName || 'new-peermall'}`);
        } catch (error) {
          console.error('네비게이션 에러:', error);
          navigate('/'); // 홈으로 fallback
        }
      }, 1000);
      
    } catch (error) {
      console.error('피어몰 생성 성공 핸들러 에러:', error);
      toast({
        title: "알 수 없는 오류",
        description: "피어몰은 생성되었지만 일부 처리에서 문제가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleOpenModal = () => {
    try {
      openModal({ step: '1' });
    } catch (error) {
      console.error('모달 열기 에러:', error);
      toast({
        title: "모달 열기 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        onClick={handleOpenModal}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
      >
        <Store className="mr-2 h-4 w-4" />
        피어몰 만들기 ✨
      </Button>

      <CreatePeermallModal 
        isOpen={isOpen} 
        onClose={closeModal} 
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default CreatePeermall;