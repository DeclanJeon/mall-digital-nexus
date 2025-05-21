
import React from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Dialog } from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MapIcon className="h-5 w-5 mr-2 text-accent-200" />
            피어몰 지도
          </DialogTitle>
        </DialogHeader>
        <div className="flex-grow p-4 overflow-hidden">
          <EcosystemMap />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>닫기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PeermallMap;
