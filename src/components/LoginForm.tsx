
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password) {
      toast({
        title: "입력 오류",
        description: "이메일과 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // For demo purposes, we'll use localStorage to simulate a login
    setTimeout(() => {
      // Mock successful login
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      toast({
        title: "로그인 성공",
        description: "환영합니다! 피어몰에 로그인되었습니다.",
      });
      
      setIsLoading(false);
      
      // Call the onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        // Navigate to peer space
        navigate('/peer-space');
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#71c4ef]"
          placeholder="name@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <a href="#" className="text-sm text-[#71c4ef] hover:underline">비밀번호 찾기</a>
        </div>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#71c4ef]"
          placeholder="********"
          required
        />
      </div>
      
      <div className="flex items-center">
        <input
          id="remember"
          type="checkbox"
          className="h-4 w-4 border-gray-300 rounded text-[#71c4ef] focus:ring-[#71c4ef]"
        />
        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">로그인 상태 유지</label>
      </div>
      
      <Button 
        type="submit"
        className="w-full bg-[#71c4ef] hover:bg-[#5bb4e5] py-2 text-white rounded-md"
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-gray-600">계정이 없으신가요? </span>
        <a href="#" className="text-[#71c4ef] hover:underline">회원가입</a>
      </div>
      
      <div className="relative mt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" className="h-5 w-5 mr-2" />
          <span className="text-sm">Google</span>
        </button>
        <button
          type="button"
          className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
        >
          <img src="https://cdn-icons-png.flaticon.com/512/5969/5969113.png" alt="Apple" className="h-5 w-5 mr-2" />
          <span className="text-sm">Apple</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
