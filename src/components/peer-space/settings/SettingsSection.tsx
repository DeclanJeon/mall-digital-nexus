
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Globe, Bell, Link, Download, Upload, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [language, setLanguage] = useState('ko');
  const [timezone, setTimezone] = useState('Asia/Seoul');

  const handleSaveSetting = () => {
    toast({
      title: "설정이 저장되었습니다",
      description: "변경사항이 성공적으로 적용되었습니다.",
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Settings className="mr-2 h-6 w-6" />
        설정
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            일반 설정
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            알림 설정
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Link className="h-4 w-4 mr-2" />
            외부 서비스 연동
          </TabsTrigger>
          <TabsTrigger value="data">
            <Download className="h-4 w-4 mr-2" />
            데이터 관리
          </TabsTrigger>
        </TabsList>

        {/* 일반 설정 */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>기본 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">언어</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="언어 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">시간대</label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="시간대 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Seoul">한국 표준시 (UTC+9)</SelectItem>
                    <SelectItem value="America/Los_Angeles">미국 태평양 시간</SelectItem>
                    <SelectItem value="Europe/London">영국 표준시</SelectItem>
                    <SelectItem value="Asia/Tokyo">일본 표준시</SelectItem>
                    <SelectItem value="Australia/Sydney">호주 동부 표준시</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">날짜 형식</label>
                <Select defaultValue="ymd">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="날짜 형식 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSetting}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">이메일 알림</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                      <span>새 주문 알림</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                      <span>새 리뷰 알림</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                      <span>새 메시지 알림</span>
                      <Switch />
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                      <span>시스템 장애 알림</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>보안 알림</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">푸시 알림</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                      <span>실시간 주문 알림</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                      <span>메시지 알림</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center text-sm border-b pb-2">
                      <span>커뮤니티 활동 알림</span>
                      <Switch />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>긴급 보안 알림</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">알림 이메일 설정</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Input 
                        type="email"
                        placeholder="알림 수신 이메일" 
                        defaultValue="admin@example.com" 
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-1" /> 
                      테스트 메일 발송
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveSetting}>저장</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 외부 서비스 연동 */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>외부 서비스 연동</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">소셜 미디어 계정 연결</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="bg-blue-500 text-white p-1 rounded mr-2 w-8 h-8 flex items-center justify-center">F</div>
                      <div>
                        <div className="font-medium">페이스북</div>
                        <div className="text-xs text-gray-500">연결되지 않음</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">연결</Button>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="bg-sky-500 text-white p-1 rounded mr-2 w-8 h-8 flex items-center justify-center">X</div>
                      <div>
                        <div className="font-medium">X (Twitter)</div>
                        <div className="text-xs text-gray-500">연결되지 않음</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">연결</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1 rounded mr-2 w-8 h-8 flex items-center justify-center">I</div>
                      <div>
                        <div className="font-medium">인스타그램</div>
                        <div className="text-xs text-gray-500">연결됨</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">연결 해제</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">결제 시스템 연동</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-2 flex items-center justify-center">K</div>
                      <div>
                        <div className="font-medium">카카오페이</div>
                        <div className="text-xs text-gray-500">연결됨</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">설정</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-2 flex items-center justify-center">P</div>
                      <div>
                        <div className="font-medium">PayPal</div>
                        <div className="text-xs text-gray-500">연결되지 않음</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">연결</Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">분석 및 광고 도구</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-2 flex items-center justify-center">G</div>
                      <div>
                        <div className="font-medium">Google Analytics</div>
                        <div className="text-xs text-gray-500">연결되지 않음</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">연결</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-2 flex items-center justify-center">Ad</div>
                      <div>
                        <div className="font-medium">광고 플랫폼</div>
                        <div className="text-xs text-gray-500">연결되지 않음</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">연결</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSetting}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 데이터 관리 */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>데이터 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">데이터 내보내기</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <div className="font-medium">전체 데이터 내보내기</div>
                      <div className="text-xs text-gray-500">모든 피어스페이스 데이터를 내보냅니다.</div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      내보내기
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <div className="font-medium">사용자 데이터만 내보내기</div>
                      <div className="text-xs text-gray-500">사용자 및 고객 데이터만 내보냅니다.</div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      내보내기
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div>
                      <div className="font-medium">콘텐츠 데이터만 내보내기</div>
                      <div className="text-xs text-gray-500">콘텐츠, 제품, 서비스 데이터만 내보냅니다.</div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      내보내기
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">데이터 가져오기</h3>
                <div className="p-3 border rounded-md">
                  <div className="mb-2">
                    <div className="font-medium">데이터 파일 업로드</div>
                    <div className="text-xs text-gray-500">내보낸 데이터 파일을 가져옵니다.</div>
                  </div>
                  <div className="flex gap-2">
                    <Input type="file" className="text-sm" />
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      가져오기
                    </Button>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">데이터 백업 설정</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span>자동 일일 백업</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span>백업 파일 7일 보관</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>주간 백업 이메일 발송</span>
                    <Switch />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSetting}>저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default SettingsSection;
