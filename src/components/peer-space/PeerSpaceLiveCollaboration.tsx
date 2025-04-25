import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Video, Mic, ScreenShare, Code } from 'lucide-react';

const PeerSpaceLiveCollaboration: React.FC = () => {
  const collaborationFeatures = [
    { name: '화상 회의', icon: Video, description: '실시간 화상 통화로 소통하세요' },
    { name: '음성 채팅', icon: Mic, description: '음성으로 빠르게 대화하세요' },
    { name: '화면 공유', icon: ScreenShare, description: '화면을 공유하고 함께 작업하세요' },
    { name: '코드 편집기', icon: Code, description: '실시간으로 코드를 함께 작성하세요' },
    { name: '채팅', icon: MessageSquare, description: '텍스트로 대화를 나누세요' },
    { name: '멤버 관리', icon: Users, description: '참여자를 초대하고 관리하세요' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">실시간 협업 공간</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collaborationFeatures.map((feature, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <feature.icon className="h-6 w-6 text-accent-200" />
                <h3 className="font-medium">{feature.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{feature.description}</p>
              <Button variant="outline" size="sm" className="mt-3 w-full">
                시작하기
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeerSpaceLiveCollaboration;
