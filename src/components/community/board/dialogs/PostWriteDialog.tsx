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
import { X } from "lucide-react";
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
  initialPost?: Partial<Post>; // For editing existing posts
}

const suggestedTags = ["질문", "정보공유", "후기", "토론", "공지"];

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
  
  const editorRef = useRef<Editor>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setNewPostTitle(initialPost?.title || "");
      setSelectedTags(initialPost?.tags || []);
      setIsNotice(initialPost?.isNotice || false);
      if (editorRef.current) {
        editorRef.current.getInstance().setHTML(initialPost?.richContent || "");
      }
    } else {
      // Reset form when dialog closes
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
        title: "태그가 추가되었습니다",
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
      communityId: initialPost?.communityId || 'global', // Ensure communityId is passed
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialPost ? "게시글 수정" : "새 게시글 작성"}</DialogTitle>
          <DialogDescription>
            작성한 글은 해당 게시판의 모든 사용자에게 공개됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="w-full bg-gray-100 h-2 rounded-full mb-6">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ 
                width: !newPostTitle ? '33%' : !editorRef.current?.getInstance().getMarkdown().trim() ? '66%' : '100%' 
              }}
            ></div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">채널 선택</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {channels.map(channel => (
                <Button
                  key={channel.id}
                  type="button"
                  variant={selectedChannel === channel.id ? "default" : "outline"}
                  className={`justify-start font-semibold transition-all`}
                  style={selectedChannel === channel.id ? 
                    { background: channel.color, color: hasGoodContrast(channel.color) ? '#000' : '#fff' } : 
                    { borderColor: channel.color, color: channel.color }
                  }
                  onClick={() => onChannelSelect(channel.id)}
                >
                  <span className="mr-2">{channel.icon}</span>
                  {channel.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {channels.find(c => c.id === selectedChannel)?.description || "게시글을 분류할 채널을 선택하세요"}
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">제목</label>
              <span className={`text-xs ${newPostTitle.length > 50 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                {newPostTitle.length}/100
              </span>
            </div>
            <Input
              id="post-title"
              placeholder="제목을 입력하세요 (필수)"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className={`w-full ${!newPostTitle.trim() ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}`}
              maxLength={100}
            />
            {!newPostTitle.trim() && (
              <p className="mt-1 text-xs text-red-500">제목은 필수 입력 항목입니다</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">내용</label>
            <div className="border rounded-md">
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

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">태그 (선택사항)</label>
            {selectedTags.length === 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {suggestedTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="py-1 px-2 bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedTags([...selectedTags, tag])}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mb-2">
              <AnimatePresence>
                {selectedTags.map(tag => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="py-1 px-2 bg-indigo-50 text-indigo-700 flex items-center gap-1">
                      {tag}
                      <button
                        className="text-indigo-500 hover:text-indigo-800 rounded-full hover:bg-indigo-100 w-4 h-4 flex items-center justify-center"
                        onClick={() => handleRemoveTag(tag)}
                        type="button"
                        aria-label={`${tag} 태그 제거`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
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
                  className="flex-1 pr-10"
                  disabled={selectedTags.length >= 5}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                  {selectedTags.length}/5
                </div>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
                disabled={!tagInput.trim() || selectedTags.length >= 5}
              >
                추가
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              태그는 게시글 검색과 분류에 도움이 됩니다
            </p>
          </div>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium text-gray-700">추가 옵션</h4>
            
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNotice}
                  onChange={(e) => setIsNotice(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">공지사항으로 등록</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">알림 보내기</span>
              </label>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            if (newPostTitle || editorRef.current?.getInstance().getMarkdown().trim()) {
              if (window.confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
                onOpenChange(false);
              }
            } else {
              onOpenChange(false);
            }
          }}>
            취소
          </Button>
          <Button 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
            onClick={handleSubmit}
          >
            {initialPost ? "게시글 수정" : "게시글 등록"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostWriteDialog;
