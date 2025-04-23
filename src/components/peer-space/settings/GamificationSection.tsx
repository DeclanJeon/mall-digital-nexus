
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettingsSave } from '@/hooks/useSettingsSave';
import { Trophy, Medal, BadgeCheck, Target, Plus, Calendar, Star } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const GamificationSection = () => {
  const [activeTab, setActiveTab] = useState('missions');
  const { saved, isSaving, handleSettingChange, handleSaveSettings } = 
    useSettingsSave({ sectionName: '게임화 요소' });

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Trophy className="mr-2 h-6 w-6" />
        게임화 요소
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
          <TabsTrigger value="missions">
            <Target className="h-4 w-4 mr-2" />
            미션 / 퀘스트
          </TabsTrigger>
          <TabsTrigger value="levels">
            <Star className="h-4 w-4 mr-2" />
            레벨 시스템
          </TabsTrigger>
          <TabsTrigger value="badges">
            <BadgeCheck className="h-4 w-4 mr-2" />
            배지 시스템
          </TabsTrigger>
        </TabsList>

        {/* 미션/퀘스트 탭 */}
        <TabsContent value="missions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>미션 관리</CardTitle>
              <CardDescription>
                사용자에게 제공할 미션과 퀘스트를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">신규 사용자 가입 퀘스트</h3>
                    <p className="text-sm text-muted-foreground">프로필 작성 및 기본 정보 입력 시 포인트 지급</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">100 포인트</Badge>
                    <Button variant="outline" size="sm">수정</Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">주간 활동 미션</h3>
                    <p className="text-sm text-muted-foreground">일주일에 3회 이상 콘텐츠 등록 시 보상</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">200 포인트</Badge>
                    <Button variant="outline" size="sm">수정</Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">커뮤니티 참여 퀘스트</h3>
                    <p className="text-sm text-muted-foreground">다른 사용자 콘텐츠에 댓글 남기기</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">50 포인트</Badge>
                    <Button variant="outline" size="sm">수정</Button>
                  </div>
                </div>
              </div>
              
              <Button className="mt-4 w-full" variant="outline" onClick={handleSettingChange}>
                <Plus className="mr-2 h-4 w-4" />
                새 미션 추가
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>미션 보상 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span>포인트 보상 활성화</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <span>배지 보상 활성화</span>
                <Switch defaultChecked onChange={handleSettingChange} />
              </div>
              
              <div className="flex justify-between items-center pb-2 border-b">
                <span>레벨업 보상 활성화</span>
                <Switch onChange={handleSettingChange} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 레벨 시스템 탭 */}
        <TabsContent value="levels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>레벨 시스템 설정</CardTitle>
              <CardDescription>
                사용자 레벨 시스템을 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">최대 레벨</label>
                  <Input type="number" defaultValue="50" onChange={handleSettingChange} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">레벨업 기준 포인트</label>
                  <Input type="number" defaultValue="1000" onChange={handleSettingChange} />
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">레벨별 혜택</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <span className="font-medium">레벨 10 달성</span>
                      <p className="text-sm text-muted-foreground">커뮤니티 게시판 작성 권한</p>
                    </div>
                    <Button variant="outline" size="sm">수정</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <span className="font-medium">레벨 20 달성</span>
                      <p className="text-sm text-muted-foreground">프로필 커스터마이징 해금</p>
                    </div>
                    <Button variant="outline" size="sm">수정</Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <span className="font-medium">레벨 30 달성</span>
                      <p className="text-sm text-muted-foreground">VIP 멤버십 자격</p>
                    </div>
                    <Button variant="outline" size="sm">수정</Button>
                  </div>
                </div>
                
                <Button className="mt-4 w-full" variant="outline" onClick={handleSettingChange}>
                  <Plus className="mr-2 h-4 w-4" />
                  레벨 혜택 추가
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 배지 시스템 탭 */}
        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>배지 시스템 관리</CardTitle>
              <CardDescription>
                사용자가 획득할 수 있는 배지를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Star className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">신규 가입</h3>
                      <p className="text-sm text-muted-foreground">피어스페이스에 가입 완료 시 획득</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">수정</Button>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Medal className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">콘텐츠 크리에이터</h3>
                      <p className="text-sm text-muted-foreground">10개 이상의 콘텐츠를 게시한 사용자</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">수정</Button>
                </div>
                
                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">커뮤니티 스타</h3>
                      <p className="text-sm text-muted-foreground">50개 이상의 좋아요를 받은 사용자</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">수정</Button>
                </div>
              </div>
              
              <Button className="mt-4 w-full" variant="outline" onClick={handleSettingChange}>
                <Plus className="mr-2 h-4 w-4" />
                새 배지 추가
              </Button>
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

export default GamificationSection;
