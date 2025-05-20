
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { User, Info, Mail, Phone, MapPin, Building, Shield, Link, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BasicInfoSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("site-info");

  return (
    <Card className="p-6 bg-white/70">
      <div className="flex items-center mb-6">
        <User className="w-5 h-5 text-primary-300 mr-2" />
        <h2 className="text-lg font-bold text-primary-300">기본 정보</h2>
      </div>

      <Tabs defaultValue="site-info" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:w-[600px]">
          <TabsTrigger value="site-info">사이트 정보</TabsTrigger>
          <TabsTrigger value="contact">연락처</TabsTrigger>
          {/* <TabsTrigger value="authentication">인증 및 상태</TabsTrigger> */}
          {/* <TabsTrigger value="legal">법적 고지</TabsTrigger> */}
          {/* <TabsTrigger value="relationships">관계 설정</TabsTrigger> */}
        </TabsList>

        {/* 사이트 정보 탭 */}
        <TabsContent value="site-info" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-primary-200 mb-2">피어몰 이름</div>
              <div className="font-semibold text-text-100">피어스페이스 예시 사업장</div>
              
              <div className="text-sm text-primary-200 mt-4 mb-2">슬로건</div>
              <div className="text-text-100">함께 성장하는 지식 커뮤니티</div>
              
              <div className="text-sm text-primary-200 mt-4 mb-2">고유 ID</div>
              <div className="text-text-100 bg-primary-100/20 px-3 py-1 rounded inline-block">peer-space-example</div>
            </div>
            
            <div>
              <div className="text-sm text-primary-200 mb-2">설명</div>
              <div className="text-text-200">이곳에 피어스페이스의 간단한 소개 또는 설명이 들어갑니다. 방문자들에게 보여지는 주요 소개글입니다.</div>
              
              <div className="text-sm text-primary-200 mt-4 mb-2">대표 카테고리</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary-100/30 px-2 py-1 rounded text-xs">교육</span>
                <span className="bg-primary-100/30 px-2 py-1 rounded text-xs">IT</span>
                <span className="bg-primary-100/30 px-2 py-1 rounded text-xs">커뮤니티</span>
              </div>
              
              <div className="text-sm text-primary-200 mt-4 mb-2">검색 태그</div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary-100/30 px-2 py-1 rounded text-xs">프로그래밍</span>
                <span className="bg-primary-100/30 px-2 py-1 rounded text-xs">코딩</span>
                <span className="bg-primary-100/30 px-2 py-1 rounded text-xs">개발자</span>
                <span className="bg-primary-100/30 px-2 py-1 rounded text-xs">Python</span>
                <span className="bg-primary-100/30 px-2 py-1 rounded text-xs">웹개발</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button>정보 수정</Button>
          </div>
        </TabsContent>

        {/* 연락처 탭 */}
        <TabsContent value="contact" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-primary-200" />
                <div className="text-sm text-primary-200">대표자명</div>
                <div className="font-semibold text-text-100">홍길동</div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-4 w-4 text-primary-200" />
                <div className="text-sm text-primary-200">이메일</div>
                <div className="font-semibold text-text-100">contact@peerspace-example.com</div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-4 w-4 text-primary-200" />
                <div className="text-sm text-primary-200">전화번호</div>
                <div className="font-semibold text-text-100">02-123-4567</div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-primary-200" />
                <div className="text-sm text-primary-200">피어넘버</div>
                <div className="font-semibold text-text-100">P123456789</div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-primary-200" />
                <div className="text-sm text-primary-200">사업장 주소</div>
                <div className="font-semibold text-text-100">서울시 강남구 테헤란로 123 피어빌딩 4층</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button>연락처 수정</Button>
          </div>
        </TabsContent>

        {/* 인증 및 상태 탭 */}
        <TabsContent value="authentication" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4 border border-green-200 bg-green-50/50">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-700">인증 상태</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>사업자 등록</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">인증 완료</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>통신판매업</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">인증 완료</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>본인 인증</span>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full">인증 완료</span>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-primary-200">
                마지막 업데이트: 2025-03-15
              </div>
            </Card>
            
            <Card className="p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-5 w-5 text-primary-300" />
                <span className="font-semibold">피어몰 상태</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span>공개 상태</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">공개</span>
                    <Button variant="outline" size="sm">변경</Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span>신뢰도 점수</span>
                  <span className="font-semibold">87 / 100</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span>계정 등급</span>
                  <span className="bg-accent-100 text-accent-200 px-2 py-0.5 rounded-full">프리미엄</span>
                </div>
              </div>
              
              <Alert className="mt-4 bg-blue-50/50">
                <AlertDescription className="text-xs">
                  피어몰 인증 상태와 신뢰도는 매주 업데이트됩니다.
                </AlertDescription>
              </Alert>
            </Card>
          </div>
        </TabsContent>

        {/* 법적 고지 탭 */}
        <TabsContent value="legal" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-primary-300" />
                <span className="font-semibold">개인정보 처리방침</span>
              </div>
              <div className="text-sm text-primary-200 mb-2">마지막 업데이트: 2025-02-10</div>
              <div className="text-text-200 text-sm mb-4 bg-gray-50 p-3 rounded h-32 overflow-y-auto">
                개인정보 처리방침 내용이 이곳에 표시됩니다. 실제로는 더 많은 내용이 들어갑니다.
                개인정보 수집 목적, 항목, 보유기간, 파기절차 등의 정보가 포함됩니다.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">수정</Button>
                <Button variant="outline" size="sm">미리보기</Button>
              </div>
            </Card>
            
            <Card className="p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-primary-300" />
                <span className="font-semibold">이용약관</span>
              </div>
              <div className="text-sm text-primary-200 mb-2">마지막 업데이트: 2025-02-10</div>
              <div className="text-text-200 text-sm mb-4 bg-gray-50 p-3 rounded h-32 overflow-y-auto">
                이용약관 내용이 이곳에 표시됩니다. 실제로는 더 많은 내용이 들어갑니다.
                서비스 이용조건, 권리 및 의무, 책임 제한, 분쟁 해결 등의 정보가 포함됩니다.
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">수정</Button>
                <Button variant="outline" size="sm">미리보기</Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* 관계 설정 탭 */}
        <TabsContent value="relationships" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <Building className="h-5 w-5 text-primary-300" />
                <span className="font-semibold">스폰서</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-200 rounded-full flex items-center justify-center text-white">
                      C
                    </div>
                    <div>
                      <div className="font-medium">클솔 패밀리</div>
                      <div className="text-xs text-primary-200">기본 스폰서</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">상세 보기</Button>
                </div>
              </div>
              <div className="mt-4">
                <Button size="sm" variant="outline">스폰서 변경 요청</Button>
              </div>
            </Card>
            
            <Card className="p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-primary-300" />
                <span className="font-semibold">에이전트</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-200 rounded-full flex items-center justify-center text-white">
                      K
                    </div>
                    <div>
                      <div className="font-medium">김에이전트</div>
                      <div className="text-xs text-primary-200">등급: 골드</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">상세 보기</Button>
                </div>
              </div>
              <div className="mt-4 text-sm text-primary-200">
                에이전트는 피어몰 운영 및 관리를 도와드리는 전문가입니다.
              </div>
              <div className="mt-4">
                <Button size="sm">에이전트 변경 요청</Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-4 text-xs text-primary-200 flex items-center">
        <Info className="inline mr-1 h-4 w-4 text-primary-200" />
        <span>이 정보는 피어스페이스 프로필과 관리 시스템에 사용됩니다. 정확한 정보 입력이 중요합니다.</span>
      </div>
    </Card>
  );
};

export default BasicInfoSection;
