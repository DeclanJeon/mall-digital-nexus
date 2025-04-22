import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Settings, User, Mail, Smartphone, MapPin } from 'lucide-react';
import { peerSpaceData } from '@/components/peer-space/mockData';

const PeerSpaceSettings = () => {
  const navigate = useNavigate();
  const [peerNumber, setPeerNumber] = useState('P-12345-6789');

  const generatePeerNumber = () => {
    const newPeerNumber = `P-${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setPeerNumber(newPeerNumber);
  };

  return (
    <div className="min-h-screen bg-bg-100">
      {/* Header */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            피어 스페이스 설정
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="basic-info">
          <TabsList className="mb-8">
            <TabsTrigger value="basic-info">기본 정보</TabsTrigger>
            <TabsTrigger value="profile">프로필 관리</TabsTrigger>
            <TabsTrigger value="design">디자인 설정</TabsTrigger>
            <TabsTrigger value="community">커뮤니티 설정</TabsTrigger>
            <TabsTrigger value="content">콘텐츠 관리</TabsTrigger>
            <TabsTrigger value="products">제품 관리</TabsTrigger>
            <TabsTrigger value="marketing">마케팅/운영 설정</TabsTrigger>
            <TabsTrigger value="peer-number">피어넘버 정보</TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info">
            <div className="space-y-6">
              {/* General Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
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

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>연락처 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      이메일
                    </label>
                    <Input 
                      defaultValue={peerSpaceData.contactEmail}
                      placeholder="연락용 이메일을 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      전화번호
                    </label>
                    <Input 
                      defaultValue={peerSpaceData.contactPhone}
                      placeholder="연락용 전화번호를 입력하세요"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
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
          </TabsContent>

          <TabsContent value="profile">
            <div className="space-y-6">
              {/* Profile Management */}
              <Card>
                <CardHeader>
                  <CardTitle>프로필 관리</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email Change Section */}
                  <div>
                    <h3 className="text-sm font-medium mb-3 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      이메일 변경
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-text-200 mb-1">현재 이메일</label>
                        <Input 
                          value={peerSpaceData.contactEmail}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-200 mb-1">새 이메일</label>
                        <Input 
                          placeholder="변경할 이메일 주소 입력"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">인증 코드 발송</Button>
                        <Input 
                          placeholder="인증 코드 입력"
                          className="flex-1"
                        />
                      </div>
                      <Button size="sm">이메일 변경</Button>
                    </div>
                  </div>

                  {/* Sub-account Management */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">서브 계정 관리</h3>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="이메일 또는 ID 입력"
                          className="flex-1"
                        />
                        <Button size="sm">초대</Button>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-xs text-text-200 mb-2">현재 서브 계정 (0)</div>
                        <div className="text-sm text-text-300 text-center py-4">
                          등록된 서브 계정이 없습니다
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Logo & Favicon Management */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">로고 & 파비콘</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-xs text-text-200">로고 이미지</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-100 mb-2 flex items-center justify-center">
                            <span className="text-xs text-text-300">로고</span>
                          </div>
                          <Button variant="outline" size="sm">이미지 선택</Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs text-text-200">파비콘</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center">
                          <div className="w-10 h-10 bg-gray-100 mb-2 flex items-center justify-center">
                            <span className="text-xs text-text-300">파비콘</span>
                          </div>
                          <Button variant="outline" size="sm">이미지 선택</Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm">이미지 저장</Button>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">프로필 이미지</h3>
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                        {/* 프로필 이미지 표시 */}
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="h-12 w-12" />
                        </div>
                      </div>
                      <Button variant="outline">이미지 변경</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="design">
            <div className="space-y-6">
              {/* Skin Management */}
              <Card>
                <CardHeader>
                  <CardTitle>스킨 관리</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">현재 적용된 스킨</h3>
                    <div className="border rounded-md p-3 bg-bg-50">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-primary-100 rounded-md mr-3"></div>
                        <div>
                          <p className="font-medium">기본 스킨</p>
                          <p className="text-xs text-text-200">Peermall 기본 테마</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">사용 가능한 스킨</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['기본', '미니멀', '다크', '비즈니스'].map((skin) => (
                        <div 
                          key={skin}
                          className="border rounded-md p-3 hover:border-primary-300 cursor-pointer"
                        >
                          <div className="aspect-video bg-bg-100 mb-2 rounded"></div>
                          <p className="text-sm font-medium">{skin} 스킨</p>
                          <Button variant="outline" size="sm" className="w-full mt-2">
                            미리보기
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full">스킨 적용</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Layout Management */}
              <Card>
                <CardHeader>
                  <CardTitle>레이아웃 관리</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">현재 레이아웃</h3>
                    <div className="border rounded-md p-3 bg-bg-50">
                      <div className="aspect-video bg-bg-100 mb-2 rounded relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-text-200">현재 레이아웃 미리보기</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">기본 레이아웃</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">섹션 구성</h3>
                    <div className="space-y-2">
                      {['히어로 배너', '추천 콘텐츠', '서비스', '커뮤니티', '리뷰'].map((section) => (
                        <div key={section} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center">
                            <span className="text-sm">{section}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">위로</Button>
                            <Button variant="ghost" size="sm">아래로</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full mr-2">미리보기</Button>
                    <Button className="w-full mt-2">레이아웃 저장</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Management */}
              <Card>
                <CardHeader>
                  <CardTitle>테마 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">색상 팔레트</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['기본', '강조', '텍스트', '배경'].map((color) => (
                        <div key={color} className="space-y-1">
                          <label className="text-xs text-text-200">{color} 색상</label>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full border mr-2 bg-primary-300"></div>
                            <Input 
                              value="#3b82f6"
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">폰트 설정</h3>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-text-200">본문 폰트</label>
                        <select className="w-full border rounded-md p-2 text-sm">
                          <option>Arial</option>
                          <option>Noto Sans KR</option>
                          <option>Pretendard</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-text-200">제목 폰트</label>
                        <select className="w-full border rounded-md p-2 text-sm">
                          <option>Arial</option>
                          <option>Noto Sans KR</option>
                          <option>Pretendard</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button variant="outline" className="w-full mr-2">미리보기</Button>
                    <Button className="w-full mt-2">테마 저장</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <div className="space-y-6">
              {/* Community Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>커뮤니티 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Board Settings */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">게시판 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">게시판 활성화</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div>
                        <label className="block text-xs text-text-200 mb-1">기본 게시판 카테고리</label>
                        <select className="w-full border rounded-md p-2 text-sm">
                          <option>공지사항</option>
                          <option>자유게시판</option>
                          <option>질문과 답변</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Chat Settings */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">채팅 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">실시간 채팅 허용</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div>
                        <label className="block text-xs text-text-200 mb-1">금칙어 설정</label>
                        <Textarea 
                          placeholder="금칙어를 입력하세요 (한 줄에 하나씩)"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Event Settings */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">이벤트 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">이벤트 기능 활성화</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div>
                        <label className="block text-xs text-text-200 mb-1">이벤트 알림 설정</label>
                        <select className="w-full border rounded-md p-2 text-sm">
                          <option>전체 공개</option>
                          <option>팔로워 공개</option>
                          <option>비공개</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quest Settings */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">퀘스트 설정</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">퀘스트 기능 활성화</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div>
                        <label className="block text-xs text-text-200 mb-1">기본 보상 설정</label>
                        <div className="flex space-x-2">
                          <Input 
                            type="number"
                            defaultValue="100"
                            className="flex-1"
                          />
                          <span className="text-sm text-text-200">포인트</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

            <TabsContent value="content">
              <div className="space-y-6">
                {/* Content Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>콘텐츠 관리</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium">등록된 콘텐츠</h3>
                      <Button size="sm">새 콘텐츠 추가</Button>
                    </div>
                    
                    <div className="space-y-2">
                      {['포트폴리오', '서비스', '이벤트'].map((type) => (
                        <div key={type} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center">
                            <span className="text-sm">{type}</span>
                            <span className="text-xs text-text-200 ml-2">(12)</span>
                          </div>
                          <Button variant="ghost" size="sm">관리</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>


          <TabsContent value="products">
            <div className="space-y-6">
              {/* Product Management */}
              <Card>
                <CardHeader>
                  <CardTitle>제품 관리</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">등록된 제품</h3>
                    <Button size="sm">새 제품 추가</Button>
                  </div>
                  
                  <div className="space-y-2">
                    {['디자인 패키지', '인쇄물', '디지털 상품'].map((type) => (
                      <div key={type} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center">
                          <span className="text-sm">{type}</span>
                          <span className="text-xs text-text-200 ml-2">(8)</span>
                        </div>
                        <Button variant="ghost" size="sm">관리</Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">제품 카테고리 설정</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center">
                          <span className="text-sm">디자인</span>
                        </div>
                        <Button variant="ghost" size="sm">수정</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center">
                          <span className="text-sm">인쇄물</span>
                        </div>
                        <Button variant="ghost" size="sm">수정</Button>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">새 카테ゴ리 추가</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="marketing">
            <div className="space-y-6">
              {/* Marketing/Operation Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>마케팅/운영 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Review Management */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">리뷰 관리</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">리뷰 표시 설정</span>
                        <select className="border rounded-md p-2 text-sm w-32">
                          <option>전체 공개</option>
                          <option>승인 후 공개</option>
                          <option>비공개</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-text-200 mb-1">리뷰 알림 설정</label>
                        <select className="w-full border rounded-md p-2 text-sm">
                          <option>즉시 알림</option>
                          <option>일일 요약</option>
                          <option>알림 안함</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Ad Management */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">광고 관리</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">광고 활성화</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div>
                        <label className="block text-xs text-text-200 mb-1">광고 유형</label>
                        <select className="w-full border rounded-md p-2 text-sm">
                          <option>배너 광고</option>
                          <option>전면 광고</option>
                          <option>영상 광고</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Influencer Management */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">인플루언서 관리</h3>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Input 
                          placeholder="인플루언서 ID 또는 이름"
                          className="flex-1"
                        />
                        <Button size="sm">초대</Button>
                      </div>
                      <div className="border rounded-md p-3">
                        <div className="text-xs text-text-200 mb-2">현재 인플루언서 (0)</div>
                        <div className="text-sm text-text-300 text-center py-4">
                          등록된 인플루언서가 없습니다
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="peer-number">
            <div className="space-y-6">
              {/* Peer Number Info */}
              <Card>
                <CardHeader>
                  <CardTitle>피어넘버 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">내 피어넘버</label>
                    <div className="flex space-x-2">
                      <Input 
                        value={peerNumber}
                        onChange={(e) => setPeerNumber(e.target.value)}
                        className="font-mono flex-1"
                        placeholder="P-XXXXX-XXXX"
                      />
                      <Button variant="outline" onClick={generatePeerNumber}>랜덤 생성</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">피어넘버란?</h3>
                    <p className="text-xs text-text-200">
                      Peermall 네트워크에서 사용되는 고유 식별자입니다. P2P 연결 및 신원 확인에 사용됩니다.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">보안 유의사항</h3>
                    <ul className="text-xs text-text-200 list-disc pl-4 space-y-1">
                      <li>피어넘버는 외부에 노출되지 않도록 주의하세요.</li>
                      <li>비밀번호를 주기적으로 변경하세요.</li>
                      <li>2단계 인증을 설정하세요.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="sticky bottom-4 mt-8">
          <Button className="w-full">변경 사항 저장</Button>
        </div>
      </main>
    </div>
  );
};

export default PeerSpaceSettings;
