import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
}

const QRCodeModal = ({ open, onOpenChange, url, title }: QRCodeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title} QR 코드</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center py-4">
          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center mb-4">
            {/* QR 코드 이미지가 여기에 표시됩니다 */}
            <span className="text-gray-500">QR 코드 이미지</span>
          </div>
          <p className="text-sm text-text-200 break-all">{url}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
