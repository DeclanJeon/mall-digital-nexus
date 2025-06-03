
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import { CommunityZone } from '@/types/community';
import { Button } from '@/components/ui/button';
import { AlertCircle, BellRing, SendHorizontal, AlertOctagon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import L from 'leaflet';

interface SosResponseSystemProps {
  selectedZone: CommunityZone | null;
  communityZones: CommunityZone[];
  onSosStatusChange: (zoneId: string, hasSignal: boolean) => void;
  userJoinedCommunities: string[];
}

const SosResponseSystem: React.FC<SosResponseSystemProps> = ({ 
  selectedZone, 
  communityZones, 
  onSosStatusChange,
  userJoinedCommunities
}) => {
  const map = useMap();
  const { toast } = useToast();
  const [sosCommunities, setSosCommunities] = useState<CommunityZone[]>([]);
  const [hasNotification, setHasNotification] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showSosList, setShowSosList] = useState<boolean>(false);
  
  // Check if user is admin of the selected community
  useEffect(() => {
    if (selectedZone) {
      // For simplicity, assume the user is an admin if they're a member
      setIsAdmin(userJoinedCommunities.includes(selectedZone.id));
    } else {
      setIsAdmin(false);
    }
  }, [selectedZone, userJoinedCommunities]);
  
  // Update list of communities with SOS signals - using memoization for performance
  const filteredSosCommunities = useMemo(() => {
    return communityZones.filter(zone => zone.hasSosSignal);
  }, [communityZones]);
  
  // Update sosCommunities state when filteredSosCommunities changes
  useEffect(() => {
    const communities = filteredSosCommunities;
    
    // Check if there are any new SOS communities
    if (communities.length > sosCommunities.length) {
      setHasNotification(true);
      
      // Show notification for new SOS signal
      if (communities.length > 0 && sosCommunities.length === 0) {
        toast({
          title: "SOS 신호 감지",
          description: `${communities.length}개 커뮤니티에서 도움이 필요합니다.`,
          variant: "destructive",
          duration: 5000
        });
      }
    }
    
    setSosCommunities(communities);
  }, [filteredSosCommunities, sosCommunities.length, toast]);
  
  // Toggle SOS list visibility
  const toggleSosList = useCallback(() => {
    setShowSosList(prev => !prev);
  }, []);
  
  // Send SOS signal with improved feedback
  const sendSosSignal = useCallback(() => {
    if (!selectedZone) {
      toast({
        title: "SOS 신호 발신 실패",
        description: "SOS 신호를 보내기 위해서는 먼저 커뮤니티를 선택해야 합니다.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    onSosStatusChange(selectedZone.id, true);
    
    toast({
      title: "SOS 신호 발신",
      description: "주변 커뮤니티에 SOS 신호가 전송되었습니다.",
      variant: "destructive",
      duration: 3000
    });
  }, [selectedZone, onSosStatusChange, toast]);
  
  // Cancel SOS signal with improved feedback
  const cancelSosSignal = useCallback(() => {
    if (!selectedZone) {
      toast({
        title: "SOS 신호 취소 실패",
        description: "취소할 SOS 신호가 없습니다.",
        variant: "destructive",
        duration: 3000
      });
      return;
    }
    
    onSosStatusChange(selectedZone.id, false);
    
    toast({
      title: "SOS 신호 취소",
      description: "SOS 신호가 취소되었습니다.",
      duration: 3000
    });
  }, [selectedZone, onSosStatusChange, toast]);
  
  // Send help to a community with improved feedback
  const sendHelp = useCallback((community: CommunityZone) => {
    if (!community) return;
    
    try {
      toast({
        title: "도움 응답 전송",
        description: `${community.name} 커뮤니티에 도움 응답을 전송했습니다.`,
        duration: 3000
      });
      
      // 여기에 실제 도움 응답 로직을 구현할 수 있습니다.
      console.log("도움 응답 전송:", community.id);
    } catch (error) {
      console.error("도움 응답 전송 중 오류:", error);
      toast({
        title: "도움 응답 실패",
        description: "도움 응답을 전송하는 중 문제가 발생했습니다.",
        variant: "destructive",
        duration: 3000
      });
    }
  }, [toast]);
  
  // 수정: SOS 알림 버튼 위치 및 스타일 조정
  useEffect(() => {
    // Create a custom SOS notification control
    const sosNotificationControl = L.Control.extend({
      options: {
        // 변경: 위치를 좌측 하단(bottomleft)으로 설정하고 위치찾기 버튼 오른쪽에 위치하도록 함
        position: 'bottomleft'
      },
      
      onAdd: () => {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control sos-control');
        const button = L.DomUtil.create('a', hasNotification ? 'sos-notification-button active' : 'sos-notification-button', container);
        
        button.innerHTML = '🆘';
        button.title = 'SOS 알림';
        button.style.fontSize = '16px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.cursor = 'pointer';
        button.style.transition = 'all 0.3s ease';
        button.style.marginLeft = '10px'; // 간격 추가
        button.style.position = 'relative'; // 상대 위치 설정
        button.style.zIndex = '1000'; // z-index 추가
        
        if (hasNotification) {
          button.style.backgroundColor = '#ff4444';
          button.style.color = 'white';
        }
        
        L.DomEvent.on(button, 'click', (e) => {
          L.DomEvent.stopPropagation(e);
          L.DomEvent.preventDefault(e);
          
          setHasNotification(false);
          toggleSosList();
          
          // Show SOS communities list
          toast({
            title: "SOS 발신 커뮤니티",
            description: sosCommunities.length > 0 
              ? `${sosCommunities.length}개 커뮤니티에서 도움이 필요합니다.` 
              : "현재 SOS 신호가 없습니다.",
            variant: sosCommunities.length > 0 ? "destructive" : "default",
            duration: 3000
          });
        });
        
        return container;
      }
    });
    
    // Add the control to the map
    const control = new sosNotificationControl();
    map.addControl(control);
    
    return () => {
      map.removeControl(control);
    };
  }, [map, hasNotification, sosCommunities, toast, toggleSosList]);

  // 수정: 메인 SOS 버튼 컴포넌트 위치 조정 및 스타일 개선
  return (
    <div className="absolute bottom-20 left-4 z-[1000]">
      {isAdmin && selectedZone && (
        <div className="sos-controls mb-2">
          {selectedZone?.hasSosSignal ? (
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-1 shadow-lg hover:bg-red-600 transition-colors"
              onClick={cancelSosSignal}
            >
              <AlertOctagon className="h-4 w-4" />
              <span>SOS 신호 취소</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 border-red-500 text-red-500 hover:bg-red-50 transition-colors shadow-lg bg-white"
              onClick={sendSosSignal}
            >
              <AlertCircle className="h-4 w-4" />
              <span>SOS 신호 보내기</span>
            </Button>
          )}
        </div>
      )}
      
      {/* SOS Community List with animation */}
      {(sosCommunities.length > 0 && showSosList) && (
        <div 
          className="bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-lg border border-red-300 w-64 animate-fade-in"
          style={{
            animation: 'scale-in 0.2s ease-out',
            transformOrigin: 'bottom left', // 변경: 원점을 좌측 하단으로 조정
            zIndex: 2000 // 높은 z-index 추가
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-red-600 flex items-center gap-1">
              <BellRing className="h-4 w-4" />
              <span>SOS 신호</span>
            </h4>
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {sosCommunities.length}
            </span>
          </div>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {sosCommunities.map(community => (
              <div 
                key={community.id} 
                className="p-2 bg-red-50 rounded-md border border-red-200 flex items-center justify-between hover:bg-red-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{community.name}</p>
                  <p className="text-xs text-gray-500">{community.lastActive}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs px-2 flex items-center gap-1 hover:bg-white"
                  onClick={() => sendHelp(community)}
                >
                  <SendHorizontal className="h-3 w-3" />
                  <span>도움</span>
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={toggleSosList}
            >
              닫기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(SosResponseSystem);
