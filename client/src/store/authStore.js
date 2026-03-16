import { create } from "zustand";
import API from '../api/axios.js';

const useAuthStore = create((set) => ({

    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    error: null,

    // Set user directly (used by FollowButton, etc.)
    setUser: (user) => set({ user }),

    // ACTIONS
    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const response = await API.post('/auth/register', userData);

            set({
                user: response.data.user,
                isAuthenticated: true,
                loading: false,
            });

            return { success: true };

        } catch (error) {
            set({
                error: error.response?.data?.message || 'Registration failed',
                loading: false,
            });
            throw error;
        }
    },

    // LOGIN ACTION
    login: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await API.post('/auth/login', credentials);

            set({
                user: response.data.user,
                isAuthenticated: true,
                loading: false,
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Login failed',
                loading: false,
            });
            throw error;
        }
    },

    logout: async () => {
        try {
            await API.post('/auth/logout');
        } catch (e) {
            // ignore logout errors
        }
        set({
            user: null,
            isAuthenticated: false,
        });
    },

    // CHECK IF USER IS AUTHENTICATED (on app load)
    checkAuth: async () => {

        try {
            const response = await API.get('/auth/me');
            set({
                user: response.data,
                isAuthenticated: true,
                isCheckingAuth: false
            });
        } catch (error) {
            console.log("user is not authenticated")
            set({
                user: null,
                isAuthenticated: false,
                isCheckingAuth: false
            });
        }
    },

}))

export default useAuthStore;
