export interface Peer {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  isAdmin?: boolean;
  createdAt: string;
  lastLoginAt?: string;
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
    notifications?: boolean;
  };
}

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: Peer | null;
  accessToken?: string;
  refreshToken?: string;
}
