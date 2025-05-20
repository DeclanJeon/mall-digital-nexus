import { CommunityZone, CommunityMapEvent } from '@/types/community';
import { Post, Channel, Member, CommunityEvent } from '@/types/post';

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
    const postsJSON = localStorage.getItem('communityPosts');
    const allPosts = postsJSON ? JSON.parse(postsJSON) : [];

    return communityId
      ? allPosts.filter((post: Post) => post.communityId === communityId)
      : allPosts;
  } catch (error) {
    console.error('Error loading posts from localStorage:', error);
    return [];
  }
};

// Function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim() // Trim leading/trailing spaces
    .concat(`-${Date.now().toString().slice(-6)}`); // Append timestamp for uniqueness
};

export const savePostToLocalStorage = (post: Post): void => {
  try {
    // Generate slug if it doesn't exist
    if (!post.slug && post.title) {
      post.slug = generateSlug(post.title);
    }

    const existingPosts = loadPostsFromLocalStorage();
    const postExists = existingPosts.some((p) => p.id === post.id);

    let updatedPosts;
    if (postExists) {
      updatedPosts = existingPosts.map((p) => (p.id === post.id ? post : p));
    } else {
      updatedPosts = [...existingPosts, post];
    }

    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));

    // TODO: This will be replaced with a backend API call in the future
    console.log(
      'Post saved to localStorage. Will be replaced with API call in future.'
    );
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
    localStorage.setItem('communityPosts', JSON.stringify(updatedPosts));

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
    const channelsJSON = localStorage.getItem('communityChannels');
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
            channel.communityId === communityId ||
            channel.communityId === 'global'
        )
      : allChannels;
  } catch (error) {
    console.error('Error loading channels from localStorage:', error);
    return getDefaultChannels();
  }
};

export const saveChannelToLocalStorage = (
  channel: Channel,
  communityId: string
): void => {
  try {
    const existingChannels = loadChannelsFromLocalStorage();
    const channelExists = existingChannels.some((c) => c.id === channel.id);

    let updatedChannels;
    if (channelExists) {
      updatedChannels = existingChannels.map((c) =>
        c.id === channel.id ? channel : c
      );
    } else {
      updatedChannels = [...existingChannels, channel];
    }

    localStorage.setItem('communityChannels', JSON.stringify(updatedChannels));

    // TODO: This will be replaced with a backend API call in the future
    console.log(
      'Channel saved to localStorage. Will be replaced with API call in future.'
    );
  } catch (error) {
    console.error('Error saving channel to localStorage:', error);
  }
};

export const saveChannelsToLocalStorage = (channels: Channel[]): void => {
  try {
    localStorage.setItem('communityChannels', JSON.stringify(channels));
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
): CommunityEvent[] => {
  try {
    const eventsJSON = localStorage.getItem('communityEvents');
    const allEvents = eventsJSON ? JSON.parse(eventsJSON) : [];

    return communityId
      ? allEvents.filter(
          (event: CommunityEvent) => event.communityId === communityId
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
      description: '질문하고 답변는 공간',
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
    saveChannelsToLocalStorage(channels);
  } catch (error) {
    console.error('Error removing channel from localStorage:', error);
  }
};
