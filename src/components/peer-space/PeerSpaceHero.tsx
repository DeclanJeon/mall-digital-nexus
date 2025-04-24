
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PeerMallConfig } from './types';

interface PeerSpaceHeroProps {
  config: PeerMallConfig;
  isOwner: boolean;
}

const PeerSpaceHero: React.FC<PeerSpaceHeroProps> = ({ config, isOwner }) => {
  return (
    <section 
      className="relative rounded-xl overflow-hidden bg-gradient-to-r from-blue-700 to-purple-700 mb-8"
      style={{
        backgroundImage: config.coverImage 
          ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(${config.coverImage})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 py-16 md:py-20 text-white">
        <div className="max-w-2xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {config.badges.slice(0, 3).map((badge, index) => (
              <Badge 
                key={index}
                className="bg-white/20 text-white border-none hover:bg-white/30"
              >
                {badge}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{config.title}</h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-6">
            {config.description}
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button className="bg-white text-blue-700 hover:bg-white/90">
              둘러보기
            </Button>
            
            {isOwner ? (
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                커버 이미지 변경
              </Button>
            ) : (
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                문의하기
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent h-16"></div>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center relative z-10 -mb-4 pb-6">
          <div className="flex items-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
              <span className="text-white/80 text-sm">소유자: </span>
              <span className="text-white font-medium ml-1">{config.owner}</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hidden sm:flex items-center">
              <span className="text-white/80 text-sm">피어 번호: </span>
              <span className="text-white font-medium ml-1">{config.peerNumber}</span>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
              <span className="text-white/80 text-sm mr-1">팔로워 </span>
              <span className="text-white font-medium">{config.followers.toLocaleString()}</span>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hidden md:flex items-center">
              <span className="text-white/80 text-sm mr-1">추천 </span>
              <span className="text-white font-medium">{config.recommendations.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PeerSpaceHero;
