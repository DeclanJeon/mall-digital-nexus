import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Palette, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RichTextEditor from '@/components/community/RichTextEditor';
import { Editor } from '@toast-ui/react-editor';
import { Channel, Post } from '@/types/post';
import { motion, AnimatePresence } from 'framer-motion';

interface PostWriteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  channels: Channel[];
  selectedChannel: string;
  onChannelSelect: (channelId: string) => void;
  onSubmit: (post: Omit<Post, 'id' | 'author' | 'date' | 'likes' | 'comments' | 'viewCount'>) => void;
  initialPost?: Partial<Post>;
}

interface ColorAnalysis {
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  hoverColor: string;
  shadowColor: string;
  contrastRatio: number;
  isAccessible: boolean;
  luminance: number;
}

const suggestedTags = ["질문", "정보공유", "후기", "토론", "공지"];

// 고급 색상 분석 및 보색 계산 유틸리티
const ColorUtils = {
  // RGB를 HSL로 변환
  rgbToHsl: (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  },

  // HSL을 RGB로 변환
  hslToRgb: (h: number, s: number, l: number): [number, number, number] => {
    h /= 360;
    s /= 100;
    l /= 100;
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    if (s === 0) {
      return [l * 255, l * 255, l * 255];
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const r = hue2rgb(p, q, h + 1/3);
      const g = hue2rgb(p, q, h);
      const b = hue2rgb(p, q, h - 1/3);
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
  },

  // 상대 휘도 계산 (WCAG 기준)
  getRelativeLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // 대비비 계산
  getContrastRatio: (color1: string, color2: string): number => {
    const parseColor = (color: string) => {
      if (color.startsWith('#')) {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        return [r, g, b];
      }
      return [0, 0, 0];
    };

    const [r1, g1, b1] = parseColor(color1);
    const [r2, g2, b2] = parseColor(color2);
    
    const l1 = ColorUtils.getRelativeLuminance(r1, g1, b1);
    const l2 = ColorUtils.getRelativeLuminance(r2, g2, b2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  },

  // 최적의 텍스트 색상 계산
  getOptimalTextColor: (backgroundColor: string): string => {
    if (!backgroundColor || !backgroundColor.startsWith('#')) {
      return '#1f2937'; // 기본 다크 그레이
    }

    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    
    const luminance = ColorUtils.getRelativeLuminance(r, g, b);
    
    // 휘도에 따라 텍스트 색상 결정
    if (luminance > 0.5) {
      // 밝은 배경 - 어두운 텍스트 사용
      return luminance > 0.8 ? '#111827' : '#374151';
    } else {
      // 어두운 배경 - 밝은 텍스트 사용
      return luminance < 0.1 ? '#f9fafb' : '#e5e7eb';
    }
  },

  // 보색 계산
  getComplementaryColor: (color: string): string => {
    if (!color || !color.startsWith('#')) return '#6366f1';
    
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const [h, s, l] = ColorUtils.rgbToHsl(r, g, b);
    const complementaryH = (h + 180) % 360;
    const [newR, newG, newB] = ColorUtils.hslToRgb(complementaryH, s, l);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  },

  // 색상 톤 조정
  adjustColorTone: (color: string, lightnessDelta: number, saturationDelta: number = 0): string => {
    if (!color || !color.startsWith('#')) return color;
    
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    const [h, s, l] = ColorUtils.rgbToHsl(r, g, b);
    const newL = Math.max(0, Math.min(100, l + lightnessDelta));
    const newS = Math.max(0, Math.min(100, s + saturationDelta));
    
    const [newR, newG, newB] = ColorUtils.hslToRgb(h, newS, newL);
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }
};

// 색상 분석 및 스타일 생성
const analyzeColor = (color: string | undefined): ColorAnalysis => {
  const baseColor = color || '#6366f1';
  const textColor = ColorUtils.getOptimalTextColor(baseColor);
  const contrastRatio = ColorUtils.getContrastRatio(baseColor, textColor);
  
  return {
    textColor,
    backgroundColor: baseColor,
    borderColor: ColorUtils.adjustColorTone(baseColor, -10, 5),
    hoverColor: ColorUtils.adjustColorTone(baseColor, -8, 3),
    shadowColor: ColorUtils.adjustColorTone(baseColor, -20, -10),
    contrastRatio,
    isAccessible: contrastRatio >= 4.5, // WCAG AA 기준
    luminance: ColorUtils.getRelativeLuminance(
      parseInt(baseColor.slice(1, 3), 16),
      parseInt(baseColor.slice(3, 5), 16),
      parseInt(baseColor.slice(5, 7), 16)
    )
  };
};

const PostWriteDialog: React.FC<PostWriteDialogProps> = ({
  isOpen,
  onOpenChange,
  channels,
  selectedChannel,
  onChannelSelect,
  onSubmit,
  initialPost
}) => {
  const [newPostTitle, setNewPostTitle] = useState(initialPost?.title || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initialPost?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isNotice, setIsNotice] = useState(initialPost?.isNotice || false);
  const [showColorInfo, setShowColorInfo] = useState(false);
  
  const editorRef = useRef<Editor>(null);
  const { toast } = useToast();

  // 현재 선택된 채널의 색상 분석
  const selectedChannelData = channels.find(c => c.id === selectedChannel);
  const colorAnalysis = analyzeColor(selectedChannelData?.color);

  useEffect(() => {
    if (isOpen) {
      setNewPostTitle(initialPost?.title || "");
      setSelectedTags(initialPost?.tags || []);
      setIsNotice(initialPost?.isNotice || false);
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML(initialPost?.richContent || "");
      }
    } else {
      resetForm();
    }
  }, [isOpen, initialPost]);

  const handleAddTag = () => {
    if (tagInput && !selectedTags.includes(tagInput)) {
      if (selectedTags.length >= 5) {
        toast({ 
          title: "태그는 최대 5개까지 추가할 수 있습니다",
          variant: "destructive"
        });
        return;
      }
      setSelectedTags([...selectedTags, tagInput]);
      setTagInput("");
      toast({ 
        title: "태그가 추가되었습니다 ✨",
        description: `'${tagInput}' 태그가 추가되었습니다.`,
        duration: 1500
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleSubmit = () => {
    if (!newPostTitle.trim()) {
      toast({ title: "제목을 입력해주세요", variant: "destructive" });
      return;
    }
    if (newPostTitle.length < 5) {
      toast({ 
        title: "제목이 너무 짧습니다", 
        description: "최소 5자 이상 입력해주세요.",
        variant: "destructive" 
      });
      return;
    }
    if (!editorRef.current) {
      toast({ title: "에디터를 불러올 수 없습니다", variant: "destructive" });
      return;
    }
    debugger;
    const editorInstance = editorRef.current.getInstance();
    const richContent = editorInstance.getHTML();
    const plainContent = editorInstance.getMarkdown();
    
    if (!plainContent.trim()) {
      toast({ title: "내용을 입력해주세요", variant: "destructive" });
      return;
    }
    if (plainContent.length < 10) {
      toast({ 
        title: "내용이 너무 짧습니다", 
        description: "최소 10자 이상 입력해주세요.",
        variant: "destructive" 
      });
      return;
    }
    
    onSubmit({
      title: newPostTitle,
      content: plainContent.substring(0, 150) + (plainContent.length > 150 ? "..." : ""),
      richContent,
      tags: selectedTags,
      isNotice,
      channelId: selectedChannel,
      communityId: initialPost?.communityId || 'global',
    });
    onOpenChange(false);
  };

  const resetForm = () => {
    setNewPostTitle("");
    setSelectedTags([]);
    setTagInput("");
    setIsNotice(false);
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML("");
    }
  };

  // 진행률 계산
  const getProgress = () => {
    let progress = 0;
    if (newPostTitle.trim()) progress += 33;
    if (editorRef.current?.getInstance().getMarkdown().trim()) progress += 34;
    if (selectedTags.length > 0) progress += 33;
    return Math.min(progress, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {initialPost ? "게시글 수정 ✏️" : "새 게시글 작성 📝"}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            작성한 글은 해당 게시판의 모든 사용자에게 공개됩니다.
          </DialogDescription>
          
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 진행률 바 - 개선된 디자인 */}
          <div className="relative">
            <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 h-3 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${getProgress()}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
              </motion.div>
            </div>
            {/* <div className="absolute -top-1 right-0 text-xs font-medium text-gray-600">
              {getProgress()}%
            </div> */}
          </div>

          {/* 채널 선택 - 개선된 색상 처리 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">채널 선택</label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowColorInfo(!showColorInfo)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {channels.map(channel => {
                const channelColorAnalysis = analyzeColor(channel.color);
                const isSelected = selectedChannel === channel.id;
                
                return (
                  <motion.div
                    key={channel.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className={`
                        w-full justify-start font-semibold transition-all duration-200 relative overflow-hidden
                        ${isSelected ? 'shadow-lg' : 'hover:shadow-md'}
                      `}
                      style={isSelected ? {
                        backgroundColor: channelColorAnalysis.backgroundColor,
                        color: channelColorAnalysis.textColor,
                        borderColor: channelColorAnalysis.borderColor,
                        boxShadow: `0 4px 12px ${channelColorAnalysis.shadowColor}40`
                      } : {
                        borderColor: channel.color,
                        color: channel.color,
                        backgroundColor: ColorUtils.adjustColorTone(channel.color || '#6366f1', 45, -30)
                      }}
                      onClick={() => onChannelSelect(channel.id)}
                    >
                      {isSelected && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                      )}
                      <span className="mr-2 relative z-10">{channel.icon}</span>
                      <span className="relative z-10">{channel.name}</span>
                      
                      {/* 접근성 인디케이터 */}
                      {/* {isSelected && (
                        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                          channelColorAnalysis.isAccessible ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                      )} */}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
            
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <span>{channels.find(c => c.id === selectedChannel)?.description || "게시글을 분류할 채널을 선택하세요"}</span>
              {selectedChannelData && (
                <span className={`ml-2 px-1.5 py-0.5 rounded text-xs font-medium ${
                  colorAnalysis.isAccessible 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {/* {colorAnalysis.isAccessible ? '접근성 우수' : '접근성 주의'} */}
                </span>
              )}
            </p>
          </div>

          {/* 제목 입력 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="post-title" className="block text-sm font-semibold text-gray-700">
                제목 <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs font-medium transition-colors ${
                newPostTitle.length > 80 ? 'text-red-500' : 
                newPostTitle.length > 50 ? 'text-yellow-600' : 'text-gray-500'
              }`}>
                {newPostTitle.length}/100
              </span>
            </div>
            <div className="relative">
              <Input
                id="post-title"
                placeholder="제목을 입력하세요 (필수)"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className={`
                  w-full transition-all duration-200 
                  ${!newPostTitle.trim() ? 
                    'border-red-300 focus:border-red-500 focus:ring-red-200' : 
                    'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                  }
                  ${newPostTitle.length > 80 ? 'border-yellow-400' : ''}
                `}
                maxLength={100}
              />
              {newPostTitle.trim() && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </motion.div>
              )}
            </div>
            {!newPostTitle.trim() && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-xs text-red-500 flex items-center gap-1"
              >
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                제목은 필수 입력 항목입니다
              </motion.p>
            )}
          </div>

          {/* 내용 입력 */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              내용 <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden transition-colors focus-within:border-indigo-400">
              <RichTextEditor
                ref={editorRef as React.RefObject<Editor>}
                initialValue={initialPost?.richContent || " "}
                height="400px"
                initialEditType="wysiwyg"
                previewStyle="vertical"
                placeholder="게시글 내용을 작성하세요..."
              />
            </div>
          </div>

          {/* 태그 입력 - 개선된 색상 시스템 */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              태그 (선택사항)
            </label>
            
            {/* 추천 태그 */}
            {selectedTags.length === 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">추천 태그:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags.map(tag => (
                    <motion.div
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge 
                        variant="outline" 
                        className="py-1.5 px-3 bg-gradient-to-r from-gray-50 to-blue-50 text-gray-600 cursor-pointer hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700 border-gray-300 hover:border-indigo-300 transition-all duration-200"
                        onClick={() => setSelectedTags([...selectedTags, tag])}
                      >
                        + {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 선택된 태그 */}
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {selectedTags.map((tag, index) => {
                  // 태그별 색상 생성 (해시 기반)
                  const tagColorSeed = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  const hue = (tagColorSeed * 137.508) % 360; // 황금각을 이용한 색상 분산
                  const tagColor = `hsl(${hue}, 65%, 55%)`;
                  const tagColorAnalysis = analyzeColor(tagColor);
                  
                  return (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge 
                        className="py-2 px-3 flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{
                          backgroundColor: tagColor,
                          color: tagColorAnalysis.textColor,
                          border: `1px solid ${ColorUtils.adjustColorTone(tagColor, -15)}`,
                        }}
                      >
                        <span>{tag}</span>
                        <button
                          className="hover:bg-black/10 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
                          onClick={() => handleRemoveTag(tag)}
                          type="button"
                          aria-label={`${tag} 태그 제거`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {/* 태그 입력 필드 */}
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  placeholder="태그 입력 후 Enter 또는 추가 버튼 (최대 5개)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && tagInput.trim()) {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 pr-12 focus:border-indigo-400 focus:ring-indigo-200"
                  disabled={selectedTags.length >= 5}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <span className={`text-xs font-medium ${
                    selectedTags.length >= 5 ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {selectedTags.length}/5
                  </span>
                </div>
              </div>
              <Button 
                type="button"
                variant="outline" 
                onClick={handleAddTag}
                disabled={!tagInput.trim() || selectedTags.length >= 5}
                className="px-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300 text-indigo-700 font-medium transition-all duration-200"
              >
                추가
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <Palette className="h-3 w-3" />
              태그는 게시글 검색과 분류에 도움이 되며, 각 태그마다 고유한 색상이 자동 생성됩니다
            </p>
          </div>
          
          {/* 추가 옵션 - 개선된 디자인 */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
              추가 옵션
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.label 
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isNotice}
                    onChange={(e) => setIsNotice(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                    isNotice 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-500' 
                      : 'border-gray-300 hover:border-indigo-400'
                  }`}>
                    {isNotice && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">공지사항으로 등록</span>
                  <p className="text-xs text-gray-500">중요한 공지사항일 경우 선택하세요</p>
                </div>
              </motion.label>
              
              {/* <motion.label 
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="w-5 h-5 rounded border-2 border-gray-300 hover:border-green-400 transition-all duration-200">
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">알림 보내기</span>
                  <p className="text-xs text-gray-500">구독자들에게 알림을 전송합니다</p>
                </div>
              </motion.label> */}
            </div>
          </div>

          {/* 미리보기 섹션 */}
          {newPostTitle.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-4"
            >
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                미리보기
              </h4>
              
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  {/* 채널 색상 인디케이터 */}
                  <div 
                    className="w-1 h-16 rounded-full flex-shrink-0"
                    style={{ backgroundColor: selectedChannelData?.color || '#6366f1' }}
                  ></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedChannelData && (
                        <Badge 
                          className="text-xs font-medium"
                          style={{
                            backgroundColor: ColorUtils.adjustColorTone(selectedChannelData.color || '#6366f1', 40, -20),
                            color: ColorUtils.getOptimalTextColor(ColorUtils.adjustColorTone(selectedChannelData.color || '#6366f1', 40, -20)),
                            border: `1px solid ${ColorUtils.adjustColorTone(selectedChannelData.color || '#6366f1', 20, -10)}`
                          }}
                        >
                          {selectedChannelData.icon} {selectedChannelData.name}
                        </Badge>
                      )}
                      {isNotice && (
                        <Badge className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white">
                          📢 공지
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {newPostTitle}
                    </h3>
                    
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {selectedTags.slice(0, 3).map((tag, index) => {
                          const tagColorSeed = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                          const hue = (tagColorSeed * 137.508) % 360;
                          const tagColor = `hsl(${hue}, 50%, 65%)`;
                          
                          return (
                            <Badge 
                              key={tag}
                              variant="outline" 
                              className="text-xs px-2 py-0.5"
                              style={{
                                backgroundColor: ColorUtils.adjustColorTone(tagColor, 35, -25),
                                color: ColorUtils.getOptimalTextColor(ColorUtils.adjustColorTone(tagColor, 35, -25)),
                                borderColor: ColorUtils.adjustColorTone(tagColor, 15, -10)
                              }}
                            >
                              #{tag}
                            </Badge>
                          );
                        })}
                        {selectedTags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-500">
                            +{selectedTags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>방금 전</span>
                      <span>•</span>
                      <span>조회 0</span>
                      <span>•</span>
                      <span>댓글 0</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        
        <DialogFooter className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {/* {colorAnalysis.isAccessible ? (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  접근성 우수
                </div>
              ) : (
                <div className="flex items-center gap-1 text-yellow-600">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  접근성 주의
                </div>
              )} */}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  if (newPostTitle || editorRef.current?.getInstance().getMarkdown().trim()) {
                    if (window.confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
                      onOpenChange(false);
                    }
                  } else {
                    onOpenChange(false);
                  }
                }}
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              >
                취소
              </Button>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200" 
                  onClick={handleSubmit}
                  disabled={!newPostTitle.trim() || !editorRef.current?.getInstance().getMarkdown().trim()}
                >
                  <span className="relative z-10">
                    {initialPost ? "게시글 수정 완료 ✨" : "게시글 등록하기 🚀"}
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostWriteDialog;