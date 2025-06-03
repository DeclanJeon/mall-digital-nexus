
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, Medal, Heart, Flag, Shield, Crown } from 'lucide-react';

interface RelatedBadgesProps {
  contentId: string;
  contentType: string;
}

interface BadgeInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlockCondition: string;
}

const RelatedBadges: React.FC<RelatedBadgesProps> = ({ contentId, contentType }) => {
  // Generate badges based on content type
  const getBadgesForContent = (): BadgeInfo[] => {
    const baseBadges: BadgeInfo[] = [
      {
        id: 'badge-enthusiast',
        name: '열정가',
        description: `이 ${getContentTypeDisplayName()}에 관심을 표현하세요`,
        icon: <Heart className="h-5 w-5" />,
        color: 'bg-rose-100 text-rose-700 border-rose-300',
        unlockCondition: '좋아요 3회 이상 누르기'
      },
      {
        id: 'badge-explorer',
        name: '탐험가',
        description: `연관된 ${getContentTypeDisplayName()} 3개 이상 살펴보기`,
        icon: <Flag className="h-5 w-5" />,
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        unlockCondition: '관련 콘텐츠 3개 이상 방문'
      }
    ];

    // Add content-type specific badges
    switch (contentType) {
      case 'product':
        return [
          ...baseBadges,
          {
            id: 'badge-first-buyer',
            name: '얼리어답터',
            description: '이 제품의 첫 구매자가 되세요',
            icon: <Trophy className="h-5 w-5" />,
            color: 'bg-amber-100 text-amber-700 border-amber-300',
            unlockCondition: '제품 첫 구매자'
          },
          {
            id: 'badge-reviewer',
            name: '리뷰어',
            description: '이 제품에 자세한 리뷰를 남기세요',
            icon: <Star className="h-5 w-5" />,
            color: 'bg-purple-100 text-purple-700 border-purple-300',
            unlockCondition: '제품 리뷰 작성'
          }
        ];
      case 'event':
        return [
          ...baseBadges,
          {
            id: 'badge-participant',
            name: '참가자',
            description: '이 이벤트에 참가하세요',
            icon: <Medal className="h-5 w-5" />,
            color: 'bg-green-100 text-green-700 border-green-300',
            unlockCondition: '이벤트 참가'
          }
        ];
      case 'quest':
        return [
          ...baseBadges,
          {
            id: 'badge-challenger',
            name: '도전자',
            description: '이 퀘스트에 도전하세요',
            icon: <Shield className="h-5 w-5" />,
            color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
            unlockCondition: '퀘스트 참가'
          },
          {
            id: 'badge-champion',
            name: '챔피언',
            description: '이 퀘스트를 완료하세요',
            icon: <Crown className="h-5 w-5" />,
            color: 'bg-amber-100 text-amber-700 border-amber-300',
            unlockCondition: '퀘스트 완료'
          }
        ];
      default:
        return baseBadges;
    }
  };

  // Helper function to get content type display name
  const getContentTypeDisplayName = (): string => {
    const typeMapping: Record<string, string> = {
      'portfolio': '포트폴리오',
      'service': '서비스',
      'product': '상품',
      'event': '이벤트',
      'post': '게시글',
      'review': '리뷰',
      'quest': '퀘스트'
    };
    
    return typeMapping[contentType] || contentType;
  };

  const badges = getBadgesForContent();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Award className="h-5 w-5 mr-2 text-yellow-500" />
          획득 가능한 뱃지
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {badges.map(badge => (
              <div 
                key={badge.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-full mr-3 ${badge.color}`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{badge.name}</h4>
                    <Badge variant="outline" className="text-xs mt-1">획득 가능</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                <p className="text-xs text-gray-500 border-t pt-2">
                  획득 조건: {badge.unlockCondition}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">획득 가능한 뱃지가 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RelatedBadges;
