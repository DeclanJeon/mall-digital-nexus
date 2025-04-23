import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IntegrationSettingsProps {
  onSave: () => void;
}

export const IntegrationSettings = ({ onSave }: IntegrationSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>외부 서비스 연동</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">소셜 미디어 계정 연결</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <div className="bg-blue-500 text-white p-1 rounded mr-2 w-8 h-8 flex items-center justify-center">F</div>
                <div>
                  <div className="font-medium">페이스북</div>
                  <div className="text-xs text-gray-500">연결되지 않음</div>
                </div>
              </div>
              <Button variant="outline" size="sm">연결</Button>
            </div>
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <div className="bg-sky-500 text-white p-1 rounded mr-2 w-8 h-8 flex items-center justify-center">X</div>
                <div>
                  <div className="font-medium">X (Twitter)</div>
                  <div className="text-xs text-gray-500">연결되지 않음</div>
                </div>
              </div>
              <Button variant="outline" size="sm">연결</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-1 rounded mr-2 w-8 h-8 flex items-center justify-center">I</div>
                <div>
                  <div className="font-medium">인스타그램</div>
                  <div className="text-xs text-gray-500">연결됨</div>
                </div>
              </div>
              <Button variant="outline" size="sm">연결 해제</Button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">결제 시스템 연동</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 flex items-center justify-center">K</div>
                <div>
                  <div className="font-medium">카카오페이</div>
                  <div className="text-xs text-gray-500">연결됨</div>
                </div>
              </div>
              <Button variant="outline" size="sm">설정</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 flex items-center justify-center">P</div>
                <div>
                  <div className="font-medium">PayPal</div>
                  <div className="text-xs text-gray-500">연결되지 않음</div>
                </div>
              </div>
              <Button variant="outline" size="sm">연결</Button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-3">분석 및 광고 도구</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 flex items-center justify-center">G</div>
                <div>
                  <div className="font-medium">Google Analytics</div>
                  <div className="text-xs text-gray-500">연결되지 않음</div>
                </div>
              </div>
              <Button variant="outline" size="sm">연결</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 flex items-center justify-center">Ad</div>
                <div>
                  <div className="font-medium">광고 플랫폼</div>
                  <div className="text-xs text-gray-500">연결되지 않음</div>
                </div>
              </div>
              <Button variant="outline" size="sm">연결</Button>
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
