import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChatGroup } from './types'; // Import ChatGroup from types.ts

// Removed inline props definition, using imported ChatGroup

interface ChannelListItemProps {
  group: ChatGroup; // Use imported type
  activeGroup: ChatGroup | null; // Use imported type
  handleJoinChannel: (group: ChatGroup) => void; // Use imported type
  getChannelTypeIcon: (type: 'text' | 'voice' | 'video', isActive?: boolean) => React.ReactNode;
}

const ChannelListItem: React.FC<ChannelListItemProps> = ({ 
  group, 
  activeGroup, 
  handleJoinChannel, 
  getChannelTypeIcon 
}) => {
  return (
    <Button 
      key={group.id} 
      variant={activeGroup?.id === group.id ? "secondary" : "ghost"} 
      className={`w-full justify-start h-auto py-2 px-3 ${activeGroup?.id === group.id ? 'bg-[#2c2932]' : 'hover:bg-[#2c2932]'}`}
      onClick={() => handleJoinChannel(group)}
    >
      <Avatar className="h-8 w-8 mr-3">
        <AvatarImage src={group.avatar} alt={group.name} />
        <AvatarFallback className="bg-[#7E69AB]">{group.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left overflow-hidden">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate">{group.name}</span>
          <span className="text-xs text-gray-400">{group.lastMessageTime}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-gray-400 truncate">{group.lastMessage}</p>
          {group.unreadCount > 0 && (
            <Badge className="bg-[#7E69AB] text-white px-1.5 py-0.5 text-[10px] h-4 min-w-[16px] flex items-center justify-center">
              {group.unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          {getChannelTypeIcon(group.type, group.isActive)}
          <span className="ml-1">{group.members.length}명</span>
        </div>
      </div>
    </Button>
  );
};

export default ChannelListItem;
