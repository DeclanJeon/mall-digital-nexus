
import React from 'react';
import Header from "@/components/peermall/Header";
import Sidebar from "@/components/peermall/Sidebar";
import { Map, Users, Globe } from 'lucide-react';

const Community = () => {
  return (
    <div className="min-h-screen bg-peermall-gray flex">
      <Sidebar />
      
      <main className="flex-1 px-8 py-6 overflow-auto">
        <Header />
        
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-bold mb-4">지구 (The Globe)</h2>
          <p className="text-muted-foreground mb-6">
            모든 피어가 참여하고 상호작용하는 피어몰의 공통적인 가상 커뮤니티 공간입니다.
            각 커뮤니티 구역이 하나의 '지구'에 모여 있습니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-peermall-light-gray rounded-lg p-5 hover:border-peermall-blue transition-colors">
              <div className="w-12 h-12 bg-peermall-light-blue rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-peermall-blue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">글로벌 커뮤니티</h3>
              <p className="text-sm text-muted-foreground">모든 피어몰 사용자가 참여하는 공통 커뮤니티 공간입니다.</p>
              <button className="mt-4 text-peermall-blue font-medium text-sm">살펴보기</button>
            </div>
            
            <div className="border border-peermall-light-gray rounded-lg p-5 hover:border-peermall-blue transition-colors">
              <div className="w-12 h-12 bg-peermall-light-blue rounded-lg flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-peermall-blue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">피어몰 커뮤니티</h3>
              <p className="text-sm text-muted-foreground">피어몰 소유자가 자체적으로 운영하는 개별 커뮤니티 공간입니다.</p>
              <button className="mt-4 text-peermall-blue font-medium text-sm">생성하기</button>
            </div>
            
            <div className="border border-peermall-light-gray rounded-lg p-5 hover:border-peermall-blue transition-colors">
              <div className="w-12 h-12 bg-peermall-light-blue rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-peermall-blue" />
              </div>
              <h3 className="font-semibold text-lg mb-2">일반 유저 커뮤니티</h3>
              <p className="text-sm text-muted-foreground">피어몰을 소유하지 않은 사용자가 생성하는 소규모 개인 공간입니다.</p>
              <button className="mt-4 text-peermall-blue font-medium text-sm">참여하기</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-peermall-light-gray">
            <h2 className="text-xl font-bold">커뮤니티 지도</h2>
            <p className="text-sm text-muted-foreground">지구(The Globe) 내의 활동적인 커뮤니티 공간을 탐색해보세요.</p>
          </div>
          <div className="aspect-[16/9] bg-peermall-gray flex items-center justify-center">
            <div className="text-center px-6">
              <Globe className="w-16 h-16 mx-auto text-peermall-blue mb-4" />
              <h3 className="text-xl font-bold mb-2">커뮤니티 지도 불러오는 중</h3>
              <p className="text-muted-foreground">모든 커뮤니티 구역과 활동을 시각화하는 지도를 준비 중입니다.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
