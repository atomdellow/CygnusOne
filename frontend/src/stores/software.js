import { defineStore } from 'pinia'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const useSoftwareStore = defineStore('software', {
  state: () => ({
    software: [],
    currentSoftware: null,
    loading: false,
    error: null
  }),

  getters: {
    allSoftware: (state) => state.software,
    
    // Filter software by status
    softwareByStatus: (state) => (status) => {
      if (status === 'all') return state.software;
      return state.software.filter(sw => sw.meta?.status === status);
    }
  },

  actions: {
    async fetchSoftware() {
      this.loading = true;
      this.error = null;

      try {
        console.log("Starting API request to fetch software...");
        const response = await apiClient.get('/software');
        console.log("API response:", response);
        
        this.software = response.data.data;
        
        // If no data returned, use mock data in development
        if (import.meta.env.DEV && (!this.software || this.software.length === 0)) {
          console.log("No software data from API, using mock data in development");
          this.useMockDataForDevelopment();
        }
        
        return this.software;
      } catch (error) {
        console.error('Error fetching software:', error);
        this.error = error.response?.data?.message || 'Failed to fetch software';
        
        // In development, use mock data if API fails
        if (import.meta.env.DEV) {
          console.log("API error, using mock data in development");
          this.useMockDataForDevelopment();
        }
        
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Add a method to populate with mock data
    useMockDataForDevelopment() {
      if (!import.meta.env.DEV) return;
      
      console.log("Setting mock software data");
      this.software = [
        {
          _id: '1',
          title: 'Task App',
          description: 'A simple task management application to help you organize your daily tasks and increase productivity.',
          version: '1.0.0',
          appUrl: '/software/taskapp',
          iconUrl: '/icons/task-app.svg',
          isPublic: true,
          tags: ['Productivity', 'Organization', 'Tasks'],
          meta: {
            languages: ['JavaScript', 'HTML', 'CSS'],
            frameworks: ['Vue.js', 'Vuex'],
            status: 'completed'
          }
        },
        {
          _id: '2',
          title: 'Budget Tracker',
          description: 'Monitor your personal finances with this intuitive budget tracking tool. Set financial goals and track your expenses.',
          version: '2.1.0',
          appUrl: '/software/budgettracker',
          iconUrl: '/icons/budget-tracker.svg',
          isPublic: true,
          tags: ['Finance', 'Budget', 'Personal'],
          meta: {
            languages: ['JavaScript', 'HTML', 'CSS'],
            frameworks: ['Vue.js', 'Chart.js'],
            status: 'in_progress'
          }
        },
        {
          _id: '3',
          title: 'Weather Dashboard',
          description: 'Get real-time weather forecasts for any location. Features include hourly updates, 5-day forecasts, and severe weather alerts.',
          version: '1.5.2',
          appUrl: '/software/weatherdashboard',
          iconUrl: '/icons/weather-dashboard.svg',
          isPublic: true,
          tags: ['Weather', 'Forecast', 'Travel'],
          meta: {
            languages: ['JavaScript', 'HTML', 'CSS'],
            frameworks: ['Vue.js', 'Axios'],
            status: 'completed'
          }
        },
        {
          _id: '4',
          title: 'Content Management System',
          description: 'A flexible CMS for managing website content. Features include WYSIWYG editing, media management, and user permissions.',
          version: '3.0.0',
          appUrl: '/software/cms',
          iconUrl: '/icons/cms.svg',
          isPublic: true,
          tags: ['CMS', 'Content', 'Management'],
          meta: {
            languages: ['JavaScript', 'HTML', 'CSS'],
            frameworks: ['Vue.js', 'Express', 'MongoDB'],
            status: 'completed'
          }
        },
        {
          _id: '5',
          title: 'E-commerce Platform',
          description: 'Complete e-commerce solution with product management, cart functionality, payment processing, and order management.',
          version: '2.3.1',
          appUrl: '/software/ecommerce',
          iconUrl: '/icons/ecommerce.svg',
          isPublic: true,
          tags: ['E-commerce', 'Shopping', 'Online Store'],
          meta: {
            languages: ['JavaScript', 'HTML', 'CSS'],
            frameworks: ['Vue.js', 'Express', 'MongoDB'],
            status: 'completed'
          }
        }
      ];
    },

    async fetchSoftwareById(id) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.get(`/software/${id}`);
        this.currentSoftware = response.data.data;
        return this.currentSoftware;
      } catch (error) {
        console.error('Error fetching software by ID:', error);
        this.error = error.response?.data?.message || 'Failed to fetch software details';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createSoftware(softwareData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.post('/software', softwareData);
        this.software.unshift(response.data.data);
        return response.data.data;
      } catch (error) {
        console.error('Error creating software:', error);
        this.error = error.response?.data?.message || 'Failed to create software';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateSoftware(id, softwareData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await apiClient.put(`/software/${id}`, softwareData);
        
        // Update local state
        const index = this.software.findIndex(sw => sw._id === id);
        if (index !== -1) {
          this.software[index] = response.data.data;
        }
        
        if (this.currentSoftware && this.currentSoftware._id === id) {
          this.currentSoftware = response.data.data;
        }
        
        return response.data.data;
      } catch (error) {
        console.error('Error updating software:', error);
        this.error = error.response?.data?.message || 'Failed to update software';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteSoftware(id) {
      this.loading = true;
      this.error = null;
      
      try {
        await apiClient.delete(`/software/${id}`);
        
        // Remove from local state
        this.software = this.software.filter(sw => sw._id !== id);
        
        if (this.currentSoftware && this.currentSoftware._id === id) {
          this.currentSoftware = null;
        }
        
        return true;
      } catch (error) {
        console.error('Error deleting software:', error);
        this.error = error.response?.data?.message || 'Failed to delete software';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
})
