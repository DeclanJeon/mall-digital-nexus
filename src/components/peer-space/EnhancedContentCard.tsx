
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Content } from './types';
import { 
  Heart, 
  BookmarkPlus, 
  MessageCircle, 
  Clock, 
  ExternalLink,
  ArrowRight, 
  Link
} from 'lucide-react';
import { useContentInteraction } from '@/hooks/useContentInteraction';

interface EnhancedContentCardProps {
  content: Content;
  onClick: () => void;
  onInteraction?: (type: 'like' | 'save' | 'comment', contentId: string) => void;
}

export const EnhancedContentCard = ({ 
  content, 
  onClick,
  onInteraction 
}: EnhancedContentCardProps) => {
  const { handleInteraction, pendingInteractions } = useContentInteraction({
    onInteractionComplete: onInteraction
  });

  // Get type badge
  const getTypeBadge = () => {
    const type = 'type' in content ? content.type : 'unknown';
    
    switch (type) {
      case 'portfolio': return <Badge variant="secondary">포트폴리오</Badge>;
      case 'service': return <Badge className="bg-green-500 text-white">서비스</Badge>;
      case 'product': return <Badge className="bg-blue-500 text-white">상품</Badge>;
      case 'event': return <Badge variant="destructive">이벤트</Badge>;
      case 'post': return <Badge variant="outline">게시글</Badge>;
      case 'review': return <Badge className="bg-yellow-500 text-white">리뷰</Badge>;
      case 'quest': return <Badge className="bg-purple-500 text-white">퀘스트</Badge>;
      default: return null;
    }
  };

  const isExternal = 'isExternal' in content && content.isExternal;
  const hasProgress = 'participants' in content && 'maxParticipants' in content && content.maxParticipants;
  const hasGoalProgress = 'progress' in content && 'goal' in content && content.goal;
  
  let progressValue = 0;
  let progressLabel = '';
  
  if (hasProgress && typeof content.participants === 'number' && typeof content.maxParticipants === 'number') {
    progressValue = (content.participants / content.maxParticipants) * 100;
    progressLabel = `${content.participants}/${content.maxParticipants} 참여`;
  }
  
  if (hasGoalProgress && typeof content.progress === 'number' && typeof content.goal === 'number') {
    progressValue = (content.progress / content.goal) * 100;
    progressLabel = `${content.progress ?? 0}/${content.goal} 완료`;
  }
  
  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col bg-white cursor-pointer group ${isExternal ? 'border-l-4 border-accent-100' : ''}`}
      onClick={onClick}
    >
      <div className="aspect-[16/10] relative overflow-hidden">
        <img
          src={content.imageUrl}
          alt={content.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          {getTypeBadge()}
          {isExternal && (
            <Badge variant="outline" className="bg-black/60 text-white text-xs px-2 py-0.5 flex items-center">
              <ExternalLink className="h-2.5 w-2.5 mr-1" /> 외부
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 flex-grow">
        <h3 className="font-semibold text-base mb-1 line-clamp-2 text-text-100 group-hover:text-accent-100 transition-colors">
          {content.title}
        </h3>
        <p className="text-xs text-text-200 mb-2 line-clamp-2">{content.description}</p>
        
        {'price' in content && content.price && (
          <p className="font-bold text-blue-600 text-sm mb-1">{content.price}</p>
        )}
        
        {content.date && content.date !== '' && !('price' in content && content.price) && (
          <p className="text-xs text-text-200 flex items-center mb-1">
            <Clock className="h-3 w-3 mr-1" /> {content.date}
          </p>
        )}
        
        {hasProgress && (
          <div className="my-1">
            <Progress 
              value={progressValue} 
              className="h-1.5" 
            />
            <p className="text-[10px] text-text-200 mt-0.5">
              {progressLabel}
            </p>
          </div>
        )}
        
        {hasGoalProgress && (
          <div className="my-1">
            <Progress 
              value={progressValue} 
              className="h-1.5" 
            />
            <p className="text-[10px] text-text-200 mt-0.5">
              {progressLabel}
            </p>
          </div>
        )}
        
        {isExternal && 'source' in content && content.source && (
          <p className="text-[10px] text-gray-500 flex items-center mt-1">
            <Link className="h-2.5 w-2.5 mr-1" /> 출처: {content.source}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="p-3 border-t bg-bg-100/30 flex justify-between items-center">
        <div className="flex space-x-2.5 text-xs text-text-200">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              handleInteraction('like', content.id);
            }} 
            className={`flex items-center transition-colors ${
              pendingInteractions[`like-${content.id}`] ? 'text-red-500' : 'hover:text-red-500'
            }`}
            disabled={pendingInteractions[`like-${content.id}`]}
          >
            <Heart className="h-3.5 w-3.5 mr-0.5" /> {content.likes || 0}
          </button>
          
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              handleInteraction('save', content.id);
            }} 
            className={`flex items-center transition-colors ${
              pendingInteractions[`save-${content.id}`] ? 'text-blue-500' : 'hover:text-blue-500'
            }`}
            disabled={pendingInteractions[`save-${content.id}`]}
          >
            <BookmarkPlus className="h-3.5 w-3.5 mr-0.5" /> {content.saves || 0}
          </button>
          
          <span className="flex items-center">
            <MessageCircle className="h-3.5 w-3.5 mr-0.5" /> {content.comments || 0}
          </span>
        </div>
        
        {isExternal ? (
          <ExternalLink className="h-4 w-4 text-accent-100" />
        ) : (
          <ArrowRight className="h-4 w-4 text-accent-100 opacity-50 group-hover:opacity-100 transition-opacity" />
        )}
      </CardFooter>
    </Card>
  );
};

export default EnhancedContentCard;
