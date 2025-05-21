
import React from 'react';
import Header from "@/components/peermall/Header";
import Sidebar from "@/components/peermall/Sidebar";
import { Phone, Video, MoreVertical, Send, Paperclip, Smile, Search } from 'lucide-react';
import { Peermall } from '../Index';

const Messages = () => {
  const contacts = [
    { 
      id: 1, 
      name: '김철수', 
      lastMessage: '안녕하세요, 잘 지내시나요?',
      time: '오전 10:23',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
      online: true
    },
    { 
      id: 2, 
      name: '이영희', 
      lastMessage: '프로젝트 파일 공유해 드렸어요.',
      time: '어제',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
      online: true
    },
    { 
      id: 3, 
      name: '박지성', 
      lastMessage: '신뢰 그룹 초대 수락했습니다.',
      time: '어제',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&auto=format&fit=crop',
      online: false
    },
    { 
      id: 4, 
      name: '정다솜', 
      lastMessage: '새로운 커뮤니티 구역 만들었어요!',
      time: '화요일',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
      online: true
    },
  ];
  
  const messages = [
    { id: 1, text: '안녕하세요, 피어몰 커뮤니티에 대해 질문이 있어요.', sent: false, time: '오전 10:15' },
    { id: 2, text: '네, 안녕하세요! 무엇이든 물어보세요.', sent: true, time: '오전 10:17' },
    { id: 3, text: '커뮤니티 구역을 생성하려면 어떻게 해야 하나요?', sent: false, time: '오전 10:20' },
    { id: 4, text: '먼저 피어몰을 생성하신 후, 커뮤니티 탭에서 "피어몰 커뮤니티" 항목의 생성하기 버튼을 클릭하시면 됩니다. 자세한 가이드가 필요하시면 알려드릴게요!', sent: true, time: '오전 10:23' },
    { id: 5, text: '감사합니다! 그리고 7인 추천인 시스템은 어떻게 구성하나요?', sent: false, time: '오전 10:25' }
  ];

  return (
    <div className="min-h-screen bg-peermall-gray flex">
      <Sidebar />
      
      <main className="flex-1 flex overflow-hidden">
        <div className="w-80 bg-white border-r border-peermall-light-gray flex flex-col">
          <div className="p-4 border-b border-peermall-light-gray">
            <h2 className="text-lg font-bold mb-4">메시지</h2>
            <div className="flex items-center gap-2 bg-peermall-light-gray rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="연락처 검색"
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {contacts.map(contact => (
              <div 
                key={contact.id}
                className={`flex items-center gap-3 p-4 hover:bg-peermall-gray cursor-pointer transition-colors ${contact.id === 1 ? 'bg-peermall-gray' : ''}`}
              >
                <div className="relative">
                  <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-peermall-green rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <span className="bg-peermall-blue text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-4 border-b border-peermall-light-gray flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={contacts[0].avatar}
                  alt={contacts[0].name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-peermall-green rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-semibold">{contacts[0].name}</h3>
                <span className="text-xs text-peermall-green">온라인</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="bg-peermall-light-blue p-2 rounded-full text-peermall-blue hover:bg-peermall-blue/20 transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="bg-peermall-light-blue p-2 rounded-full text-peermall-blue hover:bg-peermall-blue/20 transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="bg-peermall-light-gray p-2 rounded-full text-muted-foreground hover:bg-peermall-gray transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-peermall-gray p-4 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-6">
                <span className="text-xs bg-white px-3 py-1 rounded-full text-muted-foreground">
                  오늘, 2025년 5월 20일
                </span>
              </div>
              
              {messages.map(message => (
                <div 
                  key={message.id}
                  className={`mb-4 flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                >
                  {!message.sent && (
                    <img 
                      src={contacts[0].avatar}
                      alt={contacts[0].name}
                      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                    />
                  )}
                  <div className="max-w-xs">
                    <div className={`p-3 rounded-2xl ${message.sent ? 'bg-peermall-blue text-white' : 'bg-white'}`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <div className={`mt-1 text-xs text-muted-foreground ${message.sent ? 'text-right' : ''}`}>
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-4 border-t border-peermall-light-gray">
            <div className="flex items-center gap-3">
              <button className="text-muted-foreground hover:text-peermall-blue transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 bg-peermall-light-gray rounded-2xl px-4 py-2 flex items-center">
                <input 
                  type="text" 
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 bg-transparent border-none outline-none"
                />
                <button className="text-muted-foreground hover:text-peermall-blue transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button className="bg-peermall-blue text-white p-2 rounded-full hover:bg-peermall-dark-blue transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Messages;
