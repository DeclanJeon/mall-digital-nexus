import React from 'react';
import { MessageSquare } from 'lucide-react';
import TextChatInterface from './TextChatInterface'; 
import VoiceChatInterface from './VoiceChatInterface'; 
import VideoCallInterface from './VideoCallInterface'; 
import { ChatGroup, Message, ActiveMember, ScreenShareData } from './types'; // Import types from types.ts

// Removed inline type definitions

// Define types for props - adjust based on actual data structure and required functions
interface GroupChatMainProps {
  activeView: 'rooms' | 'chat';
  activeGroup: ChatGroup | null; 
  messages: Message[];
  newMessage: string;
  handleSendMessage: () => void;
  setNewMessage: (message: string) => void;
  handleLeaveChannel: () => void;
  // Props for Voice/Video Chat
  ACTIVE_MEMBERS: ActiveMember[];
  isMuted: boolean;
  isDeafened: boolean;
  handleToggleMute: () => void;
  handleToggleDeafen: () => void;
  // Props for Video Call (will likely need more)
  currentScreenShare: ScreenShareData | null;
  isRecording: boolean;
  isFullScreen: boolean;
  isVideoOff: boolean; 
  isScreenSharing: boolean; 
  isHandRaised: boolean; 
  chatOpen: boolean;
  participantsOpen: boolean;
  viewLayout: 'grid' | 'speaker';
  mainContainerRef: React.RefObject<HTMLDivElement>;
  setActiveView: (view: 'rooms' | 'chat') => void;
  setIsRecording: (isRecording: boolean) => void;
  toggleFullScreen: () => void;
  setChatOpen: (isOpen: boolean) => void;
  setParticipantsOpen: (isOpen: boolean) => void;
  handleToggleVideo: () => void; 
  handleToggleScreenShare: () => void; 
  handleRaiseHand: () => void; 
  setViewLayout: (layout: 'grid' | 'speaker') => void; 
}

const GroupChatMain: React.FC<GroupChatMainProps> = ({
  activeView,
  activeGroup,
  messages,
  newMessage,
  handleSendMessage,
  setNewMessage,
  handleLeaveChannel,
  ACTIVE_MEMBERS,
  isMuted,
  isDeafened,
  handleToggleMute,
  handleToggleDeafen,
  // Video Call specific props
  currentScreenShare,
  isRecording,
  isFullScreen,
  isVideoOff,
  isScreenSharing,
  isHandRaised,
  chatOpen,
  participantsOpen,
  viewLayout,
  mainContainerRef,
  setActiveView,
  setIsRecording,
  toggleFullScreen,
  setChatOpen,
  setParticipantsOpen,
  handleToggleVideo,
  handleToggleScreenShare,
  handleRaiseHand,
  setViewLayout,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-[#1A1F2C]">
      {activeView === "rooms" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MessageSquare className="h-16 w-16 mx-auto mb-4" />
            <p>참여할 채널을 선택하거나 새 채널을 만드세요.</p>
          </div>
        </div>
      )}
      
      {activeView === "chat" && activeGroup?.type === "text" && (
        <TextChatInterface 
          activeGroup={activeGroup} 
          messages={messages} 
          newMessage={newMessage} 
          setNewMessage={setNewMessage} 
          handleSendMessage={handleSendMessage} 
        />
      )}

      {activeView === "chat" && activeGroup?.type === "voice" && (
         <VoiceChatInterface 
           activeGroup={activeGroup}
           activeMembers={ACTIVE_MEMBERS}
           isMuted={isMuted}
           isDeafened={isDeafened}
           handleToggleMute={handleToggleMute}
           handleToggleDeafen={handleToggleDeafen}
           handleLeaveChannel={handleLeaveChannel}
         />
      )}

      {activeView === "chat" && activeGroup?.type === "video" && (
        <VideoCallInterface 
          activeGroup={activeGroup}
          activeMembers={ACTIVE_MEMBERS}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          currentScreenShare={currentScreenShare}
          isRecording={isRecording}
          isFullScreen={isFullScreen}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          isDeafened={isDeafened}
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
          handleToggleMute={handleToggleMute}
          handleToggleVideo={handleToggleVideo}
          handleToggleDeafen={handleToggleDeafen}
          handleToggleScreenShare={handleToggleScreenShare}
          handleRaiseHand={handleRaiseHand}
          setViewLayout={setViewLayout}
        />
      )}
    </div>
  );
};

export default GroupChatMain;
