
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart2, Users, ShoppingBag, Activity, MessageCircle, QrCode, Download, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

// 방문 데이터 샘플
const visitData = [
  { name: '04-16', 방문자: 120, 페이지뷰: 240 },
  { name: '04-17', 방문자: 132, 페이지뷰: 278 },
  { name: '04-18', 방문자: 101, 페이지뷰: 189 },
  { name: '04-19', 방문자: 134, 페이지뷰: 320 },
  { name: '04-20', 방문자: 190, 페이지뷰: 390 },
  { name: '04-21', 방문자: 230, 페이지뷰: 456 },
  { name: '04-22', 방문자: 210, 페이지뷰: 389 }
];

// 매출 데이터 샘플
const salesData = [
  { name: '04-16', 매출: 52000 },
  { name: '04-17', 매출: 75000 },
  { name: '04-18', 매출: 48000 },
  { name: '04-19', 매출: 94000 },
  { name: '04-20', 매출: 112000 },
  { name: '04-21', 매출: 150000 },
  { name: '04-22', 매출: 135000 }
];

// 인기 콘텐츠 데이터 샘플
const popularContent = [
  { name: '제품 A', 조회수: 340 },
  { name: '서비스 B', 조회수: 280 },
  { name: '이벤트 C', 조회수: 220 },
  { name: '포트폴리오 D', 조회수: 190 },
  { name: '과정 E', 조회수: 140 }
];

// QR 코드 스캔 데이터 샘플
const qrScanData = [
  { name: 'QR-001', 스캔수: 78 },
  { name: 'QR-002', 스캔수: 45 },
  { name: 'QR-003', 스캔수: 134 },
  { name: 'QR-004', 스캔수: 23 },
  { name: 'QR-005', 스캔수: 65 }
];

// 사용자 레벨 분포 데이터 샘플
const userLevelData = [
  { name: '레벨 1', value: 35 },
  { name: '레벨 2', value: 25 },
  { name: '레벨 3', value: 18 },
  { name: '레벨 4', value: 15 },
  { name: '레벨 5', value: 7 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsSection = () => {
  const [activeTab, setActiveTab] = useState('traffic');
  const [timeRange, setTimeRange] = useState('week');

  const renderTimeRangeSelector = () => (
    <div className="flex justify-end mb-4">
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="기간 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">오늘</SelectItem>
          <SelectItem value="week">최근 7일</SelectItem>
          <SelectItem value="month">최근 30일</SelectItem>
          <SelectItem value="quarter">최근 3개월</SelectItem>
          <SelectItem value="year">최근 1년</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <section>
      <h2 className="text-2xl font-bold text-primary-300 mb-6 flex items-center">
        <BarChart2 className="mr-2 h-6 w-6" />
        통계 및 분석
      </h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <TabsTrigger value="traffic">
            <Activity className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">방문/트래픽</span>
          </TabsTrigger>
          <TabsTrigger value="sales">
            <ShoppingBag className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">매출 분석</span>
          </TabsTrigger>
          <TabsTrigger value="behavior">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">사용자 행동</span>
          </TabsTrigger>
          <TabsTrigger value="community">
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">커뮤니티</span>
          </TabsTrigger>
          <TabsTrigger value="qr">
            <QrCode className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">QR 코드</span>
          </TabsTrigger>
          <TabsTrigger value="ads">
            <Activity className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">광고 성과</span>
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">보고서</span>
          </TabsTrigger>
        </TabsList>

        {/* 방문/트래픽 분석 */}
        <TabsContent value="traffic" className="space-y-4">
          {renderTimeRangeSelector()}
          <Card>
            <CardHeader>
              <CardTitle>방문/트래픽 추이</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="방문자" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="페이지뷰" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>유입 경로 분석</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '직접 접속', value: 40 },
                        { name: '검색엔진', value: 25 },
                        { name: '소셜미디어', value: 15 },
                        { name: '외부링크', value: 10 },
                        { name: 'QR코드', value: 10 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>디바이스 사용 분석</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '모바일', value: 65 },
                        { name: '데스크톱', value: 30 },
                        { name: '태블릿', value: 5 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                      <Cell fill="#FFBB28" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 매출 분석 */}
        <TabsContent value="sales" className="space-y-4">
          {renderTimeRangeSelector()}
          <Card>
            <CardHeader>
              <CardTitle>매출 추이</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₩${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="매출" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">총 매출</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₩666,000</div>
                <div className="text-xs text-green-500 mt-1">+12.5% 전주 대비</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">총 주문 건수</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48건</div>
                <div className="text-xs text-green-500 mt-1">+8.2% 전주 대비</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">평균 주문 금액</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₩13,875</div>
                <div className="text-xs text-green-500 mt-1">+4.1% 전주 대비</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 사용자 행동 분석 */}
        <TabsContent value="behavior" className="space-y-4">
          {renderTimeRangeSelector()}
          <Card>
            <CardHeader>
              <CardTitle>인기 콘텐츠/상품</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={popularContent}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="조회수" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">평균 세션 시간</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4분 32초</div>
                <div className="text-xs text-green-500 mt-1">+0:42 전주 대비</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">퀘스트 완료율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <div className="text-xs text-red-500 mt-1">-3.2% 전주 대비</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">뱃지 획득 비율</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42%</div>
                <div className="text-xs text-green-500 mt-1">+5.7% 전주 대비</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 커뮤니티 분석 */}
        <TabsContent value="community" className="space-y-4">
          {renderTimeRangeSelector()}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>사용자 활동 분석</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: '게시글', 수량: 78 },
                    { name: '댓글', 수량: 245 },
                    { name: '좋아요', 수량: 312 },
                    { name: '공유', 수량: 42 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="수량" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>사용자 레벨 분포</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={userLevelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* QR 코드 분석 */}
        <TabsContent value="qr" className="space-y-4">
          {renderTimeRangeSelector()}
          <Card>
            <CardHeader>
              <CardTitle>QR 코드별 스캔 횟수</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={qrScanData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="스캔수" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>스캔 위치 분포</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '서울', value: 45 },
                        { name: '경기', value: 25 },
                        { name: '부산', value: 15 },
                        { name: '기타', value: 15 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                      <Cell fill="#FFBB28" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>스캔 후 활동</CardTitle>
              </CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: '제품 조회', value: 40 },
                        { name: '회원가입', value: 20 },
                        { name: '구매', value: 15 },
                        { name: '이탈', value: 25 }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                      <Cell fill="#FFBB28" />
                      <Cell fill="#FF8042" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 광고 성과 분석 */}
        <TabsContent value="ads" className="space-y-4">
          {renderTimeRangeSelector()}
          <Card>
            <CardHeader>
              <CardTitle>광고 성과 지표</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-gray-500">광고 집행 데이터가 없습니다.</p>
                <Button variant="outline" className="mt-4">
                  광고 캠페인 시작하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보고서 생성 */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>맞춤 보고서 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">보고서 유형</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="보고서 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">종합 보고서</SelectItem>
                      <SelectItem value="traffic">방문/트래픽 보고서</SelectItem>
                      <SelectItem value="sales">매출 보고서</SelectItem>
                      <SelectItem value="behavior">사용자 행동 보고서</SelectItem>
                      <SelectItem value="community">커뮤니티 보고서</SelectItem>
                      <SelectItem value="qr">QR 코드 보고서</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">기간 선택</label>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <Input type="date" />
                    </div>
                    <div className="w-1/2">
                      <Input type="date" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  보고서 생성 및 다운로드
                </Button>
              </div>

              <div className="mt-8">
                <h3 className="font-medium mb-2">최근 생성한 보고서</h3>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs">
                    <tr>
                      <th className="py-2 px-4 text-left">보고서 이름</th>
                      <th className="py-2 px-4 text-left">생성일</th>
                      <th className="py-2 px-4 text-left">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="py-2 px-4">3월 종합 보고서</td>
                      <td className="py-2 px-4">2025-04-01</td>
                      <td className="py-2 px-4">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Download className="h-3 w-3 mr-1" />
                          다운로드
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2 px-4">Q1 매출 보고서</td>
                      <td className="py-2 px-4">2025-03-31</td>
                      <td className="py-2 px-4">
                        <Button variant="ghost" size="sm" className="h-8">
                          <Download className="h-3 w-3 mr-1" />
                          다운로드
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default AnalyticsSection;
