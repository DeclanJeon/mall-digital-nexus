
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Settings, ExternalLink, Download, List, Image, Edit, Trash2, PlusCircle, Link2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const dummyQRCodes = [
  { id: 1, purpose: "퀘스트 참여", destination: "퀘스트: 신규 가입", scans: 39, created: "2024-04-20" },
  { id: 2, purpose: "제품 페이지", destination: "상품A", scans: 21, created: "2024-03-10" },
  { id: 3, purpose: "오프라인 장소", destination: "서울센터", scans: 15, created: "2024-02-28" },
];

const QRCodeManagementSection = () => {
  const [showAll, setShowAll] = useState(false);

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <QrCode className="mr-2 h-6 w-6" />
        QR 코드 관리
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 생성 및 커스터마이징 */}
        <Card>
          <CardHeader>
            <CardTitle><PlusCircle className="inline h-4 w-4 mr-2" /> QR 코드 생성 및 사용자화</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>피어몰/제품/콘텐츠/이벤트/퀘스트/오프라인 장소 등 다양한 목적 코드 생성</li>
              <li>로고, 색상 등 커스터마이징 지원 <Button variant="ghost" size="sm"><Image className="inline h-4 w-4" /> 미리보기</Button></li>
            </ul>
            <Button className="mt-4" variant="default" size="sm">
              QR 코드 생성하기
            </Button>
          </CardContent>
        </Card>
        {/* 활용 전략 및 설정 */}
        <Card>
          <CardHeader>
            <CardTitle><Settings className="inline h-4 w-4 mr-2" /> QR 코드 활용 전략 설정</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>QR 스캔 시 연결될 페이지/제공정보/액션 설정</li>
              <li>예: 자동 체크인, 쿠폰 지급, 퀘스트 시작 등 정의</li>
              <li>스캔 통계 및 히스토리 추적</li>
            </ul>
            <Button size="sm" variant="outline">연결 전략 관리</Button>
          </CardContent>
        </Card>
        {/* QR 코드 목록 관리 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <List className="inline h-4 w-4 mr-2" /> QR 코드 목록 조회 및 관리
            </CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full border text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th>용도</th>
                  <th>연결대상</th>
                  <th>생성일</th>
                  <th>스캔수</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {dummyQRCodes.slice(0, showAll ? undefined : 3).map(qr => (
                  <tr key={qr.id} className="border-t">
                    <td>{qr.purpose}</td>
                    <td>{qr.destination}</td>
                    <td>{qr.created}</td>
                    <td>{qr.scans}</td>
                    <td>
                      <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="outline" onClick={()=>setShowAll(v=>!v)}>
                {showAll ? "접기" : "더 보기"}
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* 오프라인 연계 도구 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <ExternalLink className="inline h-4 w-4 mr-2" /> 오프라인 연계 도구
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>인쇄 최적화 QR 코드 다운로드 <Button size="sm" variant="ghost"><Download className="h-4 w-4 inline" /> PDF 다운로드</Button></li>
              <li>디지털 명함 또는 오프라인 장소 연동 관리 <Button size="sm" variant="ghost"><Link2 className="h-4 w-4 inline" /> 연동 관리</Button></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default QRCodeManagementSection;
