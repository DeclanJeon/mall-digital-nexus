import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, Phone, Mail, Settings, Users, ClipboardList, 
  Bell, ChevronDown, BarChart2, Plus
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

const CustomerSupportSection = () => {
  const [activeTab, setActiveTab] = useState('ticketing');

  const handleSave = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "고객 지원 설정이 성공적으로 적용되었습니다.",
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <MessageSquare className="mr-2 h-6 w-6" />
        고객 지원 관리
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="ticketing">
            <ClipboardList className="h-4 w-4 mr-2" />
            문의 접수 관리
          </TabsTrigger>
          <TabsTrigger value="faq">
            <Bell className="h-4 w-4 mr-2" />
            FAQ 관리
          </TabsTrigger>
          <TabsTrigger value="live-chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            실시간 상담 설정
          </TabsTrigger>
        </TabsList>

        {/* 문의 접수 관리 */}
        <TabsContent value="ticketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>문의 접수 채널 설정</CardTitle>
              <CardDescription>
                고객 문의를 접수할 채널을 설정하고 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="email-support" className="flex items-center space-x-2">
                    <Checkbox id="email-support" />
                    <span>이메일 문의 접수</span>
                  </label>
                  <Input type="email" id="email-support" placeholder="support@yourmall.com" className="w-64" />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="phone-support" className="flex items-center space-x-2">
                    <Checkbox id="phone-support" />
                    <span>전화 문의 접수</span>
                  </label>
                  <Input type="tel" id="phone-support" placeholder="02-1234-5678" className="w-64" />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="kakao-support" className="flex items-center space-x-2">
                    <Checkbox id="kakao-support" />
                    <span>카카오톡 상담</span>
                  </label>
                  <Input type="text" id="kakao-support" placeholder="카카오톡 채널 ID" className="w-64" />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ 관리 */}
        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>자주 묻는 질문(FAQ) 관리</CardTitle>
              <CardDescription>
                자주 묻는 질문과 답변을 등록하고 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="question1">
                  <AccordionTrigger className="text-md font-medium">
                    배송은 얼마나 걸리나요?
                  </AccordionTrigger>
                  <AccordionContent>
                    배송은 결제 완료 후 2~3일 정도 소요됩니다.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="question2">
                  <AccordionTrigger className="text-md font-medium">
                    교환/환불 정책은 어떻게 되나요?
                  </AccordionTrigger>
                  <AccordionContent>
                    제품에 하자가 있는 경우, 수령 후 7일 이내에 교환/환불이 가능합니다.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <Button variant="outline" className="w-full mt-4">
                <Plus className="mr-2 h-4 w-4" /> FAQ 추가
              </Button>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 실시간 상담 설정 */}
        <TabsContent value="live-chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>실시간 상담 설정</CardTitle>
              <CardDescription>
                실시간 상담 운영 시간 및 상담 가능 인원을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">운영 시간 설정</h3>
                  <div className="flex items-center space-x-4">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="시작 시간" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>시작 시간</SelectLabel>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="종료 시간" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>종료 시간</SelectLabel>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">상담 가능 인원</h3>
                  <Input type="number" placeholder="상담 가능 인원 수를 입력하세요" />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default CustomerSupportSection;
