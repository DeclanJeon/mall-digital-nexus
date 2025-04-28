
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, MessageSquare, Mail } from 'lucide-react';

interface Message {
  id: string;
  from: {
    name: string;
    image?: string;
  };
  preview: string;
  time: string;
  unread: boolean;
}

interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  enabled: boolean;
}

interface CommunicationSectionProps {
  messages: Message[];
  notificationSettings: NotificationSetting[];
}

const CommunicationSection: React.FC<CommunicationSectionProps> = ({
  messages,
  notificationSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-primary" />
          커뮤니케이션
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              통합 메시지함
            </h3>
            <Button variant="outline" size="sm">전체 보기</Button>
          </div>
          
          {messages.length > 0 ? (
            <div className="space-y-2">
              {messages.slice(0, 3).map((message) => (
                <div 
                  key={message.id} 
                  className={`flex items-center p-3 rounded-md ${message.unread ? 'bg-primary/5' : 'bg-muted'}`}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={message.from.image} />
                    <AvatarFallback>{message.from.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className={`font-medium ${message.unread ? 'text-primary' : ''}`}>{message.from.name}</p>
                      <span className="text-xs text-muted-foreground">{message.time}</span>
                    </div>
                    <p className="text-sm truncate">{message.preview}</p>
                  </div>
                  {message.unread && (
                    <Badge className="ml-2 h-2 w-2 rounded-full p-0" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-muted rounded-md">
              <p className="text-muted-foreground">새로운 메시지가 없습니다</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium flex items-center mb-3">
            <Bell className="h-4 w-4 mr-2" />
            알림 설정
          </h3>
          
          <div className="space-y-3">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div>
                  <Label htmlFor={`notification-${setting.id}`} className="font-medium">
                    {setting.type}
                  </Label>
                  <p className="text-xs text-muted-foreground">{setting.description}</p>
                </div>
                <Switch 
                  id={`notification-${setting.id}`} 
                  defaultChecked={setting.enabled} 
                />
              </div>
            ))}
          </div>
          
          <Button variant="link" className="px-0 mt-2">
            알림 설정 더보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationSection;
