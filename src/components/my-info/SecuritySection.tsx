
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ShieldCheck, 
  History, 
  Globe, 
  Users, 
  Key, 
  Eye, 
  EyeOff,
  DeviceTablet 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AuthMethod {
  type: string;
  value: string;
  verified: boolean;
  primary: boolean;
}

interface LoginRecord {
  device: string;
  location: string;
  ip: string;
  time: string;
  current: boolean;
}

interface SecuritySectionProps {
  authMethods: AuthMethod[];
  loginRecords: LoginRecord[];
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    activityVisibility: 'public' | 'friends' | 'private';
    searchable: boolean;
  };
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ 
  authMethods, 
  loginRecords,
  privacySettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
          계정 보안
        </CardTitle>
        <CardDescription>보안 설정 및 접근 관리</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">인증 방식 관리</h3>
          <div className="space-y-2">
            {authMethods.map((method, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div>
                  <p className="font-medium">{method.type}</p>
                  <p className="text-sm text-muted-foreground">{method.value}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {method.primary && (
                    <Badge>기본</Badge>
                  )}
                  <Badge variant={method.verified ? "default" : "outline"}>
                    {method.verified ? "인증됨" : "미인증"}
                  </Badge>
                  <Button variant="ghost" size="sm">관리</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">인증 방식 추가</Button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">최근 로그인 기록</h3>
            <Button variant="link" size="sm" className="text-primary">전체 보기</Button>
          </div>
          <div className="space-y-2">
            {loginRecords.slice(0, 3).map((record, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <DeviceTablet className="h-4 w-4 mr-2" />
                  <div>
                    <p className="font-medium">{record.device}</p>
                    <p className="text-sm text-muted-foreground">{record.location} • {record.ip}</p>
                    <p className="text-xs text-muted-foreground">{record.time}</p>
                  </div>
                </div>
                {record.current && (
                  <Badge>현재 세션</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">공개 범위 설정</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <Label htmlFor="profileVisibility">프로필 공개 범위</Label>
              </div>
              <select 
                id="profileVisibility" 
                className="px-2 py-1 rounded-md border"
                defaultValue={privacySettings.profileVisibility}
              >
                <option value="public">전체 공개</option>
                <option value="friends">친구만</option>
                <option value="private">비공개</option>
              </select>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <Label htmlFor="activityVisibility">활동 공개 범위</Label>
              </div>
              <select 
                id="activityVisibility" 
                className="px-2 py-1 rounded-md border"
                defaultValue={privacySettings.activityVisibility}
              >
                <option value="public">전체 공개</option>
                <option value="friends">친구만</option>
                <option value="private">비공개</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <Label htmlFor="searchable">검색 허용</Label>
              </div>
              <Switch id="searchable" defaultChecked={privacySettings.searchable} />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" className="flex-1 mr-2">
            <Users className="h-4 w-4 mr-2" />
            추천인 관리
          </Button>
          <Button variant="outline" className="flex-1 ml-2">
            <Key className="h-4 w-4 mr-2" />
            비밀번호 복구 설정
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySection;
