// src/components/community/UniverseView.tsx
import React from 'react';
import UniverseMap from './UniverseMap';
import PlanetInfoPanel from './PlanetInfoPanel';
import UniverseControls from './UniverseControls';
import { UniverseViewProps } from './types';

const UniverseView: React.FC<UniverseViewProps> = ({
  planets,
  activePlanet, // This is the planet hovered over for info panel
  onPlanetClick, // This is for selecting a planet to view its board
  onPlanetMouseEnter,
  onPlanetMouseLeave,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  isSelectingPosition,
  onMapClickForPosition,
  onMouseMoveOnMap,
  onMouseLeaveMap,
  cursorPositionHint,
  onStartPlanetCreation,
  onCancelPlanetCreation,
  universeMapRef,
}) => {
  return (
    <div className="relative">
      {/* Info Panel: only shown if not selecting position and a planet is hovered */}
      {!isSelectingPosition && <PlanetInfoPanel planet={activePlanet} />}

      {/* Universe Viewport */}
      <div
        ref={universeMapRef}
        className={`w-full h-[calc(80vh-40px)] rounded-2xl overflow-hidden bg-transparent relative ${isSelectingPosition ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
        onClick={isSelectingPosition ? onMapClickForPosition : undefined}
        onMouseMove={isSelectingPosition ? onMouseMoveOnMap : undefined}
        onMouseLeave={isSelectingPosition ? onMouseLeaveMap : undefined} // Only active when selecting position
      >
        {/* Visual hint for position selection */}
        {isSelectingPosition && cursorPositionHint && (
          <div
            className="absolute w-8 h-8 rounded-full bg-blue-500/50 border-2 border-blue-300 pointer-events-none"
            style={{
              left: `${cursorPositionHint.x - 16}px`, // Center the hint on cursor
              top: `${cursorPositionHint.y - 16}px`,
              transform: `scale(${zoomLevel})`, // Adjust hint size with zoom
              zIndex: 50, // Ensure it's above planets
            }}
          />
        )}
        <UniverseMap
          planets={planets}
          activePlanetId={activePlanet?.id || null} // Pass ID for potential map-internal highlighting
          onPlanetClick={onPlanetClick} // For board view navigation
          onPlanetMouseEnter={onPlanetMouseEnter}
          onPlanetMouseLeave={onPlanetMouseLeave}
          isSelectingPosition={isSelectingPosition}
          onMapInteractionForPosition={onMapClickForPosition} // When selecting pos, planet click also triggers map click
          zoomLevel={zoomLevel}
        />
      </div>

      {/* Bottom instruction text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center bg-black/60 backdrop-blur-md p-3 rounded-full z-10">
        <p className="text-sm">
          {isSelectingPosition
            ? "새 행성을 배치할 위치를 클릭하세요."
            : (activePlanet ? `${activePlanet.name} 행성 정보. 클릭하여 탐색하세요.` : "행성을 클릭하여 커뮤니티를 탐색하거나, 새 행성을 창조하세요!")}
        </p>
      </div>

      {/* Controls (Zoom and Create Planet) */}
      <UniverseControls
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        isSelectingPosition={isSelectingPosition}
        onStartPlanetCreation={onStartPlanetCreation}
        onCancelPlanetCreation={onCancelPlanetCreation}
      />
    </div>
  );
};

export default UniverseView;