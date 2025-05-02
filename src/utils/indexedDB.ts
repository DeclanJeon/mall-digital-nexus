// utils/indexedDB.ts

export const DB_NAME = 'peer_space_db';
export const DB_VERSION = 2;

export const STORES = {
  PEER_SPACES: 'peer_spaces',
  CONTENTS: 'contents',
  FORUMS: 'forums',
  POSTS: 'posts',
  COMMENTS: 'comments',
  USERS: 'users',
};

export const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.PEER_SPACES)) {
        const peerSpaceStore = db.createObjectStore(STORES.PEER_SPACES, { keyPath: 'id' });
        peerSpaceStore.createIndex('by_owner', 'owner', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.CONTENTS)) {
        const contentStore = db.createObjectStore(STORES.CONTENTS, { keyPath: 'id' });
        contentStore.createIndex('by_peerSpace', 'peerSpaceAddress', { unique: false });
        contentStore.createIndex('by_type', 'type', { unique: false });
        contentStore.createIndex('by_tags', 'tags', { unique: false, multiEntry: true });
      }
      
      // Create forum-related stores
      if (!db.objectStoreNames.contains(STORES.FORUMS)) {
        const forumStore = db.createObjectStore(STORES.FORUMS, { keyPath: 'id' });
        forumStore.createIndex('by_planet', 'planetId', { unique: false });
        forumStore.createIndex('by_channel', 'channelId', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.POSTS)) {
        const postStore = db.createObjectStore(STORES.POSTS, { keyPath: 'id' });
        postStore.createIndex('by_forum', 'forumId', { unique: false });
        postStore.createIndex('by_author', 'authorId', { unique: false });
        postStore.createIndex('by_date', 'createdAt', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.COMMENTS)) {
        const commentStore = db.createObjectStore(STORES.COMMENTS, { keyPath: 'id' });
        commentStore.createIndex('by_post', 'postId', { unique: false });
        commentStore.createIndex('by_author', 'authorId', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        db.createObjectStore(STORES.USERS, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const getPeerSpaceContentsFromDB = async (address: string): Promise<any[]> => {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORES.CONTENTS, 'readonly');
    const store = transaction.objectStore(STORES.CONTENTS);
    const index = store.index('by_peerSpace'); // Ensure this index exists
    const request = index.getAll(address);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};
