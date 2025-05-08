// src/components/community/UniverseMap.tsx
import React, { useState, useRef, useEffect, CSSProperties } from 'react';
import { Planet, UniverseMapProps } from './types';
import StarfieldPixi from './StarfieldPixi'; // PixiJS 별 필드 컴포넌트

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
  // mapOffset: 뷰포트의 좌상단이 가리키는 월드 좌표 (줌 레벨 1 기준)
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null); // 뷰포트 div에 대한 ref
  const [pixiAppSizeVersion, setPixiAppSizeVersion] = useState(0); // Pixi 앱 리사이즈 트리거

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSelectingPosition || e.button !== 0 || !viewportRef.current) return;
    setIsDragging(true);
    // 드래그 시작점: 현재 마우스 위치 (뷰포트 기준)
    // 오프셋 계산은 mouseMove에서 현재 뷰포트 오프셋을 기준으로
    const rect = viewportRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left, // 뷰포트 내 마우스 X
      y: e.clientY - rect.top,  // 뷰포트 내 마우스 Y
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

    // 새로운 mapOffset 계산: 이전 오프셋 + (마우스 이동량 / 줌레벨)
    // 마우스 이동량은 뷰포트 픽셀 기준이므로, 월드 좌표 이동량으로 변환하려면 줌레벨로 나눠야 함
    setMapOffset(prevOffset => ({
      x: prevOffset.x - dx / zoomLevel,
      y: prevOffset.y - dy / zoomLevel,
    }));

    // 다음 이동을 위해 dragStart를 현재 마우스 위치로 업데이트
    setDragStart({ x: currentMouseXInViewport, y: currentMouseYInViewport });
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (viewportRef.current) viewportRef.current.style.cursor = isSelectingPosition ? 'crosshair' : 'grab';
    }
  };
  
  // 뷰포트 크기 변경 감지하여 Pixi 앱 리사이즈 트리거
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


  // 행성들을 포함하는 컨테이너의 스타일
  // 이 컨테이너는 뷰포트의 (0,0)에 위치하며, 내부적으로 줌과 패닝을 적용.
  // StarfieldPixi는 뷰포트 전체를 덮고, 그 위에 이 planetContainer가 그려짐.
  // planetContainer의 자식인 행성들은 월드 좌표를 기준으로 위치함.
  const planetContainerStyle: CSSProperties = {
    position: 'absolute',
    left: '50%', // 뷰포트 중앙
    top: '50%',  // 뷰포트 중앙
    width: '1px', // 기준점
    height: '1px',// 기준점
    transform: `scale(${zoomLevel}) translate(${-mapOffset.x}px, ${-mapOffset.y}px)`,
    transformOrigin: '0 0', // (0,0)을 기준으로 스케일 및 이동
    // pointerEvents: 'none', // 자식 요소(행성)들이 이벤트를 받을 수 있도록
  };
  
  const viewportStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    cursor: isDragging ? 'grabbing' : (isSelectingPosition ? 'crosshair' : 'grab'),
    position: 'relative',
    background: '#000000', // Pixi 배경색과 일치시키거나, Pixi가 전체를 덮도록
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
           // 클릭 위치를 월드 좌표로 변환하여 전달 (usePlanetCreation에서 이 좌표 사용)
           const rect = viewportRef.current.getBoundingClientRect();
           const clickXInViewport = e.clientX - rect.left;
           const clickYInViewport = e.clientY - rect.top;
           
           // 뷰포트 중앙을 (0,0) 월드 좌표로 가정하고 클릭한 지점의 월드 좌표 계산
           const worldX = mapOffset.x + (clickXInViewport - rect.width / 2) / zoomLevel;
           const worldY = mapOffset.y + (clickYInViewport - rect.height / 2) / zoomLevel;
           
           // usePlanetCreation에 전달할 때는 MouseEvent 또는 가공된 좌표를 전달
           // 여기서는 MouseEvent를 그대로 전달 (이전 방식 유지)
           // 아니면, onMapInteractionForPosition({ worldX, worldY, originalEvent: e }); 와 같이 객체로 전달
           onMapInteractionForPosition(e);
        }
      }}
    >
      <StarfieldPixi
        mapOffset={mapOffset}
        zoomLevel={zoomLevel}
        appSizeVersion={pixiAppSizeVersion}
        // backgroundColor={0x000005} // 필요시 StarfieldPixi의 기본값과 다르게 설정
      />
      
      <div style={planetContainerStyle}>
        {planets.map((planet) => {
          // 행성의 월드 좌표 (예: position[0]이 -10~10 범위라면 적절히 스케일링)
          const worldX = planet.position[0] * 100; // 예시 스케일링 (월드 단위를 픽셀로)
          const worldY = planet.position[1] * 100; // 예시 스케일링
          
          // 화면에 표시될 행성의 기본 크기 (줌 레벨 1일 때)
          const basePlanetDOMSize = planet.size * 40;
          // 현재 줌 레벨에 따른 실제 화면상 크기 (월드 크기 유지 효과)
          // const currentPlanetScreenSize = basePlanetDOMSize; // 행성 크기를 줌과 무관하게 고정하려면
          const currentPlanetScreenSize = basePlanetDOMSize / zoomLevel; // 월드상 크기 유지

          return (
            <div
              key={planet.id}
              className="absolute rounded-full cursor-pointer transition-transform hover:scale-110 planet-pulse"
              style={{
                left: `${worldX}px`, // 월드 좌표 기준
                top: `${worldY}px`,  // 월드 좌표 기준
                width: `${currentPlanetScreenSize}px`,
                height: `${currentPlanetScreenSize}px`,
                backgroundColor: planet.color,
                transform: 'translate(-50%, -50%)', // 요소 자체의 중앙 정렬
                boxShadow: `0 0 ${currentPlanetScreenSize / 2}px ${currentPlanetScreenSize / 8}px ${planet.color}40`,
                // @ts-expect-error: CSS variable
                '--planet-color-shadow': `${planet.color}80`,
                '--planet-color-shadow-strong': `${planet.color}BF`,
              }}
              onMouseDown={(e) => e.stopPropagation()} // 뷰포트 드래그 방지
              onClick={(e) => {
                e.stopPropagation();
                if (isSelectingPosition) {
                  onMapInteractionForPosition(e); // 클릭 이벤트 전달
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
                    bottom: `-${Math.max(10, 20 / zoomLevel)}px`, // 이름표 위치 조정 (최소 크기 보장)
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: `${Math.max(8, 12 / zoomLevel)}px`, // 이름표 폰트 크기 조정 (최소 크기 보장)
                    opacity: Math.min(1, 1.5 / zoomLevel), // 너무 작아지면 안 보이도록
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