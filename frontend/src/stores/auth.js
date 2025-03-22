import { defineStore } from 'pinia'
import { authService } from '@/services/api'
import router from '@/router'
import { useArticleStore } from './articles'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    connectionError: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => {
      console.log("User role check:", state.user?.role); // Add debugging
      return state.user && state.user.role === 'admin';
    },
    isEditor: (state) => state.user && ['admin', 'editor'].includes(state.user.role),
    userRole: (state) => state.user ? state.user.role : 'guest'
  },

  actions: {
    async register(userData) {
      this.loading = true;
      this.error = null;
      this.connectionError = false;
      
      try {
        const response = await authService.register(userData);
        this.token = response.data.token;
        this.user = response.data.user;
        
        localStorage.setItem('token', this.token);
        router.push({ name: 'articles' });
        return true;
      } catch (error) {
        if (!error.response) {
          this.connectionError = true;
          this.error = "Unable to connect to the server. Please check your connection or try again later.";
        } else {
          this.error = error.response?.data?.message || 'Registration failed';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async login(credentials) {
      this.loading = true;
      this.error = null;
      this.connectionError = false;
      
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, credentials);
        
        const { token, user } = response.data;
        
        // Store token and user
        this.token = token;
        this.user = user;
        
        console.log("Logged in user:", user); // Add debugging
        
        // Store in local storage
        localStorage.setItem('token', token);
        
        router.push({ name: 'articles' });
        return true;
      } catch (error) {
        if (!error.response) {
          this.connectionError = true;
          this.error = "Unable to connect to the server. Please check your connection or try again later.";
        } else {
          this.error = error.response?.data?.message || 'Login failed';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return;
      
      this.loading = true;
      
      try {
        const response = await authService.getCurrentUser();
        this.user = response.data.user;
        return true;
      } catch (error) {
        this.logout();
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      
      // Reset article store to clear cached data
      const articleStore = useArticleStore();
      articleStore.resetState();
      
      router.push({ name: 'login' });
    }
  }
})
