
// src/components/community/UniverseMap.tsx
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { Planet, UniverseMapProps } from './types';
import StarfieldPixi from './StarfieldPixi';

const UniverseMap: React.FC<UniverseMapProps> = ({
  planets,
  onPlanetClick,
  onPlanetMouseEnter,
  onPlanetMouseLeave,
  isSelectingPosition,
  onMapInteractionForPosition,
  zoomLevel,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // mapOffset: viewport's top-left point in world coordinates (zoom level 1)
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const [pixiAppSizeVersion, setPixiAppSizeVersion] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelectingPosition || e.button !== 0 || !viewportRef.current) return;
    setIsDragging(true);
    // Starting drag point: current mouse position (relative to viewport)
    const rect = viewportRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    viewportRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || isSelectingPosition || !viewportRef.current) return;
    
    const rect = viewportRef.current.getBoundingClientRect();
    const currentMouseXInViewport = e.clientX - rect.left;
    const currentMouseYInViewport = e.clientY - rect.top;

    const dx = currentMouseXInViewport - dragStart.x;
    const dy = currentMouseYInViewport - dragStart.y;

    // Calculate new mapOffset: previous offset + (mouse movement / zoom level)
    // Mouse movement is in viewport pixels, so divide by zoom level for world coordinate movement
    setMapOffset(prevOffset => ({
      x: prevOffset.x - dx / zoomLevel,
      y: prevOffset.y - dy / zoomLevel,
    }));

    // Update dragStart for next movement
    setDragStart({ x: currentMouseXInViewport, y: currentMouseYInViewport });
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (viewportRef.current) viewportRef.current.style.cursor = isSelectingPosition ? 'crosshair' : 'grab';
    }
  };
  
  // Detect viewport size changes to trigger Pixi app resize
  useEffect(() => {
    const observer = new ResizeObserver(() => {
        setPixiAppSizeVersion(v => v + 1);
    });
    
    if (viewportRef.current) {
        observer.observe(viewportRef.current);
    }
    
    return () => {
        if (viewportRef.current) {
            observer.unobserve(viewportRef.current);
        }
        observer.disconnect();
    };
  }, []);

  // Planet container style (applies zoom and panning)
  // This container is positioned at viewport's (0,0) and applies zoom/panning internally.
  const planetContainerStyle: CSSProperties = {
    position: 'absolute',
    left: '50%', // Center in viewport
    top: '50%',
    width: '1px', // Reference point
    height: '1px',
    transform: `scale(${zoomLevel}) translate(${-mapOffset.x}px, ${-mapOffset.y}px)`,
    transformOrigin: '0 0', // Scale and move relative to (0,0)
  };
  
  const viewportStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    cursor: isDragging ? 'grabbing' : (isSelectingPosition ? 'crosshair' : 'grab'),
    position: 'relative',
    background: '#000000', // Match Pixi background
  };

  return (
    <div
      ref={viewportRef}
      style={viewportStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onClick={(e) => {
        if (isSelectingPosition && onMapInteractionForPosition && e.target === viewportRef.current && viewportRef.current) {
           // Convert click position to world coordinates
           const rect = viewportRef.current.getBoundingClientRect();
           const clickXInViewport = e.clientX - rect.left;
           const clickYInViewport = e.clientY - rect.top;
           
           // Assume viewport center is world (0,0) and calculate clicked world coordinates
           const worldX = mapOffset.x + (clickXInViewport - rect.width / 2) / zoomLevel;
           const worldY = mapOffset.y + (clickYInViewport - rect.height / 2) / zoomLevel;
           
           // Pass to usePlanetCreation
           onMapInteractionForPosition(e);
        }
      }}
    >
      <StarfieldPixi
        mapOffset={mapOffset}
        zoomLevel={zoomLevel}
        appSizeVersion={pixiAppSizeVersion}
      />
      
      <div style={planetContainerStyle}>
        {planets.map((planet) => {
          // Planet's world coordinates (scale as needed)
          const worldX = planet.position[0] * 100;
          const worldY = planet.position[1] * 100;
          
          // Base planet DOM size (at zoom level 1)
          const basePlanetDOMSize = planet.size * 40;
          // Current screen size accounting for zoom
          const currentPlanetScreenSize = basePlanetDOMSize / zoomLevel;

          return (
            <div
              key={planet.id}
              className="absolute rounded-full cursor-pointer transition-transform hover:scale-110 planet-pulse"
              style={{
                left: `${worldX}px`,
                top: `${worldY}px`,
                width: `${currentPlanetScreenSize}px`,
                height: `${currentPlanetScreenSize}px`,
                backgroundColor: planet.color,
                transform: 'translate(-50%, -50%)', // Center the element
                boxShadow: `0 0 ${currentPlanetScreenSize / 2}px ${currentPlanetScreenSize / 8}px ${planet.color}40`,
                // CSS variables
                '--planet-color-shadow': `${planet.color}80`,
                '--planet-color-shadow-strong': `${planet.color}BF`,
              } as React.CSSProperties}
              onMouseDown={(e) => e.stopPropagation()} // Prevent viewport drag
              onClick={(e) => {
                e.stopPropagation();
                if (isSelectingPosition) {
                  onMapInteractionForPosition(e);
                } else {
                  onPlanetClick(planet);
                }
              }}
              onMouseEnter={(e) => { e.stopPropagation(); if (!isSelectingPosition) onPlanetMouseEnter(planet);}}
              onMouseLeave={(e) => { e.stopPropagation(); if (!isSelectingPosition) onPlanetMouseLeave();}}
              role="button"
              tabIndex={0}
              aria-label={`행성 ${planet.name} 보기`}
            >
              <div className="absolute text-xs whitespace-nowrap p-1 bg-black/30 rounded"
                style={{
                    bottom: `-${Math.max(10, 20 / zoomLevel)}px`, // Adjust label position (ensure minimum size)
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: `${Math.max(8, 12 / zoomLevel)}px`, // Adjust label font size (ensure minimum size)
                    opacity: Math.min(1, 1.5 / zoomLevel), // Hide when too small
                }}
              >
                {planet.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UniverseMap;
