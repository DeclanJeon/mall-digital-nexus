
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
  HandRaised,
  Share2,
  RecordIcon,
  PinIcon,
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
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

// Mock active members
const ACTIVE_MEMBERS = [
  { id: 1, name: "창업왕", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user1", isSpeaking: false, isHost: true },
  { id: 2, name: "디자이너K", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user2", isSpeaking: true, isHost: false },
  { id: 3, name: "마케팅전문가", status: "away", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user3", isSpeaking: false, isHost: false },
  { id: 4, name: "신입몰러", status: "offline", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user4", isSpeaking: false, isHost: false },
  { id: 5, name: "프로젝트매니저", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user5", isSpeaking: false, isHost: false },
  { id: 6, name: "백엔드개발자", status: "online", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user6", isSpeaking: false, isHost: false },
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
                    <RecordIcon className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
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
                        <PinIcon className="h-3 w-3" />
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
                                  <AvatarFallback className="bg-[#7E69AB]">{message.sender.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                              )}
                              <div 
                                className={`max-w-[80%] ${
                                  message.isMe ? 'bg-[#9b87f5] text-white' : 'bg-[#2c2932] text-white'
                                } rounded-lg px-3 py-2`}
                              >
                                {!message.isMe && (
                                  <p className="text-xs font-medium mb-1 text-gray-300">{message.sender}</p>
                                )}
                                <p>{message.content}</p>
                                <p className="text-xs text-right mt-1 opacity-70">{message.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="p-3 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                <PaperclipIcon className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#221F26] border-gray-700 text-white">
                              <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer">
                                <Image className="h-4 w-4 mr-2" />
                                <span>이미지 공유</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer">
                                <Share2 className="h-4 w-4 mr-2" />
                                <span>파일 공유</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          <div className="flex-1 relative">
                            <Input
                              placeholder="메시지 입력..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                              className="bg-[#2c2932] border-gray-700 text-white"
                            />
                            <Button variant="ghost" size="icon" className="absolute right-0 top-0 text-gray-400">
                              <Smile className="h-5 w-5" />
                            </Button>
                          </div>
                          
                          <Button onClick={handleSendMessage} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="participants" className="m-0">
                    <div className="p-3">
                      <div className="mb-4">
                        <Input
                          placeholder="참가자 검색..."
                          className="bg-[#2c2932] border-gray-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-gray-400 mb-1">호스트 (1)</h4>
                        {ACTIVE_MEMBERS.filter(m => m.isHost).map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 hover:bg-[#2c2932] rounded-md">
                            <div className="flex items-center">
                              <Avatar className="h-7 w-7 mr-2">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm text-white">{member.name} <Crown className="h-3 w-3 inline text-yellow-400" /></p>
                                {member.isSpeaking && (
                                  <p className="text-[10px] text-green-400">말하는 중...</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {member.isMuted !== false && <MicOff className="h-4 w-4 text-red-500 mr-1" />}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#221F26] border-gray-700 text-white">
                                  <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer">
                                    <span>메시지 보내기</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                        
                        <h4 className="text-xs font-medium text-gray-400 mt-3 mb-1">참가자 ({ACTIVE_MEMBERS.filter(m => !m.isHost).length})</h4>
                        {ACTIVE_MEMBERS.filter(m => !m.isHost).map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-2 hover:bg-[#2c2932] rounded-md">
                            <div className="flex items-center">
                              <Avatar className="h-7 w-7 mr-2">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm text-white">{member.name}</p>
                                {member.isSpeaking && (
                                  <p className="text-[10px] text-green-400">말하는 중...</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center">
                              {member.isMuted !== false && <MicOff className="h-4 w-4 text-red-500 mr-1" />}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#221F26] border-gray-700 text-white">
                                  <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer">
                                    <span>메시지 보내기</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer">
                                    <span>호스트 권한 부여</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-gray-700" />
                                  <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer text-red-500 focus:text-red-500">
                                    <span>제거하기</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
        
        {/* Bottom controls bar */}
        <div className="bg-[#221F26] border-t border-gray-700 py-3 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isMuted ? "destructive" : "secondary"}
                      size="icon"
                      className={!isMuted ? "bg-[#7E69AB] hover:bg-[#9b87f5]" : ""}
                      onClick={handleToggleMute}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isMuted ? '마이크 켜기' : '마이크 끄기'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isVideoOff ? "destructive" : "secondary"}
                      size="icon"
                      className={!isVideoOff ? "bg-[#7E69AB] hover:bg-[#9b87f5]" : ""}
                      onClick={handleToggleVideo}
                    >
                      {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isVideoOff ? '카메라 켜기' : '카메라 끄기'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={isScreenSharing ? "default" : "secondary"}
                      size="icon" 
                      className={isScreenSharing ? "bg-green-600 hover:bg-green-700" : "bg-[#7E69AB] hover:bg-[#9b87f5]"}
                      onClick={handleToggleScreenShare}
                    >
                      {isScreenSharing ? <ScreenShareOff className="h-5 w-5" /> : <ScreenShare className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isScreenSharing ? '화면 공유 중지' : '화면 공유'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className={viewLayout === "grid" ? "border-[#9b87f5] text-[#9b87f5]" : "text-gray-400 border-gray-700"}
                      onClick={() => setViewLayout("grid")}
                    >
                      <LayoutGrid className="h-4 w-4 mr-1" />
                      <span className="sr-md:not-sr-only sr-only">그리드 뷰</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    그리드 뷰
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className={viewLayout === "speaker" ? "border-[#9b87f5] text-[#9b87f5]" : "text-gray-400 border-gray-700"}
                      onClick={() => setViewLayout("speaker")}
                    >
                      <Layout className="h-4 w-4 mr-1" />
                      <span className="sr-md:not-sr-only sr-only">발표자 뷰</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    발표자 뷰
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className={isHandRaised ? "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10" : "text-gray-400 border-gray-700"}
                      onClick={handleRaiseHand}
                    >
                      <HandRaised className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isHandRaised ? '손 내리기' : '손 들기'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className={chatOpen ? "border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10" : "text-gray-400 border-gray-700"}
                      onClick={() => {setChatOpen(!chatOpen); if (participantsOpen && !chatOpen) setParticipantsOpen(false)}}
                    >
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    채팅
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className={participantsOpen ? "border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5]/10" : "text-gray-400 border-gray-700"}
                      onClick={() => {setParticipantsOpen(!participantsOpen); if (chatOpen && !participantsOpen) setChatOpen(false)}}
                    >
                      <Users className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    참가자
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="text-gray-400 border-gray-700">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#221F26] text-white border-gray-700">
                  <DialogHeader>
                    <DialogTitle>설정</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      오디오, 비디오 및 기타 설정을 조정하세요.
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="audio">
                    <TabsList className="bg-[#2c2932]">
                      <TabsTrigger value="audio" className="data-[state=active]:bg-[#7E69AB]">오디오</TabsTrigger>
                      <TabsTrigger value="video" className="data-[state=active]:bg-[#7E69AB]">비디오</TabsTrigger>
                      <TabsTrigger value="general" className="data-[state=active]:bg-[#7E69AB]">일반</TabsTrigger>
                    </TabsList>
                    <TabsContent value="audio" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>마이크</Label>
                        <Select defaultValue="default">
                          <SelectTrigger className="bg-[#2c2932] border-gray-700">
                            <SelectValue placeholder="마이크 선택" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#221F26] border-gray-700">
                            <SelectItem value="default">기본 마이크</SelectItem>
                            <SelectItem value="headset">헤드셋 마이크</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>마이크 볼륨</Label>
                          <span className="text-sm text-gray-400">{micVolume}%</span>
                        </div>
                        <Slider 
                          value={micVolume} 
                          onValueChange={setMicVolume}
                          max={100}
                          step={1}
                          className="[&>span]:bg-[#9b87f5]"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>스피커 볼륨</Label>
                          <span className="text-sm text-gray-400">{speakerVolume}%</span>
                        </div>
                        <Slider 
                          value={speakerVolume} 
                          onValueChange={setSpeakerVolume}
                          max={100}
                          step={1}
                          className="[&>span]:bg-[#9b87f5]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>음성 처리</Label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">노이즈 캔슬링</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">에코 제거</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="video" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>카메라</Label>
                        <Select defaultValue="default">
                          <SelectTrigger className="bg-[#2c2932] border-gray-700">
                            <SelectValue placeholder="카메라 선택" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#221F26] border-gray-700">
                            <SelectItem value="default">내장 웹캠</SelectItem>
                            <SelectItem value="external">외부 카메라</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>비디오 미리보기</Label>
                        <div className="bg-[#2c2932] border border-gray-700 rounded-md aspect-video flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">HD 비디오</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">저조도 개선</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">미러링</span>
                          <Switch />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="general" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>화면 공유 설정</Label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">고화질 최적화</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">컴퓨터 오디오 공유</span>
                          <Switch />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>입장 및 퇴장</Label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">입장 시 소리 재생</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">퇴장 시 소리 재생</span>
                          <Switch />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>안전 기능</Label>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">대기실 활성화</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">호스트만 화면 공유 가능</span>
                          <Switch />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={handleLeaveChannel}
                    >
                      <PhoneOff className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    통화 종료
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        {/* Meeting timer */}
        <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/50 text-white px-2 py-1 rounded-md text-xs flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>01:24:32</span>
        </div>
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-500/80 text-white px-2 py-1 rounded-md text-xs flex items-center animate-pulse">
            <RecordIcon className="h-3 w-3 mr-1" />
            <span>녹화 중</span>
          </div>
        )}
      </div>
    );
  };

  const renderChatInterface = () => {
    if (!activeGroup) return null;
    
    switch (activeGroup.type) {
      case "voice":
        return (
          <div className="flex flex-col items-center justify-center h-full p-4 bg-[#1A1F2C] text-white">
            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={activeGroup.avatar} alt={activeGroup.name} />
                <AvatarFallback className="bg-[#7E69AB]">{activeGroup.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{activeGroup.name}</h3>
              <p className="text-sm text-gray-400 mb-2">음성 채팅 중</p>
              <Badge className="mb-4 bg-[#7E69AB]">{activeGroup.members.length}명 참여 중</Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              <Button 
                variant={isMuted ? "destructive" : "outline"} 
                size="lg" 
                className="flex flex-col items-center h-20 border-gray-700 text-white"
                onClick={handleToggleMute}
              >
                {isMuted ? <MicOff className="h-8 w-8 mb-1" /> : <Mic className="h-8 w-8 mb-1" />}
                {isMuted ? "음소거됨" : "마이크"}
              </Button>
              
              <Button 
                variant={isDeafened ? "destructive" : "outline"} 
                size="lg" 
                className="flex flex-col items-center h-20 border-gray-700 text-white"
                onClick={handleToggleDeafen}
              >
                {isDeafened ? <VolumeX className="h-8 w-8 mb-1" /> : <Headphones className="h-8 w-8 mb-1" />}
                {isDeafened ? "오디오 꺼짐" : "오디오"}
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="flex flex-col items-center h-20 border-gray-700 text-white"
              >
                <Settings className="h-8 w-8 mb-1" />
                설정
              </Button>
            </div>
            
            <Separator className="my-6 w-full max-w-md bg-gray-700" />
            
            <Button variant="destructive" size="lg" className="w-full max-w-md" onClick={handleLeaveChannel}>
              채널 나가기
            </Button>
            
            {/* Voice activity indicators */}
            <div className="mt-8 w-full max-w-md">
              <h4 className="text-lg font-medium mb-4">발언자</h4>
              <div className="space-y-3">
                {ACTIVE_MEMBERS.filter(m => m.status !== "offline").map((member) => (
                  <div 
                    key={member.id} 
                    className="flex items-center justify-between bg-[#221F26] p-3 rounded-lg"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-gray-400">
                          {member.status === "online" ? "온라인" : "자리비움"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {member.isSpeaking && (
                        <div className="flex space-x-0.5">
                          <div className="h-4 w-1 bg-green-500 rounded-sm animate-[pulse_1s_ease-in-out_infinite]"></div>
                          <div className="h-5 w-1 bg-green-500 rounded-sm animate-[pulse_1s_ease-in-out_0.1s_infinite]"></div>
                          <div className="h-3 w-1 bg-green-500 rounded-sm animate-[pulse_1s_ease-in-out_0.2s_infinite]"></div>
                          <div className="h-4 w-1 bg-green-500 rounded-sm animate-[pulse_1s_ease-in-out_0.3s_infinite]"></div>
                        </div>
                      )}
                      {member.isMuted !== false && (
                        <MicOff className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case "video":
        return renderVideoCallInterface();
      
      default:
        return (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 bg-[#221F26] border-b border-gray-700 text-white">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={activeGroup.avatar} alt={activeGroup.name} />
                  <AvatarFallback className="bg-[#7E69AB]">{activeGroup.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{activeGroup.name}</h3>
                  <p className="text-xs text-gray-400">{activeGroup.members.length}명 참여 중</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <UserPlus className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => setShowMembers(!showMembers)}>
                  <Users className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Chat area with messages */}
            <div className="flex flex-1 overflow-hidden bg-[#1A1F2C]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.isMe ? 'justify-end' : 'items-start gap-3'}`}
                    >
                      {!message.isMe && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.avatar} alt={message.sender} />
                          <AvatarFallback className="bg-[#7E69AB]">{message.sender.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`max-w-[80%] ${
                          message.isMe ? 'bg-[#9b87f5] text-white' : 'bg-[#2c2932] text-white'
                        } rounded-lg px-4 py-2`}
                      >
                        {!message.isMe && (
                          <p className="text-xs font-medium mb-1 text-gray-300">{message.sender}</p>
                        )}
                        <p>{message.content}</p>
                        <p className="text-xs text-right mt-1 opacity-70">{message.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Members sidebar */}
              {showMembers && (
                <div className="w-60 border-l border-gray-700 p-4 hidden md:block bg-[#221F26]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-white">참여자 목록</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => setShowMembers(false)}>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <Collapsible defaultOpen>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-white">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span>온라인 (2)</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-3 mt-1">
                        {ACTIVE_MEMBERS.filter(m => m.status === "online").map((member) => (
                          <div key={member.id} className="flex items-center gap-2 py-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-300">{member.name}</span>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-white">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span>자리비움 (1)</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-3 mt-1">
                        {ACTIVE_MEMBERS.filter(m => m.status === "away").map((member) => (
                          <div key={member.id} className="flex items-center gap-2 py-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-300">{member.name}</span>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                    
                    <Collapsible>
                      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-white">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400" />
                          <span>오프라인 (1)</span>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="ml-3 mt-1">
                        {ACTIVE_MEMBERS.filter(m => m.status === "offline").map((member) => (
                          <div key={member.id} className="flex items-center gap-2 py-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-300">{member.name}</span>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t border-gray-700 bg-[#221F26]">
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <PaperclipIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#221F26] border-gray-700 text-white">
                    <DropdownMenuItem className="hover:bg-[#2c2932] focus:bg-[#2c2932] cursor-pointer">
                      <Image className="h-4 w-4 mr-2" />
                      <span>이미지 업로드</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-[#2c2932] focus:bg-[#2c2932] cursor-pointer">
                      <Share2 className="h-4 w-4 mr-2" />
                      <span>파일 공유</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="flex-1 relative">
                  <Input
                    placeholder="메시지 입력..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="bg-[#2c2932] border-gray-700 text-white"
                  />
                  <Button variant="ghost" size="icon" className="absolute right-0 top-0 text-gray-400 hover:text-white">
                    <Smile className="h-5 w-5" />
                  </Button>
                </div>
                
                <Button onClick={handleSendMessage} className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        );
    }
  };

  const renderChatRooms = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50">
        <div className="md:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="채팅방 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <Button onClick={() => setIsSettingsOpen(true)} className="ml-4 bg-[#9b87f5] hover:bg-[#7E69AB]">
              <Plus className="h-4 w-4 mr-1" />
              새 채널 생성
            </Button>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 bg-white">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">전체</TabsTrigger>
              <TabsTrigger value="text" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">텍스트 채팅</TabsTrigger>
              <TabsTrigger value="voice" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">음성 채팅</TabsTrigger>
              <TabsTrigger value="video" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">화상 채팅</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-[#9b87f5] data-[state=active]:text-white">활성화된 채널</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
            
            <TabsContent value="text">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(group => group.type === "text").map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
            
            <TabsContent value="voice">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(group => group.type === "voice").map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
            
            <TabsContent value="video">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(group => group.type === "video").map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.filter(group => group.isActive).map((group) => renderChatRoomCard(group))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  };
  
  const renderChatRoomCard = (group) => {
    return (
      <Card key={group.id} className="overflow-hidden bg-white border border-gray-200 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <CardTitle className="text-lg mr-2">{group.name}</CardTitle>
              {getChannelTypeIcon(group.type, group.isActive)}
            </div>
            {group.isActive && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                활성화됨
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-1 flex items-center">
            <span className="mr-1">{group.members.length}명 참여 중</span> 
            {group.unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-[#9b87f5] text-white">{group.unreadCount}</Badge>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-0">
          {group.members.length > 0 ? (
            <div className="flex -space-x-2 overflow-hidden mb-2">
              {group.members.slice(0, 4).map((member, idx) => (
                <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={`https://api.dicebear.com/7.x/personas/svg?seed=${member}`} alt={member} />
                  <AvatarFallback className="bg-[#7E69AB]">{member.substring(0, 2)}</AvatarFallback>
                </Avatar>
              ))}
              {group.members.length > 4 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                  +{group.members.length - 4}
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">아직 참가자가 없습니다</p>
          )}
          <p className="text-sm text-gray-600 truncate">{group.lastMessage}</p>
          <p className="text-xs text-gray-500 mt-1">{group.lastMessageTime}</p>
        </CardContent>
        
        <CardFooter className="pt-4">
          <Button 
            className="w-full" 
            variant={group.type === "text" ? "default" : group.type === "voice" ? "outline" : "secondary"}
            onClick={() => handleJoinChannel(group)}
          >
            {group.type === "text" ? (
              <>
                <MessageSquare className="h-4 w-4 mr-1" />
                채팅 참여
              </>
            ) : group.type === "voice" ? (
              <>
                <Headphones className="h-4 w-4 mr-1" />
                음성 채팅 참여
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-1" />
                화상 채팅 참여
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  const ChevronLeft = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
  
  // Import Select components
  const { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } = require('@/components/ui/select');
  
  // Main component render
  return (
    <div className="h-[calc(100vh-14rem)] flex flex-col rounded-lg border overflow-hidden">
      {activeView === "rooms" ? (
        // Room selection view
        renderChatRooms()
      ) : (
        // Active chat view
        <div className="flex flex-col h-full">
          {/* Back button when in a chat (only for non-video chats) */}
          {activeGroup && activeGroup.type !== "video" && (
            <div className="bg-muted/50 p-2 flex items-center">
              <Button variant="ghost" size="sm" className="mr-2" onClick={() => setActiveView("rooms")}>
                <ChevronDown className="h-4 w-4 mr-1" />
                채팅방 목록으로
              </Button>
              {activeGroup && (
                <p className="text-sm text-muted-foreground">
                  {activeGroup.name} ({activeGroup.type === "text" ? "텍스트" : activeGroup.type === "voice" ? "음성" : "화상"} 채팅)
                </p>
              )}
            </div>
          )}
          
          {/* Chat interface */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderChatInterface()}
          </div>
        </div>
      )}
      
      {/* Create channel dialog */}
      {isSettingsOpen && (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="bg-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle>새 채널 만들기</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="channel-name" className="text-sm font-medium block mb-1">채널 이름</label>
                <Input 
                  id="channel-name"
                  placeholder="채널 이름"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="channel-description" className="text-sm font-medium block mb-1">채널 설명 (선택사항)</label>
                <textarea 
                  id="channel-description"
                  className="w-full border rounded-md px-3 py-2 h-24 resize-none"
                  placeholder="채널에 대한 간략한 설명을 입력하세요."
                  value={newChannelDescription}
                  onChange={(e) => setNewChannelDescription(e.target.value)}
                ></textarea>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">채널 유형</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    type="button" 
                    variant={channelType === "text" ? "default" : "outline"} 
                    onClick={() => setChannelType("text")}
                    className={`flex items-center justify-center ${channelType === "text" ? "bg-[#9b87f5] hover:bg-[#7E69AB]" : ""}`}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    텍스트
                  </Button>
                  <Button 
                    type="button" 
                    variant={channelType === "voice" ? "default" : "outline"} 
                    onClick={() => setChannelType("voice")}
                    className={`flex items-center justify-center ${channelType === "voice" ? "bg-[#9b87f5] hover:bg-[#7E69AB]" : ""}`}
                  >
                    <Headphones className="h-4 w-4 mr-1" />
                    음성
                  </Button>
                  <Button 
                    type="button" 
                    variant={channelType === "video" ? "default" : "outline"} 
                    onClick={() => setChannelType("video")}
                    className={`flex items-center justify-center ${channelType === "video" ? "bg-[#9b87f5] hover:bg-[#7E69AB]" : ""}`}
                  >
                    <Video className="h-4 w-4 mr-1" />
                    화상
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>취소</Button>
                <Button onClick={handleCreateChannel} className="bg-[#9b87f5] hover:bg-[#7E69AB]">채널 생성</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GroupChat;
