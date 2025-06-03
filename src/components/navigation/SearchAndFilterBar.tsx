import React, { useState } from 'react';
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Bookmark,
  X,
  ChevronDown,
  Heart
} from 'lucide-react';
import { PeermallType, HashtagFilterOption } from '@/components/navigation/HashtagFilter';

export type BookmarkItem = {
  id: string;
  title: string;
  description?: string;
  addedAt: Date;
};

interface SearchAndFilterBarProps {
  hashtags: HashtagFilterOption[];
  peermallTypeOptions: { label: string; value: PeermallType }[];
  bookmarks: BookmarkItem[];
  onSearchChange: (query: string) => void;
  onFilterChange: (selectedHashtags: string[], selectedTypes: PeermallType[]) => void;
  onBookmarkToggle: (itemId: string) => void;
  onBookmarkRemove: (itemId: string) => void;
  className?: string;
}

const SearchAndFilterBar = ({
  hashtags,
  peermallTypeOptions,
  bookmarks,
  onSearchChange,
  onFilterChange,
  onBookmarkToggle,
  onBookmarkRemove,
  className = ""
}: SearchAndFilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(['전체']);
  const [selectedPeermallTypes, setSelectedPeermallTypes] = useState<PeermallType[]>(['all']);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showBookmarks, setShowBookmarks] = useState<boolean>(false);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  const handleHashtagToggle = (value: string) => {
    let newSelected: string[];
    
    if (value === '전체') {
      newSelected = ['전체'];
    } else {
      const withoutAll = selectedHashtags.filter(tag => tag !== '전체');
      
      if (withoutAll.includes(value)) {
        newSelected = withoutAll.filter(tag => tag !== value);
        if (newSelected.length === 0) newSelected = ['전체'];
      } else {
        newSelected = [...withoutAll, value];
      }
    }
    
    setSelectedHashtags(newSelected);
    onFilterChange(newSelected, selectedPeermallTypes);
  };

  const handleTypeToggle = (value: PeermallType) => {
    let newSelected: PeermallType[];
    
    if (value === 'all') {
      newSelected = ['all'];
    } else {
      const withoutAll = selectedPeermallTypes.filter(type => type !== 'all');
      
      if (withoutAll.includes(value)) {
        newSelected = withoutAll.filter(type => type !== value);
        if (newSelected.length === 0) newSelected = ['all'];
      } else {
        newSelected = [...withoutAll, value];
      }
    }
    
    setSelectedPeermallTypes(newSelected);
    onFilterChange(selectedHashtags, newSelected);
  };

  const toggleBookmarks = () => {
    setShowBookmarks(!showBookmarks);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* 통합 검색창 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="검색어를 입력하세요... 🔍"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              style={{
                borderColor: searchQuery ? 'var(--primary-100)' : 'var(--bg-300)',
                backgroundColor: 'var(--bg-100)'
              }}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* 필터 토글 버튼 */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border-2 rounded-lg transition-all duration-200 hover:shadow-md"
            style={{
              borderColor: showFilters ? 'var(--primary-100)' : 'var(--bg-300)',
              backgroundColor: showFilters ? 'var(--primary-300)' : 'white',
              color: showFilters ? 'var(--primary-100)' : 'var(--text-200)'
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            필터
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>

          {/* 북마크 버튼 */}
          {/* <Button
            variant="outline"
            onClick={toggleBookmarks}
            className="px-4 py-2 border-2 rounded-lg transition-all duration-200 hover:shadow-md relative"
            style={{
              borderColor: showBookmarks ? 'var(--accent-100)' : 'var(--bg-300)',
              backgroundColor: showBookmarks ? 'var(--accent-100)' : 'white',
              color: showBookmarks ? 'white' : 'var(--text-200)'
            }}
          >
          <Bookmark className="h-4 w-4 mr-2" />
            북마크
            {bookmarks.length > 0 && (
              <span 
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {bookmarks.length}
              </span>
            )}
          </Button> */}
        </div>
      </div>
      {showFilters && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="mr-2">🏷️</span>
              해시태그 필터
            </h3>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((hashtag) => (
                <Toggle
                  key={hashtag.value}
                  pressed={selectedHashtags.includes(hashtag.value)}
                  onPressedChange={() => handleHashtagToggle(hashtag.value)}
                  className="px-3 py-1.5 text-sm rounded-full transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: selectedHashtags.includes(hashtag.value) 
                      ? 'var(--primary-100)' 
                      : 'var(--bg-200)',
                    color: selectedHashtags.includes(hashtag.value) 
                      ? 'white' 
                      : 'var(--text-200)',
                    border: selectedHashtags.includes(hashtag.value) 
                      ? '2px solid var(--primary-100)' 
                      : '2px solid transparent'
                  }}
                >
                  {hashtag.label}
                </Toggle>
              ))}
            </div>
          </div>
          
          {/* 타입 필터 */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span className="mr-2">✨</span>
              타입 필터
            </h3>
            <div className="flex flex-wrap gap-2">
              {peermallTypeOptions.map((typeOption) => (
                <Toggle
                  key={typeOption.value}
                  pressed={selectedPeermallTypes.includes(typeOption.value)}
                  onPressedChange={() => handleTypeToggle(typeOption.value)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 hover:scale-105 ${
                    selectedPeermallTypes.includes(typeOption.value)
                      ? 'bg-accent-100 text-white'
                      : 'bg-bg-200 text-text-200 hover:bg-primary-100'
                  }`}
                >
                  {typeOption.label}
                </Toggle>
              ))}
            </div>
          </div>
          
          {/* 향후 확장을 위한 영역 */}
          <div className="text-xs text-gray-500 italic">
            💡 더 많은 필터 옵션이 곧 추가될 예정입니다!
          </div>
        </div>
      )}

      {showBookmarks && (
        <div className="p-4 bg-yellow-50">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Heart className="h-4 w-4 mr-2 text-red-500" />
              저장된 북마크 ({bookmarks.length})
            </h3>
          </div>
          
          {bookmarks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bookmark className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">아직 저장된 북마크가 없어요 🥺</p>
              <p className="text-xs mt-1">마음에 드는 콘텐츠를 북마크해보세요!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {bookmarks.map((bookmark) => (
                <div 
                  key={bookmark.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {bookmark.title}
                    </p>
                    {bookmark.description && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {bookmark.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {bookmark.addedAt.toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onBookmarkRemove(bookmark.id)}
                    className="ml-2 h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterBar;