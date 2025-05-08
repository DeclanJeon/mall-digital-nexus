// src/components/community/UniverseMap.tsx
import React from 'react';
import { Planet, UniverseMapProps } from './types';

const UniverseMap: React.FC<UniverseMapProps> = ({
  planets,
  // activePlanetId, // 현재는 onPlanetMouseEnter/Leave로 activePlanet을 UniverseView에서 직접 관리
  onPlanetClick,
  onPlanetMouseEnter,
  onPlanetMouseLeave,
  isSelectingPosition,
  onMapInteractionForPosition,
  zoomLevel,
}) => {
  return (
    <div
      className="w-full h-full bg-[#0a0a1a] relative transition-transform duration-300 ease-in-out"
      style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
    >
      {/* Star backgrounds */}
      <div className="absolute inset-0 stars-small"></div>
      <div className="absolute inset-0 stars-medium"></div>
      <div className="absolute inset-0 stars-large"></div>
      {/* Nebula effect */}
      <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at 50% 40%, rgba(76, 0, 255, 0.3), rgba(125, 0, 125, 0.2) 40%, transparent 70%)' }}></div>

      {planets.map((planet) => {
        const leftPercent = 50 + (planet.position[0] * 5); // X: -10 to 10  => 0% to 100% (50% is center)
        const topPercent = 50 + (planet.position[1] * 5);  // Y: -10 to 10  => 0% to 100%
        const planetDOMSize = planet.size * 40; // Base size multiplier

        return (
          <div
            key={planet.id}
            className="absolute rounded-full cursor-pointer transition-all duration-150 hover:scale-110 planet-pulse"
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
              width: `${planetDOMSize}px`,
              height: `${planetDOMSize}px`,
              backgroundColor: planet.color,
              transform: 'translate(-50%, -50%)', // Center the planet
              boxShadow: `0 0 ${planetDOMSize / 2}px ${planetDOMSize / 8}px ${planet.color}40`,
              // Dynamic variable for pulse animation color
                                      // @ts-expect-error: Using CSS variable for dynamic styling
              '--planet-color-shadow': `${planet.color}80`,
              '--planet-color-shadow-strong': `${planet.color}BF`,
            }}
            onClick={(e) => {
              if (isSelectingPosition) {
                e.stopPropagation(); // 중요: 행성 클릭 시 맵 클릭 이벤트 전파 방지
                onMapInteractionForPosition(e);
              } else {
                onPlanetClick(planet);
              }
            }}
            onMouseEnter={() => !isSelectingPosition && onPlanetMouseEnter(planet)}
            onMouseLeave={() => !isSelectingPosition && onPlanetMouseLeave()}
            role="button"
            tabIndex={0}
            aria-label={`행성 ${planet.name} 보기`}
          >
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap p-1 bg-black/30 rounded">
              {planet.name}
            </div>
          </div>
        );
      })}

      {/* Shooting stars and particles */}
      <div className="shooting-star" style={{ left: '10%', top: '20%', animationDelay: '0s' }}></div>
      <div className="shooting-star" style={{ left: '60%', top: '50%', animationDelay: '3s' }}></div>
      <div className="shooting-star" style={{ left: '30%', top: '70%', animationDelay: '6s' }}></div>
      <div className="particles"></div>
    </div>
  );
};

export default UniverseMap;