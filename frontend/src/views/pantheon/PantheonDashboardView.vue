<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePantheonStore } from '@/stores/pantheon';
import ImageWithFallback from '@/components/common/ImageWithFallback.vue';

const router = useRouter();
const pantheonStore = usePantheonStore();

const loading = ref(true);
const activeFilter = ref('all');
const searchQuery = ref('');
const selectedArticle = ref(null);
const filterOptions = ref([
  { id: 'all', name: 'All Sources' }
]);

// Computed properties
const filteredContent = computed(() => {
  let content = pantheonStore.contentFeed;
  
  // Filter by source if not "all"
  if (activeFilter.value !== 'all') {
    content = content.filter(item => item.sourceId === parseInt(activeFilter.value));
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    content = content.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.content.toLowerCase().includes(query)
    );
  }
  
  return content;
});

// Methods
const setFilter = (filterId) => {
  activeFilter.value = filterId;
};

const viewArticle = (article) => {
  selectedArticle.value = article;
};

const closeArticle = () => {
  selectedArticle.value = null;
};

const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const goToConfigure = () => {
  router.push({ name: 'pantheon-configure' });
};

const goToSchedule = () => {
  router.push({ name: 'pantheon-schedule' });
};

const truncateContent = (content, length = 200) => {
  if (content.length <= length) return content;
  return content.substring(0, length) + '...';
};

// Load data
onMounted(async () => {
  // Fetch sources
  await pantheonStore.fetchSources();
  
  // Add sources to filter options
  pantheonStore.sources.forEach(source => {
    filterOptions.value.push({
      id: source.id.toString(),
      name: source.name
    });
  });
  
  // Fetch content
  await pantheonStore.fetchScrapedContent();
  
  loading.value = false;
});
</script>

<template>
  <div class="pantheon-wrapper">
    <div class="pantheon-container">
      <div class="pantheon-header">
        <h1>Pantheon News</h1>
        <p class="pantheon-description">Your personalized news feed from around the web</p>
      </div>

      <div class="pantheon-nav">
        <div class="pantheon-actions">
          <button @click="goToConfigure" class="btn btn-secondary">Configure Sources</button>
          <button @click="goToSchedule" class="btn btn-secondary">Manage Schedules</button>
        </div>
      </div>

      <div class="pantheon-dashboard">
        <div class="dashboard-controls">
          <div class="search-bar">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search articles..."
              class="search-input"
            />
          </div>
          
          <div class="filter-controls">
            <span class="filter-label">Filter by source:</span>
            <div class="filter-options">
              <button
                v-for="option in filterOptions"
                :key="option.id"
                @click="setFilter(option.id)"
                class="filter-btn"
                :class="{ active: activeFilter === option.id }"
              >
                {{ option.name }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="loading">
          Loading news content...
        </div>
        
        <div v-else-if="filteredContent.length === 0" class="no-content">
          <p>No articles found. Try adjusting your filters or configuring more sources.</p>
          <button @click="goToConfigure" class="btn btn-primary">Configure Sources</button>
        </div>
        
        <div v-else class="content-feed">
          <div v-if="!selectedArticle" class="article-grid">
            <div 
              v-for="article in filteredContent" 
              :key="article.id" 
              class="article-card"
              @click="viewArticle(article)"
            >
              <div class="article-image" v-if="article.imageUrl">
                <ImageWithFallback 
                  :src="article.imageUrl" 
                  :alt="article.title"
                  type="thumbnail"
                  height="200px"
                />
              </div>
              
              <div class="article-content">
                <h3 class="article-title">{{ article.title }}</h3>
                <div class="article-meta">
                  <span class="article-source">{{ filterOptions.find(o => o.id === article.sourceId.toString())?.name }}</span>
                  <span class="article-date">{{ formatDate(article.scrapedAt) }}</span>
                </div>
                <p class="article-excerpt">{{ truncateContent(article.content) }}</p>
              </div>
            </div>
          </div>
          
          <div v-else class="article-detail">
            <button @click="closeArticle" class="btn-back">← Back to Feed</button>
            
            <h2 class="detail-title">{{ selectedArticle.title }}</h2>
            
            <div class="detail-meta">
              <span class="detail-source">{{ filterOptions.find(o => o.id === selectedArticle.sourceId.toString())?.name }}</span>
              <span class="detail-date">{{ formatDate(selectedArticle.scrapedAt) }}</span>
            </div>
            
            <div class="detail-image" v-if="selectedArticle.imageUrl">
              <ImageWithFallback 
                :src="selectedArticle.imageUrl" 
                :alt="selectedArticle.title"
                type="thumbnail"
                height="auto"
                width="100%"
              />
            </div>
            
            <div class="detail-content">
              {{ selectedArticle.content }}
            </div>
            
            <div class="detail-actions">
              <a :href="selectedArticle.url" target="_blank" rel="noopener" class="btn btn-secondary">
                View Original Article
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pantheon-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.pantheon-container {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.pantheon-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pantheon-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.pantheon-description {
  color: var(--text-color-muted);
  font-size: 1.2rem;
}

.pantheon-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.pantheon-actions {
  display: flex;
  gap: 1rem;
}

.pantheon-dashboard {
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.dashboard-controls {
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.filter-label {
  color: var(--text-color-muted);
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-speed);
}

.filter-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.filter-btn.active {
  background-color: rgba(77, 138, 255, 0.15);
  color: var(--primary-color);
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.article-card {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.article-image {
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
}

.article-title {
  font-size: 1.3rem;
  margin-bottom: 0.75rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-color-muted);
  margin-bottom: 1rem;
}

.article-excerpt {
  color: white;
  line-height: 1.6;
  font-size: 0.95rem;
}

.article-detail {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 2rem;
}

.btn-back {
  background-color: transparent;
  color: var(--primary-color);
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  border: none;
  cursor: pointer;
}

.btn-back:hover {
  text-decoration: underline;
}

.detail-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.detail-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-color-muted);
  margin-bottom: 1.5rem;
}

.detail-image {
  margin-bottom: 2rem;
  border-radius: var(--border-radius);
  overflow: hidden;
}

.detail-image img {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.detail-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: white;
  margin-bottom: 2rem;
  white-space: pre-line;
}

.detail-actions {
  display: flex;
  justify-content: center;
}

.loading, .no-content {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

@media (max-width: 992px) {
  .article-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .pantheon-nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pantheon-actions {
    width: 100%;
    justify-content: center;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
