import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Store, Mail, UserCircle as UserProfileIcon, FileText, MapPin, Users, Briefcase, Megaphone } from 'lucide-react'; // Use specific icon names

const MyInfoPage = () => {
  // Placeholder data and functions - replace with actual logic later
  const userPeermalls = [
    { id: 'mall1', name: '나의 첫 피어몰', address: 'peermall.com/myfirstmall' },
    { id: 'mall2', name: '핸드메이드 상점', address: 'peermall.com/handmade' },
  ];
  const userEmail = 'user@example.com';
  const userProfileImageUrl = 'https://api.dicebear.com/7.x/personas/svg?seed=currentUser'; // Example avatar
  const userPosts = [
    { id: 'post1', title: '첫 게시글입니다!', createdAt: '2025-04-15' },
    { id: 'post2', title: '피어몰 활용 팁', createdAt: '2025-04-10' },
  ];
  const referrals = [{ id: 'ref1', name: '추천인 A' }];
  const sponsors = [{ id: 'spn1', name: '스폰서 X' }];
  const agents = [{ id: 'agt1', name: '에이전트 Y' }];

  const handleEmailChange = () => alert('이메일 변경 기능 구현 예정');
  const handleProfileImageChange = () => alert('프로필 이미지 변경 기능 구현 예정');
  const handleManagePost = (postId: string) => alert(`${postId} 게시글 관리 기능 구현 예정`);
  const handleRegisterMap = () => alert('지도 등록 기능 구현 예정');
  const handleManageReferrals = () => alert('추천인 관리 기능 구현 예정');
  const handleManageSponsorsAgents = () => alert('스폰서/에이전트 관리 기능 구현 예정');
  const handleAdRequest = () => alert('광고 신청 기능 구현 예정');
  const handleManagePeermall = (mallId: string) => alert(`${mallId} 피어몰 관리 기능 구현 예정`);


  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-text-100">내 정보 관리</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userProfileImageUrl} alt="User Profile" />
                <AvatarFallback><UserProfileIcon className="h-8 w-8" /></AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl text-text-100">프로필 관리</CardTitle>
                <CardDescription className="text-text-200">프로필 이미지와 이메일을 변경하세요.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-1">
                 <Label htmlFor="email" className="text-text-200">이메일 주소</Label>
                 <div className="flex items-center gap-2">
                   <Input id="email" type="email" value={userEmail} readOnly className="flex-1 bg-muted border-border text-muted-foreground" />
                   <Button variant="outline" size="sm" onClick={handleEmailChange}>변경</Button>
                 </div>
               </div>
               <Button variant="outline" className="w-full" onClick={handleProfileImageChange}>프로필 이미지 변경/삭제</Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Management Sections */}
        <div className="md:col-span-2 space-y-8">
          {/* 피어몰 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text-100"><Store className="h-5 w-5" /> 내 피어몰 관리</CardTitle>
              <CardDescription className="text-text-200">생성한 피어몰 목록을 확인하고 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {userPeermalls.length > 0 ? userPeermalls.map(mall => (
                <div key={mall.id} className="flex justify-between items-center p-2 rounded hover:bg-muted">
                  <span className="text-sm font-medium text-foreground">{mall.name} ({mall.address})</span>
                  <Button variant="ghost" size="sm" onClick={() => handleManagePeermall(mall.id)}>관리</Button>
                </div>
              )) : <p className="text-sm text-muted-foreground">생성한 피어몰이 없습니다.</p>}
               <Button variant="secondary" className="w-full mt-4" onClick={handleRegisterMap}>
                 <MapPin className="mr-2 h-4 w-4" /> 내 피어몰 지도에 등록하기
               </Button>
            </CardContent>
          </Card>

          {/* 게시글 관리 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text-100"><FileText className="h-5 w-5" /> 작성한 게시글 관리</CardTitle>
              <CardDescription className="text-text-200">작성한 커뮤니티 게시글을 확인하고 관리합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {userPosts.length > 0 ? userPosts.map(post => (
                 <div key={post.id} className="flex justify-between items-center p-2 rounded hover:bg-muted">
                   <span className="text-sm text-foreground">{post.title} ({post.createdAt})</span>
                   <Button variant="ghost" size="sm" onClick={() => handleManagePost(post.id)}>관리</Button>
                 </div>
              )) : <p className="text-sm text-muted-foreground">작성한 게시글이 없습니다.</p>}
            </CardContent>
          </Card>

          {/* 추천인/스폰서/에이전트 관리 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-100"><Users className="h-5 w-5" /> 추천인 관리</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">나를 추천한 사용자 목록입니다.</p>
                {/* 추천인 목록 표시 로직 추가 */}
                <Button variant="secondary" className="w-full mt-2" onClick={handleManageReferrals}>관리하기</Button>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-text-100"><Briefcase className="h-5 w-5" /> 스폰서/에이전트 관리</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-sm text-muted-foreground mb-2">나의 스폰서 및 에이전트 목록입니다.</p>
                 {/* 스폰서/에이전트 목록 표시 로직 추가 */}
                 <Button variant="secondary" className="w-full mt-2" onClick={handleManageSponsorsAgents}>관리하기</Button>
              </CardContent>
            </Card>
          </div>

          {/* 광고 신청 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text-100"><Megaphone className="h-5 w-5" /> 피어몰 광고 신청</CardTitle>
              <CardDescription className="text-text-200">내 피어몰 또는 다른 페이지에 광고를 게재하도록 신청합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">광고를 게재하고 싶은 페이지와 내용을 선택하여 신청해주세요. (세부 구현 필요)</p>
              <Button className="w-full bg-accent-100 hover:bg-accent-100/90 text-accent-foreground" onClick={handleAdRequest}>광고 신청하기</Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default MyInfoPage;
