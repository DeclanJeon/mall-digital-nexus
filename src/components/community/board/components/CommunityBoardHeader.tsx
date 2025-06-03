import React, { useRef, useEffect } from 'react';
import {
  Search, 
  SlidersHorizontal,
  Bell,
  X,
  Info,
  Home
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';

interface CommunityBoardHeaderProps {
  zoneName: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onChannelManageClick: () => void;
  hasNotifications: boolean;
  showHelpTips: boolean;
  dismissHelpTips: () => void;
  breadcrumbs: {label: string, path: string}[];
}

const CommunityBoardHeader: React.FC<CommunityBoardHeaderProps> = ({
  zoneName,
  searchQuery,
  setSearchQuery,
  onChannelManageClick,
  hasNotifications,
  showHelpTips,
  dismissHelpTips,
  breadcrumbs
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const focusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === '/') || (!e.ctrlKey && !e.altKey && e.key === '/')) {
        e.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white">{zoneName}</h2>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
              커뮤니티
            </Badge>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-72">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="게시글 검색... (/ 단축키)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 pr-12"
                aria-label="게시글 검색"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-white/70">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mr-1 hover:text-white"
                    aria-label="검색어 지우기"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <Search className="h-4 w-4" />
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={onChannelManageClick}
                    variant="ghost" 
                    size="icon" 
                    className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
                    aria-label="채널 관리"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>채널 관리</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-white/10 border border-white/20 text-white hover:bg-white/20">
                        <Bell className="h-4 w-4" />
                        {hasNotifications && (
                          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>알림</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <DropdownMenuContent align="end" className="w-64">
                <h3 className="px-2 py-1.5 text-sm font-semibold">알림</h3>
                <div className="py-2 text-sm text-center text-muted-foreground">
                  새로운 알림이 없습니다.
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityBoardHeader;
