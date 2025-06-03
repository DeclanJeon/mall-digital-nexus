import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  Navigation, 
  X,
  Star,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Users,
  Zap,
  Crown,
  Shield,
  TrendingUp,
  Eye,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Maximize2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapLocation } from '@/types/map';
import { useState, useEffect } from 'react';

interface LocationPopupProps {
  selectedLocation: MapLocation | null;
  setSelectedLocation: (location: MapLocation | null) => void;
  isAuthenticated: boolean;
  handleOpenCallModal: (location: MapLocation) => void;
  handleOpenMessageModal: (location: MapLocation) => void;
}

export const LocationPopup = ({
  selectedLocation,
  setSelectedLocation,
  isAuthenticated,
  handleOpenCallModal,
  handleOpenMessageModal
}: LocationPopupProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!selectedLocation) return null;

  // 🎨 상태별 스타일 계산
  const getStatusConfig = () => {
    if (selectedLocation.isFeatured) {
      return {
        gradient: 'from-amber-400 to-orange-500',
        icon: Crown,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200'
      };
    }
    if (selectedLocation.isPopular) {
      return {
        gradient: 'from-pink-400 to-purple-500',
        icon: TrendingUp,
        color: 'text-pink-600',
        bg: 'bg-pink-50',
        border: 'border-pink-200'
      };
    }
    if (selectedLocation.isVerified) {
      return {
        gradient: 'from-emerald-400 to-teal-500',
        icon: Shield,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200'
      };
    }
    return {
      gradient: 'from-blue-400 to-indigo-500',
      icon: Star,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute bottom-3 right-3 z-[1000] w-56"
        initial={{ 
          opacity: 0, 
          y: 20, 
          scale: 0.9,
          filter: "blur(5px)"
        }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          filter: "blur(0px)"
        }}
        exit={{ 
          opacity: 0, 
          y: 20, 
          scale: 0.9,
          filter: "blur(5px)"
        }}
        transition={{ 
          duration: 0.3, 
          ease: [0.23, 1, 0.32, 1]
        }}
      >
        {/* 🌟 초소형 카드 */}
        <div className="relative">
          {/* 배경 글로우 */}
          <div className={`absolute inset-0 bg-gradient-to-br ${statusConfig.gradient} opacity-10 rounded-xl blur-sm`} />
          
          {/* 메인 컨테이너 */}
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/60 rounded-xl shadow-lg overflow-hidden">
            
            {/* 🖼️ 미니 썸네일 헤더 */}
            <div className="relative h-16 overflow-hidden">
              {selectedLocation.imageUrl ? (
                <img 
                  src={selectedLocation.imageUrl} 
                  alt={selectedLocation.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center`}>
                  <StatusIcon className="w-6 h-6 text-white" />
                </div>
              )}
              
              {/* 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* 상태 표시 */}
              <div className="absolute top-1.5 left-1.5">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center shadow-sm`}>
                  <StatusIcon className="w-2.5 h-2.5 text-white" />
                </div>
              </div>

              {/* 온라인 상태 */}
              {selectedLocation.isOnline && (
                <div className="absolute top-1.5 right-8">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              {/* 닫기 버튼 */}
              <button
                onClick={() => setSelectedLocation(null)}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
              >
                <X className="h-2.5 w-2.5" />
              </button>

              {/* 타이틀 */}
              <div className="absolute bottom-1 left-1.5 right-1.5">
                <h3 className="text-white text-xs font-bold line-clamp-1 drop-shadow">
                  {selectedLocation.title}
                </h3>
              </div>
            </div>

            {/* 📝 컨텐츠 영역 */}
            <div className="p-2.5 space-y-2">
              
              {/* 기본 정보 */}
              <div className="space-y-1.5">
                {/* 주소 */}
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-xs line-clamp-1 leading-tight">
                    {selectedLocation.address}
                  </span>
                </div>

                {/* 운영자 */}
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-600 text-xs line-clamp-1">
                    {selectedLocation.owner}
                  </span>
                </div>
                
              </div>

              {/* 🎮 아이콘 액션 버튼 그리드 */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                
                {/* 통화 */}
                <motion.button
                  onClick={() => handleOpenCallModal(selectedLocation)}
                  className="w-full h-8 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  title="화상통화"
                >
                  <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </motion.button>
              
              {/* 메시지 */}
                <motion.button
                  onClick={() => handleOpenMessageModal(selectedLocation)}
                  className="w-full h-8 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  title="메시지"
                >
                  <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </motion.button>
                
                {/* 방문하기 */}
                <motion.button
                  onClick={() => {
                    const url = `/space/${selectedLocation.peerMallName}?mk=${selectedLocation.peerMallKey}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full h-8 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  title="피어몰 방문"
                >
                  <ExternalLink className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </motion.button>
                
                {/* 길찾기 */}
                <motion.button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full h-8 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center group"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  title="길찾기"
                >
                  <Navigation className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </motion.button>
              </div>

              {/* 🎯 서브 액션 버튼들 */}
              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                
                

                {/* 확장 버튼 */}
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 flex items-center justify-center transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="상세보기"
                >
                  <Maximize2 className="h-2.5 w-2.5" />
                </motion.button>
              </div>

              {/* 📊 확장 정보 (토글) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pt-2 border-t border-gray-100 space-y-1.5"
                  >
                    {/* 설명 */}
                    {selectedLocation.description && (
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                        {selectedLocation.description}
                      </p>
                    )}
                    
                    {/* 전체 태그 */}
                    {selectedLocation.tags && selectedLocation.tags.length > 1 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedLocation.tags.slice(1, 4).map((tag, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="text-xs bg-blue-50 text-blue-700 border-blue-200 px-1.5 py-0.5 h-4"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* 메타 정보 */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      {/* <div className="flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" />
                        <span>{Math.floor(Math.random() * 1000)} 조회</span>
                      </div> */}
                      <div className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>방금 전</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 🌟 미니 파티클 효과 */}
          <div className="absolute -inset-2 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-blue-400 rounded-full opacity-60"
                animate={{
                  x: [0, Math.random() * 20 - 10],
                  y: [0, Math.random() * 20 - 10],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  repeat: Infinity,
                  delay: Math.random(),
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
