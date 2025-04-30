import { Content } from '@/components/peer-space/types';
import {
  createContent,
  updateContent,
  deleteContent,
} from '@/services/contentService';
import { STORES, getDB, getPeerSpaceContentsFromDB } from '@/utils/indexedDB';

/**
 * Get all content items for a peer space from IndexedDB
 */
export const getPeerSpaceContents = async (
  address: string
): Promise<Content[]> => {
  try {
    return await getPeerSpaceContentsFromDB(address);
  } catch (error) {
    console.error('Failed to load peer space contents from IndexedDB:', error);
    return [];
  }
};

/**
 * Save content items to IndexedDB (individual upsert)
 */
export const savePeerSpaceContent = async (
  address: string,
  content: Content
): Promise<void> => {
  try {
    if (content.id) {
      await updateContent(content.id, content);
    } else {
      const { id, ...rest } = content;
      await createContent({
        ...rest,
        peerSpaceAddress: address,
      });
    }
  } catch (error) {
    console.error('Failed to save peer space content to IndexedDB:', error);
  }
};

/**
 * Delete a content item from IndexedDB
 */
export const deletePeerSpaceContent = async (
  address: string,
  contentId: string
): Promise<void> => {
  try {
    await deleteContent(contentId);
  } catch (error) {
    console.error('Failed to delete peer space content from IndexedDB:', error);
  }
};

/**
 * Add a new content item to IndexedDB
 */
export const addPeerSpaceContent = async (
  address: string,
  content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Content> => {
  try {
    const newContentId = await createContent({
      ...content,
      peerSpaceAddress: address,
    });

    // Get the newly created content with proper ID
    const newContent = await getPeerSpaceContentsFromDB(address).then(
      (contents) => contents.find((c) => c.id === newContentId)
    );

    return (
      newContent || {
        ...content,
        id: newContentId,
        peerSpaceAddress: address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error('Failed to add peer space content to IndexedDB:', error);
    throw error;
  }
};
