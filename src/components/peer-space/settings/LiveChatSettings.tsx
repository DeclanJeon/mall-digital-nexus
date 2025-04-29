import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LiveChatSettingsProps {
  onSave: () => void;
}

export const LiveChatSettings = ({ onSave }: LiveChatSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>실시간 상담 설정</CardTitle>
        <CardDescription>
          실시간 상담 운영 시간 및 상담 가능 인원을 설정합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">운영 시간 설정</h3>
            <div className="flex items-center space-x-4">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="시작 시간" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>시작 시간</SelectLabel>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="종료 시간" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>종료 시간</SelectLabel>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={`${i}:00`}>{`${i}:00`}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">상담 가능 인원</h3>
            <Input type="number" placeholder="상담 가능 인원 수를 입력하세요" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={onSave}>저장</Button>
        </div>
      </CardContent>
    </Card>
  );
};
