
import React from 'react';
import { Home, ShoppingBag, Users, Info, HelpCircle, Store, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryNav = () => {
  const categories = [
    { name: '홈', icon: <Home className="h-5 w-5" />, path: '/' },
    { name: '쇼핑', icon: <ShoppingBag className="h-5 w-5" />, path: '/shopping' },
    { name: '커뮤니티', icon: <Users className="h-5 w-5" />, path: '/community' },
    { name: '소개', icon: <Info className="h-5 w-5" />, path: '/about' },
    { name: '고객센터', icon: <HelpCircle className="h-5 w-5" />, path: '/help' },
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
                index === 0 ? 'text-accent-200' : 'text-text-200 hover:text-accent-200'
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
