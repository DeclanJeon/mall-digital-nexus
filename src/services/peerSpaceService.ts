// services/peerSpaceService.ts

import {
  add,
  get,
  getAll,
  update,
  remove,
  getByIndex,
} from '../utils/indexedDBService';
import { STORES } from '../utils/indexedDB';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 라이브러리

// 피어스페이스 타입 정의
export interface PeerSpace {
  address: string; // 피어스페이스 고유 주소
  title: string; // 제목
  description: string; // 설명
  ownerPeerId: string; // 소유자 피어넘버
  owner: string; // 소유자 이름
  coverImage?: string; // 커버 이미지
  logo?: string; // 로고
  category?: string; // 카테고리
  followers: number; // 팔로워 수
  recommendations: number; // 추천 수
  badges: string[]; // 획득한 뱃지
  sections: string[]; // 표시할 섹션
  familyMembership?: string; // 패밀리 멤버십
  location?: {
    // 위치 정보
    lat: number;
    lng: number;
    address: string;
  };
  trustScore?: number; // 신뢰 점수
  recommendationUsers?: string[]; // 추천인 목록
  settings?: {
    // 설정
    hiddenSections: string[];
    sectionOrder: string[];
    theme: string;
    isPublic: boolean;
    // 기타 설정...
  };
  createdAt: string; // 생성 시간
  updatedAt: string; // 최종 수정 시간
}

// 피어스페이스 생성
export const createPeerSpace = async (
  peerSpace: Omit<PeerSpace, 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = new Date().toISOString();

  // 주소가 없으면 자동 생성
  const address = peerSpace.address || `peer-${uuidv4().substring(0, 8)}`;

  const newPeerSpace: PeerSpace = {
    ...peerSpace,
    address,
    followers: peerSpace.followers || 0,
    recommendations: peerSpace.recommendations || 0,
    badges: peerSpace.badges || [],
    sections: peerSpace.sections || [
      'hero',
      'content',
      'community',
      'events',
      'infoHub',
      'trust',
      'relatedMalls',
    ],
    createdAt: now,
    updatedAt: now,
  };

  await add<PeerSpace>(STORES.PEER_SPACES, newPeerSpace);
  return address;
};

// 피어스페이스 조회
export const getPeerSpace = async (
  address: string
): Promise<PeerSpace | undefined> => {
  return await get<PeerSpace>(STORES.PEER_SPACES, address);
};

// 사용자가 소유한 피어스페이스 목록 조회
export const getUserPeerSpaces = async (
  ownerPeerId: string
): Promise<PeerSpace[]> => {
  return await getByIndex<PeerSpace>(
    STORES.PEER_SPACES,
    'by_owner',
    ownerPeerId
  );
};

// 모든 피어스페이스 목록 조회
export const getAllPeerSpaces = async (): Promise<PeerSpace[]> => {
  return await getAll<PeerSpace>(STORES.PEER_SPACES);
};

// 피어스페이스 업데이트
export const updatePeerSpace = async (
  address: string,
  updates: Partial<PeerSpace>
): Promise<boolean> => {
  const peerSpace = await getPeerSpace(address);

  if (!peerSpace) {
    return false;
  }

  const updatedPeerSpace: PeerSpace = {
    ...peerSpace,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await update<PeerSpace>(STORES.PEER_SPACES, updatedPeerSpace);
  return true;
};

// 피어스페이스 삭제
export const deletePeerSpace = async (address: string): Promise<boolean> => {
  try {
    await remove(STORES.PEER_SPACES, address);
    return true;
  } catch (error) {
    console.error('피어스페이스 삭제 오류:', error);
    return false;
  }
};

// 피어스페이스 팔로우
export const followPeerSpace = async (
  address: string,
  userId: string
): Promise<boolean> => {
  const peerSpace = await getPeerSpace(address);

  if (!peerSpace) {
    return false;
  }

  // 팔로워 목록에 추가 (실제로는 별도 테이블에서 관리할 수도 있음)
  const followers = peerSpace.recommendationUsers || [];

  if (!followers.includes(userId)) {
    followers.push(userId);
  }

  const updatedPeerSpace: PeerSpace = {
    ...peerSpace,
    followers: peerSpace.followers + 1,
    recommendationUsers: followers,
    updatedAt: new Date().toISOString(),
  };

  await update<PeerSpace>(STORES.PEER_SPACES, updatedPeerSpace);
  return true;
};

// 피어스페이스 뱃지 추가
export const addBadgeToPeerSpace = async (
  address: string,
  badgeId: string
): Promise<boolean> => {
  const peerSpace = await getPeerSpace(address);

  if (!peerSpace) {
    return false;
  }

  // 이미 있는 뱃지인지 확인
  if (peerSpace.badges.includes(badgeId)) {
    return false;
  }

  const updatedPeerSpace: PeerSpace = {
    ...peerSpace,
    badges: [...peerSpace.badges, badgeId],
    updatedAt: new Date().toISOString(),
  };

  await update<PeerSpace>(STORES.PEER_SPACES, updatedPeerSpace);
  return true;
};

// 피어스페이스 섹션 관리
export const updatePeerSpaceSections = async (
  address: string,
  sections: string[],
  hiddenSections?: string[]
): Promise<boolean> => {
  const peerSpace = await getPeerSpace(address);

  if (!peerSpace) {
    return false;
  }

  const settings = peerSpace.settings || {
    hiddenSections: [],
    sectionOrder: [],
    theme: 'default',
    isPublic: true,
  };

  const updatedPeerSpace: PeerSpace = {
    ...peerSpace,
    sections,
    settings: {
      ...settings,
      hiddenSections: hiddenSections || settings.hiddenSections || [],
      sectionOrder: sections, // 섹션 순서 저장
    },
    updatedAt: new Date().toISOString(),
  };

  await update<PeerSpace>(STORES.PEER_SPACES, updatedPeerSpace);
  return true;
};
