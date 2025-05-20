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
    <div className="bg-gradient-to-br from-[#f7fafc] via-[#e3e9f7] to-[#f6f3ff] min-h-screen p-6">
      <div className="rounded-2xl shadow-2xl bg-white/90 backdrop-blur-lg max-w-7xl mx-auto p-8 flex flex-col h-full">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-indigo-700 drop-shadow-lg">{zoneName} <span className="text-gray-400">게시판</span></h2>
            <Button
              variant="ghost"
              size="sm"
              className="ml-4 border border-gray-300 bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50"
              onClick={() => { resetChannelDialog(); setIsChannelDialogOpen(true); }}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4 text-indigo-700" />
              채널 관리
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 md:w-64 rounded-lg bg-white/90 border-2 border-indigo-100 focus:border-indigo-400 shadow shadow-indigo-50"
            />
            <Button variant="secondary" size="icon" className="bg-white border border-indigo-200">
              <Search className="h-4 w-4 text-indigo-500" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="flex flex-col flex-1" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex gap-2 overflow-x-auto rounded-xl bg-gradient-to-r from-indigo-50 to-purple-100 shadow-inner px-2 py-1 mb-6">
            <TabsTrigger value="all" className="text-xs md:text-sm font-bold text-indigo-700">전체글</TabsTrigger>
            {channels.map(channel => (
              <TabsTrigger
                key={channel.id}
                value={channel.id}
                style={{ borderBottom: `3px solid ${channel.color}` }}
                className={`text-xs md:text-sm font-semibold px-3 py-2 rounded-lg transition-all`}
              >
                <span className="mr-1">{channel.icon}</span>
                {channel.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Post List */}
          <div className="overflow-y-auto flex-1 mt-2 rounded-lg shadow bg-gradient-to-b from-white/90 to-indigo-50/70 p-2">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-indigo-100 bg-indigo-50">
                  <th className="py-3 px-4 text-left text-sm font-extrabold text-indigo-400 w-16">번호</th>
                  <th className="py-3 px-4 text-left text-sm font-extrabold text-indigo-400">제목</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-indigo-400 w-24 hidden md:table-cell">작성자</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-indigo-400 w-24 hidden md:table-cell">작성일</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-indigo-400 w-24 hidden md:table-cell">출처</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-indigo-400 w-20 hidden sm:table-cell">조회</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-indigo-400 w-20 hidden sm:table-cell">추천</th>
                  <th className="py-3 px-4 text-left text-sm font-bold text-indigo-400 w-16">QR</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.length > 0 ? (
                  filteredPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className={`border-b border-indigo-100 hover:shadow-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-white/80 ${post.isNotice ? 'bg-yellow-50' : ''} cursor-pointer transition-all`}
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
                          <span className="text-sm font-bold text-indigo-800 hover:text-indigo-600 transition-colors">
                            {post.title}
                          </span>
                          {post.comments > 0 && (
                            <span className="ml-2 text-xs text-indigo-600 font-bold">
                              [{post.comments}]
                            </span>
                          )}
                          {post.tags && post.tags.length > 0 && (
                            <div className="ml-2 hidden md:flex gap-1">
                              {post.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs py-0 h-5 bg-gradient-to-r from-indigo-100 via-purple-100 to-white border-none">
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
                    <td colSpan={8} className="py-12 text-center text-indigo-300">
                      <span className="text-2xl">🔍</span>
                      <div className="mt-2 text-base font-semibold">검색 결과가 없습니다.</div>
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
              className="rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform"
              onClick={() => setIsWriteDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              새 게시글 작성
            </Button>
          </div>
        </Tabs>

        {/* Write Post Dialog */}
        <Dialog open={isWriteDialogOpen} onOpenChange={setIsWriteDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
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
                    className={`justify-start font-semibold`}
                    style={selectedChannel === channel.id ? { background: channel.color, color: 'white' } : undefined}
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
                className="w-full rounded-lg border-2 border-indigo-100 focus:border-indigo-400"
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
                <label className="block text-sm font-medium text-indigo-700 mb-1">태그 (Enter 키로 추가)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedTags.map(tag => (
                    <Badge key={tag} variant="secondary" className="py-1 px-2 bg-gradient-to-r from-indigo-100 via-purple-100 to-white border-none">
                      {tag}
                      <button
                        className="ml-1 text-gray-500 hover:text-gray-700"
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
                    className="flex-1 rounded-lg border-2 border-indigo-100 focus:border-indigo-400"
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
                  <span className="text-sm font-medium text-indigo-700">공지사항으로 등록</span>
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
          <DialogContent className="rounded-2xl shadow-2xl">
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
          <DialogContent className="max-w-2xl rounded-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle>채널 관리</DialogTitle>
              <DialogDescription>
                다양한 주제의 채널을 생성하고, 편집하거나 삭제할 수 있습니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                {channels.map(channel => (
                  <div
                    key={channel.id}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-white transition"
                  >
                    <span className="text-xl" style={{ color: channel.color }}>{channel.icon}</span>
                    <span className="font-semibold">{channel.name}</span>
                    <span className="text-xs text-gray-400">{channel.description}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEditChannel(channel.id)}
                    ><Edit className="w-4 h-4" /></Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteChannel(channel.id)}
                    ><Trash2 className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
              <form onSubmit={editChannelId ? handleUpdateChannel : handleCreateChannel} className="flex flex-col md:flex-row gap-2 mt-4">
                <Input
                  value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)}
                  placeholder="채널 이름"
                  className="flex-1"
                />
                <Input
                  value={newChannelIcon}
                  onChange={e => setNewChannelIcon(e.target.value)}
                  placeholder="이모지/아이콘"
                  className="w-20"
                  maxLength={2}
                />
                <Input
                  value={newChannelDesc}
                  onChange={e => setNewChannelDesc(e.target.value)}
                  placeholder="설명"
                  className="flex-1"
                />
                <div className="flex items-center gap-1">
                  {colorPalette.map((color) => (
                    <button key={color} type="button"
                      className={`w-7 h-7 rounded-full border-2 ${newChannelColor === color ? 'border-indigo-700' : 'border-indigo-200'} transition-all`}
                      style={{ backgroundColor: color }}
                      aria-label="채널 컬러 선택"
                      onClick={() => setNewChannelColor(color)}
                    />
                  ))}
                </div>
                <Button type="submit" variant="default">
                  {editChannelId ? "수정" : "추가"}
                </Button>
                {editChannelId && (
                  <Button type="button" variant="outline" onClick={resetChannelDialog}>취소</Button>
                )}
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CommunityBoard;

