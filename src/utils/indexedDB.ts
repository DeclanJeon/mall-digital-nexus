// utils/indexedDB.ts

// 데이터베이스 이름 및 버전
export const DB_NAME = 'PeerMallDB';
export const DB_VERSION = 5; // 버전 업데이트 (ADDRESS 저장소 추가로 인해 버전이 4 또는 5가 되어야 함)

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
  ADDRESS: 'address', // <<< 추가된 저장소
};

let dbPromise: Promise<IDBDatabase> | null = null;

// 데이터베이스 초기화 및 열기
export const initDatabase = (): Promise<IDBDatabase> => {
  if (dbPromise) {
    console.log('기존 데이터베이스 연결 재사용');
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    // ❗️ 수정: DB_VERSION 사용
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;
      const newVersion = event.newVersion || DB_VERSION;

      console.log(`데이터베이스 버전 업데이트: ${oldVersion} -> ${newVersion}`);

      // 버전 마이그레이션 처리
      if (oldVersion < 1) {
        console.log('버전 1 스토어 생성');
        createInitialStores(db);
      }

      if (oldVersion < 2) {
        console.log('버전 2 스토어 생성');
        createVersion2Stores(db);
      }

      if (oldVersion < 3) {
        console.log('버전 3 스토어 생성');
        createVersion3Stores(db);
      }

      // ❗️ 추가: 버전 4 (또는 5) 마이그레이션 로직
      // DB_VERSION이 5이므로, ADDRESS 저장소는 버전 4에서 추가되었다고 가정합니다.
      // 만약 버전 5에서 추가된 것이라면 if (oldVersion < 5) 로 변경합니다.
      if (oldVersion < 4) {
        console.log('버전 4 스토어 생성 (ADDRESS)');
        createVersion4Stores(db);
      }
      // 만약 ADDRESS가 DB_VERSION 5에 해당하는 변경사항이라면 아래와 같이 합니다.
      // if (oldVersion < 5) {
      //   console.log('버전 5 스토어 생성 (ADDRESS)');
      //   createVersion5Stores(db); // 이 경우 함수 이름도 createVersion5Stores로 변경
      // }
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
      dbPromise = null; // 오류 발생 시 promise 재설정
      reject((event.target as IDBOpenDBRequest).error);
    };

    request.onblocked = () => {
      console.log(
        'IndexedDB 업데이트가 차단됨. 다른 탭에서 DB 연결을 닫아주세요.'
      );
      // dbPromise = null; // 필요에 따라 처리
      // reject(new Error('IndexedDB 업데이트가 차단됨')); // 사용자에게 알릴 수 있도록 reject 처리도 고려
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

  // peerSpaces - 피어몰 정보
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
    // 중복된 인덱스 정의 제거
    // contentsStore.createIndex('by_type', 'type', { unique: false });
    // contentsStore.createIndex('by_tags', 'tags', {
    //   unique: false,
    //   multiEntry: true,
    // });
    // contentsStore.createIndex('by_date', 'date', { unique: false });
    // contentsStore.createIndex('by_status', 'status', { unique: false });
    // contentsStore.createIndex('by_price', 'price', { unique: false });
    // contentsStore.createIndex('by_category', 'category', { unique: false });
    contentsStore.createIndex('by_type', 'type', { unique: false });
    contentsStore.createIndex('by_tags_content', 'tags', {
      // 인덱스 이름 충돌 방지 (혹시 다른 곳에 by_tags가 있다면)
      unique: false,
      multiEntry: true,
    });
    contentsStore.createIndex('by_date', 'date', { unique: false });
    contentsStore.createIndex('by_status_content', 'status', { unique: false }); // 인덱스 이름 충돌 방지
    contentsStore.createIndex('by_price', 'price', { unique: false });
    contentsStore.createIndex('by_category_content', 'category', {
      unique: false,
    }); // 인덱스 이름 충돌 방지
  }
}

// 버전 2 스토어 생성
function createVersion2Stores(db: IDBDatabase) {
  // rooms - 방/그룹 정보
  if (!db.objectStoreNames.contains(STORES.ROOMS)) {
    const roomsStore = db.createObjectStore(STORES.ROOMS, {
      keyPath: 'id',
    });
    roomsStore.createIndex('by_peerSpace_room', 'peerSpaceAddress', {
      // 인덱스 이름 변경 (충돌 방지)
      unique: false,
    });
    roomsStore.createIndex('by_type_room', 'type', { unique: false });
    roomsStore.createIndex('by_owner_room', 'ownerId', { unique: false });
    roomsStore.createIndex('by_members', 'members', {
      unique: false,
      multiEntry: true,
    });
    roomsStore.createIndex('by_createdAt_room', 'createdAt', { unique: false });
    roomsStore.createIndex('by_expiryTime', 'expiryTime', { unique: false });
    roomsStore.createIndex('by_status_room', 'status', { unique: false });
  }

  // posts - 게시글
  if (!db.objectStoreNames.contains(STORES.POSTS)) {
    const postsStore = db.createObjectStore(STORES.POSTS, {
      keyPath: 'id',
    });
    postsStore.createIndex('by_roomId_post', 'roomId', { unique: false }); // 인덱스 이름 변경
    postsStore.createIndex('by_author_post', 'authorId', { unique: false });
    postsStore.createIndex('by_createdAt_post', 'createdAt', { unique: false });
    postsStore.createIndex('by_status_post', 'status', { unique: false });
    postsStore.createIndex('by_tags_post', 'tags', {
      unique: false,
      multiEntry: true,
    });
  }

  // comments - 댓글
  if (!db.objectStoreNames.contains(STORES.COMMENTS)) {
    const commentsStore = db.createObjectStore(STORES.COMMENTS, {
      keyPath: 'id',
    });
    commentsStore.createIndex('by_postId_comment', 'postId', { unique: false }); // 인덱스 이름 변경
    commentsStore.createIndex('by_author_comment', 'authorId', {
      unique: false,
    });
    commentsStore.createIndex('by_createdAt_comment', 'createdAt', {
      unique: false,
    });
    commentsStore.createIndex('by_status_comment', 'status', { unique: false });
  }

  // recommendations - 추천인 관계
  if (!db.objectStoreNames.contains(STORES.RECOMMENDATIONS)) {
    const recommendationsStore = db.createObjectStore(STORES.RECOMMENDATIONS, {
      keyPath: 'id',
    });
    recommendationsStore.createIndex('by_userId_rec', 'userId', {
      // 인덱스 이름 변경
      unique: false,
    });
    recommendationsStore.createIndex('by_recommenderId', 'recommenderId', {
      unique: false,
    });
    recommendationsStore.createIndex('by_status_rec', 'status', {
      // 인덱스 이름 변경
      unique: false,
    });
    recommendationsStore.createIndex('by_createdAt_rec', 'createdAt', {
      // 인덱스 이름 변경
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
    trustGroupsStore.createIndex('by_level_trust', 'level', { unique: false }); // 인덱스 이름 변경
    trustGroupsStore.createIndex('by_memberCount', 'memberCount', {
      unique: false,
    });
    trustGroupsStore.createIndex('by_updatedAt_trust', 'updatedAt', {
      // 인덱스 이름 변경
      unique: false,
    });
  }

  // history - 사용자 활동 기록
  if (!db.objectStoreNames.contains(STORES.HISTORY)) {
    const historyStore = db.createObjectStore(STORES.HISTORY, {
      keyPath: 'id',
    });
    historyStore.createIndex('by_user_history', 'userId', { unique: false }); // 인덱스 이름 변경
    historyStore.createIndex('by_action', 'action', { unique: false });
    historyStore.createIndex('by_entityType_history', 'entityType', {
      // 인덱스 이름 변경
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
    questsStore.createIndex('by_type_quest', 'type', { unique: false }); // 인덱스 이름 변경
    questsStore.createIndex('by_owner_quest', 'ownerId', { unique: false });
    questsStore.createIndex('by_status_quest', 'status', { unique: false });
    questsStore.createIndex('by_startDate_quest', 'startDate', {
      unique: false,
    });
    questsStore.createIndex('by_endDate_quest', 'endDate', { unique: false });
    questsStore.createIndex('by_peerSpace_quest', 'peerSpaceAddress', {
      unique: false,
    });
    questsStore.createIndex('by_reward', 'rewardType', { unique: false });
    questsStore.createIndex('by_participants_quest', 'participants', {
      // 인덱스 이름 변경
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
    badgesStore.createIndex('by_type_badge', 'type', { unique: false });
    badgesStore.createIndex('by_owner_badge', 'ownerId', { unique: false });
    badgesStore.createIndex('by_rarity', 'rarity', { unique: false });
    badgesStore.createIndex('by_peerSpace_badge', 'peerSpaceAddress', {
      unique: false,
    });
    badgesStore.createIndex('by_category_badge', 'category', { unique: false });
    badgesStore.createIndex('by_createdAt_badge', 'createdAt', {
      unique: false,
    });
    badgesStore.createIndex('by_issuedCount', 'issuedCount', { unique: false });
  }

  // userBadges - 사용자 획득 뱃지
  if (!db.objectStoreNames.contains(STORES.USER_BADGES)) {
    const userBadgesStore = db.createObjectStore(STORES.USER_BADGES, {
      keyPath: 'id',
    });
    userBadgesStore.createIndex('by_user_userbadge', 'userId', {
      unique: false,
    });
    userBadgesStore.createIndex('by_badge_userbadge', 'badgeId', {
      unique: false,
    });
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
    userGameStatusStore.createIndex('by_level_gamestatus', 'level', {
      unique: false,
    });
    userGameStatusStore.createIndex('by_experience', 'experience', {
      unique: false,
    });
    userGameStatusStore.createIndex('by_points', 'points', { unique: false });
    userGameStatusStore.createIndex('by_updatedAt_gamestatus', 'updatedAt', {
      unique: false,
    });
  }

  // TIE 연결 정보
  if (!db.objectStoreNames.contains(STORES.TIE_CONNECTIONS)) {
    const tieStore = db.createObjectStore(STORES.TIE_CONNECTIONS, {
      keyPath: 'id',
    });
    tieStore.createIndex('by_participants_tie', 'participants', {
      unique: false,
      multiEntry: true,
    });
    tieStore.createIndex('by_startTime', 'startTime', { unique: false });
    tieStore.createIndex('by_endTime', 'endTime', { unique: false });
    tieStore.createIndex('by_status_tie', 'status', { unique: false });
    tieStore.createIndex('by_type_tie', 'type', { unique: false });
    tieStore.createIndex('by_viEnabled', 'viEnabled', { unique: false });
  }

  // 광고 정보
  if (!db.objectStoreNames.contains(STORES.ADVERTISEMENTS)) {
    const adStore = db.createObjectStore(STORES.ADVERTISEMENTS, {
      keyPath: 'id',
    });
    adStore.createIndex('by_advertiser_ad', 'advertiserId', { unique: false });
    adStore.createIndex('by_type_ad', 'type', { unique: false });
    adStore.createIndex('by_status_ad', 'status', { unique: false });
    adStore.createIndex('by_startDate_ad', 'startDate', { unique: false });
    adStore.createIndex('by_endDate_ad', 'endDate', { unique: false });
    adStore.createIndex('by_targetAudience', 'targetAudience', {
      unique: false,
      multiEntry: true,
    });
    adStore.createIndex('by_placement', 'placement', { unique: false });
    adStore.createIndex('by_budget', 'budget', { unique: false });
    adStore.createIndex('by_peerSpace_ad', 'peerSpaceAddress', {
      unique: false,
    });
    adStore.createIndex('by_questId_ad', 'questId', { unique: false });
    adStore.createIndex('by_familyMemberId_ad', 'familyMemberId', {
      unique: false,
    });
  }

  // 패밀리 멤버십
  if (!db.objectStoreNames.contains(STORES.FAMILY_MEMBERSHIPS)) {
    const membershipStore = db.createObjectStore(STORES.FAMILY_MEMBERSHIPS, {
      keyPath: 'id',
    });
    membershipStore.createIndex('by_peerSpace_membership', 'peerSpaceAddress', {
      unique: false,
    });
    membershipStore.createIndex('by_member', 'memberId', { unique: false });
    membershipStore.createIndex('by_role', 'role', { unique: false });
    membershipStore.createIndex('by_status_membership', 'status', {
      unique: false,
    });
    membershipStore.createIndex('by_level_membership', 'level', {
      unique: false,
    });
    membershipStore.createIndex('by_startDate_membership', 'startDate', {
      unique: false,
    });
    membershipStore.createIndex('by_endDate_membership', 'endDate', {
      unique: false,
    });
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
    qrStore.createIndex('by_creator_qr', 'creatorId', { unique: false });
    qrStore.createIndex('by_type_qr', 'type', { unique: false });
    qrStore.createIndex('by_targetType_qr', 'targetType', { unique: false });
    qrStore.createIndex('by_targetId_qr', 'targetId', { unique: false });
    qrStore.createIndex('by_createdAt_qr', 'createdAt', { unique: false });
    qrStore.createIndex('by_expiryDate_qr', 'expiryDate', { unique: false });
    qrStore.createIndex('by_peerSpace_qr', 'peerSpaceAddress', {
      unique: false,
    });
    qrStore.createIndex('by_scanCount', 'scanCount', { unique: false });
    qrStore.createIndex('by_status_qr', 'status', { unique: false });
  }

  // 생태계 매핑 정보
  if (!db.objectStoreNames.contains(STORES.ECOSYSTEM_MAPS)) {
    const ecoMapStore = db.createObjectStore(STORES.ECOSYSTEM_MAPS, {
      keyPath: 'id',
    });
    ecoMapStore.createIndex('by_peerSpace_ecomap', 'peerSpaceAddress', {
      unique: false,
    });
    ecoMapStore.createIndex('by_contentId_ecomap', 'contentId', {
      unique: false,
    });
    ecoMapStore.createIndex('by_entityType_ecomap', 'entityType', {
      unique: false,
    });
    ecoMapStore.createIndex('by_relationshipType', 'relationshipType', {
      unique: false,
    });
    ecoMapStore.createIndex('by_createdAt_ecomap', 'createdAt', {
      unique: false,
    });
    ecoMapStore.createIndex('by_creatorId_ecomap', 'creatorId', {
      unique: false,
    });
    ecoMapStore.createIndex('by_status_ecomap', 'status', { unique: false });
  }

  // 피어허브 (외부 링크 메타데이터)
  if (!db.objectStoreNames.contains(STORES.PEER_HUB)) {
    const peerHubStore = db.createObjectStore(STORES.PEER_HUB, {
      keyPath: 'id',
    });
    peerHubStore.createIndex('by_owner_peerhub', 'ownerId', { unique: false });
    peerHubStore.createIndex('by_url', 'url', { unique: false }); // Consider { unique: true } if URLs must be unique
    peerHubStore.createIndex('by_type_peerhub', 'type', { unique: false });
    peerHubStore.createIndex('by_category_peerhub', 'category', {
      unique: false,
    });
    peerHubStore.createIndex('by_tags_peerhub', 'tags', {
      unique: false,
      multiEntry: true,
    });
    peerHubStore.createIndex('by_createdAt_peerhub', 'createdAt', {
      unique: false,
    });
    peerHubStore.createIndex('by_peerSpace_peerhub', 'peerSpaceAddress', {
      unique: false,
    });
    peerHubStore.createIndex('by_status_peerhub', 'status', { unique: false });
    peerHubStore.createIndex('by_verificationStatus', 'verificationStatus', {
      unique: false,
    });
  }

  // 광고 성과 분석
  if (!db.objectStoreNames.contains(STORES.AD_ANALYTICS)) {
    const adAnalyticsStore = db.createObjectStore(STORES.AD_ANALYTICS, {
      keyPath: 'id',
    });
    adAnalyticsStore.createIndex('by_adId_analytics', 'adId', {
      unique: false,
    });
    adAnalyticsStore.createIndex('by_date_analytics', 'date', {
      unique: false,
    });
    adAnalyticsStore.createIndex('by_metric', 'metric', { unique: false });
    adAnalyticsStore.createIndex('by_peerSpace_analytics', 'peerSpaceAddress', {
      unique: false,
    });
    adAnalyticsStore.createIndex('by_deviceType', 'deviceType', {
      unique: false,
    });
    adAnalyticsStore.createIndex('by_location_analytics', 'location', {
      unique: false,
    });
    adAnalyticsStore.createIndex('ad_date_analytics', ['adId', 'date'], {
      // 인덱스 이름 변경
      unique: false, // Consider true if (adId, date) pair should be unique per record (e.g. daily summary)
    });
  }

  // 광고 정산
  if (!db.objectStoreNames.contains(STORES.AD_SETTLEMENTS)) {
    const adSettlementStore = db.createObjectStore(STORES.AD_SETTLEMENTS, {
      keyPath: 'id',
    });
    adSettlementStore.createIndex('by_adId_settlement', 'adId', {
      unique: false,
    });
    adSettlementStore.createIndex('by_advertiser_settlement', 'advertiserId', {
      unique: false,
    });
    adSettlementStore.createIndex(
      'by_peerSpace_settlement',
      'peerSpaceAddress',
      {
        unique: false,
      }
    );
    adSettlementStore.createIndex(
      'by_familyMember_settlement',
      'familyMemberId',
      {
        unique: false,
      }
    );
    adSettlementStore.createIndex('by_amount', 'amount', { unique: false });
    adSettlementStore.createIndex('by_status_settlement', 'status', {
      unique: false,
    });
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
    accessKeyStore.createIndex('by_roomId_accesskey', 'roomId', {
      unique: false,
    });
    accessKeyStore.createIndex('by_userId_accesskey', 'userId', {
      unique: false,
    });
    accessKeyStore.createIndex('by_key_accesskey', 'key', { unique: true }); // 인덱스 이름 변경
    accessKeyStore.createIndex('by_createdAt_accesskey', 'createdAt', {
      unique: false,
    });
    accessKeyStore.createIndex('by_expiryDate_accesskey', 'expiryDate', {
      unique: false,
    });
    accessKeyStore.createIndex('by_isActive', 'isActive', { unique: false });
    accessKeyStore.createIndex('by_creatorId_accesskey', 'creatorId', {
      unique: false,
    });
    accessKeyStore.createIndex('room_user_accesskey', ['roomId', 'userId'], {
      // 인덱스 이름 변경
      unique: true,
    });
  }
}

// ❗️ 추가: 버전 4 스토어 생성 (ADDRESS 저장소)
function createVersion4Stores(db: IDBDatabase) {
  if (!db.objectStoreNames.contains(STORES.ADDRESS)) {
    const addressStore = db.createObjectStore(STORES.ADDRESS, {
      keyPath: 'id', // 또는 'addressId', 'uuid' 등 고유 식별자
      // autoIncrement: true, // 필요하다면 자동 증가 ID 사용
    });
    // 주소는 다양한 엔티티(사용자, 피어몰 등)에 연결될 수 있으므로,
    // 어떤 엔티티의 주소인지, 그리고 해당 엔티티의 ID가 무엇인지 저장하는 것이 일반적입니다.
    addressStore.createIndex('by_entityType', 'entityType', { unique: false }); // 예: 'user', 'peerSpace'
    addressStore.createIndex('by_entityId', 'entityId', { unique: false }); // 해당 엔티티의 ID
    addressStore.createIndex('by_userId', 'userId', { unique: false }); // 특정 사용자와 직접 연결된 경우
    addressStore.createIndex('by_peerSpace', 'peerSpaceAddress', {
      unique: false,
    }); // 특정 피어몰과 연결된 경우
    addressStore.createIndex('by_type', 'type', { unique: false }); // 예: 'shipping', 'billing', 'location'
    addressStore.createIndex('by_country', 'country', { unique: false });
    addressStore.createIndex('by_postalCode', 'postalCode', { unique: false });
    addressStore.createIndex('by_isDefault', 'isDefault', { unique: false }); // 기본 주소 여부
    // 복합 인덱스 (자주 사용될 경우)
    addressStore.createIndex(
      'entityType_entityId',
      ['entityType', 'entityId'],
      { unique: false }
    );
    addressStore.createIndex('userId_type', ['userId', 'type'], {
      unique: false,
    });
  }
  // 여기에 버전 4에서 추가될 다른 저장소가 있다면 함께 정의합니다.
}

// --- 기존 CRUD 함수들 ---
import { Content } from '@/components/peer-space/types'; // 이 타입 정의가 ADDRESS와 관련 없다면 그대로 둡니다.

export const getPeerSpaceContentsFromDB = async (
  address: string
): Promise<Content[]> => {
  // ❗️ 수정: initDatabase()를 사용하여 DB 인스턴스 가져오기
  const db = await initDatabase(); // 또는 getDB()가 initDatabase()를 호출하도록 수정
  const transaction = db.transaction(STORES.CONTENTS, 'readonly');
  const store = transaction.objectStore(STORES.CONTENTS);
  const index = store.index('by_peerSpace'); // 'by_peerSpace' 인덱스가 CONTENTS 스토어에 있는지 확인
  const request = index.getAll(address);
  return new Promise<Content[]>((resolve, reject) => {
    // 타입 명시
    request.onsuccess = (event) => {
      resolve((event.target as IDBRequest).result as Content[]);
    };
    request.onerror = (event) => {
      console.error(
        `Error fetching contents for peerSpace ${address}:`,
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

// ❗️ 수정/개선 제안: getDB 함수가 initDatabase를 사용하도록
export const getDB = (): Promise<IDBDatabase> => {
  return initDatabase(); // initDatabase는 이미 dbPromise를 캐싱하므로 이를 재사용
};

// 아래 CRUD 함수들은 storeName을 매개변수로 받으므로 STORES.ADDRESS를 사용하면 그대로 동작합니다.
// 변경할 필요가 없습니다.

export const addData = async <T>(
  storeName: string,
  data: T
): Promise<IDBValidKey> => {
  const db = await getDB(); // getDB()가 initDatabase()를 호출하도록 수정됨
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
        (event.target as IDBRequest).error,
        'Data:',
        data
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

export const updateData = async <T>(
  storeName: string,
  data: T // T 타입은 keyPath를 포함해야 함
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
        (event.target as IDBRequest).error,
        'Data:',
        data
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
        `${storeName}에서 데이터 조회 실패 (key: ${key}):`,
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

export const getDataByIndex = async <T>(
  storeName: string,
  indexName: string,
  key: IDBValidKey | IDBKeyRange // 인덱스 조회 시 IDBKeyRange도 사용 가능
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
        `${storeName}의 ${indexName} 인덱스에서 데이터 조회 실패 (key: ${key}):`,
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

  return new Promise<void>((resolve, reject) => {
    // Promise<void>로 명시
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      console.error(
        `${storeName}에서 데이터 삭제 실패 (key: ${key}):`,
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};
