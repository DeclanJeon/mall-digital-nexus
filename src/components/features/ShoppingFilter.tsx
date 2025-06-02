import React, { useState, useEffect, useCallback } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Search, Hash } from 'lucide-react';

interface ShoppingFilterProps {
  onFilterChange: (filters: {
    categories: string[];
    priceRange: number[];
    rating: number | null;
    status: string[];
    searchQuery: string;
  }) => void;
  initialFilters?: {
    categories: string[];
    priceRange: number[];
    rating: number | null;
    status: string[];
    searchQuery?: string;
  };
}

const ShoppingFilter = ({ onFilterChange, initialFilters }: ShoppingFilterProps) => {
  const [priceRange, setPriceRange] = useState<number[]>(initialFilters?.priceRange || [0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);
  const [selectedRating, setSelectedRating] = useState<number | null>(initialFilters?.rating || null);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(initialFilters?.status || []);
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters?.searchQuery || '');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const categories = [
    { id: 'design', label: '디자인' },
    { id: 'food', label: '푸드' },
    { id: 'fashion', label: '패션' },
    { id: 'tech', label: '테크' },
    { id: 'art', label: '아트' },
    { id: 'living', label: '리빙' },
    { id: 'hobby', label: '취미' },
    { id: 'travel', label: '여행' },
    { id: 'all', label: '전체' },
  ];
  
  const ratings = [
    { id: '4stars', label: '⭐⭐⭐⭐ 이상', value: 4 },
    { id: '3stars', label: '⭐⭐⭐ 이상', value: 3 },
    { id: '2stars', label: '⭐⭐ 이상', value: 2 },
    { id: '1stars', label: '⭐ 이상', value: 1 },
  ];
  
  const statusOptions = [
    { id: 'bestseller', label: '베스트셀러' },
    { id: 'new', label: '신규' },
    { id: 'discount', label: '할인중' },
  ];

  // 인기 해시태그 목록
  const popularHashtags = [
    '#베스트셀러', '#신상품', '#할인중', '#친환경', 
    '#수제품', '#디자인', '#유기농', '#핸드메이드',
    '#프리미엄', '#건강식품', '#아트워크', '#빈티지'
  ];
  
  // 검색어 변경 핸들러
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  // 해시태그 클릭 핸들러
  const handleHashtagClick = useCallback((hashtag: string) => {
    const cleanTag = hashtag.replace('#', '');
    if (searchQuery.includes(cleanTag)) {
      // 이미 포함되어 있으면 제거
      setSearchQuery(prev => prev.replace(cleanTag, '').trim());
    } else {
      // 포함되어 있지 않으면 추가
      setSearchQuery(prev => prev ? `${prev} ${cleanTag}` : cleanTag);
    }
  }, [searchQuery]);

  // 검색어 초기화
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);
  
  // Update activeFilters whenever any filter changes
  useEffect(() => {
    const newActiveFilters: string[] = [];
    
    if (searchQuery.trim()) {
      newActiveFilters.push(`검색: "${searchQuery}"`);
    }
    
    selectedCategories.forEach(cat => {
      if (cat !== '전체') newActiveFilters.push(cat);
    });
    
    if (selectedRating) {
      const ratingLabel = ratings.find(r => r.value === selectedRating)?.label;
      if (ratingLabel) newActiveFilters.push(ratingLabel);
    }
    
    selectedStatus.forEach(status => newActiveFilters.push(status));
    
    if (priceRange[0] > 0 || priceRange[1] < 100000) {
      newActiveFilters.push(`${formatPrice(priceRange[0])} ~ ${formatPrice(priceRange[1])}`);
    }
    
    setActiveFilters(newActiveFilters);
    
  }, [selectedCategories, selectedRating, selectedStatus, priceRange, searchQuery]);
  
  // Call parent's onFilterChange whenever filters change
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      priceRange,
      rating: selectedRating,
      status: selectedStatus,
      searchQuery
    });
  }, [selectedCategories, priceRange, selectedRating, selectedStatus, searchQuery, onFilterChange]);
  
  const handleCategoryChange = (category: string) => {
    if (category === '전체') {
      setSelectedCategories(['전체']);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories.filter(c => c !== '전체'), category];
      
      setSelectedCategories(newCategories.length === 0 ? ['전체'] : newCategories);
    }
  };
  
  const handleRatingChange = (rating: number) => {
    setSelectedRating(selectedRating === rating ? null : rating);
  };
  
  const handleStatusChange = (status: string) => {
    setSelectedStatus(
      selectedStatus.includes(status)
        ? selectedStatus.filter(s => s !== status)
        : [...selectedStatus, status]
    );
  };
  
  const removeFilter = (filter: string) => {
    // Find which type of filter it is and remove it
    if (filter.startsWith('검색:')) {
      setSearchQuery('');
    } else if (categories.some(c => c.label === filter)) {
      setSelectedCategories(selectedCategories.filter(c => c !== filter));
    } else if (ratings.some(r => r.label === filter)) {
      setSelectedRating(null);
    } else if (statusOptions.some(s => s.label === filter)) {
      setSelectedStatus(selectedStatus.filter(s => s !== filter));
    } else if (filter.includes('~')) {
      setPriceRange([0, 100000]);
    }
  };
  
  const clearFilters = () => {
    setSelectedCategories(['전체']);
    setPriceRange([0, 100000]);
    setSelectedRating(null);
    setSelectedStatus([]);
    setSearchQuery('');
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(price);
  };

  const applyFilters = () => {
    onFilterChange({
      categories: selectedCategories,
      priceRange,
      rating: selectedRating,
      status: selectedStatus,
      searchQuery
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
      {/* 검색 섹션 */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Search className="h-5 w-5" />
          검색 & 필터
        </h2>
        
        {/* 검색창 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            className="pl-10 pr-10"
            placeholder="상품명, 해시태그로 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-700 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* 인기 해시태그 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <Hash className="h-4 w-4" />
            해시태그
          </div>
          <div className="flex flex-wrap gap-1">
            {popularHashtags.map(hashtag => {
              const isActive = searchQuery.includes(hashtag.replace('#', ''));
              return (
                <Badge 
                  key={hashtag} 
                  variant={isActive ? "default" : "outline"}
                  className={`cursor-pointer text-xs transition-all hover:scale-105 ${
                    isActive 
                      ? 'bg-purple-100 text-purple-700 border-purple-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleHashtagClick(hashtag)}
                >
                  {hashtag}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* 활성 필터 표시 */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">활성 필터</span>
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              전체 초기화
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <Badge key={filter} variant="secondary" className="flex items-center gap-1 py-1">
                {filter}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-red-500 transition-colors" 
                  onClick={() => removeFilter(filter)} 
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* 필터 아코디언 */}
      <Accordion type="multiple" defaultValue={["category", "price", "rating", "status"]}>
        {/* <AccordionItem value="category">
          <AccordionTrigger>카테고리</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={category.id} 
                    checked={selectedCategories.includes(category.label)}
                    onCheckedChange={() => handleCategoryChange(category.label)}
                  />
                  <Label 
                    htmlFor={category.id} 
                    className="cursor-pointer text-sm"
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem> */}
        
        {/* <AccordionItem value="price">
          <AccordionTrigger>가격 범위</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                max={100000}
                step={1000}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{formatPrice(priceRange[0])}</span>
                <span className="font-medium">{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem> */}
        
        {/* <AccordionItem value="rating">
          <AccordionTrigger>평점</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {ratings.map((rating) => (
                <div key={rating.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={rating.id}
                    checked={selectedRating === rating.value}
                    onCheckedChange={() => handleRatingChange(rating.value)}
                  />
                  <Label htmlFor={rating.id} className="cursor-pointer text-sm">{rating.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem> */}
        
        {/* <AccordionItem value="status">
          <AccordionTrigger>상품 상태</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={selectedStatus.includes(option.label)}
                    onCheckedChange={() => handleStatusChange(option.label)}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer text-sm">{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem> */}
      </Accordion>
      
      {/* <Button className="w-full mt-4" onClick={applyFilters}>
        필터 적용하기 ✨
      </Button> */}
    </div>
  );
};

export default ShoppingFilter;