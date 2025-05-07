
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
// import { Content } from './types';
import { Heart, BookmarkPlus, MessageCircle, Calendar } from 'lucide-react';
// import ExternalIndicator from './ExternalIndicator';
import { Content } from '@/components/peer-space/types';
import ExternalIndicator from '../ui/ExternalIndicator';

interface ContentCardProps {
  content: Content;
  onClick?: () => void;
}

const ContentCard = ({ content, onClick }: ContentCardProps) => {
  const location = useLocation();
  const address = location.pathname.split('/')[2];

  const handleCardClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onClick?.();
  };

  // Helper function to determine content type
  const getContentTypeBadge = (type: string) => {
    const typeMap: Record<string, { label: string, className: string }> = {
      'product': { label: '상품', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      'service': { label: '서비스', className: 'bg-green-100 text-green-800 border-green-200' },
      'post': { label: '게시글', className: 'bg-gray-100 text-gray-800 border-gray-200' },
      'event': { label: '이벤트', className: 'bg-red-100 text-red-800 border-red-200' },
      'portfolio': { label: '포트폴리오', className: 'bg-purple-100 text-purple-800 border-purple-200' },
      'review': { label: '리뷰', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'quest': { label: '퀘스트', className: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
    };

    const defaultType = { label: type, className: 'bg-gray-100 text-gray-800 border-gray-200' };
    const badgeInfo = typeMap[type] || defaultType;

    return (
      <Badge variant="outline" className={`absolute top-2 left-2 ${badgeInfo.className}`}>
        {badgeInfo.label}
      </Badge>
    );
  };

  return (
    <div onClick={handleCardClick}>
      <Link to={`/space/${address}/content/${content.id}`} onClick={(e) => e.stopPropagation()}>
        <div
          className="block bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
        >
        <div className="relative aspect-video bg-gray-100">
          {getContentTypeBadge(content.type)}
          
          {content.isExternal && (
            <div className="absolute top-2 right-2">
              <ExternalIndicator />
            </div>
          )}
          
          <img
            src={content.imageUrl}
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {content.title}
          </h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {content.description}
          </p>
          
          {content.price && (
            <p className="text-blue-600 font-semibold my-1">{content.price}</p>
          )}
          
          {content.date && !content.price && (
            <div className="flex items-center text-xs text-gray-500 my-1">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(content.date).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 border-t bg-gray-50 flex justify-between items-center text-xs text-gray-500">
          <div className="flex space-x-3">
            <span className="flex items-center">
              <Heart className="h-3.5 w-3.5 mr-1" />
              {content.likes || 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  </div>
);
};

export default ContentCard;
