
import React from 'react';
import { Home, ShoppingBag, Users, Info, HelpCircle, Layers, MessageSquare, Map } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const CategoryNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const categories = [
    { name: '홈', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: '서비스', icon: <Layers className="h-5 w-5" />, path: '/service' },
    { name: '쇼핑', icon: <ShoppingBag className="h-5 w-5" />, path: '/shopping' },
    { name: '오픈채팅', icon: <MessageSquare className="h-5 w-5" />, path: '/openchat' },
    { name: '커뮤니티', icon: <Users className="h-5 w-5" />, path: '/community' },
    // { name: '소개', icon: <Info className="h-5 w-5" />, path: '/about' },
    // { name: '고객센터', icon: <HelpCircle className="h-5 w-5" />, path: '/help' },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto hide-scrollbar">
          {categories.map((category, index) => (
            <Link 
              key={index} 
              to={category.path}
              className={`flex flex-col items-center px-4 py-2 text-sm whitespace-nowrap ${
                currentPath === category.path ? 'text-accent-200' : 'text-text-200 hover:text-accent-200'
              } transition-colors`}
            >
              {category.icon}
              <span className="mt-1">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
