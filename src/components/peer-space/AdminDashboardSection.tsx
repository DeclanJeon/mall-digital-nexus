
import React from "react";
import { BarChart2, User, FileText, ShoppingBag, Star, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    label: "총 회원",
    value: "1,243",
    icon: <User className="text-primary-300 h-5 w-5" />,
  },
  {
    label: "콘텐츠",
    value: "38",
    icon: <FileText className="text-primary-300 h-5 w-5" />,
  },
  {
    label: "제품 수",
    value: "15",
    icon: <ShoppingBag className="text-primary-300 h-5 w-5" />,
  },
  {
    label: "리뷰",
    value: "104",
    icon: <Star className="text-yellow-400 h-5 w-5" />,
  },
];

const recentActivities = [
  { icon: <Bell className="text-primary-300 h-4 w-4" />, text: "신규 회원 가입 (user92)" },
  { icon: <FileText className="text-primary-300 h-4 w-4" />, text: "새 콘텐츠 'Python 기초' 등록" },
  { icon: <ShoppingBag className="text-primary-300 h-4 w-4" />, text: "제품 '스터디 노트' 3건 판매" },
];

const AdminDashboardSection: React.FC = () => {
  return (
    <section className="space-y-8">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-0">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex flex-col p-4 bg-primary-100/60 shadow-none text-primary-300 items-center">
              <div className="mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-primary-200">{stat.label}</div>
            </Card>
          ))}
        </div>
        <Card className="flex-1 md:max-w-[340px] p-4 bg-primary-100/60 shadow-none mt-4 md:mt-0">
          <div className="font-semibold mb-2 text-primary-300 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2" />
            통계 요약
          </div>
          <ul className="text-xs text-primary-200 space-y-1">
            <li>월간 방문자: <span className="font-bold text-primary-300">1,738</span>명</li>
            <li>일간 신규 가입: <span className="font-bold text-primary-300">5</span>명</li>
            <li>콘텐츠 조회수: <span className="font-bold text-primary-300">630</span></li>
          </ul>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4 bg-white/70 border shadow-none">
          <div className="font-semibold mb-2 text-primary-300">최근 활동 현황</div>
          <ul className="space-y-2">
            {recentActivities.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-primary-200 text-sm">
                {item.icon}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-4 bg-white/70 border shadow-none">
          <div className="font-semibold mb-3 text-primary-300">퀵 액션</div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="default">새 콘텐츠 추가</Button>
            <Button size="sm" variant="default">새 제품 등록</Button>
            <Button size="sm" variant="outline">멤버 관리</Button>
            <Button size="sm" variant="outline">설정 바로가기</Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AdminDashboardSection;
