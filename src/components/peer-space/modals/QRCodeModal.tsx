
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from 'qrcode.react';
import { useState } from "react";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
}

export const QRCodeModal = ({
  open,
  onOpenChange,
  url,
  title
}: QRCodeModalProps) => {
  const [qrValue] = useState(url);
  const { toast } = useToast();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "링크가 복사되었습니다",
      description: "채팅방 링크가 클립보드에 복사되었습니다.",
    });
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">QR 코드</DialogTitle>
        </DialogHeader>
        <div className="bg-white p-6 rounded-lg flex items-center justify-center mb-4">
          <QRCodeSVG
            id="qr-code"
            value={qrValue}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"L"}
            includeMargin={false}
          />
        </div>
        <p className="text-sm text-center mb-4 text-gray-500">
          이 QR 코드를 스캔하면 채팅방으로 바로 이동합니다
        </p>
        <div className="flex items-center mb-4">
          <Input 
            type="text" 
            value={url}
            readOnly
            className="flex-grow"
          />
          <Button variant="outline" className="ml-2 flex-shrink-0" onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            닫기
          </Button>
          <Button onClick={handleDownloadQR} className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            다운로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
