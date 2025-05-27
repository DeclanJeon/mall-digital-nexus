// @/utils/storage/constants.ts
export const STORAGE_KEYS = {
  PEERMALLS: 'peermall_storage',
  ECOSYSTEM_MAP: 'ecosystem_map_storage',
  USER_PREFERENCES: 'user_preferences_storage',
  COMMUNITY_POSTS: 'community_posts_storage',
  COMMUNITY_COMMENTS: 'community_comments_storage',
  COMMUNITIES: 'communities_storage',
  CHANNELS: 'channels_storage',
  FAVORITE_PEERMALLS: 'favorite_peermalls_storage'
} as const;

// 실제 스토리지 키 값들의 타입
export type StorageKeyValue = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// 스토리지 키 이름들의 타입
export type StorageKeyName = keyof typeof STORAGE_KEYS;
