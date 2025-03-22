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

export const useAutobotsStore = defineStore('autobots', {
  state: () => ({
    autobots: [],
    currentAutobot: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchAutobots() {
      // For development, use mock data
      this.loading = true;
      this.error = null;

      try {
        // In a real app, uncomment this to fetch from API
        // const response = await apiClient.get('/autobots');
        // this.autobots = response.data.data;
        
        // For now, use mock data
        this.autobots = mockAutobots;
        return this.autobots;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch autobots';
        return [];
      } finally {
        this.loading = false;
      }
    },

    async fetchAutobotById(id) {
      this.loading = true;
      this.error = null;

      try {
        // In a real app, uncomment this to fetch from API
        // const response = await apiClient.get(`/autobots/${id}`);
        // this.currentAutobot = response.data.data;
        
        // For now, use mock data
        this.currentAutobot = mockAutobots.find(autobot => autobot.id.toString() === id);
        return this.currentAutobot;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch autobot';
        return null;
      } finally {
        this.loading = false;
      }
    }
  }
})

// Mock data for development
const mockAutobots = [
  {
    id: 1,
    title: 'Git Scheduler',
    description: 'Automate your git repositories with scheduled tasks like commits, pulls, and deployments based on configurable triggers.',
    iconUrl: '/icons/git-scheduler.svg',
    category: 'DevOps',
    tags: ['Git', 'Automation', 'CI/CD'],
    features: [
      'Schedule regular git operations',
      'Integration with GitHub, GitLab, and Bitbucket',
      'Configurable webhooks and notifications',
      'Failure recovery mechanisms'
    ],
    status: 'active',
    lastUpdated: '2023-12-15'
  },
  {
    id: 2,
    title: 'Node Graph Builder',
    description: 'Visual node-based programming interface for creating complex workflows and data pipelines without writing code.',
    iconUrl: '/icons/node-graph.svg',
    category: 'Development',
    tags: ['Visual Programming', 'Workflow', 'Data Processing'],
    features: [
      'Drag-and-drop node interface',
      'Real-time flow visualization',
      'Extensive node library',
      'Custom node creation'
    ],
    status: 'active',
    lastUpdated: '2023-11-30'
  },
  {
    id: 3,
    title: 'Site Builder CMS',
    description: 'Graphical website builder similar to Wix with templates, drag-and-drop components, and easy publishing tools.',
    iconUrl: '/icons/site-builder.svg',
    category: 'Web Development',
    tags: ['CMS', 'Website Builder', 'Templates'],
    features: [
      'Drag-and-drop page builder',
      'Responsive design tools',
      'Template library',
      'SEO optimization helpers'
    ],
    status: 'active',
    lastUpdated: '2023-12-10'
  },
  {
    id: 4,
    title: 'Template Engine',
    description: 'Generate code, documentation, and project structures from customizable templates with powerful variable substitution.',
    iconUrl: '/icons/template-engine.svg',
    category: 'Development',
    tags: ['Templates', 'Code Generation', 'Boilerplate'],
    features: [
      'Template library management',
      'Variable system for customization',
      'Multiple output formats',
      'Template sharing and importing'
    ],
    status: 'active',
    lastUpdated: '2023-12-05'
  },
  {
    id: 5,
    title: 'API Connector',
    description: 'Connect and orchestrate API calls between different services with visual flow control and data mapping.',
    iconUrl: '/icons/api-connector.svg',
    category: 'Integration',
    tags: ['API', 'Integration', 'Data Mapping'],
    features: [
      'Visual API flow builder',
      'Authentication management',
      'Data transformation tools',
      'Rate limiting and caching'
    ],
    status: 'beta',
    lastUpdated: '2023-11-20'
  },
  {
    id: 6,
    title: 'App Deployer',
    description: 'Deploy applications to various environments with configuration management, rollback capabilities, and health monitoring.',
    iconUrl: '/icons/app-deployer.svg',
    category: 'DevOps',
    tags: ['Deployment', 'Infrastructure', 'Containers'],
    features: [
      'Multi-environment deployment',
      'Configuration versioning',
      'Deployment history and rollbacks',
      'Health checks and monitoring'
    ],
    status: 'beta',
    lastUpdated: '2023-12-08'
  }
];
