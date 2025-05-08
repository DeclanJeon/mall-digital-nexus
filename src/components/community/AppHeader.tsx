// src/components/community/AppHeader.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Globe, Circle, Star, Bell } from 'lucide-react';
import { AppHeaderProps } from './types';

const AppHeader: React.FC<AppHeaderProps> = ({
  filter,
  onFilterChange,
  darkMode,
  onDarkModeToggle,
  username,
  showBoardView,
}) => {
  return (
    <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Globe className="h-6 w-6 text-blue-400" />
          <h1 className="text-xl font-bold">피어스페이스 Universe</h1>
        </div>
        <div className="flex items-center space-x-4">
          {!showBoardView && (
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="행성 검색..."
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="pl-9 bg-white/10 border-white/20 text-white"
              />
            </div>
          )}
          <button
            onClick={onDarkModeToggle}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10"
            aria-label={darkMode ? "라이트 모드로 변경" : "다크 모드로 변경"}
          >
            {darkMode ? (
              <Circle className="h-5 w-5 text-yellow-300" /> // 해 아이콘 (Sun) 이 더 적절할 수 있음
            ) : (
              <Star className="h-5 w-5 text-blue-300" /> // 달 아이콘 (Moon) 이 더 적절할 수 있음
            )}
          </button>
          <div className="relative">
            <Bell className="h-5 w-5 text-blue-300" />
            <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              3
            </span>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${username}`} alt={username} />
            <AvatarFallback>{username ? username.substring(0, 2).toUpperCase() : '익명'}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};
export default AppHeader;