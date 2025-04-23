import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GeneralSettingsProps {
  onSave: () => void;
  language: string;
  timezone: string;
  onLanguageChange: (value: string) => void;
  onTimezoneChange: (value: string) => void;
}

export const GeneralSettings = ({
  onSave,
  language,
  timezone,
  onLanguageChange,
  onTimezoneChange
}: GeneralSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 설정</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">언어</label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="언어 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ko">한국어</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">시간대</label>
          <Select value={timezone} onValueChange={onTimezoneChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="시간대 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Seoul">한국 표준시 (UTC+9)</SelectItem>
              <SelectItem value="America/Los_Angeles">미국 태평양 시간</SelectItem>
              <SelectItem value="Europe/London">영국 표준시</SelectItem>
              <SelectItem value="Asia/Tokyo">일본 표준시</SelectItem>
              <SelectItem value="Australia/Sydney">호주 동부 표준시</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">날짜 형식</label>
          <Select defaultValue="ymd">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="날짜 형식 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
              <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
              <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onSave}>저장</Button>
        </div>
      </CardContent>
    </Card>
  );
};
