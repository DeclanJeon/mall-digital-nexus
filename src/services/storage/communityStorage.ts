// @/utils/storage/communityStorage.ts
import { storage } from '@/utils/storage/storage';
import { Post, Channel, Comment } from '@/types/post';

// 타입 재export
export type { Post, Channel, Comment };

// 커뮤니티 관련 추가 타입 정의
export interface Community {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  memberCount: number;
  postCount: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunityStats {
  totalPosts: number;
  totalComments: number;
  totalChannels: number;
  totalCommunities: number;
  popularTags: Record<string, number>;
  activeUsers: string[];
  todayPosts: number;
  weeklyGrowth: number;
}

// 이벤트 리스너 타입들
type PostStorageEventListener = (posts: Post[]) => void;
type CommentStorageEventListener = (comments: Comment[]) => void;
type CommunityStorageEventListener = (communities: Community[]) => void;

// 이벤트 매니저 클래스
class CommunityEventManager {
  private postListeners = new Set<PostStorageEventListener>();
  private commentListeners = new Set<CommentStorageEventListener>();
  private communityListeners = new Set<CommunityStorageEventListener>();

  // 게시글 이벤트 리스너
  addPostListener(listener: PostStorageEventListener): () => void {
    this.postListeners.add(listener);
    
    // 등록 즉시 현재 상태 전달
    const currentPosts = communityStorage.posts.getAll();
    listener(currentPosts);
    
    return () => this.postListeners.delete(listener);
  }

  notifyPostListeners(): void {
    const posts = storage.get<Post[]>('COMMUNITY_POSTS') || [];
    console.log('🔔 게시글 데이터 변경 알림:', posts.length, '개');
    
    this.postListeners.forEach(listener => {
      try {
        listener([...posts]);
      } catch (error) {
        console.error('게시글 이벤트 리스너 실행 오류:', error);
      }
    });
  }

  // 댓글 이벤트 리스너
  addCommentListener(listener: CommentStorageEventListener): () => void {
    this.commentListeners.add(listener);
    
    const currentComments = communityStorage.comments.getAll();
    listener(currentComments);
    
    return () => this.commentListeners.delete(listener);
  }

  notifyCommentListeners(): void {
    const comments = storage.get<Comment[]>('COMMUNITY_COMMENTS') || [];
    console.log('🔔 댓글 데이터 변경 알림:', comments.length, '개');
    
    this.commentListeners.forEach(listener => {
      try {
        listener([...comments]);
      } catch (error) {
        console.error('댓글 이벤트 리스너 실행 오류:', error);
      }
    });
  }

  // 커뮤니티 이벤트 리스너
  addCommunityListener(listener: CommunityStorageEventListener): () => void {
    this.communityListeners.add(listener);
    
    const currentCommunities = communityStorage.communities.getAll();
    listener(currentCommunities);
    
    return () => this.communityListeners.delete(listener);
  }

  notifyCommunityListeners(): void {
    const communities = storage.get<Community[]>('COMMUNITIES') || [];
    console.log('🔔 커뮤니티 데이터 변경 알림:', communities.length, '개');
    
    this.communityListeners.forEach(listener => {
      try {
        listener([...communities]);
      } catch (error) {
        console.error('커뮤니티 이벤트 리스너 실행 오류:', error);
      }
    });
  }
}

// 이벤트 매니저 인스턴스
const eventManager = new CommunityEventManager();

// 메인 커뮤니티 스토리지 서비스
export const communityStorage = {
  // 이벤트 리스너 등록 메서드들
  addEventListener: {
    posts: (listener: PostStorageEventListener) => eventManager.addPostListener(listener),
    comments: (listener: CommentStorageEventListener) => eventManager.addCommentListener(listener),
    communities: (listener: CommunityStorageEventListener) => eventManager.addCommunityListener(listener)
  },

  // 게시글 관련 기능들
  posts: {
    // 모든 게시글 가져오기
    getAll(): Post[] {
      const posts = storage.get<Post[]>('COMMUNITY_POSTS') || [];
      console.log('📦 전체 게시글 조회:', posts.length, '개');
      return posts;
    },

    // ID로 게시글 조회
    getById(id: string): Post | undefined {
      if (!id) {
        console.warn('⚠️ 게시글 ID가 제공되지 않았습니다');
        return undefined;
      }
      
      const posts = this.getAll();
      const found = posts.find(p => p.id === id);
      
      if (found) {
        // 조회수 증가 (별도 메서드로 분리 가능)
        this.incrementViewCount(id);
        console.log(`🔍 게시글 발견 (ID: ${id}):`, {
          title: found.title,
          author: found.author,
          channelId: found.channelId
        });
      } else {
        console.warn(`❌ 게시글을 찾을 수 없습니다 (ID: ${id})`);
      }
      
      return found;
    },

    // 채널별 게시글 조회
    getByChannel(channelId: string): Post[] {
      const posts = this.getAll();
      const filtered = posts.filter(p => p.channelId === channelId);
      console.log(`📂 채널별 조회 (${channelId}):`, filtered.length, '개');
      return filtered;
    },

    // 커뮤니티별 게시글 조회
    getByCommunity(communityId: string): Post[] {
      const posts = this.getAll();
      const filtered = posts.filter(p => p.communityId === communityId);
      console.log(`🏘️ 커뮤니티별 조회 (${communityId}):`, filtered.length, '개');
      return filtered;
    },

    // 인기 게시글 조회 (좋아요, 댓글, 조회수 기준)
    getPopular(limit: number = 10): Post[] {
      const posts = this.getAll();
      return posts
        .filter(p => p.likes >= 3 || p.comments >= 2 || p.viewCount >= 10)
        .sort((a, b) => {
          const scoreA = (a.likes || 0) * 3 + (a.comments || 0) * 2 + (a.viewCount || 0) * 0.1;
          const scoreB = (b.likes || 0) * 3 + (b.comments || 0) * 2 + (b.viewCount || 0) * 0.1;
          return scoreB - scoreA;
        })
        .slice(0, limit);
    },

    // 최신 게시글 조회
    getRecent(limit: number = 20): Post[] {
      const posts = this.getAll();
      return posts
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
    },

    // 공지사항 조회
    getNotices(): Post[] {
      const posts = this.getAll();
      return posts.filter(p => p.isNotice).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },

    // 게시글 검색 (향상된 버전)
    search(query: string, filters?: {
      channelId?: string;
      communityId?: string;
      author?: string;
      tags?: string[];
      dateRange?: { start: string; end: string };
    }): Post[] {
      if (!query.trim() && !filters) return this.getAll();
      
      let posts = this.getAll();
      const lowerQuery = query.toLowerCase();
      
      // 텍스트 검색
      if (query.trim()) {
        posts = posts.filter(p => 
          p.title.toLowerCase().includes(lowerQuery) ||
          p.content.toLowerCase().includes(lowerQuery) ||
          p.author.toLowerCase().includes(lowerQuery) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
        );
      }
      
      // 필터 적용
      if (filters) {
        if (filters.channelId) {
          posts = posts.filter(p => p.channelId === filters.channelId);
        }
        if (filters.communityId) {
          posts = posts.filter(p => p.communityId === filters.communityId);
        }
        if (filters.author) {
          posts = posts.filter(p => p.author.toLowerCase().includes(filters.author!.toLowerCase()));
        }
        if (filters.tags && filters.tags.length > 0) {
          posts = posts.filter(p => 
            p.tags && filters.tags!.some(tag => p.tags!.includes(tag))
          );
        }
        if (filters.dateRange) {
          const start = new Date(filters.dateRange.start);
          const end = new Date(filters.dateRange.end);
          posts = posts.filter(p => {
            const postDate = new Date(p.date);
            return postDate >= start && postDate <= end;
          });
        }
      }
      
      console.log(`🔍 검색 결과: "${query}" → ${posts.length}개`);
      return posts;
    },

    // 게시글 저장 또는 업데이트
    save(postData: Omit<Post, 'id' | 'date' | 'viewCount'> & { id?: string }): Post {
      try {
        const posts = this.getAll();
        const now = new Date().toISOString();
        
        // 데이터 정규화
        const normalizedData = this.normalizePostData(postData);
        
        // 새 게시글 객체 생성
        const newPost: Post = {
          ...normalizedData,
          id: postData.id || this.generateId(),
          date: postData.id ? posts.find(p => p.id === postData.id)?.date || now : now,
          viewCount: postData.id ? posts.find(p => p.id === postData.id)?.viewCount || 0 : 0
        };

        // 기존 게시글 업데이트 또는 새로 추가
        const existingIndex = posts.findIndex(p => p.id === newPost.id);
        
        if (existingIndex >= 0) {
          posts[existingIndex] = newPost;
          console.log('✅ 게시글 업데이트:', newPost.title);
        } else {
          posts.unshift(newPost); // 최신 글을 맨 앞에
          console.log('🆕 새 게시글 추가:', newPost.title);
        }

        // 스토리지에 저장
        storage.set('COMMUNITY_POSTS', posts);
        
        // 이벤트 발생
        setTimeout(() => eventManager.notifyPostListeners(), 0);
        
        return newPost;
      } catch (error) {
        console.error('❌ 게시글 저장 오류:', error);
        throw new Error('게시글 저장에 실패했습니다.');
      }
    },

    // 게시글 데이터 정규화
    normalizePostData(data: Partial<Post>): Partial<Post> {
      return {
        title: data.title?.trim() || '제목 없음',
        content: data.content?.trim() || '',
        richContent: data.richContent || data.content || '',
        author: data.author?.trim() || 'Anonymous',
        channelId: data.channelId || 'general',
        communityId: data.communityId || 'global',
        likes: Math.max(0, data.likes || 0),
        comments: Math.max(0, data.comments || 0),
        tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag.trim()) : [],
        isNotice: Boolean(data.isNotice),
        isPinned: Boolean(data.isPinned),
        ...data
      };
    },

    // ID 생성 함수
    generateId(): string {
      return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // 좋아요 업데이트
    updateLikes(id: string, increment: boolean): boolean {
      try {
        const posts = this.getAll();
        const postIndex = posts.findIndex(p => p.id === id);
        
        if (postIndex === -1) {
          console.warn(`⚠️ 게시글을 찾을 수 없습니다 (ID: ${id})`);
          return false;
        }

        const currentLikes = posts[postIndex].likes || 0;
        const newLikes = increment ? currentLikes + 1 : Math.max(0, currentLikes - 1);
        
        posts[postIndex] = {
          ...posts[postIndex],
          likes: newLikes
        };

        storage.set('COMMUNITY_POSTS', posts);
        setTimeout(() => eventManager.notifyPostListeners(), 0);
        
        console.log(`💖 게시글 좋아요 업데이트 (${id}): ${currentLikes} → ${newLikes}`);
        return true;
      } catch (error) {
        console.error('❌ 좋아요 업데이트 오류:', error);
        return false;
      }
    },

    // 조회수 증가
    incrementViewCount(id: string): boolean {
      try {
        const posts = this.getAll();
        const postIndex = posts.findIndex(p => p.id === id);
        
        if (postIndex === -1) return false;

        posts[postIndex] = {
          ...posts[postIndex],
          viewCount: (posts[postIndex].viewCount || 0) + 1
        };

        storage.set('COMMUNITY_POSTS', posts);
        // 조회수는 조용히 업데이트 (이벤트 발생 안 함)
        
        return true;
      } catch (error) {
        console.error('❌ 조회수 업데이트 오류:', error);
        return false;
      }
    },

    // 댓글 수 업데이트
    updateCommentCount(id: string, increment: boolean): boolean {
      try {
        const posts = this.getAll();
        const postIndex = posts.findIndex(p => p.id === id);
        
        if (postIndex === -1) return false;

        const currentComments = posts[postIndex].comments || 0;
        const newComments = increment ? currentComments + 1 : Math.max(0, currentComments - 1);
        
        posts[postIndex] = {
          ...posts[postIndex],
          comments: newComments
        };

        storage.set('COMMUNITY_POSTS', posts);
        setTimeout(() => eventManager.notifyPostListeners(), 0);
        
        console.log(`💬 댓글 수 업데이트 (${id}): ${currentComments} → ${newComments}`);
        return true;
      } catch (error) {
        console.error('❌ 댓글 수 업데이트 오류:', error);
        return false;
      }
    },

    // 게시글 삭제
    delete(id: string): boolean {
      if (!id) {
        console.warn('⚠️ 삭제할 게시글 ID가 제공되지 않았습니다');
        return false;
      }

      try {
        const posts = this.getAll();
        const initialLength = posts.length;
        const filteredPosts = posts.filter(p => p.id !== id);
        
        if (filteredPosts.length === initialLength) {
          console.warn(`⚠️ 삭제할 게시글을 찾을 수 없습니다 (ID: ${id})`);
          return false;
        }

        storage.set('COMMUNITY_POSTS', filteredPosts);
        console.log(`🗑️ 게시글 삭제 완료 (ID: ${id})`);
        
        // 관련 댓글도 삭제
        communityStorage.comments.deleteByPost(id);
        
        setTimeout(() => eventManager.notifyPostListeners(), 0);
        
        return true;
      } catch (error) {
        console.error('❌ 게시글 삭제 오류:', error);
        return false;
      }
    },

    // 여러 게시글 일괄 삭제
    deleteMultiple(ids: string[]): number {
      if (!Array.isArray(ids) || ids.length === 0) {
        console.warn('⚠️ 삭제할 게시글 ID 배열이 비어있습니다');
        return 0;
      }

      try {
        const posts = this.getAll();
        const initialLength = posts.length;
        const filteredPosts = posts.filter(p => !ids.includes(p.id));
        const deletedCount = initialLength - filteredPosts.length;

        if (deletedCount > 0) {
          storage.set('COMMUNITY_POSTS', filteredPosts);
          console.log(`🗑️ ${deletedCount}개 게시글 일괄 삭제 완료`);
          
          // 관련 댓글들도 삭제
          ids.forEach(id => communityStorage.comments.deleteByPost(id));
          
          setTimeout(() => eventManager.notifyPostListeners(), 0);
        }

        return deletedCount;
      } catch (error) {
        console.error('❌ 게시글 일괄 삭제 오류:', error);
        return 0;
      }
    }
  },

  // 댓글 관련 기능들
  comments: {
    // 모든 댓글 가져오기
    getAll(): Comment[] {
      const comments = storage.get<Comment[]>('COMMUNITY_COMMENTS') || [];
      return comments;
    },

    // 게시글별 댓글 조회
    getByPost(postId: string): Comment[] {
      const comments = this.getAll();
      return comments
        .filter(c => c.postId === postId)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },

    // 댓글 저장
    save(commentData: Omit<Comment, 'id' | 'date'> & { id?: string }): Comment {
      try {
        const comments = this.getAll();
        const now = new Date().toISOString();
        
        const newComment: Comment = {
          ...commentData,
          id: commentData.id || this.generateId(),
          date: commentData.id ? comments.find(c => c.id === commentData.id)?.date || now : now
        };

        const existingIndex = comments.findIndex(c => c.id === newComment.id);
        
        if (existingIndex >= 0) {
          comments[existingIndex] = newComment;
          console.log('✅ 댓글 업데이트');
        } else {
          comments.push(newComment);
          console.log('🆕 새 댓글 추가');
          
          // 게시글 댓글 수 증가
          communityStorage.posts.updateCommentCount(newComment.postId, true);
        }

        storage.set('COMMUNITY_COMMENTS', comments);
        setTimeout(() => eventManager.notifyCommentListeners(), 0);
        
        return newComment;
      } catch (error) {
        console.error('❌ 댓글 저장 오류:', error);
        throw new Error('댓글 저장에 실패했습니다.');
      }
    },

    // ID 생성 함수
    generateId(): string {
      return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // 댓글 삭제
    delete(id: string): boolean {
      try {
        const comments = this.getAll();
        const comment = comments.find(c => c.id === id);
        
        if (!comment) {
          console.warn(`⚠️ 삭제할 댓글을 찾을 수 없습니다 (ID: ${id})`);
          return false;
        }

        const filteredComments = comments.filter(c => c.id !== id);
        storage.set('COMMUNITY_COMMENTS', filteredComments);
        
        // 게시글 댓글 수 감소
        communityStorage.posts.updateCommentCount(comment.postId, false);
        
        console.log(`🗑️ 댓글 삭제 완료 (ID: ${id})`);
        setTimeout(() => eventManager.notifyCommentListeners(), 0);
        
        return true;
      } catch (error) {
        console.error('❌ 댓글 삭제 오류:', error);
        return false;
      }
    },

    // 게시글의 모든 댓글 삭제
    deleteByPost(postId: string): number {
      try {
        const comments = this.getAll();
        const initialLength = comments.length;
        const filteredComments = comments.filter(c => c.postId !== postId);
        const deletedCount = initialLength - filteredComments.length;

        if (deletedCount > 0) {
          storage.set('COMMUNITY_COMMENTS', filteredComments);
          console.log(`🗑️ 게시글 관련 댓글 ${deletedCount}개 삭제 완료`);
          setTimeout(() => eventManager.notifyCommentListeners(), 0);
        }

        return deletedCount;
      } catch (error) {
        console.error('❌ 게시글 댓글 삭제 오류:', error);
        return 0;
      }
    }
  },

  // 커뮤니티 관련 기능들
  communities: {
    // 모든 커뮤니티 가져오기
    getAll(): Community[] {
      const communities = storage.get<Community[]>('COMMUNITIES') || [];
      return communities;
    },

    // ID로 커뮤니티 조회
    getById(id: string): Community | undefined {
      const communities = this.getAll();
      return communities.find(c => c.id === id);
    },

    // 커뮤니티 저장
    save(communityData: Omit<Community, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Community {
      try {
        const communities = this.getAll();
        const now = new Date().toISOString();
        
        const newCommunity: Community = {
          ...communityData,
          id: communityData.id || this.generateId(),
          createdAt: communityData.id ? communities.find(c => c.id === communityData.id)?.createdAt || now : now,
          updatedAt: now
        };

        const existingIndex = communities.findIndex(c => c.id === newCommunity.id);
        
        if (existingIndex >= 0) {
          newCommunity.createdAt = communities[existingIndex].createdAt;
          communities[existingIndex] = newCommunity;
          console.log('✅ 커뮤니티 업데이트:', newCommunity.name);
        } else {
          communities.push(newCommunity);
          console.log('🆕 새 커뮤니티 추가:', newCommunity.name);
        }

        storage.set('COMMUNITIES', communities);
        setTimeout(() => eventManager.notifyCommunityListeners(), 0);
        
        return newCommunity;
      } catch (error) {
        console.error('❌ 커뮤니티 저장 오류:', error);
        throw new Error('커뮤니티 저장에 실패했습니다.');
      }
    },

    // ID 생성 함수
    generateId(): string {
      return `community_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    // 커뮤니티 삭제
    delete(id: string): boolean {
      try {
        const communities = this.getAll();
        const filteredCommunities = communities.filter(c => c.id !== id);
        
        if (filteredCommunities.length === communities.length) {
          console.warn(`⚠️ 삭제할 커뮤니티를 찾을 수 없습니다 (ID: ${id})`);
          return false;
        }

        storage.set('COMMUNITIES', filteredCommunities);
        console.log(`🗑️ 커뮤니티 삭제 완료 (ID: ${id})`);
        
        setTimeout(() => eventManager.notifyCommunityListeners(), 0);
        
        return true;
      } catch (error) {
        console.error('❌ 커뮤니티 삭제 오류:', error);
        return false;
      }
    }
  },

  // 채널 관리 (상수 데이터이지만 확장 가능하도록)
  channels: {
    getAll(): Channel[] {
      const channels = storage.get<Channel[]>('CHANNELS') || [
        { 
          id: 'general', 
          name: '자유게시판', 
          description: '자유로운 소통 공간', 
          icon: '💬', 
          color: '#6366f1',
          communityId: 'default'
        },
        { 
          id: 'question', 
          name: '질문게시판', 
          description: '궁금한 것들을 물어보세요', 
          icon: '❓', 
          color: '#10b981',
          communityId: 'default'
        },
        { 
          id: 'info', 
          name: '정보공유', 
          description: '유용한 정보를 나눠요', 
          icon: '📚', 
          color: '#f59e0b',
          communityId: 'default'
        },
        { 
          id: 'review', 
          name: '후기게시판', 
          description: '경험담과 후기를 공유', 
          icon: '⭐', 
          color: '#ef4444',
          communityId: 'default'
        }
      ];
      return channels;
    },

    getById(id: string): Channel | undefined {
      return this.getAll().find(c => c.id === id);
    }
  },

  // 통계 및 분석
  getStats(): CommunityStats {
    const posts = this.posts.getAll();
    const comments = this.comments.getAll();
    const channels = this.channels.getAll();
    const communities = this.communities.getAll();
    
    // 인기 태그 계산
    const popularTags: Record<string, number> = {};
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        popularTags[tag] = (popularTags[tag] || 0) + 1;
      });
    });
    
    // 활성 사용자 (최근 7일 내 활동)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const activeUsers = new Set<string>();
    
    posts.forEach(post => {
      if (new Date(post.date) >= weekAgo) {
        activeUsers.add(post.author);
      }
    });
    
    comments.forEach(comment => {
      if (new Date(comment.date) >= weekAgo) {
        activeUsers.add(comment.author);
      }
    });
    
    // 오늘 게시글 수
    const today = new Date().toDateString();
    const todayPosts = posts.filter(post => 
      new Date(post.date).toDateString() === today
    ).length;
    
    // 주간 성장률 (간단 계산)
    const lastWeekPosts = posts.filter(post => {
      const postDate = new Date(post.date);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      return postDate >= twoWeeksAgo && postDate < weekAgo;
    }).length;
    
    const thisWeekPosts = posts.filter(post => {
      const postDate = new Date(post.date);
      return postDate >= weekAgo;
    }).length;
    
    const weeklyGrowth = lastWeekPosts > 0 ? 
      ((thisWeekPosts - lastWeekPosts) / lastWeekPosts) * 100 : 0;

    return {
      totalPosts: posts.length,
      totalComments: comments.length,
      totalChannels: channels.length,
      totalCommunities: communities.length,
      popularTags,
      activeUsers: Array.from(activeUsers),
      todayPosts,
      weeklyGrowth
    };
  },

  // 고급 검색 및 필터링
  advanced: {
    // 트렌딩 게시글 (최근 활동 기준)
    getTrending(hours: number = 24): Post[] {
      const posts = communityStorage.posts.getAll();
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hours);
      
      return posts
        .filter(post => new Date(post.date) >= cutoffTime)
        .sort((a, b) => {
          // 트렌딩 점수: 좋아요 + 댓글*2 + 조회수*0.1
          const scoreA = (a.likes || 0) + (a.comments || 0) * 2 + (a.viewCount || 0) * 0.1;
          const scoreB = (b.likes || 0) + (b.comments || 0) * 2 + (b.viewCount || 0) * 0.1;
          return scoreB - scoreA;
        })
        .slice(0, 10);
    },

    // 사용자별 활동 분석
    getUserActivity(author: string): {
      posts: Post[];
      comments: Comment[];
      totalLikes: number;
      totalComments: number;
      averageRating: number;
    } {
      const posts = communityStorage.posts.getAll().filter(p => p.author === author);
      const comments = communityStorage.comments.getAll().filter(c => c.author === author);
      
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
      const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
      
      // 간단한 평점 계산 (좋아요 기준)
      const averageRating = posts.length > 0 ? totalLikes / posts.length : 0;
      
      return {
        posts,
        comments,
        totalLikes,
        totalComments,
        averageRating
      };
    },

    // 태그 분석
    getTagAnalytics(): Array<{
      tag: string;
      count: number;
      posts: Post[];
      popularity: number;
    }> {
      const posts = communityStorage.posts.getAll();
      const tagMap = new Map<string, Post[]>();
      
      posts.forEach(post => {
        post.tags?.forEach(tag => {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, []);
          }
          tagMap.get(tag)!.push(post);
        });
      });
      
      return Array.from(tagMap.entries())
        .map(([tag, tagPosts]) => ({
          tag,
          count: tagPosts.length,
          posts: tagPosts,
          popularity: tagPosts.reduce((sum, post) => 
            sum + (post.likes || 0) + (post.comments || 0), 0
          )
        }))
        .sort((a, b) => b.popularity - a.popularity);
    },

    // 채널별 활동 분석
    getChannelAnalytics(): Array<{
      channel: Channel;
      postCount: number;
      commentCount: number;
      totalLikes: number;
      averageEngagement: number;
    }> {
      const channels = communityStorage.channels.getAll();
      const posts = communityStorage.posts.getAll();
      const comments = communityStorage.comments.getAll();
      
      return channels.map(channel => {
        const channelPosts = posts.filter(p => p.channelId === channel.id);
        const channelComments = comments.filter(c => {
          const post = posts.find(p => p.id === c.postId);
          return post?.channelId === channel.id;
        });
        
        const totalLikes = channelPosts.reduce((sum, post) => sum + (post.likes || 0), 0);
        const totalViews = channelPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
        const averageEngagement = channelPosts.length > 0 ? 
          (totalLikes + channelComments.length) / channelPosts.length : 0;
        
        return {
          channel,
          postCount: channelPosts.length,
          commentCount: channelComments.length,
          totalLikes,
          averageEngagement
        };
      });
    }
  },

  // 유틸리티 함수들
  utils: {
    // 데이터 무결성 검사
    validateData(): {
      isValid: boolean;
      issues: string[];
      fixedCount: number;
    } {
      const issues: string[] = [];
      let fixedCount = 0;
      
      try {
        // 게시글 검증
        const posts = communityStorage.posts.getAll();
        const validPosts = posts.filter(post => {
          if (!post.id || !post.title || !post.author) {
            issues.push(`잘못된 게시글 데이터: ${post.id || 'ID 없음'}`);
            return false;
          }
          return true;
        });
        
        if (validPosts.length !== posts.length) {
          storage.set('COMMUNITY_POSTS', validPosts);
          fixedCount += posts.length - validPosts.length;
        }
        
        // 댓글 검증
        const comments = communityStorage.comments.getAll();
        const validComments = comments.filter(comment => {
          if (!comment.id || !comment.postId || !comment.author) {
            issues.push(`잘못된 댓글 데이터: ${comment.id || 'ID 없음'}`);
            return false;
          }
          
          // 연결된 게시글이 존재하는지 확인
          const postExists = validPosts.some(p => p.id === comment.postId);
          if (!postExists) {
            issues.push(`연결된 게시글이 없는 댓글: ${comment.id}`);
            return false;
          }
          
          return true;
        });
        
        if (validComments.length !== comments.length) {
          storage.set('COMMUNITY_COMMENTS', validComments);
          fixedCount += comments.length - validComments.length;
        }
        
        console.log(`🔍 데이터 검증 완료: ${issues.length}개 이슈, ${fixedCount}개 수정`);
        
        return {
          isValid: issues.length === 0,
          issues,
          fixedCount
        };
      } catch (error) {
        console.error('❌ 데이터 검증 오류:', error);
        return {
          isValid: false,
          issues: ['데이터 검증 중 오류 발생'],
          fixedCount: 0
        };
      }
    },

    // 스토리지 사용량 분석
    getStorageUsage(): {
      posts: { count: number; size: number };
      comments: { count: number; size: number };
      communities: { count: number; size: number };
      total: { count: number; size: number };
    } {
      try {
        const posts = communityStorage.posts.getAll();
        const comments = communityStorage.comments.getAll();
        const communities = communityStorage.communities.getAll();
        
        const postsSize = JSON.stringify(posts).length;
        const commentsSize = JSON.stringify(comments).length;
        const communitiesSize = JSON.stringify(communities).length;
        
        return {
          posts: { count: posts.length, size: postsSize },
          comments: { count: comments.length, size: commentsSize },
          communities: { count: communities.length, size: communitiesSize },
          total: { 
            count: posts.length + comments.length + communities.length,
            size: postsSize + commentsSize + communitiesSize
          }
        };
      } catch (error) {
        console.error('❌ 스토리지 사용량 분석 오류:', error);
        return {
          posts: { count: 0, size: 0 },
          comments: { count: 0, size: 0 },
          communities: { count: 0, size: 0 },
          total: { count: 0, size: 0 }
        };
      }
    },

    // 데이터 압축 (큰 데이터 최적화)
    compressData(): boolean {
      try {
        // 오래된 데이터 정리 (6개월 이상)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const posts = communityStorage.posts.getAll();
        const recentPosts = posts.filter(post => 
          new Date(post.date) >= sixMonthsAgo || 
          post.isNotice || 
          (post.likes && post.likes >= 10)
        );
        
        const comments = communityStorage.comments.getAll();
        const recentPostIds = new Set(recentPosts.map(p => p.id));
        const recentComments = comments.filter(comment => 
          recentPostIds.has(comment.postId)
        );
        
        const removedPosts = posts.length - recentPosts.length;
        const removedComments = comments.length - recentComments.length;
        
        if (removedPosts > 0 || removedComments > 0) {
          storage.set('COMMUNITY_POSTS', recentPosts);
          storage.set('COMMUNITY_COMMENTS', recentComments);
          
          console.log(`🗜️ 데이터 압축 완료: 게시글 ${removedPosts}개, 댓글 ${removedComments}개 제거`);
          
          setTimeout(() => {
            eventManager.notifyPostListeners();
            eventManager.notifyCommentListeners();
          }, 0);
        }
        
        return true;
      } catch (error) {
        console.error('❌ 데이터 압축 오류:', error);
        return false;
      }
    }
  },

  // 데이터 초기화
  clear(): void {
    try {
      storage.set('COMMUNITY_POSTS', []);
      storage.set('COMMUNITY_COMMENTS', []);
      storage.set('COMMUNITIES', []);
      console.log('🧹 커뮤니티 스토리지 초기화 완료');
      
      setTimeout(() => {
        eventManager.notifyPostListeners();
        eventManager.notifyCommentListeners();
        eventManager.notifyCommunityListeners();
      }, 0);
    } catch (error) {
      console.error('❌ 커뮤니티 스토리지 초기화 오류:', error);
    }
  },

  // 데이터 내보내기 (백업용)
  exportData(): string {
    try {
      const posts = this.posts.getAll();
      const comments = this.comments.getAll();
      const communities = this.communities.getAll();
      
      const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        data: {
          posts,
          comments,
          communities
        },
        stats: this.getStats()
      };
      
      console.log('📤 커뮤니티 데이터 내보내기 완료');
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('❌ 데이터 내보내기 오류:', error);
      throw new Error('데이터 내보내기에 실패했습니다.');
    }
  },

  // 데이터 가져오기 (복원용)
  importData(jsonData: string): boolean {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.data) {
        throw new Error('잘못된 데이터 형식입니다.');
      }

      const { posts = [], comments = [], communities = [] } = importData.data;
      
      // 데이터 검증 및 저장
      if (Array.isArray(posts)) {
        const validatedPosts = posts.map((post: any) => 
          this.posts.normalizePostData(post)
        );
        storage.set('COMMUNITY_POSTS', validatedPosts);
        console.log(`📥 게시글 가져오기 완료: ${validatedPosts.length}개`);
      }
      
      if (Array.isArray(comments)) {
        storage.set('COMMUNITY_COMMENTS', comments);
        console.log(`📥 댓글 가져오기 완료: ${comments.length}개`);
      }
      
      if (Array.isArray(communities)) {
        storage.set('COMMUNITIES', communities);
        console.log(`📥 커뮤니티 가져오기 완료: ${communities.length}개`);
      }
      
      // 이벤트 발생
      setTimeout(() => {
        eventManager.notifyPostListeners();
        eventManager.notifyCommentListeners();
        eventManager.notifyCommunityListeners();
      }, 0);
      
      return true;
    } catch (error) {
      console.error('❌ 데이터 가져오기 오류:', error);
      return false;
    }
  },

  // 데이터 동기화 (향후 서버 연동 시 사용)
  sync: {
    // 로컬 → 서버 업로드
    async uploadToServer(): Promise<boolean> {
      try {
        // TODO: 실제 API 호출 구현
        const data = communityStorage.exportData();
        console.log('☁️ 서버 업로드 준비 완료 (구현 예정)');
        return true;
      } catch (error) {
        console.error('❌ 서버 업로드 오류:', error);
        return false;
      }
    },

    // 서버 → 로컬 다운로드
    async downloadFromServer(): Promise<boolean> {
      try {
        // TODO: 실제 API 호출 구현
        console.log('☁️ 서버 다운로드 준비 완료 (구현 예정)');
        return true;
      } catch (error) {
        console.error('❌ 서버 다운로드 오류:', error);
        return false;
      }
    },

    // 충돌 해결 (로컬 vs 서버)
    async resolveConflicts(): Promise<boolean> {
      try {
        // TODO: 충돌 해결 로직 구현
        console.log('🔄 데이터 충돌 해결 준비 완료 (구현 예정)');
        return true;
      } catch (error) {
        console.error('❌ 충돌 해결 오류:', error);
        return false;
      }
    }
  }
};

// 개발 환경에서 디버깅용 전역 객체 노출
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).communityStorage = communityStorage;
  console.log('🔧 개발 모드: window.communityStorage 사용 가능');
  console.log('💡 사용 예시:');
  console.log('  - communityStorage.posts.getAll()');
  console.log('  - communityStorage.getStats()');
  console.log('  - communityStorage.advanced.getTrending()');
  console.log('  - communityStorage.utils.validateData()');
}

// 초기화 시 데이터 검증 실행
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const validation = communityStorage.utils.validateData();
    if (!validation.isValid) {
      console.warn('⚠️ 커뮤니티 데이터 무결성 문제 발견:', validation.issues);
    }
  }, 1000);
}