
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Folder, Users, BadgeCheck, Award, MessageCircle, Settings, Flag, BarChart2, UserCheck, ChevronDown } from 'lucide-react';

const initialCategories = [
  { id: 1, name: '공지사항', write: true, read: true },
  { id: 2, name: '자유 게시판', write: true, read: true },
];
const initialQuests = [
  { id: 1, title: '신규 가입 첫 구매', type: '개인', reward: '10% 할인 쿠폰', progress: 80, status: '진행중', participants: 13 },
  { id: 2, title: '베스트 리뷰 작성', type: '개인', reward: '500포인트', progress: 100, status: '종료', participants: 10 },
];

const initialBadges = [
  { id: 1, name: '열정 유저', unlocked: true, description: '연속 7일 활발 활동', image: '🔥' },
  { id: 2, name: '첫 구매', unlocked: true, description: '첫 상품 구매', image: '🛍️' },
  { id: 3, name: '리뷰왕', unlocked: false, description: '리뷰 10개 작성', image: '✍️' },
];


const CommunityManagementSection = () => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [questOpen, setQuestOpen] = useState(false);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [filter, setFilter] = useState<'all'|'진행중'|'종료'>('all');

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Users className="mr-2 h-6 w-6" />
        커뮤니티 관리
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 기능 활성화 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Settings className="mr-2 inline h-4 w-4" /> 커뮤니티 기능 활성화/설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>• 게시판, 채팅, 이벤트, 퀘스트, 뱃지 시스템 등 주요 커뮤니티 기능 켜기/끄기 (스위치 형태 UI 추천)</li>
              <li>• 게시판 카테고리 <Button variant="ghost" size="sm" className="ml-1" onClick={() => setCategoryOpen(v => !v)}><Folder className="inline h-4 w-4" /> 카테고리 관리 <ChevronDown className="ml-1 h-3 w-3 inline" /></Button></li>
              {categoryOpen && (
                <div className="mt-2 ml-5">
                  <table className="w-full text-xs border">
                    <thead>
                      <tr className="text-left bg-gray-50">
                        <th className="py-1 pl-2">이름</th>
                        <th>글쓰기</th>
                        <th>읽기</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {initialCategories.map(cat => (
                        <tr key={cat.id} className="border-t">
                          <td className="pl-2 py-1">{cat.name}</td>
                          <td><input type="checkbox" checked={cat.write} disabled readOnly /></td>
                          <td><input type="checkbox" checked={cat.read} disabled readOnly /></td>
                          <td><Button variant="ghost" size="sm">설정</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <li>• 실시간 채팅 허용 여부 <Button variant="ghost" size="sm"><MessageCircle className="inline h-4 w-4" /> 허용 설정</Button></li>
              <li>• 금칙어 관리 <Button variant="ghost" size="sm"><Flag className="inline h-4 w-4" /> 항목 설정</Button></li>
            </ul>
          </CardContent>
        </Card>
        {/* 퀘스트/미션 관리 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Award className="mr-2 inline h-4 w-4" /> 퀘스트/미션 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="mb-3">퀘스트 생성 마법사</Button>
            <div>
              <span className="mr-2 text-xs text-gray-600">유형 필터:</span>
              <Button variant={filter==='all'? 'default':'outline'} size="sm" className="mr-1" onClick={()=>setFilter('all')}>전체</Button>
              <Button variant={filter==='진행중'? 'default':'outline'} size="sm" className="mr-1" onClick={()=>setFilter('진행중')}>진행중</Button>
              <Button variant={filter==='종료'? 'default':'outline'} size="sm" onClick={()=>setFilter('종료')}>종료</Button>
            </div>
            <div className="mt-3">
              <table className="w-full table-auto border text-xs">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th>제목</th><th>유형</th><th>보상</th><th>진행</th><th>상태</th><th>참여자</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {initialQuests.filter(q=>filter==='all'||q.status===filter).map(q => (
                    <tr key={q.id} className="border-t">
                      <td>{q.title}</td>
                      <td>{q.type}</td>
                      <td>{q.reward}</td>
                      <td>{q.progress}%</td>
                      <td>
                        <Badge variant={q.status==="진행중"?"default":"outline"}>{q.status}</Badge>
                      </td>
                      <td>{q.participants}</td>
                      <td><Button size="sm" variant="ghost">관리</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 뱃지 시스템 관리 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <BadgeCheck className="mr-2 inline h-4 w-4" /> 뱃지 시스템 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="mb-3" size="sm">+ 뱃지 생성</Button>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {initialBadges.map(badge => (
                <div
                  key={badge.id}
                  className={`border rounded-lg p-2 text-center relative ${!badge.unlocked && 'opacity-40 grayscale'}`}
                >
                  <div className="text-3xl mb-1">{badge.image}</div>
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-xs text-text-200 mb-2">{badge.description}</div>
                  {badge.unlocked 
                    ? <Badge className="bg-green-500" variant="default">활성</Badge>
                    : <Badge variant="outline">잠김</Badge>
                  }
                  <Button variant="ghost" size="icon" className="absolute top-1 right-1">⋮</Button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs space-y-1 text-gray-700">
              <div>• 자동/수동 부여 기준, 회수 기능 포함</div>
              <div>• 뱃지 표시 방식: 프로필/게시글 등 위치 설정</div>
            </div>
          </CardContent>
        </Card>

        {/* 추가 관리 영역 (콘텐츠 모더레이션, 사용자 관리, 레벨/포인트, 전문가 네트워크) */}
        <Card>
          <CardHeader>
            <CardTitle><Flag className="inline h-4 w-4 mr-1" /> 콘텐츠 모더레이션</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>게시글/댓글 승인 워크플로우 관리</li>
              <li>신고된 콘텐츠 목록 및 처리</li>
              <li>자동 필터링 및 금칙어 관리</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><UserCheck className="inline h-4 w-4 mr-1" /> 사용자 관리</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>회원 목록/검색, 활동 제한/권한 부여</li>
              <li>커뮤니티 참여 현황 확인</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><BarChart2 className="inline h-4 w-4 mr-1" /> 레벨 및 포인트 시스템</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>레벨업 정책(최대 레벨·필요 경험치), 포인트 적립/사용 규칙</li>
              <li>포인트 유효기간, 사용처(상품, 유료콘텐츠, 뱃지 구매 등) 설정</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle><Users className="inline h-4 w-4 mr-1" /> 전문가 네트워크</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>커뮤니티 내 전문가 인증 및 관리 기능(자격·역할 등)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CommunityManagementSection;

