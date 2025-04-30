// services/contentService.ts

import {
  add,
  get,
  getAll,
  update,
  remove,
  getByIndex,
} from '../utils/indexedDBService';
import { STORES } from '../utils/indexedDB';
import { v4 as uuidv4 } from 'uuid';
import { Content, ContentType } from '../components/peer-space/types';

// 콘텐츠 생성
export const createContent = async (
  content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const now = new Date().toISOString();

  const id = `content-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  const newContent: Content = {
    ...content,
    id: id,
    likes: content.likes || 0,
    comments: content.comments || 0,
    views: content.views || 0,
    saves: content.saves || 0,
    tags: content.tags || [],
    createdAt: now,
    updatedAt: now,
  };

  await add<Content>(STORES.CONTENTS, newContent);
  return newContent.id;
};

// 콘텐츠 조회
export const getContent = async (id: string): Promise<Content | undefined> => {
  return await get<Content>(STORES.CONTENTS, id);
};

// 피어스페이스의 모든 콘텐츠 조회
export const getPeerSpaceContents = async (
  peerSpaceAddress: string
): Promise<Content[]> => {
  return await getByIndex<Content>(
    STORES.CONTENTS,
    'by_peerSpace',
    peerSpaceAddress
  );
};

// 특정 유형의 콘텐츠 조회
export const getContentsByType = async (
  peerSpaceAddress: string,
  type: string
): Promise<Content[]> => {
  const allContents = await getPeerSpaceContents(peerSpaceAddress);
  return allContents.filter((content) => content.type === type);
};

// 콘텐츠 업데이트
export const updateContent = async (
  id: string,
  updates: Partial<Content>
): Promise<boolean> => {
  const content = await getContent(id);

  if (!content) {
    return false;
  }

  const updatedContent: Content = {
    ...content,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await update<Content>(STORES.CONTENTS, updatedContent);
  return true;
};

// 콘텐츠 삭제
export const deleteContent = async (id: string): Promise<boolean> => {
  try {
    await remove(STORES.CONTENTS, id);
    return true;
  } catch (error) {
    console.error('콘텐츠 삭제 오류:', error);
    return false;
  }
};

// 콘텐츠 좋아요 증가
export const incrementContentLikes = async (id: string): Promise<boolean> => {
  const content = await getContent(id);

  if (!content) {
    return false;
  }

  const updatedContent: Content = {
    ...content,
    likes: content.likes + 1,
    updatedAt: new Date().toISOString(),
  };

  await update<Content>(STORES.CONTENTS, updatedContent);
  return true;
};

// 콘텐츠 조회수 증가
export const incrementContentViews = async (id: string): Promise<boolean> => {
  const content = await getContent(id);

  if (!content) {
    return false;
  }

  const updatedContent: Content = {
    ...content,
    views: content.views + 1,
    updatedAt: new Date().toISOString(),
  };

  // services/contentService.ts (계속)

  await update<Content>(STORES.CONTENTS, updatedContent);
  return true;
};

// 콘텐츠 저장수 증가
export const incrementContentSaves = async (id: string): Promise<boolean> => {
  const content = await getContent(id);

  if (!content) {
    return false;
  }

  const updatedContent: Content = {
    ...content,
    saves: content.saves + 1,
    updatedAt: new Date().toISOString(),
  };

  await update<Content>(STORES.CONTENTS, updatedContent);
  return true;
};

// 태그로 콘텐츠 검색
export const searchContentsByTag = async (tag: string): Promise<Content[]> => {
  return await getByIndex<Content>(STORES.CONTENTS, 'by_tags', tag);
};

// 콘텐츠 생태계 정보 업데이트
export const updateContentEcosystem = async (
  id: string,
  ecosystem: Content['ecosystem']
): Promise<boolean> => {
  const content = await getContent(id);

  if (!content) {
    return false;
  }

  const updatedContent: Content = {
    ...content,
    ecosystem: {
      ...content.ecosystem,
      ...ecosystem,
    },
    updatedAt: new Date().toISOString(),
  };

  await update<Content>(STORES.CONTENTS, updatedContent);
  return true;
};
