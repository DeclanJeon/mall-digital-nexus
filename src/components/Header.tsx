
import React from 'react';
import { Search, User, Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary-300">
            <span className="text-accent-200">Peer</span>mall
          </h1>
        </div>

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

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-accent-100 rounded-full"></span>
          </Button>
          
          <Button variant="outline" size="sm" className="hidden md:flex">
            <User className="h-4 w-4 mr-2" />
            로그인
          </Button>
          
          <Button variant="default" size="sm" className="hidden md:flex bg-primary-100 hover:bg-accent-100 text-text-100">
            피어몰 만들기
          </Button>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
