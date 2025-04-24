
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PeerSpaceMapSectionProps {
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  title: string;
}

const PeerSpaceMapSection: React.FC<PeerSpaceMapSectionProps> = ({ location, title }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([location.lat, location.lng], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
      
      // Add marker
      L.marker([location.lat, location.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(`<b>${title}</b><br>${location.address}`)
        .openPopup();
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [location.lat, location.lng, location.address, title]);

  // Handle direction click
  const handleDirection = () => {
    // Open in Google Maps
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
      '_blank'
    );
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6">위치 정보</h2>
      
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-2">
            <div ref={mapRef} className="h-[300px] md:h-[400px] w-full" />
          </div>
          
          <div className="p-6 flex flex-col">
            <h3 className="font-medium text-lg mb-2">{title}</h3>
            
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-gray-700">{location.address}</p>
            </div>
            
            <div className="space-y-2 mt-auto">
              <Button onClick={handleDirection} className="w-full bg-blue-500 hover:bg-blue-600">
                <Navigation className="h-4 w-4 mr-2" />
                길찾기
              </Button>
              
              <Button variant="outline" className="w-full">
                상세 정보
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default PeerSpaceMapSection;
