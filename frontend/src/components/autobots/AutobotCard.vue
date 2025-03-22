<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ImageWithFallback from '@/components/common/ImageWithFallback.vue';

const props = defineProps({
  autobot: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const defaultIcon = '/icons/autobot-default.svg';
const icon = computed(() => props.autobot.iconUrl || defaultIcon);

// Function to navigate to the autobot detail page
const viewDetails = () => {
  router.push({
    name: 'autobot-detail',
    params: { id: props.autobot.id }
  });
};

// Format the last updated date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};
</script>

<template>
  <div class="autobot-card" @click="viewDetails">
    <div class="status-indicator" :class="autobot.status"></div>
    <div class="autobot-icon">
      <ImageWithFallback 
        :src="icon" 
        :alt="autobot.title"
        type="icon" 
        height="80px"
        width="80px"
      />
    </div>
    
    <div class="autobot-info">
      <h3>{{ autobot.title }}</h3>
      <div class="autobot-category">{{ autobot.category }}</div>
      <p class="autobot-description">{{ autobot.description }}</p>
      
      <div class="autobot-tags">
        <span v-for="(tag, index) in autobot.tags" :key="index" class="tag">
          {{ tag }}
        </span>
      </div>
      
      <div class="autobot-footer">
        <span class="updated-date">Updated: {{ formatDate(autobot.lastUpdated) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.autobot-card {
  position: relative;
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.autobot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.status-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.active {
  background-color: var(--highlight-color);
  box-shadow: 0 0 8px var(--highlight-color);
}

.status-indicator.beta {
  background-color: var(--primary-color);
  box-shadow: 0 0 8px var(--primary-color);
}

.status-indicator.development {
  background-color: var(--accent-color);
  box-shadow: 0 0 8px var(--accent-color);
}

.autobot-icon {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
}

.autobot-icon img {
  max-height: 80px;
  max-width: 80px;
}

.autobot-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.autobot-info h3 {
  margin-bottom: 0.5rem;
  color: white;
  font-size: 1.5rem;
}

.autobot-category {
  font-size: 0.9rem;
  padding: 0.2rem 0.6rem;
  background-color: rgba(77, 138, 255, 0.1);
  border-radius: var(--border-radius);
  display: inline-block;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.autobot-description {
  color: white;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  line-height: 1.5;
}

.autobot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
  padding: 0.2rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
}

.autobot-footer {
  display: flex;
  justify-content: flex-end;
  color: var(--text-color-muted);
  font-size: 0.85rem;
}
</style>
