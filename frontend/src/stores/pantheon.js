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

export const usePantheonStore = defineStore('pantheon', {
  state: () => ({
    sources: [],
    scrapedContent: [],
    schedules: [],
    activeSource: null,
    loading: false,
    error: null
  }),

  getters: {
    contentFeed: (state) => {
      // Sort by date, most recent first
      return [...state.scrapedContent].sort((a, b) => 
        new Date(b.scrapedAt) - new Date(a.scrapedAt)
      );
    },
    
    contentBySource: (state) => (sourceId) => {
      return state.scrapedContent.filter(item => item.sourceId === sourceId);
    }
  },

  actions: {
    async fetchSources() {
      this.loading = true;
      
      try {
        // For development, use mock data
        this.sources = mockSources;
        return this.sources;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch sources';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async fetchScrapedContent() {
      this.loading = true;
      
      try {
        // For development, use mock data
        this.scrapedContent = mockScrapedContent;
        return this.scrapedContent;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch content';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async fetchSchedules() {
      this.loading = true;
      
      try {
        // For development, use mock data
        this.schedules = mockSchedules;
        return this.schedules;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch schedules';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async addSource(sourceData) {
      this.loading = true;
      
      try {
        // In a real app, you'd post to the API
        // const response = await apiClient.post('/pantheon/sources', sourceData);
        
        // For development, just add to the mock data
        const newSource = {
          id: Date.now(),
          ...sourceData,
          createdAt: new Date().toISOString()
        };
        
        this.sources = [newSource, ...this.sources];
        return newSource;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add source';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateSource(id, sourceData) {
      this.loading = true;
      
      try {
        // In a real app, you'd update via the API
        // const response = await apiClient.put(`/pantheon/sources/${id}`, sourceData);
        
        // For development, update the mock data
        const index = this.sources.findIndex(source => source.id === id);
        if (index !== -1) {
          this.sources[index] = {
            ...this.sources[index],
            ...sourceData,
            updatedAt: new Date().toISOString()
          };
          return this.sources[index];
        }
        return null;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update source';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async addSchedule(scheduleData) {
      this.loading = true;
      
      try {
        // In a real app, you'd post to the API
        // const response = await apiClient.post('/pantheon/schedules', scheduleData);
        
        // For development, just add to the mock data
        const newSchedule = {
          id: Date.now(),
          ...scheduleData,
          createdAt: new Date().toISOString()
        };
        
        this.schedules = [newSchedule, ...this.schedules];
        return newSchedule;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add schedule';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async runScraper(sourceId) {
      this.loading = true;
      
      try {
        // In a real app, you'd trigger the scraper via API
        // const response = await apiClient.post(`/pantheon/sources/${sourceId}/scrape`);
        
        // For demo purposes, just show that it "worked"
        return { success: true, message: 'Scraper executed successfully' };
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to run scraper';
        return { success: false, message: this.error };
      } finally {
        this.loading = false;
      }
    }
  }
})

// Mock data for development
const mockSources = [
  {
    id: 1,
    name: 'Tech News Daily',
    url: 'https://www.technewsdaily.com',
    selectors: {
      article: 'article.post',
      title: 'h1.entry-title',
      content: 'div.entry-content p',
      image: 'div.post-thumbnail img'
    },
    active: true,
    createdAt: '2023-11-10T14:30:00Z',
    updatedAt: '2023-12-01T09:15:00Z'
  },
  {
    id: 2,
    name: 'Local News Network',
    url: 'https://www.localnewsnetwork.com',
    selectors: {
      article: 'div.news-item',
      title: 'h2.news-title',
      content: 'div.news-content p',
      image: 'div.news-image img'
    },
    active: true,
    createdAt: '2023-10-05T11:20:00Z',
    updatedAt: '2023-11-15T16:45:00Z'
  },
  {
    id: 3,
    name: 'Science Updates',
    url: 'https://www.scienceupdates.org',
    selectors: {
      article: 'div.research-article',
      title: 'h3.article-title',
      content: 'div.article-abstract p',
      image: 'div.article-figure img'
    },
    active: false,
    createdAt: '2023-09-12T08:40:00Z',
    updatedAt: '2023-10-20T13:25:00Z'
  }
];

const mockSchedules = [
  {
    id: 1,
    sourceId: 1,
    frequency: 'daily',
    time: '08:00',
    daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    lastRun: '2023-12-05T08:00:00Z',
    nextRun: '2023-12-06T08:00:00Z',
    active: true
  },
  {
    id: 2,
    sourceId: 2,
    frequency: 'weekly',
    time: '10:30',
    daysOfWeek: [1], // Monday
    lastRun: '2023-12-04T10:30:00Z',
    nextRun: '2023-12-11T10:30:00Z',
    active: true
  },
  {
    id: 3,
    sourceId: 3,
    frequency: 'monthly',
    time: '12:00',
    dayOfMonth: 1, // First day of month
    lastRun: '2023-12-01T12:00:00Z',
    nextRun: '2024-01-01T12:00:00Z',
    active: false
  }
];

const mockScrapedContent = [
  {
    id: 1,
    sourceId: 1,
    title: 'New Breakthrough in Quantum Computing',
    content: `Researchers at MIT have demonstrated a new approach to quantum computing that could significantly reduce error rates. The team's findings, published in Nature, show that their method can handle more complex calculations than previous systems. "This is a major step forward for practical quantum computing," said lead researcher Dr. Anna Lee.`,
    imageUrl: 'https://via.placeholder.com/800x450?text=Quantum+Computing',
    url: 'https://www.technewsdaily.com/quantum-breakthrough',
    scrapedAt: '2023-12-05T08:05:12Z'
  },
  {
    id: 2,
    sourceId: 1,
    title: 'Tech Giants Announce New AI Ethics Coalition',
    content: `Five major tech companies have formed a new alliance focused on ethical AI development. The coalition will establish shared guidelines for responsible AI and fund independent research on AI safety and bias mitigation. Critics argue that self-regulation isn't enough, while supporters see it as a positive step toward industry-wide standards.`,
    imageUrl: 'https://via.placeholder.com/800x450?text=AI+Ethics',
    url: 'https://www.technewsdaily.com/ai-ethics-coalition',
    scrapedAt: '2023-12-04T15:32:27Z'
  },
  {
    id: 3,
    sourceId: 2,
    title: 'City Council Approves New Downtown Development Plan',
    content: `The city council voted 7-2 to approve the controversial downtown redevelopment plan. The $450 million project will include mixed-income housing, retail spaces, and a public park. Construction is expected to begin next spring and create approximately 800 jobs. Community advocates expressed concerns about potential displacement of current residents.`,
    imageUrl: 'https://via.placeholder.com/800x450?text=Downtown+Development',
    url: 'https://www.localnewsnetwork.com/downtown-plan-approved',
    scrapedAt: '2023-12-04T11:17:09Z'
  },
  {
    id: 4,
    sourceId: 3,
    title: 'Study Reveals Ocean Temperatures Rising Faster Than Predicted',
    content: `A new study published in Science reveals that ocean temperatures are rising 40% faster than UN estimates from five years ago. The research analyzed data from a network of 4,000 floating robots that monitor ocean temperatures. Scientists warn that higher ocean temperatures could accelerate ice sheet melting and increase the intensity of storms worldwide.`,
    imageUrl: 'https://via.placeholder.com/800x450?text=Ocean+Temperatures',
    url: 'https://www.scienceupdates.org/ocean-temperature-study',
    scrapedAt: '2023-12-01T12:03:55Z'
  },
  {
    id: 5,
    sourceId: 2,
    title: 'Local Schools Receive Technology Grant',
    content: `Five public schools in the district have been awarded a $2 million grant to enhance STEM education. The funds will provide new computer labs, robotics equipment, and teacher training. "This grant will create opportunities for students who might otherwise not have access to advanced technology education," said Superintendent Maria Rodriguez.`,
    imageUrl: 'https://via.placeholder.com/800x450?text=School+Technology',
    url: 'https://www.localnewsnetwork.com/schools-technology-grant',
    scrapedAt: '2023-12-03T09:45:30Z'
  }
];
