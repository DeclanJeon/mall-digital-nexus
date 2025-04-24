
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Building, User, ShoppingBag } from 'lucide-react';

import { PeerMallConfig } from './types';

interface PeerSpaceInfoHubProps {
  config: PeerMallConfig;
}

const PeerSpaceInfoHub: React.FC<PeerSpaceInfoHubProps> = ({ config }) => {
  // Example ecosystem data
  const ecosystemData = {
    manufacturers: [
      { id: 'm1', name: '디자인랩 코리아', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DLK', url: '#' },
      { id: 'm2', name: '크리에이티브 스튜디오', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=CS', url: '#' },
    ],
    distributors: [
      { id: 'd1', name: '아트샵', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=AS', url: '#' },
      { id: 'd2', name: '디자인마켓', logo: 'https://api.dicebear.com/7.x/initials/svg?seed=DM', url: '#' },
    ],
    influencers: [
      { id: 'i1', name: '김디자이너', image: 'https://api.dicebear.com/7.x/personas/svg?seed=KD', followers: 12500, url: '#' },
      { id: 'i2', name: '파블로아트', image: 'https://api.dicebear.com/7.x/personas/svg?seed=PA', followers: 34200, url: '#' },
    ],
    resources: [
      { id: 'r1', title: '2025 디자인 트렌드 분석', type: '블로그', url: '#', source: '디자인매거진' },
      { id: 'r2', title: '초보자를 위한 포트폴리오 구성 가이드', type: '튜토리얼', url: '#', source: '크리에이티브 아카데미' },
      { id: 'r3', title: '디자인 도구 비교 분석', type: '리뷰', url: '#', source: '디자인크리틱' },
    ]
  };

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6">정보 허브 & 생태계</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ecosystem partners */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">관련 생태계</h3>
            
            <div className="space-y-4">
              {/* Manufacturers */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                  <Building className="h-4 w-4 mr-1.5" /> 제조사/브랜드
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ecosystemData.manufacturers.map(manufacturer => (
                    <a 
                      key={manufacturer.id} 
                      href={manufacturer.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition p-2 rounded-lg"
                    >
                      <img 
                        src={manufacturer.logo} 
                        alt={manufacturer.name}
                        className="h-8 w-8 rounded" 
                      />
                      <span className="text-sm font-medium">{manufacturer.name}</span>
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Distributors */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-1.5" /> 유통사
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ecosystemData.distributors.map(distributor => (
                    <a 
                      key={distributor.id} 
                      href={distributor.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition p-2 rounded-lg"
                    >
                      <img 
                        src={distributor.logo} 
                        alt={distributor.name}
                        className="h-8 w-8 rounded" 
                      />
                      <span className="text-sm font-medium">{distributor.name}</span>
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Influencers */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-1.5" /> 관련 인플루언서
                </h4>
                <div className="flex flex-wrap gap-2">
                  {ecosystemData.influencers.map(influencer => (
                    <a 
                      key={influencer.id}
                      href={influencer.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition p-2 rounded-lg"
                    >
                      <img 
                        src={influencer.image} 
                        alt={influencer.name}
                        className="h-8 w-8 rounded-full" 
                      />
                      <div>
                        <div className="text-sm font-medium">{influencer.name}</div>
                        <div className="text-xs text-gray-500">팔로워 {influencer.followers.toLocaleString()}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Trusted resources */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">추천 자료 & 링크</h3>
            
            <div className="space-y-3">
              {ecosystemData.resources.map(resource => (
                <a 
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-blue-600 flex items-center gap-1">
                        {resource.title}
                        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      </h4>
                      <p className="text-sm text-gray-500">{resource.source}</p>
                    </div>
                    <Badge variant="outline" className="bg-white">
                      {resource.type}
                    </Badge>
                  </div>
                </a>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-4">
              모든 자료 보기 <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PeerSpaceInfoHub;
