
import React from 'react';
import Header from "@/components/peermall/Header";
import Sidebar from "@/components/peermall/Sidebar";
import WelcomeBanner from "@/components/peermall/WelcomeBanner";
import StatCard from "@/components/peermall/StatCard";
import NotificationCard from "@/components/peermall/NotificationCard";
import PurchaseCard from "@/components/peermall/PurchaseCard";
import FriendRequestCard from "@/components/peermall/FriendRequestCard";
import ControllerCard from "@/components/peermall/ControllerCard"
import { Clock, ArrowUpRight, Trophy, Award, Bell } from 'lucide-react';

const Space = () => {
  return (
    <div className="min-h-screen bg-peermall-gray dark:bg-peermall-dark-gray flex font-sans transition-colors duration-300 ease-in-out">
      <Sidebar />
      
      <main className="flex-1 px-8 py-6 overflow-auto animate-fade-in">
        <Header />
        
        <WelcomeBanner />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="활동 시간" 
            session="마지막 세션 (3h)"
            percentage={50}
            color="bg-peermall-yellow text-peermall-dark-gray"
            icon={<Clock className="w-6 h-6" />}
          />
          <StatCard 
            title="진행 상황" 
            session="마지막 세션 (50%)"
            percentage={30}
            color="bg-peermall-blue text-white"
            icon={<ArrowUpRight className="w-6 h-6" />}
          />
          <StatCard 
            title="업적" 
            session="마지막 세션 (5 개의 업적)"
            percentage={65}
            color="bg-peermall-pink text-white"
            icon={<Trophy className="w-6 h-6" />}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm mb-6">
              <div className="flex items-center justify-between p-4 border-b border-peermall-light-gray">
                <h2 className="font-bold text-lg">최근 구매 내역</h2>
                <button className="text-peermall-blue flex items-center gap-1 text-sm font-medium">
                  모두 보기
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-peermall-light-gray">
                <PurchaseCard 
                  title="디지털 커뮤니티"
                  platform="피어몰" 
                  date="2025년 5월 15일" 
                  time="15:30"
                  image="https://images.unsplash.com/photo-1557682250-61b3df427a5f?q=80&w=100&auto=format&fit=crop"
                />
                <PurchaseCard 
                  title="신뢰 그룹"
                  platform="피어몰" 
                  date="2025년 5월 12일" 
                  time="08:20"
                  image="https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=100&auto=format&fit=crop"
                />
                <PurchaseCard 
                  title="커뮤니티 패키지"
                  platform="피어몰" 
                  date="2025년 5월 10일" 
                  time="19:45"
                  image="https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=100&auto=format&fit=crop"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ControllerCard 
                type="디지털 공간 만들기"
                color="bg-peermall-blue"
                message="직접 공간 생성 및 관리"
                image="https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=300&auto=format&fit=crop"
              />
              <ControllerCard 
                type="신뢰 그룹 형성"
                color="bg-peermall-pink"
                message="7인 추천인 기반 신뢰 시스템"
                image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-4 border-b border-peermall-light-gray">
                <h2 className="font-bold">알림 센터</h2>
                <button className="text-peermall-blue flex items-center gap-1 text-sm font-medium">
                  모두 보기
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2">
                <NotificationCard 
                  title="업데이트 완료"
                  message="버전 v2.3"
                  time="방금 전"
                  icon={<Bell className="w-5 h-5 text-peermall-blue" />}
                />
                <NotificationCard 
                  title="버전 2.0 사용 가능"
                  message="7일간 무료 체험"
                  time="2시간 전"
                  icon={<Bell className="w-5 h-5 text-peermall-blue" />}
                />
                <NotificationCard 
                  title="신뢰 업데이트"
                  message="새로운 추천인을 추가하세요"
                  time="오늘"
                  icon={<Award className="w-5 h-5 text-peermall-blue" />}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-4 border-b border-peermall-light-gray">
                <h2 className="font-bold">친구 요청</h2>
                <button className="text-peermall-blue flex items-center gap-1 text-sm font-medium">
                  모두 보기
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              <div className="py-2">
                <FriendRequestCard
                  name="김철수"
                  domain="chulsoo.com"
                  avatar="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
                />
                <FriendRequestCard
                  name="이영희"
                  domain="younghee.net"
                  avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
                />
                <FriendRequestCard
                  name="박지성"
                  domain="jisung.org"
                  avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Space;
