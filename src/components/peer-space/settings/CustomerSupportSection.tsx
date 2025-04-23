
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, FileText, Users, Upload, Plus,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CustomerSupportSection = () => {
  const [activeTab, setActiveTab] = useState('inquiry-channels');

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
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="inquiry-channels">
            <MessageSquare className="h-4 w-4 mr-2" />
            문의 응대 채널
          </TabsTrigger>
          <TabsTrigger value="faq">
            <FileText className="h-4 w-4 mr-2" />
            FAQ 관리
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <Users className="h-4 w-4 mr-2" />
            피드백 수집
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Upload className="h-4 w-4 mr-2" />
            지원 리소스
          </TabsTrigger>
        </TabsList>
        
        {/* 문의 응대 채널 */}
        <TabsContent value="inquiry-channels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>문의 응대 채널 설정</CardTitle>
              <CardDescription>
                피어몰 전용 문의 채널 활성화 및 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">활성화된 채널</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">내부 메시징 시스템</p>
                      <p className="text-xs text-muted-foreground">상태: 활성화 / 응답 담당: 관리자</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">설정</Button>
                      <Button variant="outline" size="sm">비활성화</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">고객 센터 이메일</p>
                      <p className="text-xs text-muted-foreground">상태: 활성화 / 주소: support@example.com</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">설정</Button>
                      <Button variant="outline" size="sm">비활성화</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">카카오톡 채널</p>
                      <p className="text-xs text-muted-foreground">상태: 활성화 / 계정: @peermall_support</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">설정</Button>
                      <Button variant="outline" size="sm">비활성화</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">새 채널 활성화</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">채널 유형</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="채널 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="chat">실시간 채팅</SelectItem>
                        <SelectItem value="phone">전화 상담</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="custom">사용자 정의</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">채널 이름</label>
                    <Input placeholder="채널 이름을 입력하세요" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">연락처/ID</label>
                    <Input placeholder="연락처 또는 ID를 입력하세요" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">운영 시간</label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="예: 09:00-18:00" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="요일 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekdays">평일</SelectItem>
                          <SelectItem value="weekend">주말</SelectItem>
                          <SelectItem value="all">매일</SelectItem>
                          <SelectItem value="custom">사용자 정의</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">담당자</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="담당자를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">관리자</SelectItem>
                        <SelectItem value="cs">고객 지원팀</SelectItem>
                        <SelectItem value="sales">영업팀</SelectItem>
                        <SelectItem value="tech">기술 지원팀</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full mt-2">채널 추가</Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">자동 응답 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>자동 응답 사용</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">자동 응답 메시지</label>
                    <textarea 
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      defaultValue="안녕하세요! 피어몰 고객지원입니다. 문의해주셔서 감사합니다. 최대한 빠르게 답변 드리겠습니다. 운영 시간: 평일 09:00-18:00"
                    />
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>운영 시간 외 별도 메시지</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">운영 시간 외 메시지</label>
                    <textarea 
                      className="w-full min-h-[80px] p-2 border rounded-md"
                      defaultValue="현재 운영 시간이 아닙니다. 다음 영업일에 순차적으로 답변 드리겠습니다. 감사합니다."
                    />
                  </div>
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
              <CardTitle>FAQ 관리</CardTitle>
              <CardDescription>
                자주 묻는 질문 및 답변을 등록, 카테고리 분류, 수정/삭제합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">FAQ 카테고리</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>주문 및 결제</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>배송 및 교환/반품</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>회원 정보</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>제품 정보</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Input placeholder="새 카테고리 이름" className="flex-1" />
                  <Button variant="outline" size="sm">추가</Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">자주 묻는 질문</h3>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="faq-1">
                    <AccordionTrigger className="text-md font-medium">
                      배송은 얼마나 걸리나요?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-2 space-y-2">
                        <p className="text-sm">국내 배송은 주문 확인 후 1-3일 이내에 발송되며, 발송 후 1-2일 내로 수령 가능합니다. 제주 및 도서산간 지역은 추가로 1-2일 소요될 수 있습니다.</p>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">수정</Button>
                          <Button variant="outline" size="sm">삭제</Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2">
                    <AccordionTrigger className="text-md font-medium">
                      교환/반품은 어떻게 신청하나요?
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-2 space-y-2">
                        <p className="text-sm">마이페이지 > 주문내역에서 교환/반품을 원하는 상품을 선택하여 신청할 수 있습니다. 상품 수령 후 7일 이내에 신청 가능하며, 제품의 하자가 있는 경우에만 교환/반품 배송비를 피어몰에서 부담합니다.</p>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">수정</Button>
                          <Button variant="outline" size="sm">삭제</Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">새 FAQ 등록</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">카테고리</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">주문 및 결제</SelectItem>
                        <SelectItem value="delivery">배송 및 교환/반품</SelectItem>
                        <SelectItem value="member">회원 정보</SelectItem>
                        <SelectItem value="product">제품 정보</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">질문</label>
                    <Input placeholder="자주 묻는 질문을 입력하세요" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">답변</label>
                    <textarea 
                      className="w-full min-h-[120px] p-2 border rounded-md"
                      placeholder="질문에 대한 답변을 입력하세요"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked /> 
                    <span className="text-sm">메인 FAQ 페이지에 표시</span>
                  </div>
                  <Button className="w-full">FAQ 추가</Button>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 피드백 수집 */}
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>피드백 수집 설정</CardTitle>
              <CardDescription>
                사용자 피드백 접수 양식 커스터마이징 및 수집 채널을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">피드백 양식 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>피드백 양식 활성화</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">피드백 양식 제목</label>
                    <Input defaultValue="피어몰 서비스 개선을 위한 의견을 들려주세요" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">안내 메시지</label>
                    <textarea 
                      className="w-full min-h-[80px] p-2 border rounded-md"
                      defaultValue="보내주신 의견은 더 나은 서비스를 위해 소중히 활용하겠습니다. 구체적인 의견을 남겨주시면 큰 도움이 됩니다."
                    />
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">피드백 항목 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked /> 
                      <span>이름</span>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="required">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">필수</SelectItem>
                          <SelectItem value="optional">선택</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked /> 
                      <span>이메일</span>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="required">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">필수</SelectItem>
                          <SelectItem value="optional">선택</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked /> 
                      <span>피드백 유형</span>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="required">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">필수</SelectItem>
                          <SelectItem value="optional">선택</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked /> 
                      <span>만족도 평가</span>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="required">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">필수</SelectItem>
                          <SelectItem value="optional">선택</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked /> 
                      <span>상세 의견</span>
                    </div>
                    <div className="flex gap-2">
                      <Select defaultValue="required">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="상태" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="required">필수</SelectItem>
                          <SelectItem value="optional">선택</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> 항목 추가
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">피드백 알림 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>새 피드백 이메일 알림</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">알림 수신 이메일</label>
                    <Input defaultValue="feedback@example.com" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>제품별 담당자 자동 분류</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 지원 리소스 */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>지원 리소스 관리</CardTitle>
              <CardDescription>
                도움말 문서, 튜토리얼 비디오 등 지원 자료를 업로드 및 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">도움말 문서</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">구매 가이드</p>
                      <p className="text-xs text-muted-foreground">최종 업데이트: 2024-12-10</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">회원 가입 안내</p>
                      <p className="text-xs text-muted-foreground">최종 업데이트: 2024-11-15</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">결제 방법 안내</p>
                      <p className="text-xs text-muted-foreground">최종 업데이트: 2024-09-20</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Plus className="mr-1 h-4 w-4" /> 문서 추가
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">튜토리얼 비디오</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">사이트 이용 방법</p>
                      <p className="text-xs text-muted-foreground">유형: YouTube / 길이: 5:32</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">상품 검색 및 필터링</p>
                      <p className="text-xs text-muted-foreground">유형: 임베디드 / 길이: 3:15</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Plus className="mr-1 h-4 w-4" /> 비디오 추가
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">새 자료 업로드</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">자료 유형</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="자료 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">문서</SelectItem>
                        <SelectItem value="video">비디오</SelectItem>
                        <SelectItem value="image">이미지/인포그래픽</SelectItem>
                        <SelectItem value="link">외부 링크</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">제목</label>
                    <Input placeholder="자료의 제목을 입력하세요" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">설명</label>
                    <textarea 
                      className="w-full min-h-[80px] p-2 border rounded-md"
                      placeholder="자료에 대한 간략한 설명을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">카테고리</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="카테고리 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="getting-started">시작하기</SelectItem>
                        <SelectItem value="account">계정 관리</SelectItem>
                        <SelectItem value="shopping">쇼핑 가이드</SelectItem>
                        <SelectItem value="shipping">배송 및 반품</SelectItem>
                        <SelectItem value="troubleshooting">문제 해결</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">파일 업로드</label>
                    <div className="flex gap-2">
                      <Input type="file" className="flex-1" />
                      <Button variant="outline" size="sm">업로드</Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked /> 
                    <span className="text-sm">메인 헬프 센터에 표시</span>
                  </div>
                  <Button className="w-full">자료 추가</Button>
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
