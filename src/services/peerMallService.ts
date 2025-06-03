// services/peerSpaceService.ts

import {
  add,
  get,
  getAll,
  update,
  remove,
  getByIndex,
} from '../utils/indexedDBService';
import { STORES } from '../utils/indexedDB';
import { v4 as uuidv4 } from 'uuid'; // UUID 생성 라이브러리
import axios from 'axios';
import { Peermall } from '@/types/peermall';
import userService from './userService';

//const API_BASE_URL = 'https://api.peermall.com/v1/peerMalls';
const API_BASE_URL = 'http://localhost:9393/v1/peerMalls';
let accessToken;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 피어몰 타입 정의
export interface PeerMall {
  address: string; // 피어몰 고유 주소
  title: string; // 제목
  description: string; // 설명
  ownerPeerId: string; // 소유자 피어넘버
  owner: string; // 소유자 이름
  coverImage?: string; // 커버 이미지
  logo?: string; // 로고
  category?: string; // 카테고리
  followers: number; // 팔로워 수
  recommendations: number; // 추천 수
  badges: string[]; // 획득한 뱃지
  sections: string[]; // 표시할 섹션
  familyMembership?: string; // 패밀리 멤버십
  location?: {
    // 위치 정보
    lat: number;
    lng: number;
    address: string;
  };
  trustScore?: number; // 신뢰 점수
  recommendationUsers?: string[]; // 추천인 목록
  settings?: {
    // 설정
    hiddenSections: string[];
    sectionOrder: string[];
    theme: string;
    isPublic: boolean;
    // 기타 설정...
  };
  createdAt: string; // 생성 시간
  updatedAt: string; // 최종 수정 시간
}

export const createPeerMall = async (formData: FormData): Promise<any> => {
  try {
    accessToken = userService.getAccessToken();

    const response = await api.post(`/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

// 피어몰 리스트 조회
export const getPeerMallList = async (): Promise<Object> => {
  try {
    const response = await api.get('/peerMallList');
    if (response.status === 200 && response.data.success) {
      return response.data;
    }
    return { success: false };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false };
  }
};

export const getPeerMallData = async (
  peerMallName: string,
  peerMallKey: string
): Promise<Peermall | undefined> => {
  try {
    const response = await api.post('/peerMallData', {
      peerMallName,
      peerMallKey,
    });
    if (response.status === 200 && response.data.success) {
      return response.data['peerMallData'];
    }
    return undefined;
  } catch (error) {
    console.error('Error sending verification code:', error);
    return undefined;
  }
};

export const getAllPeerMallList = async (): Promise<any> => {
  try {
    const response = await api.get('/getAllPeerMallList');
    if (response.status === 200 && response.data.success) {
      return response.data.allPeerMallList;
    }
    return { success: false };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false };
  }
};

export const registerMyFavoriteService = async (data: Object): Promise<any> => {
  try {
    accessToken = userService.getAccessToken();

    const response = await api.post(`/registerMyFavoriteService`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const getMyFavoriteService = async (): Promise<any> => {
  try {
    accessToken = userService.getAccessToken();
    const response = await api.get('/getMyFavoriteService', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 200 && response.data.success) {
      console.log(response);
      return response.data.myFavoriteService;
    }
    return { success: false };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false };
  }
};

export const updatePeerMall = async (formData: FormData): Promise<any> => {
  try {
    accessToken = userService.getAccessToken();

    const response = await api.post(`/updatePeerMall`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
