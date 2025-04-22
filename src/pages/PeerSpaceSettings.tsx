import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Settings, User, Mail, Smartphone, MapPin, Palette, LayoutPanelLeft, Users, FileText, Package, Megaphone, Hash, Image as ImageIcon, ShieldCheck, Paintbrush, LayoutList, PaletteIcon, Baseline, MessageSquare, Bot, CalendarDays, Gift, ListChecks, BarChart, Star, Speaker, Users2 } from 'lucide-react';
import { peerSpaceData } from '@/components/peer-space/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// 각 설정 섹션의 ID 정의
const SECTION_IDS = {
  BASIC_INFO: 'basic-info',
  PROFILE: 'profile',
  DESIGN: 'design',
  COMMUNITY: 'community',
  CONTENT: 'content',
  PRODUCTS: 'products',
  MARKETING: 'marketing',
  PEER_NUMBER: 'peer-number',
};

const PeerSpaceSettings = () => {
  const navigate = useNavigate();
  const [peerNumber, setPeerNumber] = useState('P-12345-6789');
  const [activeSection, setActiveSection] = useState(SECTION_IDS.BASIC_INFO);

  // 각 섹션의 ref 생성
  const sectionRefs = {
    [SECTION_IDS.BASIC_INFO]: useRef<HTMLDivElement>(null),
    [SECTION_IDS.PROFILE]: useRef<HTMLDivElement>(null),
    [SECTION_IDS.DESIGN]: useRef<HTMLDivElement>(null),
    [SECTION_IDS.COMMUNITY]: useRef<HTMLDivElement>(null),
    [SECTION_IDS.CONTENT]: useRef<HTMLDivElement>(null),
    [SECTION_IDS.PRODUCTS]: useRef<HTMLDivElement>(null),
    [SECTION_IDS.MARKETING]: useRef<HTMLDivElement>(null),
    [SECTION_IDS.PEER_NUMBER]: useRef<HTMLDivElement>(null),
  };

  const generatePeerNumber = () => {
    const newPeerNumber = `P-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setPeerNumber(newPeerNumber);
  };

  // 메뉴 클릭 시 해당 섹션으로 스크롤하는 함수
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    sectionRefs[sectionId as keyof typeof sectionRefs].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  // 사이드바 메뉴 항목 정의
  const sidebarNavItems = [
    { id: SECTION_IDS.BASIC_INFO, title: '기본 정보', icon: Settings },
    { id: SECTION_IDS.PROFILE, title: '프로필 관리', icon: User },
    { id: SECTION_IDS.DESIGN, title: '디자인 설정', icon: Palette },
    { id: SECTION_IDS.COMMUNITY, title: '커뮤니티 설정', icon: Users },
    { id: SECTION_IDS.CONTENT, title: '콘텐츠 관리', icon: FileText },
    { id: SECTION_IDS.PRODUCTS, title: '제품 관리', icon: Package },
    { id: SECTION_IDS.MARKETING, title: '마케팅/운영', icon: Megaphone },
    { id: SECTION_IDS.PEER_NUMBER, title: '피어넘버 정보', icon: Hash },
  ];

  return (
    <div className="flex flex-col h-screen bg-muted/40">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">뒤로가기</span>
        </Button>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          피어 스페이스 설정
        </h1>
        <div className="ml-auto">
          <Button size="sm">변경 사항 저장</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-64 border-r bg-background p-4">
          <nav className="flex flex-col gap-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => scrollToSection(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <ScrollArea className="h-full">
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Basic Info Section */}
              <div ref={sectionRefs[SECTION_IDS.BASIC_INFO]} id={SECTION_IDS.BASIC_INFO}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" /> 기본 정보
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>피어 스페이스 정보</CardTitle>
                    <CardDescription>피어 스페이스의 이름과 설명을 관리합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">피어 스페이스 제목</label>
                      <Input
                        defaultValue={peerSpaceData.title}
                        placeholder="피어 스페이스 제목을 입력하세요"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">설명</label>
                      <Textarea
                        defaultValue={peerSpaceData.description}
                        placeholder="피어 스페이스에 대한 설명을 입력하세요"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>연락처 정보</CardTitle>
                    <CardDescription>사용자 및 방문자와의 소통을 위한 연락처 정보입니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        이메일
                      </label>
                      <Input
                        defaultValue={peerSpaceData.contactEmail}
                        placeholder="연락용 이메일을 입력하세요"
                        type="email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                        전화번호
                      </label>
                      <Input
                        defaultValue={peerSpaceData.contactPhone}
                        placeholder="연락용 전화번호를 입력하세요"
                        type="tel"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        주소
                      </label>
                      <Input
                        defaultValue={peerSpaceData.address}
                        placeholder="주소를 입력하세요"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Profile Section */}
              <div ref={sectionRefs[SECTION_IDS.PROFILE]} id={SECTION_IDS.PROFILE}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" /> 프로필 관리
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>계정 관리</CardTitle>
                    <CardDescription>로그인 이메일 및 서브 계정을 관리합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Email Change Section */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        이메일 변경
                      </h3>
                      <div className="space-y-3 p-4 border rounded-md bg-muted/20">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">현재 이메일</label>
                          <Input value={peerSpaceData.contactEmail} disabled />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">새 이메일</label>
                          <Input placeholder="변경할 이메일 주소 입력" type="email" />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input placeholder="인증 코드 입력" className="flex-1" />
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">인증 코드 발송</Button>
                        </div>
                        <Button size="sm">이메일 변경 확인</Button>
                      </div>
                    </div>

                    {/* Sub-account Management */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-muted-foreground" />
                        서브 계정 관리
                      </h3>
                      <div className="space-y-3 p-4 border rounded-md bg-muted/20">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input placeholder="초대할 계정의 이메일 또는 ID 입력" className="flex-1" />
                          <Button size="sm" className="w-full sm:w-auto">초대 보내기</Button>
                        </div>
                        <div className="border rounded-md p-3 bg-background">
                          <div className="text-sm font-medium text-muted-foreground mb-2">현재 서브 계정 (0)</div>
                          <div className="text-sm text-muted-foreground text-center py-4">
                            등록된 서브 계정이 없습니다.
                          </div>
                          {/* TODO: Add list of sub-accounts */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>브랜딩 요소</CardTitle>
                    <CardDescription>피어 스페이스의 로고, 파비콘, 프로필 이미지를 설정합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo & Favicon Management */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        로고 & 파비콘
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/20">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">로고 이미지</label>
                          <div className="border-2 border-dashed border-border rounded-md p-4 flex flex-col items-center justify-center aspect-square bg-background">
                            <div className="w-20 h-20 bg-muted rounded-md mb-3 flex items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <Button variant="outline" size="sm">이미지 선택</Button>
                            <p className="text-xs text-muted-foreground mt-2">권장 사이즈: 200x200px</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">파비콘</label>
                           <div className="border-2 border-dashed border-border rounded-md p-4 flex flex-col items-center justify-center aspect-square bg-background">
                            <div className="w-10 h-10 bg-muted rounded-md mb-3 flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <Button variant="outline" size="sm">이미지 선택</Button>
                            <p className="text-xs text-muted-foreground mt-2">권장 사이즈: 32x32px</p>
                          </div>
                        </div>
                      </div>
                       <div className="mt-4 flex justify-end">
                        <Button size="sm">이미지 저장</Button>
                      </div>
                    </div>

                     {/* Profile Image */}
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        프로필 이미지
                      </h3>
                      <div className="flex flex-col items-center p-4 border rounded-md bg-muted/20">
                        <div className="w-32 h-32 rounded-full bg-muted mb-4 overflow-hidden flex items-center justify-center">
                          {/* Placeholder for profile image */}
                          <User className="h-16 w-16 text-muted-foreground" />
                        </div>
                        <Button variant="outline">이미지 변경</Button>
                         <p className="text-xs text-muted-foreground mt-2">원형 이미지 권장</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Design Section */}
              <div ref={sectionRefs[SECTION_IDS.DESIGN]} id={SECTION_IDS.DESIGN}>
                 <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5" /> 디자인 설정
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>스킨 관리</CardTitle>
                    <CardDescription>피어 스페이스의 전체적인 디자인 테마를 선택합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">현재 적용된 스킨</h3>
                      <div className="border rounded-lg p-4 bg-muted/20 flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/50 to-primary/80 rounded-md flex items-center justify-center">
                           <Paintbrush className="h-8 w-8 text-primary-foreground"/>
                        </div>
                        <div>
                          <p className="font-semibold text-base">기본 스킨</p>
                          <p className="text-sm text-muted-foreground">Peermall 기본 제공 테마</p>
                           <Button variant="link" size="sm" className="p-0 h-auto mt-1">스킨 정보 보기</Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3">사용 가능한 스킨</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {['기본', '미니멀', '다크', '비즈니스', '크리에이티브', '레트로'].map((skin) => (
                          <Card key={skin} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                             <div className="aspect-video bg-muted flex items-center justify-center">
                               <PaletteIcon className="h-10 w-10 text-muted-foreground/50 group-hover:scale-110 transition-transform"/>
                             </div>
                             <CardContent className="p-4">
                              <p className="text-base font-medium mb-1">{skin} 스킨</p>
                              <p className="text-xs text-muted-foreground mb-3">간략한 스킨 설명</p>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">미리보기</Button>
                                <Button size="sm" className="flex-1">적용</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                       <Button variant="outline" className="w-full mt-4">더 많은 스킨 보기</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>레이아웃 관리</CardTitle>
                    <CardDescription>피어 스페이스 페이지의 섹션 구성 및 순서를 조정합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <div>
                      <h3 className="text-lg font-medium mb-3">현재 레이아웃</h3>
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <div className="aspect-video bg-background rounded-md relative flex items-center justify-center border mb-3">
                           <LayoutList className="h-10 w-10 text-muted-foreground/50"/>
                           <p className="absolute bottom-2 right-2 text-xs text-muted-foreground">현재 레이아웃 미리보기 영역</p>
                        </div>
                        <p className="text-base font-medium">기본 레이아웃</p>
                        <p className="text-sm text-muted-foreground">가장 일반적인 섹션 구성</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">섹션 구성 (드래그 앤 드롭으로 순서 변경)</h3>
                      <div className="space-y-2 border rounded-md p-4 bg-background">
                        {['히어로 배너', '소개', '주요 서비스', '포트폴리오', '커뮤니티 피드', '고객 리뷰', '연락처'].map((section) => (
                          <div key={section} className="flex items-center justify-between p-3 border rounded bg-muted/50 cursor-grab active:cursor-grabbing">
                            <div className="flex items-center gap-2">
                              <LayoutList className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{section}</span>
                            </div>
                            {/* Add drag handle and visibility toggle */}
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                            </Button>
                          </div>
                        ))}
                      </div>
                       <Button variant="outline" size="sm" className="w-full mt-3">섹션 추가</Button>
                    </div>
                     <div className="flex gap-2 justify-end">
                       <Button variant="outline">미리보기</Button>
                       <Button>레이아웃 저장</Button>
                     </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>테마 커스터마이징</CardTitle>
                    <CardDescription>색상 팔레트와 폰트를 조정하여 개성있는 디자인을 만듭니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <PaletteIcon className="h-4 w-4 text-muted-foreground" />
                        색상 팔레트
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border rounded-md bg-muted/20">
                        {['주요 색상', '보조 색상', '강조 색상', '배경 색상'].map((colorType) => (
                          <div key={colorType} className="space-y-1">
                            <label className="text-sm font-medium">{colorType}</label>
                            <div className="flex items-center gap-2">
                              <Input type="color" defaultValue="#3b82f6" className="w-8 h-8 p-0 border-none cursor-pointer" />
                              <Input
                                defaultValue="#3b82f6"
                                className="text-sm h-8 flex-1"
                                readOnly // Or allow editing with validation
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                       <Button variant="link" size="sm" className="mt-2 p-0 h-auto">색상 팔레트 초기화</Button>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Baseline className="h-4 w-4 text-muted-foreground" />
                        폰트 설정
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/20">
                        <div>
                          <label className="text-sm font-medium mb-1 block">본문 폰트</label>
                          <select className="w-full border rounded-md p-2 text-sm bg-background h-9">
                            <option>Pretendard</option>
                            <option>Noto Sans KR</option>
                            <option>Roboto</option>
                            <option>Open Sans</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">제목 폰트</label>
                          <select className="w-full border rounded-md p-2 text-sm bg-background h-9">
                            <option>Pretendard</option>
                            <option>Noto Sans KR</option>
                            <option>Montserrat</option>
                            <option>Poppins</option>
                          </select>
                        </div>
                      </div>
                    </div>
                     <div className="flex gap-2 justify-end">
                       <Button variant="outline">미리보기</Button>
                       <Button>테마 저장</Button>
                     </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Community Section */}
              <div ref={sectionRefs[SECTION_IDS.COMMUNITY]} id={SECTION_IDS.COMMUNITY}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" /> 커뮤니티 설정
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>커뮤니티 기능 활성화</CardTitle>
                    <CardDescription>게시판, 채팅, 이벤트, 퀘스트 등 커뮤니티 기능을 설정합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Board Settings */}
                    <div className="p-4 border rounded-md bg-muted/20">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        게시판 설정
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">게시판 기능 활성화</span>
                          <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">기본 게시판 카테고리</label>
                          <select className="w-full border rounded-md p-2 text-sm bg-background h-9">
                            <option>공지사항</option>
                            <option>자유게시판</option>
                            <option>질문과 답변</option>
                            <option>자료실</option>
                          </select>
                           <Button variant="outline" size="sm" className="w-full mt-2">카테고리 관리</Button>
                        </div>
                         <div>
                          <label className="block text-sm font-medium mb-1">글쓰기 권한</label>
                          <select className="w-full border rounded-md p-2 text-sm bg-background h-9">
                            <option>모든 사용자</option>
                            <option>로그인 사용자</option>
                            <option>팔로워만</option>
                            <option>관리자만</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Chat Settings */}
                     <div className="p-4 border rounded-md bg-muted/20">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                        채팅 설정
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">실시간 채팅 허용</span>
                          <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">금칙어 설정</label>
                          <Textarea
                            placeholder="금칙어를 입력하세요 (쉼표로 구분)"
                            rows={3}
                            className="bg-background"
                          />
                           <p className="text-xs text-muted-foreground mt-1">부적절한 단어 사용을 방지합니다.</p>
                        </div>
                      </div>
                    </div>

                    {/* Event Settings */}
                     <div className="p-4 border rounded-md bg-muted/20">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        이벤트 설정
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">이벤트 기능 활성화</span>
                          <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">이벤트 알림 설정</label>
                          <select className="w-full border rounded-md p-2 text-sm bg-background h-9">
                            <option>전체 공개</option>
                            <option>팔로워에게만 알림</option>
                            <option>참여자에게만 알림</option>
                            <option>알림 없음</option>
                          </select>
                        </div>
                         <Button variant="outline" size="sm" className="w-full mt-2">이벤트 관리 페이지로 이동</Button>
                      </div>
                    </div>

                    {/* Quest Settings */}
                     <div className="p-4 border rounded-md bg-muted/20">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        퀘스트 설정
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">퀘스트 기능 활성화</span>
                          <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">기본 보상 설정 (포인트)</label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              defaultValue="100"
                              className="w-24 bg-background"
                              min="0"
                            />
                            <span className="text-sm text-muted-foreground">포인트</span>
                          </div>
                           <p className="text-xs text-muted-foreground mt-1">퀘스트 완료 시 지급되는 기본 포인트입니다.</p>
                        </div>
                         <Button variant="outline" size="sm" className="w-full mt-2">퀘스트 관리 페이지로 이동</Button>
                      </div>
                    </div>
                  </CardContent>
                   <CardContent className="mt-4 flex justify-end">
                     <Button>커뮤니티 설정 저장</Button>
                   </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Content Management Section */}
              <div ref={sectionRefs[SECTION_IDS.CONTENT]} id={SECTION_IDS.CONTENT}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" /> 콘텐츠 관리
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>콘텐츠 유형 관리</CardTitle>
                    <CardDescription>피어 스페이스에서 제공하는 콘텐츠 유형을 관리합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">등록된 콘텐츠 유형</h3>
                      <Button size="sm" variant="outline">
                        <ListChecks className="mr-2 h-4 w-4" />
                        새 콘텐츠 유형 추가
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {['포트폴리오', '블로그 게시물', '튜토리얼', '뉴스레터', '이벤트 정보'].map((type) => (
                        <div key={type} className="flex items-center justify-between p-3 border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                             {/* Add appropriate icon based on type */}
                             <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <span className="text-sm font-medium">{type}</span>
                              <span className="text-xs text-muted-foreground ml-2">(12개 항목)</span>
                              <p className="text-xs text-muted-foreground">간단한 설명 또는 마지막 업데이트 날짜</p>
                            </div>
                          </div>
                           <div className="flex gap-2">
                             <Button variant="ghost" size="sm">관리</Button>
                             <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">삭제</Button>
                           </div>
                        </div>
                      ))}
                    </div>
                     <Button className="w-full mt-4">콘텐츠 관리 페이지로 이동</Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Product Management Section */}
              <div ref={sectionRefs[SECTION_IDS.PRODUCTS]} id={SECTION_IDS.PRODUCTS}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" /> 제품 관리
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>판매 제품 관리</CardTitle>
                    <CardDescription>피어 스페이스에서 판매하는 제품 및 카테고리를 관리합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">등록된 제품</h3>
                      <Button size="sm">
                         <Package className="mr-2 h-4 w-4" />
                         새 제품 추가
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {['디자인 템플릿', '컨설팅 서비스', '온라인 강의', '구독 플랜'].map((type) => (
                        <div key={type} className="flex items-center justify-between p-3 border rounded-md bg-muted/20 hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                             <Package className="h-5 w-5 text-primary" />
                            <div>
                              <span className="text-sm font-medium">{type}</span>
                              <span className="text-xs text-muted-foreground ml-2">(8개 항목)</span>
                               <p className="text-xs text-muted-foreground">가격 범위 또는 주요 특징</p>
                            </div>
                          </div>
                           <div className="flex gap-2">
                             <Button variant="ghost" size="sm">관리</Button>
                             <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">삭제</Button>
                           </div>
                        </div>
                      ))}
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="text-lg font-medium mb-3">제품 카테고리 설정</h3>
                      <div className="space-y-2 mb-3">
                        {['디지털 상품', '서비스', '교육', '구독'].map((category) => (
                           <div key={category} className="flex items-center justify-between p-2 border rounded bg-background">
                            <span className="text-sm">{category}</span>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">수정</Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">삭제</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">새 카테고리 추가</Button>
                    </div>
                     <Button className="w-full mt-4">제품 관리 페이지로 이동</Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Marketing/Operation Section */}
              <div ref={sectionRefs[SECTION_IDS.MARKETING]} id={SECTION_IDS.MARKETING}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Megaphone className="h-5 w-5" /> 마케팅/운영 설정
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>마케팅 및 운영 도구 설정</CardTitle>
                    <CardDescription>리뷰, 광고, 인플루언서 협업 등 마케팅 및 운영 관련 기능을 설정합니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Review Management */}
                    <div className="p-4 border rounded-md bg-muted/20">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        리뷰 관리
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">리뷰 표시 설정</label>
                          <select className="border rounded-md p-2 text-sm bg-background h-9 w-40">
                            <option>전체 공개</option>
                            <option>승인 후 공개</option>
                            <option>비공개</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">리뷰 알림 설정</label>
                          <select className="border rounded-md p-2 text-sm bg-background h-9 w-40">
                            <option>즉시 알림</option>
                            <option>일일 요약</option>
                            <option>알림 안함</option>
                          </select>
                        </div>
                         <Button variant="outline" size="sm" className="w-full mt-2">리뷰 관리 페이지로 이동</Button>
                      </div>
                    </div>

                    {/* Ad Management */}
                    <div className="p-4 border rounded-md bg-muted/20">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Speaker className="h-4 w-4 text-muted-foreground" />
                        광고 관리
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">피어 스페이스 내 광고 활성화</span>
                          <input type="checkbox" className="toggle toggle-primary" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">광고 유형 선택</label>
                          <select className="w-full border rounded-md p-2 text-sm bg-background h-9">
                            <option>배너 광고</option>
                            <option>콘텐츠 내 광고</option>
                            <option>팝업 광고</option>
                          </select>
                           <p className="text-xs text-muted-foreground mt-1">광고 수익 모델 및 정책을 확인하세요.</p>
                        </div>
                         <Button variant="outline" size="sm" className="w-full mt-2">광고 설정 페이지로 이동</Button>
                      </div>
                    </div>

                    {/* Influencer Management */}
                    <div className="p-4 border rounded-md bg-muted/20">
                      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Users2 className="h-4 w-4 text-muted-foreground" />
                        인플루언서 관리
                      </h3>
                      <div className="space-y-3">
                         <div className="flex flex-col sm:flex-row gap-2">
                          <Input placeholder="초대할 인플루언서 ID 또는 채널명" className="flex-1 bg-background" />
                          <Button size="sm" className="w-full sm:w-auto">협업 제안 보내기</Button>
                        </div>
                        <div className="border rounded-md p-3 bg-background">
                          <div className="text-sm font-medium text-muted-foreground mb-2">현재 협업 중인 인플루언서 (0)</div>
                          <div className="text-sm text-muted-foreground text-center py-4">
                            등록된 인플루언서가 없습니다.
                          </div>
                          {/* TODO: Add list of influencers */}
                        </div>
                         <Button variant="outline" size="sm" className="w-full mt-2">인플루언서 관리 페이지로 이동</Button>
                      </div>
                    </div>
                  </CardContent>
                   <CardContent className="mt-4 flex justify-end">
                     <Button>마케팅/운영 설정 저장</Button>
                   </CardContent>
                </Card>
              </div>

              <Separator />

              {/* Peer Number Info Section */}
              <div ref={sectionRefs[SECTION_IDS.PEER_NUMBER]} id={SECTION_IDS.PEER_NUMBER}>
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Hash className="h-5 w-5" /> 피어넘버 정보
                </h2>
                <Card>
                  <CardHeader>
                    <CardTitle>내 피어넘버</CardTitle>
                    <CardDescription>Peermall 네트워크에서 사용되는 고유 식별자입니다.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">현재 피어넘버</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                          value={peerNumber}
                          onChange={(e) => setPeerNumber(e.target.value)}
                          className="font-mono flex-1 text-lg tracking-wider"
                          placeholder="P-XXXXX-XXXX"
                          readOnly // Usually PeerNumbers are not manually editable
                        />
                        <Button variant="outline" onClick={generatePeerNumber}>
                          신규 발급 (주의)
                        </Button>
                         <Button variant="secondary">복사</Button>
                      </div>
                       <p className="text-xs text-muted-foreground mt-2">피어넘버는 P2P 연결 및 신원 확인에 사용됩니다. 변경 시 기존 연결에 영향을 줄 수 있습니다.</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        보안 유의사항
                      </h3>
                      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        <li>피어넘버는 중요한 개인 정보입니다. 외부에 함부로 노출하지 마세요.</li>
                        <li>계정 비밀번호를 주기적으로 변경하고, 복잡하게 설정하세요.</li>
                        <li>가능하다면 2단계 인증(2FA)을 활성화하여 계정 보안을 강화하세요.</li>
                        <li>피싱 사기에 주의하고, 의심스러운 링크나 요청은 확인 후 클릭하세요.</li>
                      </ul>
                    </div>
                  </CardContent>
                   <CardContent className="mt-4 flex justify-end">
                     {/* Peer number might not need a save button if it's generated/assigned */}
                     {/* <Button>피어넘버 정보 저장</Button> */}
                   </CardContent>
                </Card>
              </div>
            </div>
          </ScrollArea>
        </main>
      </div>

      {/* Sticky Save Button (Alternative) - Can be removed if using header button */}
      {/*
      <footer className="sticky bottom-0 border-t bg-background p-4 mt-auto">
        <div className="max-w-4xl mx-auto">
          <Button className="w-full">변경 사항 저장</Button>
        </div>
      </footer>
      */}
    </div>
  );
};

export default PeerSpaceSettings;
