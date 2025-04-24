
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Menu, Search, Bell, User, Plus, Palette } from 'lucide-react';

import { PeerMallConfig } from './types';

interface PeerSpaceHeaderProps {
  config: PeerMallConfig;
  isOwner: boolean;
  onAddContent: () => void;
}

const PeerSpaceHeader: React.FC<PeerSpaceHeaderProps> = ({
  config,
  isOwner,
  onAddContent
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: '홈', link: `/peermall/${config.id}` },
    { label: '콘텐츠', link: `/peermall/${config.id}/content` },
    { label: '커뮤니티', link: `/peermall/${config.id}/community` },
    { label: '이벤트', link: `/peermall/${config.id}/events` },
    { label: '소개', link: `/peermall/${config.id}/about` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={config.profileImage} alt={config.title} />
            <AvatarFallback>{config.title.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="font-bold text-lg hidden md:inline">{config.title}</span>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm ml-6">
            {navItems.map(item => (
              <Link 
                key={item.label} 
                to={item.link} 
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="검색어를 입력하세요" 
              className="h-9 pl-10 rounded-full bg-gray-100 border-gray-200"
            />
          </div>
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isOwner && (
            <>
              <Button 
                size="sm" 
                variant="outline"
                className="hidden sm:inline-flex items-center gap-1"
              >
                <Palette className="h-4 w-4" /> 꾸미기
              </Button>
              <Button 
                size="sm" 
                onClick={onAddContent}
                className="bg-blue-500 hover:bg-blue-600 text-white items-center gap-1"
              >
                <Plus className="h-4 w-4" /> 추가
              </Button>
            </>
          )}
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden lg:inline-flex">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-md">
          <nav className="container mx-auto px-4 py-2 space-y-1">
            {navItems.map(item => (
              <Link 
                key={item.label} 
                to={item.link} 
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-md"
              >
                {item.label}
              </Link>
            ))}
            <div className="relative mt-2 p-2">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="검색어를 입력하세요" 
                className="h-9 pl-10 rounded-full bg-gray-100 border-gray-200"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default PeerSpaceHeader;
