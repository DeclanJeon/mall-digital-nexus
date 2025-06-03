// hooks/useModalRouter.ts
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

interface UseModalRouterProps {
  modalKey: string;
  onClose?: () => void;
}

export const useModalRouter = ({ modalKey, onClose }: UseModalRouterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isOpen = searchParams.get(modalKey) === 'true';
  
  const openModal = useCallback((additionalParams?: Record<string, string>) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set(modalKey, 'true');
      
      // 추가 파라미터가 있으면 설정
      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          newParams.set(key, value);
        });
      }
      
      return newParams;
    });
  }, [modalKey, setSearchParams]);
  
  const closeModal = useCallback(() => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete(modalKey);
      
      // 관련된 파라미터들도 정리
      const keysToDelete = Array.from(newParams.keys()).filter(key => 
        key.startsWith(`${modalKey}_`)
      );
      keysToDelete.forEach(key => newParams.delete(key));
      
      return newParams;
    });
    
    onClose?.();
  }, [modalKey, setSearchParams, onClose]);
  
  // 뒤로가기 버튼 처리
  const handleBackButton = useCallback(() => {
    if (isOpen) {
      closeModal();
      return true; // 이벤트 처리됨을 알림
    }
    return false;
  }, [isOpen, closeModal]);
  
  return {
    isOpen,
    openModal,
    closeModal,
    handleBackButton,
    searchParams
  };
};
