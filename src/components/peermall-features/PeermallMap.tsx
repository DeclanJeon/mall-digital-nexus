
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { X, Map as MapIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

interface Location {
  lat: number;
  lng: number;
  address: string;
  title: string;
}

interface PeermallMapProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: Location | null;
  allLocations: Location[];
}

const PeermallMap: React.FC<PeermallMapProps> = ({ 
  isOpen, 
  onClose, 
  selectedLocation, 
  allLocations = [] 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (isOpen && mapRef.current && !leafletMap.current) {
      // Initialize map
      leafletMap.current = L.map(mapRef.current).setView([37.5665, 126.9780], 13);

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);

      // Create a marker cluster group
      markersLayer.current = L.layerGroup().addTo(leafletMap.current);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [isOpen]);

  // Update markers when locations change
  useEffect(() => {
    if (!isOpen || !leafletMap.current || !markersLayer.current) return;

    // Clear existing markers
    markersLayer.current.clearLayers();

    // Add markers for all locations
    // TODO: 각 location.address를 기반으로 정확한 위도(lat)와 경도(lng)를 얻기 위한 지오코딩 로직이 필요합니다.
    // 현재는 Peermall 생성 시 lat/lng가 0,0 또는 기본값으로 설정될 수 있으며, 이 경우 마커가 의도치 않은 위치에 표시될 수 있습니다.
    // 지오코딩은 비동기 작업이므로, useEffect 내에서 또는 데이터를 준비하는 상위 컴포넌트에서 처리해야 합니다.
    allLocations.forEach(location => {
      // 유효한 위도/경도 값인지 확인 (0,0 이거나 기본값일 경우 지도에 표시하지 않거나, 사용자에게 알림)
      // 여기서는 일단 모든 위치를 표시하도록 둡니다.
      const marker = L.marker([location.lat, location.lng])
        .bindPopup(`<b>${location.title}</b><br>${location.address}`)
        .addTo(markersLayer.current!);
      
      // If this is the selected location, open its popup
      if (selectedLocation && 
          selectedLocation.lat === location.lat && 
          selectedLocation.lng === location.lng) {
        marker.openPopup();
        leafletMap.current!.setView([location.lat, location.lng], 15);
      }
    });

    // If there are markers but no selected location, fit the map to show all markers
    if (allLocations.length > 0 && !selectedLocation && leafletMap.current) {
      const group = L.featureGroup(
        allLocations.map(loc => L.marker([loc.lat, loc.lng]))
      );
      leafletMap.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [isOpen, selectedLocation, allLocations]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <MapIcon className="h-5 w-5 mr-2 text-accent-200" />
            피어몰 지도
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-grow p-4 overflow-hidden">
          <div ref={mapRef} className="w-full h-[60vh] rounded-lg border" />
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  );
};

export default PeermallMap;
