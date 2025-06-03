
import React from 'react';
import { CommunityZone } from '@/types/community';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, MessageSquare, Calendar, FileImage, Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CommunityInfoPanelProps {
  selectedZone: CommunityZone;
  navigateToCommunity: (zone: CommunityZone) => void;
  handleJoinCommunity: (communityId: string) => void;
  handleLeaveCommunity: (communityId: string) => void;
  setSelectedZone: (zone: CommunityZone | null) => void;
  setIsEventsDialogOpen: (isOpen: boolean) => void;
}

const CommunityInfoPanel: React.FC<CommunityInfoPanelProps> = ({
  selectedZone,
  navigateToCommunity,
  handleJoinCommunity,
  handleLeaveCommunity,
  setSelectedZone,
  setIsEventsDialogOpen
}) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 z-20 animate-scale-in">
      <Card className="bg-white/95 backdrop-blur-sm p-4 shadow-lg border border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold flex items-center">
              {selectedZone.name}
              {selectedZone.privacy === "private" && (
                <Badge variant="outline" className="ml-2 px-1">Private</Badge>
              )}
            </h3>
            <p className="text-sm text-gray-500">운영: {selectedZone.owner}</p>
          </div>
          <Badge 
            className={`${
              selectedZone.status === "growing" ? "bg-green-500" : 
              selectedZone.status === "crisis" ? "bg-red-500" : 
              selectedZone.status === "abandoned" ? "bg-gray-500" : 
              "bg-community-primary"
            } text-white`}
          >
            활력 지수: {selectedZone.vitalityIndex}
          </Badge>
        </div>
        
        {/* Display community image if available */}
        {selectedZone.imageUrl && (
          <div className="mb-3 rounded-md overflow-hidden">
            {selectedZone.imageType === 'video' ? (
              <video 
                src={selectedZone.imageUrl} 
                className="w-full h-auto max-h-48 object-cover" 
                controls 
                autoPlay muted 
                loop
              />
            ) : selectedZone.imageType === 'gif' || selectedZone.imageType === 'image' ? (
              <img 
                src={selectedZone.imageUrl} 
                alt={selectedZone.name} 
                className="w-full h-auto max-h-48 object-cover" 
              />
            ) : selectedZone.imageType === 'url' ? (
              <div className="bg-gray-100 p-2 text-sm rounded-md">
                <a href={selectedZone.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                  <FileImage className="h-4 w-4 mr-1" />
                  외부 미디어 링크
                </a>
              </div>
            ) : null}
          </div>
        )}
        
        {/* Display emoji if available */}
        {selectedZone.emoji && (
          <div className="mb-3 text-center">
            <span className="text-4xl">{selectedZone.emoji}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-community-primary" />
            <span>{selectedZone.memberCount.toLocaleString()}명</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-community-primary" />
            <span>{selectedZone.postCount.toLocaleString()}개</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-community-primary" />
            <span>{selectedZone.lastActive}</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedZone.weatherData ? (
              <>
                {getWeatherIcon(selectedZone.weatherData.weatherType)}
                {selectedZone.weatherData.temperature}°C, 
                {getWeatherLabel(selectedZone.weatherData.weatherType)}
              </>
            ) : (
              <>
                {getWeatherIcon(selectedZone.weather)}
                {getWeatherLabel(selectedZone.weather)}
              </>
            )}
          </div>
        </div>
        
        {/* Location information */}
        {selectedZone.locationInfo && (
          <div className="mb-3 text-sm">
            <p className="text-gray-600">
              {selectedZone.locationInfo.city && `${selectedZone.locationInfo.city}, `}
              {selectedZone.locationInfo.region && `${selectedZone.locationInfo.region}, `}
              {selectedZone.locationInfo.country}
            </p>
          </div>
        )}
        
        {selectedZone.hasSosSignal && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-2 rounded mb-3 text-sm flex items-center">
            <span className="font-bold">SOS 신호!</span>
            <span className="ml-2">이 커뮤니티는 위기 상황입니다. 도움이 필요합니다.</span>
          </div>
        )}
        
        {selectedZone.hasEvent && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 p-2 rounded mb-3 text-sm flex items-center">
            <span className="font-bold">이벤트 진행 중!</span>
            <span className="ml-2">특별 이벤트에 참여하세요.</span>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setIsEventsDialogOpen(true)}>
              상세보기
            </Button>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-community-tertiary hover:bg-community-primary"
            onClick={() => navigateToCommunity(selectedZone)}
          >
            방문하기
          </Button>
          
          {/* Join/Leave button */}
          {selectedZone.isMember ? (
            <Button 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => handleLeaveCommunity(selectedZone.id)}
            >
              탈퇴하기
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="border-green-300 text-green-600 hover:bg-green-50"
              onClick={() => handleJoinCommunity(selectedZone.id)}
            >
              가입하기
            </Button>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>커뮤니티 정보</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" size="icon" onClick={() => setSelectedZone(null)}>
            ✕
          </Button>
        </div>
      </Card>
    </div>
  );
};

const getWeatherIcon = (weatherType: string): React.ReactNode => {
  switch(weatherType) {
    case 'sunny': return <span className="mr-1">☀️</span>;
    case 'cloudy': return <span className="mr-1">☁️</span>;
    case 'rainy': return <span className="mr-1">🌧️</span>;
    case 'snowy': return <span className="mr-1">❄️</span>;
    case 'foggy': return <span className="mr-1">🌫️</span>;
    default: return <span className="mr-1">☀️</span>;
  }
};

const getWeatherLabel = (weatherType: string): string => {
  switch(weatherType) {
    case 'sunny': return ' 맑음';
    case 'cloudy': return ' 흐림';
    case 'rainy': return ' 비';
    case 'snowy': return ' 눈';
    case 'foggy': return ' 안개';
    default: return ' 맑음';
  }
};

export default React.memo(CommunityInfoPanel);
