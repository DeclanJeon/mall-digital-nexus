import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from '@/components/ui/slider';
import { Switch } from "@/components/ui/switch"; 
import { Settings, Plus } from 'lucide-react';
import ChannelListItem from './ChannelListItem'; 
import { ChatGroup } from './types'; // Import ChatGroup from types.ts

// Removed inline props definition, using imported ChatGroup

interface GroupChatSidebarProps {
  chatGroups: ChatGroup[]; // Use imported type
  filteredGroups: ChatGroup[]; // Use imported type
  activeGroup: ChatGroup | null; // Use imported type
  searchQuery: string;
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleJoinChannel: (group: ChatGroup) => void; // Use imported type
  getChannelTypeIcon: (type: 'text' | 'voice' | 'video', isActive?: boolean) => React.ReactNode;
  handleCreateChannel: () => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
  newChannelName: string;
  setNewChannelName: (name: string) => void;
  channelType: 'text' | 'voice' | 'video';
  setChannelType: (type: 'text' | 'voice' | 'video') => void;
  micVolume: number[];
  setMicVolume: (volume: number[]) => void;
  speakerVolume: number[];
  setSpeakerVolume: (volume: number[]) => void;
  currentUserAvatar: string; 
  currentUserName: string; 
}

const GroupChatSidebar: React.FC<GroupChatSidebarProps> = ({
  filteredGroups,
  activeGroup,
  searchQuery,
  handleSearchChange,
  handleJoinChannel,
  getChannelTypeIcon,
  handleCreateChannel,
  isSettingsOpen,
  setIsSettingsOpen,
  newChannelName,
  setNewChannelName,
  channelType,
  setChannelType,
  micVolume,
  setMicVolume,
  speakerVolume,
  setSpeakerVolume,
  currentUserAvatar,
  currentUserName,
}) => {
  return (
    <div className="w-72 border-r border-gray-700 flex flex-col bg-[#1A1F2C] text-white">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">채팅 채널</h2>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#221F26] border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>새 채널 만들기</DialogTitle>
                <DialogDescription>
                  새로운 텍스트, 음성 또는 비디오 채널을 만듭니다.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="channel-name" className="text-right">
                    채널 이름
                  </Label>
                  <Input 
                    id="channel-name" 
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    className="col-span-3 bg-[#2c2932] border-gray-600" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="channel-type" className="text-right">
                    채널 유형
                  </Label>
                  <Tabs defaultValue={channelType} className="col-span-3" onValueChange={(value) => setChannelType(value as 'text' | 'voice' | 'video')}>
                    <TabsList className="grid w-full grid-cols-3 bg-[#2c2932]">
                      <TabsTrigger value="text" className="data-[state=active]:bg-[#7E69AB]">텍스트</TabsTrigger>
                      <TabsTrigger value="voice" className="data-[state=active]:bg-[#7E69AB]">음성</TabsTrigger>
                      <TabsTrigger value="video" className="data-[state=active]:bg-[#7E69AB]">비디오</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              <Button type="submit" className="bg-[#7E69AB] hover:bg-[#9b87f5]" onClick={handleCreateChannel}>채널 만들기</Button>
            </DialogContent>
          </Dialog>
        </div>
        <Input 
          type="search" 
          placeholder="채널 검색..." 
          className="w-full bg-[#2c2932] border-gray-600 placeholder-gray-500"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Channel List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredGroups.map((group) => (
            <ChannelListItem
              key={group.id}
              group={group}
              activeGroup={activeGroup}
              handleJoinChannel={handleJoinChannel}
              getChannelTypeIcon={getChannelTypeIcon}
            />
          ))}
        </div>
      </ScrollArea>

      {/* User Settings Footer */}
      <div className="p-3 border-t border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUserAvatar} />
            <AvatarFallback className="bg-gray-600">{currentUserName.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{currentUserName}</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-80 bg-[#221F26] border-gray-700 text-white p-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">사용자 설정</h4>
                <p className="text-sm text-gray-400">
                  마이크, 스피커 및 기타 설정을 조정합니다.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="mic-volume">마이크</Label>
                  <Slider 
                    id="mic-volume" 
                    defaultValue={micVolume} 
                    max={100} 
                    step={1} 
                    className="col-span-2 [&>span:first-child]:h-1 [&>span:first-child>span]:bg-[#7E69AB]"
                    onValueChange={setMicVolume}
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="speaker-volume">스피커</Label>
                  <Slider 
                    id="speaker-volume" 
                    defaultValue={speakerVolume} 
                    max={100} 
                    step={1} 
                    className="col-span-2 [&>span:first-child]:h-1 [&>span:first-child>span]:bg-[#7E69AB]"
                    onValueChange={setSpeakerVolume}
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Label htmlFor="push-to-talk">눌러서 말하기</Label>
                  <Switch id="push-to-talk" className="data-[state=checked]:bg-[#7E69AB]" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default GroupChatSidebar;
