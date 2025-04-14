
import React from 'react';
import { Home, ShoppingBag, Users, MessageSquare, Info, HelpCircle, Store, Hash } from 'lucide-react';

const CategoryNav = () => {
  const categories = [
    { name: '홈', icon: <Home className="h-5 w-5" /> },
    { name: '쇼핑', icon: <ShoppingBag className="h-5 w-5" /> },
    { name: '커뮤니티', icon: <Users className="h-5 w-5" /> },
    { name: '메시지', icon: <MessageSquare className="h-5 w-5" /> },
    { name: '소개', icon: <Info className="h-5 w-5" /> },
    { name: '고객센터', icon: <HelpCircle className="h-5 w-5" /> },
  ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto hide-scrollbar">
          {categories.map((category, index) => (
            <a 
              key={index} 
              href="#" 
              className={`flex flex-col items-center px-4 py-2 text-sm whitespace-nowrap ${
                index === 0 ? 'text-accent-200' : 'text-text-200 hover:text-accent-200'
              } transition-colors`}
            >
              {category.icon}
              <span className="mt-1">{category.name}</span>
            </a>
          ))}
          
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
