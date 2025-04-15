import React, { useRef, useState } from 'react'; 
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input'; 
import { 
  ChevronLeft, 
  CircleDot, 
  Maximize, 
  Minimize, 
  MoreVertical, 
  Info, 
  Settings, 
  PhoneOff, 
  ScreenShare, 
  Pin, 
  Crown, 
  MicOff, 
  MessageSquare, 
  Users,
  Mic, 
  Video, 
  VideoOff, 
  VolumeX, 
  Volume2, 
  Hand, 
  LayoutGrid, 
  Layout, 
  Share2, 
  MoreHorizontal, 
  PaperclipIcon, 
  Smile, 
  Send 
} from 'lucide-react';
import { ChatGroup, ActiveMember, ScreenShareData, Message } from './types'; // Import types from types.ts

// Removed inline type definitions

interface VideoCallInterfaceProps {
  activeGroup: ChatGroup;
  activeMembers: ActiveMember[];
  messages: Message[]; 
  newMessage: string; 
  setNewMessage: (message: string) => void; 
  handleSendMessage: () => void; 
  currentScreenShare: ScreenShareData | null;
  isRecording: boolean;
  isFullScreen: boolean;
  isMuted: boolean; 
  isVideoOff: boolean; 
  isDeafened: boolean; 
  isScreenSharing: boolean; 
  isHandRaised: boolean; 
  chatOpen: boolean;
  participantsOpen: boolean;
  viewLayout: 'grid' | 'speaker';
  mainContainerRef: React.RefObject<HTMLDivElement>;
  setActiveView: (view: 'rooms' | 'chat') => void;
  setIsRecording: (isRecording: boolean) => void;
  toggleFullScreen: () => void;
  handleLeaveChannel: () => void;
  setChatOpen: (isOpen: boolean) => void;
  setParticipantsOpen: (isOpen: boolean) => void;
  handleToggleMute: () => void; 
  handleToggleVideo: () => void; 
  handleToggleDeafen: () => void; 
  handleToggleScreenShare: () => void; 
  handleRaiseHand: () => void; 
  setViewLayout: (layout: 'grid' | 'speaker') => void; 
}

const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  activeGroup,
  activeMembers,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  currentScreenShare,
  isRecording,
  isFullScreen,
  isMuted,
  isVideoOff,
  isDeafened,
  isScreenSharing,
  isHandRaised,
  chatOpen,
  participantsOpen,
  viewLayout,
  mainContainerRef,
  setActiveView,
  setIsRecording,
  toggleFullScreen,
  handleLeaveChannel,
  setChatOpen,
  setParticipantsOpen,
  handleToggleMute,
  handleToggleVideo,
  handleToggleDeafen,
  handleToggleScreenShare,
  handleRaiseHand,
  setViewLayout,
}) => {

  // Find active speaker (example logic, might need adjustment)
  const activeSpeaker = activeMembers.find(m => m.isSpeaking) || activeMembers.find(m => m.status !== 'offline') || activeMembers[0];
  const onlineMembers = activeMembers.filter(m => m.status !== 'offline');

  return (
    <div ref={mainContainerRef} className="flex flex-col h-full bg-[#1A1F2C]">
      {/* Top control bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#221F26] border-b border-gray-700 text-white">
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
                  <CircleDot className={`h-5 w-5 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} /> 
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
                      {activeMembers.find(m => m.id === currentScreenShare.userId)?.name}님이 공유 중입니다
                    </p>
                  </div>
                  
                  {/* Pin and user info */}
                  <div className="absolute top-2 left-2 flex items-center bg-black/50 rounded-md px-2 py-1">
                    <Avatar className="h-5 w-5 mr-1">
                      <AvatarImage 
                        src={activeMembers.find(m => m.id === currentScreenShare.userId)?.avatar} 
                        alt={activeMembers.find(m => m.id === currentScreenShare.userId)?.name} 
                      />
                      <AvatarFallback className="bg-[#7E69AB] text-xs">
                        {activeMembers.find(m => m.id === currentScreenShare.userId)?.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-white">
                      {activeMembers.find(m => m.id === currentScreenShare.userId)?.name}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Participants small videos */}
              <div className="grid grid-cols-6 gap-2 h-1/4">
                {onlineMembers.map((member) => (
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
              {onlineMembers.map((member) => (
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
          ) : ( // Speaker view
            <div className="flex flex-col h-full">
              {/* Active speaker layout */}
              <div className="flex-grow relative bg-[#221F26] rounded-lg mb-2 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage 
                      src={activeSpeaker?.avatar} 
                      alt={activeSpeaker?.name} 
                    />
                    <AvatarFallback className="bg-[#7E69AB]">
                      {activeSpeaker?.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                  <span className="text-sm text-white bg-black/50 px-2 py-1 rounded-md">
                    {activeSpeaker?.name}
                    {activeSpeaker?.isHost && (
                      <Crown className="h-4 w-4 inline ml-1 text-yellow-400" />
                    )}
                  </span>
                </div>
              </div>
              
              {/* Participants strip */}
              <div className="h-24 flex space-x-2 overflow-x-auto">
                {onlineMembers.map((member) => (
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
                  <div className="flex flex-col h-[calc(100vh-14rem)]"> {/* Adjusted height calculation */}
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
                                <AvatarFallback className="bg-[#7E69AB]">
                                  {message.sender.substring(0, 2)} {/* Corrected fallback content */}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className={`p-2 rounded-lg max-w-[75%] ${message.isMe ? 'bg-[#7E69AB] text-white' : 'bg-[#2c2932] text-gray-300'}`}>
                              {!message.isMe && <p className="text-xs font-medium text-[#9b87f5] mb-1">{message.sender}</p>}
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${message.isMe ? 'text-gray-300' : 'text-gray-500'} text-right`}>{message.time}</p>
                            </div>
                            {message.isMe && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={message.avatar} alt={message.sender} />
                                <AvatarFallback className="bg-gray-600">나</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-3 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <Input 
                          type="text" 
                          placeholder="메시지 입력..." 
                          className="flex-1 bg-[#2c2932] border-gray-600 text-white placeholder-gray-500"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                          <Smile className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                          <PaperclipIcon className="h-5 w-5" />
                        </Button>
                        <Button size="icon" className="bg-[#7E69AB] hover:bg-[#9b87f5]" onClick={handleSendMessage}>
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="participants" className="m-0">
                  <ScrollArea className="h-[calc(100vh-14rem)] p-3"> {/* Adjusted height calculation */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-400 mb-2">참가자 ({onlineMembers.length})</h4>
                      {onlineMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} alt={member.name} />
                              <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-white truncate">{member.name}</span>
                            {member.isHost && <Crown className="h-4 w-4 text-yellow-400" />}
                          </div>
                          <div className="flex items-center gap-2">
                            {member.isMuted !== false && <MicOff className="h-4 w-4 text-red-500" />}
                            {member.status === 'online' && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                            {member.status === 'away' && <span className="h-2 w-2 rounded-full bg-yellow-500"></span>}
                            {/* Offline members are filtered out, so no need for offline status indicator here */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>

      {/* Bottom control bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-[#221F26] border-t border-gray-700 text-white">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isMuted ? "destructive" : "secondary"} 
                  size="icon" 
                  className="bg-[#2c2932] hover:bg-[#3a3640] text-white"
                  onClick={handleToggleMute}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isMuted ? '음소거 해제' : '음소거'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isVideoOff ? "destructive" : "secondary"} 
                  size="icon" 
                  className="bg-[#2c2932] hover:bg-[#3a3640] text-white"
                  onClick={handleToggleVideo}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isVideoOff ? '비디오 시작' : '비디오 중지'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isDeafened ? "destructive" : "secondary"} 
                  size="icon" 
                  className="bg-[#2c2932] hover:bg-[#3a3640] text-white"
                  onClick={handleToggleDeafen}
                >
                  {isDeafened ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isDeafened ? '소리 켜기' : '소리 끄기'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="bg-[#2c2932] hover:bg-[#3a3640] text-white"
                  onClick={() => setParticipantsOpen(!participantsOpen)}
                >
                  <Users className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>참가자</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="bg-[#2c2932] hover:bg-[#3a3640] text-white"
                  onClick={() => setChatOpen(!chatOpen)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>채팅</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isScreenSharing ? "default" : "secondary"} 
                  size="icon" 
                  className={`${isScreenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-[#2c2932] hover:bg-[#3a3640]'} text-white`}
                  onClick={handleToggleScreenShare}
                >
                  <ScreenShare className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isScreenSharing ? '공유 중지' : '화면 공유'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={isHandRaised ? "default" : "secondary"} 
                  size="icon" 
                  className={`${isHandRaised ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#2c2932] hover:bg-[#3a3640]'} text-white`}
                  onClick={handleRaiseHand}
                >
                  <Hand className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isHandRaised ? '손 내리기' : '손 들기'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="secondary" 
                size="icon"
                className="bg-[#2c2932] hover:bg-[#3a3640] text-white"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" className="bg-[#221F26] border-gray-700 text-white">
              <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer" onClick={() => setViewLayout("grid")}>
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span>격자 보기</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer" onClick={() => setViewLayout("speaker")}>
                <Layout className="h-4 w-4 mr-2" />
                <span>발표자 보기</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="hover:bg-[#2c2932] cursor-pointer">
                <Share2 className="h-4 w-4 mr-2" />
                <span>초대하기</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button 
          variant="destructive" 
          size="sm"
          onClick={handleLeaveChannel}
        >
          <PhoneOff className="h-4 w-4 mr-1" />
          나가기
        </Button>
      </div>
    </div>
  );
};

export default VideoCallInterface;
