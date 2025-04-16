import axios from 'axios';

// API 기본 URL
const API_BASE_URL = 'http://localhost:9393/v1';

// API 호출을 위한 axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 인증번호 발송 함수
const sendNumber = async (
  email: string
): Promise<{ success: boolean; otp?: string }> => {
  try {
    const response = await api.post('/users/authentication-number', { email });
    if (response.status === 200 && response.data.success) {
      // OTP 값이 문자열인지 확인
      const otp = String(response.data.otp || '');
      return { success: true, otp };
    }
    return { success: false };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false };
  }
};

// 로그인 함수 (인증코드 검증 후 토큰 요청)
const login = async (
  email: string
): Promise<{
  success: boolean;
  accessToken?: string;
  refreshToken?: string;
}> => {
  try {
    const response = await api.post('/users/login', { email });
    if (response.status === 200 && response.data.success) {
      const { accessToken, refreshToken } = response.data;
      return { success: true, accessToken, refreshToken };
    }
    return { success: false };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false };
  }
};

const userService = {
  sendNumber,
  login,
};

export default userService;
