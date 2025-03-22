<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ImageWithFallback from '@/components/common/ImageWithFallback.vue';

const props = defineProps({
  software: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const defaultIcon = '/icons/app-default.svg';
const icon = computed(() => props.software.iconUrl || defaultIcon);

const getStatusClass = (status) => {
  if (!status) return '';
  
  switch (status) {
    case 'completed': return 'status-completed';
    case 'in_progress': return 'status-progress';
    case 'planning': return 'status-planning';
    case 'on_hold': return 'status-hold';
    case 'cancelled': return 'status-cancelled';
    default: return '';
  }
};

const getStatusLabel = (status) => {
  if (!status) return '';
  
  return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
};

const viewDetails = () => {
  router.push({
    name: 'software-detail',
    params: { id: props.software._id }
  });
};
</script>

<template>
  <div class="software-card" @click="viewDetails">
    <div class="software-card-header">
      <div class="software-icon">
        <ImageWithFallback 
          :src="icon" 
          :alt="software.title"
          type="icon" 
          height="100%"
          width="100%"
        />
      </div>
      
      <div v-if="software.isPublic" class="software-badge public">
        Public
      </div>
      <div v-else class="software-badge private">
        Private
      </div>
    </div>
    
    <div class="software-card-body">
      <h3>{{ software.title }}</h3>
      
      <div v-if="software.meta && software.meta.status" class="software-status">
        <span :class="getStatusClass(software.meta.status)">
          {{ getStatusLabel(software.meta.status) }}
        </span>
      </div>
      
      <p class="software-description">{{ software.description }}</p>
      
      <div class="software-tags">
        <span v-for="(tag, index) in software.tags" :key="index" class="tag">
          {{ tag }}
        </span>
      </div>
    </div>
    
    <div class="software-card-footer">
      <div class="software-version" v-if="software.version">
        v{{ software.version }}
      </div>
      <div class="view-details">
        View Details
      </div>
    </div>
  </div>
</template>

<style scoped>
.software-card {
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.software-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

.software-card-header {
  position: relative;
}

.software-icon {
  height: 120px;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.software-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  border-radius: var(--border-radius);
  font-weight: 500;
}

.software-badge.public {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
}

.software-badge.private {
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color);
}

.software-card-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.software-card-body h3 {
  margin-bottom: 0.75rem;
  font-size: 1.3rem;
  color: white;
}

.software-status {
  margin-bottom: 1rem;
}

.software-status span {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border-radius: var(--border-radius);
  text-transform: capitalize;
}

.status-completed {
  background-color: rgba(67, 255, 175, 0.1);
  color: var(--highlight-color);
}

.status-progress {
  background-color: rgba(77, 138, 255, 0.1);
  color: var(--primary-color);
}

.status-planning {
  background-color: rgba(159, 113, 255, 0.1);
  color: var(--secondary-color);
}

.status-hold {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.status-cancelled {
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color);
}

.software-description {
  margin-bottom: 1.25rem;
  color: white;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3; /* Add standard property for future compatibility */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.software-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag {
  background-color: rgba(77, 138, 255, 0.1);
  color: var(--primary-color);
  padding: 0.2rem 0.5rem;
  border-radius: var(--border-radius);
  font-size: 0.8rem;
}

.software-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.software-version {
  font-size: 0.9rem;
  color: var(--text-color-muted);
}

.view-details {
  color: var(--primary-color);
  font-size: 0.9rem;
}
</style>
