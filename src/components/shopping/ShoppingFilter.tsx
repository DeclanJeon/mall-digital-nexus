
import React, { useState, useEffect } from 'react';
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
import { X } from 'lucide-react';

interface ShoppingFilterProps {
  onFilterChange: (filters: {
    categories: string[];
    priceRange: number[];
    rating: number | null;
    status: string[];
  }) => void;
  initialFilters?: {
    categories: string[];
    priceRange: number[];
    rating: number | null;
    status: string[];
  };
}

const ShoppingFilter = ({ onFilterChange, initialFilters }: ShoppingFilterProps) => {
  const [priceRange, setPriceRange] = useState<number[]>(initialFilters?.priceRange || [0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialFilters?.categories || []);
  const [selectedRating, setSelectedRating] = useState<number | null>(initialFilters?.rating || null);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(initialFilters?.status || []);
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
  
  // Update activeFilters whenever any filter changes
  useEffect(() => {
    const newActiveFilters: string[] = [];
    
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
    
  }, [selectedCategories, selectedRating, selectedStatus, priceRange]);
  
  // Call parent's onFilterChange whenever filters change
  useEffect(() => {
    onFilterChange({
      categories: selectedCategories,
      priceRange,
      rating: selectedRating,
      status: selectedStatus
    });
  }, [selectedCategories, priceRange, selectedRating, selectedStatus, onFilterChange]);
  
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
    if (categories.some(c => c.label === filter)) {
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
      status: selectedStatus
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">필터</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          초기화
        </Button>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeFilters.map(filter => (
            <Badge key={filter} variant="outline" className="flex items-center gap-1 py-1">
              {filter}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFilter(filter)} />
            </Badge>
          ))}
        </div>
      )}
      
      <Accordion type="multiple" defaultValue={["category", "price", "rating", "status"]}>
        <AccordionItem value="category">
          <AccordionTrigger>카테고리</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={category.id} 
                    checked={selectedCategories.includes(category.label)}
                    onCheckedChange={() => handleCategoryChange(category.label)}
                  />
                  <Label 
                    htmlFor={category.id} 
                    className="cursor-pointer"
                  >
                    {category.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>가격</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                max={100000}
                step={1000}
                onValueChange={setPriceRange}
                className="my-6"
              />
              <div className="flex items-center justify-between">
                <span>{formatPrice(priceRange[0])}</span>
                <span>{formatPrice(priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="rating">
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
                  <Label htmlFor={rating.id} className="cursor-pointer">{rating.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="status">
          <AccordionTrigger>상태</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={selectedStatus.includes(option.label)}
                    onCheckedChange={() => handleStatusChange(option.label)}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button className="w-full mt-4" onClick={applyFilters}>적용</Button>
    </div>
  );
};

export default ShoppingFilter;
