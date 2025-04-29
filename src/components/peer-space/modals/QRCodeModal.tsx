import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
}: QRCodeModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">QR 코드</DialogTitle>
      </DialogHeader>
      <div className="bg-white p-4 rounded-lg flex items-center justify-center mb-4">
        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
          QR 코드 이미지
        </div>
      </div>
      <div className="mb-4">
        <Input 
          type="text" 
          value={url}
          onChange={(e) => {}}
        />
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          닫기
        </Button>
        <Button>
          다운로드
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
