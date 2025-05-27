import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { WeatherType } from "@/services/weatherService";
import {
  Building2,
  Calendar,
  CloudRain,
  CloudSun,
  FileImage,
  FileVideo,
  Home,
  Info,
  Link as LinkIcon,
  MapPin,
  MessageSquare,
  Settings,
  Users,
  Search,
  ThumbsUp,
  Eye,
  X,
  Filter,
  SlidersHorizontal,
  ArrowLeft,
  Heart,
  Trash2,
  Share,
  QrCode,
  Pencil,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  loadPostsFromLocalStorage, 
  savePostToLocalStorage, 
  loadChannelsFromLocalStorage, 
  saveCommunityToLocalStorage,
  loadMembersFromLocalStorage,
  incrementPostViewCount,
  incrementPostLikes,
  deletePostFromLocalStorage
} from '@/utils/storageUtils';
import { processContentWithMediaEmbeds } from '@/utils/mediaUtils';
import { Post, Channel, Member } from '@/types/post';
import { CommunityMapEvent } from '@/types/community';
import { CommunityZone } from '@/types/community';
import RichTextEditor from '@/components/community/RichTextEditor';
import { Editor } from '@toast-ui/react-editor';
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from 'qrcode.react';

interface CommunityDetailProps {
  community: CommunityZone;
}

// Weather display component
const getWeatherIcon = (weather: WeatherType) => {
  switch (weather) {
    case "sunny":
      return <CloudSun className="h-6 w-6 text-yellow-500" />;
    case "cloudy":
      return <CloudSun className="h-6 w-6 text-gray-500" />;
    case "rainy":
      return <CloudRain className="h-6 w-6 text-blue-500" />;
    case "snowy":
      return <CloudRain className="h-6 w-6 text-white stroke-gray-400" />;
    case "foggy":
      return <CloudSun className="h-6 w-6 text-gray-400" />;
    default:
      return <CloudSun className="h-6 w-6" />;
  }
};

const getWeatherDescription = (weather: WeatherType) => {
  switch (weather) {
    case "sunny":
      return "맑음";
    case "cloudy":
      return "흐림";
    case "rainy":
      return "비";
    case "snowy":
      return "눈";
    case "foggy":
      return "안개";
    default:
      return "맑음";
  }
};

const getTypeIcon = (community: CommunityZone) => {
  switch (community.type) {
    case "city":
      return <Building2 className="h-5 w-5" />;
    case "village":
      return <Home className="h-5 w-5" />;
    case "zone":
      return <MapPin className="h-5 w-5" />;
    case "personal":
      return <Users className="h-5 w-5" />;
    default:
      return <MapPin className="h-5 w-5" />;
  }
};

const WeatherDisplay = ({ weather, temperature }: { 
  weather: WeatherType; 
  temperature?: number;
}) => {
  return (
    <div className="flex items-center gap-2">
      {getWeatherIcon(weather)}
      <div>
        <div className="font-medium">{getWeatherDescription(weather)}</div>
        {temperature !== undefined && (
          <div className="text-sm text-gray-500">{temperature}°C</div>
        )}
      </div>
    </div>
  );
};

const CommunityDetail: React.FC<CommunityDetailProps> = ({ community }) => {
  const [activeTab, setActiveTab] = useState("게시판");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<CommunityMapEvent[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isNotice, setIsNotice] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>("channel-2");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("회원");
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [newEventStart, setNewEventStart] = useState("");
  const [newEventEnd, setNewEventEnd] = useState("");
  const editorRef = useRef<Editor>(null);
  
  // New state variables for post detail view
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const editEditorRef = useRef<Editor>(null);

  // Go back to community map
  const handleBackToMap = () => {
    navigate("/community");
  };

  // Load posts, channels and members from localStorage
  useEffect(() => {
    const communityId = community.id;
    const loadedPosts = loadPostsFromLocalStorage(communityId);
    const loadedChannels = loadChannelsFromLocalStorage(communityId);
    
    // Load members from localStorage or use sample data
    let loadedMembers: Member[] = loadMembersFromLocalStorage(communityId);
    
    if (loadedMembers.length === 0) {
      // Initialize with sample data if no members exist
      loadedMembers = sampleMembers.map(member => ({
        ...member,
        communityId
      }));
      
      // Save sample members to localStorage
      localStorage.setItem('communityMembers', JSON.stringify(loadedMembers));
    }
    
    // Load events from localStorage or use sample data
    let loadedEvents: CommunityMapEvent[] = [];
    try {
      const eventsJSON = localStorage.getItem('communityEvents');
      if (eventsJSON) {
        const allEvents = JSON.parse(eventsJSON);
        loadedEvents = allEvents.filter((event: CommunityMapEvent) => event.communityId === communityId);
      } 
    } catch (error) {
      console.error('Error loading events:', error);
    }
    
    setPosts(loadedPosts);
    setChannels(loadedChannels);
    setMembers(loadedMembers);
    setEvents(loadedEvents);
  }, [community.id, community.hasEvent]);

  // Get today's date for event validation
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Filter posts based on search query
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
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
      author: "현재 사용자",
      date: new Date().toISOString().split('T')[0],
      content: plainContent.substring(0, 150) + (plainContent.length > 150 ? "..." : ""),
      richContent,
      likes: 0,
      comments: 0,
      tags: selectedTags,
      isNotice,
      channelId: selectedChannel,
      communityId: community.id
    };

    // Save to localStorage
    savePostToLocalStorage(newPost);
    
    // Update community post count
    const updatedCommunity = {
      ...community,
      postCount: community.postCount + 1,
      lastActive: new Date().toISOString().split('T')[0]
    };
    saveCommunityToLocalStorage(updatedCommunity);

    // Update local state
    setPosts(prevPosts => [newPost, ...prevPosts]);

    // Close dialog and reset form
    setIsWriteDialogOpen(false);
    resetPostForm();

    toast({
      title: "게시글이 작성되었습니다",
      description: "게시판에 새 글이 등록되었습니다.",
    });
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
  
  // Add new member to community
  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      toast({
        title: "회원 이름을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    const newMember: Member = {
      id: `member-${Date.now()}`,
      name: newMemberName,
      role: newMemberRole,
      joinedAt: new Date().toISOString().split('T')[0],
      isActive: true,
      communityId: community.id
    };
    
    // Update members in localStorage
    const membersJSON = localStorage.getItem('communityMembers');
    const allMembers = membersJSON ? JSON.parse(membersJSON) : [];
    const updatedMembers = [...allMembers, newMember];
    localStorage.setItem('communityMembers', JSON.stringify(updatedMembers));
    
    // Update community member count
    const updatedCommunity = {
      ...community,
      memberCount: community.memberCount + 1,
      lastActive: new Date().toISOString().split('T')[0]
    };
    saveCommunityToLocalStorage(updatedCommunity);
    
    // Update local state
    setMembers(prevMembers => [...prevMembers, newMember]);
    setNewMemberName("");
    setNewMemberRole("회원");
    setIsMemberDialogOpen(false);
    
    toast({
      title: "회원이 추가되었습니다",
      description: `${newMemberName}님이 커뮤니티에 가입했습니다.`,
    });
  };
  
  // Remove a member from the community
  const handleRemoveMember = (memberId: string) => {
    const memberToRemove = members.find(m => m.id === memberId);
    if (!memberToRemove) return;
    
    const membersJSON = localStorage.getItem('communityMembers');
    const allMembers = membersJSON ? JSON.parse(membersJSON) : [];
    const updatedMembers = allMembers.filter((m: Member) => m.id !== memberId);
    localStorage.setItem('communityMembers', JSON.stringify(updatedMembers));
    
    // Update community member count
    const updatedCommunity = {
      ...community,
      memberCount: Math.max(0, community.memberCount - 1),
      lastActive: new Date().toISOString().split('T')[0]
    };
    saveCommunityToLocalStorage(updatedCommunity);
    
    // Update local state
    setMembers(prevMembers => prevMembers.filter(m => m.id !== memberId));
    
    toast({
      title: "회원이 제거되었습니다",
      description: `${memberToRemove.name}님이 커뮤니티에서 제거되었습니다.`,
    });
  };
  
  // Create new event
  const handleCreateEvent = () => {
    if (!newEventTitle.trim() || !newEventStart || !newEventEnd) {
      toast({
        title: "모든 필수 정보를 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    if (new Date(newEventStart) > new Date(newEventEnd)) {
      toast({
        title: "종료일은 시작일 이후여야 합니다",
        variant: "destructive",
      });
      return;
    }
    
    const newEvent: CommunityMapEvent = {
      id: `event-${Date.now()}`,
      title: newEventTitle,
      description: newEventDesc,
      startDate: newEventStart,
      endDate: newEventEnd,
      communityId: community.id,
    };
    
    // Update events in localStorage
    const eventsJSON = localStorage.getItem('communityEvents');
    const allEvents = eventsJSON ? JSON.parse(eventsJSON) : [];
    const updatedEvents = [...allEvents, newEvent];
    localStorage.setItem('communityEvents', JSON.stringify(updatedEvents));
    
    // Update community hasEvent flag
    if (!community.hasEvent) {
      const updatedCommunity = {
        ...community,
        hasEvent: true,
        lastActive: new Date().toISOString().split('T')[0]
      };
      saveCommunityToLocalStorage(updatedCommunity);
    }
    
    // Update local state
    setEvents(prevEvents => [...prevEvents, newEvent]);
    setNewEventTitle("");
    setNewEventDesc("");
    setNewEventStart("");
    setNewEventEnd("");
    setIsEventDialogOpen(false);
    
    toast({
      title: "이벤트가 생성되었습니다",
      description: `${newEventTitle} 이벤트가 등록되었습니다.`,
    });
  };

  // Handle post click - now opens in-page detail view instead of navigating
  const handlePostClick = (postId: string) => {
    // Find post in posts array
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    // Increment view count
    const updatedPost = incrementPostViewCount(postId);
    
    // Update local state if post was found and updated
    if (updatedPost) {
      setSelectedPost(updatedPost);
      setPosts(prevPosts => 
        prevPosts.map(p => p.id === postId ? updatedPost : p)
      );
    } else {
      setSelectedPost(post);
    }
    
    // Set detail view mode
    setIsDetailView(true);
  };
  
  // Go back to post list
  const handleBackToList = () => {
    setIsDetailView(false);
    setSelectedPost(null);
    setIsEditMode(false);
  };
  
  // Handle like button click
  const handleLikePost = () => {
    if (!selectedPost) return;
    
    const updatedPost = incrementPostLikes(selectedPost.id);
    
    if (updatedPost) {
      setSelectedPost(updatedPost);
      setPosts(prevPosts => 
        prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p)
      );
      
      toast({
        title: "게시글을 추천했습니다",
      });
    }
  };
  
  // Delete post
  const handleDeletePost = () => {
    if (!selectedPost) return;
    
    deletePostFromLocalStorage(selectedPost.id);
    
    // Update local state
    setPosts(prevPosts => prevPosts.filter(p => p.id !== selectedPost.id));
    
    // Go back to list
    handleBackToList();
    
    // Show toast
    toast({
      title: "게시글이 삭제되었습니다",
    });
  };
  
  // Copy URL to clipboard
  const handleCopyLink = () => {
    if (!selectedPost) return;
    
    // Create full URL to post
    const url = `${window.location.origin}/community/${community.id}/post/${selectedPost.id}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "링크가 복사되었습니다",
          description: "게시글 링크가 클립보드에 복사되었습니다.",
        });
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
        toast({
          title: "링크 복사 실패",
          description: "클립보드 접근에 실패했습니다.",
          variant: "destructive",
        });
      });
  };
  
  // Enter edit mode
  const handleEditPost = () => {
    if (!selectedPost) return;
    
    setEditedTitle(selectedPost.title);
    setEditedTags(selectedPost.tags || []);
    setIsEditMode(true);
    
    // Wait for editor to be ready
    setTimeout(() => {
      if (editEditorRef.current) {
        const editorInstance = editEditorRef.current.getInstance();
        editorInstance.setHTML(selectedPost.richContent || selectedPost.content);
      }
    }, 100);
  };
  
  // Handle tag input for edit mode
  const handleAddEditTag = () => {
    if (editTagInput && !editedTags.includes(editTagInput)) {
      setEditedTags([...editedTags, editTagInput]);
      setEditTagInput("");
    }
  };

  const handleRemoveEditTag = (tag: string) => {
    setEditedTags(editedTags.filter(t => t !== tag));
  };
  
  // Save edited post
  const handleSaveEdit = () => {
    if (!selectedPost || !editEditorRef.current) return;
    
    const editorInstance = editEditorRef.current.getInstance();
    const richContent = editorInstance.getHTML();
    const plainContent = editorInstance.getMarkdown();
    
    if (!editedTitle.trim() || !plainContent.trim()) {
      toast({
        title: "제목과 내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    
    // Create updated post
    const updatedPost: Post = {
      ...selectedPost,
      title: editedTitle,
      content: plainContent.substring(0, 150) + (plainContent.length > 150 ? "..." : ""),
      richContent,
      tags: editedTags,
      isEdited: true,
      lastEditedAt: new Date().toISOString().split('T')[0]
    };
    
    // Save to localStorage
    savePostToLocalStorage(updatedPost);
    
    // Update local state
    setPosts(prevPosts => 
      prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p)
    );
    setSelectedPost(updatedPost);
    
    // Exit edit mode
    setIsEditMode(false);
    
    toast({
      title: "게시글이 수정되었습니다",
    });
  };

  // Render community image or emoji based on what's available
  const renderCommunityImage = () => {
    if (community.imageUrl) {
      if (community.imageType === 'video') {
        return (
          <div className="relative w-full h-40 md:h-64 mb-6 rounded-lg overflow-hidden">
            <video
              src={community.imageUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
            />
          </div>
        );
      } else if (community.imageType === 'gif' || community.imageType === 'image') {
        return (
          <div className="relative w-full h-40 md:h-64 mb-6 rounded-lg overflow-hidden">
            <img
              src={community.imageUrl}
              alt={community.name}
              className="w-full h-full object-cover"
            />
          </div>
        );
      } else if (community.imageType === 'url') {
        return (
          <div className="flex items-center justify-center bg-gray-100 h-24 mb-6 rounded-lg">
            <a 
              href={community.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 hover:underline"
            >
              <LinkIcon className="h-5 w-5 mr-2" />
              외부 미디어 링크
            </a>
          </div>
        );
      }
    } else if (community.emoji) {
      return (
        <div className="flex items-center justify-center h-32 mb-6">
          <span className="text-8xl">{community.emoji}</span>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={handleBackToMap}
            >
              ← 지도로 돌아가기
            </Button>
            <Badge
              className={`${
                community.status === "growing"
                  ? "bg-green-500"
                  : community.status === "crisis"
                  ? "bg-red-500"
                  : community.status === "abandoned"
                  ? "bg-gray-500"
                  : "bg-community-primary"
              } text-white`}
            >
              {community.status === "growing"
                ? "성장 중"
                : community.status === "crisis"
                ? "위기"
                : community.status === "abandoned"
                ? "유령"
                : "일반"}
            </Badge>
            <Badge variant="outline">
              {community.privacy === "public"
                ? "공개"
                : community.privacy === "partial"
                ? "부분 공개"
                : community.privacy === "private"
                ? "비공개"
                : "기간 제한"}
            </Badge>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {community.emoji && <span className="text-3xl mr-1">{community.emoji}</span>}
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {getTypeIcon(community)}
              {community.name}
            </h1>
          </div>
          <p className="text-gray-500 mt-1">운영: {community.owner}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-3">
            <WeatherDisplay
              weather={community.weatherData?.weatherType || community.weather}
              temperature={community.weatherData?.temperature}
            />
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            설정
          </Button>
        </div>
      </div>

      {/* Community Image/Emoji Display */}
      {renderCommunityImage()}

      {community.locationInfo && (
        <Card className="mb-6 p-4 bg-gray-50">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">위치 정보</span>
          </div>
          <p>
            {community.locationInfo.city && `${community.locationInfo.city}, `}
            {community.locationInfo.region && `${community.locationInfo.region}, `}
            {community.locationInfo.country}
          </p>
          {community.locationInfo.displayName && (
            <p className="text-sm text-gray-500 mt-1">
              {community.locationInfo.displayName}
            </p>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Tabs defaultValue="게시판" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="게시판">게시판</TabsTrigger>
              <TabsTrigger value="활동">활동 내역</TabsTrigger>
              <TabsTrigger value="정보">커뮤니티 정보</TabsTrigger>
            </TabsList>

            <TabsContent value="게시판" className="space-y-4">
              {/* Post List or Detail View */}
              {!isDetailView ? (
                <>
                  {/* 게시판 탭 내용 - Post List */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{community.name} 게시판</h2>
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
                  
                  {/* Post List - Table Style */}
                  <div className="overflow-y-auto mt-2 bg-white rounded-md shadow">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-16">번호</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">제목</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-24 hidden md:table-cell">작성자</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-24 hidden md:table-cell">작성일</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-20 hidden sm:table-cell">조회</th>
                          <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-20 hidden sm:table-cell">추천</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPosts.length > 0 ? (
                          filteredPosts.map((post, index) => (
                            <tr 
                              key={post.id} 
                              className={`border-b border-gray-200 hover:bg-gray-50 ${post.isNotice ? 'bg-yellow-50' : ''}`}
                              onClick={() => handlePostClick(post.id)}
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
                                  <span className="text-sm font-medium text-gray-900 hover:text-community-primary cursor-pointer">
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
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-500">
                              게시글이 없습니다. 첫 게시글을 작성해보세요!
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
                      className="bg-community-tertiary text-white hover:bg-community-primary"
                      onClick={() => setIsWriteDialogOpen(true)}
                    >
                      새 게시글 작성
                    </Button>
                  </div>
                </>
              ) : (
                /* Post Detail View */
                <div className="bg-white rounded-lg shadow-sm">
                  {/* Toolbar */}
                  <div className="flex justify-between items-center p-4 border-b">
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 text-gray-600"
                      onClick={handleBackToList}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>목록으로</span>
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleLikePost}
                        className="text-red-500"
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        추천
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsQrDialogOpen(true)}
                      >
                        <QrCode className="h-4 w-4 mr-1" />
                        QR
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleCopyLink}
                      >
                        <Share className="h-4 w-4 mr-1" />
                        공유
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleEditPost}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        수정
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleDeletePost}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        삭제
                      </Button>
                    </div>
                  </div>
                  
                  {!isEditMode ? (
                    /* View Mode */
                    <div className="p-4">
                      {/* Post Header */}
                      <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">{selectedPost?.title}</h1>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span>{selectedPost?.author}</span>
                            <span>{selectedPost?.date}</span>
                            {selectedPost?.isEdited && (
                              <span className="text-xs">(수정됨: {selectedPost?.lastEditedAt})</span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{selectedPost?.viewCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              <span>{selectedPost?.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{selectedPost?.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {selectedPost?.tags && selectedPost.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {selectedPost.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <Separator className="my-4" />
                      
                      {/* Post Content */}
                      <div className="prose max-w-none">
                        {selectedPost?.richContent ? (
                          <div 
                            className="post-content" 
                            dangerouslySetInnerHTML={{ 
                              __html: processContentWithMediaEmbeds(selectedPost.richContent)
                            }} 
                          />
                        ) : (
                          <div className="whitespace-pre-wrap">
                            {selectedPost?.content}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Edit Mode */
                    <div className="p-4">
                      <div className="space-y-4">
                        {/* Title Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            제목
                          </label>
                          <Input
                            placeholder="제목을 입력하세요"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        
                        {/* Editor */}
                        <div className="border rounded-md">
                          <RichTextEditor 
                            ref={editEditorRef as React.RefObject<Editor>}
                            initialValue={selectedPost?.richContent || selectedPost?.content || ""}
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
                            {editedTags.map(tag => (
                              <Badge key={tag} variant="secondary" className="py-1 px-2">
                                {tag}
                                <button
                                  className="ml-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => handleRemoveEditTag(tag)}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="태그 추가"
                              value={editTagInput}
                              onChange={(e) => setEditTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddEditTag();
                                }
                              }}
                              className="flex-1"
                            />
                            <Button type="button" variant="outline" onClick={handleAddEditTag}>
                              추가
                            </Button>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setIsEditMode(false)}>
                            취소
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            저장
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="활동" className="space-y-4">
              <h2 className="text-xl font-bold mb-4">최근 활동</h2>
              
              <div className="space-y-4">
                {posts.slice(0, 3).map((post, i) => (
                  <Card key={post.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">새 글 등록</span>
                      </div>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {post.author}님이 '{post.title}' 게시글을 등록했습니다.
                    </p>
                  </Card>
                ))}
                
                {events.slice(0, 2).map((event, i) => (
                  <Card key={event.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">이벤트 생성</span>
                      </div>
                      <span className="text-sm text-gray-500">{event.startDate}</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {event.communityId}님이 '{event.title}' 이벤트를 생성했습니다.
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="정보" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  커뮤니티 소개
                </h2>
                
                <p className="text-gray-700 mb-6">
                  {community.description || "이 커뮤니티에 대한 설명이 없습니다."}
                </p>
                
                <Separator className="my-6" />
                
                <h3 className="font-bold mb-2">커뮤니티 통계</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">멤버</div>
                    <div className="font-bold text-lg">{community.memberCount}명</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">게시글</div>
                    <div className="font-bold text-lg">{community.postCount}개</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">활력 지수</div>
                    <div className="font-bold text-lg">{community.vitalityIndex}%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="text-sm text-gray-500">마지막 활동</div>
                    <div className="font-bold text-lg">{community.lastActive}</div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold">커뮤니티 설정</h3>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    관리
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">커뮤니티 타입</span>
                    <span>{community.type === "city" ? "도시" : 
                           community.type === "village" ? "마을" : 
                           community.type === "zone" ? "구역" : "개인 공간"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">공개 설정</span>
                    <span>{community.privacy === "public" ? "공개" : 
                           community.privacy === "partial" ? "부분 공개" : 
                           community.privacy === "private" ? "비공개" : "기간 제한"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">생성일</span>
                    <span>2025-05-15</span>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Users className="h-4 w-4" />
                회원 목록 ({members.length})
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs py-1 px-2"
                onClick={() => setIsMemberDialogOpen(true)}
              >
                회원 추가
              </Button>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
              {members.map(member => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
                >
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2 h-2 rounded-full ${member.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                    ></div>
                    <span className="text-xs text-gray-500">
                      {member.isActive ? '활동 중' : '오프라인'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-4">
              더 보기
            </Button>
          </Card>
          
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold mb-0 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                다가오는 이벤트
              </h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs py-1 px-2"
                onClick={() => setIsEventDialogOpen(true)}
              >
                이벤트 추가
              </Button>
            </div>
            
            <div className="space-y-3">
              {events.length > 0 ? (
                events.map(event => (
                  <div key={event.id} className="bg-yellow-50 p-3 rounded-md border border-yellow-200">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-xs text-gray-500">{event.startDate} ~ {event.endDate}</div>
                    <div className="text-sm mt-1">{event.description}</div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center p-3">
                  예정된 이벤트가 없습니다.
                </div>
              )}
            </div>
          </Card>
          
          {community.hasSosSignal && (
            <Card className="p-4 bg-red-50 border-red-200">
              <h3 className="font-bold text-red-700 mb-2">SOS 신호 감지됨</h3>
              <p className="text-sm text-red-600">
                이 커뮤니티는 현재 위기 상황입니다. 도움이 필요합니다.
              </p>
              <Button className="w-full mt-3 bg-red-600 hover:bg-red-700">
                도움 요청하기
              </Button>
            </Card>
          )}
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

      {/* Add Member Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>회원 추가</DialogTitle>
            <DialogDescription>
              새 회원을 커뮤니티에 추가합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                회원 이름
              </label>
              <Input
                placeholder="회원 이름을 입력하세요"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                역할
              </label>
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
              >
                <option value="회원">일반 회원</option>
                <option value="운영진">운영진</option>
                <option value="관리자">관리자</option>
                <option value="봇">봇</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleAddMember}>
              회원 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>이벤트 추가</DialogTitle>
            <DialogDescription>
              새 이벤트를 커뮤니티에 추가합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이벤트 제목
              </label>
              <Input
                placeholder="이벤트 제목을 입력하세요"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이벤트 설명
              </label>
              <Input
                placeholder="이벤트에 대한 간략한 설명"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작일
                </label>
                <Input
                  type="date"
                  value={newEventStart}
                  onChange={(e) => setNewEventStart(e.target.value)}
                  min={getTodayDate()}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료일
                </label>
                <Input
                  type="date"
                  value={newEventEnd}
                  onChange={(e) => setNewEventEnd(e.target.value)}
                  min={newEventStart || getTodayDate()}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreateEvent}>
              이벤트 생성
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>게시글 QR 코드</DialogTitle>
            <DialogDescription>
              이 QR 코드를 스캔하면 게시글로 직접 이동합니다.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-6">
            {selectedPost && (
              <QRCodeSVG 
                value={`${window.location.origin}/community/${community.id}/post/${selectedPost.id}`}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={false}
              />
            )}
            <p className="mt-4 text-sm text-gray-500 text-center">
              이 QR 코드를 저장하거나 공유하세요
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQrDialogOpen(false)}>
              닫기
            </Button>
            <Button onClick={handleCopyLink}>
              URL 복사
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sample data for members
const sampleMembers: Omit<Member, 'communityId'>[] = [
  {
    id: "member1",
    name: "관리자",
    role: "관리자",
    joinedAt: "2025-01-15",
    isActive: true,
  },
  {
    id: "member2",
    name: "기상정보봇",
    role: "봇",
    joinedAt: "2025-01-15",
    isActive: true,
  },
  {
    id: "member3",
    name: "이벤트팀",
    role: "운영진",
    joinedAt: "2025-02-10",
    isActive: true,
  },
  {
    id: "member4",
    name: "사용자1",
    role: "회원",
    joinedAt: "2025-03-05",
    isActive: false,
  },
  {
    id: "member5",
    name: "사용자2",
    role: "회원",
    joinedAt: "2025-04-20",
    isActive: true,
  },
];

export default CommunityDetail;
