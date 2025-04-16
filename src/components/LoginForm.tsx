import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowRight, Check, Loader2, RefreshCw, KeyRound } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import userService from '@/services/userService'; // Corrected import path

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const verifyEmail = (userEmail: string) => {
  const emailRegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	if (userEmail.match(emailRegExp) == null) {
		return false;
	}
	return true;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [resendLoading, setResendLoading] = useState(false); // Added resend loading state

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes('@') || !verifyEmail(email)) {
      toast({
        title: "유효한 이메일을 입력해주세요",
        description: "로그인을 위해 올바른 이메일 형식이 필요합니다.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    const { success, otp } = await userService.sendNumber(email);

    if(success && otp) { // Check if OTP exists
      setGeneratedOtp(otp);
      setIsSent(true);
      setIsVerifying(false); // Reset verification state
      setOtpValue(''); // Clear previous OTP input
      toast({
        title: "인증코드 발송 완료",
        description: `${email}로 인증코드를 발송했습니다. 이메일을 확인해주세요.`,
        variant: "default",
        style: { backgroundColor: '#d4eaf7', color: '#1d1c1c' }, // Primary-100, Text-100
      });
    } else {
      toast({
        title: "인증코드 발송 실패",
        description: `인증코드 발송에 실패했습니다. 다시 시도해주세요.`,
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
    
    // OTP 비교 전 공백 제거 및 문자열로 통일
    const cleanedInput = otpValue.trim();
    const cleanedGenerated = String(generatedOtp).trim();
    
    if (cleanedInput === cleanedGenerated) {
      const { success, accessToken, refreshToken } = await userService.login(email);

      if (success && accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        toast({
          title: "로그인 성공",
          description: "인증이 완료되어 로그인되었습니다.",
          variant: "default",
          style: { backgroundColor: '#71c4ef', color: '#1d1c1c' }, // Accent-100, Text-100
        });

        if (onLoginSuccess) {
          onLoginSuccess(); // Call the success callback
        }
      } else {
         toast({
          title: "로그인 처리 실패",
          description: "로그인 처리 중 문제가 발생했습니다.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "인증코드 불일치",
        description: "입력한 인증코드가 올바르지 않습니다. 다시 확인해주세요.",
        variant: "destructive"
      });
      setOtpValue(''); // Clear incorrect OTP
    }
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    const { success, otp } = await userService.sendNumber(email);

    if(success && otp) {
      setGeneratedOtp(otp);
      setOtpValue(''); // Clear OTP input on resend
      toast({
        title: "인증코드 재발송 완료",
        description: `${email}로 새 인증코드를 발송했습니다.`,
        variant: "default",
        style: { backgroundColor: '#d4eaf7', color: '#1d1c1c' }, // Primary-100, Text-100
      });
    } else {
      toast({
        title: "인증코드 재발송 실패",
        description: `새 인증코드 발송에 실패했습니다. 다시 시도해주세요.`,
        variant: "destructive"
      });
    }
    setResendLoading(false);
  };

  const handleBackToEmail = () => {
    setIsSent(false);
    setIsVerifying(false);
    setOtpValue('');
    setEmail(''); // Clear email as well
    // Consider resetting email form state if using react-hook-form here
  };

  const startVerification = () => {
    setIsVerifying(true);
  };

  return (
    // Apply dark theme and design system styles
    <div className="w-full"> {/* Removed Card component, styling applied directly or via parent */}
      {!isSent ? (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#f5f4f1]/90 mb-1">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#71c4ef]" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10 w-full bg-[#fffefb]/20 border-[#d4eaf7]/30 py-3 focus:border-[#71c4ef] focus:ring-1 focus:ring-[#71c4ef] rounded-md" // Adjusted padding
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                autoComplete="email"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-[#71c4ef] hover:bg-[#00668c] text-[#1d1c1c] font-semibold py-3 rounded-md transition-colors duration-300" // Adjusted padding and font weight
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span className="font-semibold">인증코드 요청 중...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-5 w-5 mr-2" />
                <span className="font-semibold">인증코드 받기</span>
                <ArrowRight className="h-5 w-5 ml-auto" />
              </>
            )}
          </Button>
        </form>
      ) : !isVerifying ? (
        <div className="text-center py-4">
          <div className="mx-auto w-16 h-16 bg-[#71c4ef]/20 border border-[#71c4ef]/50 rounded-full flex items-center justify-center mb-5">
            <Mail className="h-8 w-8 text-[#71c4ef]" />
          </div>
          <h3 className="text-lg font-medium mb-2 text-[#fffefb]">이메일을 확인해주세요</h3>
          <p className="text-[#333]/80 mb-6">
            <span className="font-semibold text-[#71c4ef]">{email}</span>(으)로 인증코드를 발송했습니다.
          </p>
          <div className="space-y-3">
            <Button
              className="w-full bg-[#71c4ef] hover:bg-[#00668c] text-[#1d1c1c] font-semibold py-3 rounded-md transition-colors duration-300" // Adjusted padding and font weight
              onClick={startVerification}
            >
              인증코드 입력하기 <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#d4eaf7] text-[#333] hover:bg-[#d4eaf7]/10 hover:text-[#66dffd] transition-colors duration-300 py-3 rounded-md" // Adjusted padding
                onClick={handleResendCode}
                disabled={resendLoading}
              >
                 {resendLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      재발송 중...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      인증코드 재발송
                    </>
                  )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#d4eaf7] text-[#333] hover:bg-[#d4eaf7]/10 hover:text-[#66dffd] transition-colors duration-300 py-3 rounded-md" // Adjusted padding
                onClick={handleBackToEmail}
              >
                이메일 다시 입력
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label htmlFor="otp-code" className="block text-sm font-medium text-center text-[#f5f4f1]/90 mb-2">인증코드</label>
            <div className="flex justify-center">
              <InputOTP
                id="otp-code"
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                disabled={isLoading}
                autoComplete="one-time-code"
                containerClassName="justify-center"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="bg-[#fffefb]/20 border-[#333] focus:border-[#71c4ef] focus:ring-1 focus:ring-[#71c4ef] w-12 h-14 rounded-md text-lg" />
                  <InputOTPSlot index={1} className="bg-[#fffefb]/20 border-[#333] focus:border-[#71c4ef] focus:ring-1 focus:ring-[#71c4ef] w-12 h-14 rounded-md text-lg" />
                  <InputOTPSlot index={2} className="bg-[#fffefb]/20 border-[#333] focus:border-[#71c4ef] focus:ring-1 focus:ring-[#71c4ef] w-12 h-14 rounded-md text-lg" />
                  <InputOTPSlot index={3} className="bg-[#fffefb]/20 border-[#333] focus:border-[#71c4ef] focus:ring-1 focus:ring-[#71c4ef] w-12 h-14 rounded-md text-lg" />
                  <InputOTPSlot index={4} className="bg-[#fffefb]/20 border-[#333] focus:border-[#71c4ef] focus:ring-1 focus:ring-[#71c4ef] w-12 h-14 rounded-md text-lg" />
                  <InputOTPSlot index={5} className="bg-[#fffefb]/20 border-[#333] focus:border-[#71c4ef] focus:ring-1 focus:ring-[#71c4ef] w-12 h-14 rounded-md text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={handleResendCode}
              className="text-sm text-[#71c4ef] hover:text-[#b6ccd8] flex items-center justify-center mx-auto transition-colors duration-200"
              disabled={resendLoading}
            >
              {resendLoading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  재발송 중...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3 mr-2" />
                  인증코드 재발송하기
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBackToEmail}
              disabled={isLoading || resendLoading}
              className="w-full sm:w-auto border-[#d4eaf7] text-[#333] hover:bg-[#d4eaf7]/10 hover:text-[#00668c] transition-colors duration-300 py-3 rounded-md" // Adjusted padding
            >
              이메일 변경
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-[#71c4ef] hover:bg-[#00668c] text-[#1d1c1c] font-semibold transition-colors duration-300 py-3 rounded-md" // Adjusted padding and font weight
              disabled={isLoading || otpValue.length !== 6}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  인증 중...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check className="h-4 w-4 mr-2" />
                  인증 완료
                </div>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
