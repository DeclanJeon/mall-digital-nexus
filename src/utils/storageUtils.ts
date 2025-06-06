import { CommunityZone, CommunityMapEvent } from '@/types/community';
import { Post, Channel, Member, Comment } from '@/types/post';

// Community storage functions
export const loadCommunitiesFromLocalStorage = (): CommunityZone[] => {
  try {
    const communitiesJSON = localStorage.getItem('communities');
    return communitiesJSON ? JSON.parse(communitiesJSON) : [];
  } catch (error) {
    console.error('Error loading communities from localStorage:', error);
    return [];
  }
};

export const saveCommunitiesToLocalStorage = (
  communities: CommunityZone[]
): void => {
  try {
    localStorage.setItem('communities', JSON.stringify(communities));
  } catch (error) {
    console.error('Error saving communities to localStorage:', error);
  }
};

export const saveCommunityToLocalStorage = (community: CommunityZone): void => {
  try {
    const existingCommunities = loadCommunitiesFromLocalStorage();
    const communityExists = existingCommunities.some(
      (c) => c.id === community.id
    );

    let updatedCommunities;
    if (communityExists) {
      updatedCommunities = existingCommunities.map((c) =>
        c.id === community.id ? community : c
      );
    } else {
      updatedCommunities = [...existingCommunities, community];
    }

    saveCommunitiesToLocalStorage(updatedCommunities);

    // TODO: This will be replaced with a backend API call in the future
    console.log(
      'Community saved to localStorage. Will be replaced with API call in future.'
    );
  } catch (error) {
    console.error('Error saving community to localStorage:', error);
  }
};

// User community membership functions
export const joinCommunity = (communityId: string): void => {
  try {
    const communities = loadCommunitiesFromLocalStorage();
    const updatedCommunities = communities.map((community) => {
      if (community.id === communityId) {
        return {
          ...community,
          isMember: true,
          memberCount: community.memberCount + 1,
        };
      }
      return community;
    });

    saveCommunitiesToLocalStorage(updatedCommunities);

    // Also add to user's joined communities list
    const joinedCommunities = getUserJoinedCommunities();
    if (!joinedCommunities.includes(communityId)) {
      joinedCommunities.push(communityId);
      localStorage.setItem(
        'userJoinedCommunities',
        JSON.stringify(joinedCommunities)
      );
    }
  } catch (error) {
    console.error('Error joining community:', error);
  }
};

export const leaveCommunity = (communityId: string): void => {
  try {
    const communities = loadCommunitiesFromLocalStorage();
    const updatedCommunities = communities.map((community) => {
      if (community.id === communityId) {
        return {
          ...community,
          isMember: false,
          memberCount: Math.max(0, community.memberCount - 1),
        };
      }
      return community;
    });

    saveCommunitiesToLocalStorage(updatedCommunities);

    // Also remove from user's joined communities list
    let joinedCommunities = getUserJoinedCommunities();
    joinedCommunities = joinedCommunities.filter((id) => id !== communityId);
    localStorage.setItem(
      'userJoinedCommunities',
      JSON.stringify(joinedCommunities)
    );
  } catch (error) {
    console.error('Error leaving community:', error);
  }
};

export const getUserJoinedCommunities = (): string[] => {
  try {
    const joinedCommunitiesJSON = localStorage.getItem('userJoinedCommunities');
    return joinedCommunitiesJSON ? JSON.parse(joinedCommunitiesJSON) : [];
  } catch (error) {
    console.error('Error getting user joined communities:', error);
    return [];
  }
};

export const loadUserCommunities = (): CommunityZone[] => {
  try {
    const joinedCommunityIds = getUserJoinedCommunities();
    const allCommunities = loadCommunitiesFromLocalStorage();

    return allCommunities
      .filter((community) => joinedCommunityIds.includes(community.id))
      .map((community) => ({
        ...community,
        isMember: true,
      }));
  } catch (error) {
    console.error('Error loading user communities:', error);
    return [];
  }
};

// Community Events functions
export const loadCommunityEvents = (
  communityId?: string
): CommunityMapEvent[] => {
  try {
    const eventsJSON = localStorage.getItem('communityMapEvents');
    const allEvents = eventsJSON ? JSON.parse(eventsJSON) : [];

    return communityId
      ? allEvents.filter(
          (event: CommunityMapEvent) => event.communityId === communityId
        )
      : allEvents;
  } catch (error) {
    console.error('Error loading community events:', error);
    return [];
  }
};

export const saveCommunityEvent = (event: CommunityMapEvent): void => {
  try {
    const existingEvents = loadCommunityEvents();
    const eventExists = existingEvents.some((e) => e.id === event.id);

    let updatedEvents;
    if (eventExists) {
      updatedEvents = existingEvents.map((e) =>
        e.id === event.id ? event : e
      );
    } else {
      updatedEvents = [...existingEvents, event];
    }

    localStorage.setItem('communityMapEvents', JSON.stringify(updatedEvents));

    // Update the community to indicate it has events
    const communities = loadCommunitiesFromLocalStorage();
    const updatedCommunities = communities.map((community) => {
      if (community.id === event.communityId) {
        return {
          ...community,
          hasEvent: true,
        };
      }
      return community;
    });

    saveCommunitiesToLocalStorage(updatedCommunities);
  } catch (error) {
    console.error('Error saving community event:', error);
  }
};

// Post storage functions
export const loadPostsFromLocalStorage = (communityId?: string): Post[] => {
  try {
    const postsJSON = localStorage.getItem('posts');
    let posts: Post[] = postsJSON ? JSON.parse(postsJSON) : [];

    // Data cleansing and backward compatibility
    posts = posts.map((post) => {
      let content = post.content;
      if (typeof post.content !== 'string') {
        if (typeof post.richContent === 'string') {
          content = post.richContent; // richContent가 있으면 사용
        } else if (post.content !== null && post.content !== undefined) {
          // content가 객체일 수 있으므로, 안전하게 문자열로 변환 시도 또는 기본값 사용
          // 여기서는 간단히 빈 문자열로 처리하거나, 혹은 String(post.content) 시도 가능
          console.warn(`Post ID ${post.id} has non-string content. Defaulting to empty string.`);
          content = ''; // 또는 String(post.content) 또는 JSON.stringify(post.content)
        } else {
          content = ''; // null 또는 undefined인 경우
        }
      }

      const comments = typeof post.comments === 'number' ? post.comments : 0;
      const likes = typeof post.likes === 'number' ? post.likes : 0;
      const viewCount = typeof post.viewCount === 'number' ? post.viewCount : 0;
      const tags = Array.isArray(post.tags) ? post.tags : [];
      const communityIdResolved = post.communityId || 'global';

      return {
        ...post,
        content,
        comments,
        likes,
        viewCount,
        tags,
        communityId: communityIdResolved,
      };
    });

    if (communityId) {
      return posts.filter((post) => post.communityId === communityId);
    }
    return posts;
  } catch (error) {
    console.error('Error loading posts from localStorage:', error);
    return [];
  }
};

export const savePostToLocalStorage = (post: Post): void => {
  try {
    const posts = loadPostsFromLocalStorage();
    const existingPostIndex = posts.findIndex((p) => p.id === post.id);

    // Ensure the post has a communityId
    const postToSave = {
      ...post,
      communityId: post.communityId || 'global',
    };

    if (existingPostIndex >= 0) {
      // Update existing post
      posts[existingPostIndex] = postToSave;
    } else {
      // Add new post
      posts.unshift(postToSave);
    }

    localStorage.setItem('posts', JSON.stringify(posts));
  } catch (error) {
    console.error('Error saving post to localStorage:', error);
  }
};

// Get post by ID function
export const getPostByIdFromLocalStorage = (postId: string): Post | null => {
  try {
    const posts = loadPostsFromLocalStorage();
    return posts.find((post) => post.id === postId) || null;
  } catch (error) {
    console.error('Error loading post from localStorage:', error);
    return null;
  }
};

// Increment view count function
export const incrementPostViewCount = (postId: string): Post | null => {
  try {
    const post = getPostByIdFromLocalStorage(postId);
    if (!post) return null;

    const updatedPost = {
      ...post,
      viewCount: (post.viewCount || 0) + 1,
    };

    savePostToLocalStorage(updatedPost);
    return updatedPost;
  } catch (error) {
    console.error('Error incrementing view count:', error);
    return null;
  }
};

// Increment post likes
export const incrementPostLikes = (postId: string): Post | null => {
  try {
    const post = getPostByIdFromLocalStorage(postId);
    if (!post) return null;

    const updatedPost = {
      ...post,
      likes: post.likes + 1,
    };

    savePostToLocalStorage(updatedPost);
    return updatedPost;
  } catch (error) {
    console.error('Error incrementing likes:', error);
    return null;
  }
};

export const deletePostFromLocalStorage = (postId: string): void => {
  try {
    const existingPosts = loadPostsFromLocalStorage();
    const updatedPosts = existingPosts.filter((p) => p.id !== postId);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    // TODO: This will be replaced with a backend API call in the future
    console.log(
      'Post deleted from localStorage. Will be replaced with API call in future.'
    );
  } catch (error) {
    console.error('Error deleting post from localStorage:', error);
  }
};

// Channel storage functions
export const loadChannelsFromLocalStorage = (
  communityId?: string
): Channel[] => {
  try {
    const channelsJSON = localStorage.getItem('channels');
    const allChannels = channelsJSON
      ? JSON.parse(channelsJSON)
      : getDefaultChannels();

    if (!channelsJSON) {
      // Initialize with default channels
      saveChannelsToLocalStorage(allChannels);
    }

    return communityId
      ? allChannels.filter(
          (channel: Channel) =>
            channel.communityId === communityId || channel.communityId === 'global'
        )
      : allChannels;
  } catch (error) {
    console.error('Error loading channels from localStorage:', error);
    return getDefaultChannels();
  }
};

export const saveChannelToLocalStorage = (
  channel: Channel,
  communityId?: string
): void => {
  try {
    const channels = loadChannelsFromLocalStorage();
    const existingChannelIndex = channels.findIndex((c) => c.id === channel.id);

    // Ensure the channel has a communityId
    const channelToSave = {
      ...channel,
      communityId: communityId || channel.communityId || 'global',
    };

    if (existingChannelIndex >= 0) {
      channels[existingChannelIndex] = channelToSave;
    } else {
      channels.push(channelToSave);
    }

    localStorage.setItem('channels', JSON.stringify(channels));
  } catch (error) {
    console.error('Error saving channel to localStorage:', error);
  }
};

export const saveChannelsToLocalStorage = (channels: Channel[]): void => {
  try {
    localStorage.setItem('channels', JSON.stringify(channels));
  } catch (error) {
    console.error('Error saving channels to localStorage:', error);
  }
};

// Member storage functions
export const loadMembersFromLocalStorage = (communityId?: string): Member[] => {
  try {
    const membersJSON = localStorage.getItem('communityMembers');
    const allMembers = membersJSON ? JSON.parse(membersJSON) : [];

    return communityId
      ? allMembers.filter(
          (member: Member) => member.communityId === communityId
        )
      : allMembers;
  } catch (error) {
    console.error('Error loading members from localStorage:', error);
    return [];
  }
};

export const saveMemberToLocalStorage = (member: Member): void => {
  try {
    const existingMembers = loadMembersFromLocalStorage();
    const memberExists = existingMembers.some((m) => m.id === member.id);

    let updatedMembers;
    if (memberExists) {
      updatedMembers = existingMembers.map((m) =>
        m.id === member.id ? member : m
      );
    } else {
      updatedMembers = [...existingMembers, member];
    }

    localStorage.setItem('communityMembers', JSON.stringify(updatedMembers));
  } catch (error) {
    console.error('Error saving member to localStorage:', error);
  }
};

// Event storage functions
export const loadEventsFromLocalStorage = (
  communityId?: string
): CommunityMapEvent[] => {
  try {
    const eventsJSON = localStorage.getItem('communityEvents');
    const allEvents = eventsJSON ? JSON.parse(eventsJSON) : [];

    return communityId
      ? allEvents.filter(
          (event: CommunityMapEvent) => event.communityId === communityId
        )
      : allEvents;
  } catch (error) {
    console.error('Error loading events from localStorage:', error);
    return [];
  }
};

export const saveEventToLocalStorage = (event: CommunityMapEvent): void => {
  try {
    const existingEvents = loadEventsFromLocalStorage();
    const eventExists = existingEvents.some((e) => e.id === event.id);

    let updatedEvents;
    if (eventExists) {
      updatedEvents = existingEvents.map((e) =>
        e.id === event.id ? event : e
      );
    } else {
      updatedEvents = [...existingEvents, event];
    }

    localStorage.setItem('communityMapEvents', JSON.stringify(updatedEvents));

    // Update the community to indicate it has events
    const communities = loadCommunitiesFromLocalStorage();
    const updatedCommunities = communities.map((community) => {
      if (community.id === event.communityId) {
        return {
          ...community,
          hasEvent: true,
        };
      }
      return community;
    });

    saveCommunitiesToLocalStorage(updatedCommunities);
  } catch (error) {
    console.error('Error saving community event:', error);
  }
};

export const getDefaultChannelsIcon = (): Channel[] => {
  return [
    {
      id: 'notice',
      name: '공지사항',
      icon: '📢',
      description: '중요 소식',
      color: '#6366f1',
      communityId: 'global',
    },
    {
      id: 'free',
      name: '자유게시판',
      description: '자유로운 대화와 토론',
      icon: '💬',
      communityId: 'global',
    },
    {
      id: 'qna',
      name: '질문과 답변',
      description: '질문하고 답변하는 공간',
      icon: '❓',
      communityId: 'global',
    },
    {
      id: 'event',
      name: '이벤트',
      description: '진행중인 이벤트 소식',
      icon: '🎉',
      communityId: 'global',
    },
    {
      id: 'share',
      name: '공유',
      description: '정보와 자료 공유',
      icon: '🔗',
      communityId: 'global',
    },
  ];
};

const getDefaultChannels = (): Channel[] => {
  return [
    {
      id: 'channel-1',
      name: '공지사항',
      description: '공지사항 및 중요 안내',
      icon: '📢',
      communityId: 'global',
    },
    {
      id: 'channel-2',
      name: '자유게시판',
      description: '자유로운 대화와 토론',
      icon: '💬',
      communityId: 'global',
    },
    {
      id: 'channel-3',
      name: '질문과 답변',
      description: '질문하고 답변하는 공간',
      icon: '❓',
      communityId: 'global',
    },
    {
      id: 'channel-4',
      name: '이벤트',
      description: '진행중인 이벤트 소식',
      icon: '🎉',
      communityId: 'global',
    },
    {
      id: 'channel-5',
      name: '공유',
      description: '정보와 자료 공유',
      icon: '🔗',
      communityId: 'global',
    },
  ];
};

// Statistics functions
export const getCommunityStatistics = () => {
  const communities = loadCommunitiesFromLocalStorage();
  const posts = loadPostsFromLocalStorage();

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return {
    totalCommunities: communities.length,
    activeCommunities: communities.filter((c) => c.status !== 'abandoned')
      .length,
    activeUsers: calculateActiveUsers(communities),
    todayPosts: posts.filter((p) => p.date?.startsWith(today)).length,
  };
};

const calculateActiveUsers = (communities: CommunityZone[]): number => {
  // For demo purposes, calculate a rough estimate of active users
  // In a real app, this would come from actual user activity data
  return communities.reduce((sum, community) => sum + community.memberCount, 0);
};

export const removeChannelFromLocalStorage = (
  channelId: string,
  communityId?: string
): void => {
  try {
    let channels = loadChannelsFromLocalStorage(communityId);
    channels = channels.filter((channel) => channel.id !== channelId);
    if (communityId) {
      const allChannels = loadChannelsFromLocalStorage(); // 모든 채널 로드
      const otherCommunityChannels = allChannels.filter(ch => ch.communityId !== communityId);
      saveChannelsToLocalStorage([...otherCommunityChannels, ...channels]);
    } else {
      saveChannelsToLocalStorage(channels);
    }
  } catch (error) {
    console.error('Error removing channel from localStorage:', error);
  }
};

// Comment storage functions
const COMMENTS_STORAGE_KEY = 'comments';

export const generateCommentId = (): string => {
  return `comment_${new Date().getTime()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const loadCommentsFromLocalStorage = (postId?: string): Comment[] => {
  try {
    const commentsJSON = localStorage.getItem(COMMENTS_STORAGE_KEY);
    let allComments: Comment[] = commentsJSON ? JSON.parse(commentsJSON) : [];
    if (postId) {
      return allComments.filter(comment => comment.postId === postId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return allComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  } catch (error) {
    console.error('Error loading comments from localStorage:', error);
    return [];
  }
};

export const saveCommentToLocalStorage = (comment: Comment): void => {
  try {
    const existingComments = loadCommentsFromLocalStorage(); // postId 필터 없이 모든 댓글 로드
    const updatedComments = [...existingComments, comment];
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(updatedComments));
  } catch (error) {
    console.error('Error saving comment to localStorage:', error);
  }
};

export const deleteCommentFromLocalStorage = (commentId: string): void => {
  try {
    let allComments = loadCommentsFromLocalStorage();
    allComments = allComments.filter(comment => comment.id !== commentId);
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(allComments));
  } catch (error) {
    console.error('Error deleting comment from localStorage:', error);
  }
};
