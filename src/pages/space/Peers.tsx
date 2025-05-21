
import React from 'react';
import Header from "@/components/peermall/Header";
import Sidebar from "@/components/peermall/Sidebar";
import { Users, Search, UserPlus } from 'lucide-react';

const Peers = () => {
  const peers = [
    { 
      id: 1, 
      name: '김철수', 
      role: '인증 피어', 
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
      status: 'online',
      trusted: true
    },
    { 
      id: 2, 
      name: '이영희', 
      role: '패밀리 멤버', 
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      status: 'online',
      trusted: true
    },
    { 
      id: 3, 
      name: '박지성', 
      role: '가디언', 
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop',
      status: 'offline',
      trusted: true
    },
    { 
      id: 4, 
      name: '정다솜', 
      role: '기본 회원', 
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      status: 'online',
      trusted: false
    },
    { 
      id: 5, 
      name: '한민수', 
      role: '인증 피어', 
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
      status: 'offline',
      trusted: true
    },
    { 
      id: 6, 
      name: '최지원', 
      role: '패밀리 멤버', 
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop',
      status: 'online',
      trusted: true
    },
  ];

  return (
    <div className="min-h-screen bg-peermall-gray flex">
      <Sidebar />
      
      <main className="flex-1 px-8 py-6 overflow-auto">
        <Header />
        
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">내 피어 네트워크</h2>
              <p className="text-muted-foreground">연결된 피어와 신뢰 관계를 관리하세요</p>
            </div>
            <button className="flex items-center gap-2 bg-peermall-blue text-white px-4 py-2 rounded-lg">
              <UserPlus className="w-5 h-5" />
              <span>피어 추가</span>
            </button>
          </div>
          
          <div className="flex items-center gap-3 mb-6 w-full max-w-md bg-peermall-light-gray p-2 rounded-lg">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="이름 또는 피어넘버로 검색"
              className="flex-1 bg-transparent border-none outline-none text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peers.map(peer => (
              <div key={peer.id} className="border border-peermall-light-gray rounded-lg p-4 hover:border-peermall-blue transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={peer.avatar} 
                      alt={peer.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${peer.status === 'online' ? 'bg-peermall-green' : 'bg-gray-400'}`}></span>
                  </div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {peer.name}
                      {peer.trusted && (
                        <span className="bg-peermall-light-blue text-peermall-blue text-[10px] px-1.5 py-0.5 rounded-full">신뢰</span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">{peer.role}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 text-xs bg-peermall-light-gray hover:bg-peermall-gray transition-colors py-1.5 rounded">
                    메시지
                  </button>
                  <button className="flex-1 text-xs bg-peermall-light-blue text-peermall-blue hover:bg-peermall-blue/20 transition-colors py-1.5 rounded">
                    프로필
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">7^7 신뢰 그룹</h2>
          <p className="text-muted-foreground mb-6">
            추천인 시스템을 통해 상호 인증된 사용자 네트워크를 확인하세요.
            현재 <span className="font-semibold text-peermall-blue">6명</span>의 추천인이 등록되어 있습니다.
            완전한 인증을 위해 <span className="font-semibold text-peermall-pink">1명</span>의 추천인이 더 필요합니다.
          </p>
          
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 rounded-full border-4 border-peermall-light-blue flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-white border border-peermall-light-gray flex items-center justify-center">
                  <Users className="w-12 h-12 text-peermall-blue" />
                </div>
              </div>
              
              {/* Connected peers circles */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-peermall-blue flex items-center justify-center">
                <span className="text-xs font-bold text-white">P1</span>
              </div>
              <div className="absolute top-1/4 right-2 w-10 h-10 rounded-full bg-peermall-blue flex items-center justify-center">
                <span className="text-xs font-bold text-white">P2</span>
              </div>
              <div className="absolute bottom-1/4 right-0 w-10 h-10 rounded-full bg-peermall-blue flex items-center justify-center">
                <span className="text-xs font-bold text-white">P3</span>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-peermall-blue flex items-center justify-center">
                <span className="text-xs font-bold text-white">P4</span>
              </div>
              <div className="absolute bottom-1/4 left-0 w-10 h-10 rounded-full bg-peermall-blue flex items-center justify-center">
                <span className="text-xs font-bold text-white">P5</span>
              </div>
              <div className="absolute top-1/4 left-2 w-10 h-10 rounded-full bg-peermall-blue flex items-center justify-center">
                <span className="text-xs font-bold text-white">P6</span>
              </div>
              
              {/* Empty peer circle */}
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 rounded-full bg-peermall-light-gray border-2 border-dashed border-peermall-blue flex items-center justify-center animate-pulse-light">
                <span className="text-xs font-bold text-peermall-blue">+</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Peers;
