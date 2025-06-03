
import React from 'react';
import { Search, Users, Calendar, MapPin, Plus, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface MapControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showMyCommunitiesOnly: boolean;
  toggleMyCommunitiesFilter: () => void;
  showEventsOnly: boolean;
  toggleEventsFilter: () => void;
  showNearbyCommunities: boolean;
  toggleNearbyCommunities: () => void;
  nearbyCommunitiesIds: string[];
  isCreationMode: boolean;
  startCommunityCreation: () => void;
  cancelCommunityCreation: () => void;
  hasFiltersApplied: boolean;
  clearAllFilters: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  searchQuery,
  setSearchQuery,
  showMyCommunitiesOnly,
  toggleMyCommunitiesFilter,
  showEventsOnly,
  toggleEventsFilter,
  showNearbyCommunities,
  toggleNearbyCommunities,
  nearbyCommunitiesIds,
  isCreationMode,
  startCommunityCreation,
  cancelCommunityCreation,
  hasFiltersApplied,
  clearAllFilters
}) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row gap-4 justify-between bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
      <div className="flex items-center gap-2 flex-1">
        <Input
          type="text"
          placeholder="커뮤니티 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-64 border border-gray-300"
        />
        
        <Button variant="outline" size="icon" className="border border-gray-300">
          <Search className="h-4 w-4" />
        </Button>
        
        {hasFiltersApplied && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="ml-2 text-xs flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            필터 초기화
          </Button>
        )}
      </div>
      
      <div className="flex gap-2 flex-wrap md:flex-nowrap justify-end">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showMyCommunitiesOnly ? "default" : "outline"}
                  size="sm"
                  className={showMyCommunitiesOnly 
                    ? "bg-community-tertiary text-white" 
                    : "border border-gray-300"
                  }
                  onClick={toggleMyCommunitiesFilter}
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">내 커뮤니티</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>내가 가입한 커뮤니티</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showEventsOnly ? "default" : "outline"}
                  size="sm"
                  className={showEventsOnly 
                    ? "bg-community-tertiary text-white" 
                    : "border border-gray-300"
                  }
                  onClick={toggleEventsFilter}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">이벤트</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>진행 중인 이벤트</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showNearbyCommunities ? "default" : "outline"}
                  size="sm"
                  className={`${showNearbyCommunities 
                    ? "bg-community-tertiary text-white" 
                    : "border border-gray-300"} ${nearbyCommunitiesIds.length === 0 ? 'opacity-50' : ''}`}
                  onClick={toggleNearbyCommunities}
                  disabled={nearbyCommunitiesIds.length === 0}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">주변</span>
                  {nearbyCommunitiesIds.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 flex items-center justify-center px-1 text-xs">
                      {nearbyCommunitiesIds.length}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>내 주변 커뮤니티</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Button 
          variant={isCreationMode ? "destructive" : "default"}
          size="sm"
          className={`ml-2 ${isCreationMode ? '' : 'bg-community-tertiary hover:bg-community-primary'} text-white`}
          onClick={isCreationMode ? cancelCommunityCreation : startCommunityCreation}
        >
          {isCreationMode ? (
            <>
              <X className="h-4 w-4 mr-2" />
              <span>취소</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              <span>새 커뮤니티</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(MapControls);
