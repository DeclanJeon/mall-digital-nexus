import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  X, 
  ChevronDown, 
  Plus, 
  Check, 
  AlertCircle, 
  UserX, 
  Trash2, 
  HelpCircle, 
  MoreVertical, 
  MessageSquare, 
  Phone, 
  Link2, 
  Unlink,
  Clock, Shield, ArrowUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose 
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger, 
  TooltipProvider 
} from '@/components/ui/tooltip';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Friend, 
  FamilyMember, 
  Recommender, 
  NetworkSectionProps,
  FriendRequest,
  ReceivedFriendRequest,
  FriendRequestStatus,
  SearchResult,
  RecommenderRequest,
  RecommenderRequestDetails,
  RecommenderRequestAction
} from '@/types/network';

// 더미 패밀리 멤버 데이터
const dummyFamilyMembers: FamilyMember[] = [
  {
    id: 'fm1',
    name: '김가디언',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guardian',
    peerId: 'peer12345',
    level: '가디언',
    certified: true,
    description: '가디언 멤버',
    authorizedMalls: [
      { id: 1, name: '가디언 쇼핑몰', url: 'https://example.com/guardian', certified: true },
    ],
    operatedMalls: [
      { id: 1, name: '가디언 스토어', url: 'https://example.com/guardian-store' },
    ],
  },
  {
    id: 'fm2',
    name: '이퍼실리테이터',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=facilitator',
    peerId: 'peer23456',
    level: '퍼실리테이터',
    certified: true,
    description: '퍼실리테이터 멤버',
    authorizedMalls: [
      { id: 2, name: '퍼실리테이터 샵', url: 'https://example.com/facilitator', certified: true },
    ],
    operatedMalls: [
      { id: 2, name: '퍼실리테이터 마켓', url: 'https://example.com/facilitator-market' },
    ],
  },
  {
    id: 'fm3',
    name: '박기본',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=basic',
    peerId: 'peer34567',
    level: '기본',
    certified: false,
    description: '기본 멤버',
    authorizedMalls: [],
    operatedMalls: [],
  },
];

// 내가 운영하는 피어몰 더미 데이터
const myOperatedMalls = [
  { id: 1, name: '내 쇼핑몰', url: 'https://example.com/my-mall' },
  { id: 2, name: '셔스 스토어', url: 'https://example.com/shers-store' },
];

// 테스트용 더미 데이터 (컴포넌트 상단에 추가)
const dummyReceivedRequests: RecommenderRequestDetails[] = [
  {
    id: 'req1',
    fromUserId: 'user123',
    toUserId: 'current-user-123',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    message: '안녕하세요! 서로 신뢰할 수 있는 관계를 맺고 싶어 추천인 요청드립니다.',
    user: {
      id: 'user123',
      name: '김요청',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=requester1',
      peerId: 'peer789',
      trustScore: 85,
      currentRecommenders: 4,
      networkHealth: 'high',
      commonConnections: 3,
      connectionLevel: 2,
      recentActivity: '피어몰에서 활발히 활동 중'
    },
    reviewData: {
      requestCount24h: 2,
      duplicateNetworkWarning: false,
      trustScoreDetails: {
        average: 82,
        range: '상위 15%'
      }
    }
  },
  {
    id: 'req2',
    fromUserId: 'user456',
    toUserId: 'current-user-123',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    message: '추천인이 되어주세요!',
    user: {
      id: 'user456',
      name: '이의심',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=requester2',
      peerId: 'peer999',
      trustScore: 45,
      currentRecommenders: 1,
      networkHealth: 'low',
      commonConnections: 0,
      connectionLevel: 5,
      recentActivity: '최근 활동 없음'
    },
    reviewData: {
      requestCount24h: 15, // 경고 플래그
      duplicateNetworkWarning: true, // 경고 플래그
      trustScoreDetails: {
        average: 42,
        range: '하위 60%'
      }
    }
  }
];

// 배열 필드는 무조건 빈 배열로 시작
const defaultNetwork: NetworkSectionProps = {
  friends: [],
  followers: [],
  following: [],
  recommenders: [],
  recommendees: [],
  family: dummyFamilyMembers,
  backupRecommenders: [],
  recommenderRequests: []
};

const STORAGE_KEY_DATA = 'peerMall_networkData';
const STORAGE_KEY_TAB = 'peerMall_activeTab';
const GRACE_PERIOD = 7 * 24 * 60 * 60 * 1000; // 7일(ms)

interface ActiveUser {
  id: string;
  name: string;
  image?: string;
  status: 'online' | 'offline';
  lastActive: string;
}

const NetworkSection: React.FC<NetworkSectionProps> = (props) => {
  // 1) 전체 네트워크 상태 초기화
  const [networkData, setNetworkData] = useState<NetworkSectionProps>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY_DATA);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...defaultNetwork,
            ...props,
            ...parsed,
          };
        } catch {
          // 파싱 실패 시 무시
        }
      }
    }
    return { ...defaultNetwork, ...props };
  });

  // 2) 활성 탭 관리
  const [activeTab, setActiveTab] = useState<
    'friends' | 'recommenders' | 'recommendees' | 'family' | 'backups'
  >(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem(STORAGE_KEY_TAB);
      if (
        t === 'recommenders' ||
        t === 'recommendees' ||
        t === 'family' ||
        t === 'backups'
      ) {
        return t;
      }
    }
    return 'recommenders';
  });

  // 검색 및 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [friendSearchQuery, setFriendSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // 친구 관련 상태
  const [friendSearchResults, setFriendSearchResults] = useState<Array<Friend & { 
    requestStatus: FriendRequestStatus;
    status: 'offline' | 'online' | 'away';
  }>>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ReceivedFriendRequest[]>([]);
  
  // 검색 결과 상태
  const [searchResults, setSearchResults] = useState<Array<Friend & { 
    requestStatus: 'pending' | 'received' | 'none';
    status: 'offline' | 'online' | 'away';
    lastActive: string;
  }>>([]);
  
  // 활성 사용자 모달
  const [isActiveUsersModalOpen, setIsActiveUsersModalOpen] = useState(false);
  const [isLoadingActiveUsers, setIsLoadingActiveUsers] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  
  // 인증 요청 상태
  const [certificationRequestTarget, setCertificationRequestTarget] = useState<FamilyMember | null>(null);
  const [certificationNote, setCertificationNote] = useState('');
  const [isSubmittingCertification, setIsSubmittingCertification] = useState(false);
  const [selectedOperatedMallId, setSelectedOperatedMallId] = useState<number | null>(null);
  
  // 패밀리 멤버 추가
  const [newMemberPeerId, setNewMemberPeerId] = useState('');
  
  // 추천인 관련 상태
  const [showAddRecommender, setShowAddRecommender] = useState(false);
  const [recommenderSearchQuery, setRecommenderSearchQuery] = useState('');
  const [recommenderSearchResults, setRecommenderSearchResults] = useState<SearchResult[]>([]);
  const [isSearchingRecommenders, setIsSearchingRecommenders] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  
  const [promotingUserId, setPromotingUserId] = useState<string | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [showBulkPromotionModal, setShowBulkPromotionModal] = useState(false);

  // useState 초기화 시 더미 데이터 사용
  const [receivedRecommenderRequests, setReceivedRecommenderRequests] = useState<RecommenderRequestDetails[]>(dummyReceivedRequests);


  // NetworkSection 컴포넌트 내부에 추가할 상태들

  const [selectedRequest, setSelectedRequest] = useState<RecommenderRequestDetails | null>(null);
  const [requestAction, setRequestAction] = useState<RecommenderRequestAction | null>(null);
  const [showRequestDetailModal, setShowRequestDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  // 네트워크 정보 확인 관련 상태
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  const [networkInfoUser, setNetworkInfoUser] = useState<RecommenderRequestDetails['user'] | null>(null);
    
  // 예비 추천인 추가용 상태
  const [newBackup, setNewBackup] = useState({ id: '', name: '' });
  
  // 현재 사용자 ID
  const currentUserId = 'current-user-123';

  // 로컬스토리지 동기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(networkData));
      localStorage.setItem(STORAGE_KEY_TAB, activeTab);
    }
  }, [networkData, activeTab]);

  // **검색 필터링 함수**
  const filterBySearch = <T extends { name: string }>(items: T[]): T[] => {
    if (!searchQuery.trim()) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // **추천인 검색**
  const searchRecommenders = async (query: string) => {
    if (!query.trim()) {
      setRecommenderSearchResults([]);
      return;
    }

    setIsSearchingRecommenders(true);
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      
      const mockResults: SearchResult[] = [
        {
          id: 'user1',
          peerId: 'peer123',
          name: '홍길동',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
          isAlreadyRecommender: networkData.recommenders.some(r => r.id === 'user1'),
          isAlreadyBackup: networkData.backupRecommenders.some(r => r.id === 'user1'),
          hasPendingRequest: false,
        },
        {
          id: 'user2',
          peerId: 'peer456',
          name: '김철수',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
          isAlreadyRecommender: networkData.recommenders.some(r => r.id === 'user2'),
          isAlreadyBackup: networkData.backupRecommenders.some(r => r.id === 'user2'),
          hasPendingRequest: false,
        },
      ].filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.peerId.toLowerCase().includes(query.toLowerCase())
      );
      
      setRecommenderSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching for recommenders:', error);
      setRecommenderSearchResults([]);
    } finally {
      setIsSearchingRecommenders(false);
    }
  };

  // **추천인 요청 보내기**
  const sendRecommenderRequest = async (userId: string) => {
    if (isRequesting) return;
    
    setIsRequesting(true);
    try {
      // TODO: 실제 API 호출로 대체
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 시 UI 업데이트
      setNetworkData(prev => ({
        ...prev,
        recommenderRequests: [
          ...(prev.recommenderRequests || []),
          {
            id: `temp-${Date.now()}`,
            fromUserId: currentUserId,
            toUserId: userId,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              id: userId,
              name: selectedUser?.name || '사용자',
              image: selectedUser?.image
            }
          }
        ]
      }));
      
      // 선택 초기화
      setSelectedUser(null);
      setRecommenderSearchQuery('');
      setRecommenderSearchResults([]);
      setShowAddRecommender(false);
      
      alert('추천인 요청이 전송되었습니다! 🚀');
    } catch (error) {
      console.error('Error sending recommender request:', error);
      alert('요청을 보내는 중 오류가 발생했습니다. 😢');
    } finally {
      setIsRequesting(false);
    }
  };

  // **예비 추천인으로 등록**
  const addToBackupRecommenders = async (userId: string) => {
    if (isRequesting || !selectedUser) return;
    
    // 추천인 7명이 모두 차지 않았으면 예비 추천인 등록 불가
    if (networkData.recommenders.length < 7) {
      alert('추천인 7명을 모두 등록한 후에 예비 추천인을 등록할 수 있습니다! 💫');
      return;
    }
    
    setIsRequesting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 성공 시 UI 업데이트
      setNetworkData(prev => ({
        ...prev,
        backupRecommenders: [
          ...prev.backupRecommenders,
          {
            id: userId,
            name: selectedUser.name,
            image: selectedUser.image || '',
            certified: true // 임시로 인증된 것으로 설정
          }
        ]
      }));
      
      // 선택 초기화
      setSelectedUser(null);
      setRecommenderSearchQuery('');
      setRecommenderSearchResults([]);
      setShowAddRecommender(false);
      
      alert('예비 추천인으로 등록되었습니다! ✨');
    } catch (error) {
      console.error('Error adding backup recommender:', error);
      alert('예비 추천인 등록 중 오류가 발생했습니다. 😢');
    } finally {
      setIsRequesting(false);
    }
  };

  // **추천인 삭제**
  const removeRecommender = async (id: string) => {
    if (!confirm('정말 이 추천인을 삭제하시겠습니까? 🤔')) return;
    
    try {
      setNetworkData(prev => {
        const newRecommenders = prev.recommenders.filter(r => r.id !== id);
        let newBackupRecommenders = [...prev.backupRecommenders];
        
        // 추천인이 7명 미만이 되고 예비 추천인이 있으면 자동 승격
        if (newRecommenders.length < 7 && newBackupRecommenders.length > 0) {
          const [promoted, ...remainingBackups] = newBackupRecommenders;
          
          // 자동으로 추천인 요청 보내기 (실제로는 API 호출 필요)
          setTimeout(() => {
            alert(`${promoted.name}님에게 자동으로 추천인 요청을 보냈습니다! 🚀`);
          }, 500);
          
          newRecommenders.push(promoted);
          newBackupRecommenders = remainingBackups;
        }
        
        return {
          ...prev,
          recommenders: newRecommenders,
          backupRecommenders: newBackupRecommenders
        };
      });
      
      alert('추천인이 삭제되었습니다! 👋');
    } catch (error) {
      console.error('Error removing recommender:', error);
      alert('추천인 삭제 중 오류가 발생했습니다. 😢');
    }
  };

  // **예비 추천인 메인으로 승격**
  const promoteBackup = async (id: string) => {
    if (networkData.recommenders.length >= 7) {
      alert('추천인이 이미 7명입니다! 먼저 기존 추천인을 삭제해주세요. 💡');
      return;
    }

    const backup = networkData.backupRecommenders.find(b => b.id === id);
    if (!backup) return;

    try {
      // 승격 애니메이션 효과
      setPromotingUserId(id);
      
      // 1초 후 실제 승격 처리
      setTimeout(() => {
        setNetworkData(prev => ({
          ...prev,
          recommenders: [...prev.recommenders, backup],
          backupRecommenders: prev.backupRecommenders.filter(b => b.id !== id)
        }));
        
        setPromotingUserId(null);
        alert(`🎉 ${backup.name}님이 메인 추천인으로 승격되었습니다!`);
      }, 1000);
      
    } catch (error) {
      console.error('Error promoting backup:', error);
      setPromotingUserId(null);
      alert('승격 중 오류가 발생했습니다. 😢');
    }
  };


  // **피추천인 삭제**
  const removeRecommendee = async (id: string) => {
    if (!confirm('정말 이 피추천인을 삭제하시겠습니까? 🤔')) return;
    
    try {
      setNetworkData(prev => ({
        ...prev,
        recommendees: prev.recommendees.filter(r => r.id !== id)
      }));
      
      alert('피추천인이 삭제되었습니다! 👋');
    } catch (error) {
      console.error('Error removing recommendee:', error);
      alert('피추천인 삭제 중 오류가 발생했습니다. 😢');
    }
  };

  // **예비 추천인 추가 (직접 입력)**
  const addBackup = () => {
    if (!newBackup.id.trim() || !newBackup.name.trim()) {
      alert('ID와 이름을 모두 입력해주세요! 📝');
      return;
    }

    if (networkData.recommenders.length < 7) {
      alert('추천인 7명을 모두 등록한 후에 예비 추천인을 등록할 수 있습니다! 💫');
      return;
    }

    const backup: Recommender = {
      id: newBackup.id,
      name: newBackup.name,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newBackup.id}`,
      certified: false
    };

    setNetworkData(prev => ({
      ...prev,
      backupRecommenders: [...prev.backupRecommenders, backup]
    }));

    setNewBackup({ id: '', name: '' });
    alert('예비 추천인이 추가되었습니다! ✨');
  };

  // **친구 관련 함수들**
  const handleFriendSearch = async () => {
    if (!friendSearchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults = [
        {
          id: 'friend1',
          name: '이친구',
          image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=friend1',
          status: 'online' as const,
          lastActive: new Date().toISOString(),
          requestStatus: 'none' as const
        }
      ].filter(user => 
        user.name.toLowerCase().includes(friendSearchQuery.toLowerCase())
      );
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching friends:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFriendSearch();
    }
  };

  const sendFriendRequest = async (userId: string, userName: string) => {
    try {
      alert(`${userName}님에게 친구 요청을 보냈습니다! 💌`);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleAcceptFriendRequest = async (requestId: string, userId: string, userName: string) => {
    try {
      // 친구 목록에 추가
      const newFriend: Friend = {
        id: userId,
        name: userName,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
        status: 'offline',
        lastActive: new Date().toISOString()
      };
      
      setNetworkData(prev => ({
        ...prev,
        friends: [...prev.friends, newFriend]
      }));
      
      // 요청 목록에서 제거
      setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
      
      alert(`${userName}님과 친구가 되었습니다! 🎉`);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectFriendRequest = async (requestId: string, userName: string) => {
    try {
      setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
      alert(`${userName}님의 친구 요청을 거절했습니다. 😔`);
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const removeFriend = async (id: string) => {
    if (!confirm('정말 이 친구를 삭제하시겠습니까? 🤔')) return;
    
    try {
      setNetworkData(prev => ({
        ...prev,
        friends: prev.friends.filter(f => f.id !== id)
      }));
      
      alert('친구가 삭제되었습니다! 👋');
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  // **패밀리 멤버 관련 함수들**
  const handleAddFamilyMember = () => {
    if (!newMemberPeerId.trim()) {
      alert('피어 ID를 입력해주세요! 📝');
      return;
    }

    const newMember: FamilyMember = {
      id: `fm-${Date.now()}`,
      name: `멤버-${newMemberPeerId.slice(-4)}`,
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMemberPeerId}`,
      peerId: newMemberPeerId,
      level: '기본',
      certified: false,
      description: '새로 추가된 멤버',
      authorizedMalls: [],
      operatedMalls: []
    };

    setNetworkData(prev => ({
      ...prev,
      family: [...prev.family, newMember]
    }));

    setNewMemberPeerId('');
    alert('패밀리 멤버가 추가되었습니다! 👨‍👩‍👧‍👦');
  };

  const openCertificationRequestModal = (member: FamilyMember) => {
    setCertificationRequestTarget(member);
  };

  const closeCertificationRequestModal = () => {
    setCertificationRequestTarget(null);
    setSelectedOperatedMallId(null);
  };

  const sendCertificationRequest = async (member: FamilyMember, mallId: number | null) => {
    if (!mallId) {
      alert('피어몰을 선택해주세요! 🏪');
      return;
    }

    try {
      setNetworkData(prev => ({
        ...prev,
        family: prev.family.map(m => 
          m.id === member.id ? { ...m, certified: true } : m
        )
      }));

      closeCertificationRequestModal();
      alert(`${member.name}님에게 인증 요청을 보냈습니다! 📋`);
    } catch (error) {
      console.error('Error sending certification request:', error);
      alert('인증 요청 중 오류가 발생했습니다. 😢');
    }
  };

  const handleDisconnectFamilyMember = async (id: string) => {
    if (!confirm('정말 이 멤버와의 연결을 끊으시겠습니까? 🤔')) return;
    
    try {
      setNetworkData(prev => ({
        ...prev,
        family: prev.family.filter(m => m.id !== id)
      }));
      
      alert('멤버와의 연결이 끊어졌습니다! 👋');
    } catch (error) {
      console.error('Error disconnecting family member:', error);
    }
  };

// 추천인 요청 상세 정보 보기
const viewRequestDetails = (request: RecommenderRequestDetails) => {
  setSelectedRequest(request);
  setShowRequestDetailModal(true);
};

// 네트워크 관계 정보 보기
const viewNetworkInfo = (user: RecommenderRequestDetails['user']) => {
  setNetworkInfoUser(user);
  setShowNetworkInfo(true);
};

// 즉시 수락
const handleAcceptRequest = async (requestId: string) => {
  setIsProcessingRequest(true);
  try {
    // TODO: API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = receivedRecommenderRequests.find(r => r.id === requestId);
    if (request) {
      // 추천인 목록에 추가
      setNetworkData(prev => ({
        ...prev,
        recommenders: [...prev.recommenders, {
          id: request.user.id,
          name: request.user.name,
          image: request.user.image || '',
          certified: true
        }]
      }));
      
      // 요청 목록에서 제거
      setReceivedRecommenderRequests(prev => 
        prev.filter(r => r.id !== requestId)
      );
      
      alert(`${request.user.name}님을 추천인으로 수락했습니다! 🎉`);
    }
  } catch (error) {
    console.error('Error accepting request:', error);
    alert('요청 처리 중 오류가 발생했습니다. 😢');
  } finally {
    setIsProcessingRequest(false);
  }
};

// 조건부 수락
const handleConditionalAccept = async (requestId: string, conditions: RecommenderRequestAction['conditions']) => {
  setIsProcessingRequest(true);
  try {
    // TODO: API 호출로 조건부 수락 처리
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = receivedRecommenderRequests.find(r => r.id === requestId);
    if (request) {
      // 조건부 수락 상태로 업데이트 (실제로는 상대방 승인 대기)
      setReceivedRecommenderRequests(prev => 
        prev.map(r => r.id === requestId 
          ? { ...r, status: 'pending' as const } 
          : r
        )
      );
      
      alert(`${request.user.name}님에게 조건부 수락을 보냈습니다! 📋`);
    }
  } catch (error) {
    console.error('Error sending conditional acceptance:', error);
    alert('조건부 수락 처리 중 오류가 발생했습니다. 😢');
  } finally {
    setIsProcessingRequest(false);
    setShowActionModal(false);
  }
};

// 거부
const handleRejectRequest = async (requestId: string, reason?: string) => {
  setIsProcessingRequest(true);
  try {
    // TODO: API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = receivedRecommenderRequests.find(r => r.id === requestId);
    if (request) {
      setReceivedRecommenderRequests(prev => 
        prev.filter(r => r.id !== requestId)
      );
      
      alert(`${request.user.name}님의 추천인 요청을 거부했습니다. 😔`);
    }
  } catch (error) {
    console.error('Error rejecting request:', error);
    alert('요청 거부 중 오류가 발생했습니다. 😢');
  } finally {
    setIsProcessingRequest(false);
    setShowActionModal(false);
  }
};

// 보류
const handleHoldRequest = async (requestId: string, reviewPeriod: number) => {
  setIsProcessingRequest(true);
  try {
    // TODO: API 호출
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const request = receivedRecommenderRequests.find(r => r.id === requestId);
    if (request) {
      setReceivedRecommenderRequests(prev => 
        prev.map(r => r.id === requestId 
          ? { ...r, status: 'on_hold' as const } 
          : r
        )
      );
      
      alert(`${request.user.name}님의 요청을 ${reviewPeriod}일간 보류했습니다. ⏳`);
    }
  } catch (error) {
    console.error('Error holding request:', error);
    alert('요청 보류 중 오류가 발생했습니다. 😢');
  } finally {
    setIsProcessingRequest(false);
    setShowActionModal(false);
  }
};

  return (
    <TooltipProvider>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              내 네트워크
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="네트워크 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-full sm:w-[180px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="friends">친구</TabsTrigger>
            <TabsTrigger value="recommenders">추천인</TabsTrigger>
            <TabsTrigger value="recommendees">피추천인</TabsTrigger>
            <TabsTrigger value="family">패밀리</TabsTrigger>
          </TabsList>

          <CardContent className="p-4">
            {/* 친구 탭 */}
            <TabsContent value="friends">
              <div className="mb-4 text-xs text-gray-500">
                <p>• 친구 목록에서 친구의 상태를 확인하고 채팅을 시작할 수 있습니다.</p>
                <p>• 친구 추가를 위해 ID나 이메일로 검색하세요.</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Input
                  placeholder="친구 ID 또는 이름으로 검색"
                  value={friendSearchQuery}
                  onChange={(e) => setFriendSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  disabled={isSearching}
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleFriendSearch}
                  disabled={isSearching || !friendSearchQuery.trim()}
                >
                  {isSearching ? '검색 중...' : '검색'}
                </Button>
              </div>

              {/* 검색 결과 */}
              {searchResults.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 text-gray-600">검색 결과</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {searchResults.map((user) => (
                      <div key={user.id} className="flex items-center p-3 border rounded-lg bg-white shadow-sm">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                          {user.requestStatus === 'pending' && (
                            <span className="text-xs text-yellow-600">요청 대기 중</span> )}
                        </div>
                        {user.requestStatus === 'none' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => sendFriendRequest(user.id, user.name)}
                            className="whitespace-nowrap"
                            disabled={isSearching}
                          >
                            친구 요청
                          </Button>
                        ) : user.requestStatus === 'pending' ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled
                            className="whitespace-nowrap"
                          >
                            요청됨
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 받은 친구 요청 */}
              {receivedRequests.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3 text-gray-600">받은 친구 요청</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {receivedRequests.map((request) => (
                      <div key={request.id} className="flex items-center p-3 border rounded-lg bg-blue-50">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={request.fromUser.image} alt={request.fromUser.name} />
                          <AvatarFallback>{request.fromUser.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{request.fromUser.name}</p>
                          <p className="text-xs text-gray-500">친구 요청을 보냈습니다</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAcceptFriendRequest(request.id, request.fromUser.id, request.fromUser.name)}
                            className="text-xs px-2"
                          >
                            수락
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRejectFriendRequest(request.id, request.fromUser.name)}
                            className="text-xs px-2"
                          >
                            거절
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 친구 목록 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <h4 className="text-sm font-medium text-gray-600 col-span-full">내 친구 ({networkData.friends?.length ?? 0})</h4>
                {filterBySearch(networkData.friends ?? []).length > 0 ? (
                  filterBySearch(networkData.friends ?? []).map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.image} alt={friend.name} />
                          <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span
                          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                            friend.status === 'online'
                              ? 'bg-green-500'
                              : friend.status === 'away'
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{friend.name}</p>
                          <span className="text-xs text-gray-500">
                            {friend.status === 'online'
                              ? '온라인'
                              : friend.status === 'away'
                              ? '자리 비움'
                              : '오프라인'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {friend.lastActive
                            ? `마지막 접속: ${new Date(friend.lastActive).toLocaleString()}`
                            : '접속 기록 없음'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          채팅
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFriend(friend.id)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>아직 추가된 친구가 없습니다.</p>
                    <p className="text-sm mt-1">위의 검색창에서 친구를 찾아 추가해보세요.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 추천인 탭 */}
            <TabsContent value="recommenders" className="space-y-6">

              {/* 받은 추천인 요청 섹션 */}
              {receivedRecommenderRequests.length > 0 && (
                <Card className="mb-6 border-amber-200 bg-amber-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      받은 추천인 요청
                    </CardTitle>
                    <CardDescription>
                      {receivedRecommenderRequests.length}개의 추천인 요청이 대기 중입니다.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {receivedRecommenderRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-white border border-amber-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-amber-300">
                              <AvatarImage src={request.user.image} alt={request.user.name} />
                              <AvatarFallback className="bg-amber-100 text-amber-800">
                                {request.user.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{request.user.name}</p>
                                {request.user.peerId && (
                                  <span className="text-xs text-gray-500">
                                    ID: {request.user.peerId}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                                {request.user.currentRecommenders !== undefined && (
                                  <span>추천인: {request.user.currentRecommenders}/7</span>
                                )}
                                {request.user.commonConnections !== undefined && (
                                  <span>공통 연결: {request.user.commonConnections}명</span>
                                )}
                                {request.user.connectionLevel !== undefined && (
                                  <span>{request.user.connectionLevel}단계 연결</span>
                                )}
                              </div>
                              {request.message && (
                                <p className="text-sm text-gray-600 mt-1 italic">
                                  "{request.message}"
                                </p>
                              )}
                              
                              {/* 경고 플래그 표시 */}
                              {request.reviewData?.requestCount24h && request.reviewData.requestCount24h > 10 && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                  <span className="text-xs text-red-600">
                                    24시간 내 {request.reviewData.requestCount24h}건 요청
                                  </span>
                                </div>
                              )}
                              
                              {request.reviewData?.duplicateNetworkWarning && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs text-yellow-600">
                                    네트워크 다양성 낮음
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            {/* 기본 액션 버튼들 */}
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => handleAcceptRequest(request.id)}
                                disabled={isProcessingRequest}
                                className="bg-green-600 hover:bg-green-700 text-xs px-3"
                              >
                                즉시 수락
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setRequestAction({ type: 'conditional_accept' });
                                  setShowActionModal(true);
                                }}
                                disabled={isProcessingRequest}
                                className="text-xs px-3"
                              >
                                조건부 수락
                              </Button>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setRequestAction({ type: 'hold' });
                                  setShowActionModal(true);
                                }}
                                disabled={isProcessingRequest}
                                className="text-xs px-3"
                              >
                                보류
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setRequestAction({ type: 'reject' });
                                  setShowActionModal(true);
                                }}
                                disabled={isProcessingRequest}
                                className="text-xs px-3 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                거부
                              </Button>
                            </div>
                            
                            {/* 추가 정보 버튼들 */}
                            <div className="flex gap-2 justify-center">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => viewRequestDetails(request)}
                                    className="text-xs px-2 h-6"
                                  >
                                    상세보기
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>요청 상세 정보 보기</p>
                                </TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => viewNetworkInfo(request.user)}
                                    className="text-xs px-2 h-6"
                                  >
                                    네트워크
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>네트워크 관계 정보 보기</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 상태 요약 카드 */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      추천인 상태
                    </CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => setShowAddRecommender(true)}
                      className={networkData.recommenders.length >= 7 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {networkData.recommenders.length >= 7 ? '예비 추천인 추가' : '추천인 추가'}
                    </Button>
                  </div>
                  <CardDescription className="text-sm">
                    {networkData.recommenders.length < 7 ? (
                      <>
                        <span className="text-blue-700">인증을 위해 7명의 추천인이 필요합니다.</span>
                        <br />
                        <span className="text-gray-600">추천인은 인증된 회원이어야 합니다.</span>
                      </>
                    ) : (
                      <>
                        <span className="text-green-700">✅ 메인 추천인 등록 완료!</span>
                        <br />
                        <span className="text-amber-700">이제 예비 추천인을 추가하여 안전성을 높이세요.</span>
                      </>
                    )}
                  </CardDescription>

                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">메인 추천인</span>
                        <span className="text-sm font-semibold">
                          <span className={networkData.recommenders.length >= 7 ? 'text-green-600' : 'text-amber-600'}>
                            {networkData.recommenders.length}
                          </span>
                          <span className="text-gray-500">/7</span>
                        </span>
                      </div>
                      <Progress 
                        value={(networkData.recommenders.length / 7) * 100} 
                        className="h-2"
                      />
                      {networkData.recommenders.length < 7 && (
                        <p className="text-xs text-amber-600 mt-1">
                          {7 - networkData.recommenders.length}명의 추천인이 더 필요합니다
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">예비 추천인</span>
                        <span className="text-sm font-semibold">
                          <span className={networkData.backupRecommenders.length >= 3 ? 'text-green-600' : 'text-amber-600'}>
                            {networkData.backupRecommenders.length}
                          </span>
                          <span className="text-gray-500">/3</span>
                        </span>
                      </div>
                      <Progress 
                        value={Math.min((networkData.backupRecommenders.length / 3) * 100, 100)} 
                        className="h-2"
                      />
                      {networkData.backupRecommenders.length < 3 && (
                        <p className="text-xs text-amber-600 mt-1">
                          안전을 위해 예비 추천인을 더 추가하세요
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 메인 추천인 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">메인 추천인</h3>
                  <span className="text-sm text-gray-500">
                    {networkData.recommenders.length}명
                  </span>
                </div>
                
                {networkData.recommenders.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50">
                    <UserX className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">아직 메인 추천인이 없습니다</p>
                    <p className="text-xs text-gray-400 mt-1">추천인을 추가하여 인증을 완료하세요</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterBySearch(networkData.recommenders).map((u) => (
                      <Card key={u.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 border-2 border-blue-200">
                              <AvatarImage src={u.image} alt={u.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                {u.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1">
                                <p className="font-medium">{u.name}</p>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                                    >
                                      인증
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>인증된 회원</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <p className="text-xs text-gray-500">
                                {u.lastAction || '최근 활동 정보 없음'}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardFooter className="flex justify-end gap-2 pt-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-500 hover:text-red-600"
                                onClick={() => removeRecommender(u.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">제거</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>추천인에서 제거</p>
                            </TooltipContent>
                          </Tooltip>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* 예비 추천인 */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Users className="h-5 w-5 text-amber-600" />
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-amber-400 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">B</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900">예비 추천인 대기실</h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full">
                          <Clock className="h-3 w-3 text-amber-600" />
                          <span className="text-xs text-amber-700 font-medium">STANDBY</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>메인 추천인에 빈자리가 생기면 자동으로 승격됩니다</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <span className="text-sm text-gray-500">
                    {networkData.backupRecommenders.length}명 대기 중
                  </span>
                </div>
                
                {/* 대기실 상태 표시 */}
                <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-amber-800">
                        {networkData.recommenders.length >= 7 
                          ? '메인 추천인 완료 - 예비 추천인 활성화됨' 
                          : `메인 추천인 ${7 - networkData.recommenders.length}명 더 필요`}
                      </span>
                    </div>
                    <div className="text-xs text-amber-600">
                      {networkData.backupRecommenders.length > 0 && '자동 승격 대기 중'}
                    </div>
                  </div>
                </div>

                {/* 예비 추천인 관리 툴바 */}
                {networkData.backupRecommenders.length > 0 && (
                  <div className="flex items-center justify-between mb-4 p-3 bg-white border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-amber-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-amber-800">
                          {networkData.backupRecommenders.length}명이 승격을 기다리고 있어요
                        </span>
                      </div>
                      
                      {networkData.recommenders.length >= 7 && networkData.backupRecommenders.length > 0 && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          자동 승격 활성화됨
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowAddRecommender(true)}
                        className="text-xs bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        예비 추천인 추가
                      </Button>
                    </div>
                  </div>
                )}
                
                {networkData.backupRecommenders.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-amber-200 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50">
                    <div className="relative">
                      <Users className="mx-auto h-12 w-12 text-amber-300 mb-3" />
                      <div className="absolute top-0 right-1/2 transform translate-x-6 -translate-y-1">
                        <div className="h-6 w-6 bg-amber-400 rounded-full flex items-center justify-center">
                          <Clock className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-amber-800 mb-1">예비 추천인 대기실이 비어있어요</p>
                    <p className="text-sm text-amber-600 mb-3">
                      {networkData.recommenders.length < 7 
                        ? '메인 추천인 7명을 먼저 등록해주세요' 
                        : '안전을 위해 예비 추천인을 추가해보세요'}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-amber-500">
                      <Shield className="h-4 w-4" />
                      <span>예비 추천인은 메인 추천인의 안전망 역할을 합니다</span>
                      {networkData.recommenders.length >= 7 && (
                        <Button 
                          onClick={() => setShowAddRecommender(true)}
                          className="mt-4 bg-amber-500 hover:bg-amber-600 text-white"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          첫 번째 예비 추천인 추가하기
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filterBySearch(networkData.backupRecommenders).map((user, index) => (
                      <Card key={user.id} className={`overflow-hidden hover:shadow-lg transition-all duration-300 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 relative ${
                        promotingUserId === user.id ? 'ring-2 ring-amber-400 scale-105' : ''
                      }`}>
                        {/* 대기 순번 배지 */}
                        <div className="absolute top-2 right-2 z-10">
                          <div className="bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            #{index + 1}
                          </div>
                        </div>
                        
                        {/* 대기 상태 인디케이터 */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                        
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-amber-300 shadow-sm">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="bg-amber-100 text-amber-800 font-semibold">
                                  {user.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              {/* 대기 상태 아이콘 */}
                              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-amber-400 rounded-full flex items-center justify-center border-2 border-white">
                                <Clock className="h-2.5 w-2.5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                {user.certified && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="outline"
                                        className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs"
                                      >
                                        ✓ 인증
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>인증된 회원 - 언제든 메인으로 승격 가능</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="h-1.5 w-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                                <p className="text-xs text-amber-700 font-medium">
                                  {promotingUserId === user.id ? '승격 중...' : '승격 대기 중'}
                                </p>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                {user.lastAction || '최근 활동 정보 없음'}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        
                        {/* 승격 예상 시간 표시 */}
                        <div className="px-4 pb-2">
                          <div className="bg-white/70 rounded-lg p-2 border border-amber-200">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-amber-700 font-medium">승격 예상</span>
                              <span className="text-amber-600">
                                {networkData.recommenders.length >= 7 ? '즉시 가능' : `${7 - networkData.recommenders.length}명 후`}
                              </span>
                            </div>
                            <div className="mt-1">
                              <div className="h-1 bg-amber-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                                  style={{ 
                                    width: `${networkData.recommenders.length >= 7 ? 100 : (networkData.recommenders.length / 7) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <CardFooter className="flex justify-between items-center pt-2 gap-2">
                          {/* 즉시 승격 버튼 */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => promoteBackup(user.id)}
                                disabled={!user.certified || networkData.recommenders.length >= 7 || promotingUserId === user.id}
                                className={`text-xs px-3 flex-1 ${
                                  user.certified && networkData.recommenders.length < 7
                                    ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-400 hover:from-amber-500 hover:to-orange-500' 
                                    : 'opacity-50'
                                }`}
                              >
                                {promotingUserId === user.id ? (
                                  <>
                                    <div className="animate-spin h-3 w-3 mr-1 border border-white border-t-transparent rounded-full"></div>
                                    승격 중...
                                  </>
                                ) : networkData.recommenders.length >= 7 ? (
                                  <>
                                    <Users className="h-3 w-3 mr-1" />
                                    대기 중
                                  </>
                                ) : !user.certified ? (
                                  <>
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    인증 필요
                                  </>
                                ) : (
                                  <>
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                    즉시 승격
                                  </>
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {networkData.recommenders.length >= 7 ? (
                                <p>메인 추천인이 모두 차서 대기 중입니다</p>
                              ) : !user.certified ? (
                                <p>인증된 회원만 메인 추천인이 될 수 있습니다</p>
                              ) : (
                                <p>지금 바로 메인 추천인으로 승격시킵니다</p>
                              )}
                            </TooltipContent>
                          </Tooltip>

                          {/* 제거 버튼 */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-600 hover:text-red-600 hover:bg-red-50"
                                disabled={promotingUserId === user.id}
                                onClick={() => {
                                  setNetworkData(prev => ({
                                    ...prev,
                                    backupRecommenders: prev.backupRecommenders.filter(b => b.id !== user.id)
                                  }));
                                }}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">대기실에서 제거</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>예비 추천인 대기실에서 제거</p>
                            </TooltipContent>
                          </Tooltip>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 피추천인 탭 */}
            <TabsContent value="recommendees">
              <div className="mb-4 text-xs text-gray-500">
                <p>• 내가 추천한 사용자들의 목록입니다.</p>
                <p>• 피추천인의 인증 상태와 신뢰도를 확인할 수 있습니다.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterBySearch(networkData.recommendees).length > 0 ? (
                  filterBySearch(networkData.recommendees).map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center p-3 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Avatar className="h-10 w-10 border border-blue-200">
                        <AvatarImage src={u.image} alt={u.name} />
                        <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium">{u.name}</p>
                          {u.certified && (
                            <Badge
                              variant="outline"
                              className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                            >
                              인증
                            </Badge>
                          )}
                          {u.trustLevel && (
                            <Badge
                              variant="outline"
                              className="bg-indigo-50 text-indigo-600 border-indigo-200 text-xs"
                            >
                              LV.{u.trustLevel}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {u.lastAction || '최근 활동 정보 없음'}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeRecommendee(u.id)}
                      >
                        취소
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p>아직 피추천인이 없습니다.</p>
                    <p className="text-sm mt-1">다른 사용자를 추천해보세요.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* 패밀리 탭 */}
            <TabsContent value="family">
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-3">
                  패밀리 멤버는 운영·인증을 지원합니다.
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Users className="mr-2 h-4 w-4" />
                        멤버 추가
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>패밀리 멤버 추가</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="peerId" className="block text-sm font-medium mb-1">
                              피어 ID
                            </label>
                            <Input
                              id="peerId"
                              placeholder="상대방의 피어 ID를 입력하세요"
                              className="w-full"
                              value={newMemberPeerId}
                              onChange={(e) => setNewMemberPeerId(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              추가할 멤버의 피어 ID를 입력하세요.
                            </p>
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={handleAddFamilyMember}
                            disabled={!newMemberPeerId.trim()}
                          >
                            추가하기
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filterBySearch(networkData.family).map((m) => (
                  <div
                    key={m.id}
                    className="flex flex-col gap-2 p-3 border border-rose-100 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-rose-200">
                        <AvatarImage src={m.image} alt={m.name} />
                        <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium">{m.name}</p>
                          {m.level && (
                            <Badge
                              variant="outline"
                              className={
                                m.level === '가디언'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200 text-xs'
                                  : m.level === '퍼실리테이터'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 text-xs'
                                  : 'bg-pink-50 text-pink-600 border-pink-200 text-xs'
                              }
                            >
                              {m.level}
                              {m.level === '가디언' && ' 👑'}
                              {m.level === '퍼실리테이터' && ' ✨'}
                            </Badge>
                          )}
                          {m.certified && (
                            <Badge
                              variant="outline"
                              className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs"
                            >
                              인증됨
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {m.description || '운영 지원 멤버'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          <b>피어ID:</b> {m.peerId}
                        </p>
                        <div className="mt-1">
                          <b>인증된 피어몰:</b>
                          {m.authorizedMalls && m.authorizedMalls.length > 0 ? (
                            <ul className="list-disc ml-5 text-xs">
                              {m.authorizedMalls.map((mall) => (
                                <li key={mall.id}>
                                  <a href={mall.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    {mall.name}
                                  </a>{' '}
                                  {mall.certified && <Badge className="ml-1" variant="outline">인증</Badge>}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="ml-2 text-gray-400">없음</span>
                          )}
                        </div>
                        <div className="mt-1">
                          <b>운영 피어몰:</b>
                          {m.operatedMalls && m.operatedMalls.length > 0 ? (
                            <ul className="list-disc ml-5 text-xs">
                              {m.operatedMalls.map((mall) => (
                                <li key={mall.id}>
                                  <a href={mall.url} target="_blank" rel="noopener noreferrer" className="text-green-600 underline">
                                    {mall.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="ml-2 text-gray-400">없음</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-2">
                        {m.operatedMalls && m.operatedMalls.length > 0 && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-xs px-2 h-7"
                            onClick={() => window.open(m.operatedMalls[0].url, '_blank')}
                          >
                            운영몰 바로가기
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant={m.certified ? 'outline' : 'default'}
                          disabled={m.certified}
                          className="text-xs px-2 h-7"
                          onClick={() => openCertificationRequestModal(m)}
                        >
                          {m.certified ? '인증 완료' : '인증 요청'}
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => alert(`채팅 기능 (to: ${m.name})`)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>채팅</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`메시지 보내기 (to: ${m.name})`)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>메시지</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => alert(`통화 기능 (to: ${m.name})`)}>
                            <Phone className="mr-2 h-4 w-4" />
                            <span>통화</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDisconnectFamilyMember(m.id)}
                            className="text-red-600"
                          >
                            <Unlink className="mr-2 h-4 w-4" />
                            <span>연결 끊기</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

          </CardContent>
        </Tabs>
      </Card>

      {/* 추천인 추가 모달 */}
      <Dialog open={showAddRecommender} onOpenChange={setShowAddRecommender}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {networkData.recommenders.length < 7 ? (
                <>
                  <Users className="h-5 w-5 text-blue-600" />
                  메인 추천인 추가
                </>
              ) : (
                <>
                  <Clock className="h-5 w-5 text-amber-600" />
                  예비 추천인 추가
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* 현재 상태 표시 */}
            <div className={`p-3 rounded-lg ${
              networkData.recommenders.length < 7 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {networkData.recommenders.length < 7 ? (
                    <>
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-blue-800">메인 추천인 모집 중:</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-800">예비 추천인 등록 가능:</span>
                    </>
                  )}
                </div>
                <span className="font-semibold">
                  {networkData.recommenders.length}/7명
                </span>
              </div>
              
              {networkData.recommenders.length >= 7 ? (
                <div className="mt-2 p-2 bg-green-100 rounded border border-green-200">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800 font-medium">
                      메인 추천인 완료! 이제 예비 추천인을 추가할 수 있습니다.
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-blue-600 mt-1">
                  메인 추천인 {7 - networkData.recommenders.length}명을 먼저 등록해주세요.
                </p>
              )}
            </div>


            {/* 검색 입력 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">피어 ID 또는 이름으로 검색</label>
              <div className="flex gap-2">
                <Input
                  placeholder="검색어를 입력하세요"
                  value={recommenderSearchQuery}
                  onChange={(e) => setRecommenderSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      searchRecommenders(recommenderSearchQuery);
                    }
                  }}
                  disabled={isSearchingRecommenders}
                />
                <Button 
                  onClick={() => searchRecommenders(recommenderSearchQuery)}
                  disabled={isSearchingRecommenders || !recommenderSearchQuery.trim()}
                >
                  {isSearchingRecommenders ? '검색 중...' : '검색'}
                </Button>
              </div>
            </div>

            {/* 검색 중 로딩 */}
            {isSearchingRecommenders && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}

            {/* 검색 결과 */}
            {!isSearchingRecommenders && recommenderSearchResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700">검색 결과</h4>
                {recommenderSearchResults.map((user) => (
                  <div 
                    key={user.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">피어 ID: {user.peerId}</p>
                      </div>
                    </div>
                    {user.isAlreadyRecommender ? (
                      <Badge variant="outline" className="border-green-200 text-green-800 bg-green-50">
                        이미 추천인
                      </Badge>
                    ) : user.isAlreadyBackup ? (
                      <Badge variant="outline" className="border-purple-200 text-purple-800 bg-purple-50">
                        예비 추천인
                      </Badge>
                    ) : user.hasPendingRequest ? (
                      <Badge variant="outline" className="border-yellow-200 text-yellow-800 bg-yellow-50">
                        요청 대기 중
                      </Badge>
                    ) : (
                      <div className="flex items-center">
                        {selectedUser?.id === user.id && (
                          <Check className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 검색 결과 없음 */}
            {!isSearchingRecommenders && recommenderSearchQuery && recommenderSearchResults.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <p>검색 결과가 없습니다.</p>
                <p className="text-sm mt-1">정확한 피어 ID 또는 이름으로 검색해주세요.</p>
              </div>
            )}

            {/* 선택된 사용자 정보 */}
            {selectedUser && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">선택된 사용자</h4>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.image} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedUser.name}</p>
                    <p className="text-sm text-gray-500">피어 ID: {selectedUser.peerId}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowAddRecommender(false);
                  setRecommenderSearchQuery('');
                  setRecommenderSearchResults([]);
                  setSelectedUser(null);
                }}
              >
                취소
              </Button>
              
              {selectedUser && !selectedUser.isAlreadyRecommender && !selectedUser.isAlreadyBackup && (
                <div className="flex gap-2">
                  {/* 추천인 요청 버튼 (7명 미만일 때만) */}
                  {networkData.recommenders.length < 7 && (
                    <Button 
                      type="button"
                      disabled={isRequesting}
                      onClick={() => sendRecommenderRequest(selectedUser.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isRequesting ? '처리 중...' : '추천인 요청하기'}
                    </Button>
                  )}
                  
                  {/* 예비 추천인 등록 버튼 (7명 등록 완료 시에만) */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddRecommender(false);
                        setRecommenderSearchQuery('');
                        setRecommenderSearchResults([]);
                        setSelectedUser(null);
                      }}
                    >
                      취소
                    </Button>
                    
                    {selectedUser && !selectedUser.isAlreadyRecommender && !selectedUser.isAlreadyBackup && (
                      <div className="flex gap-2">
                        {/* 메인 추천인 요청 버튼 */}
                        {networkData.recommenders.length < 7 && (
                          <Button 
                            type="button"
                            disabled={isRequesting}
                            onClick={() => sendRecommenderRequest(selectedUser.id)}
                            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                          >
                            <Users className="h-4 w-4" />
                            {isRequesting ? '처리 중...' : '메인 추천인 요청'}
                          </Button>
                        )}
                        
                        {/* 예비 추천인 등록 버튼 */}
                        {networkData.recommenders.length >= 7 && (
                          <Button 
                            type="button"
                            disabled={isRequesting}
                            onClick={() => addToBackupRecommenders(selectedUser.id)}
                            className="bg-amber-600 hover:bg-amber-700 flex items-center gap-2"
                          >
                            <Clock className="h-4 w-4" />
                            {isRequesting ? '처리 중...' : '예비 추천인 등록'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 인증 요청 모달 */}
      <Dialog open={!!certificationRequestTarget} onOpenChange={closeCertificationRequestModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>운영 피어몰 선택</DialogTitle>
          </DialogHeader>
          {certificationRequestTarget && (
            <div>
              <div className="mb-2 text-sm">
                {certificationRequestTarget.name}님에게 인증 요청을 보낼 피어몰을 선택하세요.
              </div>
              <select
                className="w-full border rounded p-2 mb-4"
                value={selectedOperatedMallId || ''}
                onChange={e => setSelectedOperatedMallId(Number(e.target.value))}
              >
                <option value="">피어몰 선택</option>
                {myOperatedMalls.map((mall) => (
                  <option key={mall.id} value={mall.id}>{mall.name}</option>
                ))}
              </select>
              <Button
                size="sm"
                className="w-full"
                disabled={!selectedOperatedMallId}
                onClick={() => sendCertificationRequest(certificationRequestTarget, selectedOperatedMallId)}
              >
                인증 요청 보내기
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 요청 액션 모달 (조건부 수락, 거부, 보류) */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {requestAction?.type === 'conditional_accept' && '조건부 수락'}
              {requestAction?.type === 'reject' && '요청 거부'}
              {requestAction?.type === 'hold' && '요청 보류'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              {/* 요청자 정보 */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedRequest.user.image} />
                  <AvatarFallback>{selectedRequest.user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedRequest.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedRequest.user.peerId && `ID: ${selectedRequest.user.peerId}`}
                  </p>
                </div>
              </div>

              {/* 조건부 수락 옵션 */}
              {requestAction?.type === 'conditional_accept' && (
                <div className="space-y-3">
                  <h4 className="font-medium">추천인 역할 범위 설정</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'passwordRecovery', label: '비밀번호 복구 지원' },
                      { key: 'emergencyContact', label: '긴급 연락 대응' },
                      { key: 'identityVerification', label: '신원 보증' },
                      { key: 'networkExpansion', label: '네트워크 확장 지원' }
                    ].map((option) => (
                      <label key={option.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">연락 가능 시간</label>
                    <select className="w-full border rounded p-2 text-sm">
                      <option value="anytime">언제든지</option>
                      <option value="business">업무시간 (9-18시)</option>
                      <option value="evening">저녁시간 (18-22시)</option>
                      <option value="emergency">긴급시에만</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">추천인 역할 기간</label>
                    <select className="w-full border rounded p-2 text-sm">
                      <option value="permanent">영구</option>
                      <option value="1year">1년</option>
                      <option value="6months">6개월</option>
                      <option value="3months">3개월 (시범)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 거부 사유 선택 */}
              {requestAction?.type === 'reject' && (
                <div className="space-y-3">
                  <h4 className="font-medium">거부 사유 (선택사항)</h4>
                  <div className="space-y-2">
                    {[
                      '잘 모르는 사람이라서',
                      '현재 추천인 역할을 할 여건이 안 됨',
                      '요청자의 활동이 신뢰하기 어려움',
                      '이미 추천인 역할이 많아서',
                      '기타'
                    ].map((reason) => (
                      <label key={reason} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="rejectReason"
                          value={reason}
                          className="border-gray-300"
                        />
                        <span className="text-sm">{reason}</span>
                      </label>
                    ))}
                  </div>
                  <textarea
                    placeholder="추가 메시지 (선택사항)"
                    className="w-full border rounded p-2 text-sm h-20 resize-none"
                  />
                </div>
              )}

              {/* 보류 기간 설정 */}
              {requestAction?.type === 'hold' && (
                <div className="space-y-3">
                  <h4 className="font-medium">검토 기간 설정</h4>
                  <select className="w-full border rounded p-2 text-sm">
                    <option value="7">7일 후 재검토</option>
                    <option value="14">14일 후 재검토</option>
                    <option value="30">30일 후 재검토</option>
                  </select>
                  <textarea
                    placeholder="보류 사유 (선택사항)"
                    className="w-full border rounded p-2 text-sm h-20 resize-none"
                  />
                </div>
              )}

              {/* 액션 버튼 */}
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowActionModal(false)}
                  disabled={isProcessingRequest}
                >
                  취소
                </Button>
                <Button 
                  onClick={() => {
                    if (requestAction?.type === 'conditional_accept') {
                      handleConditionalAccept(selectedRequest.id, {});
                    } else if (requestAction?.type === 'reject') {
                      handleRejectRequest(selectedRequest.id);
                    } else if (requestAction?.type === 'hold') {
                      handleHoldRequest(selectedRequest.id, 7);
                    }
                  }}
                  disabled={isProcessingRequest}
                  className={
                    requestAction?.type === 'reject' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : requestAction?.type === 'hold'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }
                >
                  {isProcessingRequest ? '처리 중...' : 
                  requestAction?.type === 'conditional_accept' ? '조건부 수락' :
                  requestAction?.type === 'reject' ? '거부하기' :
                  requestAction?.type === 'hold' ? '보류하기' : '확인'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 네트워크 정보 모달 */}
      <Dialog open={showNetworkInfo} onOpenChange={setShowNetworkInfo}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>네트워크 관계 정보</DialogTitle>
          </DialogHeader>
          
          {networkInfoUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={networkInfoUser.image} />
                  <AvatarFallback>{networkInfoUser.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{networkInfoUser.name}</p>
                  <p className="text-sm text-gray-500">{networkInfoUser.peerId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">공통 연결</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {networkInfoUser.commonConnections || 0}명
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-800">연결 단계</p>
                  <p className="text-2xl font-bold text-green-600">
                    {networkInfoUser.connectionLevel || 0}단계
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-800">현재 추천인</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {networkInfoUser.currentRecommenders || 0}/7
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="font-medium text-amber-800">네트워크 건강성</p>
                  <p className="text-lg font-bold text-amber-600">
                    {networkInfoUser.networkHealth === 'high' ? '높음' :
                    networkInfoUser.networkHealth === 'medium' ? '보통' : '낮음'}
                  </p>
                </div>
              </div>
              
              {networkInfoUser.trustScore && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800 mb-2">신뢰도 점수</p>
                  <div className="flex items-center gap-2">
                    <Progress value={networkInfoUser.trustScore} className="flex-1" />
                    <span className="text-sm font-medium">{networkInfoUser.trustScore}/100</span>
                  </div>
                </div>
              )}
              
              {networkInfoUser.recentActivity && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">최근 활동</p>
                  <p className="text-sm text-gray-600 mt-1">{networkInfoUser.recentActivity}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};


export default NetworkSection;