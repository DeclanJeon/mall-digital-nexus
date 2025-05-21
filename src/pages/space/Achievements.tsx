
import React from 'react';
import Header from "@/components/peermall/Header";
import Sidebar from "@/components/peermall/Sidebar";
import { Award, Shield, Trophy, CheckCircle, Star } from 'lucide-react';

const Achievements = () => {
  const badges = [
    { 
      id: 1, 
      name: '신뢰받는 피어', 
      description: '7명의 추천인으로부터 인증을 받음', 
      progress: 85,
      icon: <Shield className="w-5 h-5 text-peermall-blue" />,
      color: 'bg-peermall-light-blue'
    },
    { 
      id: 2, 
      name: '콘텐츠 크리에이터', 
      description: '10개 이상의 양질의 콘텐츠 제작', 
      progress: 100,
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      color: 'bg-yellow-50',
      completed: true
    },
    { 
      id: 3, 
      name: '커뮤니티 빌더', 
      description: '활성화된 커뮤니티 구역 생성', 
      progress: 60,
      icon: <Trophy className="w-5 h-5 text-peermall-pink" />,
      color: 'bg-pink-50'
    },
    { 
      id: 4, 
      name: '정보 허브', 
      description: '외부 정보 통합 및 큐레이션', 
      progress: 40,
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      color: 'bg-green-50'
    }
  ];

  const certifications = [
    {
      id: 1,
      name: '피어몰 공식 인증',
      date: '2025년 4월 20일',
      issuer: '지케이씨',
      status: 'active',
      icon: '/lovable-uploads/349fda6f-fae3-4fd7-b0d7-13fe9031a785.png'
    },
    {
      id: 2,
      name: '정품 인증',
      date: '2025년 3월 15일',
      issuer: '패밀리 멤버',
      status: 'active',
      icon: '/lovable-uploads/349fda6f-fae3-4fd7-b0d7-13fe9031a785.png'
    }
  ];

  return (
    <div className="min-h-screen bg-peermall-gray flex">
      <Sidebar />
      
      <main className="flex-1 px-8 py-6 overflow-auto">
        <Header />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">인증 및 뱃지</h2>
                  <p className="text-muted-foreground">획득한 뱃지와 인증 현황을 관리하세요</p>
                </div>
                <div className="bg-peermall-light-blue rounded-full p-3">
                  <Award className="w-6 h-6 text-peermall-blue" />
                </div>
              </div>
              
              <div className="space-y-4">
                {badges.map(badge => (
                  <div key={badge.id} className="border border-peermall-light-gray rounded-lg p-4 hover:border-peermall-blue transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`${badge.color} p-2.5 rounded-lg`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{badge.name}</h3>
                          <span className="text-xs text-peermall-blue font-medium">
                            {badge.progress}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
                        <div className="progress-bar">
                          <div 
                            className={`progress-value ${badge.completed ? 'bg-peermall-green' : 'bg-peermall-blue'}`}
                            style={{ width: `${badge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">공식 인증</h2>
            <p className="text-sm text-muted-foreground mb-6">
              피어몰 인증 및 신뢰성을 증명하는 공식 인증서입니다.
            </p>
            
            <div className="space-y-4">
              {certifications.map(cert => (
                <div key={cert.id} className="border border-peermall-light-gray rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <img 
                      src={cert.icon} 
                      alt={cert.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{cert.name}</h3>
                      <p className="text-xs text-muted-foreground">{cert.issuer} 발급</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{cert.date}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                      활성
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 border border-peermall-blue text-peermall-blue font-medium rounded-lg py-2 hover:bg-peermall-light-blue transition-colors">
              새 인증 요청
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">소유권 증명</h2>
          <p className="text-muted-foreground mb-6">
            귀하의 디지털 자산과 콘텐츠에 대한 소유권을 등록하고 관리하세요.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-dashed border-peermall-blue rounded-lg p-5 flex flex-col items-center justify-center hover:bg-peermall-light-blue transition-colors cursor-pointer">
              <div className="w-14 h-14 bg-peermall-light-blue rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-peermall-blue" />
              </div>
              <h3 className="font-semibold text-center mb-1">새 소유권 등록</h3>
              <p className="text-xs text-center text-muted-foreground">
                디지털 자산 및 콘텐츠의 소유권을 안전하게 등록하세요
              </p>
            </div>
            
            <div className="border border-peermall-light-gray rounded-lg p-5 hover:border-peermall-blue transition-colors">
              <h3 className="font-semibold mb-2">디지털 예술 작품</h3>
              <p className="text-xs text-muted-foreground mb-3">
                2025년 4월 10일 등록
              </p>
              <div className="h-28 bg-gray-100 rounded-lg mb-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                  검증됨
                </span>
                <button className="text-xs text-peermall-blue">
                  상세 보기
                </button>
              </div>
            </div>
            
            <div className="border border-peermall-light-gray rounded-lg p-5 hover:border-peermall-blue transition-colors">
              <h3 className="font-semibold mb-2">커뮤니티 콘텐츠</h3>
              <p className="text-xs text-muted-foreground mb-3">
                2025년 3월 22일 등록
              </p>
              <div className="h-28 bg-gray-100 rounded-lg mb-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                  검증됨
                </span>
                <button className="text-xs text-peermall-blue">
                  상세 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Achievements;
