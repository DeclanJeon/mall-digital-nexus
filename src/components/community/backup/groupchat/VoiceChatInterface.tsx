import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Headphones, Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { ChatGroup, ActiveMember } from './types'; // Import types from types.ts

// Removed inline ActiveMember definition

interface VoiceChatInterfaceProps {
  activeGroup: ChatGroup;
  activeMembers: ActiveMember[];
  isMuted: boolean;
  isDeafened: boolean;
  handleToggleMute: () => void;
  handleToggleDeafen: () => void;
  handleLeaveChannel: () => void;
}

const VoiceChatInterface: React.FC<VoiceChatInterfaceProps> = ({
  activeGroup,
  activeMembers,
  isMuted,
  isDeafened,
  handleToggleMute,
  handleToggleDeafen,
  handleLeaveChannel,
}) => {
  const onlineMembers = activeMembers.filter(m => m.status !== 'offline');

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#1A1F2C] text-white">
      <Headphones className="h-24 w-24 text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{activeGroup.name}</h3>
      <p className="text-gray-400 mb-4">{onlineMembers.length}명 참여 중</p>
      <div className="flex flex-wrap justify-center gap-4 max-w-md mb-8">
        {onlineMembers.map(member => (
          <TooltipProvider key={member.id}>
            <Tooltip>
              <TooltipTrigger>
                <Avatar className={`h-12 w-12 ${member.isSpeaking ? 'ring-2 ring-[#9b87f5]' : ''}`}>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-[#7E69AB]">{member.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent className="bg-[#221F26] text-white border-gray-700">
                <p>{member.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Button 
          variant={isMuted ? "destructive" : "secondary"} 
          size="lg" 
          className="rounded-full w-16 h-16 bg-[#2c2932] hover:bg-[#3a3640] text-white"
          onClick={handleToggleMute}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
        <Button 
          variant="destructive" 
          size="lg" 
          className="rounded-full w-16 h-16"
          onClick={handleLeaveChannel}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
        <Button 
          variant={isDeafened ? "destructive" : "secondary"} 
          size="lg" 
          className="rounded-full w-16 h-16 bg-[#2c2932] hover:bg-[#3a3640] text-white"
          onClick={handleToggleDeafen}
        >
          {isDeafened ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </Button>
      </div>
    </div>
  );
};

export default VoiceChatInterface;
