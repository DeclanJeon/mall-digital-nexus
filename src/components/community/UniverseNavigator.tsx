
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Layers,
  Users,
  Book,
  Calendar,
  Star,
  MessageSquare,
  Globe, 
  Edit,
  Folder,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Planet = {
  id: string;
  name: string;
  icon: React.ReactNode;
  channels: Channel[];
};

type Channel = {
  id: string;
  name: string;
  icon: React.ReactNode;
  forumId: string;
};

const UniverseNavigator: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  
  // Planet is replaced with Star icon
  const planets: Planet[] = [
    {
      id: 'community',
      name: '커뮤니티',
      icon: <Globe className="h-5 w-5" />,
      channels: [
        { id: 'general', name: '일반 토론', icon: <MessageSquare className="h-4 w-4" />, forumId: 'community-general' },
        { id: 'suggestions', name: '제안 및 피드백', icon: <Edit className="h-4 w-4" />, forumId: 'community-suggestions' },
      ]
    },
    {
      id: 'peer-space',
      name: '피어스페이스',
      icon: <Star className="h-5 w-5" />,
      channels: [
        { id: 'showcase', name: '피어스페이스 쇼케이스', icon: <Layers className="h-4 w-4" />, forumId: 'peer-space-showcase' },
        { id: 'help', name: '피어스페이스 도움말', icon: <Book className="h-4 w-4" />, forumId: 'peer-space-help' },
      ]
    },
    {
      id: 'events',
      name: '이벤트',
      icon: <Calendar className="h-5 w-5" />,
      channels: [
        { id: 'upcoming', name: '다가오는 이벤트', icon: <Calendar className="h-4 w-4" />, forumId: 'events-upcoming' },
        { id: 'past', name: '지난 이벤트', icon: <Folder className="h-4 w-4" />, forumId: 'events-past' },
      ]
    },
    {
      id: 'guilds',
      name: '길드',
      icon: <Users className="h-5 w-5" />,
      channels: [
        { id: 'recruitment', name: '길드 모집', icon: <Users className="h-4 w-4" />, forumId: 'guilds-recruitment' },
        { id: 'activities', name: '길드 활동', icon: <Layers className="h-4 w-4" />, forumId: 'guilds-activities' },
      ]
    },
  ];

  const handlePlanetClick = (planetId: string) => {
    setSelectedPlanet(selectedPlanet === planetId ? null : planetId);
  };

  const handleChannelClick = (forumId: string) => {
    navigate(`/community-universe/forum/${forumId}`);
  };

  const getSelectedPlanetChannels = () => {
    if (!selectedPlanet) return [];
    const planet = planets.find(p => p.id === selectedPlanet);
    return planet ? planet.channels : [];
  };

  return (
    <div className="space-universe-navigator-container">
      <div className="space-planets flex justify-center gap-8 mb-6">
        {planets.map((planet) => (
          <Button
            key={planet.id}
            variant="ghost"
            size="lg"
            className={cn(
              "flex flex-col items-center p-3 hover:bg-accent/50 rounded-full w-20 h-20",
              selectedPlanet === planet.id && "bg-accent text-accent-foreground"
            )}
            onClick={() => handlePlanetClick(planet.id)}
          >
            <div className="text-2xl">
              {planet.icon}
            </div>
            <span className="text-xs mt-1">{planet.name}</span>
          </Button>
        ))}
      </div>

      {selectedPlanet && (
        <div className="space-channels flex justify-center gap-4 animate-fade-in">
          {getSelectedPlanetChannels().map((channel) => (
            <Button
              key={channel.id}
              variant="outline"
              className="flex items-center gap-2 bg-background/80 backdrop-blur-sm"
              onClick={() => handleChannelClick(channel.forumId)}
            >
              {channel.icon}
              {channel.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniverseNavigator;
