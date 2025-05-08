import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import LoginForm from "@/components/user-interaction/LoginForm";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/');
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
