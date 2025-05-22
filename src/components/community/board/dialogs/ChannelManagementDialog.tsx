import React, { useState, useEffect } from 'react';
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
import { Edit, Trash2, Check } from "lucide-react";
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
  
  const { toast } = useToast();

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
      toast({ title: "채널 이름을 입력해주세요", variant: "destructive" });
      return;
    }
    
    const duplicate = channels.some(c => 
      c.name.toLowerCase() === newChannelName.toLowerCase() && c.id !== editChannelId);
    
    if (duplicate) {
      toast({ 
        title: "이미 존재하는 채널명입니다", 
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
          <DialogTitle>채널 관리</DialogTitle>
          <DialogDescription>
            다양한 주제의 채널을 생성하고, 편집하거나 삭제할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">현재 채널 ({channels.length})</h3>
            
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
                          <p>채널 편집</p>
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
                            disabled={channel.id === 'channel-1'} // 공지사항 채널 삭제 방지
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{channel.id === 'channel-1' ? '기본 채널은 삭제할 수 없습니다' : '채널 삭제'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">{editChannelId ? "채널 수정" : "새 채널 추가"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">채널 이름 <span className="text-red-500">*</span></label>
                <Input
                  value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)}
                  placeholder="채널 이름 (필수)"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">이모지/아이콘</label>
                <Input
                  value={newChannelIcon}
                  onChange={e => setNewChannelIcon(e.target.value)}
                  placeholder="이모지/아이콘"
                  className="mt-1"
                  maxLength={2}
                />
                <p className="text-xs text-gray-500 mt-1">이모지 또는 특수문자 1-2자</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium">설명</label>
                <Input
                  value={newChannelDesc}
                  onChange={e => setNewChannelDesc(e.target.value)}
                  placeholder="채널에 대한 간단한 설명"
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
                    {newChannelIcon} {newChannelName || '채널 이름'}
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
                {editChannelId ? "수정" : "채널 추가"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelManagementDialog;
