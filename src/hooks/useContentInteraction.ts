
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Heart, BookmarkPlus, CheckCircle } from 'lucide-react';

type InteractionType = 'like' | 'save' | 'comment';

interface UseContentInteractionProps {
  onInteractionComplete?: (type: InteractionType, contentId: string) => void;
}

export const useContentInteraction = ({ onInteractionComplete }: UseContentInteractionProps = {}) => {
  const [pendingInteractions, setPendingInteractions] = useState<Record<string, boolean>>({});

  const handleInteraction = async (type: InteractionType, contentId: string) => {
    const interactionKey = `${type}-${contentId}`;
    
    // Prevent double-clicks
    if (pendingInteractions[interactionKey]) return;
    
    // Set interaction as pending
    setPendingInteractions(prev => ({ ...prev, [interactionKey]: true }));
    
    // Feedback configuration
    let feedbackTitle = '';
    let feedbackDesc = '';
    let feedbackIcon = null;

    switch (type) {
      case 'like':
        feedbackTitle = '좋아요!';
        feedbackDesc = '콘텐츠에 좋아요 (+5 XP)';
        feedbackIcon = <Heart className="h-5 w-5 text-red-500" />;
        break;
      case 'save':
        feedbackTitle = '저장!';
        feedbackDesc = '나중에 볼 콘텐츠로 저장 (+5 XP)';
        feedbackIcon = <BookmarkPlus className="h-5 w-5 text-blue-500" />;
        break;
      case 'comment':
        feedbackTitle = '댓글 작성 완료!';
        feedbackDesc = '의견을 남겨주셔서 감사합니다 (+10 XP)';
        feedbackIcon = <CheckCircle className="h-5 w-5 text-green-500" />;
        break;
      default:
        return;
    }

    try {
      // Simulate API call
      const mockApiCall = async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { success: true };
      };

      const result = await mockApiCall();
      
      if (result.success) {
        // Show feedback to user
        toast({
          title: feedbackTitle,
          description: feedbackDesc,
        });
        
        // Notify parent component about the interaction
        if (onInteractionComplete) {
          onInteractionComplete(type, contentId);
        }
      } 
    } catch (error) {
      console.error(`Error during ${type} interaction:`, error);
      toast({ 
        title: '오류 발생', 
        description: '요청을 처리하는 중 문제가 발생했습니다.',
      });
    } finally {
      // Clear pending state
      setPendingInteractions(prev => ({ ...prev, [interactionKey]: false }));
    }
  };

  return { handleInteraction, pendingInteractions };
};
