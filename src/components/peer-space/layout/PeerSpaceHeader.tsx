// components/PeerSpaceHeader.jsx
import React, { useState } from 'react';
import { Search, QrCode, Share2, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useLocation, useParams } from 'react-router-dom';
import PeerSpaceQRModal from '@/components/peer-space/modals/PeerSpaceQRModal';

const PeerSpaceHeader = ({ 
  isOwner = false,
  searchPlaceholder = "제품, 콘텐츠, 게시물 검색...",
  onSearchChange,
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const location = useLocation();
  const { address } = useParams();

  // 🎯 내부 검색 처리
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      const searchParams = new URLSearchParams(location.search);
      if (value) {
        searchParams.set('search', value);
      } else {
        searchParams.delete('search');
      }
      window.dispatchEvent(new CustomEvent('peerSpaceSearch', { 
        detail: { query: value, searchParams: searchParams.toString() } 
      }));
    }
  };

  // 🎯 QR 코드 생성
  const handleQRGenerate = () => {
    setShowQRModal(true);
  };

  // 🎯 공유하기
  const handleShare = async () => {
    try {
      const currentUrl = window.location.href;
      
      if (navigator.share) {
        await navigator.share({
          title: '피어몰 공유',
          text: '이 피어몰을 확인해보세요!',
          url: currentUrl,
        });
        toast({
          title: '공유 완료! 🚀',
          description: '피어몰이 성공적으로 공유되었어요.',
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        toast({
          title: '링크 복사 완료! 📋',
          description: '클립보드에 링크가 복사되었어요.',
        });
      }
    } catch (error) {
      console.error('공유 실패:', error);
      toast({
        title: '공유 실패 😅',
        description: '다시 시도해주세요.',
        variant: 'destructive',
      });
    }
  };

  // 🎯 설정 페이지로 이동
  const handleShowSettings = () => {
    if (!isOwner) {
      toast({
        title: '권한 없음 🚫',
        description: '피어몰 소유자만 설정을 변경할 수 있어요.',
        variant: 'destructive',
      });
      return;
    }
    
    window.dispatchEvent(new CustomEvent('openPeerSpaceSettings'));
  };

  return (
    <>
      <header className={`bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 로고/브랜드 영역 */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{address}</h1>
            </div>
            
            {/* 검색 영역 - 중앙 배치 */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>
            
            {/* 액션 버튼들 */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleQRGenerate}
                className="hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                title="QR 코드 생성"
              >
                <QrCode className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                title="피어몰 공유하기"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              
              {isOwner && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleShowSettings}
                  className="hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                  title="설정"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              )}
              
              {/* 프로필 아바타 */}
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* QR 모달 */}
      <PeerSpaceQRModal 
        showQRModal={showQRModal} 
        setShowQRModal={setShowQRModal} 
        address={address} 
      />
    </>
  );
};

export default PeerSpaceHeader;