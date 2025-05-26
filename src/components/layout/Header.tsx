import React, { useState, useEffect, useRef } from 'react'; // useRef 추가
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, User, Store, CheckCircle, MessageSquare, ShoppingCart, Tag } from 'lucide-react'; // 아이콘 추가
import { Button } from '@/components/ui/button';
import CreatePeermallModal from '@/components/peermall-features/CreatePeermallModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Popover 추가

interface Peermall {
  id: string;
  title: string;
  description: string;
  type: string;
  imageUrl: string;
  owner: string;
}

// 알림 데이터 인터페이스 정의
interface Notification {
  id: string;
  type: 'new_comment' | 'new_order' | 'quest_completed' | 'new_follower' | 'system';
  message: string;
  link?: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ElementType; // 아이콘 컴포넌트 타입
  relatedUser?: string; // 관련 사용자 (예: 댓글 작성자)
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMySpacesOpen, setIsMySpacesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mySpaces, setMySpaces] = useState<Peermall[]>([]);
  const navigate = useNavigate();

  // 알림 관련 상태
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null); // Popover 외부 클릭 감지용

  // 임시 알림 데이터 (백엔드 연동 시 이 부분은 API 호출로 대체)
  const mockNotifications: Notification[] = [
    { id: '1', type: 'new_comment', message: '새로운 댓글이 달렸습니다: "정말 멋진 공간이네요!"', link: '/community/post/123', timestamp: new Date(Date.now() - 3600000), read: false, icon: MessageSquare, relatedUser: '피어몰러버' },
    { id: '2', type: 'new_order', message: '새로운 주문이 들어왔습니다: "피어몰 티셔츠 외 2건"', link: '/my-info/orders/456', timestamp: new Date(Date.now() - 7200000), read: false, icon: ShoppingCart },
    { id: '3', type: 'quest_completed', message: "'첫 피어몰 탐방' 퀘스트를 완료했습니다!", link: '/my-info/quests', timestamp: new Date(Date.now() - 10800000), read: true, icon: CheckCircle },
    { id: '4', type: 'new_follower', message: "'커뮤니티매니저'님이 회원님을 팔로우하기 시작했습니다.", link: '/profile/communitymanager', timestamp: new Date(Date.now() - 86400000), read: true, icon: User },
    { id: '5', type: 'system', message: "피어몰 시스템 점검 안내 (05/10 02:00 ~ 04:00)", timestamp: new Date(Date.now() - 172800000), read: true, icon: Tag },
  ];

  const handleCreateModalOpen = () => setIsCreateModalOpen(true);
  const handleCreateModalClose = () => setIsCreateModalOpen(false);
  
  const handleOpenMySpaces = () => {
    loadMySpaces();
    setIsMySpacesOpen(true);
  };
  
  const handleCloseMySpaces = () => {
    setIsMySpacesOpen(false);
  };

  // Load my spaces from localStorage
  const loadMySpaces = () => {
    try {
      const storedPeermalls = localStorage.getItem('peermalls');
      if (storedPeermalls) {
        const allPeermalls = JSON.parse(storedPeermalls);
        const filteredSpaces = allPeermalls.filter((mall: Peermall) => mall.owner === '나');
        setMySpaces(filteredSpaces);
      }
    } catch (error) {
      console.error('Error loading my spaces from localStorage:', error);
    }
  };

  const handleSelectSpace = (id: string) => {
    handleCloseMySpaces();
    navigate(`/space/${id}`);
  };

  // Handle successful peermall creation
  const handleCreateSuccess = (peermallData: { name: string; type: string; id: string }) => {
    // Close modal
    handleCreateModalClose();
    
    // Navigate to the new peermall
    navigate(`/space/${peermallData.id}`);
  };

  useEffect(() => {
    // Check if user is logged in using localStorage
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    
    // Initial load of my spaces
    if (userLoggedIn) {
      loadMySpaces();
      // 백엔드 연동 시: 실제 알림 데이터 로드
      // fetchNotifications();
      setNotifications(mockNotifications); // 임시 데이터 사용
    }

    // Popover 외부 클릭 시 닫기
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, []);

  // 백엔드 연동 시 사용할 알림 로드 함수 (예시)
  // const fetchNotifications = async () => {
  //   try {
  //     // const response = await api.get('/notifications'); // API 호출
  //     // setNotifications(response.data);
  //   } catch (error) {
  //     console.error("Error fetching notifications:", error);
  //   }
  // };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setNotifications([]); // 로그아웃 시 알림 초기화
    window.location.reload(); // Refresh to update all components
  };

  // 알림 아이콘 클릭 핸들러
  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
    // 백엔드 연동 시: 알림을 열 때 읽지 않은 알림 수를 초기화하거나,
    // 특정 알림을 읽음 처리하는 API를 호출할 수 있습니다.
  };

  // 알림 읽음 처리 핸들러 (UI 상에서만)
  const handleMarkAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // 백엔드 연동 시: 특정 알림을 읽음 처리하는 API 호출
    // try {
    //   await api.post(`/notifications/${id}/read`);
    // } catch (error) {
    //   console.error("Error marking notification as read:", error);
    // }
  };
  
  // 모든 알림 읽음 처리 핸들러 (UI 상에서만)
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
    // 백엔드 연동 시: 모든 알림을 읽음 처리하는 API 호출
    // try {
    //   await api.post('/notifications/mark-all-as-read');
    // } catch (error) {
    //   console.error("Error marking all notifications as read:", error);
    // }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // 시간 포맷 함수
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "년 전";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "달 전";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "일 전";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "시간 전";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "분 전";
    return Math.floor(seconds) + "초 전";
  };

  // 알림 아이콘 매핑
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'new_comment': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'new_order': return <ShoppingCart className="h-5 w-5 text-green-500" />;
      case 'quest_completed': return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case 'new_follower': return <User className="h-5 w-5 text-teal-500" />;
      case 'system': return <Tag className="h-5 w-5 text-gray-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };


  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-300">
            PeerMall
          </Link>

          {/* Search Bar (desktop) */}
          <div className="hidden md:flex items-center flex-1 mx-8">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-200"
                placeholder="피어몰, 제품 검색... "
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation Links (desktop) */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/shopping" className="text-text-200 hover:text-primary-300">제품/피어몰</Link>
            {/* <Link to="/curation-links" className="text-text-200 hover:text-primary-300">큐레이션</Link> */}
            {/* <Link to="/community" className="text-text-200 hover:text-primary-300">커뮤니티</Link> */}
            <Link to="/create-qrcode" className="text-text-200 hover:text-primary-300">QR코드 만들기</Link>
            {/* <Link to="/customer-support" className="text-text-200 hover:text-primary-300">고객센터</Link> */}
            
            <button
              onClick={handleCreateModalOpen}
              className="bg-primary-200 hover:bg-primary-300 text-white font-bold py-2 px-4 rounded"
            >
              피어몰 만들기
            </button>
          </nav>

          {/* User Actions (desktop) */}
          <div className="hidden md:flex items-center ml-6">
            {/* {isLoggedIn && ( // 로그인 상태일 때만 알림 아이콘 표시
            <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <PopoverTrigger asChild>
                <button onClick={toggleNotifications} className="p-2 relative">
                  <Bell className="h-5 w-5 text-text-200 hover:text-primary-300" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                ref={notificationRef}
                className="w-80 md:w-96 p-0 shadow-xl rounded-lg border"
                align="end"
              >
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">알림</h3>
                    {notifications.length > 0 && (
                      <Button variant="link" size="sm" onClick={handleMarkAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
                        모두 읽음
                      </Button>
                    )}
                  </div>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    새로운 알림이 없습니다.
                  </div>
                ) : (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                      >
                        <Link
                          to={notification.link || '#'}
                          onClick={() => {
                            handleMarkAsRead(notification.id);
                            setIsNotificationsOpen(false); // 링크 클릭 시 팝오버 닫기
                          }}
                          className="block"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 pt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                                {notification.relatedUser && <span className="font-bold">{notification.relatedUser}</span>}
                                {notification.relatedUser ? '님이 ' : ''}
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault(); // 링크 이동 방지
                                  e.stopPropagation(); // 이벤트 버블링 방지
                                  handleMarkAsRead(notification.id);
                                }}
                                className="p-1 rounded-full hover:bg-gray-200"
                                title="읽음으로 표시"
                              >
                                <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500" />
                              </button>
                            )}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-2 text-center border-t">
                  <Link to="/my-info/notifications" onClick={() => setIsNotificationsOpen(false)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    모든 알림 보기
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
            )} */}
            
            {isLoggedIn ? (
              <div className="relative ml-4">
                <div 
                  className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-white cursor-pointer"
                  onClick={() => setIsMenuOpen(prev => !prev)}
                >
                  <User className="h-5 w-5" />
                </div>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link to="/my-info" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">내 정보</Link>
                    <button 
                      onClick={handleOpenMySpaces}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      내 스페이스
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={handleLogin}
                className="ml-4 bg-primary-300 hover:bg-primary-400 text-white"
              >
                로그인
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-text-200" />
            ) : (
              <Menu className="h-6 w-6 text-text-200" />
            )}
          </button>
        </div>

        {/* Search Bar (mobile) */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-200"
              placeholder="피어몰, 피어스페이스, 콘텐츠 검색..."
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link to="/shopping" className="py-2 text-text-200 hover:text-primary-300">쇼핑</Link>
              <Link to="/curation-links" className="py-2 text-text-200 hover:text-primary-300">큐레이션</Link>
              <Link to="/community" className="py-2 text-text-200 hover:text-primary-300">커뮤니티</Link>
              {isLoggedIn && (
                <button 
                  onClick={handleOpenMySpaces}
                  className="py-2 text-left text-accent-200 hover:text-accent-100"
                >
                  내 스페이스
                </button>
              )}
              <button 
                onClick={handleCreateModalOpen}
                className="py-2 text-left text-accent-200 hover:text-accent-100"
              >
                피어몰 만들기
              </button>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  {/* 모바일 알림 아이콘 - 데스크탑과 동일한 Popover 사용 가능하나, UI/UX 고려하여 별도 처리 또는 버튼만 제공 */}
                  <Popover open={isNotificationsOpen && isMenuOpen} onOpenChange={(open) => { if (isMenuOpen) setIsNotificationsOpen(open); }}>
                    <PopoverTrigger asChild>
                      <button onClick={toggleNotifications} className="flex items-center justify-between py-2 w-full">
                        <div className="flex items-center">
                          <Bell className="h-5 w-5 text-text-200" />
                          <span className="ml-2 text-text-200">알림</span>
                        </div>
                        {unreadNotificationsCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      ref={notificationRef}
                      className="w-full p-0 shadow-xl rounded-lg border mt-1" // 모바일에서는 화면 너비에 맞게
                      align="start" // 모바일에서는 시작점에 맞춤
                    >
                      <div className="p-4 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-800">알림</h3>
                          {notifications.length > 0 && (
                          <Button variant="link" size="sm" onClick={handleMarkAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
                            모두 읽음
                          </Button>
                          )}
                        </div>
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          새로운 알림이 없습니다.
                        </div>
                      ) : (
                        <div className="max-h-[40vh] overflow-y-auto"> {/* 모바일 높이 조절 */}
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 border-b hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}
                            >
                              <Link
                                to={notification.link || '#'}
                                onClick={() => {
                                  handleMarkAsRead(notification.id);
                                  setIsNotificationsOpen(false);
                                  setIsMenuOpen(false); // 모바일 메뉴도 닫기
                                }}
                                className="block"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 pt-1">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>
                                      {notification.relatedUser && <span className="font-bold">{notification.relatedUser}</span>}
                                      {notification.relatedUser ? '님이 ' : ''}
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {formatTimeAgo(notification.timestamp)}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleMarkAsRead(notification.id);
                                      }}
                                      className="p-1 rounded-full hover:bg-gray-200"
                                      title="읽음으로 표시"
                                    >
                                      <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500" />
                                    </button>
                                  )}
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                       <div className="p-2 text-center border-t">
                        <Link
                          to="/my-info/notifications"
                          onClick={() => {
                            setIsNotificationsOpen(false);
                            setIsMenuOpen(false); // 모바일 메뉴도 닫기
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          모든 알림 보기
                        </Link>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
</div>
              {isLoggedIn ? (
                <>
                  <Link to="/my-info" className="py-2 text-text-200 hover:text-primary-300" onClick={() => setIsMenuOpen(false)}>내 정보</Link>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="py-2 text-left text-text-200 hover:text-primary-300"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                  className="mt-2 w-full bg-primary-300 hover:bg-primary-400 text-white"
                >
                  로그인
                </Button>
              )}
            </nav>
          </div>
        </div>
      )}
      
      {/* My Spaces Dialog */}
      <Dialog open={isMySpacesOpen} onOpenChange={handleCloseMySpaces}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>내 스페이스</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {mySpaces.length > 0 ? (
              mySpaces.map((space) => (
                <div
                  key={space.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleSelectSpace(space.id)}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden mr-4">
                    <img
                      src={space.imageUrl}
                      alt={space.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{space.title}</h3>
                    <p className="text-sm text-gray-500">{space.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">생성된 스페이스가 없습니다.</p>
                <p className="text-sm text-gray-400 mt-2">새로운 피어몰을 만들어보세요!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <CreatePeermallModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSuccess={handleCreateSuccess}
      />
    </header>
  );
};

export default Header;
