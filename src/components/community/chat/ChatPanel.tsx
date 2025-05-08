// src/components/community/ChatPanel.tsx
import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Circle as CircleIcon } from 'lucide-react';
import { ChatPanelProps } from '../types';

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  username,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing && newMessage.trim() !== '') {
      onSendMessage();
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col h-[calc(var(--board-view-height,80vh)-100px)] min-h-[400px] max-h-[700px]">
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/10">
        <h3 className="font-bold text-lg">글로벌 채팅</h3>
        <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-500/30">
          <CircleIcon className="h-2 w-2 mr-1.5 fill-green-500 animate-pulse" />
          <span>{Math.floor(Math.random() * 50) + 20}명 온라인</span>
        </Badge>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.author === username ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end max-w-[85%] ${message.author === username ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-2`}>
              <Avatar className="h-8 w-8 flex-shrink-0 self-start">
                <AvatarImage src={message.authorAvatar} alt={message.author} />
                <AvatarFallback>{message.author ? message.author[0].toUpperCase() : 'A'}</AvatarFallback>
              </Avatar>
              <div
                className={`px-3 py-2 rounded-xl break-words ${
                  message.author === username
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white/10 text-white rounded-bl-none'
                }`}
              >
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs font-medium opacity-90">{message.author !== username ? message.author : '나'}</span>
                  <span className="text-xs opacity-70 ml-2">{message.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 border-t border-white/10 bg-black/20">
        <div className="flex space-x-2">
          <Input
            placeholder="메시지 입력..."
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-white/5 border-white/20 text-white flex-1"
            aria-label="채팅 메시지 입력"
          />
          <Button
            size="icon"
            onClick={onSendMessage}
            disabled={newMessage.trim() === ''}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            aria-label="메시지 전송"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;