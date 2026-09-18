import { create } from 'zustand';
import { authService } from '@/services';
import { DecodedToken } from '@/types';

interface AuthState {
  user: DecodedToken | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: DecodedToken | null) => void;
  checkAuth: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isAdmin: authService.isAdmin(),
  loading: false,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' 
  }),

  checkAuth: () => {
    const user = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    set({ 
      user, 
      isAuthenticated,
      isAdmin: user?.role === 'admin'
    });
  },

  logout: () => {
    authService.signout();
    set({ 
      user: null, 
      isAuthenticated: false,
      isAdmin: false
    });
  },
}));
