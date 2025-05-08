import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare,
  Video,
  Mic,
  MicOff,
  Headphones,
  Volume2,
  VolumeX,
  Settings,
  Plus,
  ScreenShare,
  Layout,
  LayoutGrid,
  Users,
  Hand,
  Share2,
  CircleDot, 
  Pin,
  Info,
  MoreVertical,
  Phone,
  PhoneOff,
  Maximize,
  Minimize,
  Crown,
  ChevronLeft 
} from 'lucide-react'; // Removed unused icons
import { Button } from '@/components/ui/button'; 
import { toast } from 'sonner';
import { Dialog } from "@/components/ui/dialog"; // Only keep Dialog import
import GroupChatSidebar from './groupchat/GroupChatSidebar'; 
import GroupChatMain from './groupchat/GroupChatMain'; 
import { ChatGroup, Message, ActiveMember, ScreenShareData } from './groupchat/types'; 
import { MOCK_CHAT_GROUPS, MOCK_MESSAGES, ACTIVE_MEMBERS, SCREEN_SHARES } from './groupchat/mockData'; // Import mock data

// Remove inline type definitions and mock data declarations

const GroupChat = () => {
  // State definitions must be inside the component
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>(MOCK_CHAT_GROUPS); 
  const [activeGroup, setActiveGroup] = useState<ChatGroup | null>(null); 
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES); 
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [channelType, setChannelType] = useState<'text' | 'voice' | 'video'>("text"); 
  const [activeView, setActiveView] = useState<'rooms' | 'chat'>("rooms"); 
  const [viewLayout, setViewLayout] = useState<'grid' | 'speaker'>("grid"); 
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentScreenShare, setCurrentScreenShare] = useState<ScreenShareData | null>(null); 
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false); 
  const [participantsOpen, setParticipantsOpen] = useState(false); 
  const [micVolume, setMicVolume] = useState([75]);
  const [speakerVolume, setSpeakerVolume] = useState([80]);
  const mainContainerRef = useRef<HTMLDivElement>(null); 

  const filteredGroups = chatGroups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
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
      if (mainContainerRef.current?.requestFullscreen) {
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
      const newMsg: Message = { 
        id: Date.now(), // Use timestamp for mock ID
        sender: "익명 사용자", 
        content: newMessage.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        avatar: "", 
        isMe: true
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Update last message in groups (optional)
      setChatGroups(chatGroups.map(group => 
        group.id === activeGroup?.id 
          ? { ...group, lastMessage: newMessage.trim(), lastMessageTime: "방금", unreadCount: 0 }
          : group
      ));
    }
  };

  const handleJoinChannel = (group: ChatGroup) => { 
    if (activeGroup?.id === group.id) return; // Do nothing if already in the channel

    if (activeGroup) {
      handleLeaveChannel(); 
    }
    
    setActiveGroup(group);
    setActiveView("chat");
    
    // Reset controls
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
      setTimeout(() => {
        setCurrentScreenShare(SCREEN_SHARES[0]); 
        toast.success("화면 공유가 시작되었습니다.");
      }, 500); 
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
    
    const newChannel: ChatGroup = { 
      id: Date.now(), 
      name: newChannelName,
      members: [], 
      lastMessage: `${newChannelName} 채널이 생성되었습니다.`,
      lastMessageTime: "방금",
      unreadCount: 0,
      avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=group${Date.now()}`, 
      type: channelType,
      isActive: true 
    };
    
    setChatGroups([...chatGroups, newChannel]);
    setNewChannelName("");
    setIsSettingsOpen(false); 
    toast.success(`'${newChannelName}' 채널이 생성되었습니다.`);
    handleJoinChannel(newChannel); 
  };

  // Utility function to get icon based on channel type
  const getChannelTypeIcon = (type: 'text' | 'voice' | 'video', isActive = false) => { 
    const className = `h-4 w-4 ${isActive ? "text-green-500" : ""}`;
    switch (type) {
      case "voice":
        return <Headphones className={className} />;
      case "video":
        return <Video className={className} />;
      default:
        return <MessageSquare className={className} />;
    }
  };

  // Render main component using the new Sidebar and Main components
  return (
    <div className="flex h-screen bg-[#1A1F2C] text-white">
      <GroupChatSidebar
        chatGroups={chatGroups} 
        filteredGroups={filteredGroups} 
        activeGroup={activeGroup}
        searchQuery={searchQuery}
        handleSearchChange={handleSearchChange} 
        handleJoinChannel={handleJoinChannel}
        getChannelTypeIcon={getChannelTypeIcon}
        handleCreateChannel={handleCreateChannel}
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        newChannelName={newChannelName}
        setNewChannelName={setNewChannelName}
        channelType={channelType}
        setChannelType={setChannelType}
        micVolume={micVolume}
        setMicVolume={setMicVolume}
        speakerVolume={speakerVolume}
        setSpeakerVolume={setSpeakerVolume}
        currentUserAvatar="https://api.dicebear.com/7.x/personas/svg?seed=currentUser" 
        currentUserName="익명 사용자" 
      />
      <GroupChatMain
        activeView={activeView}
        activeGroup={activeGroup}
        messages={messages}
        newMessage={newMessage}
        handleSendMessage={handleSendMessage}
        setNewMessage={setNewMessage}
        handleLeaveChannel={handleLeaveChannel}
        ACTIVE_MEMBERS={ACTIVE_MEMBERS} 
        isMuted={isMuted}
        isDeafened={isDeafened}
        handleToggleMute={handleToggleMute}
        handleToggleDeafen={handleToggleDeafen}
        // Video Call specific props passed to GroupChatMain
        currentScreenShare={currentScreenShare}
        isRecording={isRecording}
        isFullScreen={isFullScreen}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        isHandRaised={isHandRaised}
        chatOpen={chatOpen}
        participantsOpen={participantsOpen}
        viewLayout={viewLayout}
        mainContainerRef={mainContainerRef} 
        setActiveView={setActiveView} 
        setIsRecording={setIsRecording} 
        toggleFullScreen={toggleFullScreen} 
        setChatOpen={setChatOpen} 
        setParticipantsOpen={setParticipantsOpen} 
        handleToggleVideo={handleToggleVideo} 
        handleToggleScreenShare={handleToggleScreenShare} 
        handleRaiseHand={handleRaiseHand} 
        setViewLayout={setViewLayout} 
      />
    </div>
  );
};

export default GroupChat;
