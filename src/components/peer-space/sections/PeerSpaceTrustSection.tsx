
import React from 'react';
import { PeerMallConfig } from '@/types/space';
import { 
  Card, CardContent, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Award, Shield, CheckCircle, Users, Zap, ThumbsUp 
} from 'lucide-react';
import { 
  Avatar, AvatarImage, AvatarFallback 
} from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PeerSpaceTrustSectionProps {
  config: PeerMallConfig;
}

const PeerSpaceTrustSection: React.FC<PeerSpaceTrustSectionProps> = ({ config }) => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6">신뢰도 & 인증 정보</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credentials & Badges */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-5">
              <Award className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold">뱃지 & 인증</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {config.badges.map((badge, index) => (
                  <div 
                    key={index}
                    className="p-3 border rounded-lg text-center hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer"
                  >
                    {index === 0 && <Shield className="h-6 w-6 mx-auto mb-1 text-blue-500" />}
                    {index === 1 && <Award className="h-6 w-6 mx-auto mb-1 text-green-500" />}
                    {index === 2 && <CheckCircle className="h-6 w-6 mx-auto mb-1 text-purple-500" />}
                    {index > 2 && <Award className="h-6 w-6 mx-auto mb-1 text-gray-500" />}
                    <span className="text-sm font-medium block">{badge}</span>
                  </div>
                ))}
              </div>
              
              {config.isVerified && (
                <div className="flex items-center p-3 bg-green-50 border border-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">인증된 피어스페이스</span>
                    <p className="text-xs text-gray-600 mt-1">
                      공식 인증을 통해 신뢰할 수 있는 공간임을 확인하였습니다.
                    </p>
                  </div>
                </div>
              )}
              
              {config.familyGuilds && config.familyGuilds.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1.5" /> 패밀리 멤버십
                  </h4>
                  <div className="flex items-center gap-3">
                    {config.familyGuilds.map(guild => (
                      <div key={guild.id} className="flex items-center p-2 border rounded-lg bg-gray-50">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={guild.imageUrl} alt={guild.name} />
                          <AvatarFallback>{guild.name.substring(0, 1)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{guild.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Level & Activity Stats */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-5">
              <Zap className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold">활동 지표</h3>
            </div>
            
            <div className="space-y-6">
              {/* Level info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">레벨 {config.level || 1}</h4>
                  <span className="text-sm text-blue-600">
                    {config.experience || 0} / {config.nextLevelExperience || 100} XP
                  </span>
                </div>
                <Progress 
                  value={config.experience && config.nextLevelExperience ? 
                    (config.experience / config.nextLevelExperience) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {config.followers}
                  </div>
                  <p className="text-sm text-gray-600">팔로워</p>
                </div>
                
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {config.recommendations}
                  </div>
                  <p className="text-sm text-gray-600">추천인</p>
                </div>
                
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {config.completedChallenges || 0}
                  </div>
                  <p className="text-sm text-gray-600">완료한 챌린지</p>
                </div>
                
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="text-2xl font-bold text-amber-600 mb-1">
                    {config.activeQuests || 0}
                  </div>
                  <p className="text-sm text-gray-600">활성 퀘스트</p>
                </div>
              </div>
              
              <div className="pt-2 flex items-center justify-center">
                <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">다른 사용자로부터 신뢰도 높음</span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PeerSpaceTrustSection;
