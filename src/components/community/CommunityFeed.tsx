import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MessageSquare, Heart, Share2, TrendingUp, 
  Clock, Star, Flame, Hash, ChevronRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  communityActivities, 
  communityStats, 
  trendingHashtags,
  CommunityActivity 
} from '@/data/communityData';

// 🎨 활동 타입별 아이콘 및 색상
const getActivityIcon = (type: CommunityActivity['type']) => {
  switch (type) {
    case 'post': return { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' };
    case 'review': return { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' };
    case 'like': return { icon: Heart, color: 'text-red-500', bg: 'bg-red-50' };
    case 'follow': return { icon: Users, color: 'text-green-500', bg: 'bg-green-50' };
    case 'share': return { icon: Share2, color: 'text-purple-500', bg: 'bg-purple-50' };
    default: return { icon: MessageSquare, color: 'text-gray-500', bg: 'bg-gray-50' };
  }
};

// ⏰ 시간 포맷팅
const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 전`;
  return `${Math.floor(minutes / 1440)}일 전`;
};

const CommunityFeed: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                🌟 커뮤니티 피드
              </h3>
              <p className="text-xs text-gray-500">
                실시간 활동 소식
              </p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
            Live
          </Badge>
        </div>

        {/* 📊 커뮤니티 통계 */}
        {/* <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-700">
              {communityStats.activeToday.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">오늘 활성 유저</div>
          </div>
          <div className="bg-white/60 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-pink-700 flex items-center justify-center">
              +{communityStats.growthRate}%
              <TrendingUp className="w-3 h-3 ml-1" />
            </div>
            <div className="text-xs text-gray-600">이번 주 성장률</div>
          </div>
        </div> */}
      </CardHeader>

      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {/* 🔥 트렌딩 해시태그 */}
        <div className="bg-white/60 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">트렌딩</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {trendingHashtags.slice(0, 3).map((hashtag, index) => (
              <Badge 
                key={hashtag.tag}
                variant="outline" 
                className="text-xs bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
              >
                <Hash className="w-3 h-3 mr-1" />
                {hashtag.tag}
                <span className="ml-1 text-orange-600">{hashtag.count}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* 📝 커뮤니티 활동 피드 */}
        <div className="space-y-2">
          {communityActivities.slice(0, 5).map((activity, index) => {
            const { icon: Icon, color, bg } = getActivityIcon(activity.type);
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/70 rounded-lg p-3 hover:bg-white/90 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${bg} flex-shrink-0`}>
                    <Icon className={`w-3 h-3 ${color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback className="text-xs">
                          {activity.user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {activity.user.name}
                      </span>
                      {activity.user.badge && (
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {activity.user.badge}
                        </Badge>
                      )}
                      {activity.trending && (
                        <Flame className="w-3 h-3 text-orange-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                      {activity.content}
                    </p>
                    
                    {activity.target && (
                      <div className="text-xs text-blue-600 font-medium mb-2">
                        → {activity.target}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {activity.engagement.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          {activity.engagement.comments}
                        </span>
                        <span className="flex items-center">
                          <Share2 className="w-3 h-3 mr-1" />
                          {activity.engagement.shares}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 더보기 버튼 */}
        <Button 
          variant="ghost" 
          className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          size="sm"
        >
          더 많은 활동 보기
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunityFeed;
