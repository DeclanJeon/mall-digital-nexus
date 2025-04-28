
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, MessageSquare, Share2 } from 'lucide-react';

const PeerSpaceLiveCollaboration: React.FC = () => {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6">실시간 연결</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <Video className="h-6 w-6 text-blue-500 mb-2" />
            <CardTitle>화상 통화</CardTitle>
            <CardDescription>얼굴을 보며 직접 대화하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <span>• HD 비디오 화질</span>
              <span>• 최대 8명 동시 참여</span>
              <span>• 화면 공유 기능</span>
              <span>• 배경 흐림 효과</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Video className="h-4 w-4 mr-2" /> 통화 시작
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <Mic className="h-6 w-6 text-green-500 mb-2" />
            <CardTitle>음성 채팅</CardTitle>
            <CardDescription>고품질 음성으로 대화하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <span>• 노이즈 캔슬링</span>
              <span>• 최대 20명 동시 참여</span>
              <span>• 오디오 필터</span>
              <span>• 녹음 기능</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Mic className="h-4 w-4 mr-2" /> 음성 채팅 참여
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <MessageSquare className="h-6 w-6 text-purple-500 mb-2" />
            <CardTitle>텍스트 채팅</CardTitle>
            <CardDescription>실시간 메시지로 소통하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <span>• 무제한 메시지</span>
              <span>• 파일 공유</span>
              <span>• 이모티콘 지원</span>
              <span>• 채팅 내역 보관</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" /> 채팅방 입장
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <Share2 className="h-6 w-6 text-amber-500 mb-2" />
            <CardTitle>화면 공유</CardTitle>
            <CardDescription>작업 화면을 실시간으로 공유하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1 text-sm">
              <span>• 전체 화면 또는 창 선택</span>
              <span>• 원격 제어 옵션</span>
              <span>• 고해상도 지원</span>
              <span>• 저지연 스트리밍</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Share2 className="h-4 w-4 mr-2" /> 화면 공유 시작
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">현재 활성화된 세션</h3>
        <p className="text-gray-600 mb-4">지금 바로 현재 진행 중인 대화에 참여하세요</p>
        <div className="flex justify-center gap-4">
          <Button>
            <Video className="h-4 w-4 mr-2" /> 화상 회의 참여
          </Button>
          <Button variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" /> 채팅방 입장
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PeerSpaceLiveCollaboration;
