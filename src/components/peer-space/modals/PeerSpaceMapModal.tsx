import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';
import EcosystemMap from '@/components/EcosystemMap';

interface PeerSpaceMapModalProps {
  showMapModal: boolean;
  setShowMapModal: (show: boolean) => void;
}

const PeerSpaceMapModal: React.FC<PeerSpaceMapModalProps> = ({ showMapModal, setShowMapModal }) => {
  return (
    <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
      <DialogContent className="max-w-5xl max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" />
            피어맵
          </DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] w-full overflow-hidden rounded-lg">
          <EcosystemMap />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PeerSpaceMapModal;