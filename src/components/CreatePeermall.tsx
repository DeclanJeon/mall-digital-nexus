
import React, { useState } from 'react';
import { Store, ChevronRight, PenLine, LayoutTemplate, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatePeermallModal from './CreatePeermallModal';

const CreatePeermall = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
      description: '미리보기 확인 후 피어몰을 발행하고 공유하세요.'
    }
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <section className="my-12 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="bg-primary-100 p-8">
            <h2 className="text-3xl font-bold mb-4">나만의 피어몰을<br />시작하세요</h2>
            <p className="text-text-200 mb-6">맞춤형 온라인 홈페이지를 생성하고 관리하여 제품과 콘텐츠를 공유하세요.</p>
            
            <Button 
              onClick={openModal}
              className="btn-accent flex items-center mb-6"
            >
              <Store className="h-5 w-5 mr-2" />
              피어몰 만들기
            </Button>
            
            <a href="#" className="story-link text-accent-200 flex items-center">
              가이드 보기
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>
          
          <div className="p-8">
            <h3 className="text-xl font-bold mb-4">간단한 4단계 프로세스</h3>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-bg-100 p-2 rounded-full mr-4">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="font-bold">{`${index + 1}. ${step.title}`}</h4>
                    <p className="text-sm text-text-200">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <CreatePeermallModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
};

export default CreatePeermall;
