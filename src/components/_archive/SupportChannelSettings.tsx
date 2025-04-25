import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SupportChannelSettingsProps {
  onSave: () => void;
}

export const SupportChannelSettings = ({ onSave }: SupportChannelSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>문의 접수 채널 설정</CardTitle>
        <CardDescription>
          고객 문의를 접수할 채널을 설정하고 관리합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="email-support" className="flex items-center space-x-2">
              <Checkbox id="email-support" />
              <span>이메일 문의 접수</span>
            </label>
            <Input type="email" id="email-support" placeholder="support@yourmall.com" className="w-64" />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="phone-support" className="flex items-center space-x-2">
              <Checkbox id="phone-support" />
              <span>전화 문의 접수</span>
            </label>
            <Input type="tel" id="phone-support" placeholder="02-1234-5678" className="w-64" />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="kakao-support" className="flex items-center space-x-2">
              <Checkbox id="kakao-support" />
              <span>카카오톡 상담</span>
            </label>
            <Input type="text" id="kakao-support" placeholder="카카오톡 채널 ID" className="w-64" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onSave}>저장</Button>
        </div>
      </CardContent>
    </Card>
  );
};
