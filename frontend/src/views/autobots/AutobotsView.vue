<script setup>
import { onMounted, ref, computed } from 'vue';
import { useAutobotsStore } from '@/stores/autobots';
import AutobotCard from '@/components/autobots/AutobotCard.vue';

const autobotsStore = useAutobotsStore();
const loading = ref(true);
const searchQuery = ref('');
const activeCategory = ref('all');

// Computed properties
const categories = computed(() => {
  const uniqueCategories = new Set(['all']);
  autobotsStore.autobots.forEach(autobot => uniqueCategories.add(autobot.category));
  return Array.from(uniqueCategories);
});

const filteredAutobots = computed(() => {
  return autobotsStore.autobots.filter(autobot => {
    // Filter by category
    if (activeCategory.value !== 'all' && autobot.category !== activeCategory.value) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return autobot.title.toLowerCase().includes(query) || 
             autobot.description.toLowerCase().includes(query) ||
             autobot.tags.some(tag => tag.toLowerCase().includes(query));
    }
    
    return true;
  });
});

// Methods
const setCategory = (category) => {
  activeCategory.value = category;
};

onMounted(async () => {
  await autobotsStore.fetchAutobots();
  loading.value = false;
});
</script>

<template>
  <div class="autobots-wrapper">
    <div class="autobots-container">
      <div class="autobots-header">
        <h1>Autobots Platform</h1>
        <p class="autobots-description">
          Build, automate, and deploy with powerful visual tools
        </p>
      </div>

      <div class="autobots-tools">
        <div class="search-filter">
          <div class="search-bar">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search tools..." 
              class="search-input"
            />
          </div>
          
          <div class="categories-nav">
            <button 
              v-for="category in categories" 
              :key="category"
              @click="setCategory(category)"
              class="category-btn"
              :class="{ active: activeCategory === category }"
            >
              {{ category === 'all' ? 'All Tools' : category }}
            </button>
          </div>
        </div>

        <div v-if="loading || autobotsStore.loading" class="loading">
          Loading automation tools...
        </div>
        
        <div v-else-if="autobotsStore.error" class="alert alert-danger">
          {{ autobotsStore.error }}
        </div>
        
        <div v-else-if="filteredAutobots.length === 0" class="no-autobots">
          <p>No tools found matching your search.</p>
        </div>
        
        <div v-else class="autobots-grid">
          <AutobotCard 
            v-for="autobot in filteredAutobots" 
            :key="autobot.id"
            :autobot="autobot"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autobots-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.autobots-container {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.autobots-header {
  text-align: center;
  margin-bottom: 3rem;
}

.autobots-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, var(--highlight-color), var(--primary-color));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.autobots-description {
  color: var(--text-color-muted);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.search-filter {
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}

.categories-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  background-color: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-color);
  cursor: pointer;
  transition: all var(--transition-speed);
}

.category-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.category-btn.active {
  background-color: rgba(67, 255, 175, 0.15);
  color: var(--highlight-color);
}

.autobots-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.no-autobots, .loading {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

@media (max-width: 1200px) {
  .autobots-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .autobots-header h1 {
    font-size: 2rem;
  }
  
  .autobots-grid {
    grid-template-columns: 1fr;
  }
}
</style>
