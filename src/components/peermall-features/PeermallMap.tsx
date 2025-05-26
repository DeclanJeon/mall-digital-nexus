
import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { X, Map as MapIcon } from 'lucide-react';
import EcosystemMap from '@/components/EcosystemMap';

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
          <EcosystemMap locations={allLocations} />
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  );
};

export default PeermallMap;
