
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Map, Tag, Calendar, Plus,
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const LocationServiceSection = () => {
  const [activeTab, setActiveTab] = useState('map-settings');

  const handleSave = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "위치 기반 서비스 설정이 성공적으로 적용되었습니다.",
    });
  };
  
  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <MapPin className="mr-2 h-6 w-6" />
        위치 기반 서비스 관리
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="map-settings">
            <Map className="h-4 w-4 mr-2" />
            지도 표시 설정
          </TabsTrigger>
          <TabsTrigger value="region-targeting">
            <Tag className="h-4 w-4 mr-2" />
            지역 타겟 설정
          </TabsTrigger>
          <TabsTrigger value="local-events">
            <Calendar className="h-4 w-4 mr-2" />
            로컬 이벤트
          </TabsTrigger>
        </TabsList>
        
        {/* 지도 표시 설정 */}
        <TabsContent value="map-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>지도 표시 설정</CardTitle>
              <CardDescription>
                피어몰 관련 실제 매장, 이벤트 장소 등 위치 정보를 등록하고 지도에 표시합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">등록된 위치</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">본점</p>
                      <p className="text-xs text-muted-foreground">서울특별시 강남구 테헤란로 123</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">강남 플래그십 스토어</p>
                      <p className="text-xs text-muted-foreground">서울특별시 강남구 가로수길 45</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">부산 매장</p>
                      <p className="text-xs text-muted-foreground">부산광역시 해운대구 센텀시티로 97</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">새 위치 등록</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">장소 이름</label>
                    <Input placeholder="장소 이름을 입력하세요" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">주소</label>
                    <div className="flex gap-2">
                      <Input placeholder="주소를 입력하세요" className="flex-1" />
                      <Button variant="outline" size="sm">검색</Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">설명</label>
                    <textarea 
                      className="w-full min-h-[80px] p-2 border rounded-md"
                      placeholder="장소에 대한 설명을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">분류</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="분류를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="store">매장</SelectItem>
                        <SelectItem value="event">이벤트 장소</SelectItem>
                        <SelectItem value="pickup">픽업 장소</SelectItem>
                        <SelectItem value="partner">파트너사</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Input type="file" className="flex-1" />
                    <Button variant="outline" size="sm">사진 업로드</Button>
                  </div>
                </div>
                <Button className="mt-4">위치 등록</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">지도 표시 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>기본 지도 표시</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>모바일에서 지도 표시</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>지도 상단에 검색 필터 표시</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>방문자 위치 기반 가까운 매장 추천</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleSave}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* 지역 타겟 설정 */}
        <TabsContent value="region-targeting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>지역 타겟 설정</CardTitle>
              <CardDescription>
                특정 지역 방문자 대상 맞춤 콘텐츠 노출 또는 프로모션 적용을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">지역별 맞춤 콘텐츠</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">서울 지역 배너</p>
                      <p className="text-xs text-muted-foreground">대상: 서울 전체 / 콘텐츠: 서울 한정 이벤트 배너</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">부산 지역 특별 할인</p>
                      <p className="text-xs text-muted-foreground">대상: 부산 광역시 / 콘텐츠: 부산 매장 오픈 기념 할인</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">편집</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> 지역별 콘텐츠 추가
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">새 지역 타겟 설정</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">타겟 이름</label>
                    <Input placeholder="타겟 이름을 입력하세요" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">대상 지역</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="지역을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seoul">서울특별시</SelectItem>
                        <SelectItem value="busan">부산광역시</SelectItem>
                        <SelectItem value="incheon">인천광역시</SelectItem>
                        <SelectItem value="daegu">대구광역시</SelectItem>
                        <SelectItem value="gwangju">광주광역시</SelectItem>
                        <SelectItem value="daejeon">대전광역시</SelectItem>
                        <SelectItem value="ulsan">울산광역시</SelectItem>
                        <SelectItem value="jeju">제주특별자치도</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">상세 지역(선택)</label>
                    <Input placeholder="예: 강남구, 서초구" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">콘텐츠 유형</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="콘텐츠 유형을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">배너</SelectItem>
                        <SelectItem value="promotion">프로모션</SelectItem>
                        <SelectItem value="product">맞춤 상품</SelectItem>
                        <SelectItem value="event">이벤트 정보</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">콘텐츠 설명</label>
                    <textarea 
                      className="w-full min-h-[80px] p-2 border rounded-md"
                      placeholder="표시할 콘텐츠에 대한 설명을 입력하세요"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Input type="file" className="flex-1" />
                    <Button variant="outline" size="sm">이미지 업로드</Button>
                  </div>
                </div>
                <Button className="mt-4">타겟 설정 추가</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">타겟팅 설정</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>위치 기반 타겟팅 사용</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>사용자 첫 방문 시에만 타겟팅 적용</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>위치 정보 저장 기간</span>
                    <Select defaultValue="30days">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="기간 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1day">1일</SelectItem>
                        <SelectItem value="7days">7일</SelectItem>
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
        
        {/* 로컬 이벤트 */}
        <TabsContent value="local-events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>로컬 이벤트 관리</CardTitle>
              <CardDescription>
                오프라인 이벤트 정보 등록, 참가 신청 양식 생성 및 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">등록된 이벤트</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">친환경 패션 전시회</p>
                      <p className="text-xs text-muted-foreground">일시: 2025-06-15 ~ 2025-06-20 / 장소: 서울 코엑스</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">관리</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">부산 팝업 스토어</p>
                      <p className="text-xs text-muted-foreground">일시: 2025-07-10 ~ 2025-07-25 / 장소: 부산 센텀시티</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">관리</Button>
                      <Button variant="outline" size="sm">삭제</Button>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="mr-1 h-4 w-4" /> 새 이벤트 추가
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">새 이벤트 등록</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm mb-1">이벤트 이름</label>
                    <Input placeholder="이벤트 이름을 입력하세요" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">시작일</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">종료일</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">장소</label>
                    <div className="flex gap-2">
                      <Input placeholder="이벤트 장소를 입력하세요" className="flex-1" />
                      <Button variant="outline" size="sm">지도에서 선택</Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">이벤트 설명</label>
                    <textarea 
                      className="w-full min-h-[100px] p-2 border rounded-md"
                      placeholder="이벤트에 대한 설명을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">최대 참가자 수</label>
                    <Input type="number" placeholder="제한 없으면 빈칸으로 두세요" />
                  </div>
                  <div className="flex gap-2">
                    <Input type="file" className="flex-1" />
                    <Button variant="outline" size="sm">이미지 업로드</Button>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">참가 신청 양식</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>참가 신청 양식 활성화</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">필수 수집 정보</label>
                    <div className="space-y-2 pl-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked /> 
                        <span>이름</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked /> 
                        <span>연락처</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked /> 
                        <span>이메일</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" /> 
                        <span>주소</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" /> 
                        <span>생년월일</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">추가 질문</label>
                    <textarea 
                      className="w-full min-h-[80px] p-2 border rounded-md"
                      placeholder="참가자에게 추가로 묻고 싶은 질문을 입력하세요"
                    />
                  </div>
                  <div className="flex items-center justify-between border-b pb-2 mt-4">
                    <span>참가신청 자동 승인</span>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>참가 확정 이메일 발송</span>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>일정 추가 링크 포함</span>
                    <input type="checkbox" defaultChecked className="toggle" />
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

export default LocationServiceSection;
