import { create } from "zustand"
interface AuthStore {
    isSignedIn: boolean;
    user: string | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
    isSignedIn: false,
    user: null,
    setUser: (user: string | null) => set({ user, isSignedIn: !!user }),
}))

export const useLoadingStore = create<{ isLoading: boolean; setLoading: (loading: boolean) => void }>(
    (set) => ({
        isLoading: false,
        setLoading: (loading: boolean) => set({ isLoading: loading }),
    })
)

