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
    setIsLoggedIn(false);
    setNotifications([]);
    window.location.reload();
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
    <header className="bg-white shadow-sm">
      {/* Main Header */}
      <div className="mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left Side - Bookmark and Search */}
          <div className="flex items-center space-x-4">
            {/* <Bookmark className="h-6 w-6 text-gray-600" />
            <Search className="h-6 w-6 text-gray-600" /> */}
          </div>

          {/* Center - Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex flex-col gap-3 items-center space-x-2">

              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">
                  세상을 넓히는 연결의 시작
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-blue-600">PEER</span>
                <span className="text-3xl font-bold text-gray-800">MALL</span>
              </div>

            </div>
          </Link>

          {/* Right Side - Social Icons */}
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
              <div className="hidden md:flex items-center justify-end py-2">
                {isLoggedIn ? (
                  <div className="relative">
                    <div 
                      className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white cursor-pointer"
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
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    로그인
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center justify-center space-x-8 py-4 border-t border-gray-100">
          <Link to="/peermalls" className="text-gray-700 hover:text-blue-600 font-medium">피어몰 보러가기</Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">제품 보러가기</Link>
          <Link to="/create-qrcode" className="text-gray-700 hover:text-blue-600 font-medium">QR코드 만들기</Link>
          <Button
            onClick={() => {
              if (isAuthenticated) {
                handleCreateModalOpen();
              } else {
                handleLogin();
              }
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            <Store className="mr-2 h-4 w-4" />
            피어몰 만들기 ✨
          </Button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link to="/peermalls" className="py-2 text-gray-700 hover:text-blue-600">피어몰 보러가기</Link>
              <Link to="/products" className="py-2 text-gray-700 hover:text-blue-600">제품 보러가기</Link>
              <Link to="/create-qrcode" className="py-2 text-gray-700 hover:text-blue-600">QR코드 만들기</Link>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    handleCreateModalOpen();
                  } else {
                    handleLogin();
                  }
                }}
                className="py-2 text-left text-blue-600 hover:text-blue-700"
              >
                피어몰 만들기
              </button>

              {isLoggedIn ? (
                <>
                  <Link to="/my-info" className="py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>내 정보</Link>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="py-2 text-left text-gray-700 hover:text-blue-600"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
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
        onSuccess={(peermallData: CreatePeermallSuccessData) => {
          handleCreatePeermall(peermallData);
        }}
      />
    </header>
  );
};

export default Header;
