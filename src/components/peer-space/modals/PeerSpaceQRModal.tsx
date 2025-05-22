import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PeerSpaceQRModalProps {
  showQRModal: boolean;
  setShowQRModal: (show: boolean) => void;
  address: string;
}

const PeerSpaceQRModal: React.FC<PeerSpaceQRModalProps> = ({ showQRModal, setShowQRModal, address }) => {
  return (
    <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="text-xl font-bold">내 스페이스 QR 코드</DialogTitle></DialogHeader>
        <div className="p-4 flex justify-center">
          <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-sm text-gray-500">QR 코드 영역</div>
        </div>
        <div className="text-center text-xs mt-2 bg-gray-50 p-2 rounded border">{`https://peermall.com/space/${address}`}</div>
        <Button className="w-full mt-2">이미지 다운로드</Button>
      </DialogContent>
    </Dialog>
  );
};

export default PeerSpaceQRModal;