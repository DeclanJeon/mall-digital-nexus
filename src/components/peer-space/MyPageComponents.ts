// 내 페이지 구성 요소 타입 정의
import { Content, Review, CommunityPost, Event, Quest } from './types';

export interface MyPageSection {
  id: string;
  title: string;
  type: 'content' | 'community' | 'reviews' | 'events' | 'quests';
  items: (Content | Review | CommunityPost | Event | Quest)[];
}

// 내 페이지 구성 요소 인터페이스
export interface MyPageConfig {
  id: string;
  title: string;
  description: string;
  owner: string;
  peerNumber: string;
  profileImage: string;
  coverImage?: string;
  sections: MyPageSection[];
  customizations: {
    primaryColor?: string;
    showChat?: boolean;
    allowComments?: boolean;
    showBadges?: boolean;
    contentDisplayCount?: { [sectionId: string]: number };
  };
}

// 내 페이지 헤더 컴포넌트 props
export interface MyPageHeaderProps {
  mallData: MyPageConfig;
  isOwner: boolean;
  onAddContent: () => void;
  onCustomize: () => void;
}

// 섹션별 렌더링 컴포넌트 props
export interface SectionComponentProps {
  section: MyPageSection;
  onContentClick: (
    content: Content | Review | CommunityPost | Event | Quest
  ) => void;
}

// 내 페이지 컴포넌트
export const MyPageHeader = ({
  mallData,
  isOwner,
  onAddContent,
  onCustomize,
}: MyPageHeaderProps) => {
  // 구현 내용
};

export const DynamicSection = ({
  section,
  onContentClick,
}: SectionComponentProps) => {
  // 구현 내용
};
