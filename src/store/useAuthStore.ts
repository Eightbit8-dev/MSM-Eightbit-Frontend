import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userName: string | null;
  role: string | null;
  setAuthData: (userName: string, role: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userName: null,
      role: null,
      setAuthData: (userName, role) => set({ userName, role }),
      clearAuth: () => set({ userName: null, role: null }),
    }),
    {
      name: "auth-storage", // key in localStorage
    },
  ),
);
