
import React from 'react';
import { Map, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface PeerSpaceMapProps {
  locations: Array<{
    id: string;
    name: string;
    address: string;
    category: string[];
    rating: number;
    lat: number;
    lng: number;
  }>;
}

export const PeerSpaceMap = ({ locations }: PeerSpaceMapProps) => {
  return (
    <div className="w-full h-[400px] relative rounded-lg overflow-hidden bg-gray-100">
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="w-72">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">지도 기능 준비 중</CardTitle>
            <CardDescription>
              곧 피어몰 위치 정보와 상호작용이 가능한 지도 기능이 추가될 예정입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-1" />
                통화
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" />
                메시지
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Map className="w-12 h-12 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
    </div>
  );
};

export default PeerSpaceMap;
