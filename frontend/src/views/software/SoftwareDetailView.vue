<script setup>
import { onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSoftwareStore } from '@/stores/software';
import { useAuthStore } from '@/stores/auth';
import ImageWithFallback from '@/components/common/ImageWithFallback.vue';

const route = useRoute();
const router = useRouter();
const softwareStore = useSoftwareStore();
const authStore = useAuthStore();

const software = computed(() => softwareStore.currentSoftware);

const isAuthorized = computed(() => {
  if (!software.value) return false;
  
  // If software is public, anyone can access
  if (software.value.isPublic) return true;
  
  // Otherwise only authenticated users can access
  return authStore.isAuthenticated;
});

const getAppRouteName = (title) => {
  if (!title) return '';
  return title.toLowerCase().replace(/\s+/g, '');
};

// Create a mapping between software titles and route names
const routeNameMap = {
  'TaskApp': 'taskapp',
  'Budget Tracker': 'budgettracker',
  'Weather Dashboard': 'weatherdashboard',
  'Content Management System': 'cms',
  'E-commerce Platform': 'ecommerce'
};

const launchInternalApp = () => {
  if (!software.value) return;
  
  try {
    // Use the mapping first, or fall back to the generated name
    const routeName = routeNameMap[software.value.title] || 
                      software.value.title.toLowerCase().replace(/\s+/g, '');
    
    console.log(`Attempting to navigate to route: ${routeName}`);
    
    // Check if route exists before navigating
    if (router.hasRoute(routeName)) {
      router.push({ name: routeName });
    } else {
      console.log(`Route "${routeName}" not found, opening external URL`);
      window.open(software.value.appUrl, '_blank');
    }
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to external URL
    window.open(software.value.appUrl, '_blank');
  }
};

onMounted(async () => {
  // Get the ID from the route params
  const softwareId = route.params.id;
  console.log("Loading software with ID:", softwareId);
  
  try {
    await softwareStore.fetchSoftwareById(softwareId);
  } catch (error) {
    console.error("Error fetching software:", error);
  }
});

const goBack = () => {
  router.push({ name: 'software' });
};
</script>

<template>
  <div class="software-detail-wrapper">
    <div class="software-detail-container">
      <button @click="goBack" class="btn btn-back">← Back to Software</button>
      
      <div v-if="softwareStore.loading" class="loading">
        Loading software details...
      </div>
      
      <div v-else-if="softwareStore.error" class="alert alert-danger">
        {{ softwareStore.error }}
      </div>
      
      <div v-else-if="!software" class="not-found">
        <p>Software not found.</p>
        <router-link to="/software" class="btn">Back to Software</router-link>
      </div>
      
      <div v-else-if="!isAuthorized" class="unauthorized">
        <p>You don't have permission to view this software.</p>
        <router-link to="/software" class="btn">Back to Software</router-link>
      </div>
      
      <div v-else class="software-detail">
        <div class="software-header">
          <div class="software-icon">
            <ImageWithFallback 
              :src="software.iconUrl || '/icons/app-default.svg'" 
              :alt="software.title"
              type="icon" 
              height="100%"
              width="100%"
            />
          </div>
          
          <div class="software-title-section">
            <h1>{{ software.title }}</h1>
            <div class="software-meta">
              <span class="software-version">Version {{ software.version }}</span>
              <span v-if="software.isPublic" class="software-visibility public">Public</span>
              <span v-else class="software-visibility private">Private</span>
            </div>
            
            <div class="software-tags">
              <span v-for="(tag, index) in software.tags" :key="index" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="software-description">
          <h2>Description</h2>
          <p>{{ software.description }}</p>
        </div>
        
        <div class="software-details">
          <div class="software-tech">
            <h2>Technical Details</h2>
            
            <div v-if="software.meta" class="detail-section">
              <div class="detail-item">
                <h3>Languages</h3>
                <div class="detail-tags">
                  <span v-for="(lang, i) in software.meta.languages" :key="i" class="detail-tag">
                    {{ lang }}
                  </span>
                </div>
              </div>
              
              <div class="detail-item">
                <h3>Frameworks</h3>
                <div class="detail-tags">
                  <span v-for="(fw, i) in software.meta.frameworks" :key="i" class="detail-tag">
                    {{ fw }}
                  </span>
                </div>
              </div>
              
              <div class="detail-item">
                <h3>Status</h3>
                <span class="status-badge" :class="software.meta.status">
                  {{ software.meta.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="launch-section">
          <button @click="launchInternalApp" class="btn btn-launch">
            Launch Application
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.software-detail-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.software-detail-container {
  width: 100%;
  max-width: 1160px;
  padding: 2rem 1rem;
}

.btn-back {
  background-color: transparent;
  color: var(--primary-color);
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  display: inline-flex;
  align-items: center;
}

.btn-back:hover {
  background-color: transparent;
  color: #3c6bcf;
}

.software-header {
  display: flex;
  margin-bottom: 2rem;
  align-items: center;
  gap: 2rem;
}

.software-icon {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.software-icon img {
  max-width: 100%;
  max-height: 100%;
}

.software-title-section {
  flex-grow: 1;
}

.software-title-section h1 {
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
}

.software-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.software-version {
  color: var(--text-color-muted);
}

.software-visibility {
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
  font-weight: 500;
}

.software-visibility.public {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
}

.software-visibility.private {
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color);
}

.software-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: rgba(77, 138, 255, 0.1);
  color: var(--primary-color);
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
}

.software-description {
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.software-description h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.software-description p {
  line-height: 1.6;
}

.software-details {
  margin-bottom: 2rem;
}

.software-tech h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.detail-section {
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.detail-item h3 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: var(--text-color-muted);
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-tag {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  color: white; /* Add this line to ensure text is white */
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.completed {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
}

.status-badge.in_progress {
  background-color: rgba(77, 138, 255, 0.1);
  color: var(--primary-color);
}

.status-badge.planning {
  background-color: rgba(159, 113, 255, 0.1);
  color: var(--secondary-color);
}

.launch-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.btn-launch {
  padding: 1rem 3rem;
  font-size: 1.2rem;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
}

.btn-launch:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
}

.loading,
.not-found,
.unauthorized {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

@media (max-width: 768px) {
  .software-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
  }
  
  .software-meta {
    justify-content: center;
  }
  
  .software-tags {
    justify-content: center;
  }
  
  .detail-section {
    grid-template-columns: 1fr;
  }
}
</style>
