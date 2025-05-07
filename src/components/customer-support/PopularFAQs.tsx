
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PopularFAQs = () => {
  const faqs = [
    {
      question: '피어넘버는 어떻게 발급받나요?',
      answer: '피어넘버는 계정 생성 시 자동으로 발급됩니다. 내 정보 페이지에서 확인하실 수 있습니다.',
      isPopular: true,
      viewCount: 1245,
      helpfulCount: 890
    },
    {
      question: '추천인 등록은 어떻게 하나요?',
      answer: '추천인 등록은 회원가입 시 또는 내 정보 > 추천인 관리 메뉴에서 추천인 코드를 입력하여 등록할 수 있습니다.',
      isPopular: true,
      viewCount: 987,
      helpfulCount: 712
    },
    {
      question: '피어몰을 개설한 후 수정할 수 있나요?',
      answer: '네, 피어몰 관리 페이지에서 언제든지 피어몰의 정보, 디자인, 카테고리 등을 수정할 수 있습니다.',
      isPopular: false,
      viewCount: 756,
      helpfulCount: 543
    }
  ];
  
  return (
    <div className="bg-white rounded-lg border border-[#cccbc8] shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">자주 묻는 질문</h2>
        <Button variant="outline" className="text-[#71c4ef] border-[#71c4ef]">
          더 보기
        </Button>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="hover:bg-[#f5f4f1] px-4 py-3 rounded-md">
              <div className="flex items-center gap-2 text-left">
                <span>{faq.question}</span>
                {faq.isPopular && (
                  <Badge variant="outline" className="ml-2 bg-[#d4eaf7] text-[#00668c]">인기</Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <p className="text-gray-600 mb-3">{faq.answer}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <span>조회 {faq.viewCount}</span>
                  <span className="mx-2">•</span>
                  <span>도움됨 {faq.helpfulCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">도움이 되었나요?</span>
                  <Button variant="outline" size="sm" className="h-8 px-2">👍</Button>
                  <Button variant="outline" size="sm" className="h-8 px-2">👎</Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default PopularFAQs;
