import axios from 'axios';
import userService from './userService';
import { Content } from '@/components/peer-space/content/types';


//const API_BASE_URL = 'https://api.peermall.com/v1/products';
const API_BASE_URL = 'http://localhost:9393/v1/products';
const accessToken = userService.getAccessToken();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

interface PurchaseResponse {
  success: boolean;
  orderId?: string;
  message?: string;
}

export const productService = {
  async registerProduct(productData: any, peerMallName: string, peerMallKey: string ): Promise<any> {
    try {
      const response = await api.post(`/register`, { productData, peerMallName, peerMallKey }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  },

  async getAllProductList(): Promise<any> {
    try {
      const response = await api.get('/allProductList');
      if (response.status === 200 && response.data.success) {
        return response.data.allProductList;
      }
      return { success: false };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false };
    }
  },

  async getProductInfo(peerMallName: string, peerMallKey: string, productKey: string): Promise<any> {
    try {
      const response = await api.get('/productInfo', {
        params: { peerMallName, peerMallKey, productKey }
      });
      if (response.status === 200 && response.data.success) {
        return response.data;
      }
      return { success: false };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false };
    }
  },

  async getProductList(peerMallName: string, peerMallKey: string): Promise<any> {
    try {
      const response = await api.get('/productList', {
        params: { peerMallName, peerMallKey }
      });
      if (response.status === 200 && response.data.success) {
        return response.data;
      }
      return { success: false };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false };
    }
  },

  // Add product to wishlist
  async addToWishlist(productId: string | number): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/wishlist`, { productId });
      return response.data.success;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  },

  // Remove product from wishlist
  async removeFromWishlist(productId: string | number): Promise<boolean> {
    try {
      const response = await axios.delete(`${API_BASE_URL}/wishlist/${productId}`);
      return response.data.success;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  },

  // Check if product is in wishlist
  async isInWishlist(productId: string | number): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/wishlist/check/${productId}`);
      return response.data.isInWishlist;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  },

  // Purchase product
  async purchaseProduct(productId: string | number, quantity: number = 1): Promise<PurchaseResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/purchase`, {
        productId,
        quantity,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error purchasing product:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to complete purchase',
      };
    }
  },

  // Send message to seller
  async sendMessageToSeller(productId: string | number, message: string): Promise<boolean> {
    try {
      const response = await axios.post(`${API_BASE_URL}/messages`, {
        productId,
        message,
      });
      return response.data.success;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  },

  // Get available currencies
  async getAvailableCurrencies(): Promise<string[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/currencies`);
      return response.data.currencies || ['KRW', 'USD', 'JPY', 'EUR'];
    } catch (error) {
      console.error('Error fetching currencies:', error);
      return ['KRW', 'USD', 'JPY', 'EUR'];
    }
  },

  // Convert currency
  async convertCurrency(amount: number, from: string, to: string): Promise<number> {
    try {
      const response = await axios.get(`${API_BASE_URL}/convert`, {
        params: { amount, from, to },
      });
      return response.data.convertedAmount || amount;
    } catch (error) {
      console.error('Error converting currency:', error);
      return amount;
    }
  },
};

export default productService;
