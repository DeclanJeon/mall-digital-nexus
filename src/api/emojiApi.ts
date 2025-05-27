const API_KEY = 'e9d33312ed7ca0e333708e5848830ffc57675112';
const BASE_URL = 'https://emoji-api.com';

interface Emoji {
  slug: string;
  character: string;
  unicodeName: string;
  codePoint: string;
  group: string;
  subGroup: string;
}

interface EmojiCategory {
  slug: string;
  name: string;
  group: string;
  subGroup: string;
  emojiCount: number;
}

export const fetchEmojiCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/categories?access_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('이모지 카테고리를 불러오는데 실패했습니다.');
    }
    const data: EmojiCategory[] = await response.json();
    // 카테고리 슬러그만 추출하여 반환
    return data.map(category => category.slug);
  } catch (error) {
    console.error('이모지 카테고리 로딩 오류:', error);
    // 기본 카테고리 반환
    return ['smileys-emotion', 'people-body', 'animals-nature', 'food-drink', 'travel-places', 'activities', 'objects', 'symbols', 'flags'];
  }
};

export const fetchEmojisByCategory = async (category: string): Promise<Emoji[]> => {
  try {
    const response = await fetch(`${BASE_URL}/categories/${category}?access_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('이모지를 불러오는데 실패했습니다.');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('이모지 로딩 오류:', error);
    return [];
  }
};

// 인기 있는 이모지 목록 (기본값으로 사용)
export const POPULAR_EMOJIS = [
  '😀', '😊', '❤️', '🔥', '👍', '🎉', '👋', '😎', '🤔', '🎯',
  '✨', '👏', '🙌', '🤗', '😍', '🤩', '🥳', '😇', '🥰', '😘'
];
