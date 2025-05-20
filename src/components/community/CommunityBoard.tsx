
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar, 
  Search, 
  ThumbsUp, 
  MessageSquare, 
  Filter, 
  SlidersHorizontal,
  PlusCircle,
  Bell,
  X,
  MoreVertical,
  Star,
  Clock,
  Eye,
  FileImage,
  Edit,
  Trash2,
  QrCode,
  Link,
  Users,
  Layout,
  TrendingUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { QRCodeSVG } from "qrcode.react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  loadPostsFromLocalStorage,
  savePostToLocalStorage,
  loadChannelsFromLocalStorage,
  saveChannelToLocalStorage,
  removeChannelFromLocalStorage,
  loadCommunitiesFromLocalStorage
} from '@/utils/storageUtils';
import { Post, Channel } from '@/types/post';
import { CommunityZone } from '@/types/community';
import RichTextEditor from '@/components/community/RichTextEditor';
import { Editor } from '@toast-ui/react-editor';

interface CommunityBoardProps {
  zoneName: string;
  posts?: Post[];
  communityId?: string;
}

const DEFAULT_CHANNELS: Channel[] = [
  { id: "channel-1", name: "공지사항", icon: "📢", description: "중요 소식", color: "#6366f1", communityId: 'global' },
  { id: "channel-2", name: "자유게시판", icon: "💬", description: "자유로운 토론", color: "#06b6d4", communityId: 'global' },
];

const CommunityBoard: React.FC<CommunityBoardProps> = ({
  zoneName,
  posts: propPosts,
  communityId = 'global'
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isNotice, setIsNotice] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [communities, setCommunities] = useState<CommunityZone[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("channel-2");
  const [currentQRPost, setCurrentQRPost] = useState<Post | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [editChannelId, setEditChannelId] = useState<string | null>(null);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelIcon, setNewChannelIcon] = useState("💡");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const [newChannelColor, setNewChannelColor] = useState("#6366f1");
  const [viewMode, setViewMode] = useState<"list" | "grid" | "compact">("list");
  const editorRef = useRef<Editor>(null);
  const { toast } = useToast();

  // Load posts, channels and communities from localStorage
  useEffect(() => {
    const loadedPosts = propPosts || loadPostsFromLocalStorage(communityId);
    let loadedChannels = loadChannelsFromLocalStorage(communityId);
    if (!loadedChannels || loadedChannels.length === 0) {
      loadedChannels = DEFAULT_CHANNELS;
      loadedChannels.forEach(channel => saveChannelToLocalStorage(channel, communityId));
    }
    const loadedCommunities = loadCommunitiesFromLocalStorage();
    setPosts(loadedPosts);
    setChannels(loadedChannels);
    setCommunities(loadedCommunities);
  }, [communityId, propPosts]);

  // Get community name by ID
  const getCommunityName = (communityId: string): string => {
    if (communityId === 'global') return '글로벌';
    const community = communities.find(c => c.id === communityId);
    return community ? community.name : '알 수 없음';
  };

  // Navigate to community detail page
  const handlePostClick = (post: Post) => {
    if (post.slug) {
      navigate(`/community/${communityId}/post/by-slug/${post.slug}`);
    } else {
      navigate(`/community/${communityId}/post/${post.id}`);
    }
  };

  // Show QR code for post
  const handleShowQRCode = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    setCurrentQRPost(post);
    setIsQRDialogOpen(true);
  };

  // Generate QR code URL
  const getPostUrl = (post: Post) => {
    const baseUrl = window.location.origin;
    if (post.slug) {
      return `${baseUrl}/community/${communityId}/post/by-slug/${post.slug}`;
    } else {
      return `${baseUrl}/community/${communityId}/post/${post.id}`;
    }
  };

  // Filter posts based on search query and active tab
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "notice" && post.isNotice) ||
      (activeTab !== "all" && activeTab !== "notice" && post.channelId === activeTab);
    return matchesSearch && matchesTab;
  });

  // Tag input handlers
  const handleAddTag = () => {
    if (tagInput && !selectedTags.includes(tagInput)) {
      setSelectedTags([...selectedTags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Post submission handler
  const handleSubmitPost = () => {
    if (!newPostTitle.trim()) {
      toast({ title: "제목을 입력해주세요", variant: "destructive" });
      return;
    }
    if (!editorRef.current) {
      toast({ title: "에디터를 불러올 수 없습니다", variant: "destructive" });
      return;
    }
    const editorInstance = editorRef.current.getInstance();
    const richContent = editorInstance.getHTML();
    const plainContent = editorInstance.getMarkdown();
    if (!plainContent.trim()) {
      toast({ title: "내용을 입력해주세요", variant: "destructive" });
      return;
    }
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: newPostTitle,
      author: "현재 사용자",
      date: new Date().toISOString().split('T')[0],
      content: plainContent.substring(0, 150) + (plainContent.length > 150 ? "..." : ""),
      richContent,
      likes: 0,
      comments: 0,
      tags: selectedTags,
      isNotice,
      channelId: selectedChannel,
      communityId,
      viewCount: 0,
    };
    savePostToLocalStorage(newPost);
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsWriteDialogOpen(false);
    resetPostForm();
    toast({ title: "게시글이 작성되었습니다", description: "게시판에 새 글이 등록되었습니다." });
    setTimeout(() => {
      handlePostClick(newPost);
    }, 500);
  };

  const resetPostForm = () => {
    setNewPostTitle("");
    setSelectedTags([]);
    setTagInput("");
    setIsNotice(false);
    setSelectedChannel(channels[1]?.id || "channel-2");
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setHTML("");
    }
  };

  // 채널 관리
  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      name: newChannelName,
      icon: newChannelIcon,
      description: newChannelDesc,
      color: newChannelColor,
      communityId: communityId
    };
    saveChannelToLocalStorage(newChannel, communityId);
    setChannels(prev => [...prev, newChannel]);
    setNewChannelName("");
    setNewChannelIcon("💡");
    setNewChannelDesc("");
    setNewChannelColor("#6366f1");
    toast({ title: "채널이 추가되었습니다." });
  };

  const handleEditChannel = (id: string) => {
    const ch = channels.find(ch => ch.id === id);
    if (!ch) return;
    setEditChannelId(id);
    setNewChannelName(ch.name);
    setNewChannelIcon(ch.icon || "💡");
    setNewChannelDesc(ch.description || "");
    setNewChannelColor(ch.color || "#6366f1");
    setIsChannelDialogOpen(true);
  };

  const handleUpdateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editChannelId) return;
    const updated = {
      id: editChannelId,
      name: newChannelName,
      icon: newChannelIcon,
      description: newChannelDesc,
      color: newChannelColor,
    };
    saveChannelToLocalStorage({ ...updated, communityId: 'global' }, communityId);
    setChannels(prev =>
      prev.map(ch => (ch.id === editChannelId ? { ...updated, communityId: 'global' } : ch))
    );
    setEditChannelId(null);
    setNewChannelName("");
    setNewChannelIcon("💡");
    setNewChannelDesc("");
    setNewChannelColor("#6366f1");
    setIsChannelDialogOpen(false);
    toast({ title: "채널이 수정되었습니다." });
  };

  const handleDeleteChannel = (id: string) => {
    if (!window.confirm("정말 이 채널을 삭제하시겠습니까?")) return;
    removeChannelFromLocalStorage(id, communityId);
    setChannels(prev => prev.filter(ch => ch.id !== id));
    setPosts(prev => prev.filter(post => post.channelId !== id));
    toast({ title: "채널이 삭제되었습니다." });
  };

  // 채널 관리 다이얼로그 reset
  const resetChannelDialog = () => {
    setEditChannelId(null);
    setNewChannelName("");
    setNewChannelIcon("💡");
    setNewChannelDesc("");
    setNewChannelColor("#6366f1");
  };

  // 컬러 팔레트
  const colorPalette = [
    "#6366f1", "#06b6d4", "#f59e42", "#22d3ee", "#f43f5e", "#84cc16", "#eab308"
  ];

  return (
    <div className="h-full">
      {/* Main Board Container */}
      <div className="flex flex-col h-full rounded-xl overflow-hidden bg-white shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-white">{zoneName}</h2>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                커뮤니티
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-72">
                <Input
                  type="text"
                  placeholder="게시글 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70 pr-8"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
              </div>
              <Button 
                onClick={() => { resetChannelDialog(); setIsChannelDialogOpen(true); }}
                variant="ghost" 
                size="icon" 
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-white/10 border border-white/20 text-white hover:bg-white/20">
                    <Bell className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <h3 className="px-2 py-1.5 text-sm font-semibold">알림</h3>
                  <div className="py-2 text-sm text-center text-muted-foreground">
                    새로운 알림이 없습니다.
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* View Toggle and Channels */}
        <div className="border-b flex flex-col md:flex-row justify-between items-center px-6 py-2 bg-gray-50">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="space-y-1 md:space-y-0"
          >
            <TabsList className="h-9 bg-gray-100">
              <TabsTrigger value="all" className="text-sm h-7">전체글</TabsTrigger>
              <TabsTrigger value="notice" className="text-sm h-7">공지사항</TabsTrigger>
              {channels.map((channel) => (
                <TabsTrigger 
                  key={channel.id} 
                  value={channel.id} 
                  className="text-sm h-7"
                  style={{ borderBottom: activeTab === channel.id ? `2px solid ${channel.color}` : undefined }}
                >
                  <span className="mr-1">{channel.icon}</span>
                  {channel.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${viewMode === 'list' ? 'bg-gray-200' : 'bg-transparent'}`}
              onClick={() => setViewMode("list")}
            >
              <Layout className="h-4 w-4 mr-1" />
              목록
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${viewMode === 'grid' ? 'bg-gray-200' : 'bg-transparent'}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              그리드
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-2 ${viewMode === 'compact' ? 'bg-gray-200' : 'bg-transparent'}`}
              onClick={() => setViewMode("compact")}
            >
              <Layout className="h-4 w-4 mr-1" />
              간단히
            </Button>
          </div>
        </div>
                
        {/* Post List */}
        <div className="flex-grow overflow-auto p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <Card 
                  key={post.id}
                  className={`overflow-hidden cursor-pointer hover:shadow-md transition-all ${post.isNotice ? 'border-l-4 border-l-yellow-400' : ''}`}
                  onClick={() => handlePostClick(post)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="text-sm font-medium text-gray-500">
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="bg-gray-50 text-xs">
                          {post.date}
                        </Badge>
                        {post.isNotice && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs">
                            공지
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 mb-2">{post.title}</h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-600 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <ThumbsUp className="h-3 w-3 mr-1" /> 
                          {post.likes}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" /> 
                          {post.comments}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" /> 
                          {post.viewCount || 0}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleShowQRCode(e, post)}
                      >
                        <QrCode className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="py-20 text-center text-gray-400">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          ) : viewMode === 'compact' ? (
            <div className="space-y-1">
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  className={`flex items-center justify-between py-2 px-3 border-b hover:bg-gray-50 cursor-pointer ${post.isNotice ? 'bg-yellow-50' : ''}`}
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-center gap-3 flex-grow overflow-hidden">
                    {post.isNotice && <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 text-xs">공지</Badge>}
                    <span className="font-medium text-gray-800 truncate">{post.title}</span>
                    {post.comments > 0 && <span className="text-xs text-indigo-500 font-semibold">[{post.comments}]</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                    <div className="flex items-center">
                      <ThumbsUp className="h-3 w-3 mr-1" /> 
                      {post.likes}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-gray-400">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <Card 
                  key={post.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${post.isNotice ? 'border-l-4 border-l-yellow-400' : ''}`}
                  onClick={() => handlePostClick(post)}
                >
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3 gap-2">
                      <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                        {post.isNotice && (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                            공지
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-gray-50">
                          {post.date}
                        </Badge>
                        <span className="font-medium">{post.author}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-gray-500">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" /> 
                          <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" /> 
                          <span className="text-sm">{post.comments}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" /> 
                          <span className="text-sm">{post.viewCount || 0}</span>
                        </div>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => handleShowQRCode(e, post)}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>QR 코드 보기</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="py-20 text-center text-gray-400">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">검색 결과가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <TrendingUp className="h-4 w-4 mr-2" />
                인기순
              </Button>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Clock className="h-4 w-4 mr-2" />
                최신순
              </Button>
            </div>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" onClick={() => setIsWriteDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              새 글 작성
            </Button>
          </div>
        </div>
      </div>

      {/* Write Post Dialog */}
      <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>새 게시글 작성</DialogTitle>
            <DialogDescription>
              작성한 글은 해당 게시판의 모든 사용자에게 공개됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Channel Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {channels.map(channel => (
                <Button
                  key={channel.id}
                  type="button"
                  variant={selectedChannel === channel.id ? "default" : "outline"}
                  className={`justify-start font-semibold transition-all`}
                  style={selectedChannel === channel.id ? 
                    { background: channel.color, color: 'white' } : 
                    { borderColor: channel.color, color: channel.color }
                  }
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  <span className="mr-2">{channel.icon}</span>
                  {channel.name}
                </Button>
              ))}
            </div>
            <Input
              placeholder="제목을 입력하세요"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full"
            />
            {/* Editor */}
            <div className="border rounded-md">
              <RichTextEditor
                ref={editorRef as React.RefObject<Editor>}
                initialValue=" "
                height="400px"
                initialEditType="wysiwyg"
                previewStyle="vertical"
              />
            </div>
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-1">태그 (Enter 키로 추가)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="py-1 px-2 bg-indigo-50 text-indigo-700 flex items-center gap-1">
                    {tag}
                    <button
                      className="text-indigo-500 hover:text-indigo-800"
                      onClick={() => handleRemoveTag(tag)}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="태그 추가"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddTag}>
                  추가
                </Button>
              </div>
            </div>
            {/* Options */}
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNotice}
                  onChange={(e) => setIsNotice(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm font-medium">공지사항으로 등록</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWriteDialogOpen(false)}>
              취소
            </Button>
            <Button 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
              onClick={handleSubmitPost}
            >
              게시글 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>게시글 QR 코드</DialogTitle>
          </DialogHeader>
          {currentQRPost && (
            <>
              <div className="py-2">
                <h3 className="font-bold text-lg">{currentQRPost.title}</h3>
                <p className="text-sm text-gray-500 mt-1">아래 QR 코드로 게시글에 바로 접근할 수 있습니다.</p>
              </div>
              <div className="flex flex-col items-center justify-center py-6">
                <QRCodeSVG value={getPostUrl(currentQRPost)} size={200} />
                <p className="mt-4 text-sm text-gray-600 break-all text-center">
                  {getPostUrl(currentQRPost)}
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  navigator.clipboard.writeText(getPostUrl(currentQRPost));
                  toast({
                    title: "링크가 복사되었습니다",
                    description: "게시글 링크가 클립보드에 복사되었습니다.",
                  });
                }}>
                  <Link className="mr-2 h-4 w-4" /> 링크 복사
                </Button>
                <Button onClick={() => setIsQRDialogOpen(false)}>
                  닫기
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Channel Management Dialog */}
      <Dialog open={isChannelDialogOpen} onOpenChange={v => { setIsChannelDialogOpen(v); if (!v) resetChannelDialog(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>채널 관리</DialogTitle>
            <DialogDescription>
              다양한 주제의 채널을 생성하고, 편집하거나 삭제할 수 있습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
              {channels.map(channel => (
                <div
                  key={channel.id}
                  className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                >
                  <span className="text-xl flex-shrink-0" style={{ color: channel.color }}>{channel.icon}</span>
                  <span className="font-semibold flex-grow">{channel.name}</span>
                  <span className="text-xs text-gray-400 hidden md:block">{channel.description}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleEditChannel(channel.id)}
                    ><Edit className="w-4 h-4" /></Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => handleDeleteChannel(channel.id)}
                    ><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={editChannelId ? handleUpdateChannel : handleCreateChannel} className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">{editChannelId ? "채널 수정" : "새 채널 추가"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">채널 이름</label>
                  <Input
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    placeholder="채널 이름"
                    className="mt-1"
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
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">설명</label>
                  <Input
                    value={newChannelDesc}
                    onChange={e => setNewChannelDesc(e.target.value)}
                    placeholder="설명"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">색상</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {colorPalette.map((color) => (
                      <button key={color} type="button"
                        className={`w-8 h-8 rounded-full border-2 ${newChannelColor === color ? 'border-indigo-700 ring-2 ring-indigo-200' : 'border-gray-200'} transition-all`}
                        style={{ backgroundColor: color }}
                        aria-label="채널 컬러 선택"
                        onClick={() => setNewChannelColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {editChannelId && (
                  <Button type="button" variant="outline" onClick={resetChannelDialog}>취소</Button>
                )}
                <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  {editChannelId ? "수정" : "추가"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityBoard;
