
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ 
  value = [], 
  onChange, 
  placeholder = "태그 입력 후 Enter..." 
}) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div className="border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 bg-white">
      <div className="flex flex-wrap gap-1 p-2">
        {value.map((tag) => (
          <Badge key={tag} className="bg-muted text-muted-foreground hover:bg-muted/80">
            {tag}
            <button 
              type="button" 
              className="ml-1 text-muted-foreground/50 hover:text-muted-foreground"
              onClick={() => removeTag(tag)}
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
        <Input
          className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 min-w-[120px] text-black"
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => inputValue && addTag(inputValue)}
        />
      </div>
    </div>
  );
};
