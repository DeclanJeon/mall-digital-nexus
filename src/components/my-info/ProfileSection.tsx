
import React, { useState, useEffect } from 'react';
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
    // socialAccounts 관련 필드 제거
  };
  // setUserProfile의 타입을 userProfile과 동일하게 명시적으로 변경
  setUserProfile: React.Dispatch<React.SetStateAction<ProfileSectionProps['userProfile']>>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userProfile, setUserProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...userProfile });
  // 이메일 변경 관련 상태
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState('');
  const [otpError, setOtpError] = useState('');


  const LOCAL_STORAGE_KEY = 'userProfileData';

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 로드
  // TODO: 백엔드 API와 연동하여 초기 데이터를 받아오고, 로컬 스토리지는 캐시 또는 오프라인 지원용으로 활용 고려
  useEffect(() => {
    const storedProfile = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        // setUserProfile을 직접 호출하기보다는, 부모 컴포넌트에서 초기값을 설정하도록 유도하는 것이 좋을 수 있습니다.
        // 여기서는 ProfileSection이 userProfile 상태를 직접 관리한다고 가정하고 진행합니다.
        // 만약 부모로부터 userProfile을 받고 있다면, 이 로직은 부모 컴포넌트에 있어야 합니다.
        // 또는, 초기 userProfile prop이 로컬 스토리지 값보다 우선순위가 높도록 처리할 수 있습니다.
        // 여기서는 일단 로컬 스토리지가 있으면 덮어쓰도록 합니다.
        setUserProfile(parsedProfile);
        setTempProfile(parsedProfile); // tempProfile도 동기화
      } catch (error) {
        console.error("Error parsing user profile from local storage:", error);
        // 오류 발생 시 기본 userProfile prop 사용
      }
    }
  }, [setUserProfile]); // setUserProfile은 일반적으로 변경되지 않지만, 의존성 배열에 명시

  // userProfile 상태 변경 시 로컬 스토리지에 저장
  // TODO: 실제 애플리케이션에서는 이 데이터를 백엔드 API를 통해 서버에 저장해야 합니다.
  useEffect(() => {
    // userProfile이 초기값(예: 빈 객체 또는 기본값)이 아닐 때만 저장하도록 조건 추가 가능
    if (userProfile && Object.keys(userProfile).length > 0 && userProfile.name) { // 간단한 유효성 검사
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userProfile));
    }
  }, [userProfile]);


  const handleEdit = () => {
    setTempProfile({ ...userProfile });
    setIsEditing(true);
  };

  const handleSave = () => {
    // 이메일 변경 로직이 진행 중이지 않을 때만 일반 프로필 저장
    if (!isChangingEmail) {
      // TODO: 백엔드 API에 tempProfile 업데이트 요청
      setUserProfile(tempProfile);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tempProfile)); // 로컬 스토리지에도 저장
      setIsEditing(false);
    } else {
      // 이메일 변경이 완료되면 여기서 처리하거나, 별도 함수에서 처리
      // 여기서는 일단 이메일 변경 중에는 일반 저장이 안 되도록 함
      // 혹은 이메일 변경 완료 후 isEditing = false, isChangingEmail = false 처리 필요
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingEmail(false); // 이메일 변경 시도도 취소
    setNewEmail('');
    setOtp('');
    setIsOtpSent(false);
    setEmailChangeError('');
    setOtpError('');
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

  // 이메일 변경 관련 함수들을 컴포넌트 내부로 이동
  const handleInitiateEmailChange = () => {
    setIsChangingEmail(true);
    setNewEmail(tempProfile.email); // 현재 이메일을 기본값으로 설정
    setEmailChangeError('');
    setOtpError('');
    setIsOtpSent(false);
    setOtp('');
  };

  const handleCancelEmailChange = () => {
    setIsChangingEmail(false);
    setNewEmail('');
    setOtp('');
    setIsOtpSent(false);
    setEmailChangeError('');
    setOtpError('');
    // isEditing 상태는 유지하거나 필요에 따라 false로 변경
  };

  const handleSendOtp = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setEmailChangeError('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    // TODO: 백엔드 API 호출하여 newEmail로 OTP 발송 요청.
    // 성공 시, 서버에서 OTP를 발송하고 클라이언트는 isOtpSent를 true로 설정합니다.
    console.log(`OTP 발송 요청: ${newEmail}`);
    // try {
    //   // await api.sendOtp(newEmail); // API 호출 예시
    //   setIsOtpSent(true);
    //   setEmailChangeError('');
    //   // toast({ title: "인증번호 발송됨", description: `${newEmail}로 인증번호가 발송되었습니다.` });
    //   alert(`${newEmail}로 인증번호가 발송되었습니다. (실제 발송 X)`);
    // } catch (error) {
    //   // setEmailChangeError('인증번호 발송에 실패했습니다. 다시 시도해주세요.');
    //   // console.error("OTP send error:", error);
    //   alert(`인증번호 발송 실패 (실제 발송 X)`);
    // }
    // 임시 로직
    setIsOtpSent(true);
    alert(`${newEmail}(으)로 인증번호가 발송되었습니다. (실제 발송은 구현되지 않음)`);
  };

  const handleVerifyOtpAndSaveEmail = async () => {
    if (!otp) {
      setOtpError('인증번호를 입력해주세요.');
      return;
    }
    // TODO: 백엔드 API 호출하여 newEmail과 otp 검증.
    // 성공 시, 서버에서 이메일을 변경하고, 클라이언트는 userProfile 상태 및 로컬 스토리지를 업데이트합니다.
    console.log(`OTP 검증 및 이메일 변경 요청: ${newEmail}, OTP: ${otp}`);
    // try {
    //   // const updatedProfile = await api.verifyOtpAndChangeEmail(newEmail, otp); // API 호출 예시
    //   // setUserProfile(updatedProfile); // 서버로부터 받은 최신 프로필로 업데이트
    //   // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfile));
    //   // setIsEditing(false);
    //   // setIsChangingEmail(false);
    //   // ... (상태 초기화)
    //   // toast({ title: "이메일 변경 완료" });
    //   alert(`이메일이 ${newEmail}(으)로 변경되었습니다. (실제 변경 X)`);
    // } catch (error) {
    //   // setOtpError('인증번호가 올바르지 않거나 오류가 발생했습니다.');
    //   // alert(`OTP 검증 또는 이메일 변경 실패 (실제 처리 X)`);
    // }

    // 임시 로직 (실제로는 API 응답에 따라 처리)
    const updatedProfileData = { ...userProfile, email: newEmail };
    setUserProfile(updatedProfileData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProfileData)); // 로컬 스토리지 업데이트
    setIsEditing(false);
    setIsChangingEmail(false);
    setIsOtpSent(false);
    setOtp('');
    setNewEmail('');
    alert(`이메일이 '${newEmail}'(으)로 변경되었습니다. (실제 변경 및 OTP 검증은 구현되지 않음)`);
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
                    accept="image/*,image/gif" // GIF 추가
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
                {!isEditing ? (
                  <div className="flex items-center justify-between">
                    <div className="mt-1 py-2 px-3 bg-muted rounded-md flex-grow">{userProfile.email}</div>
                    {/* 수정 모드가 아닐 때만 '변경' 버튼 표시 */}
                    {!isEditing && (
                        <Button variant="link" size="sm" onClick={() => { setIsEditing(true); handleInitiateEmailChange(); }} className="ml-2">
                            <AtSign className="h-4 w-4 mr-1" />
                            변경
                        </Button>
                    )}
                  </div>
                ) : !isChangingEmail ? (
                  // 일반 수정 모드 (이메일 필드 비활성화, 변경은 아래 버튼으로 유도)
                  <>
                    <Input
                      id="emailDisplay"
                      type="email"
                      value={tempProfile.email} // 현재 프로필 (수정 중이 아닐 때) 또는 임시 프로필 (수정 중일 때) 이메일
                      disabled
                      className="bg-muted"
                    />
                     <Button variant="link" size="sm" onClick={handleInitiateEmailChange} className="mt-1">
                      이메일 주소 변경하기
                    </Button>
                  </>
                ) : (
                  // 이메일 변경 모드 (isEditing && isChangingEmail)
                  <div className="space-y-2 mt-1 border p-3 rounded-md bg-background">
                    <p className="text-sm text-muted-foreground">새로운 이메일 주소를 입력하고 인증을 진행해주세요.</p>
                    <div>
                      <Label htmlFor="newEmail">새 이메일</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newEmail}
                        onChange={(e) => { setNewEmail(e.target.value); setEmailChangeError(''); }}
                        placeholder="새로운 이메일 주소"
                        disabled={isOtpSent}
                      />
                    </div>
                    {!isOtpSent ? (
                      <Button onClick={handleSendOtp} className="w-full" size="sm" disabled={!newEmail.includes('@')}>
                        인증번호 발송
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="otp">인증번호 (OTP)</Label>
                        <Input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => { setOtp(e.target.value); setOtpError(''); }}
                          placeholder="이메일로 받은 인증번호"
                        />
                        <Button onClick={handleVerifyOtpAndSaveEmail} className="w-full" size="sm" disabled={!otp}>
                          인증번호 확인 및 변경
                        </Button>
                      </div>
                    )}
                    {emailChangeError && <p className="text-xs text-destructive">{emailChangeError}</p>}
                    {otpError && <p className="text-xs text-destructive">{otpError}</p>}
                    <Button variant="ghost" size="sm" onClick={handleCancelEmailChange} className="w-full text-muted-foreground">
                      이메일 변경 취소
                    </Button>
                  </div>
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
            {/* 소셜 계정 연결 섹션 전체 삭제 */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
