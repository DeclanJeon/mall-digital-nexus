
import { Content } from "@/components/peer-space/types";

// Key prefix for localStorage
const PEER_SPACE_CONTENT_KEY = "peer_space";

/**
 * Get storage key for specific peer space address
 */
export const getPeerSpaceStorageKey = (address: string): string => {
  return `${PEER_SPACE_CONTENT_KEY}_${address}_contents`;
};

/**
 * Get all content items for a peer space
 */
export const getPeerSpaceContents = (address: string): Content[] => {
  try {
    const storageKey = getPeerSpaceStorageKey(address);
    const storedData = localStorage.getItem(storageKey);
    
    if (!storedData) {
      return [];
    }
    
    return JSON.parse(storedData) as Content[];
  } catch (error) {
    console.error("Failed to load peer space contents:", error);
    return [];
  }
};

/**
 * Save content items for a peer space
 */
export const savePeerSpaceContents = (address: string, contents: Content[]): void => {
  try {
    const storageKey = getPeerSpaceStorageKey(address);
    localStorage.setItem(storageKey, JSON.stringify(contents));
  } catch (error) {
    console.error("Failed to save peer space contents:", error);
  }
};

/**
 * Add a new content item to a peer space
 */
export const addPeerSpaceContent = (address: string, content: Omit<Content, "id">): Content => {
  const contents = getPeerSpaceContents(address);
  
  const newContent: Content = {
    ...content,
    id: `content-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  };
  
  savePeerSpaceContents(address, [...contents, newContent]);
  return newContent;
};

/**
 * Delete a content item from a peer space
 */
export const deletePeerSpaceContent = (address: string, contentId: string): void => {
  const contents = getPeerSpaceContents(address);
  const updatedContents = contents.filter(content => content.id !== contentId);
  savePeerSpaceContents(address, updatedContents);
};
