
import React, { useState } from 'react';
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

const ShoppingFilter = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
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
  ];
  
  const ratings = [
    { id: '4stars', label: '⭐⭐⭐⭐ 이상' },
    { id: '3stars', label: '⭐⭐⭐ 이상' },
    { id: '2stars', label: '⭐⭐ 이상' },
    { id: '1stars', label: '⭐ 이상' },
  ];
  
  const handleCategoryChange = (category: string) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter(filter => filter !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };
  
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
    setPriceRange([0, 100000]);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(price);
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
      
      <Accordion type="multiple" defaultValue={["category", "price", "rating"]}>
        <AccordionItem value="category">
          <AccordionTrigger>카테고리</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={category.id} 
                    checked={activeFilters.includes(category.label)}
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
                defaultValue={[0, 100000]}
                max={100000}
                step={1000}
                value={priceRange}
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
                    checked={activeFilters.includes(rating.label)}
                    onCheckedChange={() => handleCategoryChange(rating.label)}
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
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="bestseller"
                  checked={activeFilters.includes('베스트셀러')}
                  onCheckedChange={() => handleCategoryChange('베스트셀러')}
                />
                <Label htmlFor="bestseller" className="cursor-pointer">베스트셀러</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="new"
                  checked={activeFilters.includes('신규')}
                  onCheckedChange={() => handleCategoryChange('신규')}
                />
                <Label htmlFor="new" className="cursor-pointer">신규</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="discount"
                  checked={activeFilters.includes('할인중')}
                  onCheckedChange={() => handleCategoryChange('할인중')}
                />
                <Label htmlFor="discount" className="cursor-pointer">할인중</Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button className="w-full mt-4">적용</Button>
    </div>
  );
};

export default ShoppingFilter;
