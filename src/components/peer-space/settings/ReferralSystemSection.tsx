
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsSave } from '@/hooks/useSettingsSave';
import { Users, Link, Copy, BarChart2, Settings, Award } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const ReferralSystemSection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [referralLink, setReferralLink] = useState('https://yourpeerspace.com/ref/ABC123');
  const { saved, isSaving, handleSettingChange, handleSaveSettings } = 
    useSettingsSave({ sectionName: '추천인 시스템' });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "링크가 복사되었습니다",
      description: "추천인 링크가 클립보드에 복사되었습니다.",
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Users className="mr-2 h-6 w-6" />
        추천인 시스템
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview">
            <Link className="h-4 w-4 mr-2" />
            추천 개요
          </TabsTrigger>
          <TabsTrigger value="rewards">
            <Award className="h-4 w-4 mr-2" />
            보상 설정
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="h-4 w-4 mr-2" />
            성과 분석
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            시스템 설정
          </TabsTrigger>
        </TabsList>

        {/* 추천 개요 탭 */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>추천 링크</CardTitle>
              <CardDescription>
                다른 사용자를 초대할 수 있는 개인화된 추천 링크입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex">
                <Input value={referralLink} readOnly className="mr-2" />
                <Button variant="outline" onClick={copyToClipboard} className="flex-shrink-0">
                  <Copy className="mr-2 h-4 w-4" />
                  복사
                </Button>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">추천 현황</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">총 추천 수</p>
                    <p className="text-2xl font-bold">24</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">가입 전환 수</p>
                    <p className="text-2xl font-bold">12</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">획득 포인트</p>
                    <p className="text-2xl font-bold">1,200</p>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>추천 사용자 목록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border-b">
                  <span>김철수</span>
                  <span className="text-sm text-muted-foreground">2023-05-15</span>
                </div>
                <div className="flex justify-between items-center p-3 border-b">
                  <span>이영희</span>
                  <span className="text-sm text-muted-foreground">2023-06-22</span>
                </div>
                <div className="flex justify-between items-center p-3">
                  <span>박지민</span>
                  <span className="text-sm text-muted-foreground">2023-07-30</span>
                </div>
              </div>
              
              <Button className="mt-4 w-full" variant="outline">
                전체 목록 보기
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보상 설정 탭 */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>추천 보상 설정</CardTitle>
              <CardDescription>
                추천인 및 초대 받은 사용자의 보상을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">추천인 보상</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">포인트 지급량</label>
                    <Input type="number" defaultValue="100" onChange={handleSettingChange} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">보상 지급 시점</label>
                    <Select defaultValue="signup" onValueChange={handleSettingChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="보상 지급 시점 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="signup">회원가입 완료 시</SelectItem>
                        <SelectItem value="profile">프로필 작성 완료 시</SelectItem>
                        <SelectItem value="first-content">첫 콘텐츠 등록 시</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">초대 받은 사용자 보상</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">포인트 지급량</label>
                    <Input type="number" defaultValue="50" onChange={handleSettingChange} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">보상 유형</label>
                    <Select defaultValue="points" onValueChange={handleSettingChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="보상 유형 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="points">포인트</SelectItem>
                        <SelectItem value="badge">특별 배지</SelectItem>
                        <SelectItem value="both">포인트 + 배지</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-4 pb-2 border-b">
                <span>추천인 배지 지급</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <span>추천 마일스톤 보상</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 성과 분석 탭 */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>추천 성과 분석</CardTitle>
              <CardDescription>
                추천 시스템의 성과를 분석합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                <BarChart2 className="h-8 w-8 opacity-50" />
                <span className="ml-2 text-muted-foreground">추천 성과 차트가 표시됩니다</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">링크 클릭률</p>
                  <p className="text-2xl font-bold">23.5%</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">가입 전환율</p>
                  <p className="text-2xl font-bold">12.8%</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">활성 사용자 비율</p>
                  <p className="text-2xl font-bold">68%</p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 시스템 설정 탭 */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>추천 시스템 설정</CardTitle>
              <CardDescription>
                추천 시스템의 기본 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>추천 시스템 활성화</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <span>보상 자동 지급</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <span>중복 추천 허용</span>
                <Switch onChange={handleSettingChange} />
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">추천 링크 형식</h3>
                <Select defaultValue="random" onValueChange={handleSettingChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="링크 형식 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">랜덤 코드</SelectItem>
                    <SelectItem value="username">사용자명 기반</SelectItem>
                    <SelectItem value="custom">사용자 정의</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">추천 만료 기간</h3>
                <Select defaultValue="never" onValueChange={handleSettingChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="만료 기간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">만료 없음</SelectItem>
                    <SelectItem value="30">30일</SelectItem>
                    <SelectItem value="60">60일</SelectItem>
                    <SelectItem value="90">90일</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {!saved && (
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveSettings} disabled={isSaving}>
            {isSaving ? "저장 중..." : "설정 저장"}
          </Button>
        </div>
      )}
    </section>
  );
};

export default ReferralSystemSection;
