import { useState, useEffect, useCallback } from 'react';
import userService from '@/services/userService'; // userService 경로가 올바르다고 가정
import { useToast } from '@/hooks/use-toast'; // useToast 훅 경로

// 사용자 정보 타입 정의 (필요에 따라 확장)
interface User {
  email: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
}

// useAuth 훅 반환 타입 정의
interface AuthHook {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithOtp: (
    email: string,
    otp: string,
    generatedOtp: string
  ) => Promise<boolean>;
  logout: () => void;
  sendOtp: (email: string) => Promise<{ success: boolean; otp?: string }>;
}

const ADMIN_EMAIL = 'admin@peermall.com';

export const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 초기 로딩 상태 true
  const { toast } = useToast();

  // 컴포넌트 마운트 시 localStorage에서 인증 상태 확인
  useEffect(() => {
    try {
      // const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
      // const email = localStorage.getItem('userEmail');
      // const accessToken = localStorage.getItem('accessToken');
      // const refreshToken = localStorage.getItem('refreshToken');
      // if (loggedIn && email) {
      //   setUser({ email, accessToken, refreshToken });
      //   setIsAuthenticated(true);
      // }
    } catch (error) {
      console.error('Error reading auth status from localStorage', error);
      // localStorage 접근 불가 시 기본값으로 처리
    }
    setIsLoading(false);
  }, []);

  const sendOtp = useCallback(
    async (email: string): Promise<{ success: boolean; otp?: string }> => {
      setIsLoading(true);
      try {
        if (!email.trim() || !email.includes('@')) {
          toast({
            title: '유효한 이메일을 입력해주세요',
            description: '로그인을 위해 올바른 이메일 형식이 필요합니다.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return { success: false };
        }

        let success, otp;
        if (email.trim().toLowerCase() === ADMIN_EMAIL) {
          success = true;
          otp = '111111'; // 관리자 전용 고정 OTP
          toast({
            title: '관리자 인증코드 발송',
            description: `관리자 계정으로 인증코드를 발송했습니다. (테스트용: ${otp})`,
          });
        } else {
          const result = await userService.sendNumber(email);
          success = result.success;
          otp = result.otp;
          if (success) {
            toast({
              title: '인증코드 발송 완료',
              description: `${email}로 인증코드를 발송했습니다. 이메일을 확인해주세요.`,
            });
          } else {
            toast({
              title: '인증코드 발송 실패',
              description: `${email}로 인증코드 발송에 실패했습니다. 다시 시도해주세요.`,
              variant: 'destructive',
            });
          }
        }
        setIsLoading(false);
        return { success, otp };
      } catch (error) {
        console.error('OTP 발송 중 오류:', error);
        toast({
          title: '오류 발생',
          description: '인증코드 발송 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return { success: false };
      }
    },
    [toast]
  );

  const loginWithOtp = useCallback(
    async (
      email: string,
      otpValue: string,
      generatedOtp: string
    ): Promise<boolean> => {
      if (otpValue !== generatedOtp) {
        toast({
          title: '인증코드 불일치',
          description: '입력한 인증코드가 올바르지 않습니다.',
          variant: 'destructive',
        });
        return false;
      }

      setIsLoading(true);
      try {
        let loginRes;
        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedEmail === ADMIN_EMAIL) {
          loginRes = { success: true }; // 관리자는 API 호출 없이 성공
        } else {
          loginRes = await userService.login(email); // 일반 사용자 로그인
        }

        if (loginRes.success) {
          localStorage.setItem('userLoggedIn', 'true');
          localStorage.setItem('userEmail', email);

          const userData: User = { email };

          if (
            normalizedEmail !== ADMIN_EMAIL &&
            loginRes.accessToken &&
            loginRes.refreshToken
          ) {
            localStorage.setItem('accessToken', loginRes.accessToken);
            localStorage.setItem('refreshToken', loginRes.refreshToken);
            userData.accessToken = loginRes.accessToken;
            userData.refreshToken = loginRes.refreshToken;
          }

          setUser(userData);
          setIsAuthenticated(true);
          toast({
            title: '로그인 성공',
            description:
              normalizedEmail === ADMIN_EMAIL
                ? '관리자 계정으로 로그인되었습니다.'
                : '인증이 완료되어 로그인되었습니다.',
          });
          setIsLoading(false);
          return true;
        } else {
          toast({
            title: '로그인 실패',
            description:
              '서버와의 통신에 실패했거나 인증 정보가 올바르지 않습니다.',
            variant: 'destructive',
          });
          setIsLoading(false);
          return false;
        }
      } catch (error) {
        console.error('로그인 처리 중 오류:', error);
        toast({
          title: '인증 오류',
          description: '인증 처리 중 오류가 발생했습니다.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return false;
      }
    },
    [toast]
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: '로그아웃 성공',
        description: '성공적으로 로그아웃되었습니다.',
      });
    } catch (error) {
      console.error('Error during logout or accessing localStorage', error);
      toast({
        title: '로그아웃 오류',
        description: '로그아웃 중 문제가 발생했습니다.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  return { user, isAuthenticated, isLoading, loginWithOtp, logout, sendOtp };
};
