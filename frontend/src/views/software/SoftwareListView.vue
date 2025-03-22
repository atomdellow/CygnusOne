<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useSoftwareStore } from '@/stores/software';
import { useAuthStore } from '@/stores/auth';
import SoftwareCard from '@/components/software/SoftwareCard.vue';

const softwareStore = useSoftwareStore();
const authStore = useAuthStore();
const searchQuery = ref('');
const statusFilter = ref('all');
const loading = ref(true);
const error = ref(null);
const retryCount = ref(0);
const maxRetries = 3;

// Available status filters
const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'completed', label: 'Completed' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'planning', label: 'Planning' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'cancelled', label: 'Cancelled' }
];

// Filter software based on search query and status
const filteredSoftware = computed(() => {
  return softwareStore.allSoftware.filter(software => {
    // Filter by status
    if (statusFilter.value !== 'all' && 
       (software.meta?.status !== statusFilter.value)) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      return (
        software.title.toLowerCase().includes(query) ||
        software.description.toLowerCase().includes(query) ||
        software.tags.some(tag => tag.toLowerCase().includes(query)) ||
        software.meta?.languages?.some(lang => lang.toLowerCase().includes(query)) ||
        software.meta?.frameworks?.some(framework => framework.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
});

// Get software the user can view (public or user's own)
const visibleSoftware = computed(() => {
  // Add debugging to check software array
  console.log("Software array:", softwareStore.allSoftware);
  
  if (authStore.isAdmin) {
    return filteredSoftware.value; // Admins can see all software
  }
  
  return filteredSoftware.value.filter(software => 
    software.isPublic || 
    (authStore.user && software.author === authStore.user._id)
  );
});

const loadSoftware = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Add debugging
    console.log("Fetching software...");
    await softwareStore.fetchSoftware();
    console.log("Software fetched:", softwareStore.allSoftware);
    
    // If the software array is empty, use mock data for development
    if (softwareStore.allSoftware.length === 0) {
      console.log("No software found, using mock data");
      softwareStore.useMockDataForDevelopment();
    }
  } catch (err) {
    console.error("Error fetching software:", err);
    error.value = "Failed to load software applications. Please try again later.";
    
    // Retry logic
    if (retryCount.value < maxRetries) {
      retryCount.value++;
      setTimeout(loadSoftware, 1000 * retryCount.value); // Exponential backoff
    }
  } finally {
    loading.value = false;
  }
};

const setStatusFilter = (status) => {
  statusFilter.value = status;
};

// Watch for changes in the software store
watch(() => softwareStore.allSoftware, (newValue) => {
  console.log("Software store updated:", newValue);
}, { deep: true });

onMounted(() => {
  loadSoftware();
});
</script>

<template>
  <div class="software-wrapper">
    <div class="software-container">
      <div class="software-header">
        <h1>Software Applications</h1>
        <p class="software-description">
          Explore our collection of software applications and tools
        </p>
        <router-link v-if="authStore.isEditor" to="/software/create" class="btn btn-primary">
          Add Application
        </router-link>
      </div>
      
      <div class="software-filters">
        <div class="search-bar">
          <input 
            type="text"
            v-model="searchQuery"
            placeholder="Search applications..."
            class="search-input"
          />
        </div>
        
        <div class="filter-buttons">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            @click="setStatusFilter(status.value)"
            class="filter-btn"
            :class="{ active: statusFilter === status.value }"
          >
            {{ status.label }}
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="loading-container">
        <div class="loader"></div>
        <p>Loading software applications...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <p class="error-message">{{ error }}</p>
        <button @click="loadSoftware" class="btn btn-primary">Try Again</button>
      </div>
      
      <div v-else-if="visibleSoftware.length === 0" class="no-software">
        <p v-if="searchQuery || statusFilter !== 'all'">
          No software applications found matching your filters.
        </p>
        <p v-else>
          No software applications available yet.
          <span v-if="authStore.isEditor">Add your first application!</span>
        </p>
      </div>
      
      <div v-else class="software-grid">
        <SoftwareCard
          v-for="app in visibleSoftware"
          :key="app._id"
          :software="app"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.software-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.software-container {
  width: 100%;
  max-width: 1160px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.software-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
  text-align: center;
}

.software-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.software-description {
  color: var(--text-color-muted);
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.software-filters {
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

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  background-color: rgba(255, 255, 255, 0.05);
  border: none;
  color: var(--text-color);
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

.software-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loader {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 3px solid var(--primary-color);
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container, .no-software {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

.error-message {
  color: var(--accent-color);
  margin-bottom: 1.5rem;
}

@media (max-width: 1200px) {
  .software-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .software-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-buttons {
    justify-content: center;
  }
}
</style>
