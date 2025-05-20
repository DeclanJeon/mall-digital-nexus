
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { WeatherType } from '@/services/weatherService';
import { CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun } from 'lucide-react';

interface WeatherOverlayProps {
  weather: WeatherType;
  temperature?: number;
  windSpeed?: number;
  showInfo?: boolean;
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ 
  weather, 
  temperature = 20, 
  windSpeed = 5,
  showInfo = true
}) => {
  const map = useMap();
  const [mounted, setMounted] = useState(false);
  
  // Helper to get weather icon
  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny': return <CloudSun className="h-4 w-4" />;
      case 'cloudy': return <CloudSun className="h-4 w-4" />;
      case 'rainy': return <CloudRain className="h-4 w-4" />;
      case 'snowy': return <CloudSnow className="h-4 w-4" />;
      case 'foggy': return <CloudFog className="h-4 w-4" />;
      default: return <CloudSun className="h-4 w-4" />;
    }
  };
  
  // Helper to get weather description
  const getWeatherDescription = () => {
    switch (weather) {
      case 'sunny': return '맑음';
      case 'cloudy': return '흐림';
      case 'rainy': return '비';
      case 'snowy': return '눈';
      case 'foggy': return '안개';
      default: return '맑음';
    }
  };
  
  useEffect(() => {
    if (mounted) return;
    
    // Add weather effect CSS
    const style = document.createElement('style');
    document.head.appendChild(style);
    
    // Create weather container
    const weatherContainer = L.DomUtil.create('div', 'weather-particles');
    weatherContainer.style.position = 'absolute';
    weatherContainer.style.top = '0';
    weatherContainer.style.left = '0';
    weatherContainer.style.width = '100%';
    weatherContainer.style.height = '100%';
    weatherContainer.style.pointerEvents = 'none';
    weatherContainer.style.zIndex = '400';
    
    // Clear previous weather effects
    weatherContainer.innerHTML = '';
    
    if (weather === 'rainy') {
      // Create rain drops
      for (let i = 0; i < 100; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.opacity = `${0.3 + Math.random() * 0.4}`;
        drop.style.animation = `rainfall ${0.7 + Math.random() * 0.5}s linear ${Math.random()}s infinite`;
        weatherContainer.appendChild(drop);
      }
    } else if (weather === 'snowy') {
      // Create snowflakes
      for (let i = 0; i < 80; i++) {
        const size = 2 + Math.random() * 5;
        const flake = document.createElement('div');
        flake.className = 'snow';
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.opacity = `${0.6 + Math.random() * 0.4}`;
        flake.style.animation = `snowfall ${5 + Math.random() * 10}s linear ${Math.random() * 5}s infinite`;
        weatherContainer.appendChild(flake);
      }
    } else if (weather === 'cloudy') {
      // Create clouds
      for (let i = 0; i < 10; i++) {
        const size = 40 + Math.random() * 100;
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        cloud.style.width = `${size}px`;
        cloud.style.height = `${size * 0.6}px`;
        cloud.style.top = `${10 + Math.random() * 30}%`;
        cloud.style.opacity = `${0.1 + Math.random() * 0.3}`;
        cloud.style.animation = `cloud-drift ${30 + Math.random() * 60}s linear ${Math.random() * 30}s infinite`;
        weatherContainer.appendChild(cloud);
      }
    } else if (weather === 'foggy') {
      const fogOverlay = document.createElement('div');
      fogOverlay.className = 'fog';
      weatherContainer.appendChild(fogOverlay);
    }
    
    map.getContainer().appendChild(weatherContainer);
    
    // Create weather info box
    if (showInfo) {
      const weatherInfo = L.DomUtil.create('div', 'weather-info');
      
      weatherInfo.innerHTML = `
        <div class="weather-info-header">
          <span>${getWeatherDescription()}</span>
          <span class="weather-info-icon">${weather === 'sunny' ? '☀️' : weather === 'cloudy' ? '☁️' : weather === 'rainy' ? '🌧️' : weather === 'snowy' ? '❄️' : '🌫️'}</span>
        </div>
        <div class="weather-info-item">
          <span>온도</span>
          <span>${temperature}°C</span>
        </div>
        <div class="weather-info-item">
          <span>풍속</span>
          <span>${windSpeed} m/s</span>
        </div>
      `;
      
      map.getContainer().appendChild(weatherInfo);
    }
    
    setMounted(true);
    
    return () => {
      if (map.getContainer().contains(weatherContainer)) {
        map.getContainer().removeChild(weatherContainer);
      }
      if (showInfo) {
        const infoElements = map.getContainer().getElementsByClassName('weather-info');
        if (infoElements.length > 0) {
          map.getContainer().removeChild(infoElements[0]);
        }
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [weather, map, mounted, temperature, windSpeed, showInfo]);
  
  return null;
};

export default WeatherOverlay;
