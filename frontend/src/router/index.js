import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ArticlesView from '../views/ArticlesView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import ArticleCreateView from '../views/ArticleCreateView.vue'
import ArticleEditView from '../views/ArticleEditView.vue'
import SoftwareListView from '../views/software/SoftwareListView.vue'
import SoftwareDetailView from '../views/software/SoftwareDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'

// Software application views - import all app views
import TaskAppView from '../views/software/taskapp/TaskAppView.vue'
import BudgetTrackerView from '../views/software/budgettracker/BudgetTrackerView.vue'
import WeatherDashboardView from '../views/software/weatherdashboard/WeatherDashboardView.vue'
import CMSView from '../views/software/cms/CMSView.vue'
import EcommerceView from '../views/software/ecommerce/EcommerceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    // Articles routes
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/articles/create',
      name: 'article-create',
      component: ArticleCreateView,
      meta: { requiresAuth: true }
    },
    {
      path: '/articles/:id/edit',
      name: 'article-edit',
      component: ArticleEditView,
      meta: { requiresAuth: true }
    },
    {
      path: '/articles/:id',
      name: 'article-detail',
      component: ArticleDetailView,
      meta: { requiresAuth: true }
    },
    // Software routes
    {
      path: '/software',
      name: 'software',
      component: SoftwareListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/software/:id',
      name: 'software-detail',
      component: SoftwareDetailView,
      meta: { requiresAuth: true }
    },
    {
      path: '/software/create',
      name: 'software-create',
      component: () => import('../views/software/SoftwareCreateView.vue'),
      meta: { requiresAuth: true, editorOnly: true }
    },
    
    // Dedicated software application routes
    // These route names must match the lowercase, no-space versions of the app titles
    {
      path: '/apps/taskapp',
      name: 'taskapp',
      component: TaskAppView,
      meta: { requiresAuth: true }
    },
    {
      path: '/apps/budgettracker',
      name: 'budgettracker',
      component: BudgetTrackerView,
      meta: { requiresAuth: true }
    },
    {
      path: '/apps/weatherdashboard',
      name: 'weatherdashboard',
      component: WeatherDashboardView,
      meta: { requiresAuth: true, requiresEditor: true }
    },
    {
      path: '/apps/cms',
      name: 'cms',
      component: CMSView,
      meta: { requiresAuth: true }
    },
    {
      path: '/apps/ecommerce',
      name: 'ecommerce',
      component: EcommerceView,
      meta: { requiresAuth: true }
    },
    
    // Autobots routes
    {
      path: '/autobots',
      name: 'autobots',
      component: () => import('../views/autobots/AutobotsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/autobots/:id',
      name: 'autobot-detail',
      component: () => import('../views/autobots/AutobotDetailView.vue'),
      meta: { requiresAuth: true }
    },

    // Pantheon routes
    {
      path: '/pantheon',
      name: 'pantheon',
      component: () => import('../views/pantheon/PantheonDashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pantheon/configure',
      name: 'pantheon-configure',
      component: () => import('../views/pantheon/PantheonConfigureView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/pantheon/schedule',
      name: 'pantheon-schedule',
      component: () => import('../views/pantheon/PantheonScheduleView.vue'),
      meta: { requiresAuth: true }
    },

    // Admin routes
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/users',
      meta: { requiresAuth: true }, // Removed adminOnly requirement
      children: [
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/UserManagementView.vue'),
          meta: { requiresAuth: true } // Removed adminOnly requirement
        },
        // Add more admin routes as needed
      ]
    },
    
    // Catch-all route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
