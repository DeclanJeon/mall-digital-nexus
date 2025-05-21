
import React from 'react';
import { Bell, Search, ChevronRight } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">안녕하세요, 피어님!</h1>
        <p className="text-muted-foreground">당신의 디지털 공간을 자율적으로 운영해보세요.</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="p-2 bg-white rounded-full shadow-sm">
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="relative">
          <button className="p-2 bg-white rounded-full shadow-sm">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-peermall-pink rounded-full"></span>
          </button>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
          <div className="w-8 h-8 bg-peermall-blue rounded-full flex items-center justify-center text-white font-medium">P</div>
          <span className="font-medium">BlackLead</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default Header;
