
import React from 'react';
import { Sun, CloudRain, Cloud, Snowflake } from "lucide-react";

interface MapLegendProps {
  currentSeason: string;
  currentDate: Date;
}

const MapLegend: React.FC<MapLegendProps> = ({ currentSeason, currentDate }) => {
  // 계절에 맞는 아이콘 선택
  const renderSeasonIcon = () => {
    switch(currentSeason) {
      case '봄': return <Sun className="h-4 w-4 text-pink-400" />;
      case '여름': return <Sun className="h-4 w-4 text-green-500" />;
      case '가을': return <Cloud className="h-4 w-4 text-amber-500" />;
      case '겨울': return <Snowflake className="h-4 w-4 text-blue-300" />;
      default: return <Cloud className="h-4 w-4 text-purple-400" />;
    }
  };

  // 계절별 이벤트 데이터
  const getSeasonalEvents = () => {
    switch(currentSeason) {
      case '봄': return '꽃 축제, 신학기 이벤트';
      case '여름': return '물놀이, 바캉스 이벤트';
      case '가을': return '단풍 축제, 추수 이벤트';
      case '겨울': return '눈꽃 축제, 연말 이벤트';
      default: return '시즌 이벤트';
    }
  };

  return (
    <div className="absolute top-20 right-4 z-20 flex flex-col gap-2">
      {/* Community Status Legend */}
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg text-sm border border-gray-200 animate-fade-in">
        <h4 className="font-bold mb-2">범례</h4>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-community-primary"></div>
            <span>일반 커뮤니티</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>성장 중</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>위기 상황</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>유령 커뮤니티</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>이벤트 진행중</span>
          </div>
        </div>
      </div>
      
      {/* Season Info - Enhanced with more details */}
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg text-sm border border-gray-200 animate-fade-in">
        <div className="flex items-center gap-2 mb-2">
          {renderSeasonIcon()}
          <h4 className="font-bold">{currentSeason} 시즌</h4>
        </div>
        <p className="text-xs text-gray-600 mb-2">{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`}</p>
        
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">날씨 효과</span>
            <span className={`font-medium text-${getSeasonColor(currentSeason)}`}>
              {currentSeason === '봄' ? '맑음/소나기' : 
               currentSeason === '여름' ? '더움/폭우' : 
               currentSeason === '가을' ? '선선함/안개' : '추움/눈'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">활성 이벤트</span>
            <span className="font-medium">{Math.floor(Math.random() * 5) + 1}개</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-600">시즌 보너스</span>
            <span className="font-medium text-green-600">활성화</span>
          </div>
        </div>
        
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-1 mb-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-xs">{getSeasonalEvents()}</span>
          </div>
        </div>
      </div>
      
      {/* Weather Legend */}
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-lg text-sm border border-gray-200 animate-fade-in">
        <h4 className="font-bold mb-2">날씨 상태</h4>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Sun className="h-3 w-3 text-yellow-500" />
            <span>맑음</span>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="h-3 w-3 text-gray-500" />
            <span>흐림</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudRain className="h-3 w-3 text-blue-500" />
            <span>비</span>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake className="h-3 w-3 text-blue-300" />
            <span>눈</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getSeasonColor = (season: string): string => {
  switch (season) {
    case '봄': return 'pink-400';
    case '여름': return 'green-500';
    case '가을': return 'amber-500';
    case '겨울': return 'blue-300';
    default: return 'purple-400';
  }
};

export default React.memo(MapLegend);
