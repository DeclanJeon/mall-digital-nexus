import React, { useEffect, useState, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useToast } from '@/hooks/use-toast';

interface SeasonalSystemProps {
  currentDate: Date;
  onSeasonChange?: (season: string) => void;
}

const SeasonalSystem: React.FC<SeasonalSystemProps> = ({ currentDate, onSeasonChange }) => {
  const map = useMap();
  const [season, setSeason] = useState<string>('');
  const [seasonEffects, setSeasonEffects] = useState<HTMLElement[]>([]);
  const { toast } = useToast();
  const prevSeasonRef = useRef<string>('');
  const initialRenderRef = useRef<boolean>(true);
  const effectAppliedRef = useRef<boolean>(false); // 효과 적용 여부 추적용 ref 추가

  // Determine season based on month
  useEffect(() => {
    // 이미 계절이 정해진 경우 재계산 방지
    if (season && prevSeasonRef.current === season) return;
    
    const month = currentDate.getMonth();
    let currentSeason = '';
    
    if (month >= 2 && month <= 4) { // March-May
      currentSeason = '봄';
    } else if (month >= 5 && month <= 7) { // June-August
      currentSeason = '여름';
    } else if (month >= 8 && month <= 10) { // September-November
      currentSeason = '가을';
    } else { // December-February
      currentSeason = '겨울';
    }
    
    if (currentSeason !== prevSeasonRef.current) {
      setSeason(currentSeason);
      prevSeasonRef.current = currentSeason;
      
      if (!initialRenderRef.current && onSeasonChange) {
        onSeasonChange(currentSeason);
        toast({
          title: "계절 변경",
          description: `맵이 ${currentSeason} 스타일로 업데이트 되었습니다.`,
          duration: 3000 // Only show for 3 seconds
        });
      }
    }
    
    initialRenderRef.current = false;
  }, [currentDate, onSeasonChange, toast, season]);

  // Apply seasonal effects to the map - 무한 렌더링 수정
  useEffect(() => {
    if (!season || !map || effectAppliedRef.current) return;
    
    // 효과 적용 여부 표시
    effectAppliedRef.current = true;
    
    // Clear previous effects
    seasonEffects.forEach(effect => {
      if (map.getContainer().contains(effect)) {
        map.getContainer().removeChild(effect);
      }
    });
    
    setSeasonEffects([]);
    
    const mapContainer = map.getContainer();
    const effectsContainer = document.createElement('div');
    effectsContainer.className = `seasonal-effects season-${season}`;
    effectsContainer.style.position = 'absolute';
    effectsContainer.style.top = '0';
    effectsContainer.style.left = '0';
    effectsContainer.style.width = '100%';
    effectsContainer.style.height = '100%';
    effectsContainer.style.pointerEvents = 'none';
    effectsContainer.style.zIndex = '399';
    effectsContainer.style.transition = 'opacity 0.5s ease';
    
    // Apply season-specific effects with improved visuals
    switch (season) {
      case '봄':
        applySpringEffects(effectsContainer);
        break;
      case '여름':
        applySummerEffects(effectsContainer);
        break;
      case '가을':
        applyAutumnEffects(effectsContainer);
        break;
      case '겨울':
        applyWinterEffects(effectsContainer);
        break;
      default:
        break;
    }
    
    mapContainer.appendChild(effectsContainer);
    setSeasonEffects([effectsContainer]);
    
    // Set map style based on season with enhanced visuals
    updateMapStyle(season, map);
    
    return () => {
      effectAppliedRef.current = false;
      if (mapContainer.contains(effectsContainer)) {
        mapContainer.removeChild(effectsContainer);
      }
    };
  }, [season, map]);

  // Season-specific effect functions with enhanced visuals
  const applySpringEffects = (container: HTMLElement) => {
    container.style.background = 'linear-gradient(rgba(255, 255, 255, 0), rgba(210, 241, 196, 0.15))';
    
    // Add flower petals animation with increased count and better visuals
    for (let i = 0; i < 35; i++) {
      const petal = document.createElement('div');
      petal.classList.add('flower-petal');
      petal.style.position = 'absolute';
      petal.style.width = `${5 + Math.random() * 10}px`;
      petal.style.height = `${5 + Math.random() * 10}px`;
      petal.style.backgroundColor = i % 3 === 0 
        ? `hsl(${340 + Math.random() * 30}, 100%, 85%)` 
        : `hsl(${10 + Math.random() * 30}, 100%, 90%)`;
      petal.style.borderRadius = i % 2 === 0 ? '100% 0 100% 0' : '100% 100% 0 100%';
      petal.style.opacity = '0.8';
      petal.style.transform = `rotate(${Math.random() * 360}deg)`;
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.top = `-20px`;
      petal.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.5)';
      petal.style.animation = `fallingSlow ${5 + Math.random() * 15}s linear ${Math.random() * 10}s infinite`;
      container.appendChild(petal);
    }
  };
  
  const applySummerEffects = (container: HTMLElement) => {
    container.style.background = 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 180, 0.15))';
    
    // Add enhanced sunlight effect
    const sunlight = document.createElement('div');
    sunlight.style.position = 'absolute';
    sunlight.style.top = '0';
    sunlight.style.right = '0';
    sunlight.style.width = '300px';
    sunlight.style.height = '300px';
    sunlight.style.background = 'radial-gradient(circle, rgba(255, 255, 180, 0.4) 0%, rgba(255, 255, 255, 0) 70%)';
    sunlight.style.borderRadius = '50%';
    sunlight.style.filter = 'blur(30px)';
    sunlight.style.transform = 'translate(50%, -50%)';
    sunlight.style.animation = 'pulseSunlight 8s infinite alternate';
    container.appendChild(sunlight);
    
    // Add heat waves
    for (let i = 0; i < 5; i++) {
      const heatWave = document.createElement('div');
      heatWave.style.position = 'absolute';
      heatWave.style.bottom = `${10 + i * 15}%`;
      heatWave.style.left = '0';
      heatWave.style.right = '0';
      heatWave.style.height = '10px';
      heatWave.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,180,0.2) 50%, rgba(255,255,255,0) 100%)';
      heatWave.style.opacity = '0.3';
      heatWave.style.filter = 'blur(8px)';
      heatWave.style.animation = `heatWave ${8 + i * 2}s infinite alternate ease-in-out`;
      container.appendChild(heatWave);
    }
  };
  
  const applyAutumnEffects = (container: HTMLElement) => {
    container.style.background = 'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 215, 175, 0.2))';
    
    // Add falling leaves with improved variety
    for (let i = 0; i < 30; i++) {
      const leaf = document.createElement('div');
      leaf.classList.add('autumn-leaf');
      leaf.style.position = 'absolute';
      const size = 8 + Math.random() * 12;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      
      // More autumn color variety
      const colors = [
        `hsl(${15 + Math.random() * 25}, 80%, 50%)`,  // Orange-red
        `hsl(${40 + Math.random() * 15}, 90%, 50%)`,  // Yellow-orange
        `hsl(${0 + Math.random() * 15}, 70%, 40%)`,   // Deep red
        `hsl(${30 + Math.random() * 15}, 95%, 40%)`   // Brown-orange
      ];
      
      leaf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Different leaf shapes
      const shapes = [
        '30% 70% 70% 30% / 30% 30% 70% 70%',
        '80% 20% 80% 20% / 20% 80% 20% 80%',
        '30% 70% 30% 70% / 70% 30% 70% 30%'
      ];
      leaf.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
      
      leaf.style.opacity = '0.9';
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.top = `-20px`;
      leaf.style.transform = `rotate(${Math.random() * 360}deg)`;
      leaf.style.animation = `fallingWithSwing ${8 + Math.random() * 20}s linear ${Math.random() * 10}s infinite`;
      leaf.style.boxShadow = '0 0 3px rgba(0, 0, 0, 0.2)';
      container.appendChild(leaf);
    }
  };
  
  const applyWinterEffects = (container: HTMLElement) => {
    container.style.background = 'linear-gradient(rgba(255, 255, 255, 0), rgba(210, 230, 255, 0.25))';
    
    // Add enhanced snow effect
    const snowContainer = document.createElement('div');
    snowContainer.classList.add('snow-container');
    snowContainer.style.position = 'absolute';
    snowContainer.style.top = '0';
    snowContainer.style.left = '0';
    snowContainer.style.width = '100%';
    snowContainer.style.height = '100%';
    snowContainer.style.pointerEvents = 'none';
    
    // Add snowflakes with improved visuals
    for (let i = 0; i < 80; i++) {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.style.position = 'absolute';
      const size = 2 + Math.random() * 6;
      snowflake.style.width = `${size}px`;
      snowflake.style.height = `${size}px`;
      
      // More realistic snowflake look
      if (Math.random() > 0.7) {
        snowflake.style.backgroundImage = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" viewBox=\"0 0 20 20\"><path fill=\"white\" d=\"M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z\"/></svg>')";
        snowflake.style.backgroundSize = 'contain';
        snowflake.style.backgroundColor = 'transparent';
      } else {
        snowflake.style.backgroundColor = 'white';
        snowflake.style.borderRadius = '50%';
      }
      
      snowflake.style.opacity = `${0.5 + Math.random() * 0.5}`;
      snowflake.style.left = `${Math.random() * 100}%`;
      snowflake.style.top = `-10px`;
      snowflake.style.filter = 'blur(0.5px)';
      snowflake.style.animation = `snowfall ${5 + Math.random() * 15}s linear ${Math.random() * 10}s infinite`;
      snowContainer.appendChild(snowflake);
    }
    
    // Add fog patches
    for (let i = 0; i < 3; i++) {
      const fog = document.createElement('div');
      fog.style.position = 'absolute';
      fog.style.bottom = `${10 + i * 25}%`;
      fog.style.left = `${Math.random() * 20}%`;
      fog.style.width = `${50 + Math.random() * 50}%`;
      fog.style.height = '40px';
      fog.style.background = 'rgba(255, 255, 255, 0.15)';
      fog.style.borderRadius = '50%';
      fog.style.filter = 'blur(20px)';
      fog.style.animation = `fogDrift ${30 + i * 10}s infinite alternate ease-in-out`;
      container.appendChild(fog);
    }
    
    container.appendChild(snowContainer);
  };
  
  // Update map style based on season with enhanced filters
  const updateMapStyle = (season: string, map: L.Map) => {
    // Apply filters to map based on season
    const mapContainer = map.getContainer();
    
    // Remove existing filters
    mapContainer.style.filter = '';
    
    // Apply enhanced season-specific filters with smooth transition
    mapContainer.style.transition = 'filter 1.5s ease-in-out';
    
    switch (season) {
      case '봄':
        mapContainer.style.filter = 'brightness(1.08) saturate(1.15) hue-rotate(5deg)';
        break;
      case '여름':
        mapContainer.style.filter = 'brightness(1.15) saturate(1.3) contrast(1.05)';
        break;
      case '가을':
        mapContainer.style.filter = 'brightness(1.05) saturate(0.9) sepia(0.25)';
        break;
      case '겨울':
        mapContainer.style.filter = 'brightness(1.1) saturate(0.8) contrast(1.05) hue-rotate(-10deg)';
        break;
      default:
        break;
    }
  };

  return null;
};

export default React.memo(SeasonalSystem);
