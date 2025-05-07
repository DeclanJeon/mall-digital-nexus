
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ZoomIn, ZoomOut, Search, Filter, Plus, Compass, MapPin, Star, Plane, Earth, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Planet as PlanetType, Constellation } from './types';

interface UniverseMapProps {
  planets: PlanetType[];
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
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetType | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Planet textures
  const planetTextures = useMemo(() => {
    return {
      public: {
        gradient: 'radial-gradient(circle at 30% 30%, #8CBAFF 0%, #4488FF 30%, #1155CC 60%, #0A338C 100%)',
        overlay: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'smallGrid\' width=\'10\' height=\'10\' patternUnits=\'userSpaceOnUse\'%3E%3Cpath d=\'M 10 0 L 0 0 0 10\' fill=\'none\' stroke=\'rgba(255,255,255,0.1)\' stroke-width=\'0.5\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23smallGrid)\'/%3E%3C/svg%3E")'
      },
      private: {
        gradient: 'radial-gradient(circle at 40% 40%, #FFCB8C 0%, #FF8F00 40%, #994D00 70%, #552B00 100%)',
        overlay: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'stripes\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\' patternTransform=\'rotate(45)\'%3E%3Cline x1=\'0\' y1=\'0\' x2=\'0\' y2=\'20\' stroke=\'rgba(255,255,255,0.1)\' stroke-width=\'10\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23stripes)\'/%3E%3C/svg%3E")'
      },
      timeLimited: {
        gradient: 'radial-gradient(circle at 35% 35%, #E0F7FF 0%, #94E8FF 30%, #00A3CC 70%, #005266 100%)',
        overlay: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'sparkles\' width=\'30\' height=\'30\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'15\' cy=\'15\' r=\'1\' fill=\'rgba(255,255,255,0.5)\'/%3E%3Ccircle cx=\'5\' cy=\'5\' r=\'0.5\' fill=\'rgba(255,255,255,0.3)\'/%3E%3Ccircle cx=\'25\' cy=\'25\' r=\'0.5\' fill=\'rgba(255,255,255,0.3)\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'url(%23sparkles)\'/%3E%3C/svg%3E")'
      },
      star: {
        gradient: 'radial-gradient(circle at 50% 50%, #FFFFC8 0%, #FFE066 30%, #FF9500 70%, #CC4A00 100%)',
        overlay: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cfilter id=\'noise\' x=\'0%25\' y=\'0%25\' width=\'100%25\' height=\'100%25\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.02\' numOctaves=\'3\' result=\'noise\'/%3E%3CfeColorMatrix type=\'matrix\' values=\'1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0\' result=\'coloredNoise\'/%3E%3C/filter%3E%3C/defs%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'
      }
    };
  }, []);

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
  const calculatePlanetPosition = (planet: PlanetType) => {
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
          
          let lineGradientId = `line-gradient-${constellation.id}-${i}-${j}`;
          let lineColor = 'rgba(255, 255, 255, 0.3)'; // Default
          let strokeWidth = 1.5;
          let dashArray = '';
          let animationClass = '';
          
          if (constellation.type === 'custom') {
            lineColor = '#71c4ef';
            strokeWidth = 2; 
            animationClass = 'constellation-line-active';
          }
          
          if (constellation.type === 'temporary') {
            lineColor = '#ff7043';
            dashArray = '5,5';
            animationClass = 'constellation-line-pulse';
          }
          
          lines.push(
            <React.Fragment key={`${constellation.id}-${i}-${j}`}>
              <defs>
                <linearGradient id={lineGradientId} gradientUnits="userSpaceOnUse" 
                  x1={current.x} y1={current.y} x2={next.x} y2={next.y}>
                  <stop offset="0%" stopColor={lineColor} stopOpacity="0.8" />
                  <stop offset="50%" stopColor={lineColor} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={lineColor} stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <line
                x1={current.x}
                y1={current.y}
                x2={next.x}
                y2={next.y}
                stroke={`url(#${lineGradientId})`}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                className={`pointer-events-none ${animationClass}`}
              />
              {/* Particle effect along the line */}
              {constellation.type === 'custom' && (
                <circle
                  cx={current.x + (next.x - current.x) * ((Date.now() % 3000) / 3000)}
                  cy={current.y + (next.y - current.y) * ((Date.now() % 3000) / 3000)}
                  r={2 * zoom}
                  fill={lineColor}
                  className="constellation-particle"
                />
              )}
            </React.Fragment>
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
  
  const toggleLabels = () => {
    setShowLabels(!showLabels);
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
      
      {/* Nebula effects */}
      <div className="absolute inset-0 opacity-30 nebula-1"></div>
      <div className="absolute inset-0 opacity-20 nebula-2"></div>
      <div className="absolute inset-0 opacity-25 nebula-3"></div>
      
      {/* Shooting stars */}
      <div className="shooting-star shooting-star-1"></div>
      <div className="shooting-star shooting-star-2"></div>
      <div className="shooting-star shooting-star-3"></div>
      
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
        
        <Button 
          variant="outline" 
          size="icon" 
          className={`${showLabels ? 'bg-blue-600/50' : 'bg-black/30'} text-white border-white/20 backdrop-blur-md hover:bg-black/40`}
          onClick={toggleLabels}
        >
          <Layers className="h-4 w-4" />
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
          className="absolute z-20 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-none animate-fade-in"
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
            
            // Determine planet visual style
            let planetColor, textureGradient, textureOverlay;
            let glowIntensity, glowColor;
            let animationClass = '';
            
            // Base color by type
            if (planet.stage === 'star') {
              textureGradient = planetTextures.star.gradient;
              textureOverlay = planetTextures.star.overlay;
              glowColor = '#FF9500';
              animationClass = 'animate-pulse';
            } else if (planet.isPrivate) {
              textureGradient = planetTextures.private.gradient;
              textureOverlay = planetTextures.private.overlay;
              glowColor = '#4caf50';
            } else if (planet.type === 'timeLimited') {
              textureGradient = planetTextures.timeLimited.gradient;
              textureOverlay = planetTextures.timeLimited.overlay;
              glowColor = '#e91e63';
            } else {
              textureGradient = planetTextures.public.gradient;
              textureOverlay = planetTextures.public.overlay;
              glowColor = '#3e9bff';
            }
            
            // Glow effect intensity based on stage
            switch(planet.stage) {
              case 'asteroid': glowIntensity = 5; break;
              case 'planet': glowIntensity = 10; break;
              case 'gasGiant': glowIntensity = 15; break;
              case 'star': glowIntensity = 25; break;
            }

            // Gradient ID
            const gradientId = `planet-gradient-${planet.id}`;
            const glowGradientId = `planet-glow-${planet.id}`;
            
            return (
              <g 
                key={planet.id} 
                onClick={() => onPlanetSelect(planet.id)}
                className="planet-group"
              >
                {/* Definitions for gradient and glows */}
                <defs>
                  <radialGradient id={gradientId}>
                    <stop offset="0%" stopColor={planet.color || glowColor} stopOpacity="1" />
                    <stop offset="80%" stopColor={planet.color || glowColor} stopOpacity="1" />
                    <stop offset="100%" stopColor={planet.color || glowColor} stopOpacity="0.8" />
                  </radialGradient>
                  
                  <radialGradient id={glowGradientId}>
                    <stop offset="0%" stopColor={glowColor} stopOpacity="0.8" />
                    <stop offset="30%" stopColor={glowColor} stopOpacity="0.3" />
                    <stop offset="70%" stopColor={glowColor} stopOpacity="0.1" />
                    <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
                  </radialGradient>
                </defs>
                
                {/* Glow effect */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={size * 1.5} 
                  fill={`url(#${glowGradientId})`}
                  className={planet.stage === 'star' ? 'animate-pulse' : ''}
                />
                
                {/* Planet body with texture */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={size} 
                  fill={`url(#${gradientId})`}
                  className={`cursor-pointer transition-transform duration-300 ${selectedPlanet === planet.id ? 'stroke-white stroke-2' : ''} ${animationClass}`}
                  style={{
                    filter: `url(#${planet.stage === 'star' ? 'texture-noise' : 'texture-basic'})`
                  }}
                  onMouseEnter={() => setHoveredPlanet(planet)}
                  onMouseLeave={() => setHoveredPlanet(null)}
                />
                
                {/* Planet texture overlay */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={size} 
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                  style={{ 
                    mixBlendMode: 'overlay'
                  }}
                />
                
                {/* Gas giant rings */}
                {planet.stage === 'gasGiant' && (
                  <ellipse
                    cx={x}
                    cy={y} 
                    rx={size * 1.8}
                    ry={size * 0.5}
                    fill="transparent"
                    stroke={planet.color || glowColor}
                    strokeWidth="3"
                    strokeOpacity="0.7"
                    transform={`rotate(30 ${x} ${y})`}
                    className="ring-shadow"
                  />
                )}
                
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
                  className="health-indicator"
                />
                
                {/* Star rays for star stage */}
                {planet.stage === 'star' && (
                  <g className="animate-pulse star-rays">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                      <line
                        key={`ray-${planet.id}-${i}`}
                        x1={x + Math.cos(angle * Math.PI / 180) * size}
                        y1={y + Math.sin(angle * Math.PI / 180) * size}
                        x2={x + Math.cos(angle * Math.PI / 180) * (size * 1.8)}
                        y2={y + Math.sin(angle * Math.PI / 180) * (size * 1.8)}
                        stroke="#ff9800"
                        strokeWidth="2"
                        strokeOpacity="0.7"
                      />
                    ))}
                  </g>
                )}
                
                {/* Planet name label */}
                {showLabels && (
                  <g className="planet-label">
                    <text
                      x={x}
                      y={y + size + 20}
                      textAnchor="middle"
                      fill="white"
                      fontSize={Math.max(10, size * 0.4)}
                      className="font-bold text-shadow-sm select-none"
                    >
                      {planet.name}
                    </text>
                    <text
                      x={x}
                      y={y + size + 35}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.7)"
                      fontSize={Math.max(8, size * 0.3)}
                      className="select-none"
                    >
                      {planet.members}명 • {planet.topics[0]}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* Texture filters */}
          <defs>
            <filter id="texture-basic">
              <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="3" seed="1" />
              <feDisplacementMap in="SourceGraphic" scale="5" />
            </filter>
            <filter id="texture-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="5" seed="2" />
              <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0" />
            </filter>
          </defs>
        </svg>
      </div>
      
      {/* CSS animations */}
      <style>
        {`
        /* Text shadows for better visibility */
        .text-shadow-sm {
          text-shadow: 0 0 5px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.3);
        }
        
        /* Star backgrounds with parallax */
        .stars-small {
          background-image: 
            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
            radial-gradient(1px 1px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 200px 200px;
          animation: twinkle 7s ease-in-out infinite alternate;
        }
        
        .stars-medium {
          background-image: 
            radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent),
            radial-gradient(1.5px 1.5px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 300px 300px;
          animation: twinkle 15s ease-in-out infinite alternate;
        }
        
        .stars-large {
          background-image: radial-gradient(2px 2px at ${Math.random() * 100}% ${Math.random() * 100}%, #fff, transparent);
          background-size: 400px 400px;
          animation: twinkle 20s ease-in-out infinite alternate;
        }
        
        /* Nebula effects */
        .nebula-1 {
          background: radial-gradient(circle at 20% 40%, rgba(76, 0, 255, 0.3), rgba(125, 0, 125, 0.1) 40%, transparent 70%);
        }
        
        .nebula-2 {
          background: radial-gradient(circle at 70% 60%, rgba(0, 200, 255, 0.2), rgba(0, 100, 200, 0.1) 50%, transparent 80%);
        }
        
        .nebula-3 {
          background: radial-gradient(ellipse at 40% 80%, rgba(255, 100, 50, 0.15), rgba(200, 0, 50, 0.05) 60%, transparent 90%);
        }
        
        /* Shooting stars */
        .shooting-star {
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 2px;
          background: linear-gradient(to right, transparent, white, transparent);
          opacity: 0;
          transform: rotate(45deg);
          animation: shooting-star 6s linear infinite;
        }
        
        .shooting-star-1 {
          top: 20%;
          left: 30%;
          animation-delay: 0s;
        }
        
        .shooting-star-2 {
          top: 40%;
          left: 60%;
          animation-delay: 3s;
        }
        
        .shooting-star-3 {
          top: 70%;
          left: 15%;
          animation-delay: 5s;
        }
        
        /* Constellation line effects */
        .constellation-line-active {
          animation: line-pulse 3s ease-in-out infinite;
        }
        
        .constellation-line-pulse {
          animation: line-dash 5s linear infinite;
        }
        
        .constellation-particle {
          animation: particle-move 3s linear infinite;
        }
        
        /* Planet effects */
        .ring-shadow {
          filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
        }
        
        .health-indicator {
          transition: fill 0.5s ease-out;
          filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.5));
        }
        
        .star-rays line {
          animation: ray-pulse 2s ease-in-out infinite;
        }
        
        .planet-group:hover {
          filter: brightness(1.2);
        }
        
        /* Animations */
        @keyframes twinkle {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes shooting-star {
          0% { 
            transform: translate(0, 0) rotate(45deg);
            opacity: 0;
          }
          5% { opacity: 1; }
          20% { 
            transform: translate(400px, 400px) rotate(45deg);
            opacity: 0;
          }
          100% { 
            transform: translate(400px, 400px) rotate(45deg);
            opacity: 0;
          }
        }
        
        @keyframes line-pulse {
          0% { stroke-opacity: 0.3; }
          50% { stroke-opacity: 0.8; }
          100% { stroke-opacity: 0.3; }
        }
        
        @keyframes line-dash {
          to { stroke-dashoffset: -20; }
        }
        
        @keyframes particle-move {
          from { opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          to { opacity: 0; }
        }
        
        @keyframes ray-pulse {
          0% { stroke-opacity: 0.7; stroke-width: 2; }
          50% { stroke-opacity: 0.3; stroke-width: 1; }
          100% { stroke-opacity: 0.7; stroke-width: 2; }
        }
        `}
      </style>
    </div>
  );
};

export default UniverseMap;
