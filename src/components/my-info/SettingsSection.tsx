
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Database, BarChart2, Moon, Sun, Globe, BarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingsSectionProps {
  darkMode: boolean;
  language: string;
  dataExportOptions: {
    id: string;
    name: string;
    description: string;
    selected: boolean;
  }[];
  analyticsData: {
    label: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'neutral';
  }[];
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  darkMode,
  language,
  dataExportOptions,
  analyticsData
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2 text-primary" />
          개인화 및 설정
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="settings">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="settings">설정</TabsTrigger>
            <TabsTrigger value="privacy">데이터/프라이버시</TabsTrigger>
            <TabsTrigger value="analytics">통계/분석</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {darkMode ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <Label htmlFor="dark-mode">다크모드</Label>
                </div>
                <Switch id="dark-mode" defaultChecked={darkMode} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <Label htmlFor="language">언어 설정</Label>
                </div>
                <select 
                  id="language" 
                  className="px-2 py-1 rounded-md border"
                  defaultValue={language}
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
              </div>
              
              <div>
                <Button variant="outline" className="w-full">
                  추천 알고리즘 설정
                </Button>
              </div>
              
              <div>
                <Button variant="outline" className="w-full">
                  접근성 설정
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-medium flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  데이터 관리
                </h3>
                <p className="text-xs text-muted-foreground">개인정보 및 데이터 내보내기/가져오기</p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">데이터 내보내기</h4>
              <div className="space-y-2">
                {dataExportOptions.map((option) => (
                  <div key={option.id} className="flex items-start">
                    <input
                      type="checkbox"
                      id={`export-${option.id}`}
                      className="mt-1 mr-2"
                      defaultChecked={option.selected}
                    />
                    <div>
                      <Label htmlFor={`export-${option.id}`}>{option.name}</Label>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button>내보내기</Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline">데이터 가져오기</Button>
              <Button variant="outline" className="text-red-500 hover:text-red-600">계정 비활성화</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium flex items-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                활동 통계 대시보드
              </h3>
              <select className="px-2 py-1 rounded-md border text-sm">
                <option value="week">이번 주</option>
                <option value="month">이번 달</option>
                <option value="year">올해</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {analyticsData.map((item, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    {item.trend === 'up' && (
                      <span className="text-xs text-green-500">↑ {item.change}%</span>
                    )}
                    {item.trend === 'down' && (
                      <span className="text-xs text-red-500">↓ {item.change}%</span>
                    )}
                    {item.trend === 'neutral' && (
                      <span className="text-xs text-gray-500">― {item.change}%</span>
                    )}
                  </div>
                  <p className="text-2xl font-bold mt-2">{item.value.toLocaleString()}</p>
                  
                  <div className="h-8 mt-2">
                    <BarChart className="h-full w-full text-primary/50" />
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full">상세 분석 보기</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsSection;
