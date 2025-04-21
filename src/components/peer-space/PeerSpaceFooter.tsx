import { Button } from "@/components/ui/button";
import { QrCode, Mail, Smartphone } from "lucide-react";

interface PeerSpaceFooterProps {
  peerNumber: string;
  contactEmail: string;
  contactPhone: string;
  onQRGenerate: () => void;
}

export const PeerSpaceFooter = ({
  peerNumber,
  contactEmail,
  contactPhone,
  onQRGenerate
}: PeerSpaceFooterProps) => (
  <div className="bg-white border-t py-4">
    <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
      <div className="flex items-center mb-4 sm:mb-0">
        <span className="text-sm text-text-200">Peer #{peerNumber}</span>
        <Button variant="ghost" size="sm" className="ml-2" onClick={onQRGenerate}>
          <QrCode className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-text-200 mr-1" />
          <span className="text-sm text-text-200">{contactEmail}</span>
        </div>
        <div className="flex items-center">
          <Smartphone className="h-4 w-4 text-text-200 mr-1" />
          <span className="text-sm text-text-200">{contactPhone}</span>
        </div>
      </div>
    </div>
  </div>
);
