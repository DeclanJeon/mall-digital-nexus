
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, Link2, FileText, Upload, Users, 
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from '@/components/ui/use-toast';

const ProductEcosystemSection = () => {
  const [activeTab, setActiveTab] = useState('supply-chain');

  const handleSave = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "생태계 관리 설정이 성공적으로 적용되었습니다.",
    });
  };
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Package className="mr-2 h-6 w-6" />
        제품 생태계 관리
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="supply-chain">
            <Users className="h-4 w-4 mr-2" />
            공급망 정보
          </TabsTrigger>
          <TabsTrigger value="transparency">
            <Upload className="h-4 w-4 mr-2" />
            투명성 정보
          </TabsTrigger>
          <TabsTrigger value="partnership">
            <Link2 className="h-4 w-4 mr-2" />
            파트너십 연결
          </TabsTrigger>
          <TabsTrigger value="product-history">
            <FileText className="h-4 w-4 mr-2" />
            제품 이력 조회
          </TabsTrigger>
        </TabsList>
        
        {/* 공급망 정보 */}
        <TabsContent value="supply-chain" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>공급망 정보 관리</CardTitle>
              <CardDescription>
                제품 관련 공급자, 제조사, 유통사 정보를 등록하고 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="supplier">
                  <AccordionTrigger className="text-md font-medium">
                    공급자 정보
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 p-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">한국 친환경 소재</p>
                          <p className="text-xs text-muted-foreground">원자재 공급</p>
                        </div>
                        <Button variant="outline" size="sm">수정</Button>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">유기농 섬유 파트너스</p>
                          <p className="text-xs text-muted-foreground">자재 가공</p>
                        </div>
                        <Button variant="outline" size="sm">수정</Button>
                      </div>
                      <Button className="w-full mt-2" variant="outline">
                        <Plus className="mr-1 h-4 w-4" /> 공급자 추가
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="manufacturer">
                  <AccordionTrigger className="text-md font-medium">
                    제조사 정보
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 p-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">동서 제조</p>
                          <p className="text-xs text-muted-foreground">의류 제조</p>
                        </div>
                        <Button variant="outline" size="sm">수정</Button>
                      </div>
                      <Button className="w-full mt-2" variant="outline">
                        <Plus className="mr-1 h-4 w-4" /> 제조사 추가
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="distributor">
                  <AccordionTrigger className="text-md font-medium">
                    유통사 정보
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 p-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">친환경 물류</p>
                          <p className="text-xs text-muted-foreground">국내 물류 담당</p>
                        </div>
                        <Button variant="outline" size="sm">수정</Button>
                      </div>
                      <Button className="w-full mt-2" variant="outline">
                        <Plus className="mr-1 h-4 w-4" /> 유통사 추가
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 투명성 정보 */}
        <TabsContent value="transparency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>투명성 정보 설정</CardTitle>
              <CardDescription>
                공개할 생산/유통 과정 정보(인증서, 검사 결과 등)를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">인증서 관리</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">유기농 인증서</p>
                        <p className="text-xs text-muted-foreground">유효기간: 2026-03-15</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">보기</Button>
                        <Button variant="outline" size="sm">삭제</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">품질 인증서</p>
                        <p className="text-xs text-muted-foreground">유효기간: 2026-05-20</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">보기</Button>
                        <Button variant="outline" size="sm">삭제</Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="mr-1 h-4 w-4" /> 인증서 업로드
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">검사 결과</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">원자재 안전성 검사</p>
                        <p className="text-xs text-muted-foreground">검사일: 2024-12-10</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">보기</Button>
                        <Button variant="outline" size="sm">삭제</Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="mr-1 h-4 w-4" /> 검사 결과 업로드
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 파트너십 연결 */}
        <TabsContent value="partnership" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>파트너십 연결</CardTitle>
              <CardDescription>
                협력 관계 피어몰 연결 및 정보 공유 범위를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">연결된 파트너</h3>
                <div className="space-y-3">
                  <div className="border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">친환경 소재 연구소</p>
                      <p className="text-xs text-muted-foreground">공급자 / 정보 공유: 제품 정보, 인증서</p>
                    </div>
                    <Button variant="outline" size="sm">관리</Button>
                  </div>
                  <div className="border rounded-md p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">에코 디자이너 그룹</p>
                      <p className="text-xs text-muted-foreground">협력사 / 정보 공유: 제품 디자인</p>
                    </div>
                    <Button variant="outline" size="sm">관리</Button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">새 파트너 연결</h3>
                  <div className="flex gap-3">
                    <Input placeholder="피어몰 이름 또는 ID 입력" className="flex-1" />
                    <Button variant="outline">검색</Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-3 mt-4">
                  <h4 className="font-medium mb-2">정보 공유 범위 기본 설정</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>제품 기본 정보</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>인증서 및 검사 결과</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>가격 정보</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>재고 정보</span>
                      <input type="checkbox" className="toggle" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 제품 이력 조회 */}
        <TabsContent value="product-history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>제품 이력 조회</CardTitle>
              <CardDescription>
                등록된 제품의 생산-유통-판매 단계별 이력을 추적하고 조회합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="flex gap-3 mb-4">
                  <Input placeholder="제품 코드 또는 이름 입력" className="flex-1" />
                  <Button variant="outline">검색</Button>
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-3">이력 조회 결과</h3>
                  <div className="border rounded-md p-3">
                    <p className="text-center text-muted-foreground">
                      제품을 검색하여 이력을 조회하세요.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">최근 조회 제품</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">유기농 코튼 티셔츠</p>
                      <p className="text-xs text-muted-foreground">제품코드: ECO-TS-001</p>
                    </div>
                    <Button variant="outline" size="sm">이력 보기</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">친환경 데님 청바지</p>
                      <p className="text-xs text-muted-foreground">제품코드: ECO-DN-003</p>
                    </div>
                    <Button variant="outline" size="sm">이력 보기</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>설정 저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ProductEcosystemSection;
