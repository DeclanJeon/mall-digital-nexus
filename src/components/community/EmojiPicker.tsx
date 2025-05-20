
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

// Common emoji categories for communities
const EMOJI_CATEGORIES = [
  {
    name: "장소",
    emojis: ["🏙️", "🌆", "🏢", "🏫", "🏛️", "⛩️", "🏰", "🏥", "🏬", "🏭", "🏠", "🏡", "🌉", "⛪", "🏯", "🏤"],
  },
  {
    name: "자연",
    emojis: ["🌲", "🌳", "🌴", "🌵", "🌱", "🌿", "☘️", "🍀", "🍁", "🍄", "🌾", "🌷", "🌹", "🌺", "🌸", "🌼"],
  },
  {
    name: "활동",
    emojis: ["💻", "📱", "🎮", "🎨", "🎭", "🎬", "🎤", "🎧", "🎵", "⚽", "🏀", "🏓", "🏐", "🎯", "🎲", "♟️"],
  },
  {
    name: "음식",
    emojis: ["🍕", "🍔", "🍟", "🌭", "🍿", "🧇", "🥐", "🥯", "🍩", "🍪", "🎂", "🍰", "🧁", "🍦", "☕", "🍵"],
  },
  {
    name: "기타",
    emojis: ["❤️", "🧠", "👑", "🔮", "🎈", "🎉", "✨", "⭐", "🌟", "💫", "🌈", "🔥", "💧", "🎪", "🗿", "🦄"],
  },
];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, selectedEmoji }) => {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0].name);

  const handleEmojiSelect = (emoji: string) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start h-14 px-3"
        >
          {selectedEmoji ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedEmoji}</span>
              <span className="text-sm text-gray-500">
                {selectedEmoji ? "선택됨" : "이모지 선택"}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">이모지를 선택해주세요</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="border-b px-3 py-2">
          <h4 className="font-medium text-sm">이모지 선택</h4>
          <p className="text-xs text-muted-foreground">커뮤니티를 대표할 이모지를 선택하세요</p>
        </div>
        
        <div className="flex border-b">
          {EMOJI_CATEGORIES.map((category) => (
            <Button 
              key={category.name}
              variant={activeCategory === category.name ? "default" : "ghost"}
              size="sm"
              className="rounded-none flex-1 h-8 text-xs"
              onClick={() => setActiveCategory(category.name)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        
        <div className="p-2 h-48 overflow-y-auto">
          <div className="grid grid-cols-8 gap-1">
            {EMOJI_CATEGORIES.find(c => c.name === activeCategory)?.emojis.map((emoji, index) => (
              <Button 
                key={`${emoji}-${index}`}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleEmojiSelect(emoji)}
              >
                <span className="text-lg">{emoji}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
