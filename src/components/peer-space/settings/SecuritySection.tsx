
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Users, Key, Database, Eye, FileText, AlertTriangle, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// 역할 데이터 샘플
const roleData = [
  { id: 1, name: '관리자', description: '모든 기능에 대한 접근 권한', users: 1 },
  { id: 2, name: '콘텐츠 편집자', description: '콘텐츠 및 제품 관리 권한', users: 2 },
  { id: 3, name: '커뮤니티 관리자', description: '커뮤니티 및 댓글 관리 권한', users: 1 },
  { id: 4, name: '분석가', description: '분석 데이터 조회 권한', users: 0 },
];

// 팀원 데이터 샘플
const teamData = [
  { id: 1, name: '김관리', email: 'admin@example.com', role: '관리자', lastLogin: '2025-04-22 14:30' },
  { id: 2, name: '이콘텐츠', email: 'content@example.com', role: '콘텐츠 편집자', lastLogin: '2025-04-21 09:15' },
  { id: 3, name: '박커뮤니티', email: 'community@example.com', role: '커뮤니티 관리자', lastLogin: '2025-04-22 10:45' },
  { id: 4, name: '최편집', email: 'editor@example.com', role: '콘텐츠 편집자', lastLogin: '2025-04-20 16:20' },
];

// 로그 데이터 샘플
const logData = [
  { id: 1, user: '김관리', action: '설정 변경', details: '보안 설정 업데이트', timestamp: '2025-04-22 14:35' },
  { id: 2, user: '이콘텐츠', action: '콘텐츠 추가', details: '새 제품 등록: 프리미엄 서비스', timestamp: '2025-04-22 11:20' },
  { id: 3, user: '시스템', action: '백업 완료', details: '자동 백업 완료됨', timestamp: '2025-04-22 03:00' },
  { id: 4, user: '박커뮤니티', action: '댓글 삭제', details: '부적절한 댓글 삭제', timestamp: '2025-04-21 15:45' },
  { id: 5, user: '김관리', action: '역할 생성', details: '새 역할 생성: 분석가', timestamp: '2025-04-21 10:15' },
];

// API 키 데이터 샘플
const apiKeyData = [
  { id: 1, name: '분석 도구 연동', key: '••••••••••••JK45', created: '2025-03-15', lastUsed: '2025-04-22' },
  { id: 2, name: '외부 서비스 연동', key: '••••••••••••RT67', created: '2025-04-01', lastUsed: '2025-04-20' },
];

const SecuritySection = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [showAddRole, setShowAddRole] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showAddApiKey, setShowAddApiKey] = useState(false);

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <ShieldCheck className="mr-2 h-6 w-6" />
        보안 및 접근 관리
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
          <TabsTrigger value="roles">
            <Users className="h-4 w-4 mr-2" />
            역할 및 권한
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Eye className="h-4 w-4 mr-2" />
            접근 로그
          </TabsTrigger>
          <TabsTrigger value="api">
            <Key className="h-4 w-4 mr-2" />
            API 키 관리
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Database className="h-4 w-4 mr-2" />
            고급 설정
          </TabsTrigger>
        </TabsList>

        {/* 역할 및 권한 관리 */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" /> 
                      역할 관리
                    </div>
                    <Button onClick={() => setShowAddRole(!showAddRole)} size="sm">
                      + 역할 추가
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showAddRole && (
                    <div className="mb-4 p-4 border rounded-md">
                      <h3 className="font-medium mb-2">새 역할 생성</h3>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="text-sm font-medium">역할 이름</label>
                          <Input placeholder="역할 이름 입력" className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">역할 설명</label>
                          <Input placeholder="역할 설명 입력" className="mt-1" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">접근 권한</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span>대시보드 접근</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>콘텐츠 편집</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>제품 관리</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>커뮤니티 관리</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>분석 조회</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span>설정 변경</span>
                              <Switch />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="outline" onClick={() => setShowAddRole(false)}>취소</Button>
                          <Button>저장</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs">
                        <tr>
                          <th className="py-2 px-4 text-left">역할</th>
                          <th className="py-2 px-4 text-left">설명</th>
                          <th className="py-2 px-4 text-left">사용자 수</th>
                          <th className="py-2 px-4 text-left">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roleData.map(role => (
                          <tr key={role.id} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium">{role.name}</td>
                            <td className="py-2 px-4 text-gray-600">{role.description}</td>
                            <td className="py-2 px-4">{role.users}</td>
                            <td className="py-2 px-4">
                              <Button variant="ghost" size="sm">
                                편집
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center">
                      <UserPlus className="h-4 w-4 mr-2" /> 
                      팀원 관리
                    </div>
                    <Button onClick={() => setShowInvite(!showInvite)} size="sm">
                      + 팀원 초대
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showInvite && (
                    <div className="mb-4 p-4 border rounded-md">
                      <h3 className="font-medium mb-2">팀원 초대</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium">이메일</label>
                          <Input type="email" placeholder="name@example.com" className="mt-1" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">역할 선택</label>
                          <select className="w-full mt-1 border p-2 rounded-md">
                            <option>역할 선택</option>
                            {roleData.map(role => (
                              <option key={role.id} value={role.name}>{role.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                          <Button variant="outline" onClick={() => setShowInvite(false)}>취소</Button>
                          <Button>초대 보내기</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-xs">
                        <tr>
                          <th className="py-2 px-4 text-left">이름</th>
                          <th className="py-2 px-4 text-left">이메일</th>
                          <th className="py-2 px-4 text-left">역할</th>
                          <th className="py-2 px-4 text-left">마지막 접속</th>
                          <th className="py-2 px-4 text-left">관리</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamData.map(member => (
                          <tr key={member.id} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-4">{member.name}</td>
                            <td className="py-2 px-4">{member.email}</td>
                            <td className="py-2 px-4">
                              <Badge variant="secondary">{member.role}</Badge>
                            </td>
                            <td className="py-2 px-4 text-xs">{member.lastLogin}</td>
                            <td className="py-2 px-4">
                              <Button variant="ghost" size="sm">
                                편집
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">권한 설정 팁</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>각 역할에 최소한의 필요 권한만 부여하세요.</li>
                    <li>관리자 권한은 신중하게 부여해야 합니다.</li>
                    <li>정기적으로 사용자 권한을 검토하세요.</li>
                    <li>사용하지 않는 계정은 비활성화하세요.</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">팀 규모</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{teamData.length}</div>
                    <div className="text-xs text-gray-500 mt-1">팀원</div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-xs text-gray-500">무료 플랜</div>
                      <div className="text-sm mt-1">최대 5명 초대 가능</div>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        플랜 업그레이드
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 접근 로그 */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" /> 
                  접근 로그
                </div>
                <div className="flex gap-2">
                  <Input 
                    type="search" 
                    placeholder="로그 검색..." 
                    className="w-60 h-8 text-xs"
                  />
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4" />
                    <span className="ml-1">내보내기</span>
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs">
                    <tr>
                      <th className="py-2 px-4 text-left">시간</th>
                      <th className="py-2 px-4 text-left">사용자</th>
                      <th className="py-2 px-4 text-left">작업</th>
                      <th className="py-2 px-4 text-left">세부 정보</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logData.map(log => (
                      <tr key={log.id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4 text-xs">{log.timestamp}</td>
                        <td className="py-2 px-4">{log.user}</td>
                        <td className="py-2 px-4">
                          <Badge variant={
                            log.action.includes('삭제') ? 'destructive' : 
                            log.action.includes('추가') || log.action.includes('생성') ? 'default' :
                            'secondary'
                          }>
                            {log.action}
                          </Badge>
                        </td>
                        <td className="py-2 px-4">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between mt-4 text-sm text-gray-500">
                <div>
                  총 {logData.length}개 로그 표시 중
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>이전</Button>
                  <Button variant="outline" size="sm">다음</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API 키 관리 */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center">
                  <Key className="h-4 w-4 mr-2" /> 
                  API 키 관리
                </div>
                <Button onClick={() => setShowAddApiKey(!showAddApiKey)} size="sm">
                  + 새 API 키 생성
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showAddApiKey && (
                <div className="mb-4 p-4 border rounded-md">
                  <h3 className="font-medium mb-2">API 키 생성</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-sm font-medium">키 이름</label>
                      <Input placeholder="API 키 설명 (용도)" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">권한 범위</label>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>읽기 권한</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>쓰기 권한</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>삭제 권한</span>
                          <Switch />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <Button variant="outline" onClick={() => setShowAddApiKey(false)}>취소</Button>
                      <Button>생성</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs">
                    <tr>
                      <th className="py-2 px-4 text-left">이름</th>
                      <th className="py-2 px-4 text-left">키</th>
                      <th className="py-2 px-4 text-left">생성일</th>
                      <th className="py-2 px-4 text-left">마지막 사용</th>
                      <th className="py-2 px-4 text-left">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeyData.map(key => (
                      <tr key={key.id} className="border-t hover:bg-gray-50">
                        <td className="py-2 px-4">{key.name}</td>
                        <td className="py-2 px-4 font-mono">{key.key}</td>
                        <td className="py-2 px-4">{key.created}</td>
                        <td className="py-2 px-4">{key.lastUsed}</td>
                        <td className="py-2 px-4">
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            삭제
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <AlertTriangle className="h-4 w-4 text-amber-500 inline mr-1" />
                API 키는 외부 서비스 연동에 사용되며, 노출되지 않도록 주의하세요.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 고급 설정 */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <Database className="h-4 w-4 mr-2 inline" /> 
                백업 및 스토리지
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium">자동 백업</div>
                  <div className="text-sm text-gray-500">매일 자동으로 데이터 백업</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium">개인 스토리지 연결</div>
                  <div className="text-sm text-gray-500">자체 스토리지에 데이터 저장</div>
                </div>
                <Button variant="outline" size="sm">
                  설정
                </Button>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div>
                  <div className="font-medium">데이터 내보내기</div>
                  <div className="text-sm text-gray-500">모든 데이터를 JSON 형식으로 내보내기</div>
                </div>
                <Button variant="outline" size="sm">
                  내보내기
                </Button>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <div className="font-medium">데이터 가져오기</div>
                  <div className="text-sm text-gray-500">기존 데이터 가져오기</div>
                </div>
                <Button variant="outline" size="sm">
                  가져오기
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-500">위험 영역</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <div>
                    <div className="font-medium">피어몰 데이터 초기화</div>
                    <div className="text-sm text-gray-500">모든 콘텐츠와 설정 초기화</div>
                  </div>
                  <Button variant="destructive" size="sm">
                    초기화
                  </Button>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-medium">피어몰 삭제</div>
                    <div className="text-sm text-gray-500">피어몰을 영구적으로 삭제</div>
                  </div>
                  <Button variant="destructive" size="sm">
                    삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default SecuritySection;
