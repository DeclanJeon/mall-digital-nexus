import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  loadPostsFromLocalStorage,
  savePostToLocalStorage,
  loadChannelsFromLocalStorage,
  saveChannelToLocalStorage,
  removeChannelFromLocalStorage,
  loadCommunitiesFromLocalStorage,
} from '@/utils/storageUtils';
import { Post, Channel } from '@/types/post';
import { CommunityZone } from '@/types/community';

const DEFAULT_CHANNELS: Channel[] = [
  {
    id: 'channel-1',
    name: '공지사항',
    icon: '📢',
    description: '중요 소식',
    color: '#6366f1',
    communityId: 'global',
  },
  {
    id: 'channel-2',
    name: '자유게시판',
    icon: '💬',
    description: '자유로운 토론',
    color: '#06b6d4',
    communityId: 'global',
  },
];

interface UseCommunityBoardLogicProps {
  communityId: string;
  initialPosts?: Post[];
  zoneName: string;
}

const useCommunityBoardLogic = ({
  communityId,
  initialPosts,
  zoneName,
}: UseCommunityBoardLogicProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [currentQRPost, setCurrentQRPost] = useState<Post | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [communities, setCommunities] = useState<CommunityZone[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'latest' | 'popular'>('latest');
  const [showHelpTips, setShowHelpTips] = useState(() => {
    const dismissed = localStorage.getItem('communityHelpTipsDismissed');
    return dismissed !== 'true';
  });
  const [hasNotifications, setHasNotifications] = useState(false); // Dummy state for notifications
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; path: string }[]
  >([
    { label: '홈', path: '/' },
    { label: '커뮤니티', path: '/community' },
    { label: zoneName, path: '' },
  ]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const loadedPosts =
          initialPosts || loadPostsFromLocalStorage(communityId);
        let loadedChannels = loadChannelsFromLocalStorage(communityId);
        if (!loadedChannels || loadedChannels.length === 0) {
          loadedChannels = DEFAULT_CHANNELS;
          loadedChannels.forEach((channel) =>
            saveChannelToLocalStorage(channel, communityId)
          );
        }
        const loadedCommunities = loadCommunitiesFromLocalStorage();

        setPosts(loadedPosts);
        setChannels(loadedChannels);
        setCommunities(loadedCommunities);
        setIsLoading(false);
      }, 800);
    };
    loadData();
  }, [communityId, initialPosts]);

  // Filter and sort posts
  const processedPosts = useMemo(() => {
    let filtered = posts.filter((post) => {
      const matchesSearch = searchQuery.trim()
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'notice' && post.isNotice) ||
        (activeTab !== 'all' &&
          activeTab !== 'notice' &&
          post.channelId === activeTab);

      const matchesFilters =
        activeFilters.length === 0 ||
        activeFilters.some((filter) => {
          if (filter === 'hasComments') return post.comments > 0;
          if (filter === 'popular') return post.likes > 5;
          if (filter === 'recent') {
            const postDate = new Date(post.date);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return postDate >= weekAgo;
          }
          return true;
        });

      return matchesSearch && matchesTab && matchesFilters;
    });

    if (sortOption === 'popular') {
      filtered = filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      filtered = filtered.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }

    return filtered;
  }, [posts, searchQuery, activeTab, sortOption, activeFilters]);

  // Post Handlers
  const handlePostClick = (post: Post) => {
    sessionStorage.setItem('lastViewedPost', post.id);
    if (post.slug) {
      navigate(`/community/${communityId}/post/by-slug/${post.slug}`);
    } else {
      navigate(`/community/${communityId}/post/${post.id}`);
    }
    const updatedPost = { ...post, viewCount: (post.viewCount || 0) + 1 };
    savePostToLocalStorage(updatedPost);
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p.id === post.id ? updatedPost : p))
    );
  };

  const handleSubmitNewPost = (
    newPostData: Omit<
      Post,
      'id' | 'author' | 'date' | 'likes' | 'comments' | 'viewCount'
    >
  ) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: '현재 사용자', // Replace with actual user data
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      viewCount: 0,
      ...newPostData,
      communityId, // Ensure communityId is correct
    };

    savePostToLocalStorage(newPost);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    toast({
      title: '게시글이 작성되었습니다',
      description: '게시판에 새 글이 등록되었습니다.',
      variant: 'default',
    });
    setTimeout(() => {
      handlePostClick(newPost);
    }, 800);
  };

  const handleShowQRCode = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    setCurrentQRPost(post);
    setIsQRDialogOpen(true);
  };

  const getPostUrl = (post: Post) => {
    const baseUrl = window.location.origin;
    if (post.slug) {
      return `${baseUrl}/community/${communityId}/post/by-slug/${post.slug}`;
    } else {
      return `${baseUrl}/community/${communityId}/post/${post.id}`;
    }
  };

  // Channel Handlers
  const handleChannelCreate = (newChannel: Channel) => {
    saveChannelToLocalStorage(newChannel, communityId);
    setChannels((prev) => [...prev, newChannel]);
    toast({
      title: '채널이 추가되었습니다',
      description: `'${newChannel.name}' 채널이 생성되었습니다.`,
      variant: 'default',
    });
  };

  const handleChannelUpdate = (updatedChannel: Channel) => {
    saveChannelToLocalStorage(updatedChannel, communityId);
    setChannels((prev) =>
      prev.map((ch) => (ch.id === updatedChannel.id ? updatedChannel : ch))
    );
    toast({
      title: '채널이 수정되었습니다',
      description: `'${updatedChannel.name}' 채널 정보가 업데이트되었습니다.`,
      variant: 'default',
    });
  };

  const handleChannelDelete = (id: string) => {
    const channelToDelete = channels.find((ch) => ch.id === id);
    if (!channelToDelete) return;

    if (
      !window.confirm(
        `정말 '${channelToDelete.name}' 채널을 삭제하시겠습니까? 관련 게시글 ${
          posts.filter((p) => p.channelId === id).length
        }개도 함께 삭제됩니다.`
      )
    ) {
      return;
    }

    removeChannelFromLocalStorage(id, communityId);
    setChannels((prev) => prev.filter((ch) => ch.id !== id));
    setPosts((prev) => prev.filter((post) => post.channelId !== id));

    toast({
      title: '채널이 삭제되었습니다',
      description: `'${channelToDelete.name}' 채널이 삭제되었습니다.`,
      variant: 'default',
    });

    if (activeTab === id) {
      setActiveTab('all');
    }
  };

  // Filter Handlers
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Help Tips Handler
  const dismissHelpTips = () => {
    setShowHelpTips(false);
    localStorage.setItem('communityHelpTipsDismissed', 'true');
  };

  return {
    // State
    searchQuery,
    activeTab,
    isWriteDialogOpen,
    currentQRPost,
    isQRDialogOpen,
    isChannelDialogOpen,
    posts,
    channels,
    communities,
    viewMode,
    isLoading,
    sortOption,
    showHelpTips,
    hasNotifications,
    activeFilters,
    breadcrumbs,

    // Derived State
    processedPosts,

    // Handlers
    setSearchQuery,
    setActiveTab,
    setIsWriteDialogOpen,
    setIsQRDialogOpen,
    setIsChannelDialogOpen,
    setPosts, // Expose setPosts for potential external updates
    setChannels, // Expose setChannels for potential external updates
    setViewMode,
    setSortOption,
    setActiveFilters,
    handlePostClick,
    handleSubmitNewPost,
    handleShowQRCode,
    getPostUrl,
    handleChannelCreate,
    handleChannelUpdate,
    handleChannelDelete,
    toggleFilter,
    dismissHelpTips,
  };
};

export default useCommunityBoardLogic;
