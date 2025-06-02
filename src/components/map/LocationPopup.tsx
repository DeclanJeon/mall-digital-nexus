import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  ExternalLink, 
  Navigation, 
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapLocation } from '@/types/map';

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

  if (!selectedLocation) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute bottom-6 right-6 z-[1000] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl p-5 shadow-2xl w-80 max-h-96 overflow-y-auto"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="space-y-4">
          {/* 헤더 */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900">{selectedLocation.title}</h3>
                {selectedLocation.isOnline && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                {/* 🚀 이메일 연동 가능 여부 표시 */}
                {selectedLocation.email && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                    📧 이메일 연동 가능
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedLocation(null)}
              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 이미지 */}
          {selectedLocation.imageUrl && (
            <div className="relative h-32 rounded-xl overflow-hidden">
              <img 
                src={selectedLocation.imageUrl} 
                alt={selectedLocation.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          )}

          {/* 🚀 개선된 정보 섹션 */}
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{selectedLocation.address}</span>
            </div>
            
            {/* 🚀 이메일 정보 표시 */}
            {selectedLocation.email && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📧</span>
                <span className="text-gray-700 text-xs">{selectedLocation.email}</span>
              </div>
            )}
            
            {selectedLocation.description && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {selectedLocation.description}
              </p>
            )}
          </div>

          {/* 태그 */}
          {selectedLocation.tags && selectedLocation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedLocation.tags.slice(0, 3).map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  #{tag}
                </Badge>
              ))}
              {selectedLocation.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600">
                  +{selectedLocation.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            {isAuthenticated && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                onClick={() => handleOpenCallModal(selectedLocation)}
              >
                <Phone className="w-4 h-4 mr-1" />
                통화
              </Button>
            )}
            
            {isAuthenticated && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                onClick={() => handleOpenMessageModal(selectedLocation)}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                메시지
              </Button>
            )}
            
            <Button
              size="sm"
              variant="outline"
              className="border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              onClick={() => {
                navigate(`/space/${selectedLocation.peerMallName}?mk=${selectedLocation.peerMallKey}`);
              }}
            >
              <ExternalLink className="w-4 h-4 mr-1 text-purple-600" />
              방문하기
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`;
                window.open(url, '_blank');
              }}
            >
              <Navigation className="w-4 h-4 mr-1 text-orange-600" />
              길찾기
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
