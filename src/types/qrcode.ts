export interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;  // Not onClose
  url: string;
  title: string;
}