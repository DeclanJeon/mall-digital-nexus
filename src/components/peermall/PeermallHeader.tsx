
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

interface PeermallHeaderProps {
  peermall: any;
}

const PeermallHeader: React.FC<PeermallHeaderProps> = ({ peermall }) => {
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to={`/peermall/${peermall.id}`} className="flex items-center">
          <h1 className="text-2xl font-montserrat font-bold">
            <span className="text-accent-200">{peermall.title}</span>
          </h1>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to={`/peermall/${peermall.id}`} className="font-medium text-primary-300 hover:text-accent-200 transition-colors">
            홈
          </Link>
          <Link to={`/peermall/${peermall.id}?tab=products`} className="font-medium text-primary-300 hover:text-accent-200 transition-colors">
            제품
          </Link>
          <Link to={`/peermall/${peermall.id}?tab=community`} className="font-medium text-primary-300 hover:text-accent-200 transition-colors">
            커뮤니티
          </Link>
          <Link to={`/peermall/${peermall.id}?tab=about`} className="font-medium text-primary-300 hover:text-accent-200 transition-colors">
            소개
          </Link>
          <Link to={`/peermall/${peermall.id}?tab=contact`} className="font-medium text-primary-300 hover:text-accent-200 transition-colors">
            연락처
          </Link>
        </nav>
        
        {/* Search and Cart */}
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Input
              type="search"
              placeholder="검색..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="py-4">
                <h2 className="text-xl font-bold mb-4">{peermall.title}</h2>
                <div className="mb-6">
                  <Input
                    type="search"
                    placeholder="검색..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm mb-4"
                  />
                </div>
                <nav className="flex flex-col space-y-4">
                  <Link to={`/peermall/${peermall.id}`} className="font-medium p-2 hover:bg-gray-50 rounded-md">
                    홈
                  </Link>
                  <Link to={`/peermall/${peermall.id}?tab=products`} className="font-medium p-2 hover:bg-gray-50 rounded-md">
                    제품
                  </Link>
                  <Link to={`/peermall/${peermall.id}?tab=community`} className="font-medium p-2 hover:bg-gray-50 rounded-md">
                    커뮤니티
                  </Link>
                  <Link to={`/peermall/${peermall.id}?tab=about`} className="font-medium p-2 hover:bg-gray-50 rounded-md">
                    소개
                  </Link>
                  <Link to={`/peermall/${peermall.id}?tab=contact`} className="font-medium p-2 hover:bg-gray-50 rounded-md">
                    연락처
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PeermallHeader;
