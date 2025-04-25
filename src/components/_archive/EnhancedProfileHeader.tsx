
import React from 'react';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback 
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Users, 
  Star, 
  Award, 
  GitBranch, 
  MessageSquare, 
  Share2, 
  QrCode, 
  ScreenShare, 
  RadioTower, 
  Gift, 
  ImageIcon,
  Plus
} from 'lucide-react';
import { BadgeData } from './types';

interface EnhancedProfileHeaderProps {
  profileData: {
    id: string;
    title: string;
    description: string;
    owner: string;
    peerNumber: string;
    profileImage: string;
    coverImage?: string;
    badges: string[];
    followers: number;
    recommendations: number;
    level: number;
    xp: number;
    xpToNextLevel: number;
    isVerified?: boolean;
    familyGuilds?: { id: string; name: string; imageUrl: string }[];
    customizations?: {
      showBadges?: boolean;
    };
  };
  badgesData: BadgeData[];
  isOwner: boolean;
  onFollow: () => void;
  onMessage: () => void;
  onShowQR: () => void;
  onShare: () => void;
  onChangeCover?: () => void;
}

export const EnhancedProfileHeader = ({ 
  profileData, 
  badgesData, 
  isOwner, 
  onFollow, 
  onMessage, 
  onShowQR,
  onShare,
  onChangeCover
}: EnhancedProfileHeaderProps) => {
  return (
    <>
      {/* Cover Image Section */}
      <section className="relative h-48 md:h-64 bg-gray-300 mb-[-4rem] md:mb-[-6rem] z-0 group">
        {profileData.coverImage ? (
          <img 
            src={profileData.coverImage} 
            alt={`${profileData.title} Cover`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-200 to-accent-100 flex items-center justify-center">
            <Star className="h-12 w-12 text-white opacity-60"/>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        {isOwner && (
          <Button 
            size="sm" 
            variant="secondary" 
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" 
            onClick={onChangeCover}
          >
            <ImageIcon className="h-4 w-4 mr-1"/> 커버 변경
          </Button>
        )}
      </section>
      
      {/* Profile Details Section */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 mb-8 md:mb-12 bg-white shadow-xl rounded-xl p-6 md:p-8 relative -mt-16 md:-mt-24 border border-gray-100">
        <div className="relative">
          <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-white shadow-lg">
            <AvatarImage src={profileData.profileImage} alt={profileData.owner} />
            <AvatarFallback className="text-5xl">{profileData.owner.substring(0,1)}</AvatarFallback>
          </Avatar>
          {profileData.isVerified && (
            <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
              <ShieldCheck className="h-5 w-5" />
            </div>
          )}
        </div>
        
        <div className="flex-grow text-center md:text-left mt-4 md:mt-0">
          <h1 className="text-3xl md:text-4xl font-bold text-text-100 flex items-center justify-center md:justify-start gap-3">
            {profileData.title}
          </h1>
          <p className="text-base text-text-200 mt-2 px-4 md:px-0">{profileData.description}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-text-200 mt-4">
            <span className="flex items-center"><Users className="h-4 w-4 mr-2"/> {profileData.followers} 팔로워</span>
            <span className="flex items-center"><Star className="h-4 w-4 mr-2 text-yellow-400"/> {profileData.recommendations} 추천</span>
            <span className="flex items-center"><Award className="h-4 w-4 mr-2 text-green-500"/> 레벨 {profileData.level}</span>
            {profileData.familyGuilds && profileData.familyGuilds.length > 0 && (
              <span className="flex items-center">
                <GitBranch className="h-4 w-4 mr-2 text-purple-500"/> 
                길드: {profileData.familyGuilds[0].name}
              </span>
            )}
          </div>
          
          {profileData.customizations?.showBadges && badgesData.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
              {badgesData.slice(0, 5).map(badge => (
                <Badge 
                  key={badge.id} 
                  variant="outline" 
                  className={`text-sm px-3 py-1.5 border-opacity-50 ${badge.color?.replace('text-', 'border-')} ${badge.color}`}
                >
                  <badge.icon className="h-3 w-3 mr-2"/>{badge.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center md:items-end space-y-3 mt-4 md:mt-0 flex-shrink-0">
          {!isOwner && (
            <Button 
              className="w-full md:w-auto bg-accent-100 hover:bg-accent-200 text-white h-10 text-base"
              onClick={onFollow}
            >
              <Plus className="h-5 w-5 mr-2"/> 팔로우
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full md:w-auto h-10 border-gray-300 text-base"
            onClick={onMessage}
          >
            <MessageSquare className="h-5 w-5 mr-2"/> 메시지
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 border-gray-300 hover:border-accent-100"
              title="TIE 연결"
            >
              <RadioTower className="h-5 w-5"/>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 border-gray-300 hover:border-accent-100"
              title="VI 시작"
            >
              <ScreenShare className="h-5 w-5"/>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 border-gray-300 hover:border-accent-100"
              title="QR 코드"
              onClick={onShowQR}
            >
              <QrCode className="h-5 w-5"/>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 border-gray-300 hover:border-accent-100"
              title="공유"
              onClick={onShare}
            >
              <Share2 className="h-5 w-5"/>
            </Button>
          </div>
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full md:w-auto text-sm bg-pink-100 text-pink-700 hover:bg-pink-200 h-9"
          >
            <Gift className="h-4 w-4 mr-2"/> 응원하기
          </Button>
        </div>
      </div>
    </>
  );
};

export default EnhancedProfileHeader;
