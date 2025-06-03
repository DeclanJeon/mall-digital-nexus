
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  Info,
  Users,
  Package,
  Calendar,
  Megaphone,
  LifeBuoy,
  Bell,
  UserRound,
  MessageSquare,
  LogOut,
  Settings,
} from 'lucide-react';

interface PeerSpaceTopBarProps {
  mallData: {
    id: string;
    title: string;
    owner: string;
    profileImage: string;
  };
  isOwner: boolean;
  onAddContent: () => void;
  onCustomize: () => void;
}

export const PeerSpaceTopBar = ({ mallData, isOwner, onAddContent, onCustomize }: PeerSpaceTopBarProps) => {
  const navItems = [
    { label: '홈', icon: Home, link: `/peer-space/${mallData.id}` },
    { label: '소개', icon: Info, link: `/peer-space/${mallData.id}/about` },
    { label: '커뮤니티', icon: Users, link: `/peer-space/${mallData.id}/community` },
    { label: '제품/콘텐츠', icon: Package, link: `/peer-space/${mallData.id}/products` },
    { label: '이벤트', icon: Calendar, link: `/peer-space/${mallData.id}/events` },
    { label: '광고/홍보', icon: Megaphone, link: `/peer-space/${mallData.id}/ads` },
    { label: '고객지원', icon: LifeBuoy, link: `/peer-space/${mallData.id}/support` },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={mallData.profileImage} alt={mallData.owner} />
            <AvatarFallback>{mallData.owner[0]}</AvatarFallback>
          </Avatar>
          <span className="font-bold text-lg hidden md:inline">{mallData.title}</span>
        </div>

        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.link}
              className="px-3 py-2 rounded-md text-sm font-medium text-text-200 hover:text-accent-100 hover:bg-accent-100/10 transition-colors flex items-center gap-1.5"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <Button variant="outline" onClick={onCustomize} className="hidden sm:inline-flex">
                <Settings className="h-4 w-4 mr-1" /> 꾸미기
              </Button>
              <Button onClick={onAddContent}>
                콘텐츠 추가
              </Button>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                새로운 메시지
              </DropdownMenuItem>
              <DropdownMenuItem>
                새로운 팔로워
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                알림 히스토리 보기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserRound className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> 관리
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="mr-2 h-4 w-4" /> 쪽지함
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" /> 로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default PeerSpaceTopBar;
