import { storage } from '@/utils/storage/storage';
import { Peer, AuthState } from '@/types/peer';

export const peerStorage = {
  // 현재 로그인 상태 확인
  isLoggedIn(): boolean {
    return localStorage.getItem('userLoggedIn') === 'true';
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser(): Peer | null {
    if (!this.isLoggedIn()) return null;
    
    const email = localStorage.getItem('userEmail');
    if (!email) return null;

    // 저장된 사용자 정보 조회 또는 기본 정보 생성
    const users = storage.get<Peer[]>('USERS') || [];
    let user = users.find(u => u.email === email);
    
    if (!user) {
      // 새 사용자 생성
      user = {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0], // 이메일 앞부분을 기본 이름으로
        isAdmin: email === 'admin@peermall.com',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      users.push(user);
      storage.set('USERS', users);
    } else {
      // 마지막 로그인 시간 업데이트
      user.lastLoginAt = new Date().toISOString();
      const userIndex = users.findIndex(u => u.id === user!.id);
      users[userIndex] = user;
      storage.set('USERS', users);
    }

    return user;
  },

  // 로그아웃
  logout(): void {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // 사용자 정보 업데이트
  updateUser(updates: Partial<Peer>): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    const users = storage.get<Peer[]>('USERS') || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return false;

    users[userIndex] = { ...currentUser, ...updates };
    storage.set('USERS', users);
    
    return true;
  }
};
