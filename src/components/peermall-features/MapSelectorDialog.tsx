import React, { lazy, Suspense, useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

// Lazy load MapMarkerSelector to avoid SSR issues
const MapMarkerSelector = lazy(() => import('./MapMarkerSelector'));

interface MapSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: { lat: number; lng: number; address: string }) => void;
  initialPosition?: { lat: number; lng: number };
  initialAddress?: string;
}

export const MapSelectorDialog: React.FC<MapSelectorDialogProps> = ({
  isOpen,
  onClose,
  onSelect,
  initialPosition = { lat: 37.5665, lng: 126.9780 },
  initialAddress = ''
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);

  // handleLocationSelect를 useCallback으로 감싸기
  const handleLocationSelect = useCallback((location: { lat: number; lng: number; address: string }) => {
    setSelectedLocation(location);
  }, []); // 의존성 배열이 비어있으므로, setSelectedLocation은 항상 동일한 참조를 가짐

  // handleConfirm도 useCallback으로 감싸기
  const handleConfirm = useCallback(() => {
    if (selectedLocation) {
      onSelect(selectedLocation);
    }
    onClose();
  }, [selectedLocation, onSelect, onClose]); // selectedLocation, onSelect, onClose를 의존성으로 추가

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto z-[1001]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">지도에서 위치 선택</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="h-[500px] w-full rounded-lg overflow-hidden border">
            <Suspense fallback={
              <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-muted-foreground">지도 로드 중...</p>
                </div>
              </div>
            }>
              <MapMarkerSelector
                onLocationSelect={handleLocationSelect}
                initialPosition={initialPosition}
                initialAddress={initialAddress}
              />
            </Suspense>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedLocation}
            >
              <MapPin className="mr-2 h-4 w-4" />
              이 위치로 선택
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapSelectorDialog;
