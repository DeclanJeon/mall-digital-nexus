import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import userService from "@/services/userService";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, Check, Key } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ADMIN_EMAIL = "admin@peermall.com";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "유효한 이메일을 입력해주세요",
        description: "로그인을 위해 올바른 이메일 형식이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // 관리자 이메일인 경우 고정 OTP 사용, 일반 사용자는 랜덤 OTP
      let success, otp;
      
      if (email.trim().toLowerCase() === ADMIN_EMAIL) {
        // 관리자는 고정 OTP 사용하지만 정상 프로세스 진행
        success = true;
        otp = "111111"; // 관리자 전용 고정 OTP
        
        toast({
          title: "관리자 인증코드 발송",
          description: `관리자 계정으로 인증코드를 발송했습니다. (테스트용: 111111)`,
        });
      } else {
        // 일반 사용자는 서버에서 OTP 발송
        const result = await userService.sendNumber(email);
        success = result.success;
        otp = result.otp;
      }

      if (success) {
        setGeneratedOtp(otp || '');
        setIsSent(true);

        if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
          toast({
            title: "인증코드 발송 완료",
            description: `${email}로 인증코드를 발송했습니다. 이메일을 확인해주세요.`,
          });
        }
      } else {
        toast({
          title: "인증코드 발송 실패",
          description: `${email}로 인증코드 발송에 실패했습니다. 다시 시도해주세요.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('이메일 발송 중 오류:', error);
      toast({
        title: "오류 발생",
        description: "인증코드 발송 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpValue.length !== 6) {
      toast({
        title: "인증코드 오류",
        description: "6자리 인증코드를 모두 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('입력된 OTP:', otpValue);
      console.log('생성된 OTP:', generatedOtp);
      console.log('이메일:', email);

      if (otpValue === generatedOtp) {
        let loginRes;
        
        // 관리자 계정은 별도 처리
        if (email.trim().toLowerCase() === ADMIN_EMAIL) {
          // 관리자는 userService 호출 없이 직접 성공 처리
          loginRes = { success: true };
          console.log('관리자 로그인 처리 중...');
        } else {
          // 일반 사용자만 userService.login 호출
          loginRes = await userService.login(email);
        }
        
        if (loginRes.success) {
          // 로컬 스토리지에 로그인 정보 저장
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userEmail', email);
          
          // 일반 사용자만 토큰 저장
          if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
            if (loginRes.accessToken) localStorage.setItem('accessToken', loginRes.accessToken);
            if (loginRes.refreshToken) localStorage.setItem('refreshToken', loginRes.refreshToken);
          }

          toast({
            title: "로그인 성공",
            description: email.trim().toLowerCase() === ADMIN_EMAIL 
              ? "관리자 계정으로 로그인되었습니다." 
              : "인증이 완료되어 로그인되었습니다.",
          });

          // 로그인 성공 및 사용자 정보 저장
          const user = {
            id: crypto.randomUUID(),
            email: email.trim().toLowerCase(),
            name: email.split('@')[0],
            isAdmin: email.trim().toLowerCase() === ADMIN_EMAIL,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString()
          };

          // 로컬 스토리지에 사용자 정보 저장
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userEmail', user.email);
          
          // 사용자 목록 업데이트
          const users = JSON.parse(localStorage.getItem('USERS') || '[]');
          const existingUserIndex = users.findIndex((u: any) => u.email === user.email);
          
          if (existingUserIndex >= 0) {
            users[existingUserIndex] = { ...users[existingUserIndex], lastLoginAt: user.lastLoginAt };
          } else {
            users.push(user);
          }
          
          localStorage.setItem('USERS', JSON.stringify(users));

          // 성공 콜백 또는 네비게이션
          if (loginRes.success) {
            navigate('/');
          } else {
            // 기본 리디렉션
            navigate('/my-info');
          }
        } else {
          toast({
            title: "로그인 실패",
            description: "서버와의 통신에 실패했습니다. 잠시 후 다시 시도해 주세요.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "인증코드 불일치",
          description: "입력한 인증코드가 올바르지 않습니다. 다시 확인해주세요.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
      toast({
        title: "인증 오류",
        description: "인증 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    
    try {
      let success, otp;
      
      if (email.trim().toLowerCase() === ADMIN_EMAIL) {
        // 관리자는 동일한 고정 OTP 재발송
        success = true;
        otp = "111111";
        
        toast({
          title: "관리자 인증코드 재발송",
          description: "관리자 인증코드를 재발송했습니다. (테스트용: 111111)",
        });
      } else {
        // 일반 사용자는 새로운 OTP 발송
        const result = await userService.sendNumber(email);
        success = result.success;
        otp = result.otp;
        
        if (success) {
          toast({
            title: "인증코드 재발송 완료",
            description: `${email}로 새 인증코드를 발송했습니다.`,
          });
        } else {
          toast({
            title: "인증코드 재발송 실패",
            description: `${email}로 새 인증코드 발송에 실패했습니다. 다시 시도해주세요.`,
            variant: "destructive"
          });
        }
      }

      if (success) {
        setGeneratedOtp(otp || '');
      }
    } catch (error) {
      console.error('재발송 중 오류:', error);
      toast({
        title: "재발송 오류",
        description: "인증코드 재발송 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
  };

  const handleBackToEmail = () => {
    setIsSent(false);
    setIsVerifying(false);
    setOtpValue('');
    setEmail('');
    setGeneratedOtp('');
  };

  const startVerification = () => {
    setIsVerifying(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#333333] mb-3">
            <span className="text-[#3F51B5]">Peer</span>
            <span className="text-[#757de8]">mall</span>
          </h1>
          <p className="text-[#5c5c5c] text-lg">
            피어몰에 오신 것을 환영합니다
          </p>
        </div>

        {/* 메인 카드 */}
        <Card className="bg-white border border-[#cccccc] shadow-xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-br from-[#dedeff] to-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-[#333333] mb-2">
              로그인
            </CardTitle>
            <CardDescription className="text-[#5c5c5c] text-base leading-relaxed">
              {!isSent
                ? "이메일을 입력하시면 인증코드를 보내드립니다. 별도의 회원가입이 필요없습니다."
                : !isVerifying
                  ? "이메일을 확인하고 인증을 진행해주세요."
                  : "이메일로 받은 6자리 인증코드를 입력해주세요."
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 px-6 bg-white">
            {!isSent ? (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#333333] mb-2 block">
                    이메일 주소
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#757de8]" />
                    <Input
                      type="email"
                      placeholder="example@peermall.com"
                      className="pl-11 h-12 bg-[#f5f5f5] border-[#cccccc] text-[#333333] placeholder-[#5c5c5c] focus:ring-2 focus:ring-[#3F51B5] focus:border-[#3F51B5] transition-all duration-200"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-[#3F51B5] to-[#757de8] hover:from-[#757de8] hover:to-[#3F51B5] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? "인증코드 발송 중..." : "인증코드 받기"}
                </Button>
              </form>
            ) : !isVerifying ? (
              <div className="text-center py-8">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#dedeff] to-[#f5f5f5] border-2 border-[#3F51B5] rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Mail className="h-10 w-10 text-[#3F51B5]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-[#333333]">
                  이메일을 확인해주세요
                </h3>
                <p className="text-[#5c5c5c] mb-8 leading-relaxed">
                  <span className="text-[#2196F3] font-medium">{email}</span>로 인증코드를 발송했습니다.<br />
                  {email.trim().toLowerCase() === ADMIN_EMAIL ? (
                    <span className="text-[#3F51B5] font-medium">관리자 테스트 코드: 111111</span>
                  ) : (
                    "이메일에서 인증코드를 확인한 후 계속 진행해주세요."
                  )}
                </p>
                <div className="space-y-3">
                  <Button
                    className="w-full h-12 bg-gradient-to-r from-[#3F51B5] to-[#757de8] hover:from-[#757de8] hover:to-[#3F51B5] text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
                    onClick={startVerification}
                  >
                    인증코드 입력하기 
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 border-[#cccccc] text-[#5c5c5c] hover:bg-[#f5f5f5] hover:border-[#3F51B5] transition-all duration-200"
                    onClick={handleResendCode}
                    disabled={isLoading}
                  >
                    인증코드 재발송
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-11 text-[#5c5c5c] hover:bg-[#f5f5f5] hover:text-[#333333] transition-all duration-200"
                    onClick={handleBackToEmail}
                  >
                    다른 이메일로 시도
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#dedeff] to-[#f5f5f5] border-2 border-[#2196F3] rounded-full flex items-center justify-center mb-4 shadow-md">
                    <Key className="h-8 w-8 text-[#2196F3]" />
                  </div>
                  <p className="text-sm text-[#5c5c5c] leading-relaxed">
                    <span className="text-[#2196F3] font-medium">{email}</span>로 발송된<br />
                    6자리 인증코드를 입력해주세요
                  </p>
                  {email.trim().toLowerCase() === ADMIN_EMAIL && (
                    <p className="text-xs text-[#3F51B5] mt-2 font-medium">
                      관리자 테스트 코드: 111111
                    </p>
                  )}
                </div>

                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpValue}
                    onChange={setOtpValue}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot 
                          key={index}
                          index={index} 
                          className="w-12 h-12 bg-[#f5f5f5] border-[#cccccc] text-[#333333] text-lg font-semibold rounded-lg focus:ring-2 focus:ring-[#3F51B5] focus:border-[#3F51B5] transition-all duration-200"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-[#2196F3] to-[#3F51B5] hover:from-[#3F51B5] hover:to-[#2196F3] text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || otpValue.length !== 6}
                  >
                    {isLoading ? "인증 중..." : "인증코드 확인"}
                    {!isLoading && otpValue.length === 6 && (
                      <Check className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 border-[#cccccc] text-[#5c5c5c] hover:bg-[#f5f5f5] hover:border-[#3F51B5] transition-all duration-200"
                      onClick={handleResendCode}
                      disabled={isLoading}
                    >
                      재발송
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-11 text-[#5c5c5c] hover:bg-[#f5f5f5] hover:text-[#333333] transition-all duration-200"
                      onClick={handleBackToEmail}
                      disabled={isLoading}
                    >
                      이메일 변경
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6 border-t border-[#cccccc] bg-[#f5f5f5] rounded-b-lg">
            <div className="text-sm text-[#5c5c5c] text-center w-full leading-relaxed">
              로그인하시면 Peermall의{" "}
              <a href="#" className="text-[#2196F3] hover:text-[#003f8f] hover:underline transition-colors">
                이용약관
              </a>
              과{" "}
              <a href="#" className="text-[#2196F3] hover:text-[#003f8f] hover:underline transition-colors">
                개인정보처리방침
              </a>
              에 동의하게 됩니다.
            </div>
            
            {/* 관리자 힌트 */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-[#dedeff] border border-[#3F51B5] rounded-lg">
                <span className="text-xs text-[#333333]">
                  💡 관리자 테스트: <span className="font-mono font-bold text-[#3F51B5]">admin@peermall.com</span>
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;