
import React, { useState } from 'react';
import { Star, MapPin, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card'; // Card 임포트 추가
import { QRCodeModal } from '@/components/peer-space/modals/QRCodeModal';

interface PeermallCardProps {
  title: string;
  description: string;
  owner: string;
  imageUrl: string;
  category: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  feedDate?: string;
  recommended?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  onOpenMap?: (location: { lat: number; lng: number; address: string; title: string }) => void;
  id?: string;
  // address?: string; // id를 우선 사용하므로 주석 처리 또는 제거 가능
  viewMode: 'grid' | 'list'; // viewMode prop 추가
  onShowQrCode?: (peermallId: string, peermallTitle: string) => void; // QR 코드 표시 콜백 추가
}

const PeermallCard = ({
  title,
  description,
  owner,
  imageUrl,
  category,
  tags = [],
  rating,
  reviewCount,
  featured,
  // feedDate, // 현재 카드에 미사용
  // recommended, // 현재 카드에 미사용 (featured로 통합 가능성)
  location,
  onOpenMap,
  id,
  // address,
  viewMode,
  onShowQrCode
}: PeermallCardProps) => {
  const [showQR, setShowQR] = useState(false);
  const peermallUrl = id ? `${window.location.origin}/space/${id}` : '#';

  const handleQrIconClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 전체 클릭 방지
    e.preventDefault(); // 링크 이동 방지
    if (id && onShowQrCode) {
      onShowQrCode(id, title);
    } else if (id) { // onShowQrCode 콜백이 없을 경우 자체적으로 모달 제어 (선택적)
      setShowQR(true);
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow w-full flex flex-row ${featured ? 'ring-2 ring-accent-100' : ''}`}>
        <div className="relative w-40 h-full flex-shrink-0">
          <Link to={id ? `/space/${id}` : '#'}>
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform"
            />
          </Link>
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {featured && <div className="bg-accent-100 text-white text-xs px-2 py-1 rounded-full">인기</div>}
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2">
            <span className="text-white text-xs font-semibold">{category}</span>
          </div>
        </div>
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-1">
              <Link to={id ? `/space/${id}` : '#'} className="hover:text-primary-400">
                <h3 className="text-md font-bold text-primary-300 line-clamp-1">{title}</h3>
              </Link>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm ml-1">{rating}</span>
              </div>
            </div>
            <p className="text-gray-600 text-xs mb-1">{owner}</p>
            <p className="text-text-200 text-sm mb-2 line-clamp-2 h-10">{description}</p>
            {tags && tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="inline-block text-xs bg-bg-200 text-text-200 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-xs text-gray-500">{reviewCount}개 리뷰</span>
            <div className="flex items-center space-x-1">
              {id && (
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-gray-500 hover:text-primary-300" onClick={handleQrIconClick}>
                  <QrCode className="h-4 w-4" />
                </Button>
              )}
              {location && onOpenMap && (
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-gray-500 hover:text-primary-300" onClick={() => onOpenMap({ ...location, title })}>
                  <MapPin className="h-4 w-4" />
                </Button>
              )}
              <Link to={id ? `/space/${id}` : '#'} className="text-accent-200 hover:text-accent-100 text-sm px-2 py-1">
                방문하기
              </Link>
            </div>
          </div>
        </div>
        {showQR && id && ( // 자체 QR 모달 (onShowQrCode 콜백 없을 시 대비)
          <QRCodeModal open={showQR} onOpenChange={setShowQR} url={peermallUrl} title={title} />
        )}
      </Card>
    );
  }

  // 기본 그리드 뷰
  return (
    <Card className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full flex flex-col ${featured ? 'ring-2 ring-accent-100' : ''}`}>
      <div className="relative h-48 overflow-hidden">
        <Link to={id ? `/space/${id}` : '#'}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform"
          />
        </Link>
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {featured && (
            <div className="bg-accent-100 text-white text-xs px-2 py-1 rounded-full">
              인기
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="text-white text-xs font-semibold">{category}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <Link to={id ? `/space/${id}` : '#'} className="hover:text-primary-400">
            <h3 className="text-lg font-bold mb-1 text-primary-300 line-clamp-1">{title}</h3>
          </Link>
          <div className="flex items-center text-yellow-500 flex-shrink-0">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm ml-1">{rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-2">{owner}</p>
        <p className="text-text-200 text-sm h-10 overflow-hidden line-clamp-2 mb-2">{description}</p>
        
        {tags && tags.length > 0 && (
          <div className="mt-auto pt-2 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="inline-block text-xs bg-bg-200 text-text-200 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{reviewCount}개 리뷰</span>
          <div className="flex items-center space-x-1">
            {id && (
              <Button variant="ghost" size="icon" className="h-7 w-7 p-0 text-gray-500 hover:text-primary-300" onClick={handleQrIconClick}>
                <QrCode className="h-4 w-4" />
              </Button>
            )}
            {location && onOpenMap && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 p-0 text-gray-500 hover:text-primary-300"
                onClick={() => onOpenMap({ ...location, title })}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            )}
            <Link
              to={id ? `/space/${id}` : '#'} // address 대신 id 사용
              className="text-accent-200 hover:text-accent-100 text-sm px-2 py-1"
            >
              방문하기
            </Link>
          </div>
        </div>
      </div>
      {showQR && id && ( // 자체 QR 모달 (onShowQrCode 콜백 없을 시 대비)
        <QRCodeModal open={showQR} onOpenChange={setShowQR} url={peermallUrl} title={title} />
      )}
    </Card>
  );
};

export default PeermallCard;
