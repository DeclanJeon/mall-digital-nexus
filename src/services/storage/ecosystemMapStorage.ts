import { storage } from '@/utils/storage/storage';

export interface MapNode {
  id: string;
  // 추가 필드들
  [key: string]: any;
}

export const ecosystemMapStorage = {
  getNodes(): MapNode[] {
    return storage.get<MapNode[]>('ECOSYSTEM_MAP') || [];
  },

  saveNodes(nodes: MapNode[]): void {
    storage.set('ECOSYSTEM_MAP', nodes);
  }
};
