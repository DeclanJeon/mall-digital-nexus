import { SectionType } from '../types';

// Save section order to localStorage
export const saveSectionOrder = (address: string, sections: SectionType[]) => {
  try {
    localStorage.setItem(
      `peer_space_${address}_sections`,
      JSON.stringify(sections)
    );
  } catch (error) {
    console.error('Error saving section order:', error);
  }
};

// Get section order from localStorage
export const getSectionOrder = (
  address: string,
  defaultSections: SectionType[]
): SectionType[] => {
  try {
    const stored = localStorage.getItem(`peer_space_${address}_sections`);
    return stored ? JSON.parse(stored) : defaultSections;
  } catch (error) {
    console.error('Error loading section order:', error);
    return defaultSections;
  }
};

export const getSectionDisplayName = (sectionType: SectionType): string => {
  const sectionNames: Record<SectionType, string> = {
    hero: '히어로',
    content: '콘텐츠/상품',
    community: '커뮤니티',
    about: '소개',
    products: '제품',
    services: '서비스',
    events: '이벤트',
    reviews: '리뷰',
    contact: '연락처',
    map: '지도',
    guestbook: '방명록',
    trust: '신뢰도',
    featured: '추천',
    achievements: '성과',
    learning: '학습',
    quests: '퀘스트',
    infoHub: '정보 허브',
    activityFeed: '활동 피드',
    relatedMalls: '관련 피어몰',
    liveCollaboration: '실시간 연결',
    livestream: '라이브 스트림',
  };
  return sectionNames[sectionType] || sectionType;
};
