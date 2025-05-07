
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, Star, Circle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlanetType, PlanetStage } from './types';

interface PlanetCardProps {
  planet: {
    id: string;
    name: string;
    description: string;
    type: PlanetType;
    stage: PlanetStage;
    members: number;
    activities: number;
    topics: string[];
    owner: {
      name: string;
      avatar: string;
    };
    health: number; // 0-100
    constellation?: string;
    createdAt: string;
    lastActivity: string;
    isPrivate: boolean;
  };
  onClick?: () => void;
}

const stageIcons = {
  asteroid: Circle,
  planet: Circle,
  gasGiant: Circle,
  star: Star
};

const typeColors = {
  public: 'bg-[#3e9bff]',
  private: 'bg-[#4caf50]',
  timeLimited: 'bg-[#e91e63]',
  star: 'bg-[#ff9800]'
};

const stageEffects = {
  asteroid: '',
  planet: 'shadow-md shadow-current/30',
  gasGiant: 'shadow-lg shadow-current/50',
  star: 'shadow-xl shadow-current/70 animate-pulse'
};

const healthColorClass = (health: number) => {
  if (health > 70) return 'bg-green-500';
  if (health > 30) return 'bg-yellow-500';
  return 'bg-red-500';
};

const PlanetCard: React.FC<PlanetCardProps> = ({ planet, onClick }) => {
  const PlanetIcon = stageIcons[planet.stage];
  const typeColor = planet.stage === 'star' ? typeColors.star : 
    planet.isPrivate ? typeColors.private : typeColors.public;
  
  return (
    <Card 
      onClick={onClick}
      className={`overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer border border-white/10 bg-black/30 backdrop-blur-md ${stageEffects[planet.stage]}`}
    >
      <div className="relative">
        <div className={`absolute top-0 left-0 w-full h-1 ${healthColorClass(planet.health)}`}></div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          {planet.isPrivate && (
            <Badge variant="outline" className="bg-black/50 border-[#4caf50] text-[#4caf50]">
              <Shield className="w-3 h-3 mr-1" />
              비공개
            </Badge>
          )}
          
          {planet.constellation && (
            <Badge variant="outline" className="bg-black/50 border-[#71c4ef] text-[#71c4ef]">
              *{planet.constellation}
            </Badge>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${typeColor} ${planet.stage === 'star' ? 'animate-pulse' : ''}`}>
            <PlanetIcon className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-lg">{planet.name}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{planet.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {planet.topics.slice(0, 3).map((topic, index) => (
            <Badge key={index} variant="secondary" className="bg-white/10 text-xs">
              #{topic}
            </Badge>
          ))}
          {planet.topics.length > 3 && (
            <Badge variant="secondary" className="bg-white/10 text-xs">
              +{planet.topics.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <div className="flex items-center">
            <Users className="w-3.5 h-3.5 mr-1" />
            <span>{planet.members}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="w-3.5 h-3.5 mr-1" />
            <span>{planet.activities}</span>
          </div>
          <div className="flex items-center">
            <span>진화 단계: </span>
            <span className="font-medium ml-1">
              {planet.stage === 'asteroid' && '소행성'}
              {planet.stage === 'planet' && '표준 행성'}
              {planet.stage === 'gasGiant' && '가스 거인'}
              {planet.stage === 'star' && '항성'}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-white/10 pt-3 flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={planet.owner.avatar} />
            <AvatarFallback>{planet.owner.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm">{planet.owner.name}</span>
        </div>
        
        <Button size="sm" variant="outline" className="text-xs h-7">
          방문하기
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlanetCard;
