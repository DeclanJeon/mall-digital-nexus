import React, { useState } from 'react';
import { Store, ChevronRight, PenLine, LayoutTemplate, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CreatePeermallModal from './CreatePeermallModal';
import { toast } from '@/hooks/use-toast';
import { Peermall } from '@/services/storage/peermallStorage';

interface CreatePeermallProps {
  onCreatePeermall: (newMallData: Omit<Peermall, "id" | "rating" | "reviewCount" | "createdAt" | "updatedAt">) => void;
}

const CreatePeermall: React.FC<CreatePeermallProps> = ({ onCreatePeermall }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  
  const steps = [
    {
      icon: <PenLine className="h-6 w-6 text-accent-100" />,
      title: '기본 정보 입력',
      description: '피어몰 이름, 카테고리, 간단한 설명 정보를 입력하세요.'
    },
    {
      icon: <LayoutTemplate className="h-6 w-6 text-accent-100" />,
      title: '디자인 선택',
      description: '다양한 템플릿, 색상, 폰트 중에서 선택하세요.'
    },
    {
      icon: <Store className="h-6 w-6 text-accent-100" />,
      title: '콘텐츠 추가',
      description: '상품, 소개, 연락처 등 필요한 콘텐츠를 추가하세요.'
    },
    {
      icon: <Globe className="h-6 w-6 text-accent-100" />,
      title: '발행',
      description: '피어몰을 발행하고 전 세계에 공유하세요.'
    }
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateSuccess = (peermallData: { name: string; type: string; }) => {
    // Close modal
    closeModal();
    
    // Show success message
    toast({
      title: "피어몰 생성 완료!",
      description: "새로운 피어몰이 성공적으로 생성되었습니다.",
    });
    
    // Index.tsx로 새로운 피어몰 데이터를 전달
    onCreatePeermall({
      title: peermallData.name,
      category: peermallData.type,
      description: '', // 필요에 따라 추가 정보 설정
      owner: '', // 필요에 따라 추가 정보 설정
      imageUrl: '', // 필요에 따라 추가 정보 설정
    });

    // Navigate to the new Peermall
    setTimeout(() => {
      navigate(`/peermall/${peermallData.name}`);
    }, 1000);
  };

  return (
    <>
      <CreatePeermallModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default CreatePeermall;