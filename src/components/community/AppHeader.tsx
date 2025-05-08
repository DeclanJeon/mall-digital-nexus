
// src/components/community/AppHeader.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
        <div className="w-full flex items-center space-x-4 justify-end">
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
        </div>
      </div>
    </div>
  );
};
export default AppHeader;
