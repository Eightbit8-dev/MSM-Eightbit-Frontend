import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  username: string | null;
  role: string | null;
  setAuthData: (userName: string, role: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: null,
      role: null,
      setAuthData: (username, role) => set({ username, role }),
      clearAuth: () => set({ username: null, role: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
    },
  ),
);
