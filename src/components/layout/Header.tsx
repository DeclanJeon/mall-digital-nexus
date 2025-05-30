import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, X, User, Store, CheckCircle, MessageSquare, ShoppingCart, Tag, Bookmark, Instagram, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CreatePeermallModal from '@/components/peermall-features/CreatePeermallModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CreatePeermall from '@/components/peermall-features/CreatePeermall';
import { peermallStorage } from '@/services/storage/peermallStorage';
import { toast } from '@/hooks/use-toast';
import { CreatePeermallSuccessData, Peermall } from '@/types/peermall';
import { useAuth } from '@/hooks/useAuth';

interface Notification {
  id: string;
  type: 'new_comment' | 'new_order' | 'quest_completed' | 'new_follower' | 'system';
  message: string;
  link?: string;
  timestamp: Date; 
  read: boolean;
  icon?: React.ElementType;
  relatedUser?: string;
}

const Header = () => {
  const { isAuthenticated } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMySpacesOpen, setIsMySpacesOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mySpaces, setMySpaces] = useState<Peermall[]>([]);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const mockNotifications: Notification[] = [
    { id: '1', type: 'new_comment', message: '새로운 댓글이 달렸습니다: "정말 멋진 공간이네요!"', link: '/community/post/123', timestamp: new Date(Date.now() - 3600000), read: false, icon: MessageSquare, relatedUser: '피어몰러버' },
    { id: '2', type: 'new_order', message: '새로운 주문이 들어왔습니다: "피어몰 티셔츠 외 2건"', link: '/my-info/orders/456', timestamp: new Date(Date.now() - 7200000), read: false, icon: ShoppingCart },
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

  const handleCreatePeermall = (peermallData: CreatePeermallSuccessData) => {
    const updatedMalls = peermallStorage.getAll();
    setMySpaces(updatedMalls);

    toast({
      title: "피어몰 생성 완료! ",
      description: `${peermallData.title} 피어몰이 성공적으로 생성되었습니다.`,
    });

    handleCreateModalClose();
    navigate(`/space/${peermallData.id}`);
  };

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
    
    if (userLoggedIn) {
      loadMySpaces();
      setNotifications(mockNotifications);
    }

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setNotifications([]);
    window.location.assign("/");
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => !prev);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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
    <header className="container bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50 sticky top-0 z-50">
      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex justify-between items-center py-6">
          {/* Left Side - Empty space for balance */}
          <div className="w-32 hidden lg:block"></div>

          {/* Center - Logo */}
          <Link to="/" className="flex items-center group">
            <div className="flex flex-col items-center space-y-3 transition-transform duration-300 group-hover:scale-105">
              {/* Tagline */}
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-semibold tracking-wide shadow-md">
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    세상을 넓히는 연결의 시작
                  </span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              </div>
              
              {/* Logo Text */}
              <div className="flex items-center space-x-1">
                <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent tracking-tight">
                  PEER
                </span>
                <span className="text-4xl font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight">
                  MALL
                </span>
              </div>
            </div>
          </Link>

          {/* Right Side - User Actions */}
          <div className="flex items-center space-x-4 w-32 justify-end">
            {isLoggedIn ? (
              <div className="relative">
                <div 
                  className="group h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  onClick={() => setIsMenuOpen(prev => !prev)}
                >
                  <User className="h-5 w-5" />
                </div>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100/50 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                    <Link 
                      to="/my-info" 
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors duration-200 rounded-xl mx-2"
                    >
                      <User className="h-4 w-4 mr-3 text-gray-500" />
                      내 정보
                    </Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50/80 hover:text-red-600 transition-colors duration-200 rounded-xl mx-2"
                    >
                      <X className="h-4 w-4 mr-3" />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={handleLogin}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                로그인
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden lg:flex items-center justify-center space-x-1 py-4 border-t border-gray-100/50">
          <Link 
            to="/peermalls" 
            className="px-6 py-3 text-gray-700 hover:text-blue-600 font-medium rounded-full hover:bg-blue-50/80 transition-all duration-200 hover:scale-105"
          >
            피어몰 보러가기
          </Link>
          <Link 
            to="/products" 
            className="px-6 py-3 text-gray-700 hover:text-blue-600 font-medium rounded-full hover:bg-blue-50/80 transition-all duration-200 hover:scale-105"
          >
            제품 보러가기
          </Link>
          <Link 
            to="/create-qrcode" 
            className="px-6 py-3 text-gray-700 hover:text-blue-600 font-medium rounded-full hover:bg-blue-50/80 transition-all duration-200 hover:scale-105"
          >
            QR코드 만들기
          </Link>
          <div className="px-2">
            <Button
              onClick={() => {
                if (isAuthenticated) {
                  handleCreateModalOpen();
                } else {
                  handleLogin();
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Store className="mr-2 h-5 w-5" />
              <span className="relative z-10">피어몰 만들기 ✨</span>
            </Button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100/50 animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-6 py-6">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/peermalls" 
                className="py-4 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                피어몰 보러가기
              </Link>
              <Link 
                to="/products" 
                className="py-4 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                제품 보러가기
              </Link>
              <Link 
                to="/create-qrcode" 
                className="py-4 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                QR코드 만들기
              </Link>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    handleCreateModalOpen();
                  } else {
                    handleLogin();
                  }
                  setIsMenuOpen(false);
                }}
                className="py-4 px-4 text-left text-blue-600 hover:text-blue-700 hover:bg-blue-50/80 rounded-xl transition-all duration-200 font-medium"
              >
                피어몰 만들기 ✨
              </button>

              {isLoggedIn ? (
                <>
                  <div className="border-t border-gray-100 my-4"></div>
                  <Link 
                    to="/my-info" 
                    className="py-4 px-4 text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-200 font-medium" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    내 정보
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="py-4 px-4 text-left text-gray-700 hover:text-red-600 hover:bg-red-50/80 rounded-xl transition-all duration-200 font-medium"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-3xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              내 스페이스
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {mySpaces.length > 0 ? (
              mySpaces.map((space) => (
                <div
                  key={space.id}
                  className="group flex items-center p-4 border border-gray-100 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  onClick={() => handleSelectSpace(space.id)}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mr-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                    <img
                      src={space.imageUrl}
                      alt={space.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                      {space.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">{space.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Store className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-semibold mb-2">생성된 스페이스가 없습니다.</p>
                <p className="text-sm text-gray-400">새로운 피어몰을 만들어보세요! ✨</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <CreatePeermallModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        onSuccess={(peermallData: CreatePeermallSuccessData) => {
          handleCreatePeermall(peermallData);
        }}
      />
    </header>
  );
};

export default Header;
