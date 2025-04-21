
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import userService from "@/services/userService";
import { Input } from "@/components/ui/input";
import { Mail, Key, Check, X } from "lucide-react";

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess?: () => void }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email'|'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [sentOtp, setSentOtp] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // 이메일 인증번호 요청
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "이메일을 입력해주세요",
        description: "로그인에 사용할 이메일 주소를 입력하세요.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    const { success, otp: serverOtp } = await userService.sendNumber(email);
    setIsLoading(false);

    if (success) {
      toast({
        title: "인증번호 발송 완료",
        description: "입력한 이메일로 인증번호가 발송되었습니다.",
      });
      setSentOtp(serverOtp ?? '');
      setStep('otp');
    } else {
      toast({
        title: "인증번호 발송 실패",
        description: "이메일 주소를 다시 확인하거나, 나중에 다시 시도해 주세요.",
        variant: "destructive",
      });
    }
  };

  // 인증번호 확인/로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast({
        title: "인증번호를 입력하세요",
        description: "이메일로 받은 인증번호를 입력해 주세요.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    // 실제 구현에서는 인증번호 검증을 서버에서 처리, 여기서는 OTP만 비교합니다 (DEMO)
    if (sentOtp && otp !== sentOtp) {
      setIsLoading(false);
      toast({
        title: "인증 실패",
        description: "올바른 인증번호를 입력해 주세요.",
        variant: "destructive",
      });
      return;
    }

    // 서버 로그인 흐름
    const loginRes = await userService.login(email);
    setIsLoading(false);
    if (loginRes.success) {
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      if (loginRes.accessToken) localStorage.setItem('accessToken', loginRes.accessToken);
      if (loginRes.refreshToken) localStorage.setItem('refreshToken', loginRes.refreshToken);
      toast({
        title: "로그인 성공",
        description: "환영합니다! 피어몰에 로그인되었습니다.",
      });
      if (onLoginSuccess) onLoginSuccess();
      else navigate('/peer-space');
    } else {
      toast({
        title: "로그인 실패",
        description: "서버와의 통신에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <form 
      className="space-y-4"
      onSubmit={step === 'email' ? handleSendOtp : handleLogin}
    >
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
        <div className="flex items-center gap-2">
          <Input
            id="email"
            type="email"
            value={email}
            autoComplete="username email"
            onChange={e=>setEmail(e.target.value)}
            className="w-full"
            placeholder="name@example.com"
            disabled={step==="otp" || isLoading}
            required
          />
          <Mail className="w-5 h-5 text-[#71c4ef]" />
        </div>
      </div>
      {step === 'otp' && (
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">인증번호</label>
          <div className="flex items-center gap-2">
            <Input
              id="otp"
              type="text"
              value={otp}
              autoComplete="one-time-code"
              maxLength={6}
              pattern="\d*"
              inputMode="numeric"
              onChange={e=>setOtp(e.target.value)}
              className="w-full"
              placeholder="이메일로 받은 6자리 숫자"
              disabled={isLoading}
              required
            />
            <Key className="w-5 h-5 text-[#71c4ef]" />
          </div>
        </div>
      )}
      <div>
        {step === 'email' ? (
          <Button
            type="submit"
            className="w-full bg-[#71c4ef] hover:bg-[#5bb4e5] py-2 text-white rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "인증번호 전송 중..." : "인증번호 보내기"}
          </Button>
        ) : (
          <Button
            type="submit"
            className="w-full bg-[#71c4ef] hover:bg-[#5bb4e5] py-2 text-white rounded-md"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        )}
      </div>
      {step === 'otp' && (
        <div className="w-full flex justify-between text-xs text-[#71c4ef]">
          <button
            type="button"
            className="hover:underline"
            onClick={()=>setStep('email')}
            disabled={isLoading}
          >
            이메일 재입력
          </button>
          {/* 인증번호 재전송: 이메일 다시 입력부터 시작 */}
        </div>
      )}
      <div className="text-center text-sm mt-4">
        <span className="text-gray-600">계정이 없으신가요? </span>
        <a href="/register" className="text-[#71c4ef] hover:underline">회원가입</a>
      </div>
    </form>
  );
};

export default LoginForm;
