import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Mail } from 'lucide-react';

interface NotificationSettingsProps {
  onSave: () => void;
}

export const NotificationSettings = ({ onSave }: NotificationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>알림 설정</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">이메일 알림</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span>새 주문 알림</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span>새 리뷰 알림</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span>새 메시지 알림</span>
                <Switch />
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span>시스템 장애 알림</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>보안 알림</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">푸시 알림</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span>실시간 주문 알림</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span>메시지 알림</span>
                <Switch defaultChecked />
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span>커뮤니티 활동 알림</span>
                <Switch />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>긴급 보안 알림</span>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">알림 이메일 설정</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input 
                  type="email"
                  placeholder="알림 수신 이메일" 
                  defaultValue="admin@example.com" 
                />
              </div>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" /> 
                테스트 메일 발송
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onSave}>저장</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
