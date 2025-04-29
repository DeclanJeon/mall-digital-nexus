import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaperclipIcon, Send, Smile, UserPlus, Search, MoreHorizontal } from 'lucide-react';
import { ChatGroup, Message } from './types'; // Import types from types.ts

// Removed inline Message definition

interface TextChatInterfaceProps {
  activeGroup: ChatGroup; 
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
}

const TextChatInterface: React.FC<TextChatInterfaceProps> = ({
  activeGroup,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
}) => {
  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-[#1A1F2C] text-white">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activeGroup.avatar} alt={activeGroup.name} />
            <AvatarFallback className="bg-[#7E69AB]">{activeGroup.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{activeGroup.name}</h3>
            <p className="text-xs text-gray-400">{activeGroup.members.length}명 멤버</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <UserPlus className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 bg-[#1A1F2C]">
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

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700 bg-[#1A1F2C]">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
            <PaperclipIcon className="h-5 w-5" />
          </Button>
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
          <Button size="icon" className="bg-[#7E69AB] hover:bg-[#9b87f5]" onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default TextChatInterface;
