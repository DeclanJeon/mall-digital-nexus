import React, { useState, useEffect } from 'react';
import CreatePeermallModal from './CreatePeermallModal';
import PeermallMap from './PeermallMap'; 
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, Bell, Home, ShoppingBag, Users, Layers, Map, UserCircle, LogOut, Settings, MessageSquare, LogIn, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCreatePeermallModalOpen, setIsCreatePeermallModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false); 
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', content: '박성민님이 새로운 메시지를 보냈습니다.', time: '5분 전', read: false },
    { id: 2, type: 'purchase', content: '홍길동님이 디지털 아트워크를 구매했습니다.', time: '25분 전', read: false },
    { id: 3, type: 'like', content: '김영희님이 당신의 피어몰을 좋아합니다.', time: '1시간 전', read: true },
    { id: 4, type: 'review', content: '최우진님이 상품에 5점 리뷰를 남겼습니다.', time: '3시간 전', read: true },
    { id: 5, type: 'trending', content: '당신의 피어몰이 디자인 카테고리에서 인기 상승 중입니다.', time: '5시간 전', read: true }
  ]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const handleOpenMap = () => setIsMapOpen(true);
  const handleCloseMap = () => setIsMapOpen(false);

  const selectedLocation = null; 
  const allLocations = [ 
      { lat: 37.5665, lng: 126.9780, address: '서울 시청', title: '서울 시청' },
      { lat: 37.5796, lng: 126.9770, address: '경복궁', title: '경복궁' },
  ];

  const navigationItems = [
    { name: '홈', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: '쇼핑', icon: <ShoppingBag className="h-5 w-5" />, path: '/shopping' },
    { name: '커뮤니티', icon: <Users className="h-5 w-5" />, path: '/community' },
    { name: '서비스', icon: <Layers className="h-5 w-5" />, path: '/service' }, 
  ];

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setIsLoggedIn(false);
          return;
        }
        const response = await axios.get('http://localhost:9393/v1/users/find/myMalls', {
          headers: {
            Authorization: `Bearer ${accessToken.trim()}` // Trim the token to remove any whitespace
          }
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      // Remove tokens from local storage or context
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-primary-300">
            <span className="text-accent-200">Peer</span>mall
          </h1>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="콘텐츠 또는 피어몰 검색"
              className="w-full py-2 pl-10 pr-4 text-text-200 bg-bg-200 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-100"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-text-200" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <span> 
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="bg-white rounded-lg shadow-lg max-h-96">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold">알림</h3>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8">
                        모두 읽음 표시
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowNotifications(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-80">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b hover:bg-bg-100 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start">
                            <div className="bg-bg-100 p-2 rounded-full mr-3">
                              <Bell className="h-4 w-4 text-accent-200" />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                                {notification.content}
                              </p>
                              <span className="text-xs text-text-200">{notification.time}</span>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center text-text-200">알림이 없습니다</div>
                    )}
                  </div>
                  <div className="p-3 border-t text-center">
                    <Link to="/notifications" className="text-accent-200 text-sm hover:underline">
                      모든 알림 보기
                    </Link>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Peer map Button */}
            <Button variant="outline" size="sm" onClick={handleOpenMap}> 
              <Map className="h-4 w-4 mr-2"/> 피어맵
            </Button>
            
            {/* Conditional Login/Profile Button */}
            {isLoggedIn ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="flex flex-col gap-1">
                    <Button 
                      variant="ghost" 
                      className="justify-start gap-2"
                      onClick={() => navigate('/my-info')}
                    >
                      <Settings className="h-4 w-4" />
                      내정보관리
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start gap-2"
                      onClick={() => navigate('/messages')}
                    >
                      <MessageSquare className="h-4 w-4" />
                      쪽지함
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="justify-start gap-2 text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      로그아웃
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link to="/login" className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  로그인
                </Link>
              </Button>
            )}
            
            <Button 
              onClick={() => setIsCreatePeermallModalOpen(true)} 
              variant="default" 
              size="sm" 
              className="bg-primary-100 hover:bg-accent-100 text-text-100"
            >
              피어몰 만들기
            </Button>
            
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Mobile Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
          
          {/* Mobile Menu */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <h2 className="text-xl font-bold">메뉴</h2>
                  {/* Mobile Login/Profile */}
                  {isLoggedIn ? (
                     <Button variant="ghost" size="sm" asChild>
                       <Link to="/my-info" className="flex items-center">
                         <UserCircle className="h-5 w-5 mr-2" />
                         내 정보
                       </Link>
                     </Button>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/login" className="flex items-center">
                        <LogIn className="h-4 w-4 mr-2" />
                        로그인
                      </Link>
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="flex items-center p-3 hover:bg-bg-200 rounded-lg"
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  ))}
                  
                  {isLoggedIn ? (
                    <div className="border-t pt-4 space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2"
                        onClick={() => navigate('/my-info')}
                      >
                        <Settings className="h-4 w-4" />
                        내정보관리
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2"
                        onClick={() => navigate('/messages')}
                      >
                        <MessageSquare className="h-4 w-4" />
                        쪽지함
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4" />
                        로그아웃
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate('/login')}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      로그인
                    </Button>
                  )}
                  
                </div>
                
                <div className="border-t pt-4">
                  <Button className="w-full" onClick={() => setIsCreatePeermallModalOpen(true)}>
                    피어몰 만들기
                  </Button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Create Peermall Modal */}
      <CreatePeermallModal 
        isOpen={isCreatePeermallModalOpen}
        onClose={() => setIsCreatePeermallModalOpen(false)}
      />

      {/* PeermallMap 컴포넌트 조건부 렌더링 */}
      {isMapOpen && (
        <PeermallMap 
          isOpen={isMapOpen}
          onClose={handleCloseMap}
          selectedLocation={selectedLocation}
          allLocations={allLocations}
        />
      )}
    </header>
  );
};

export default Header;
