
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  User, LayoutDashboard, Users, Award, 
  BookOpen, MessageCircle, Bell, Search 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="bg-white w-60 rounded-2xl p-5 flex flex-col gap-6 shadow-sm">
      <div className="flex items-center gap-2.5 ml-2">
        <div className="w-8 h-8">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 6C13.93 6 15.5 7.57 15.5 9.5C15.5 11.43 13.93 13 12 13C10.07 13 8.5 11.43 8.5 9.5C8.5 7.57 10.07 6 12 6ZM12 20C9.97 20 8.1 19.33 6.66 18.12C6.23 17.78 5.96 17.28 5.96 16.76C5.96 14.92 7.44 13.44 9.28 13.44H14.72C16.56 13.44 18.04 14.92 18.04 16.76C18.04 17.28 17.77 17.78 17.34 18.12C15.9 19.33 14.03 20 12 20Z" fill="#1891FF"/>
          </svg>
        </div>
        <h1 className="text-xl font-bold">PeerMall</h1>
      </div>

      <nav className="flex flex-col gap-1.5">
        <Link to="/" className="nav-item active">
          <LayoutDashboard className="w-5 h-5" />
          <span>개요</span>
        </Link>
        <Link to="/community" className="nav-item">
          <BookOpen className="w-5 h-5" />
          <span>커뮤니티</span>
        </Link>
        <Link to="/peers" className="nav-item">
          <Users className="w-5 h-5" />
          <span>피어</span>
        </Link>
        <Link to="/achievements" className="nav-item">
          <Award className="w-5 h-5" />
          <span>인증 & 뱃지</span>
        </Link>
        <Link to="/messages" className="nav-item">
          <MessageCircle className="w-5 h-5" />
          <span>메세지</span>
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <button className="flex items-center justify-center gap-2 w-full bg-peermall-gray rounded-lg p-3 text-peermall-dark-gray">
          <Search className="w-5 h-5" />
          <span className="font-medium">검색</span>
        </button>
        <div className="flex items-center gap-3 p-2">
          <div className="relative">
            <User className="w-9 h-9 bg-peermall-light-gray p-1.5 rounded-full" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-peermall-green rounded-full border-2 border-white"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">내 피어몰</span>
            <span className="text-xs text-muted-foreground">BlackLead</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
