import React from 'react';
import {
  Filter, 
  Clock,
  TrendingUp,
  PlusCircle,
  Check,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from 'framer-motion';

interface CommunityBoardFooterProps {
  processedPostsLength: number;
  sortOption: "latest" | "popular";
  setSortOption: (option: "latest" | "popular") => void;
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
  setActiveFilters: (filters: string[]) => void;
  onNewPostClick: () => void;
}

const CommunityBoardFooter: React.FC<CommunityBoardFooterProps> = ({
  processedPostsLength,
  sortOption,
  setSortOption,
  activeFilters,
  toggleFilter,
  setActiveFilters,
  onNewPostClick,
}) => {
  return (
    <div className="border-t p-4 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
                {activeFilters.length > 0 && (
                  <Badge className="ml-1 bg-indigo-500 text-xs">{activeFilters.length}</Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <div className="p-2">
                <h4 className="font-medium mb-1">게시글 필터</h4>
                <div className="space-y-1">
                  <button
                    className={`w-full px-2 py-1.5 text-left text-sm rounded-md flex items-center justify-between ${
                      activeFilters.includes('hasComments') 
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleFilter('hasComments')}
                  >
                    <span>댓글 있음</span>
                    {activeFilters.includes('hasComments') && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    className={`w-full px-2 py-1.5 text-left text-sm rounded-md flex items-center justify-between ${
                      activeFilters.includes('popular') 
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleFilter('popular')}
                  >
                    <span>인기 게시글 (좋아요 5개+)</span>
                    {activeFilters.includes('popular') && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    className={`w-full px-2 py-1.5 text-left text-sm rounded-md flex items-center justify-between ${
                      activeFilters.includes('recent') 
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => toggleFilter('recent')}
                  >
                    <span>최근 1주일</span>
                    {activeFilters.includes('recent') && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {activeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 text-gray-500"
                    onClick={() => setActiveFilters([])}
                  >
                    <X className="h-3 w-3 mr-2" />
                    필터 초기화
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                {sortOption === "latest" ? (
                  <Clock className="h-4 w-4 mr-2" />
                ) : (
                  <TrendingUp className="h-4 w-4 mr-2" />
                )}
                {sortOption === "latest" ? "최신순" : "인기순"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem 
                onClick={() => setSortOption("latest")}
                className={sortOption === "latest" ? "bg-gray-100" : ""}
              >
                <Clock className="h-4 w-4 mr-2" />
                최신순
                {sortOption === "latest" && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOption("popular")}
                className={sortOption === "popular" ? "bg-gray-100" : ""}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                인기순
                {sortOption === "popular" && <Check className="h-4 w-4 ml-2" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-sm text-gray-500">
            총 <span className="font-medium">{processedPostsLength}</span>개 글
          </span>
        </div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Button 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30 transition-all duration-300" 
            onClick={onNewPostClick}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            새 글 작성
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityBoardFooter;
