
import React, { useState } from 'react';
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from 'lucide-react';

export type HashtagFilterOption = {
  label: string;
  value: string;
};

export type PeermallType = 'trending' | 'recent' | 'recommended' | 'all';

interface HashtagFilterProps {
  hashtags: HashtagFilterOption[];
  onFilterChange: (selectedHashtags: string[], selectedTypes: PeermallType[]) => void;
}

const HashtagFilter = ({ hashtags, onFilterChange }: HashtagFilterProps) => {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>(['전체']);
  const [selectedTypes, setSelectedTypes] = useState<PeermallType[]>(['all']);
  
  const handleHashtagChange = (value: string) => {
    let newSelected: string[];
    
    if (value === '전체') {
      // If "전체" is clicked, select only "전체"
      newSelected = ['전체'];
    } else {
      // If another hashtag is clicked
      const currentSelected = [...selectedHashtags];
      
      // Remove "전체" if it's currently selected
      const withoutAll = currentSelected.filter(tag => tag !== '전체');
      
      // Toggle the selected hashtag
      if (withoutAll.includes(value)) {
        newSelected = withoutAll.filter(tag => tag !== value);
        // If nothing is selected, default back to "전체"
        if (newSelected.length === 0) {
          newSelected = ['전체'];
        }
      } else {
        newSelected = [...withoutAll, value];
      }
    }
    
    setSelectedHashtags(newSelected);
    onFilterChange(newSelected, selectedTypes);
  };
  
  const handleTypeChange = (value: PeermallType) => {
    let newSelected: PeermallType[];
    
    if (value === 'all') {
      // If "all" is clicked, select only "all"
      newSelected = ['all'];
    } else {
      // If another type is clicked
      const currentSelected = [...selectedTypes];
      
      // Remove "all" if it's currently selected
      const withoutAll = currentSelected.filter(type => type !== 'all');
      
      // Toggle the selected type
      if (withoutAll.includes(value)) {
        newSelected = withoutAll.filter(type => type !== value);
        // If nothing is selected, default back to "all"
        if (newSelected.length === 0) {
          newSelected = ['all'];
        }
      } else {
        newSelected = [...withoutAll, value];
      }
    }
    
    setSelectedTypes(newSelected);
    onFilterChange(selectedHashtags, newSelected);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center">
          <Filter className="h-5 w-5 mr-2 text-accent-100" />
          인기 해시태그
        </h2>
      </div>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {hashtags.map((hashtag) => (
            <Toggle
              key={hashtag.value}
              pressed={selectedHashtags.includes(hashtag.value)}
              onPressedChange={() => handleHashtagChange(hashtag.value)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedHashtags.includes(hashtag.value) 
                  ? 'bg-accent-100 text-white' 
                  : 'bg-bg-200 text-text-200 hover:bg-primary-100'
              }`}
            >
              {hashtag.label}
            </Toggle>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-3">
        <h3 className="text-sm font-semibold mb-2">피어몰 타입</h3>
        <ToggleGroup type="multiple" className="flex flex-wrap gap-2">
          <ToggleGroupItem 
            value="all" 
            aria-label="전체 피어몰" 
            className={`px-3 py-1 text-sm rounded-full ${
              selectedTypes.includes('all') ? 'bg-primary-300 text-white' : 'bg-bg-200 text-text-200'
            }`}
            pressed={selectedTypes.includes('all')}
            onPressedChange={() => handleTypeChange('all')}
          >
            전체
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="trending" 
            aria-label="인기 피어몰" 
            className={`px-3 py-1 text-sm rounded-full ${
              selectedTypes.includes('trending') ? 'bg-primary-300 text-white' : 'bg-bg-200 text-text-200'
            }`}
            pressed={selectedTypes.includes('trending')}
            onPressedChange={() => handleTypeChange('trending')}
          >
            인기 피어몰
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="recent" 
            aria-label="최근 피어몰" 
            className={`px-3 py-1 text-sm rounded-full ${
              selectedTypes.includes('recent') ? 'bg-primary-300 text-white' : 'bg-bg-200 text-text-200'
            }`}
            pressed={selectedTypes.includes('recent')}
            onPressedChange={() => handleTypeChange('recent')}
          >
            최근 피어몰
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="recommended" 
            aria-label="추천 피어몰"
            className={`px-3 py-1 text-sm rounded-full ${
              selectedTypes.includes('recommended') ? 'bg-primary-300 text-white' : 'bg-bg-200 text-text-200'
            }`}
            pressed={selectedTypes.includes('recommended')}
            onPressedChange={() => handleTypeChange('recommended')}
          >
            추천 피어몰
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default HashtagFilter;
