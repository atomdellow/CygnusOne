<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePantheonStore } from '@/stores/pantheon';

const router = useRouter();
const pantheonStore = usePantheonStore();

const loading = ref(true);
const sources = ref([]);
const editingSource = ref(null);
const isCreating = ref(false);
const testResults = ref(null);
const testLoading = ref(false);

// Form for new/edit source
const sourceForm = ref({
  name: '',
  url: '',
  selectors: {
    article: '',
    title: '',
    content: '',
    image: ''
  },
  active: true
});

// Computed properties
const activeSources = computed(() => {
  return sources.value.filter(source => source.active);
});

const inactiveSources = computed(() => {
  return sources.value.filter(source => !source.active);
});

// Methods
const goBack = () => {
  router.push({ name: 'pantheon' });
};

const openCreateForm = () => {
  // Reset form
  sourceForm.value = {
    name: '',
    url: '',
    selectors: {
      article: '',
      title: '',
      content: '',
      image: ''
    },
    active: true
  };
  
  editingSource.value = null;
  isCreating.value = true;
};

const openEditForm = (source) => {
  // Clone the source to the form
  sourceForm.value = {
    name: source.name,
    url: source.url,
    selectors: { ...source.selectors },
    active: source.active
  };
  
  editingSource.value = source;
  isCreating.value = false;
};

const cancelForm = () => {
  editingSource.value = null;
  isCreating.value = false;
  testResults.value = null;
};

const saveSource = async () => {
  // Form validation
  if (!sourceForm.value.name || !sourceForm.value.url || !sourceForm.value.selectors.article) {
    return; // Basic validation - would add UI feedback in real app
  }
  
  if (isCreating.value) {
    // Create new source
    await pantheonStore.addSource(sourceForm.value);
  } else if (editingSource.value) {
    // Update existing source
    await pantheonStore.updateSource(editingSource.value.id, sourceForm.value);
  }
  
  // Refresh the sources list
  await loadSources();
  
  // Close the form
  cancelForm();
};

const testScraper = async () => {
  testLoading.value = true;
  testResults.value = null;
  
  // Simulate testing the scraper
  setTimeout(() => {
    // For demo, simulate a successful test with some sample data
    testResults.value = {
      success: true,
      message: 'Test scrape completed successfully',
      foundItems: 5,
      firstItem: {
        title: 'Sample Article Title',
        excerpt: 'This is a sample of extracted content from the target website...',
        imageUrl: 'https://via.placeholder.com/300x200'
      }
    };
    
    testLoading.value = false;
  }, 2000);
};

const runScraper = async (sourceId) => {
  await pantheonStore.runScraper(sourceId);
  alert('Scraper executed successfully!');
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

// Load data
const loadSources = async () => {
  const data = await pantheonStore.fetchSources();
  sources.value = data;
};

onMounted(async () => {
  await loadSources();
  loading.value = false;
});
</script>

<template>
  <div class="pantheon-wrapper">
    <div class="pantheon-container">
      <div class="pantheon-header">
        <button @click="goBack" class="btn btn-back">← Back to Pantheon</button>
        <h1>Configure Sources</h1>
        <p class="pantheon-description">Set up and manage your news scraping sources</p>
      </div>

      <div class="pantheon-content">
        <div v-if="loading" class="loading">
          Loading sources...
        </div>
        
        <div v-else class="sources-management">
          <div class="sources-actions">
            <button @click="openCreateForm" class="btn btn-primary">Add New Source</button>
          </div>
          
          <div v-if="isCreating || editingSource" class="source-form-container">
            <div class="source-form">
              <h2>{{ isCreating ? 'Add New Source' : 'Edit Source' }}</h2>
              
              <div class="form-group">
                <label for="name">Source Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="sourceForm.name"
                  class="form-control" 
                  placeholder="e.g. Local News Site"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="url">Website URL</label>
                <input 
                  type="url" 
                  id="url" 
                  v-model="sourceForm.url"
                  class="form-control" 
                  placeholder="https://example.com"
                  required
                />
              </div>
              
              <h3>CSS Selectors</h3>
              <p class="selector-help">
                Enter CSS selectors to identify content elements on the target website.
              </p>
              
              <div class="form-group">
                <label for="articleSelector">Article Element Selector</label>
                <input 
                  type="text" 
                  id="articleSelector" 
                  v-model="sourceForm.selectors.article"
                  class="form-control" 
                  placeholder="e.g. article.post, div.news-item"
                  required
                />
                <small class="selector-desc">The container element for each article</small>
              </div>
              
              <div class="form-group">
                <label for="titleSelector">Title Selector</label>
                <input 
                  type="text" 
                  id="titleSelector" 
                  v-model="sourceForm.selectors.title"
                  class="form-control" 
                  placeholder="e.g. h1.title, .headline"
                />
                <small class="selector-desc">The element containing the article's title</small>
              </div>
              
              <div class="form-group">
                <label for="contentSelector">Content Selector</label>
                <input 
                  type="text" 
                  id="contentSelector" 
                  v-model="sourceForm.selectors.content"
                  class="form-control" 
                  placeholder="e.g. div.content p, .article-body"
                />
                <small class="selector-desc">Elements containing the article's content</small>
              </div>
              
              <div class="form-group">
                <label for="imageSelector">Image Selector</label>
                <input 
                  type="text" 
                  id="imageSelector" 
                  v-model="sourceForm.selectors.image"
                  class="form-control" 
                  placeholder="e.g. img.featured, .article-image img"
                />
                <small class="selector-desc">Element for the article's main image</small>
              </div>
              
              <div class="form-group checkbox-group">
                <input 
                  type="checkbox" 
                  id="active" 
                  v-model="sourceForm.active"
                />
                <label for="active">Active</label>
              </div>
              
              <div class="test-section" v-if="!isCreating">
                <button 
                  @click="testScraper" 
                  class="btn btn-secondary"
                  :disabled="testLoading"
                >
                  {{ testLoading ? 'Testing...' : 'Test Scraper' }}
                </button>
                
                <div v-if="testResults" class="test-results" :class="{ success: testResults.success }">
                  <h4>Test Results</h4>
                  <p class="test-message">{{ testResults.message }}</p>
                  
                  <div v-if="testResults.success" class="test-details">
                    <div class="test-stat">Found {{ testResults.foundItems }} items</div>
                    
                    <div class="sample-item">
                      <h5>Sample Extracted Content</h5>
                      <div class="sample-title">{{ testResults.firstItem.title }}</div>
                      <p class="sample-excerpt">{{ testResults.firstItem.excerpt }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-actions">
                <button @click="cancelForm" class="btn btn-secondary">Cancel</button>
                <button @click="saveSource" class="btn btn-primary">
                  {{ isCreating ? 'Create Source' : 'Update Source' }}
                </button>
              </div>
            </div>
          </div>

          <div v-else class="sources-lists">
            <div class="active-sources">
              <h2>Active Sources</h2>
              
              <div v-if="activeSources.length === 0" class="no-sources">
                <p>No active sources. Add a new source to get started.</p>
              </div>
              
              <div v-else class="sources-grid">
                <div v-for="source in activeSources" :key="source.id" class="source-card">
                  <div class="source-header">
                    <h3>{{ source.name }}</h3>
                    <span class="status active">Active</span>
                  </div>
                  
                  <div class="source-url">{{ source.url }}</div>
                  
                  <div class="source-selectors">
                    <div class="selector"><strong>Article:</strong> {{ source.selectors.article }}</div>
                    <div class="selector"><strong>Title:</strong> {{ source.selectors.title || 'None' }}</div>
                    <div class="selector"><strong>Content:</strong> {{ source.selectors.content || 'None' }}</div>
                  </div>
                  
                  <div class="source-footer">
                    <div class="source-updated">Updated: {{ formatDate(source.updatedAt) }}</div>
                    
                    <div class="source-actions">
                      <button @click="openEditForm(source)" class="btn-icon">✏️</button>
                      <button @click="runScraper(source.id)" class="btn-icon">▶️</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="inactiveSources.length > 0" class="inactive-sources">
              <h2>Inactive Sources</h2>
              
              <div class="sources-grid">
                <div v-for="source in inactiveSources" :key="source.id" class="source-card inactive">
                  <div class="source-header">
                    <h3>{{ source.name }}</h3>
                    <span class="status inactive">Inactive</span>
                  </div>
                  
                  <div class="source-url">{{ source.url }}</div>
                  
                  <div class="source-selectors">
                    <div class="selector"><strong>Article:</strong> {{ source.selectors.article }}</div>
                    <div class="selector"><strong>Title:</strong> {{ source.selectors.title || 'None' }}</div>
                    <div class="selector"><strong>Content:</strong> {{ source.selectors.content || 'None' }}</div>
                  </div>
                  
                  <div class="source-footer">
                    <div class="source-updated">Updated: {{ formatDate(source.updatedAt) }}</div>
                    
                    <div class="source-actions">
                      <button @click="openEditForm(source)" class="btn-icon">✏️</button>
                    </div>
                  </div>
                </div>
              </div>
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
  margin-bottom: 2rem;
}

.pantheon-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.pantheon-description {
  color: var(--text-color-muted);
}

.btn-back {
  background-color: transparent;
  color: var(--primary-color);
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  display: inline-flex;
  align-items: center;
}

.btn-back:hover {
  background-color: transparent;
  color: #3c6bcf;
}

.pantheon-content {
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.sources-actions {
  margin-bottom: 2rem;
}

.source-form-container {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.source-form h2 {
  margin-bottom: 1.5rem;
}

.source-form h3 {
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.selector-help {
  margin-bottom: 1.5rem;
  color: var(--text-color-muted);
}

.selector-desc {
  font-size: 0.85rem;
  color: var(--text-color-muted);
  margin-top: 0.25rem;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.test-section {
  margin-bottom: 1.5rem;
}

.test-results {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border-radius: var(--border-radius);
  background-color: rgba(255, 107, 107, 0.1);
}

.test-results.success {
  background-color: rgba(67, 255, 175, 0.1);
}

.test-message {
  margin-bottom: 1rem;
}

.test-details {
  margin-top: 1rem;
}

.test-stat {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.sample-item {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-top: 1rem;
}

.sample-item h5 {
  margin-bottom: 0.5rem;
  color: var(--text-color-muted);
  font-size: 0.9rem;
}

.sample-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.sources-lists > div {
  margin-bottom: 2.5rem;
}

.sources-lists h2 {
  margin-bottom: 1.5rem;
}

.sources-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.source-card {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 1.5rem;
}

.source-card.inactive {
  opacity: 0.7;
}

.source-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.source-header h3 {
  margin: 0;
}

.status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius);
}

.status.active {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
}

.status.inactive {
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color);
}

.source-url {
  color: var(--text-color-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-selectors {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.selector {
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.selector:last-child {
  margin-bottom: 0;
}

.source-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.source-updated {
  font-size: 0.85rem;
  color: var(--text-color-muted);
}

.source-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-speed);
}

.btn-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.no-sources {
  text-align: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius);
  color: var(--text-color-muted);
}

.loading {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-color-muted);
}

@media (max-width: 992px) {
  .sources-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions button {
    width: 100%;
  }
}
</style>
