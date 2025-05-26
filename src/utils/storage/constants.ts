export const STORAGE_KEYS = {
  PEERMALLS: 'peermall_storage',
  ECOSYSTEM_MAP: 'ecosystem_map_storage',
  USER_PREFERENCES: 'user_preferences_storage'
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
