<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAutobotsStore } from '@/stores/autobots';

const route = useRoute();
const router = useRouter();
const autobotsStore = useAutobotsStore();

const loading = ref(true);
const autobot = computed(() => autobotsStore.currentAutobot);

onMounted(async () => {
  const autobotId = route.params.id;
  await autobotsStore.fetchAutobotById(autobotId);
  loading.value = false;
});

// Format the last updated date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return 'Active';
    case 'beta': return 'Beta';
    case 'development': return 'In Development';
    default: return status;
  }
};

const goBack = () => {
  router.push({ name: 'autobots' });
};

const launchTool = () => {
  // This would normally launch the tool/redirect to the specific tool URL
  // For now, we'll just show an alert
  alert(`Launching ${autobot.value.title}...`);
};
</script>

<template>
  <div class="autobot-detail-wrapper">
    <div class="autobot-detail-container">
      <button @click="goBack" class="btn btn-back">← Back to Autobots</button>
      
      <div v-if="loading || autobotsStore.loading" class="loading">
        Loading tool details...
      </div>
      
      <div v-else-if="autobotsStore.error" class="alert alert-danger">
        {{ autobotsStore.error }}
      </div>
      
      <div v-else-if="!autobot" class="not-found">
        <p>Tool not found.</p>
        <router-link to="/autobots" class="btn">Back to Autobots</router-link>
      </div>
      
      <div v-else class="autobot-detail">
        <div class="autobot-header">
          <div class="autobot-icon">
            <img :src="autobot.iconUrl || '/icons/autobot-default.svg'" :alt="autobot.title" />
          </div>
          
          <div class="autobot-title-section">
            <div class="title-row">
              <h1>{{ autobot.title }}</h1>
              <span class="status-badge" :class="autobot.status">
                {{ getStatusLabel(autobot.status) }}
              </span>
            </div>
            
            <div class="autobot-category">{{ autobot.category }}</div>
            <p class="autobot-description">{{ autobot.description }}</p>
            
            <div class="autobot-tags">
              <span v-for="(tag, index) in autobot.tags" :key="index" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="autobot-content">
          <div class="features-section">
            <h2>Features</h2>
            <ul class="feature-list">
              <li v-for="(feature, index) in autobot.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>
          
          <div class="meta-section">
            <div class="meta-item">
              <span class="meta-label">Last Updated:</span>
              <span class="meta-value">{{ formatDate(autobot.lastUpdated) }}</span>
            </div>
            
            <div class="meta-item">
              <span class="meta-label">Status:</span>
              <span class="meta-value status-text" :class="autobot.status">
                {{ getStatusLabel(autobot.status) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="action-section">
          <button @click="launchTool" class="btn btn-launch">Launch {{ autobot.title }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autobot-detail-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.autobot-detail-container {
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

.autobot-detail {
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  padding: 2rem;
  box-shadow: var(--shadow);
}

.autobot-header {
  display: flex;
  margin-bottom: 2rem;
  gap: 2rem;
}

.autobot-icon {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius);
  padding: 1rem;
  flex-shrink: 0;
}

.autobot-icon img {
  max-width: 100%;
  max-height: 100%;
}

.autobot-title-section {
  flex-grow: 1;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.title-row h1 {
  margin: 0;
  font-size: 2.2rem;
}

.status-badge {
  padding: 0.4rem 1rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  font-size: 0.9rem;
}

.status-badge.active {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
}

.status-badge.beta {
  background-color: rgba(77, 138, 255, 0.1);
  color: var(--primary-color);
}

.status-badge.development {
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color);
}

.autobot-category {
  margin-bottom: 1rem;
  padding: 0.2rem 0.6rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius);
  display: inline-block;
  font-size: 0.9rem;
  color: var(--text-color-muted);
}

.autobot-description {
  line-height: 1.6;
  margin-bottom: 1.5rem;
  color: white;
}

.autobot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
  padding: 0.3rem 0.6rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
}

.autobot-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.features-section h2, .meta-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.feature-list {
  list-style-type: disc;
  padding-left: 1.5rem;
  color: white;
}

.feature-list li {
  margin-bottom: 0.8rem;
  line-height: 1.5;
}

.meta-section {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.meta-item {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.meta-label {
  font-size: 0.9rem;
  color: var(--text-color-muted);
}

.meta-value {
  font-weight: 500;
  color: white;
}

.status-text.active {
  color: var(--highlight-color);
}

.status-text.beta {
  color: var(--primary-color);
}

.status-text.development {
  color: var(--accent-color);
}

.action-section {
  text-align: center;
  margin-top: 2rem;
}

.btn-launch {
  background: linear-gradient(45deg, var(--highlight-color), var(--primary-color));
  padding: 0.8rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 500;
}

.btn-launch:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.loading, .not-found {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

@media (max-width: 768px) {
  .autobot-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .autobot-icon {
    margin: 0 auto;
  }
  
  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .title-row h1 {
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
  }
  
  .autobot-content {
    grid-template-columns: 1fr;
  }
}
</style>
