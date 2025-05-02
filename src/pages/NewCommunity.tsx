
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import UniverseNavigator from '@/components/community/UniverseNavigator';
import ForumBoard from '@/components/community/ForumBoard';

const NewCommunity = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  
  // Reset selected channel when the component mounts
  useEffect(() => {
    setSelectedChannelId(null);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#121620] text-gray-100 pb-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-purple-900/70 to-blue-900/70 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="stars"></div>
          <div className="stars2"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            커뮤니티 유니버스
          </h1>
          <p className="text-xl max-w-2xl text-blue-100 mb-8">
            다양한 행성과 채널에서 소통하고 정보를 공유하세요.
            당신의 여정이 여기서 시작됩니다.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              행성 탐색 시작하기
            </Button>
            <Button variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-900/30">
              사용자 가이드
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative">
        {selectedChannelId ? (
          <ForumBoard 
            channelId={selectedChannelId} 
            onBack={() => setSelectedChannelId(null)} 
          />
        ) : (
          <UniverseNavigator 
            onChannelSelect={(channelId) => setSelectedChannelId(channelId)} 
          />
        )}
      </div>
      
      <style jsx>{`
        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(2px 2px at 20px 30px, #eee, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
                            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0, 0, 0, 0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: moveStars 100s linear infinite;
        }
        
        .stars2 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(1px 1px at 100px 150px, #eee, rgba(0, 0, 0, 0)),
                            radial-gradient(1px 1px at 200px 50px, #fff, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 300px 250px, #fff, rgba(0, 0, 0, 0)),
                            radial-gradient(2px 2px at 400px 350px, #ddd, rgba(0, 0, 0, 0));
          background-repeat: repeat;
          background-size: 400px 400px;
          animation: moveStars 150s linear infinite;
        }
        
        @keyframes moveStars {
          from { background-position: 0 0; }
          to { background-position: 200px 200px; }
        }
      `}</style>
    </div>
  );
};

export default NewCommunity;
