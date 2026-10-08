// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser, LoginCredentials } from '../types';
import toast from 'react-hot-toast';
import { authService,  } from '../service/authService';
import { extractErrorMessage } from '../utils/errorHandler';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<string | null>;  
}
let refreshInFlight: Promise<string | null> | null = null;


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const user = await authService.login(credentials);
          set({ user, isAuthenticated: true, isLoading: false });
          toast.success(`Bienvenido, ${user.firstName} 👋`);
        } catch (err: unknown) {
          // Mensaje en español según error.code (INVALID CREDENTIALS, red caída...)
          set({ error: extractErrorMessage(err), isLoading: false });
        }
      },

      logout: async () => {
        const refreshToken = get().user?.refreshToken;

        if (refreshToken) {
          await authService.logout(refreshToken);
          toast.success('Sesión cerrada correctamente.');
        }

        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),

      refreshSession: async () => {
        const refreshToken = get().user?.refreshToken;

        if (!refreshToken) {
          return null;
        }

        refreshInFlight = authService
          .refresh(refreshToken)
          .then((user) => {
            set({ user, isAuthenticated: true });
            return user.accessToken;
          })
          .catch(() => {
            set({ user: null, isAuthenticated: false });
            toast.error('Tu sesión ha expirado. Inicia sesión de nuevo.');
            return null;
          })
          .finally(() => {
            refreshInFlight = null;
          });

        return refreshInFlight;
      },
    }),
    {
      name: 'auth-storage',
      // Solo persistir user e isAuthenticated (no isLoading ni error)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);