import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Search, Filter, Plus, Compass, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Planet, Constellation } from './types';

interface UniverseMapProps {
  planets: Planet[];
  constellations: Constellation[];
  selectedPlanet: string | null;
  onPlanetSelect: (planetId: string | null) => void;
  onCreatePlanet: () => void;
}

const UniverseMap: React.FC<UniverseMapProps> = ({ 
  planets, 
  constellations,
  selectedPlanet, 
  onPlanetSelect,
  onCreatePlanet 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Planet position calculation (convert 3D position to 2D for display)
  const calculatePlanetPosition = (planet: Planet) => {
    const centerX = windowSize.width * 0.5;
    const centerY = windowSize.height * 0.5;
    
    // Apply zoom and map position
    const x = centerX + (planet.position[0] * 100 * zoom) + mapPosition.x;
    const y = centerY + (planet.position[1] * 100 * zoom) + mapPosition.y;
    
    // Calculate size based on planet stage and zoom
    let sizeMultiplier = 1;
    switch (planet.stage) {
      case 'asteroid': sizeMultiplier = 1; break;
      case 'planet': sizeMultiplier = 1.5; break;
      case 'gasGiant': sizeMultiplier = 2.5; break;
      case 'star': sizeMultiplier = 4; break;
    }
    
    const size = planet.size * 20 * sizeMultiplier * zoom;
    
    return { x, y, size };
  };

  // Draw constellation lines
  const renderConstellationLines = () => {
    return constellations.map(constellation => {
      const constellationPlanets = planets.filter(p => constellation.planets.includes(p.id));
      if (constellationPlanets.length < 2) return null;
      
      const lines = [];
      for (let i = 0; i < constellationPlanets.length - 1; i++) {
        const current = calculatePlanetPosition(constellationPlanets[i]);
        
        for (let j = i + 1; j < constellationPlanets.length; j++) {
          const next = calculatePlanetPosition(constellationPlanets[j]);
          
          let lineColor = 'rgba(255, 255, 255, 0.3)'; // Default
          if (constellation.type === 'custom') lineColor = '#71c4ef'; // Active
          if (constellation.type === 'temporary') lineColor = '#ff7043'; // Temporary
          
          lines.push(
            <line
              key={`${constellation.id}-${i}-${j}`}
              x1={current.x}
              y1={current.y}
              x2={next.x}
              y2={next.y}
              stroke={lineColor}
              strokeWidth={1.5}
              strokeDasharray={constellation.type === 'temporary' ? '5,5' : ''}
              className="pointer-events-none"
            />
          );
        }
      }
      
      return lines;
    });
  };
  
  // Mouse event handlers for drag and zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - startDragPosition.x;
      const dy = e.clientY - startDragPosition.y;
      
      setMapPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setStartDragPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  };
  
  const handleFindMyLocation = () => {
    // Reset map position to center
    setMapPosition({ x: 0, y: 0 });
    setZoom(1);
  };

  // Filter planets based on search query
  const filteredPlanets = planets.filter(planet => 
    planet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    planet.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full h-[80vh] relative bg-[#0c0c1d] rounded-2xl overflow-hidden">
      {/* Stars background with parallax effect */}
      <div className="absolute inset-0 stars-small"></div>
      <div className="absolute inset-0 stars-medium"></div>
      <div className="absolute inset-0 stars-large"></div>
      
      {/* Nebula effect */}
      <div className="absolute inset-0 opacity-30" 
        style={{ 
          background: 'radial-gradient(circle at 50% 40%, rgba(76, 0, 255, 0.3), rgba(125, 0, 125, 0.2) 40%, transparent 70%)'
        }}>
      </div>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/30 text-white border-white/20 backdrop-blur-md hover:bg-black/40"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/30 text-white border-white/20 backdrop-blur-md hover:bg-black/40"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/30 text-white border-white/20 backdrop-blur-md hover:bg-black/40"
          onClick={handleFindMyLocation}
        >
          <Compass className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Search bar */}
      <div className="absolute top-4 left-4 z-10 w-64">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input 
            placeholder="행성이나 주제 검색..." 
            className="pl-9 bg-black/30 text-white border-white/20 backdrop-blur-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Create planet button */}
      <div className="absolute bottom-4 right-4 z-10">
        <Button 
          onClick={onCreatePlanet} 
          className="bg-[#3e9bff] text-white hover:bg-[#3e9bff]/80"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 행성 만들기
        </Button>
      </div>
      
      {/* Filter badges */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-wrap gap-2">
        <Badge 
          className="bg-[#3e9bff] text-white cursor-pointer hover:bg-[#3e9bff]/80"
        >
          전체
        </Badge>
        <Badge 
          variant="outline" 
          className="bg-black/30 border-white/20 text-white cursor-pointer backdrop-blur-md"
        >
          내 행성
        </Badge>
        <Badge 
          variant="outline" 
          className="bg-black/30 border-white/20 text-white cursor-pointer backdrop-blur-md"
        >
          인기 행성
        </Badge>
        <Badge 
          variant="outline" 
          className="bg-black/30 border-white/20 text-white cursor-pointer backdrop-blur-md"
        >
          최근 활동
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-white flex items-center gap-1"
        >
          <Filter className="h-3 w-3" />
          <span className="text-xs">필터</span>
        </Button>
      </div>
      
      {/* Hovered planet tooltip */}
      {hoveredPlanet && (
        <div 
          className="absolute z-20 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-none"
          style={{ 
            left: calculatePlanetPosition(hoveredPlanet).x + 20,
            top: calculatePlanetPosition(hoveredPlanet).y - 20
          }}
        >
          <h3 className="font-bold text-white mb-1">{hoveredPlanet.name}</h3>
          <p className="text-blue-300 text-sm mb-2">{hoveredPlanet.description.substring(0, 100)}{hoveredPlanet.description.length > 100 ? '...' : ''}</p>
          
          <div className="flex gap-4 text-xs text-white/70">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{hoveredPlanet.members} 멤버</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge className="h-4 px-1.5 text-[10px]">
                {hoveredPlanet.stage === 'asteroid' && '소행성'}
                {hoveredPlanet.stage === 'planet' && '표준 행성'}
                {hoveredPlanet.stage === 'gasGiant' && '가스 거인'}
                {hoveredPlanet.stage === 'star' && '항성'}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Map container */}
      <div 
        ref={mapRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <svg width="100%" height="100%">
          {/* Constellation connections */}
          <g>{renderConstellationLines()}</g>
          
          {/* Planets */}
          {filteredPlanets.map(planet => {
            const { x, y, size } = calculatePlanetPosition(planet);
            
            let planetColor;
            if (planet.stage === 'star') {
              planetColor = '#ff9800';
            } else if (planet.isPrivate) {
              planetColor = '#4caf50';
            } else if (planet.type === 'timeLimited') {
              planetColor = '#e91e63';
            } else {
              planetColor = '#3e9bff';
            }
            
            // Glow effect intensity based on stage
            let glowIntensity;
            switch(planet.stage) {
              case 'asteroid': glowIntensity = 5; break;
              case 'planet': glowIntensity = 10; break;
              case 'gasGiant': glowIntensity = 15; break;
              case 'star': glowIntensity = 25; break;
            }
            
            return (
              <g key={planet.id} onClick={() => onPlanetSelect(planet.id)}>
                {/* Glow effect */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={size * 1.2} 
                  fill={`url(#glow-${planet.id})`} 
                />
                
                {/* Planet body */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={size} 
                  className={`cursor-pointer transition-transform duration-300 ${selectedPlanet === planet.id ? 'stroke-white stroke-2' : ''}`}
                  fill={planetColor}
                  onMouseEnter={() => setHoveredPlanet(planet)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                />
                
                {/* Gas giant rings */}
                {planet.stage === 'gasGiant' && (
                  <ellipse
                    cx={x}
                    cy={y} 
                    rx={size * 1.5}
                    ry={size * 0.5}
                    fill="transparent"
                    stroke={planetColor}
                    strokeWidth="2"
                    strokeOpacity="0.7"
                    transform={`rotate(30 ${x} ${y})`}
                  />
                )}
                
                {/* Gradient definitions for glow effects */}
                <defs>
                  <radialGradient id={`glow-${planet.id}`}>
                    <stop offset="0%" stopColor={planetColor} stopOpacity="0.8" />
                    <stop offset="30%" stopColor={planetColor} stopOpacity="0.3" />
                    <stop offset="70%" stopColor={planetColor} stopOpacity="0.1" />
                    <stop offset="100%" stopColor={planetColor} stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                {/* Health indicator */}
                <circle
                  cx={x + size * 0.7}
                  cy={y - size * 0.7}
                  r={size * 0.3}
                  fill={
                    planet.health > 70 ? 'green' :
                    planet.health > 30 ? 'yellow' : 'red'
                  }
                  stroke="#000"
                  strokeWidth="1"
                />
                
                {/* Star rays for star stage */}
                {planet.stage === 'star' && (
                  <g className="animate-pulse">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <line
                        key={`ray-${planet.id}-${i}`}
                        x1={x + Math.cos(angle * Math.PI / 180) * size}
                        y1={y + Math.sin(angle * Math.PI / 180) * size}
                        x2={x + Math.cos(angle * Math.PI / 180) * (size * 1.5)}
                        y2={y + Math.sin(angle * Math.PI / 180) * (size * 1.5)}
                        stroke="#ff9800"
                        strokeWidth="2"
                        strokeOpacity="0.7"
                      />
                    ))}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* CSS animations */}
      <style>
        {`
        /* Star backgrounds with parallax */
        .stars-small {
          background-image: radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 200px 200px;
          animation: twinkle 7s ease-in-out infinite alternate;
        }
        
        .stars-medium {
          background-image: radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
                            radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 300px 300px;
          animation: twinkle 15s ease-in-out infinite alternate;
        }
        
        .stars-large {
          background-image: radial-gradient(2px 2px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 400px 400px;
          animation: twinkle 20s ease-in-out infinite alternate;
        }
        
        @keyframes twinkle {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        `}
      </style>
    </div>
  );
};

export default UniverseMap;
