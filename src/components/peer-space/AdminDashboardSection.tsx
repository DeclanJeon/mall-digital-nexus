
import React from "react";
import { BarChart2, User, FileText, ShoppingBag, Star, Bell, Calendar, MessageCircle, Shield, Zap, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const stats = [
  {
    label: "총 회원",
    value: "1,243",
    icon: <User className="text-primary-300 h-5 w-5" />,
  },
  {
    label: "신규 주문",
    value: "28",
    icon: <ShoppingBag className="text-primary-300 h-5 w-5" />,
  },
  {
    label: "메시지",
    value: "43",
    icon: <MessageCircle className="text-primary-300 h-5 w-5" />,
  },
  {
    label: "리뷰",
    value: "104",
    icon: <Star className="text-yellow-400 h-5 w-5" />,
  },
];

const recentActivities = [
  { icon: <Bell className="text-primary-300 h-4 w-4" />, text: "신규 회원 가입 (user92)", time: "5분 전" },
  { icon: <FileText className="text-primary-300 h-4 w-4" />, text: "새 콘텐츠 'Python 기초' 등록", time: "1시간 전" },
  { icon: <ShoppingBag className="text-primary-300 h-4 w-4" />, text: "제품 '스터디 노트' 3건 판매", time: "3시간 전" },
  { icon: <Star className="text-yellow-400 h-4 w-4" />, text: "신규 리뷰 '강의가 매우 유익해요'", time: "5시간 전" },
  { icon: <MessageCircle className="text-primary-300 h-4 w-4" />, text: "문의 메시지 '교환 요청드립니다'", time: "8시간 전" },
];

const systemNotices = [
  { title: "시스템 업데이트", description: "새로운 기능이 추가되었습니다: 실시간 알림", date: "2025-04-23" },
  { title: "보안 알림", description: "최근 보안 업데이트를 적용하세요", date: "2025-04-20" },
];

const questsEvents = [
  { 
    title: "봄맞이 할인 이벤트", 
    type: "event",
    progress: 65, 
    deadline: "2025-05-10",
    participants: 42 
  },
  { 
    title: "신규 가입 보상 퀘스트", 
    type: "quest",
    progress: 80, 
    deadline: "2025-04-30",
    participants: 156 
  },
];

const AdminDashboardSection: React.FC = () => {
  return (
    <section className="space-y-6">
      {/* 주요 지표 섹션 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col p-4 bg-primary-100/60 shadow-none text-primary-300 items-center">
            <div className="mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-primary-200">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 최근 활동 및 알림 */}
        <Card className="p-4 bg-white/70 border shadow-none">
          <div className="font-semibold mb-3 text-primary-300 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            최근 활동 및 알림
          </div>
          <div className="divide-y">
            {recentActivities.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 py-2">
                <div className="mt-0.5">{item.icon}</div>
                <div className="flex-1">
                  <span className="text-sm text-primary-300">{item.text}</span>
                  <div className="text-xs text-primary-200">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 피어몰 건강도 */}
        <Card className="p-4 bg-white/70 border shadow-none">
          <div className="font-semibold mb-3 text-primary-300 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            피어몰 건강도
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>신뢰도 점수</span>
                <span className="font-medium">87/100</span>
              </div>
              <Progress value={87} className="h-2" indicatorClassName="bg-green-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>활동 레벨</span>
                <span className="font-medium">높음</span>
              </div>
              <Progress value={75} className="h-2" indicatorClassName="bg-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>콘텐츠 품질</span>
                <span className="font-medium">매우 좋음</span>
              </div>
              <Progress value={90} className="h-2" indicatorClassName="bg-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 퀘스트 및 이벤트 현황 */}
        <Card className="p-4 bg-white/70 border shadow-none">
          <div className="font-semibold mb-3 text-primary-300 flex items-center gap-2">
            <Target className="w-5 h-5" />
            진행 중인 퀘스트/이벤트
          </div>
          <div className="space-y-4">
            {questsEvents.map((item, idx) => (
              <div key={idx} className="border border-primary-100 rounded-md p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.type === 'event' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {item.type === 'event' ? '이벤트' : '퀘스트'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-primary-200 mb-1">
                  <span>진행률: {item.progress}%</span>
                  <span>참여자: {item.participants}명</span>
                </div>
                <Progress value={item.progress} className="h-1.5" />
                <div className="text-xs text-primary-200 mt-1">마감: {item.deadline}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 광고 성과 및 시스템 공지 */}
        <Card className="p-4 bg-white/70 border shadow-none">
          <div className="mb-4">
            <div className="font-semibold mb-3 text-primary-300 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              광고 성과 요약
            </div>
            <div className="bg-primary-100/40 rounded-md p-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-primary-200">노출</div>
                  <div className="font-semibold">4,850</div>
                </div>
                <div>
                  <div className="text-primary-200">클릭</div>
                  <div className="font-semibold">236</div>
                </div>
                <div>
                  <div className="text-primary-200">CTR</div>
                  <div className="font-semibold">4.8%</div>
                </div>
                <div>
                  <div className="text-primary-200">수익</div>
                  <div className="font-semibold">₩8,600</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="font-semibold mb-3 text-primary-300 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              시스템 공지
            </div>
            <div className="space-y-2">
              {systemNotices.map((notice, idx) => (
                <div key={idx} className="p-2 bg-primary-100/20 rounded-md">
                  <div className="font-medium text-sm">{notice.title}</div>
                  <div className="text-xs text-primary-200">{notice.description}</div>
                  <div className="text-xs text-primary-200 mt-1">{notice.date}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 퀵 액션 */}
      <Card className="p-4 bg-white/70 border shadow-none">
        <div className="font-semibold mb-3 text-primary-300">퀵 액션</div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="default">새 콘텐츠 추가</Button>
          <Button size="sm" variant="default">새 제품 등록</Button>
          <Button size="sm" variant="outline">멤버 관리</Button>
          <Button size="sm" variant="outline">신규 퀘스트 생성</Button>
          <Button size="sm" variant="outline">이벤트 설정</Button>
        </div>
      </Card>
    </section>
  );
};

export default AdminDashboardSection;
