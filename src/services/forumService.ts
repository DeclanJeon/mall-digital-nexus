
import { 
  Layers, 
  Users, 
  Book, 
  Calendar, 
  Star, 
  MessageSquare, 
  Globe,
  Edit, 
  Folder 
} from 'lucide-react';

// Define interfaces for forum data
export interface Post {
  id: string;
  forumId: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  tags?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: Date;
  likesCount: number;
}

export interface Planet {
  id: string;
  name: string;
  icon: any;
  description?: string;
}

export interface Channel {
  id: string;
  planetId: string;
  name: string;
  icon: any;
  description?: string;
  forumId: string;
}

export interface Forum {
  id: string;
  name: string;
  description: string;
  channelId: string;
  planetId: string;
}

// IndexedDB setup
const dbPromise = initializeForumDB();

function initializeForumDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('ForumDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('planets')) {
        db.createObjectStore('planets', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('channels')) {
        db.createObjectStore('channels', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('forums')) {
        db.createObjectStore('forums', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('posts')) {
        const postsStore = db.createObjectStore('posts', { keyPath: 'id' });
        postsStore.createIndex('forumId', 'forumId', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('comments')) {
        const commentsStore = db.createObjectStore('comments', { keyPath: 'id' });
        commentsStore.createIndex('postId', 'postId', { unique: false });
      }
    };
    
    request.onsuccess = () => {
      const db = request.result;
      initializeDefaultData(db).then(() => resolve(db));
    };
  });
}

// Initial data for the forum
async function initializeDefaultData(db: IDBDatabase) {
  // Planet is replaced with Star icon
  const planets: Planet[] = [
    { id: 'community', name: '커뮤니티', icon: Globe },
    { id: 'peer-space', name: '피어스페이스', icon: Star },
    { id: 'events', name: '이벤트', icon: Calendar },
    { id: 'guilds', name: '길드', icon: Users },
  ];
  
  const channels: Channel[] = [
    { id: 'general', planetId: 'community', name: '일반 토론', icon: MessageSquare, forumId: 'community-general' },
    { id: 'suggestions', planetId: 'community', name: '제안 및 피드백', icon: Edit, forumId: 'community-suggestions' },
    { id: 'showcase', planetId: 'peer-space', name: '피어스페이스 쇼케이스', icon: Layers, forumId: 'peer-space-showcase' },
    { id: 'help', planetId: 'peer-space', name: '피어스페이스 도움말', icon: Book, forumId: 'peer-space-help' },
    { id: 'upcoming', planetId: 'events', name: '다가오는 이벤트', icon: Calendar, forumId: 'events-upcoming' },
    { id: 'past', planetId: 'events', name: '지난 이벤트', icon: Folder, forumId: 'events-past' },
    { id: 'recruitment', planetId: 'guilds', name: '길드 모집', icon: Users, forumId: 'guilds-recruitment' },
    { id: 'activities', planetId: 'guilds', name: '길드 활동', icon: Layers, forumId: 'guilds-activities' },
  ];
  
  const forums: Forum[] = [
    { id: 'community-general', name: '일반 토론', description: '커뮤니티와 관련된 일반적인 대화', channelId: 'general', planetId: 'community' },
    { id: 'community-suggestions', name: '제안 및 피드백', description: '커뮤니티 개선을 위한 아이디어와 피드백', channelId: 'suggestions', planetId: 'community' },
    { id: 'peer-space-showcase', name: '피어스페이스 쇼케이스', description: '자신의 피어스페이스를 공유하고 보여주세요', channelId: 'showcase', planetId: 'peer-space' },
    { id: 'peer-space-help', name: '피어스페이스 도움말', description: '피어스페이스 관련 질문과 도움말', channelId: 'help', planetId: 'peer-space' },
    { id: 'events-upcoming', name: '다가오는 이벤트', description: '곧 진행될 이벤트 정보', channelId: 'upcoming', planetId: 'events' },
    { id: 'events-past', name: '지난 이벤트', description: '이전에 진행된 이벤트 정보와 후기', channelId: 'past', planetId: 'events' },
    { id: 'guilds-recruitment', name: '길드 모집', description: '새로운 길드원을 모집하는 공간', channelId: 'recruitment', planetId: 'guilds' },
    { id: 'guilds-activities', name: '길드 활동', description: '길드의 활동과 소식을 공유하는 공간', channelId: 'activities', planetId: 'guilds' },
  ];
  
  const samplePosts: Post[] = [
    {
      id: 'post1',
      forumId: 'community-general',
      title: '커뮤니티에 오신 것을 환영합니다!',
      content: '안녕하세요, 새로운 커뮤니티에 오신 것을 환영합니다. 여기서 다양한 주제에 대해 이야기할 수 있어요.',
      author: '관리자',
      createdAt: new Date(),
      likesCount: 5,
      commentsCount: 2,
      tags: ['환영', '소개', '커뮤니티']
    },
    {
      id: 'post2',
      forumId: 'peer-space-showcase',
      title: '제 피어스페이스를 소개합니다!',
      content: '안녕하세요, 제가 만든 피어스페이스를 소개합니다. 많은 피드백 부탁드립니다!',
      author: '피어스페이스 사용자',
      createdAt: new Date(),
      likesCount: 10,
      commentsCount: 3,
      tags: ['피어스페이스', '쇼케이스']
    }
  ];
  
  const sampleComments: Comment[] = [
    {
      id: 'comment1',
      postId: 'post1',
      content: '환영합니다! 좋은 커뮤니티가 될 것 같아요!',
      author: '사용자1',
      createdAt: new Date(),
      likesCount: 2
    },
    {
      id: 'comment2',
      postId: 'post1',
      content: '반갑습니다~ 앞으로 잘 부탁드려요.',
      author: '사용자2',
      createdAt: new Date(),
      likesCount: 1
    }
  ];
  
  // Check if data already exists before initializing
  const planetsExist = await checkIfDataExists(db, 'planets');
  const channelsExist = await checkIfDataExists(db, 'channels');
  const forumsExist = await checkIfDataExists(db, 'forums');
  
  if (!planetsExist) await addItems(db, 'planets', planets);
  if (!channelsExist) await addItems(db, 'channels', channels);
  if (!forumsExist) await addItems(db, 'forums', forums);
  
  // Only add sample posts and comments if posts don't exist yet
  const postsExist = await checkIfDataExists(db, 'posts');
  if (!postsExist) {
    await addItems(db, 'posts', samplePosts);
    await addItems(db, 'comments', sampleComments);
  }
}

async function checkIfDataExists(db: IDBDatabase, storeName: string): Promise<boolean> {
  return new Promise((resolve) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const countRequest = store.count();
    countRequest.onsuccess = () => resolve(countRequest.result > 0);
    countRequest.onerror = () => resolve(false);
  });
}

async function addItems(db: IDBDatabase, storeName: string, items: any[]): Promise<void> {
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);
  
  for (const item of items) {
    store.add(item);
  }
  
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// CRUD operations for posts
export const forumService = {
  // Planet methods
  async getPlanets(): Promise<Planet[]> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('planets', 'readonly');
      const store = transaction.objectStore('planets');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  // Channel methods
  async getChannels(planetId?: string): Promise<Channel[]> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('channels', 'readonly');
      const store = transaction.objectStore('channels');
      const request = store.getAll();
      
      request.onsuccess = () => {
        let channels = request.result;
        if (planetId) {
          channels = channels.filter((channel: Channel) => channel.planetId === planetId);
        }
        resolve(channels);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  // Forum methods
  async getForum(forumId: string): Promise<Forum | undefined> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('forums', 'readonly');
      const store = transaction.objectStore('forums');
      const request = store.get(forumId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  // Post methods
  async getPosts(forumId: string): Promise<Post[]> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('posts', 'readonly');
      const store = transaction.objectStore('posts');
      const index = store.index('forumId');
      const request = index.getAll(forumId);
      
      request.onsuccess = () => {
        // Sort posts by createdAt in descending order (newest first)
        const posts = request.result.sort((a: Post, b: Post) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        resolve(posts);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  async getPost(postId: string): Promise<Post | undefined> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('posts', 'readonly');
      const store = transaction.objectStore('posts');
      const request = store.get(postId);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentsCount'>): Promise<Post> {
    const db = await dbPromise;
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      likesCount: 0,
      commentsCount: 0
    };
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('posts', 'readwrite');
      const store = transaction.objectStore('posts');
      const request = store.add(newPost);
      
      request.onsuccess = () => resolve(newPost);
      request.onerror = () => reject(request.error);
    });
  },
  
  async updatePost(postId: string, updates: Partial<Post>): Promise<Post> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('posts', 'readwrite');
      const store = transaction.objectStore('posts');
      const request = store.get(postId);
      
      request.onsuccess = () => {
        const post = request.result;
        if (!post) {
          reject(new Error('Post not found'));
          return;
        }
        
        const updatedPost = { ...post, ...updates };
        const updateRequest = store.put(updatedPost);
        
        updateRequest.onsuccess = () => resolve(updatedPost);
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  },
  
  async deletePost(postId: string): Promise<void> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['posts', 'comments'], 'readwrite');
      const postStore = transaction.objectStore('posts');
      const commentStore = transaction.objectStore('comments');
      const commentIndex = commentStore.index('postId');
      
      // First, delete the post
      const postRequest = postStore.delete(postId);
      
      postRequest.onsuccess = () => {
        // Then, get all comments for the post
        const commentRequest = commentIndex.getAll(postId);
        
        commentRequest.onsuccess = () => {
          // Delete all comments for the post
          const comments = commentRequest.result;
          comments.forEach((comment: Comment) => {
            commentStore.delete(comment.id);
          });
          
          resolve();
        };
        
        commentRequest.onerror = () => reject(commentRequest.error);
      };
      
      postRequest.onerror = () => reject(postRequest.error);
    });
  },
  
  // Comment methods
  async getComments(postId: string): Promise<Comment[]> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('comments', 'readonly');
      const store = transaction.objectStore('comments');
      const index = store.index('postId');
      const request = index.getAll(postId);
      
      request.onsuccess = () => {
        // Sort comments by createdAt
        const comments = request.result.sort((a: Comment, b: Comment) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        resolve(comments);
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'likesCount'>): Promise<Comment> {
    const db = await dbPromise;
    const newComment: Comment = {
      ...comment,
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      likesCount: 0
    };
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['comments', 'posts'], 'readwrite');
      const commentStore = transaction.objectStore('comments');
      const postStore = transaction.objectStore('posts');
      
      // Add the comment
      const commentRequest = commentStore.add(newComment);
      
      commentRequest.onsuccess = () => {
        // Update the post's comment count
        const postRequest = postStore.get(comment.postId);
        
        postRequest.onsuccess = () => {
          const post = postRequest.result;
          if (!post) {
            reject(new Error('Post not found'));
            return;
          }
          
          post.commentsCount = (post.commentsCount || 0) + 1;
          const updateRequest = postStore.put(post);
          
          updateRequest.onsuccess = () => resolve(newComment);
          updateRequest.onerror = () => reject(updateRequest.error);
        };
        
        postRequest.onerror = () => reject(postRequest.error);
      };
      
      commentRequest.onerror = () => reject(commentRequest.error);
    });
  },
  
  async updateComment(commentId: string, updates: Partial<Comment>): Promise<Comment> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('comments', 'readwrite');
      const store = transaction.objectStore('comments');
      const request = store.get(commentId);
      
      request.onsuccess = () => {
        const comment = request.result;
        if (!comment) {
          reject(new Error('Comment not found'));
          return;
        }
        
        const updatedComment = { ...comment, ...updates };
        const updateRequest = store.put(updatedComment);
        
        updateRequest.onsuccess = () => resolve(updatedComment);
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  },
  
  async deleteComment(commentId: string): Promise<void> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['comments', 'posts'], 'readwrite');
      const commentStore = transaction.objectStore('comments');
      const postStore = transaction.objectStore('posts');
      
      // First, get the comment to find its post
      const commentRequest = commentStore.get(commentId);
      
      commentRequest.onsuccess = () => {
        const comment = commentRequest.result;
        if (!comment) {
          reject(new Error('Comment not found'));
          return;
        }
        
        // Delete the comment
        const deleteRequest = commentStore.delete(commentId);
        
        deleteRequest.onsuccess = () => {
          // Update the post's comment count
          const postRequest = postStore.get(comment.postId);
          
          postRequest.onsuccess = () => {
            const post = postRequest.result;
            if (!post) {
              resolve(); // Post might have been deleted
              return;
            }
            
            post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1);
            const updateRequest = postStore.put(post);
            
            updateRequest.onsuccess = () => resolve();
            updateRequest.onerror = () => reject(updateRequest.error);
          };
          
          postRequest.onerror = () => reject(postRequest.error);
        };
        
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };
      
      commentRequest.onerror = () => reject(commentRequest.error);
    });
  },
  
  // Like functionality
  async likePost(postId: string): Promise<Post> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('posts', 'readwrite');
      const store = transaction.objectStore('posts');
      const request = store.get(postId);
      
      request.onsuccess = () => {
        const post = request.result;
        if (!post) {
          reject(new Error('Post not found'));
          return;
        }
        
        post.likesCount = (post.likesCount || 0) + 1;
        const updateRequest = store.put(post);
        
        updateRequest.onsuccess = () => resolve(post);
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  },
  
  async likeComment(commentId: string): Promise<Comment> {
    const db = await dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('comments', 'readwrite');
      const store = transaction.objectStore('comments');
      const request = store.get(commentId);
      
      request.onsuccess = () => {
        const comment = request.result;
        if (!comment) {
          reject(new Error('Comment not found'));
          return;
        }
        
        comment.likesCount = (comment.likesCount || 0) + 1;
        const updateRequest = store.put(comment);
        
        updateRequest.onsuccess = () => resolve(comment);
        updateRequest.onerror = () => reject(updateRequest.error);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
};

export default forumService;
