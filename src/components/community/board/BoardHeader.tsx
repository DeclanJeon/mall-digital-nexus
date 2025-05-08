// src/components/community/BoardHeader.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Search } from 'lucide-react';
import { BoardHeaderProps } from '../types';

const BoardHeader: React.FC<BoardHeaderProps> = ({
  selectedLocation,
  onReturnToUniverse,
  onShowNewPostForm,
  // onSearchPosts, // 검색 기능 필요 시 추가
}) => {
  // const [searchTerm, setSearchTerm] = React.useState('');

  // const handleSearch = () => {
  //   if (onSearchPosts) onSearchPosts(searchTerm);
  // };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <button
            onClick={onReturnToUniverse}
            className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 transition-colors"
          >
            <Globe className="h-5 w-5" />
            <span>우주로 돌아가기</span>
          </button>
        </div>
        <h1 className="text-2xl font-bold">{selectedLocation} 커뮤니티</h1>
      </div>
      <div className="flex space-x-4 items-center">
        {/* <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="게시글 검색..."
            className="pl-9 bg-white/10 border-white/20 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div> */}
        <Button onClick={onShowNewPostForm}>새 글쓰기</Button>
      </div>
    </div>
  );
};

export default BoardHeader;