
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Pen, User, Upload, Globe, Shield, AtSign } from 'lucide-react';

interface ProfileSectionProps {
  userProfile: {
    name: string;
    nickname?: string;
    peerNumber: string;
    email: string;
    phone: string;
    profileImage: string;
    bio?: string;
    badges: string[];
    recommenders: number;
    socialAccounts?: {
      type: string;
      username: string;
      connected: boolean;
    }[];
  };
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userProfile, setUserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile });

  const handleEdit = () => {
    setTempProfile({ ...userProfile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserProfile(tempProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile({
      ...tempProfile,
      [name]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfile({
          ...tempProfile,
          profileImage: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">개인 프로필</CardTitle>
          {!isEditing ? (
            <Button variant="ghost" size="sm" onClick={handleEdit}>
              <Pen className="h-4 w-4 mr-2" />
              수정
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave}>저장</Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>취소</Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={isEditing ? tempProfile.profileImage : userProfile.profileImage} />
                <AvatarFallback><User className="h-16 w-16" /></AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute bottom-0 right-0">
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary/90">
                      <Upload className="h-4 w-4" />
                    </div>
                  </Label>
                  <Input 
                    id="profileImage" 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center space-x-1">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">피어넘버:</span>
              </div>
              <Badge variant="outline" className="text-sm font-mono">{userProfile.peerNumber}</Badge>
            </div>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">이름</Label>
                {isEditing ? (
                  <Input 
                    id="name"
                    name="name"
                    value={tempProfile.name}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="mt-1 py-2 px-3 bg-muted rounded-md">{userProfile.name}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="nickname">닉네임</Label>
                {isEditing ? (
                  <Input 
                    id="nickname"
                    name="nickname"
                    value={tempProfile.nickname || ''}
                    onChange={handleInputChange}
                    placeholder="닉네임을 입력하세요"
                  />
                ) : (
                  <div className="mt-1 py-2 px-3 bg-muted rounded-md">{userProfile.nickname || '설정되지 않음'}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">이메일</Label>
                {isEditing ? (
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={tempProfile.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <div className="mt-1 py-2 px-3 bg-muted rounded-md">{userProfile.email}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">전화번호</Label>
                {isEditing ? (
                  <Input 
                    id="phone"
                    name="phone"
                    value={tempProfile.phone}
                    onChange={handleInputChange}
                    placeholder="전화번호를 입력하세요"
                  />
                ) : (
                  <div className="mt-1 py-2 px-3 bg-muted rounded-md">{userProfile.phone || '설정되지 않음'}</div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">자기소개</Label>
              {isEditing ? (
                <Textarea 
                  id="bio"
                  name="bio"
                  value={tempProfile.bio || ''}
                  onChange={handleInputChange}
                  placeholder="자기소개를 입력하세요"
                  rows={3}
                />
              ) : (
                <div className="mt-1 py-2 px-3 bg-muted rounded-md min-h-[5rem]">
                  {userProfile.bio || '자기소개가 설정되지 않았습니다.'}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-2 block">소셜 계정 연결</Label>
              <div className="space-y-2">
                {(userProfile.socialAccounts || []).map((account, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted rounded-md p-2">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      <span>{account.type}</span>
                      <span className="ml-2 text-sm text-muted-foreground">({account.username})</span>
                    </div>
                    <Badge variant={account.connected ? "default" : "outline"}>
                      {account.connected ? "연결됨" : "연결 안됨"}
                    </Badge>
                  </div>
                ))}
                {isEditing && (
                  <Button variant="outline" size="sm" className="w-full">
                    <AtSign className="h-4 w-4 mr-2" />
                    소셜 계정 연결 관리
                  </Button>
                )}
                {(!userProfile.socialAccounts || userProfile.socialAccounts.length === 0) && !isEditing && (
                  <div className="text-sm text-muted-foreground">연결된 소셜 계정이 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
