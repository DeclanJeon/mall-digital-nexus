import { v4 as uuidv4 } from 'uuid';
import { add, get, getAll, update, remove, getByIndex } from '../utils/indexedDBService';
import { STORES } from '../utils/indexedDB';
import { Forum, ForumPost, ForumComment, Planet, Channel } from '../types/forum';

// Planet operations
export const getAllPlanets = async (): Promise<Planet[]> => {
  return getAll<Planet>(STORES.FORUMS + '_planets');
};

export const getPlanet = async (id: string): Promise<Planet | undefined> => {
  return get<Planet>(STORES.FORUMS + '_planets', id);
};

export const savePlanet = async (planet: Planet): Promise<string> => {
  const now = new Date().toISOString();
  
  if (!planet.id) {
    planet.id = uuidv4();
  }
  
  await update(STORES.FORUMS + '_planets', planet);
  return planet.id;
};

// Channel operations
export const getChannelsByPlanet = async (planetId: string): Promise<Channel[]> => {
  return getByIndex<Channel>(STORES.FORUMS + '_channels', 'by_planet', planetId);
};

export const saveChannel = async (channel: Channel): Promise<string> => {
  if (!channel.id) {
    channel.id = uuidv4();
  }
  
  await update(STORES.FORUMS + '_channels', channel);
  return channel.id;
};

// Forum operations
export const getForumsByChannel = async (channelId: string): Promise<Forum[]> => {
  return getByIndex<Forum>(STORES.FORUMS, 'by_channel', channelId);
};

export const getForum = async (id: string): Promise<Forum | undefined> => {
  return get<Forum>(STORES.FORUMS, id);
};

export const saveForum = async (forum: Forum): Promise<string> => {
  const now = new Date().toISOString();
  
  if (!forum.id) {
    forum.id = uuidv4();
    forum.createdAt = now;
    forum.postCount = 0;
  }
  
  forum.updatedAt = now;
  
  await update(STORES.FORUMS, forum);
  return forum.id;
};

// Post operations
export const getPostsByForum = async (forumId: string): Promise<ForumPost[]> => {
  const posts = await getByIndex<ForumPost>(STORES.POSTS, 'by_forum', forumId);
  // Sort by pinned first, then by date
  return posts.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getPost = async (id: string): Promise<ForumPost | undefined> => {
  return get<ForumPost>(STORES.POSTS, id);
};

export const createPost = async (post: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'commentCount'>): Promise<string> => {
  const now = new Date().toISOString();
  
  const newPost: ForumPost = {
    ...post,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    views: 0,
    likes: 0,
    commentCount: 0,
  };
  
  await add(STORES.POSTS, newPost);
  
  // Update forum post count and last post date
  const forum = await getForum(post.forumId);
  if (forum) {
    forum.postCount += 1;
    forum.lastPostAt = now;
    await update(STORES.FORUMS, forum);
  }
  
  return newPost.id;
};

export const updatePost = async (id: string, updates: Partial<ForumPost>): Promise<boolean> => {
  const post = await getPost(id);
  
  if (!post) {
    return false;
  }
  
  const updatedPost: ForumPost = {
    ...post,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await update(STORES.POSTS, updatedPost);
  return true;
};

export const deletePost = async (id: string): Promise<boolean> => {
  const post = await getPost(id);
  
  if (!post) {
    return false;
  }
  
  await remove(STORES.POSTS, id);
  
  // Update forum post count
  const forum = await getForum(post.forumId);
  if (forum && forum.postCount > 0) {
    forum.postCount -= 1;
    
    // Find new latest post if any
    const remainingPosts = await getPostsByForum(post.forumId);
    if (remainingPosts.length > 0) {
      forum.lastPostAt = remainingPosts[0].createdAt;
    } else {
      forum.lastPostAt = undefined;
    }
    
    await update(STORES.FORUMS, forum);
  }
  
  // Delete all comments on this post
  const comments = await getCommentsByPost(id);
  for (const comment of comments) {
    await remove(STORES.COMMENTS, comment.id);
  }
  
  return true;
};

// Comment operations
export const getCommentsByPost = async (postId: string): Promise<ForumComment[]> => {
  const comments = await getByIndex<ForumComment>(STORES.COMMENTS, 'by_post', postId);
  return comments.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

export const createComment = async (comment: Omit<ForumComment, 'id' | 'createdAt' | 'updatedAt' | 'likes'>): Promise<string> => {
  const now = new Date().toISOString();
  
  const newComment: ForumComment = {
    ...comment,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
    likes: 0,
  };
  
  await add(STORES.COMMENTS, newComment);
  
  // Update post comment count
  const post = await getPost(comment.postId);
  if (post) {
    post.commentCount += 1;
    await update(STORES.POSTS, post);
  }
  
  return newComment.id;
};

export const deleteComment = async (id: string): Promise<boolean> => {
  const comment = await get<ForumComment>(STORES.COMMENTS, id);
  
  if (!comment) {
    return false;
  }
  
  await remove(STORES.COMMENTS, id);
  
  // Update post comment count
  const post = await getPost(comment.postId);
  if (post && post.commentCount > 0) {
    post.commentCount -= 1;
    await update(STORES.POSTS, post);
  }
  
  return true;
};

// Initialize some default data
export const initializeForumData = async (): Promise<void> => {
  // Check if we already have planets
  const existingPlanets = await getAll<Planet>(STORES.FORUMS + '_planets');
  
  if (existingPlanets.length === 0) {
    // Create default planets
    const planets: Planet[] = [
      {
        id: 'planet-community',
        name: '커뮤니티 행성',
        description: '다양한 주제에 대한 토론과 소통이 이루어지는 커뮤니티 행성입니다.',
        imageUrl: '/images/planets/community.svg',
        color: '#9b87f5',
        position: { x: 200, y: 150 }
      },
      {
        id: 'planet-learning',
        name: '학습 행성',
        description: '함께 배우고 성장할 수 있는 학습 중심 행성입니다.',
        imageUrl: '/images/planets/learning.svg',
        color: '#1EAEDB',
        position: { x: 400, y: 250 }
      },
      {
        id: 'planet-marketplace',
        name: '마켓 행성',
        description: '아이디어와 상품이 거래되는 마켓플레이스 행성입니다.',
        imageUrl: '/images/planets/marketplace.svg',
        color: '#7E69AB',
        position: { x: 600, y: 150 }
      }
    ];
    
    for (const planet of planets) {
      await savePlanet(planet);
    }
    
    // Create default channels
    const channels: Channel[] = [
      {
        id: 'channel-general',
        planetId: 'planet-community',
        name: '일반 토론',
        description: '모든 주제에 대한 일반적인 토론',
        icon: 'message-square',
        color: '#9b87f5'
      },
      {
        id: 'channel-tech',
        planetId: 'planet-community',
        name: '기술 토론',
        description: '기술 관련 주제 토론',
        icon: 'globe',
        color: '#9b87f5'
      },
      {
        id: 'channel-design',
        planetId: 'planet-community',
        name: '디자인 토론',
        description: '디자인 관련 토론',
        icon: 'edit',
        color: '#9b87f5'
      },
      {
        id: 'channel-courses',
        planetId: 'planet-learning',
        name: '강좌 & 튜토리얼',
        description: '다양한 강좌와 튜토리얼',
        icon: 'folder',
        color: '#1EAEDB'
      },
      {
        id: 'channel-qna',
        planetId: 'planet-learning',
        name: '질문 & 답변',
        description: '학습 관련 질문과 답변',
        icon: 'message-square-plus',
        color: '#1EAEDB'
      },
      {
        id: 'channel-marketplace',
        planetId: 'planet-marketplace',
        name: '마켓플레이스',
        description: '상품 및 서비스 거래',
        icon: 'star',
        color: '#7E69AB'
      }
    ];
    
    for (const channel of channels) {
      await saveChannel(channel);
      
      // Create a default forum for each channel
      const forum: Forum = {
        id: `forum-${channel.id}`,
        planetId: channel.planetId,
        channelId: channel.id,
        name: `${channel.name} 포럼`,
        description: channel.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        postCount: 0
      };
      
      await saveForum(forum);
    }
  }
};
