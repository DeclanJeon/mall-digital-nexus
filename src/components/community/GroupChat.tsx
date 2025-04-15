import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Smile, 
  PaperclipIcon, 
  Image, 
  UserPlus, 
  MoreHorizontal,
  Search,
  ChevronDown,
  MessageSquare,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Headphones,
  Volume2,
  VolumeX,
  User,
  Settings,
  X,
  Plus,
  ScreenShare,
  ScreenShareOff,
  Layout,
  LayoutGrid,
  Users,
  Hand,
  Share2,
  Record,
  Pin,
  Info,
  MoreVertical,
  Phone,
  PhoneOff,
  Maximize,
  Minimize,
  Crown,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock chat groups data
const MOCK_CHAT_GROUPS = [
  {
    id: 1,
    name: "피어몰 창업가 모임",
    members: ["창업왕", "디자이너K", "마케팅전문가", "신입몰러"],
    lastMessage: "오늘 세미나 자료 공유해 드립니다.",
    lastMessageTime: "10:30",
    unreadCount: 3,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group1",
    type: "text",
    isActive: true
  },
  {
    id: 2,
    name: "디지털 아트 크리에이터",
    members: ["일러스트레이터", "3D아티스트", "디자이너K", "NFT작가"],
    lastMessage: "새 작품에 대한 피드백 부탁드립니다.",
    lastMessageTime: "어제",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group2",
    type: "voice",
    isActive: true
  },
  {
    id: 3,
    name: "한국 수공예품 판매자",
    members: ["도예가", "자수작가", "목공예가", "가죽공예가"],
    lastMessage: "다음 오프라인 전시회 참가 신청하셨나요?",
    lastMessageTime: "어제",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group3",
    type: "text",
    isActive: false
  },
  {
    id: 4,
    name: "콘텐츠 마케팅 전략가",
    members: ["SEO전문가", "카피라이터", "마케팅전문가", "콘텐츠기획자"],
    lastMessage: "요즘 트렌드는 숏폼 콘텐츠입니다. 참고하세요.",
    lastMessageTime: "월요일",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group4",
    type: "text",
    isActive: false
  },
  {
    id: 5,
    name: "웹 개발자 네트워킹",
    members: ["프론트엔드개발자", "백엔드개발자", "디자이너K", "프로젝트매니저"],
    lastMessage: "다음 웨비나 주제는 React 18 입니다.",
    lastMessageTime: "화요일",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group5",
    type: "video",
    isActive: true
  },
  {
    id: 6,
    name: "스타트업 투자자 모임",
    members: ["엔젤투자자", "VC매니저", "스타트업CEO", "인큐베이터매니저"],
    lastMessage: "다음 피칭 세션은 언제인가요?",
    lastMessageTime: "수요일",
    unreadCount: 0,
    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=group6",
    type: "video",
    isActive: false
  },
];

// Mock messages for active chat
const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "창업왕",
    content: "여러분 안녕하세요! 오늘 세미나에 참석해주셔서 감사합니다.",
    time: "10:15",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 2,
    sender: "디자이너K",
    content: "좋은 정보 감사합니다. 발표자료도 공유해주실 수 있을까요?",
    time: "10:18",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2",
    isMe: false
  },
  {
    id: 3,
    sender: "창업왕",
    content: "네, 물론이죠! 세미나 자료 공유해드립니다.",
    time: "10:20",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 4,
    sender: "마케팅전문가",
    content: "정말 유익한 시간이었습니다. 다음 세미나도 기대할게요.",
    time: "10:23",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3",
    isMe: false
  },
  {
    id: 5,
    sender: "신입몰러",
    content: "처음 참여했는데 많은 도움이 되었어요! 다음에도 참여하고 싶습니다.",
    time: "10:25",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user4",
    isMe: false
  },
  {
    id: 6,
    sender: "창업왕",
    content: "다음 세미나는 '피어몰 매출 증대를 위한 SNS 마케팅 전략'을 주제로 진행할 예정입니다. 많은 참여 부탁드립니다!",
    time: "10:28",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 7,
    sender: "창업왕",
    content: "오늘 세미나 자료 공유해 드립니다.",
    time: "10:30",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1",
    isMe: false
  },
  {
    id: 8,
    sender: "익명 사용자",
    content: "감사합니다! 잘 보겠습니다.",
    time: "10:32",
    avatar: "",
    isMe: true
  }
];

// Mock active members - adding isMuted property to fix TypeScript errors
const ACTIVE_MEMBERS = [
  { id: 1, name: "창업왕", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1", isSpeaking: false, isHost: true, isMuted: false },
  { id: 2, name: "디자이너K", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2", isSpeaking: true, isHost: false, isMuted: true },
  { id: 3, name: "마케팅전문가", status: "away", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3", isSpeaking: false, isHost: false, isMuted: true },
  { id: 4, name: "신입몰러", status: "offline", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user4", isSpeaking: false, isHost: false, isMuted: false },
  { id: 5, name: "프로젝트매니저", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user5", isSpeaking: false, isHost: false, isMuted: true },
  { id: 6, name: "백엔드개발자", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user6", isSpeaking: false, isHost: false, isMuted: false },
];

// Mock screen shares
const SCREEN_SHARES = [
  { 
    id: 1, 
    userId: 1,
    name: "프레젠테이션",
    type: "screen"
  },
  { 
    id: 2, 
    userId: 2,
    name: "브라우저 창",
    type: "window"
  },
  { 
    id: 3, 
    userId: 1,
    name: "전체 화면",
    type: "screen"
  }
];

const GroupChat = () => {
  const [chatGroups, setChatGroups] = useState(MOCK_CHAT_GROUPS);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const [channelType, setChannelType] = useState("text");
  const [activeView, setActiveView] = useState("rooms");
  const [viewLayout, setViewLayout] = useState("grid"); // "grid" or "speaker"
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentScreenShare, setCurrentScreenShare] = useState(null);
  const [activeMember, setActiveMember] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [micVolume, setMicVolume] = useState([75]);
  const [speakerVolume, setSpeakerVolume] = useState([80]);
  const mainContainerRef = useRef(null);

  const filteredGroups = chatGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle full screen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (mainContainerRef.current.requestFullscreen) {
        mainContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "익명 사용자",
        content: newMessage.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        avatar: "",
        isMe: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Update last message in groups
      setChatGroups(chatGroups.map(group => 
        group.id === activeGroup?.id 
          ? { ...group, lastMessage: newMessage.trim(), lastMessageTime: "방금", unreadCount: 0 }
          : group
      ));
    }
  };

  const handleJoinChannel = (group) => {
    // If already in a channel, leave it first
    if (activeGroup) {
      handleLeaveChannel();
    }
    
    setActiveGroup(group);
    setActiveView("chat");
    
    // Reset controls when joining a new room
    setIsMuted(false);
    setIsVideoOff(true);
    setIsScreenSharing(false);
    setIsHandRaised(false);
    setIsRecording(false);
    setCurrentScreenShare(null);
    setChatOpen(false);
    setParticipantsOpen(false);

    if (group.type !== "text") {
      toast.success(`'${group.name}' 채널에 참여했습니다.`);
    }
  };
  
  const handleLeaveChannel = () => {
    if (!activeGroup) return;
    
    toast.info(`'${activeGroup.name}' 채널에서 나왔습니다.`);
    setActiveGroup(null);
    setActiveView("rooms");
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toast.info(isMuted ? "마이크가 활성화되었습니다." : "마이크가 비활성화되었습니다.");
  };
  
  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    toast.info(isVideoOff ? "비디오가 활성화되었습니다." : "비디오가 비활성화되었습니다.");
  };
  
  const handleToggleDeafen = () => {
    setIsDeafened(!isDeafened);
    toast.info(isDeafened ? "음성을 다시 들을 수 있습니다." : "음성이 음소거되었습니다.");
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    
    if (!isScreenSharing) {
      // Simulate screen share selection
      setTimeout(() => {
        setCurrentScreenShare(SCREEN_SHARES[0]);
        toast.success("화면 공유가 시작되었습니다.");
      }, 1000);
    } else {
      setCurrentScreenShare(null);
      toast.info("화면 공유가 중지되었습니다.");
    }
  };
  
  const handleRaiseHand = () => {
    setIsHandRaised(!isHandRaised);
    toast.info(isHandRaised ? "손 내리기가 완료되었습니다." : "손을 들었습니다.");
  };
  
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.success("녹화가 시작되었습니다.");
    } else {
      toast.info("녹화가 중지되었습니다.");
    }
  };
  
  const handleCreateChannel = () => {
    if (!newChannelName.trim()) {
      toast.error("채널 이름을 입력해주세요.");
      return;
    }
    
    const newChannel = {
      id: chatGroups.length + 1,
      name: newChannelName,
      members: [],
      lastMessage: `${newChannelName} 채널이 생성되었습니다.`,
      lastMessageTime: "방금",
      unreadCount: 0,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=group${chatGroups.length + 1}`,
      type: channelType,
      isActive: true
    };
    
    setChatGroups([...chatGroups, newChannel]);
    setNewChannelName("");
    setNewChannelDescription("");
    setIsSettingsOpen(false);
    toast.success(`'${newChannelName}' 채널이 생성되었습니다.`);
  };

  const getChannelTypeIcon = (type, isActive = false) => {
    switch (type) {
      case "voice":
        return <Headphones className={`h-4 w-4 ${isActive ? "text-green-500" : ""}`} />;
      case "video":
        return <Video className={`h-4 w-4 ${isActive ? "text-green-500" : ""}`} />;
      default:
        return <MessageSquare className={`h-4 w-4 ${isActive ? "text-green-500" : ""}`} />;
    }
  };

  const renderVideoCallInterface = () => {
    if (!activeGroup || activeGroup.type !== "video") return null;
    
    return (
      <div ref={mainContainerRef} className="flex flex-col h-full bg-[#1A1F2C]">
        {/* Top control bar */}
        <div className="flex justify-between items-center px-4 py-2 bg-[#221F26] border-b border-gray-700">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white"
              onClick={() => setActiveView("rooms")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              돌아가기
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700" />
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={activeGroup.avatar} alt={activeGroup.name} />
                <AvatarFallback className="bg-[#7E69AB]">{activeGroup.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-white">{activeGroup.name}</h3>
                <p className="text-xs text-gray-400">{activeGroup.members.length}명 참여 중</p>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400 hover:text-white"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    <Record className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isRecording ? '녹화 중지' : '녹화 시작'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-gray-400 hover:text-white" 
                    onClick={toggleFullScreen}
                  >
                    {isFullScreen ? (
                      <Minimize className="h-5 w-5" />
                    ) : (
                      <Maximize className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullScreen ? '전체화면 종료' : '전체화면'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#221F26] border-gray-700 text-white">
                <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer">
                  <Info className="h-4 w-4 mr-2" />
                  <span>미팅 정보</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer">
                  <Settings className="h-4 w-4 mr-2" />
                  <span>설정</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="hover:bg-[#2c2932] cursor-pointer text-red-500 focus:text-red-500"
                  onClick={handleLeaveChannel}
                >
                  <PhoneOff className="h-4 w-4 mr-2" />
                  <span>미팅 나가기</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex-grow flex">
          {/* Main video grid */}
          <div className="flex-grow overflow-auto p-4">
            {currentScreenShare ? (
              <div className="h-full flex flex-col">
                {/* Screen share */}
                <div className="relative w-full h-3/4 bg-black rounded-lg mb-2 flex items-center justify-center">
                  <div className="bg-[#1A1F2C] w-full h-full rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ScreenShare className="h-16 w-16 mx-auto text-[#9b87f5] opacity-50 mb-2" />
                      <p className="text-gray-400">{currentScreenShare.name} 공유 중</p>
                      <p className="text-xs text-gray-500">
                        {ACTIVE_MEMBERS.find(m => m.id === currentScreenShare.userId)?.name}님이 공유 중입니다
                      </p>
                    </div>
                    
                    {/* Pin and user info */}
                    <div className="absolute top-2 left-2 flex items-center bg-black/50 rounded-md px-2 py-1">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarImage 
                          src={ACTIVE_MEMBERS.find(m => m.id === currentScreenShare.userId)?.avatar} 
                          alt={ACTIVE_MEMBERS.find(m => m.id === currentScreenShare.userId)?.name} 
                        />
                        <AvatarFallback className="bg-[#7E69AB] text-xs">
                          {ACTIVE_MEMBERS.find(m => m.id === currentScreenShare.userId)?.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-white">
                        {ACTIVE_MEMBERS.find(m => m.id === currentScreenShare.userId)?.name}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Participants small videos */}
                <div className="grid grid-cols-6 gap-2 h-1/4">
                  {ACTIVE_MEMBERS.filter(m => m.status === "online").map((member, idx) => (
                    <div 
                      key={member.id}
                      className="relative bg-[#221F26] rounded-lg overflow-hidden"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
                        <span className="text-[10px] text-white bg-black/50 px-1 rounded truncate max-w-[80%]">
                          {member.name}
                          {member.isHost && <Crown className="h-3 w-3 inline ml-1 text-yellow-400" />}
                        </span>
                        {member.isSpeaking && (
                          <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                        )}
                      </div>
                      {member.status === "away" && (
                        <div className="absolute top-1 right-1">
                          <span className="bg-yellow-500 h-2 w-2 rounded-full"></span>
                        </div>
                      )}
                      {member.isMuted !== false && (
                        <div className="absolute top-1 left-1 bg-black/50 rounded-full p-0.5">
                          <MicOff className="h-2.5 w-2.5 text-red-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : viewLayout === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 h-full">
                {ACTIVE_MEMBERS.filter(m => m.status !== "offline").map((member, idx) => (
                  <div 
                    key={member.id} 
                    className={`relative bg-[#221F26] rounded-lg overflow-hidden ${
                      member.isSpeaking ? 'ring-2 ring-[#9b87f5]' : ''
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center aspect-video">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <span className="text-xs text-white bg-black/50 px-1.5 py-0.5 rounded-md truncate max-w-[80%]">
                        {member.name} 
                        {member.isHost && <Crown className="h-3 w-3 inline ml-1 text-yellow-400" />}
                      </span>
                      {member.isSpeaking && (
                        <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                      )}
                    </div>
                    {member.status === "away" && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-yellow-500 h-2 w-2 rounded-full"></span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 bg-black/30 text-white hover:bg-black/50">
                        <Pin className="h-3 w-3" />
                      </Button>
                    </div>
                    {member.isMuted !== false && (
                      <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                        <MicOff className="h-3 w-3 text-red-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col h-full">
                {/* Active speaker layout */}
                <div className="flex-grow relative bg-[#221F26] rounded-lg mb-2 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Avatar className="h-32 w-32">
                      <AvatarImage 
                        src={ACTIVE_MEMBERS.find(m => m.isSpeaking)?.avatar || ACTIVE_MEMBERS[0].avatar} 
                        alt={ACTIVE_MEMBERS.find(m => m.isSpeaking)?.name || ACTIVE_MEMBERS[0].name} 
                      />
                      <AvatarFallback className="bg-[#7E69AB]">
                        {(ACTIVE_MEMBERS.find(m => m.isSpeaking)?.name || ACTIVE_MEMBERS[0].name).substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <span className="text-sm text-white bg-black/50 px-2 py-1 rounded-md">
                      {ACTIVE_MEMBERS.find(m => m.isSpeaking)?.name || ACTIVE_MEMBERS[0].name}
                      {ACTIVE_MEMBERS.find(m => m.isSpeaking || m.id === ACTIVE_MEMBERS[0].id)?.isHost && (
                        <Crown className="h-4 w-4 inline ml-1 text-yellow-400" />
                      )}
                    </span>
                  </div>
                </div>
                
                {/* Participants strip */}
                <div className="h-24 flex space-x-2 overflow-x-auto">
                  {ACTIVE_MEMBERS.filter(m => m.status !== "offline").map((member) => (
                    <div 
                      key={member.id}
                      className={`relative bg-[#221F26] rounded-lg min-w-[120px] ${
                        member.isSpeaking ? 'ring-2 ring-[#9b87f5]' : ''
                      }`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center">
                        <span className="text-[10px] text-white bg-black/50 px-1 rounded truncate max-w-[80%]">
                          {member.name}
                        </span>
                        {member.isSpeaking && (
                          <span className="bg-green-500 h-2 w-2 rounded-full"></span>
                        )}
                      </div>
                      {member.isMuted !== false && (
                        <div className="absolute top-1 left-1 bg-black/50 rounded-full p-0.5">
                          <MicOff className="h-2.5 w-2.5 text-red-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Side panels (chat/participants) */}
          {(chatOpen || participantsOpen) && (
            <div className="w-80 border-l border-gray-700 bg-[#221F26] flex flex-col">
              <div className="border-b border-gray-700 p-2">
                <Tabs defaultValue={chatOpen ? "chat" : "participants"} className="w-full">
                  <TabsList className="grid grid-cols-2 bg-[#2c2932]">
                    <TabsTrigger 
                      value="chat" 
                      onClick={() => {setChatOpen(true); setParticipantsOpen(false);}}
                      className="data-[state=active]:bg-[#7E69AB] data-[state=active]:text-white"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" /> 채팅
                    </TabsTrigger>
                    <TabsTrigger 
                      value="participants"
                      onClick={() => {setParticipantsOpen(true); setChatOpen(false);}}
                      className="data-[state=active]:bg-[#7E69AB] data-[state=active]:text-white"
                    >
                      <Users className="h-4 w-4 mr-1" /> 참가자
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chat" className="m-0">
                    <div className="flex flex-col h-[calc(100vh-14rem)]">
                      <ScrollArea className="flex-1 p-3">
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div 
                              key={message.id} 
                              className={`flex ${message.isMe ? 'justify-end' : 'items-start gap-3'}`}
                            >
                              {!message.isMe && (
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={message.avatar} alt={message.sender} />
                                  <AvatarFallback className="bg-[#7E69AB]">{message
