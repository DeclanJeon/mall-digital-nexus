
import React from 'react';
import { Link } from 'react-router-dom';
import { PeerMallConfig } from '@/types/space';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Settings, Package, Users } from 'lucide-react'; // Users 아이콘 추가
import { ContentFormValues } from '../forms/AddContentForm';

interface PeerSpaceHeaderProps {
  config: PeerMallConfig;
  isOwner: boolean;
  onAddContent: (content: ContentFormValues) => void;
  onAddProduct?: () => void;
  // onNavigateToCommunity?: () => void; // Link로 변경하므로 prop 제거
}

const PeerSpaceHeader: React.FC<PeerSpaceHeaderProps> = ({
  config,
  isOwner,
  onAddContent,
  onAddProduct,
  // onNavigateToCommunity, // prop 제거
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
        
        <div className="flex gap-2 items-center">
          <Link to={`/space/${config.id}/community`}>
            <Button
              size="sm"
              variant="outline"
              className="hidden md:flex items-center"
            >
              <Users className="mr-2 h-4 w-4" />
              커뮤니티
            </Button>
          </Link>
          {isOwner ? (
            <>
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
            // 소유자가 아닐 경우, 글로벌 커뮤니티 방문 버튼 유지 또는 다른 로직
            <Link to="/community">
              <Button size="sm" variant="ghost" className="text-gray-600 hover:text-gray-900">전체 커뮤니티</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default PeerSpaceHeader;
