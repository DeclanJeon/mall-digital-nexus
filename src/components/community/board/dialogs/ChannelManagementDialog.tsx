import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Check, Smile, ChevronDown, Loader2 } from "lucide-react";
import { fetchEmojiCategories, fetchEmojisByCategory, POPULAR_EMOJIS } from "@/api/emojiApi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Channel, Post } from '@/types/post';
import { motion, AnimatePresence } from 'framer-motion';

interface ChannelManagementDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  channels: Channel[];
  posts: Post[]; // To show post count per channel
  communityId: string;
  onChannelCreate: (channel: Channel) => void;
  onChannelUpdate: (channel: Channel) => void;
  onChannelDelete: (channelId: string) => void;
}

const colorPalette = [
  "#6366f1", "#06b6d4", "#f59e42", "#22d3ee", "#f43f5e", "#84cc16", "#eab308",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#6d28d9"
];

const ChannelManagementDialog: React.FC<ChannelManagementDialogProps> = ({
  isOpen,
  onOpenChange,
  channels,
  posts,
  communityId,
  onChannelCreate,
  onChannelUpdate,
  onChannelDelete,
}) => {
  const [editChannelId, setEditChannelId] = useState<string | null>(null);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelIcon, setNewChannelIcon] = useState("💡");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [newChannelColor, setNewChannelColor] = useState("#6366f1");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [emojis, setEmojis] = useState<{ [key: string]: string[] }>({ popular: POPULAR_EMOJIS });
  const [isLoading, setIsLoading] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  
  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const loadedCategories = await fetchEmojiCategories();
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Failed to load emoji categories:', error);
      }
    };
    
    loadCategories();
  }, []);
  
  // Load emojis when category changes
  useEffect(() => {
    const loadEmojis = async () => {
      if (activeCategory === 'popular' || !categories.includes(activeCategory)) return;
      
      if (!emojis[activeCategory]) {
        setIsLoading(true);
        try {
          const emojiData = await fetchEmojisByCategory(activeCategory);
          const emojiChars = emojiData.map(e => e.character);
          setEmojis(prev => ({
            ...prev,
            [activeCategory]: emojiChars
          }));
        } catch (error) {
          console.error(`Failed to load emojis for category ${activeCategory}:`, error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadEmojis();
  }, [activeCategory, categories]);
  
  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleEmojiSelect = (emoji: string) => {
    setNewChannelIcon(emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setEditChannelId(null);
    setNewChannelName("");
    setNewChannelIcon("💡");
    setNewChannelDesc("");
    setNewChannelColor("#6366f1");
  };

  const handleEditClick = (id: string) => {
    const ch = channels.find(ch => ch.id === id);
    if (!ch) return;
    
    setEditChannelId(id);
    setNewChannelName(ch.name);
    setNewChannelIcon(ch.icon || "💡");
    setNewChannelDesc(ch.description || "");
    setNewChannelColor(ch.color || "#6366f1");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newChannelName.trim()) {
      toast({ title: "카테고리 이름을 입력해주세요", variant: "destructive" });
      return;
    }
    
    const duplicate = channels.some(c => 
      c.name.toLowerCase() === newChannelName.toLowerCase() && c.id !== editChannelId);
    
    if (duplicate) {
      toast({ 
        title: "이미 존재하는 카테고리명입니다", 
        description: "다른 이름을 입력해주세요.",
        variant: "destructive" 
      });
      return;
    }

    if (editChannelId) {
      onChannelUpdate({
        id: editChannelId,
        name: newChannelName,
        icon: newChannelIcon,
        description: newChannelDesc,
        color: newChannelColor,
        communityId
      });
    } else {
      onChannelCreate({
        id: `channel-${Date.now()}`,
        name: newChannelName,
        icon: newChannelIcon,
        description: newChannelDesc,
        color: newChannelColor,
        communityId
      });
    }
    resetForm();
  };

  const hasGoodContrast = (color: string | undefined): boolean => {
    if (!color || !color.startsWith('#')) return true;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 128;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>카테고리 관리</DialogTitle>
          <DialogDescription>
            다양한 주제의 카테고리을 생성하고, 편집하거나 삭제할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">현재 카테고리 ({channels.length})</h3>
            
            <AnimatePresence>
              {channels.map(channel => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                >
                  <div 
                    className="text-xl flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${channel.color}20`,
                      color: channel.color 
                    }}
                  >
                    {channel.icon}
                  </div>
                  <div className="flex-grow">
                    <span className="font-semibold">{channel.name}</span>
                    <p className="text-xs text-gray-400 hidden md:block">{channel.description || "설명 없음"}</p>
                  </div>
                  <div className="text-xs text-gray-500 mr-2">
                    게시글 {posts.filter(p => p.channelId === channel.id).length}개
                  </div>
                  <div className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditClick(channel.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>카테고리 편집</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={() => onChannelDelete(channel.id)}
                            disabled={channel.id === 'channel-1'} // 공지사항 카테고리 삭제 방지
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{channel.id === 'channel-1' ? '기본 카테고리은 삭제할 수 없습니다' : '카테고리 삭제'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">{editChannelId ? "카테고리 수정" : "새 카테고리 추가"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">카테고리 이름 <span className="text-red-500">*</span></label>
                <Input
                  value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)}
                  placeholder="카테고리 이름 (필수)"
                  className="mt-1"
                  required
                />
              </div>
              <div className="space-y-2 relative">
                <label className="text-sm font-medium">이모지/아이콘</label>
                <div className="relative">
                  <Input
                    value={newChannelIcon}
                    onChange={e => setNewChannelIcon(e.target.value)}
                    placeholder="이모지/아이콘"
                    className="mt-1 pl-10"
                    maxLength={2}
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-0 h-full w-10 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">이모지 또는 특수문자 1-2자</p>
                
                {showEmojiPicker && (
                  <div 
                    ref={emojiPickerRef}
                    className="absolute z-10 mt-1 w-80 bg-white border rounded-lg shadow-lg overflow-hidden"
                  >
                    <Tabs 
                      value={activeCategory} 
                      onValueChange={setActiveCategory}
                      className="w-full"
                    >
                      <div className="border-b px-2">
                        <TabsList className="w-full justify-start overflow-x-auto">
                          <TabsTrigger value="popular" className="text-sm">인기</TabsTrigger>
                          {categories.map(category => {
                            // 카테고리 슬러그를 보기 좋은 이름으로 변환
                            const displayName = category
                              .split('-')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ');
                            
                            return (
                              <TabsTrigger 
                                key={category} 
                                value={category}
                                className="text-sm"
                              >
                                {displayName}
                              </TabsTrigger>
                            );
                          })}
                        </TabsList>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto p-2">
                        {isLoading ? (
                          <div className="flex justify-center items-center h-20">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                          </div>
                        ) : (
                          <div className="grid grid-cols-8 gap-1">
                            {emojis[activeCategory]?.map((emoji, index) => (
                              <button
                                key={`${activeCategory}-${index}`}
                                type="button"
                                className="text-2xl p-1 hover:bg-gray-100 rounded-md transition-colors flex items-center justify-center"
                                onClick={() => handleEmojiSelect(emoji)}
                                title={emoji}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </Tabs>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">설명</label>
                <Input
                  value={newChannelDesc}
                  onChange={e => setNewChannelDesc(e.target.value)}
                  placeholder="카테고리에 대한 간단한 설명"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">색상</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {colorPalette.map((color) => (
                    <button 
                      key={color} 
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${newChannelColor === color ? 'border-gray-700 ring-2 ring-gray-200' : 'border-gray-200'} transition-all`}
                      style={{ backgroundColor: color }}
                      aria-label={`${color} 색상 선택`}
                      onClick={() => setNewChannelColor(color)}
                    />
                  ))}
                  <div className="ml-2 px-3 py-1 rounded-md text-sm font-medium" style={{ 
                    backgroundColor: newChannelColor,
                    color: hasGoodContrast(newChannelColor) ? '#000' : '#fff'
                  }}>
                    {newChannelIcon} {newChannelName || '카테고리 이름'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {editChannelId && (
                <Button type="button" variant="outline" onClick={resetForm}>취소</Button>
              )}
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
              >
                {editChannelId ? "수정" : "카테고리 추가"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelManagementDialog;
