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
import { loadPostsFromLocalStorage, savePostToLocalStorage, loadChannelsFromLocalStorage, saveChannelToLocalStorage, loadCommunitiesFromLocalStorage } from '@/utils/storageUtils';
import { Post, Channel } from '@/types/post';
import { CommunityZone } from '@/types/community';
import RichTextEditor from '@/components/community/RichTextEditor';
import { Editor } from '@toast-ui/react-editor';

interface CommunityBoardProps {
  zoneName: string;
  posts?: Post[];
  communityId?: string;
}

const CommunityBoard: React.FC<CommunityBoardProps> = ({ zoneName, posts: propPosts, communityId = 'global' }) => {
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
  const [selectedChannel, setSelectedChannel] = useState<string>("channel-2"); // Default to 자유게시판
  const [currentQRPost, setCurrentQRPost] = useState<Post | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  // Load posts, channels and communities from localStorage
  useEffect(() => {
    const loadedPosts = propPosts || loadPostsFromLocalStorage(communityId);
    const loadedChannels = loadChannelsFromLocalStorage(communityId);
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
    e.stopPropagation(); // Prevent triggering the row click
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

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput && !selectedTags.includes(tagInput)) {
      setSelectedTags([...selectedTags, tagInput]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Handle post submission
  const handleSubmitPost = () => {
    if (!newPostTitle.trim()) {
      toast({
        title: "제목을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    if (!editorRef.current) {
      toast({
        title: "에디터를 불러올 수 없습니다",
        variant: "destructive",
      });
      return;
    }

    const editorInstance = editorRef.current.getInstance();
    const richContent = editorInstance.getHTML();
    const plainContent = editorInstance.getMarkdown();

    if (!plainContent.trim()) {
      toast({
        title: "내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    // Create new post
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: newPostTitle,
      author: "현재 사용자", // In a real app, this would be the logged-in user
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

    // Save to localStorage
    savePostToLocalStorage(newPost);

    // Update local state
    setPosts(prevPosts => [newPost, ...prevPosts]);

    // Close dialog and reset form
    setIsWriteDialogOpen(false);
    resetPostForm();

    toast({
      title: "게시글이 작성되었습니다",
      description: "게시판에 새 글이 등록되었습니다.",
    });
    
    // Navigate to the new post
    setTimeout(() => {
      handlePostClick(newPost);
    }, 500);
  };

  // Reset post form
  const resetPostForm = () => {
    setNewPostTitle("");
    setSelectedTags([]);
    setTagInput("");
    setIsNotice(false);
    setSelectedChannel("channel-2");
    if (editorRef.current) {
      const editorInstance = editorRef.current.getInstance();
      editorInstance.setHTML("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{zoneName} 게시판</h2>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="게시글 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 md:w-64 bg-white/90 border border-gray-300"
          />
          <Button variant="secondary" size="icon" className="bg-white border border-gray-300">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex flex-col flex-1" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-8 mb-4">
          <TabsTrigger value="all" className="text-xs md:text-sm">전체글</TabsTrigger>
          {channels.slice(0, 6).map(channel => (
            <TabsTrigger key={channel.id} value={channel.id} className="text-xs md:text-sm">
              {channel.icon && <span className="mr-1">{channel.icon}</span>}
              {channel.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Post List - Table Style */}
        <div className="overflow-y-auto flex-1 mt-2 bg-white rounded-md shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-16">번호</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">제목</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-24 hidden md:table-cell">작성자</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-24 hidden md:table-cell">작성일</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-24 hidden md:table-cell">출처</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-20 hidden sm:table-cell">조회</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-20 hidden sm:table-cell">추천</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-16">QR</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, index) => (
                  <tr 
                    key={post.id} 
                    className={`border-b border-gray-200 hover:bg-gray-50 ${post.isNotice ? 'bg-yellow-50' : ''} cursor-pointer`}
                    onClick={() => handlePostClick(post)}
                  >
                    <td className="py-3 px-4 text-sm text-gray-500 text-center">
                      {post.isNotice ? (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          공지
                        </Badge>
                      ) : (
                        filteredPosts.length - index
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 hover:text-community-primary">
                          {post.title}
                        </span>
                        {post.comments > 0 && (
                          <span className="ml-2 text-xs text-community-primary font-medium">
                            [{post.comments}]
                          </span>
                        )}
                        {post.tags && post.tags.length > 0 && (
                          <div className="ml-2 hidden md:flex gap-1">
                            {post.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs py-0 h-5">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">{post.author}</td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">{post.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-500 hidden md:table-cell">
                      {post.communityId && post.communityId !== 'global' ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-300">
                          {getCommunityName(post.communityId)}
                        </Badge>
                      ) : (
                        '글로벌'
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.viewCount || 0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={(e) => handleShowQRCode(e, post)}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>QR 코드 보기</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Toolbar */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="bg-community-primary text-slate-800 hover:bg-community-primary-dark font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => setIsWriteDialogOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            새 게시글 작성
          </Button>
        </div>
      </Tabs>

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
            <div className="grid grid-cols-3 gap-2">
              {channels.map(channel => (
                <Button
                  key={channel.id}
                  type="button"
                  variant={selectedChannel === channel.id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  {channel.icon && <span className="mr-2">{channel.icon}</span>}
                  {channel.name}
                </Button>
              ))}
            </div>
            
            {/* Title Input */}
            <div>
              <Input
                placeholder="제목을 입력하세요"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full"
              />
            </div>
            
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                태그 (Enter 키로 추가)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="py-1 px-2">
                    {tag}
                    <button
                      className="ml-1 text-gray-500 hover:text-gray-700"
                      onClick={() => handleRemoveTag(tag)}
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
                  className="rounded border-gray-300 text-community-primary focus:ring-community-primary"
                />
                <span className="text-sm font-medium text-gray-700">공지사항으로 등록</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWriteDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSubmitPost}>
              게시글 등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>게시글 QR 코드</DialogTitle>
          </DialogHeader>
          {currentQRPost && (
            <>
              <div className="py-2">
                <h3 className="font-medium">{currentQRPost.title}</h3>
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
    </div>
  );
};

export default CommunityBoard;
