import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { 
  Paintbrush, Image, Layout, LayoutTemplate, FileText, 
  Type, Palette, Monitor, Aperture, Send, Grid3X3, 
  LayoutGrid, LayoutDashboard, List, Award, Users,
  Eye, Settings, X, Plus, Settings as AdIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const colorOptions = [
  { name: "블루", color: "#3b82f6", class: "bg-blue-500" },
  { name: "그린", color: "#10b981", class: "bg-green-500" },
  { name: "퍼플", color: "#8b5cf6", class: "bg-purple-500" },
  { name: "오렌지", color: "#f59e0b", class: "bg-yellow-500" },
  { name: "레드", color: "#ef4444", class: "bg-red-500" },
  { name: "다크 블루", color: "#1e40af", class: "bg-blue-800" },
];

const fontOptions = [
  { name: "Roboto", family: "'Roboto', sans-serif", class: "font-roboto" },
  { name: "Open Sans", family: "'Open Sans', sans-serif", class: "font-opensans" },
  { name: "Montserrat", family: "'Montserrat', sans-serif", class: "font-montserrat" },
];

const sectionTypes = [
  { id: "hero", name: "히어로 배너", icon: <Monitor className="h-4 w-4" /> },
  { id: "intro", name: "소개", icon: <FileText className="h-4 w-4" /> },
  { id: "services", name: "주요 서비스", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "community", name: "커뮤니티", icon: <Users className="h-4 w-4" /> },
  { id: "reviews", name: "고객 리뷰", icon: <List className="h-4 w-4" /> },
  { id: "map", name: "지도", icon: <Aperture className="h-4 w-4" /> },
  { id: "products", name: "제품/콘텐츠", icon: <Grid3X3 className="h-4 w-4" /> },
  { id: "events", name: "이벤트", icon: <Send className="h-4 w-4" /> },
  { id: "quests", name: "퀘스트 목록", icon: <Award className="h-4 w-4" /> },
];

const DesignSettingsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("theme");

  return (
    <Card className="p-6 bg-white/70">
      <div className="flex items-center mb-6">
        <Paintbrush className="w-5 h-5 text-primary-300 mr-2" />
        <h2 className="text-lg font-bold text-primary-300">디자인 설정</h2>
      </div>

      <Tabs defaultValue="theme" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 md:w-[600px]">
          <TabsTrigger value="theme">테마/스킨</TabsTrigger>
          <TabsTrigger value="layout">레이아웃</TabsTrigger>
          <TabsTrigger value="branding">브랜딩 요소</TabsTrigger>
          <TabsTrigger value="hero">히어로 섹션</TabsTrigger>
          <TabsTrigger value="footer">푸터/광고</TabsTrigger>
        </TabsList>

        {/* 테마/스킨 */}
        <TabsContent value="theme" className="space-y-6">
          <div>
            <h3 className="text-base font-medium mb-3">색상 팔레트</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colorOptions.map((option) => (
                <div 
                  key={option.name}
                  className="flex flex-col items-center space-y-2 cursor-pointer hover:opacity-80"
                >
                  <div className={`w-12 h-12 rounded-full ${option.class} border-2 border-white shadow-md`}></div>
                  <span className="text-xs">{option.name}</span>
                </div>
              ))}
            </div>
            <Button size="sm" variant="outline" className="mt-4">
              <Palette className="h-4 w-4 mr-1" />
              커스텀 색상
            </Button>
          </div>

          <div>
            <h3 className="text-base font-medium mb-3">글꼴 설정</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fontOptions.map((option) => (
                <div 
                  key={option.name}
                  className="p-3 border rounded-md flex flex-col space-y-2 cursor-pointer hover:border-primary-300"
                >
                  <div className={`text-lg ${option.class}`}>Aa 가나다라</div>
                  <div className="text-sm text-primary-200">{option.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button>테마 설정 저장</Button>
          </div>
        </TabsContent>

        {/* 레이아웃 설정 */}
        <TabsContent value="layout" className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium">페이지 섹션 구성</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <LayoutTemplate className="h-4 w-4 mr-1" />
                  템플릿 불러오기
                </Button>
                <Button variant="outline" size="sm">
                  <Layout className="h-4 w-4 mr-1" />
                  미리보기
                </Button>
              </div>
            </div>

            <div className="border p-4 rounded-md bg-gray-50">
              <div className="text-sm mb-3 text-primary-200">섹션을 드래그하여 순서를 변경할 수 있습니다.</div>
              
              <div className="space-y-2">
                {sectionTypes.map((section) => (
                  <div
                    key={section.id}
                    className="flex items-center justify-between p-3 bg-white border rounded-md cursor-move"
                  >
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <span>{section.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                새 섹션 추가
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* 브랜딩 요소 */}
        <TabsContent value="branding" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4 border">
              <h3 className="text-base font-medium mb-3">로고</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center gap-4">
                <div className="w-32 h-32 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                <Button size="sm">로고 업로드</Button>
              </div>
              <div className="text-xs text-primary-200 mt-2">
                권장 크기: 512 x 512 픽셀, PNG 또는 SVG 형식
              </div>
            </Card>

            <Card className="p-4 border">
              <h3 className="text-base font-medium mb-3">파비콘</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image className="h-6 w-6 text-gray-400" />
                </div>
                <Button size="sm">파비콘 업로드</Button>
              </div>
              <div className="text-xs text-primary-200 mt-2">
                권장 크기: 96 x 96 픽셀, PNG 또는 ICO 형식
              </div>
            </Card>
            
            <Card className="p-4 border md:col-span-2">
              <h3 className="text-base font-medium mb-3">대표 이미지</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center gap-4">
                <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image className="h-10 w-10 text-gray-400" />
                </div>
                <Button size="sm">대표 이미지 업로드</Button>
              </div>
              <div className="text-xs text-primary-200 mt-2">
                권장 크기: 1200 x 630 픽셀, 소셜 미디어 공유 시 표시
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>브랜딩 저장</Button>
          </div>
        </TabsContent>

        {/* 히어로 섹션 */}
        <TabsContent value="hero" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4 border">
              <h3 className="text-base font-medium mb-3">히어로 이미지/비디오</h3>
              <div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center gap-4">
                <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image className="h-10 w-10 text-gray-400" />
                </div>
                <div className="flex gap-2">
                  <Button size="sm">이미지 업로드</Button>
                  <Button size="sm" variant="outline">비디오 업로드</Button>
                </div>
              </div>
              <div className="text-xs text-primary-200 mt-2">
                권장 크기: 1920 x 1080 픽셀, 최적의 화질을 위해
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4 border">
                <h3 className="text-base font-medium mb-3">히어로 텍스트</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-primary-200 mb-1">제목</div>
                    <div className="p-2 border rounded-md bg-gray-50">
                      함께 성장하는 지식 커뮤니티
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-primary-200 mb-1">부제목</div>
                    <div className="p-2 border rounded-md bg-gray-50">
                      피어몰과 함께 새로운 지식을 발견하고 성장하세요
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 border">
                <h3 className="text-base font-medium mb-3">버튼 설정</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-primary-200 mb-1">주 버튼</div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 border rounded-md bg-gray-50 flex-1">
                        시작하기
                      </div>
                      <div className="p-2 border rounded-md bg-gray-50 flex-1">
                        /start
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-primary-200 mb-1">보조 버튼</div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 border rounded-md bg-gray-50 flex-1">
                        더 알아보기
                      </div>
                      <div className="p-2 border rounded-md bg-gray-50 flex-1">
                        /about
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>히어로 섹션 저장</Button>
          </div>
        </TabsContent>

        {/* 푸터 및 광고 설정 */}
        <TabsContent value="footer" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-4 border">
              <h3 className="text-base font-medium mb-3">푸터 설정</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-primary-200 mb-1">저작권 텍스트</div>
                  <div className="p-2 border rounded-md bg-gray-50">
                    © 2025 피어몰 예시 사업장. All rights reserved.
                  </div>
                </div>
                <div>
                  <div className="text-sm text-primary-200 mb-1">추가 링크</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 border rounded-md bg-gray-50 flex-1">
                        이용약관
                      </div>
                      <div className="p-2 border rounded-md bg-gray-50 flex-1">
                        /terms
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 border rounded-md bg-gray-50 flex-1">
                        개인정보 처리방침
                      </div>
                      <div className="p-2 border rounded-md bg-gray-50 flex-1">
                        /privacy
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border">
              <h3 className="text-base font-medium mb-3">광고 슬롯 설정</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <AdIcon className="h-4 w-4 text-primary-200" />
                    <span>상단 배너 광고</span>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <AdIcon className="h-4 w-4 text-primary-200" />
                    <span>사이드바 광고</span>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center gap-2">
                    <AdIcon className="h-4 w-4 text-primary-200" />
                    <span>콘텐츠 내 광고</span>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-primary-200 mb-2">광고 유형</div>
                <div className="space-x-2">
                  <Button size="sm" variant="outline">자체 광고</Button>
                  <Button size="sm" variant="outline">외부 플랫폼 광고</Button>
                </div>
              </div>
              <div className="mt-4 text-xs text-primary-200">
                광고 수익 배분: 플랫폼 70% / 피어몰 30% (기본 정책)
              </div>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button>저장</Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DesignSettingsSection;
