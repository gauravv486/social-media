import { create } from "zustand";
import axios from 'axios';

const useAuthStore = create((set) => ({

    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: false,
    error: null,

    // ACTIONS
    register: async (userData) => {
        set({ loading: true, error: null });
        try {

            const response = await axios.post('https://localhost:5000/api/auth/register', userData);
            const token = response.data.token;
            localStorage.setItem('token', token);

            set({
                user: response.data,
                token: token,
                isAuthenticated: true,
                loading: false,
            });

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
            const response = await axios.post('http://localhost:5000/api/auth/login', credentials);

            const token = response.data.token;

            localStorage.setItem('token', token);

            set({
                user: response.user,
                token: token,
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

    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

    // CHECK IF USER IS AUTHENTICATED (on app load)
    checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            set({ isAuthenticated: false });
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({
                user: response.data,
                isAuthenticated: true,
            });
        } catch (error) {
            localStorage.removeItem('token');
            set({
                user: null,
                token: null,
                isAuthenticated: false,
            });
        }
    },

}))

export default useAuthStore;