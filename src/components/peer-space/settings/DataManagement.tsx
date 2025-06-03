import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Download, Upload } from 'lucide-react';

interface DataManagementProps {
  onSave: () => void;
}

export const DataManagement = ({ onSave }: DataManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>데이터 관리</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">데이터 내보내기</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <div className="font-medium">전체 데이터 내보내기</div>
                <div className="text-xs text-gray-500">모든 피어몰 데이터를 내보냅니다.</div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                내보내기
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <div className="font-medium">사용자 데이터만 내보내기</div>
                <div className="text-xs text-gray-500">사용자 및 고객 데이터만 내보냅니다.</div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                내보내기
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-3 border rounded-md">
              <div>
                <div className="font-medium">콘텐츠 데이터만 내보내기</div>
                <div className="text-xs text-gray-500">콘텐츠, 제품, 서비스 데이터만 내보냅니다.</div>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                내보내기
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">데이터 가져오기</h3>
          <div className="p-3 border rounded-md">
            <div className="mb-2">
              <div className="font-medium">데이터 파일 업로드</div>
              <div className="text-xs text-gray-500">내보낸 데이터 파일을 가져옵니다.</div>
            </div>
            <div className="flex gap-2">
              <Input type="file" className="text-sm" />
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                가져오기
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">데이터 백업 설정</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span>자동 일일 백업</span>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center text-sm border-b pb-2">
              <span>백업 파일 7일 보관</span>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>주간 백업 이메일 발송</span>
              <Switch />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onSave}>저장</Button>
        </div>
      </CardContent>
    </Card>
  );
};
