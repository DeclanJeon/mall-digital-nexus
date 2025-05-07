
import React from 'react';
import { Link } from 'react-router-dom';
import { PeerMallConfig } from './types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Settings, Package } from 'lucide-react';
import { ContentFormValues } from './AddContentForm';

interface PeerSpaceHeaderProps {
  config: PeerMallConfig;
  isOwner: boolean;
  onAddContent: (content: ContentFormValues) => void;
  onAddProduct?: () => void;
}

const PeerSpaceHeader: React.FC<PeerSpaceHeaderProps> = ({ 
  config, 
  isOwner,
  onAddContent,
  onAddProduct
}) => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link to={`/space/${config.id}`} className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={config.profileImage} alt={config.owner} />
            <AvatarFallback>{config.owner.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg">{config.title}</h1>
            <p className="text-xs text-gray-500">{config.peerNumber}</p>
          </div>
        </Link>
        
        <div className="flex gap-2">
          {isOwner ? (
            <>
              {onAddProduct && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={onAddProduct}
                  className="hidden md:flex"
                >
                  <Package className="mr-2 h-4 w-4" />
                  제품 등록
                </Button>
              )}
              <Button 
                size="sm" 
                onClick={() => {
                  // This is a simplified approach, you should open a proper modal here
                  // For now, we'll just create a default content for demonstration
                  const defaultContent: ContentFormValues = {
                    title: "새 콘텐츠",
                    description: "내용을 입력하세요",
                    imageUrl: "https://via.placeholder.com/800x600.png?text=New+Content",
                    type: 'post',
                    price: ""
                  };
                  
                  onAddContent(defaultContent);
                }}
                className="hidden md:flex"
              >
                <Plus className="mr-2 h-4 w-4" />
                콘텐츠 추가
              </Button>
              <Link to={`/space/${config.id}/settings`}>
                <Button 
                  size="sm" 
                  variant="ghost"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/community">
              <Button size="sm">커뮤니티 방문</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PeerSpaceHeader;
