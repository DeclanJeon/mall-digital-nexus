
import React, { useState, useEffect } from 'react';
import { 
  Planet as PlanetType, 
  Channel as ChannelType 
} from '@/types/forum';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare,
  Globe, 
  Planet,
  Edit,
  Folder,
  FolderOpen,
  MessageSquarePlus
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface UniverseNavigatorProps {
  onChannelSelect: (channelId: string) => void;
}

const UniverseNavigator: React.FC<UniverseNavigatorProps> = ({ onChannelSelect }) => {
  const [planets, setPlanets] = useState<PlanetType[]>([]);
  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetType | null>(null);
  const [loading, setLoading] = useState(true);

  // Load planets
  useEffect(() => {
    const loadPlanets = async () => {
      try {
        setLoading(true);
        const planetData = await import('@/services/forumService').then(
          module => module.getAllPlanets()
        );
        setPlanets(planetData || []);
        
        // Initialize forum data if needed
        await import('@/services/forumService').then(
          module => module.initializeForumData()
        );
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading planets:", error);
        setLoading(false);
      }
    };
    
    loadPlanets();
  }, []);

  // Load channels when a planet is selected
  useEffect(() => {
    const loadChannels = async () => {
      if (!selectedPlanet) {
        setChannels([]);
        return;
      }
      
      try {
        const channelData = await import('@/services/forumService').then(
          module => module.getChannelsByPlanet(selectedPlanet.id)
        );
        setChannels(channelData || []);
      } catch (error) {
        console.error("Error loading channels:", error);
      }
    };
    
    loadChannels();
  }, [selectedPlanet]);

  const handlePlanetClick = (planet: PlanetType) => {
    setSelectedPlanet(planet);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'message-square':
        return <MessageSquare />;
      case 'globe':
        return <Globe />;
      case 'planet':
        return <Planet />;
      case 'edit':
        return <Edit />;
      case 'folder':
        return <Folder />;
      case 'folder-open':
        return <FolderOpen />;
      case 'message-square-plus':
        return <MessageSquarePlus />;
      default:
        return <MessageSquare />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (planets.length === 0) {
    return (
      <div className="text-center p-8">
        <p>행성이 없습니다. 시스템 관리자에게 문의하세요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Planets */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-200">행성</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {planets.map((planet) => (
            <Card 
              key={planet.id}
              className={`cursor-pointer transition-all border-2 ${
                selectedPlanet?.id === planet.id 
                  ? 'border-primary shadow-lg shadow-primary/20' 
                  : 'border-gray-800 bg-gray-900/30 hover:bg-gray-900/50'
              }`}
              onClick={() => handlePlanetClick(planet)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: planet.color + '33' }}
                >
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: planet.color }}
                  >
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-100">{planet.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1">{planet.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Channels */}
      {selectedPlanet && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-200">
            <span style={{ color: selectedPlanet.color }}>{selectedPlanet.name}</span>의 채널
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <Button
                key={channel.id}
                variant="outline"
                className="h-auto flex items-center justify-start gap-3 p-4 bg-gray-900/20 border-gray-700 hover:bg-gray-900/40 hover:border-gray-600 text-left"
                onClick={() => onChannelSelect(channel.id)}
              >
                <div 
                  className="p-2 rounded-full"
                  style={{ backgroundColor: channel.color + '33' }}
                >
                  {getIconComponent(channel.icon)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-100">{channel.name}</h3>
                  <p className="text-xs text-gray-400">{channel.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniverseNavigator;
