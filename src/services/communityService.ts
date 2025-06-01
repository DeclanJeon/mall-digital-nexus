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
import userService from './userService';

//const API_BASE_URL = 'https://api.peermall.com/v1/communities';
const API_BASE_URL = 'http://localhost:9393/v1/communities';
const accessToken = userService.getAccessToken();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


export const registerCommunityBoard = async (formData: any ): Promise<any> => {
  try {
    const response = await api.post(`/register`, formData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
}

export const getCommunityList = async (peerMallName: string, peerMallKey: string): Promise<any> => {
  try {
    const response = await api.get('/getCommunityList', {
      params: { peerMallName, peerMallKey }
    });
    if (response.status === 200 && response.data.success) {
      return response.data.allPeerMallList;
    }
    return { success: false };
  } catch (error) {
    console.error('Error sending verification code:', error);
    return { success: false };
  }
};

export const getCommentList = async (postId): Promise<any> => {
  try {
    const response = await api.get('/getCommentList', {
      params: { postId }
    });
    if (response.status === 200 && response.data.success) {
      return response.data.commentList;
    }
    return { success: false };
  } catch (error) {
    console.error('Error getting comment lists:', error);
    return { success: false };
  }
};

export const getCommunityChannel = async (): Promise<any> => {
  try {
    const response = await api.get('/getCommunityChannel');
    if (response.status === 200 && response.data.success) {
      return response.data.channelList;
    }
    return { success: false };
  } catch (error) {
    console.error('Error getting community channel:', error);
    return { success: false };
  }
};

export const registerComment = async (data: any ): Promise<any> => {
  try {
    const response = await api.post(`/registerComment`, data, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
    });

    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};
