
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsSave } from '@/hooks/useSettingsSave';
import { Plus, BarChart2, LineChart, Target, BellRing, Filter, Calendar } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const AdvertisementSection = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const { saved, isSaving, handleSettingChange, handleSaveSettings } = 
    useSettingsSave({ sectionName: '광고 관리' });

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Target className="mr-2 h-6 w-6" />
        광고 관리
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="campaigns">
            <Calendar className="h-4 w-4 mr-2" />
            광고 캠페인
          </TabsTrigger>
          <TabsTrigger value="ad-formats">
            <Filter className="h-4 w-4 mr-2" />
            광고 형식
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart2 className="h-4 w-4 mr-2" />
            성과 분석
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="h-4 w-4 mr-2" />
            알림 설정
          </TabsTrigger>
        </TabsList>

        {/* 광고 캠페인 탭 */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>활성 캠페인</CardTitle>
              <CardDescription>
                현재 운영 중인 광고 캠페인을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">여름 시즌 프로모션</h3>
                    <p className="text-sm text-muted-foreground">2025.06.01 ~ 2025.08.31</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>진행 중</Badge>
                    <Button variant="outline" size="sm">수정</Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">신규 사용자 온보딩</h3>
                    <p className="text-sm text-muted-foreground">2025.05.01 ~ 2025.07.31</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>진행 중</Badge>
                    <Button variant="outline" size="sm">수정</Button>
                  </div>
                </div>
              </div>
              
              <Button className="mt-4 w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                새 캠페인 생성
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 광고 형식 탭 */}
        <TabsContent value="ad-formats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>광고 형식 설정</CardTitle>
              <CardDescription>
                피어스페이스에 표시할 광고 형식을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">기본형 광고</h3>
                  <p className="text-sm text-muted-foreground">피어스페이스 상단에 배너 형태로 표시됩니다.</p>
                </div>
                <Switch checked onChange={handleSettingChange} />
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">에이전트 모집형</h3>
                  <p className="text-sm text-muted-foreground">새로운 에이전트를 모집하는 형태의 광고입니다.</p>
                </div>
                <Switch checked onChange={handleSettingChange} />
              </div>
              
              <div className="flex justify-between items-center p-4 border rounded-md">
                <div>
                  <h3 className="font-medium">콘텐츠 프로모션</h3>
                  <p className="text-sm text-muted-foreground">특정 콘텐츠를 홍보하는 광고입니다.</p>
                </div>
                <Switch defaultChecked={false} onChange={handleSettingChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 성과 분석 탭 */}
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>광고 성과 분석</CardTitle>
              <CardDescription>
                광고 캠페인의 성과를 확인합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center">
                <LineChart className="h-8 w-8 opacity-50" />
                <span className="ml-2 text-muted-foreground">광고 성과 그래프가 표시됩니다</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">노출수</p>
                  <p className="text-2xl font-bold">12,450</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">클릭수</p>
                  <p className="text-2xl font-bold">3,240</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">전환율</p>
                  <p className="text-2xl font-bold">2.4%</p>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 탭 */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>광고 알림 설정</CardTitle>
              <CardDescription>
                광고 관련 알림 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 border-b">
                <span>캠페인 종료 알림</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
              <div className="flex justify-between items-center p-3 border-b">
                <span>예산 소진 알림</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
              <div className="flex justify-between items-center p-3 border-b">
                <span>성과 리포트 알림</span>
                <Switch onChange={handleSettingChange} />
              </div>
              <div className="flex justify-between items-center p-3">
                <span>광고 승인 알림</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">알림 수신 방법</h3>
                <Select defaultValue="all" onValueChange={handleSettingChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="알림 수신 방법 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">이메일 및 앱 내 알림</SelectItem>
                    <SelectItem value="email">이메일만</SelectItem>
                    <SelectItem value="app">앱 내 알림만</SelectItem>
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

export default AdvertisementSection;
