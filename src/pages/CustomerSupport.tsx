
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageSquare, User, Star, Bell, Mail, Headphones, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import CustomerSupportHeader from '@/components/customer-support/CustomerSupportHeader';
import CategoryCards from '@/components/customer-support/CategoryCards';
import PopularFAQs from '@/components/customer-support/PopularFAQs';
import SupportChannels from '@/components/customer-support/SupportChannels';
import SupportSidebar from '@/components/customer-support/SupportSidebar';
import InquiryForm from '@/components/customer-support/InquiryForm';
import MyInquiries from '@/components/customer-support/MyInquiries';
import TIESupport from '@/components/customer-support/TIESupport';

const CustomerSupport = () => {
  const [activeTab, setActiveTab] = useState('main');

  return (
    // <div className="min-h-screen bg-[#f5f4f1]">
    <div className="bg-[#f5f4f1]">
      <CustomerSupportHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-grow">
            <Tabs defaultValue="main" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6 grid grid-cols-2 h-auto bg-[#d4eaf7]">
                <TabsTrigger value="main" className="py-3 data-[state=active]:bg-[#71c4ef] data-[state=active]:text-white">
                  메인
                </TabsTrigger>
                {/* <TabsTrigger value="faq" className="py-3 data-[state=active]:bg-[#71c4ef] data-[state=active]:text-white">
                  자주 묻는 질문
                </TabsTrigger> */}
                <TabsTrigger value="inquiry" className="py-3 data-[state=active]:bg-[#71c4ef] data-[state=active]:text-white">
                  1:1 문의
                </TabsTrigger>
                {/* <TabsTrigger value="my-inquiries" className="py-3 data-[state=active]:bg-[#71c4ef] data-[state=active]:text-white">
                  문의 내역
                </TabsTrigger> */}
              </TabsList>
              
              <TabsContent value="main" className="mt-0">
                {/* <CategoryCards /> */}
                {/* <PopularFAQs /> */}
                <SupportChannels onSwitchTab={setActiveTab} />
              </TabsContent>
              
              <TabsContent value="faq" className="mt-0">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                  <h2 className="text-2xl font-semibold mb-4">자주 묻는 질문</h2>
                  <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="justify-start">계정 관리</Button>
                    <Button variant="outline" className="justify-start">피어몰 운영</Button>
                    <Button variant="outline" className="justify-start">TIE/VI 이용</Button>
                    <Button variant="outline" className="justify-start">광고 센터</Button>
                    <Button variant="outline" className="justify-start">추천인 시스템</Button>
                    <Button variant="outline" className="justify-start">결제/환불</Button>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="hover:bg-[#f5f4f1] px-4 py-3 rounded-md">
                        <div className="flex items-center gap-2 text-left">
                          <span>피어몰 계정을 삭제하려면 어떻게 해야 하나요?</span>
                          <Badge variant="outline" className="ml-2 bg-[#d4eaf7] text-[#00668c]">인기</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <p className="text-gray-600 mb-3">
                          피어몰 계정 삭제는 설정 메뉴의 계정 관리에서 진행할 수 있습니다. 계정을 삭제하기 전에 다음 사항을 확인해 주세요:
                        </p>
                        <ul className="list-disc pl-5 mb-4 text-gray-600">
                          <li>활성화된 피어몰이 있는 경우, 먼저 피어몰을 폐쇄해야 합니다.</li>
                          <li>미결제된 대금이 있는 경우 정산을 완료해야 합니다.</li>
                          <li>데이터 백업: 삭제 후에는 데이터를 복구할 수 없습니다.</li>
                        </ul>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">관련 FAQ</Button>
                            <Button variant="ghost" size="sm" className="text-[#71c4ef]">도움말 보기</Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">도움이 되었나요?</span>
                            <Button variant="outline" size="sm" className="h-8 px-2">👍</Button>
                            <Button variant="outline" size="sm" className="h-8 px-2">👎</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-2">
                      <AccordionTrigger className="hover:bg-[#f5f4f1] px-4 py-3 rounded-md">
                        <div className="flex items-center gap-2 text-left">
                          <span>피어넘버는 어디에서 확인할 수 있나요?</span>
                          <Badge variant="outline" className="ml-2 bg-[#d4eaf7] text-[#00668c]">인기</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <p className="text-gray-600 mb-3">
                          피어넘버는 내 정보 페이지에서 확인하실 수 있습니다. 또는 메인 화면에서 프로필 아이콘을 클릭한 후 '내 정보' 메뉴를 통해 접근할 수 있습니다.
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">관련 FAQ</Button>
                            <Button variant="ghost" size="sm" className="text-[#71c4ef]">도움말 보기</Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">도움이 되었나요?</span>
                            <Button variant="outline" size="sm" className="h-8 px-2">👍</Button>
                            <Button variant="outline" size="sm" className="h-8 px-2">👎</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-3">
                      <AccordionTrigger className="hover:bg-[#f5f4f1] px-4 py-3 rounded-md">
                        <div className="flex items-center gap-2 text-left">
                          <span>TIE 지원 서비스는 어떻게 이용하나요?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <p className="text-gray-600 mb-3">
                          TIE 지원 서비스는 복잡한 문제 해결을 위한 실시간 상담 서비스입니다. 고객센터 메인 페이지의 'TIE 지원 요청' 버튼을 통해 서비스를 이용할 수 있습니다.
                        </p>
                        <p className="text-gray-600 mb-3">
                          서비스 이용 가능 시간: 평일 오전 9시 ~ 오후 6시
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">관련 FAQ</Button>
                            <Button variant="ghost" size="sm" className="text-[#71c4ef]">도움말 보기</Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">도움이 되었나요?</span>
                            <Button variant="outline" size="sm" className="h-8 px-2">👍</Button>
                            <Button variant="outline" size="sm" className="h-8 px-2">👎</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="item-4">
                      <AccordionTrigger className="hover:bg-[#f5f4f1] px-4 py-3 rounded-md">
                        <div className="flex items-center gap-2 text-left">
                          <span>피어몰에 등록한 상품이 노출되지 않는 이유는 무엇인가요?</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-3">
                        <p className="text-gray-600 mb-3">
                          상품이 노출되지 않는 이유는 다음과 같은 경우가 있습니다:
                        </p>
                        <ul className="list-disc pl-5 mb-4 text-gray-600">
                          <li>상품 승인 대기 상태인 경우</li>
                          <li>정책 위반으로 인한 제한</li>
                          <li>카테고리 설정 오류</li>
                          <li>필수 정보 미입력</li>
                          <li>이미지 품질 문제</li>
                        </ul>
                        <p className="text-gray-600 mb-3">
                          피어몰 관리 페이지에서 상품 상태를 확인하시고, 문제가 지속될 경우 1:1 문의를 이용해 주세요.
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">관련 FAQ</Button>
                            <Button variant="ghost" size="sm" className="text-[#71c4ef]">도움말 보기</Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">도움이 되었나요?</span>
                            <Button variant="outline" size="sm" className="h-8 px-2">👍</Button>
                            <Button variant="outline" size="sm" className="h-8 px-2">👎</Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="inquiry" className="mt-0">
                <InquiryForm />
              </TabsContent>
              
              <TabsContent value="my-inquiries" className="mt-0">
                <MyInquiries />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar - only shown on desktop */}
          {/* <div className="hidden lg:block w-80">
            <SupportSidebar onSwitchTab={setActiveTab} />
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default CustomerSupport;
