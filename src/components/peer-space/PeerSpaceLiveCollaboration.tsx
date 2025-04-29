
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Mic, MessageSquare, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const PeerSpaceLiveCollaboration: React.FC = () => {
  const [activeChat, setActiveChat] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState(false);
  const [activeVoiceChat, setActiveVoiceChat] = useState(false);
  const [activeScreenShare, setActiveScreenShare] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{sender: string, text: string, time: string}>>([
    {sender: '김디자이너', text: '안녕하세요! 작업 진행 상황 확인하러 왔습니다.', time: '2분 전'},
    {sender: '이클라이언트', text: '네, 방금 새 디자인을 업로드했어요.', time: '1분 전'},
  ]);
  
  // Mock username - in a real app, this would come from authentication
  const username = localStorage.getItem('peerspace_username') || getRandomAnimalName();
  
  const handleStartVideoCall = () => {
    setActiveVideoCall(true);
    toast({
      title: "화상 통화가 시작되었습니다",
      description: "다른 사용자들이 참여하기를 기다리는 중입니다."
    });
  };
  
  const handleJoinVoiceChat = () => {
    setActiveVoiceChat(true);
    toast({
      title: "음성 채팅 참여",
      description: "음성 채팅방에 참여했습니다."
    });
  };
  
  const handleJoinChat = () => {
    setActiveChat(true);
  };
  
  const handleStartScreenShare = () => {
    setActiveScreenShare(true);
    toast({
      title: "화면 공유가 시작되었습니다",
      description: "현재 화면을 공유 중입니다."
    });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        sender: username,
        text: message,
        time: '방금 전'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };
  
  function getRandomAnimalName() {
    const animals = ['토끼', '사자', '호랑이', '기린', '코끼리', '팬더', '곰', '여우', '늑대', '사슴'];
    const randomIndex = Math.floor(Math.random() * animals.length);
    return `익명 ${animals[randomIndex]}`;
  }
  
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
            <Button className="w-full" onClick={handleStartVideoCall}>
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
            <Button variant="outline" className="w-full" onClick={handleJoinVoiceChat}>
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
            <Button variant="outline" className="w-full" onClick={handleJoinChat}>
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
            <Button variant="outline" className="w-full" onClick={handleStartScreenShare}>
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
          <Button variant="outline" onClick={handleJoinChat}>
            <MessageSquare className="h-4 w-4 mr-2" /> 채팅방 입장
          </Button>
        </div>
      </div>
      
      {/* Chat Dialog */}
      <Dialog open={activeChat} onOpenChange={setActiveChat}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>실시간 채팅</DialogTitle>
            <DialogDescription>
              실시간으로 다른 사용자들과 소통하세요
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto border rounded-md p-3 mb-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-3 ${msg.sender === username ? 'text-right' : ''}`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${msg.sender === username ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  <div className="font-bold text-xs">{msg.sender}</div>
                  <div>{msg.text}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지 입력..."
              className="flex-1"
            />
            <Button type="submit">전송</Button>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Mock dialogs for other features */}
      <Dialog open={activeVideoCall} onOpenChange={setActiveVideoCall}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>화상 통화</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-md">
            <p className="text-gray-500">카메라 접근 권한이 필요합니다</p>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" onClick={() => setActiveVideoCall(false)}>종료</Button>
            <Button variant="destructive">음소거</Button>
            <Button variant="outline">카메라 끄기</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeVoiceChat} onOpenChange={setActiveVoiceChat}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>음성 채팅</DialogTitle>
          </DialogHeader>
          <div className="p-8 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Mic className="h-8 w-8 text-green-500" />
            </div>
            <p>음성 채팅에 연결되었습니다</p>
            <p className="text-sm text-gray-500 mb-4">참가자: 3명</p>
            <Button variant="destructive" onClick={() => setActiveVoiceChat(false)}>채팅 종료</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={activeScreenShare} onOpenChange={setActiveScreenShare}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>화면 공유</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-gray-200 flex items-center justify-center rounded-md">
            <p className="text-gray-500">화면 공유 중입니다</p>
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="destructive" onClick={() => setActiveScreenShare(false)}>공유 종료</Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PeerSpaceLiveCollaboration;
