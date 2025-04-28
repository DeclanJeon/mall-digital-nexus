
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode, Share2, Copy, IdCard } from 'lucide-react';

interface QRCodeItem {
  id: string;
  name: string;
  purpose: string;
  createdAt: string;
  image: string;
  usageCount?: number;
}

interface QRCodeSectionProps {
  qrCodes: QRCodeItem[];
}

const QRCodeSection: React.FC<QRCodeSectionProps> = ({
  qrCodes
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2 text-primary" />
          QR 코드/디지털 자산
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">내 QR 코드</h3>
            <Button variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              QR 코드 생성
            </Button>
          </div>
          
          {qrCodes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {qrCodes.slice(0, 2).map((qrCode) => (
                <div key={qrCode.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{qrCode.name}</h4>
                    {qrCode.usageCount !== undefined && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {qrCode.usageCount}회 사용됨
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{qrCode.purpose}</p>
                  
                  <div className="flex justify-center mb-2">
                    <div className="h-28 w-28 bg-white p-1 rounded">
                      <img 
                        src={qrCode.image} 
                        alt={qrCode.name} 
                        className="h-full w-full" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-muted rounded-md">
              <p className="text-muted-foreground">생성된 QR 코드가 없습니다</p>
            </div>
          )}
          
          {qrCodes.length > 2 && (
            <Button variant="link" className="w-full mt-2">
              더 많은 QR 코드 보기 ({qrCodes.length - 2})
            </Button>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center">
              <IdCard className="h-4 w-4 mr-2" />
              디지털 명함
            </h3>
            <Button variant="outline" size="sm">명함 편집</Button>
          </div>
          
          <div className="rounded-lg border bg-gradient-to-r from-primary/20 to-primary/5 p-4 relative overflow-hidden">
            <div className="z-10 relative">
              <h4 className="text-xl font-bold">김민지</h4>
              <p className="text-sm mb-3">디자인 스튜디오 대표</p>
              
              <div className="space-y-1 text-sm">
                <p>피어넘버: PN7829354</p>
                <p>Email: example@peermall.com</p>
                <p>Phone: 010-1234-5678</p>
              </div>
            </div>
            
            <div className="absolute bottom-3 right-3 rounded-full h-16 w-16 bg-white/10"></div>
            <div className="absolute top-5 right-10 rounded-full h-8 w-8 bg-primary/20"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeSection;
