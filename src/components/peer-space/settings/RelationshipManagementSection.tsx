
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User, Check, X, UserPlus, Link2, Search, Star, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const dummyRequests = [
  { id: 1, name: '홍길동', type: '친구', peerNumber: 'P-102', status: '대기' },
  { id: 2, name: '김영희', type: '스폰서', peerNumber: 'P-205', status: '대기' },
];

const dummyConnections = [
  { id: 1, name: '유관순', relation: '팔로워', peerNumber: 'P-201' },
  { id: 2, name: '이순신', relation: '에이전트', peerNumber: 'P-150' },
  { id: 3, name: '신사임당', relation: '협력 피어몰', peerNumber: 'M-327' },
];

const RelationshipManagementSection = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <Link2 className="mr-2 h-6 w-6" />
        관계 관리
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 요청 관리 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <UserPlus className="inline h-4 w-4 mr-2" /> 요청 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs border">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th>이름</th>
                  <th>유형</th>
                  <th>피어넘버</th>
                  <th>처리</th>
                </tr>
              </thead>
              <tbody>
                {dummyRequests.map(r => (
                  <tr key={r.id} className="border-t">
                    <td>{r.name}</td>
                    <td>{r.type}</td>
                    <td>{r.peerNumber}</td>
                    <td>
                      <Button variant="outline" size="icon"><Check className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="icon"><X className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        {/* 연결 목록 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Users className="inline h-4 w-4 mr-2" /> 연결 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-xs border">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th>이름</th>
                  <th>관계</th>
                  <th>피어넘버</th>
                </tr>
              </thead>
              <tbody>
                {dummyConnections.slice(0, showAll ? undefined : 3).map(c => (
                  <tr key={c.id} className="border-t">
                    <td>{c.name}</td>
                    <td>
                      <Badge variant="secondary">{c.relation}</Badge>
                    </td>
                    <td>{c.peerNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button size="sm" className="mt-2" variant="outline" onClick={() => setShowAll((v) => !v)}>
              {showAll ? "간략히" : "전체 보기"}
            </Button>
          </CardContent>
        </Card>

        {/* 관계 설정 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Settings className="inline h-4 w-4 mr-2" /> 관계 설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>관계 유형별 정보 공유 범위/상호작용 옵션 설정</li>
              <li>피어넘버 기반 관계 요청/관리 지원</li>
              <li>추천인 시스템 지원</li>
            </ul>
            <Button size="sm" variant="ghost" className="mt-2"><Search className="inline h-4 w-4" /> 사용자 피어넘버 검색</Button>
          </CardContent>
        </Card>
        {/* 멤버십 프로그램 관리 */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Star className="inline h-4 w-4 mr-2" /> 멤버십 프로그램 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>충성 고객 등급 및 혜택 설정</li>
              <li>회원 목록 조회, 등급별 운영</li>
            </ul>
            <Button size="sm" variant="ghost" className="mt-2">등급 및 혜택 설정</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RelationshipManagementSection;
