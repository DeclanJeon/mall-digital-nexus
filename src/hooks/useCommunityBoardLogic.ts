import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  loadPostsFromLocalStorage,
  savePostToLocalStorage,
  loadChannelsFromLocalStorage,
  saveChannelToLocalStorage,
  removeChannelFromLocalStorage,
  loadCommunitiesFromLocalStorage,
  incrementPostViewCount,
} from '@/utils/storageUtils';
import { Post, Channel } from '@/types/post';
import { CommunityZone } from '@/types/community';
import { getCommunityChannel, getCommunityList, registerCommunityBoard } from '@/services/communityService';
interface UseCommunityBoardLogicProps {
  communityId: string;
  initialPosts?: Post[];
  zoneName: string;
  onPostClick?: (post: Post) => void;
}

const useCommunityBoardLogic = ({
  communityId,
  initialPosts,
  zoneName,
  onPostClick // 🔥 받아온 onPostClick
}: UseCommunityBoardLogicProps) => {
  const navigate = useNavigate();
  const { address } = useParams<{ address: string }>(); // 🔥 현재 PeerSpace 주소 확인
  const [ searchParams ] = useSearchParams();
  const peerMallKey = searchParams.get('mk');
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isWriteDialogOpen, setIsWriteDialogOpen] = useState(false);
  const [currentQRPost, setCurrentQRPost] = useState<Post | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [communities, setCommunities] = useState<CommunityZone[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'compact'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'latest' | 'popular'>('latest');
  const [showHelpTips, setShowHelpTips] = useState(() => {
    const dismissed = localStorage.getItem('communityHelpTipsDismissed');
    return dismissed !== 'true';
  });
  const [hasNotifications, setHasNotifications] = useState(false);
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
      const loadedPosts = await getCommunityList(address, peerMallKey);
      const loadedChannels = await getCommunityChannel();

      setPosts(loadedPosts);
      setChannels(loadedChannels);
      setIsLoading(false);
    };
    loadData();
  }, [communityId, initialPosts]);

  // Filter and sort posts
  const processedPosts = useMemo(() => {
    let filtered = posts.filter((post) => {
      const matchesSearch = searchQuery.trim()
        ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
          // post.tags.some((tag) =>
          //   tag.toLowerCase().includes(searchQuery.toLowerCase())
          // )
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

  // 🔥 Post Handlers - 핵심 수정 부분
  const handlePostClick = (post: Post) => {
    if (onPostClick) {
      // PeerSpace에서 전달받은 핸들러가 있으면 사용 (상태 변경만)
      onPostClick(post);
    } else {
      // 독립적인 커뮤니티 페이지에서는 기존 로직 사용 (페이지 이동)
      const updatedPost = incrementPostViewCount(post.id);
      if (updatedPost) {
        setPosts(prevPosts => 
          prevPosts.map(p => p.id === post.id ? updatedPost : p)
        );
      }

      if (address) {
        navigate(`/space/${address}/community/post/${post.id}?mk=${peerMallKey}`);
      }
      else {
        // 여기서 페이지 이동 로직 실행
        navigate(`/community/${post.communityId}/post/${post.id}`);

      }
    }
  };

  const handleSubmitNewPost = async (
    newPostData: Omit<
      Post,
      'id' | 'author' | 'date' | 'likes' | 'comments' | 'viewCount'
    >
  ) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: '현재 사용자',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: 0,
      viewCount: 0,
      ...newPostData,
      communityId,
      peerMallName: address,
      peerMallKey,
    };

    await registerCommunityBoard(newPost);
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    toast({
      title: '게시글이 작성되었습니다',
      description: '게시판에 새 글이 등록되었습니다.',
      variant: 'default',
    });
    // setTimeout(() => {
    //   handlePostClick(newPost);
    // }, 800);
  };

  const handleShowQRCode = (e: React.MouseEvent, post: Post) => {
    e.stopPropagation();
    setCurrentQRPost(post);
    setIsQRDialogOpen(true);
  };

  const getPostUrl = (post: Post) => {
    const baseUrl = window.location.origin;
    
    // 🔥 URL 생성도 현재 컨텍스트에 맞게 수정
    if (address) {
      // PeerSpace 내부
      return `${baseUrl}/space/${address}/community/post/${post.id}`;
    } else {
      // 독립 커뮤니티
      if (post.slug) {
        return `${baseUrl}/community/${communityId}/post/by-slug/${post.slug}`;
      } else {
        return `${baseUrl}/community/${communityId}/post/${post.id}`;
      }
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

  const handleTabClick = (id) => {
    let filteredLists;

    if(id == 'all') {
      filteredLists = posts;
    }else {
      filteredLists = posts.filter(post => {
        return post['type'] == id
      });
    }

    setFilteredPosts(filteredLists);
  }

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
    filteredPosts,
    // Derived State
    processedPosts,

    // Handlers
    setSearchQuery,
    setActiveTab,
    setIsWriteDialogOpen,
    setIsQRDialogOpen,
    setIsChannelDialogOpen,
    setPosts,
    setChannels,
    setViewMode,
    setSortOption,
    setActiveFilters,
    handlePostClick, // 🔥 이 핸들러가 onPostClick을 고려함
    handleSubmitNewPost,
    handleShowQRCode,
    getPostUrl,
    handleChannelCreate,
    handleChannelUpdate,
    handleChannelDelete,
    toggleFilter,
    dismissHelpTips,
    handleTabClick
  };
};

export default useCommunityBoardLogic;
