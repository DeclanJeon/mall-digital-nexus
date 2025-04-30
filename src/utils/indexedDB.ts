// utils/indexedDB.ts

// 데이터베이스 이름 및 버전
export const DB_NAME = 'PeerMallDB';
export const DB_VERSION = 3; // 버전 업데이트

// 객체 저장소 이름
export const STORES = {
  USERS: 'users',
  PEER_SPACES: 'peerSpaces',
  CONTENTS: 'contents',
  ROOMS: 'rooms',
  POSTS: 'posts',
  COMMENTS: 'comments',
  RECOMMENDATIONS: 'recommendations',
  TRUST_GROUPS: 'trustGroups',
  QUESTS: 'quests',
  BADGES: 'badges',
  USER_BADGES: 'userBadges',
  USER_GAME_STATUS: 'userGameStatus',
  HISTORY: 'history',
  SETTINGS: 'settings',
  TIE_CONNECTIONS: 'tieConnections', // TIE/VI 연결 정보
  ADVERTISEMENTS: 'advertisements', // 광고 정보
  FAMILY_MEMBERSHIPS: 'familyMemberships', // 패밀리 멤버십
  QR_CODES: 'qrCodes', // QR 코드
  ECOSYSTEM_MAPS: 'ecosystemMaps', // 생태계 매핑 정보
  PEER_HUB: 'peerHub', // 외부 링크 메타데이터 (피어허브)
  AD_ANALYTICS: 'adAnalytics', // 광고 성과 분석
  AD_SETTLEMENTS: 'adSettlements', // 광고 정산
  ACCESS_KEYS: 'accessKeys', // 비공개 방 접근 키
};

let dbPromise: Promise<IDBDatabase> | null = null;

// 데이터베이스 초기화 및 열기
export const initDatabase = (): Promise<IDBDatabase> => {
  if (dbPromise) {
    console.log('기존 데이터베이스 연결 재사용');
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;
      const newVersion = event.newVersion || DB_VERSION;

      console.log(`데이터베이스 버전 업데이트: ${oldVersion} -> ${newVersion}`);

      // 버전 마이그레이션 처리
      if (oldVersion < 1) {
        // 초기 스토어 생성 (버전 1에서 필요한 것들)
        console.log('버전 1 스토어 생성');
        createInitialStores(db);
      }

      if (oldVersion < 2) {
        // 버전 2에서 추가된 스토어들
        console.log('버전 2 스토어 생성');
        createVersion2Stores(db);
      }

      if (oldVersion < 3) {
        // 버전 3에서 추가된 스토어들 (SRS 요구사항 반영)
        console.log('버전 3 스토어 생성');
        createVersion3Stores(db);
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log('IndexedDB 열기 성공');
      resolve(db);
    };

    request.onerror = (event) => {
      console.error(
        'IndexedDB 열기 오류:',
        (event.target as IDBOpenDBRequest).error
      );
      reject((event.target as IDBOpenDBRequest).error);
    };

    request.onblocked = () => {
      console.log('IndexedDB 업데이트가 차단됨');
    };
  });

  return dbPromise;
};

// 초기 스토어 생성 (버전 1)
function createInitialStores(db: IDBDatabase) {
  // users - 사용자 정보
  if (!db.objectStoreNames.contains(STORES.USERS)) {
    const usersStore = db.createObjectStore(STORES.USERS, {
      keyPath: 'id',
    });
    usersStore.createIndex('by_email', 'email', { unique: true });
    usersStore.createIndex('by_peerId', 'peerId', { unique: true });
    usersStore.createIndex('by_phoneNumber', 'phoneNumber', {
      unique: true,
    });
    usersStore.createIndex('by_authLevel', 'authLevel', { unique: false });
    usersStore.createIndex('by_createdAt', 'createdAt', { unique: false });
    usersStore.createIndex('by_status', 'status', { unique: false });
  }

  // peerSpaces - 피어몰/피어스페이스 정보
  if (!db.objectStoreNames.contains(STORES.PEER_SPACES)) {
    const peerSpacesStore = db.createObjectStore(STORES.PEER_SPACES, {
      keyPath: 'address',
    });
    peerSpacesStore.createIndex('by_owner', 'ownerPeerId', {
      unique: false,
    });
    peerSpacesStore.createIndex('by_title', 'title', { unique: false });
    peerSpacesStore.createIndex('by_category', 'category', {
      unique: false,
    });
    peerSpacesStore.createIndex('by_createdAt', 'createdAt', {
      unique: false,
    });
    peerSpacesStore.createIndex('by_status', 'status', { unique: false });
    peerSpacesStore.createIndex('by_tags', 'tags', {
      unique: false,
      multiEntry: true,
    });
    peerSpacesStore.createIndex('by_location', 'location', { unique: false });
  }

  // contents - 콘텐츠 및 상품
  if (!db.objectStoreNames.contains(STORES.CONTENTS)) {
    const contentsStore = db.createObjectStore(STORES.CONTENTS, {
      keyPath: 'id',
    });
    contentsStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    contentsStore.createIndex('by_type', 'type', { unique: false });
    contentsStore.createIndex('by_tags', 'tags', {
      unique: false,
      multiEntry: true,
    });
    contentsStore.createIndex('by_date', 'date', { unique: false });
    contentsStore.createIndex('by_status', 'status', { unique: false });
    contentsStore.createIndex('by_price', 'price', { unique: false });
    contentsStore.createIndex('by_category', 'category', { unique: false });
  }
}

// 버전 2 스토어 생성
function createVersion2Stores(db: IDBDatabase) {
  // rooms - 방/그룹 정보
  if (!db.objectStoreNames.contains(STORES.ROOMS)) {
    const roomsStore = db.createObjectStore(STORES.ROOMS, {
      keyPath: 'id',
    });
    roomsStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    roomsStore.createIndex('by_type', 'type', { unique: false });
    roomsStore.createIndex('by_owner', 'ownerId', { unique: false });
    roomsStore.createIndex('by_members', 'members', {
      unique: false,
      multiEntry: true,
    });
    roomsStore.createIndex('by_createdAt', 'createdAt', { unique: false });
    roomsStore.createIndex('by_expiryTime', 'expiryTime', { unique: false });
    roomsStore.createIndex('by_status', 'status', { unique: false });
  }

  // posts - 게시글
  if (!db.objectStoreNames.contains(STORES.POSTS)) {
    const postsStore = db.createObjectStore(STORES.POSTS, {
      keyPath: 'id',
    });
    postsStore.createIndex('by_roomId', 'roomId', { unique: false });
    postsStore.createIndex('by_author', 'authorId', { unique: false });
    postsStore.createIndex('by_createdAt', 'createdAt', { unique: false });
    postsStore.createIndex('by_status', 'status', { unique: false });
    postsStore.createIndex('by_tags', 'tags', {
      unique: false,
      multiEntry: true,
    });
  }

  // comments - 댓글
  if (!db.objectStoreNames.contains(STORES.COMMENTS)) {
    const commentsStore = db.createObjectStore(STORES.COMMENTS, {
      keyPath: 'id',
    });
    commentsStore.createIndex('by_postId', 'postId', { unique: false });
    commentsStore.createIndex('by_author', 'authorId', { unique: false });
    commentsStore.createIndex('by_createdAt', 'createdAt', {
      unique: false,
    });
    commentsStore.createIndex('by_status', 'status', { unique: false });
  }

  // recommendations - 추천인 관계
  if (!db.objectStoreNames.contains(STORES.RECOMMENDATIONS)) {
    const recommendationsStore = db.createObjectStore(STORES.RECOMMENDATIONS, {
      keyPath: 'id',
    });
    recommendationsStore.createIndex('by_userId', 'userId', {
      unique: false,
    });
    recommendationsStore.createIndex('by_recommenderId', 'recommenderId', {
      unique: false,
    });
    recommendationsStore.createIndex('by_status', 'status', {
      unique: false,
    });
    recommendationsStore.createIndex('by_createdAt', 'createdAt', {
      unique: false,
    });
    recommendationsStore.createIndex(
      'user_recommender',
      ['userId', 'recommenderId'],
      { unique: true }
    );
  }

  // trustGroups - 신뢰 그룹 정보
  if (!db.objectStoreNames.contains(STORES.TRUST_GROUPS)) {
    const trustGroupsStore = db.createObjectStore(STORES.TRUST_GROUPS, {
      keyPath: 'userId',
    });
    trustGroupsStore.createIndex('by_level', 'level', { unique: false });
    trustGroupsStore.createIndex('by_memberCount', 'memberCount', {
      unique: false,
    });
    trustGroupsStore.createIndex('by_updatedAt', 'updatedAt', {
      unique: false,
    });
  }

  // history - 사용자 활동 기록
  if (!db.objectStoreNames.contains(STORES.HISTORY)) {
    const historyStore = db.createObjectStore(STORES.HISTORY, {
      keyPath: 'id',
    });
    historyStore.createIndex('by_user', 'userId', { unique: false });
    historyStore.createIndex('by_action', 'action', { unique: false });
    historyStore.createIndex('by_entityType', 'entityType', {
      unique: false,
    });
    historyStore.createIndex('by_entityId', 'entityId', { unique: false });
    historyStore.createIndex('by_timestamp', 'timestamp', {
      unique: false,
    });
    historyStore.createIndex('user_timestamp', ['userId', 'timestamp'], {
      unique: false,
    });
    historyStore.createIndex('user_action', ['userId', 'action'], {
      unique: false,
    });
  }

  // settings - 설정 및 기타 메타데이터
  if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
    db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
  }
}

// 버전 3 스토어 생성 (SRS 요구사항 반영)
function createVersion3Stores(db: IDBDatabase) {
  // quests - 퀘스트/미션
  if (!db.objectStoreNames.contains(STORES.QUESTS)) {
    const questsStore = db.createObjectStore(STORES.QUESTS, {
      keyPath: 'id',
    });
    questsStore.createIndex('by_type', 'type', { unique: false });
    questsStore.createIndex('by_owner', 'ownerId', { unique: false });
    questsStore.createIndex('by_status', 'status', { unique: false });
    questsStore.createIndex('by_startDate', 'startDate', { unique: false });
    questsStore.createIndex('by_endDate', 'endDate', { unique: false });
    questsStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    questsStore.createIndex('by_reward', 'rewardType', { unique: false });
    questsStore.createIndex('by_participants', 'participants', {
      unique: false,
      multiEntry: true,
    });
    questsStore.createIndex('by_facilitator', 'facilitatorId', {
      unique: false,
    });
  }

  // badges - 뱃지 정의
  if (!db.objectStoreNames.contains(STORES.BADGES)) {
    const badgesStore = db.createObjectStore(STORES.BADGES, {
      keyPath: 'id',
    });
    badgesStore.createIndex('by_type', 'type', { unique: false });
    badgesStore.createIndex('by_owner', 'ownerId', { unique: false });
    badgesStore.createIndex('by_rarity', 'rarity', { unique: false });
    badgesStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    badgesStore.createIndex('by_category', 'category', { unique: false });
    badgesStore.createIndex('by_createdAt', 'createdAt', { unique: false });
    badgesStore.createIndex('by_issuedCount', 'issuedCount', { unique: false });
  }

  // userBadges - 사용자 획득 뱃지
  if (!db.objectStoreNames.contains(STORES.USER_BADGES)) {
    const userBadgesStore = db.createObjectStore(STORES.USER_BADGES, {
      keyPath: 'id',
    });
    userBadgesStore.createIndex('by_user', 'userId', { unique: false });
    userBadgesStore.createIndex('by_badge', 'badgeId', { unique: false });
    userBadgesStore.createIndex('by_earnedAt', 'earnedAt', { unique: false });
    userBadgesStore.createIndex('by_isDisplayed', 'isDisplayed', {
      unique: false,
    });
    userBadgesStore.createIndex('user_badge', ['userId', 'badgeId'], {
      unique: true,
    });
  }

  // userGameStatus - 사용자 게임화 상태
  if (!db.objectStoreNames.contains(STORES.USER_GAME_STATUS)) {
    const userGameStatusStore = db.createObjectStore(STORES.USER_GAME_STATUS, {
      keyPath: 'userId',
    });
    userGameStatusStore.createIndex('by_level', 'level', { unique: false });
    userGameStatusStore.createIndex('by_experience', 'experience', {
      unique: false,
    });
    userGameStatusStore.createIndex('by_points', 'points', { unique: false });
    userGameStatusStore.createIndex('by_updatedAt', 'updatedAt', {
      unique: false,
    });
  }

  // TIE 연결 정보
  if (!db.objectStoreNames.contains(STORES.TIE_CONNECTIONS)) {
    const tieStore = db.createObjectStore(STORES.TIE_CONNECTIONS, {
      keyPath: 'id',
    });
    tieStore.createIndex('by_participants', 'participants', {
      unique: false,
      multiEntry: true,
    });
    tieStore.createIndex('by_startTime', 'startTime', { unique: false });
    tieStore.createIndex('by_endTime', 'endTime', { unique: false });
    tieStore.createIndex('by_status', 'status', { unique: false });
    tieStore.createIndex('by_type', 'type', { unique: false });
    tieStore.createIndex('by_viEnabled', 'viEnabled', { unique: false });
  }

  // 광고 정보
  if (!db.objectStoreNames.contains(STORES.ADVERTISEMENTS)) {
    const adStore = db.createObjectStore(STORES.ADVERTISEMENTS, {
      keyPath: 'id',
    });
    adStore.createIndex('by_advertiser', 'advertiserId', { unique: false });
    adStore.createIndex('by_type', 'type', { unique: false });
    adStore.createIndex('by_status', 'status', { unique: false });
    adStore.createIndex('by_startDate', 'startDate', { unique: false });
    adStore.createIndex('by_endDate', 'endDate', { unique: false });
    adStore.createIndex('by_targetAudience', 'targetAudience', {
      unique: false,
      multiEntry: true,
    });
    adStore.createIndex('by_placement', 'placement', { unique: false });
    adStore.createIndex('by_budget', 'budget', { unique: false });
    adStore.createIndex('by_peerSpace', 'peerSpaceAddress', { unique: false });
    adStore.createIndex('by_questId', 'questId', { unique: false });
    adStore.createIndex('by_familyMemberId', 'familyMemberId', {
      unique: false,
    });
  }

  // 패밀리 멤버십
  if (!db.objectStoreNames.contains(STORES.FAMILY_MEMBERSHIPS)) {
    const membershipStore = db.createObjectStore(STORES.FAMILY_MEMBERSHIPS, {
      keyPath: 'id',
    });
    membershipStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    membershipStore.createIndex('by_member', 'memberId', { unique: false });
    membershipStore.createIndex('by_role', 'role', { unique: false });
    membershipStore.createIndex('by_status', 'status', { unique: false });
    membershipStore.createIndex('by_level', 'level', { unique: false });
    membershipStore.createIndex('by_startDate', 'startDate', { unique: false });
    membershipStore.createIndex('by_endDate', 'endDate', { unique: false });
    membershipStore.createIndex(
      'peerSpace_member',
      ['peerSpaceAddress', 'memberId'],
      {
        unique: true,
      }
    );
  }

  // QR 코드 관리
  if (!db.objectStoreNames.contains(STORES.QR_CODES)) {
    const qrStore = db.createObjectStore(STORES.QR_CODES, {
      keyPath: 'id',
    });
    qrStore.createIndex('by_creator', 'creatorId', { unique: false });
    qrStore.createIndex('by_type', 'type', { unique: false });
    qrStore.createIndex('by_targetType', 'targetType', { unique: false });
    qrStore.createIndex('by_targetId', 'targetId', { unique: false });
    qrStore.createIndex('by_createdAt', 'createdAt', { unique: false });
    qrStore.createIndex('by_expiryDate', 'expiryDate', { unique: false });
    qrStore.createIndex('by_peerSpace', 'peerSpaceAddress', { unique: false });
    qrStore.createIndex('by_scanCount', 'scanCount', { unique: false });
    qrStore.createIndex('by_status', 'status', { unique: false });
  }

  // 생태계 매핑 정보
  if (!db.objectStoreNames.contains(STORES.ECOSYSTEM_MAPS)) {
    const ecoMapStore = db.createObjectStore(STORES.ECOSYSTEM_MAPS, {
      keyPath: 'id',
    });
    ecoMapStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    ecoMapStore.createIndex('by_contentId', 'contentId', { unique: false });
    ecoMapStore.createIndex('by_entityType', 'entityType', { unique: false });
    ecoMapStore.createIndex('by_relationshipType', 'relationshipType', {
      unique: false,
    });
    ecoMapStore.createIndex('by_createdAt', 'createdAt', { unique: false });
    ecoMapStore.createIndex('by_creatorId', 'creatorId', { unique: false });
    ecoMapStore.createIndex('by_status', 'status', { unique: false });
  }

  // 피어허브 (외부 링크 메타데이터)
  if (!db.objectStoreNames.contains(STORES.PEER_HUB)) {
    const peerHubStore = db.createObjectStore(STORES.PEER_HUB, {
      keyPath: 'id',
    });
    peerHubStore.createIndex('by_owner', 'ownerId', { unique: false });
    peerHubStore.createIndex('by_url', 'url', { unique: false });
    peerHubStore.createIndex('by_type', 'type', { unique: false });
    peerHubStore.createIndex('by_category', 'category', { unique: false });
    peerHubStore.createIndex('by_tags', 'tags', {
      unique: false,
      multiEntry: true,
    });
    peerHubStore.createIndex('by_createdAt', 'createdAt', { unique: false });
    peerHubStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    peerHubStore.createIndex('by_status', 'status', { unique: false });
    peerHubStore.createIndex('by_verificationStatus', 'verificationStatus', {
      unique: false,
    });
  }

  // 광고 성과 분석
  if (!db.objectStoreNames.contains(STORES.AD_ANALYTICS)) {
    const adAnalyticsStore = db.createObjectStore(STORES.AD_ANALYTICS, {
      keyPath: 'id',
    });
    adAnalyticsStore.createIndex('by_adId', 'adId', { unique: false });
    adAnalyticsStore.createIndex('by_date', 'date', { unique: false });
    adAnalyticsStore.createIndex('by_metric', 'metric', { unique: false });
    adAnalyticsStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    adAnalyticsStore.createIndex('by_deviceType', 'deviceType', {
      unique: false,
    });
    adAnalyticsStore.createIndex('by_location', 'location', { unique: false });
    adAnalyticsStore.createIndex('ad_date', ['adId', 'date'], {
      unique: false,
    });
  }

  // 광고 정산
  if (!db.objectStoreNames.contains(STORES.AD_SETTLEMENTS)) {
    const adSettlementStore = db.createObjectStore(STORES.AD_SETTLEMENTS, {
      keyPath: 'id',
    });
    adSettlementStore.createIndex('by_adId', 'adId', { unique: false });
    adSettlementStore.createIndex('by_advertiser', 'advertiserId', {
      unique: false,
    });
    adSettlementStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    });
    adSettlementStore.createIndex('by_familyMember', 'familyMemberId', {
      unique: false,
    });
    adSettlementStore.createIndex('by_amount', 'amount', { unique: false });
    adSettlementStore.createIndex('by_status', 'status', { unique: false });
    adSettlementStore.createIndex('by_settlementDate', 'settlementDate', {
      unique: false,
    });
    adSettlementStore.createIndex('by_period', 'period', { unique: false });
  }

  // 비공개 방 접근 키
  if (!db.objectStoreNames.contains(STORES.ACCESS_KEYS)) {
    const accessKeyStore = db.createObjectStore(STORES.ACCESS_KEYS, {
      keyPath: 'id',
    });
    accessKeyStore.createIndex('by_roomId', 'roomId', { unique: false });
    accessKeyStore.createIndex('by_userId', 'userId', { unique: false });
    accessKeyStore.createIndex('by_key', 'key', { unique: true });
    accessKeyStore.createIndex('by_createdAt', 'createdAt', { unique: false });
    accessKeyStore.createIndex('by_expiryDate', 'expiryDate', {
      unique: false,
    });
    accessKeyStore.createIndex('by_isActive', 'isActive', { unique: false });
    accessKeyStore.createIndex('by_creatorId', 'creatorId', { unique: false });
    accessKeyStore.createIndex('room_user', ['roomId', 'userId'], {
      unique: true,
    });
  }
}

import { Content } from '@/components/peer-space/types';

export const getPeerSpaceContentsFromDB = async (
  address: string
): Promise<Content[]> => {
  const db = await getDB();
  const transaction = db.transaction(STORES.CONTENTS, 'readonly');
  const store = transaction.objectStore(STORES.CONTENTS);
  const index = store.index('by_peerSpace');
  const request = index.getAll(address);
  const contents = await new Promise<Content[]>((resolve, reject) => {
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
    };
  });
  return contents;
};

export const getDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error(
        'IndexedDB 연결 오류:',
        (event.target as IDBOpenDBRequest).error
      );
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

export const addData = async <T>(
  storeName: string,
  data: T
): Promise<IDBValidKey> => {
  const db = await getDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.add(data);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };

    request.onerror = (event) => {
      console.error(
        `${storeName}에 데이터 추가 실패:`,
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

export const updateData = async <T>(
  storeName: string,
  data: T
): Promise<IDBValidKey> => {
  const db = await getDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.put(data);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result);
    };

    request.onerror = (event) => {
      console.error(
        `${storeName}의 데이터 업데이트 실패:`,
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

export const getData = async <T>(
  storeName: string,
  key: IDBValidKey
): Promise<T | undefined> => {
  const db = await getDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.get(key);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as T | undefined);
    };

    request.onerror = (event) => {
      console.error(
        `${storeName}에서 데이터 조회 실패:`,
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

export const getDataByIndex = async <T>(
  storeName: string,
  indexName: string,
  key: IDBValidKey
): Promise<T[]> => {
  const db = await getDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);
  const index = store.index(indexName);

  return new Promise((resolve, reject) => {
    const request = index.getAll(key);

    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as T[]);
    };

    request.onerror = (event) => {
      console.error(
        `${storeName}의 ${indexName} 인덱스에서 데이터 조회 실패:`,
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

export const deleteData = async (
  storeName: string,
  key: IDBValidKey
): Promise<void> => {
  const db = await getDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve, reject) => {
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      console.error(
        `${storeName}에서 데이터 삭제 실패:`,
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};
