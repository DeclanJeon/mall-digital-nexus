
import React, { useState } from 'react';
import CreatePeermallModal from './CreatePeermallModal';
import { Link } from 'react-router-dom';
import { Search, User, Menu, Bell, Home, ShoppingBag, Users, Info, HelpCircle, LogIn, X, Layers } from 'lucide-react'; // Layers 아이콘 추가
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCreatePeermallModalOpen, setIsCreatePeermallModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'message', content: '박성민님이 새로운 메시지를 보냈습니다.', time: '5분 전', read: false },
    { id: 2, type: 'purchase', content: '홍길동님이 디지털 아트워크를 구매했습니다.', time: '25분 전', read: false },
    { id: 3, type: 'like', content: '김영희님이 당신의 피어몰을 좋아합니다.', time: '1시간 전', read: true },
    { id: 4, type: 'review', content: '최우진님이 상품에 5점 리뷰를 남겼습니다.', time: '3시간 전', read: true },
    { id: 5, type: 'trending', content: '당신의 피어몰이 디자인 카테고리에서 인기 상승 중입니다.', time: '5시간 전', read: true }
  ]);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const navigationItems = [
    { name: '홈', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: '쇼핑', icon: <ShoppingBag className="h-5 w-5" />, path: '/shopping' },
    { name: '커뮤니티', icon: <Users className="h-5 w-5" />, path: '/community' },
    { name: '서비스', icon: <Layers className="h-5 w-5" />, path: '/service' }, // 서비스 링크 추가
    { name: '소개', icon: <Info className="h-5 w-5" />, path: '/about' },
    { name: '고객센터', icon: <HelpCircle className="h-5 w-5" />, path: '/help' },
  ];

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
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
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
            
            {/* Login Button */}
            <Button variant="outline" size="sm" asChild>
              <Link to="/login" className="flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                로그인
              </Link>
            </Button>
            
            {/* Create Peermall Button */}
            <Button 
              onClick={() => setIsCreatePeermallModalOpen(true)} 
              variant="default" 
              size="sm" 
              className="bg-primary-100 hover:bg-accent-100 text-text-100"
            >
              피어몰 만들기
            </Button>
            
            {/* Dynamic Links Button */}
            {/* <Button variant="outline" size="sm" asChild>
              <Link to="/curation-links">큐레이션 링크</Link>
            </Button> */}
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
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login" className="flex items-center">
                      <LogIn className="h-4 w-4 mr-2" />
                      로그인
                    </Link>
                  </Button>
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
                </div>
                
                <div className="border-t pt-4">
                  <Button className="w-full" asChild>
                    <Link to="/create">피어몰 만들기</Link>
                  </Button>
                  
                  {/* <Button variant="outline" className="w-full mt-2" asChild>
                    <Link to="/curation-links">큐레이션 링크</Link>
                  </Button> */}
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
    </header>
  );
};

export default Header;
