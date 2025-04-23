
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Percent, Image, Users, FileText, Calendar, Plus,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MarketingPromotionSection = () => {
  const [activeTab, setActiveTab] = useState('promotions');

  const handleSave = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "마케팅 및 홍보 설정이 성공적으로 적용되었습니다.",
    });
  };
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Percent className="mr-2 h-6 w-6" />
        마케팅 및 홍보 관리
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="promotions">
            <Percent className="h-4 w-4 mr-2" />
            프로모션 설정
          </TabsTrigger>
          <TabsTrigger value="social-media">
            <Image className="h-4 w-4 mr-2" />
            소셜 미디어
          </TabsTrigger>
          <TabsTrigger value="referral">
            <Users className="h-4 w-4 mr-2" />
            추천 프로그램
          </TabsTrigger>
          <TabsTrigger value="seo">
            <FileText className="h-4 w-4 mr-2" />
            SEO 설정
          </TabsTrigger>
        </TabsList>
        
        {/* 프로모션 설정 */}
        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>프로모션 관리</CardTitle>
              <CardDescription>
                할인 이벤트 생성, 쿠폰 발급, 기간 한정 세일 등을 설정하고 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">할인 이벤트</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">여름 시즌 할인</p>
                      <p className="text-xs text-muted-foreground">기간: 2025-06-01 ~ 2025-07-15</p>
                      <p className="text-xs text-muted-foreground">대상: 여름 의류 전체 / 할인율: 20%</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">신규 가입자 특별 할인</p>
                      <p className="text-xs text-muted-foreground">기간: 상시</p>
                      <p className="text-xs text-muted-foreground">대상: 첫 주문 / 할인율: 10%</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> 할인 이벤트 추가
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">쿠폰 관리</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">웰컴 쿠폰</p>
                      <p className="text-xs text-muted-foreground">코드: WELCOME2025 / 할인: 5,000원</p>
                      <p className="text-xs text-muted-foreground">조건: 3만원 이상 구매 / 유효기간: 발급일로부터 30일</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> 쿠폰 추가
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">기간 한정 세일</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">플래시 세일</p>
                      <p className="text-xs text-muted-foreground">기간: 2025-05-01 10:00 ~ 2025-05-01 22:00</p>
                      <p className="text-xs text-muted-foreground">대상: 특가 상품 / 할인율: 40%</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">수정</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> 기간 한정 세일 추가
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 소셜 미디어 연동 */}
        <TabsContent value="social-media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>소셜 미디어 연동</CardTitle>
              <CardDescription>
                피어몰 콘텐츠를 자동으로 공유할 소셜 미디어 계정을 연동합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">연동된 계정</h3>
                <div className="space-y-3">
                  <div className="border rounded-md p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white p-1 rounded mr-3 w-10 h-10 flex items-center justify-center">I</div>
                      <div>
                        <p className="font-medium">인스타그램</p>
                        <p className="text-xs text-muted-foreground">@ecofriendly_peermall</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">설정</Button>
                      <Button variant="outline" size="sm">연결 해제</Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="bg-sky-400 text-white p-1 rounded mr-3 w-10 h-10 flex items-center justify-center">T</div>
                      <div>
                        <p className="font-medium">X (트위터)</p>
                        <p className="text-xs text-muted-foreground">@eco_peermall</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">설정</Button>
                      <Button variant="outline" size="sm">연결 해제</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 mt-4">
                  <h3 className="font-medium mb-3">소셜 미디어 계정 연결</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="bg-red-500 text-white p-1 rounded mr-3 w-10 h-10 flex items-center justify-center">Y</div>
                      <div className="mr-auto">
                        <p className="font-medium">유튜브</p>
                        <p className="text-xs text-muted-foreground">연결되지 않음</p>
                      </div>
                      <Button variant="outline" size="sm">연결</Button>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-green-500 text-white p-1 rounded mr-3 w-10 h-10 flex items-center justify-center">N</div>
                      <div className="mr-auto">
                        <p className="font-medium">네이버 블로그</p>
                        <p className="text-xs text-muted-foreground">연결되지 않음</p>
                      </div>
                      <Button variant="outline" size="sm">연결</Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 mt-4">
                  <h3 className="font-medium mb-3">자동 공유 설정</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>신상품 등록 시 자동 공유</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>이벤트 등록 시 자동 공유</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between border-b pb-2">
                      <span>프로모션 시작 시 자동 공유</span>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>주간 베스트 상품 자동 공유</span>
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
        
        {/* 추천 프로그램 */}
        <TabsContent value="referral" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>추천 프로그램 설정</CardTitle>
              <CardDescription>
                추천인/피추천인에게 제공될 보상 및 조건을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">추천 프로그램 활성화</h3>
                <div className="flex items-center justify-between mb-4">
                  <span>추천 프로그램 사용</span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    추천 프로그램을 활성화하면 회원들이 자신만의 추천 코드를 생성하고 공유할 수 있습니다.
                    추천을 통해 신규 가입한 사용자와 추천인 모두에게 혜택이 제공됩니다.
                  </p>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">추천인 보상</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">보상 유형</label>
                    <Select defaultValue="point">
                      <SelectTrigger>
                        <SelectValue placeholder="보상 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="point">포인트</SelectItem>
                        <SelectItem value="coupon">쿠폰</SelectItem>
                        <SelectItem value="percent">구매 금액 비율</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">보상 금액/비율</label>
                    <Input type="number" defaultValue="3000" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">지급 조건</label>
                    <Select defaultValue="first-purchase">
                      <SelectTrigger>
                        <SelectValue placeholder="지급 조건 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="signup">피추천인 가입 즉시</SelectItem>
                        <SelectItem value="first-purchase">피추천인 첫 구매 시</SelectItem>
                        <SelectItem value="minimum-purchase">피추천인 일정 금액 이상 구매 시</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">피추천인 보상</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">보상 유형</label>
                    <Select defaultValue="coupon">
                      <SelectTrigger>
                        <SelectValue placeholder="보상 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="point">포인트</SelectItem>
                        <SelectItem value="coupon">쿠폰</SelectItem>
                        <SelectItem value="percent">구매 금액 할인율</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">보상 내용</label>
                    <Input type="text" defaultValue="5,000원 할인 쿠폰" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">유효 기간</label>
                    <Select defaultValue="30days">
                      <SelectTrigger>
                        <SelectValue placeholder="유효 기간 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">7일</SelectItem>
                        <SelectItem value="14days">14일</SelectItem>
                        <SelectItem value="30days">30일</SelectItem>
                        <SelectItem value="90days">90일</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* SEO 설정 */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO 설정</CardTitle>
              <CardDescription>
                피어몰의 검색 엔진 최적화를 위한 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">페이지 제목</label>
                  <Input defaultValue="에코 친환경 의류 - 유기농 소재로 만든 지속 가능한 패션" />
                  <p className="text-xs text-muted-foreground mt-1">
                    검색 결과에 표시될 페이지 제목입니다. 60자 이내로 작성하세요.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">메타 설명</label>
                  <textarea 
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    defaultValue="100% 유기농 소재로 제작된 친환경 의류 브랜드입니다. 지속 가능한 패션을 추구하며 사회적 가치를 실현합니다. 에코 의류 컬렉션을 지금 확인하세요."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    검색 결과에 표시될 설명입니다. 160자 이내로 작성하세요.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">메타 키워드</label>
                  <Input defaultValue="친환경 의류, 유기농 의류, 지속가능한 패션, 에코 패션, 그린 라이프스타일" />
                  <p className="text-xs text-muted-foreground mt-1">
                    쉼표로 구분된 키워드를 입력하세요.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">대표 URL</label>
                  <Input defaultValue="https://eco-fashion.peermall.com" />
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">사이트맵 관리</h3>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm">사이트맵 자동 생성</p>
                      <p className="text-xs text-muted-foreground">콘텐츠가 업데이트될 때마다 사이트맵을 자동으로 생성합니다.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">사이트맵 수동 생성</Button>
                    <Button variant="outline" size="sm" className="flex-1">검색 엔진에 제출</Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-3">소셜 미디어 메타 태그</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-1">Open Graph 제목</label>
                      <Input defaultValue="에코 친환경 의류 | 지구를 생각하는 패션" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Open Graph 설명</label>
                      <Input defaultValue="지속 가능한 유기농 소재로 제작된 에코 패션 브랜드. 환경을 생각하는 당신을 위한 컬렉션을 만나보세요." />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Open Graph 이미지</label>
                      <div className="flex gap-2">
                        <Input type="file" className="flex-1" />
                        <Button variant="outline" size="sm">업로드</Button>
                      </div>
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
      </Tabs>
    </section>
  );
};

export default MarketingPromotionSection;
