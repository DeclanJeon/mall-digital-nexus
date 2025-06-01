// components/PeerSpaceHeader.jsx
import React, { useState } from 'react';
import { Search, QrCode, Share2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useLocation, useParams } from 'react-router-dom';
import PeerSpaceQRModal from '@/components/peer-space/modals/PeerSpaceQRModal';

const PeerSpaceHeader = ({ 
  isOwner = false,
  searchPlaceholder = "제품, 콘텐츠, 게시물 검색...",
  onSearchChange, // 검색은 외부 상태와 연동이 필요할 수 있어서 선택적으로 유지
  className = ""
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const location = useLocation();
  const { address } = useParams();

  // 🎯 내부 검색 처리
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    // 외부에서 검색 처리를 원하면 콜백 실행
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      // 내부에서 검색 처리 (예: URL 파라미터 업데이트)
      const searchParams = new URLSearchParams(location.search);
      if (value) {
        searchParams.set('search', value);
      } else {
        searchParams.delete('search');
      }
      // navigate는 여기서 직접 하지 않고, 이벤트로 처리
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
      
      // 모던 브라우저의 Web Share API 지원 체크
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
        // 폴백: 클립보드 복사
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
    
    // 설정 모달 이벤트 발생
    window.dispatchEvent(new CustomEvent('openPeerSpaceSettings'));
  };

  return (
    <>
      <div className={`sticky top-0 z-10 bg-white shadow-sm p-4 flex justify-between items-center ${className}`}>
        {/* 검색 영역 */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* 액션 버튼들 */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleQRGenerate}
            className="hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
            title="QR 코드 생성"
          >
            <QrCode className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShare}
            className="hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
            title="피어몰 공유하기"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          
        </div>
      </div>

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
