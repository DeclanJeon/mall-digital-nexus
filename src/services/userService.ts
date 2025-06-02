import axios from 'axios';

// API 기본 URL
//const API_BASE_URL = 'https://api.peermall.com/v1/users';
const API_BASE_URL = 'http://localhost:9393/v1/users';

// API 호출을 위한 axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});
let accessToken;

// 인증번호 발송 함수
const sendNumber = async (
  email: string
): Promise<{ success: boolean; otp?: string }> => {
  try {
    const response = await api.post('/authenticationNumber', { email });
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

const requestCall = async (
  ownerEmail: string,
  url: string
): Promise<{ success: boolean }> => {
  try {
    accessToken = getAccessToken();

    const response = await api.post('/requestCall', { ownerEmail, url }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
    if (response.status === 200 && response.data.success) {
      return { success: true };
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
    const response = await api.post('/login', { email });
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

const getUserInfo = async (): Promise<any> => {
  try {
    accessToken = getAccessToken();

    const response = await api.get(`/userInfo`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error.response.data;
  }
};

const updateUserInfo = async (userInfo: Object): Promise<any> => {
  try {
    const response = await api.post(`/updateUserInfo`, { userInfo } );
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error.response.data;
  }
};

const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
}
const userService = {
  sendNumber,
  login,
  getUserInfo,
  updateUserInfo,
  getAccessToken,
  requestCall
};

export default userService;
