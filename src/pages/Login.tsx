import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/user-interaction/LoginForm";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
    // 페이지 이동 후 Index 페이지를 강제로 리로드합니다.
    // 이는 Index 페이지의 useEffect 등을 다시 실행시켜 최신 데이터를 로드하도록 하기 위함입니다.
    // 더 나은 상태 관리 라이브러리(Redux, Zustand 등)나 Context API를 사용하면
    // 전역 상태를 통해 컴포넌트 간 데이터 동기화를 더 효율적으로 처리할 수 있습니다.
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#fffefb]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-[#d4eaf7]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#1d1c1c] mb-2">
                <span className="text-[#71c4ef]">Peer</span>mall 로그인
              </h1>
              <p className="text-[#313d44]">
                피어몰에 오신 것을 환영합니다
              </p>
            </div>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
