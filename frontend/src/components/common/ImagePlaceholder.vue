<script setup>
import { computed } from 'vue';

const props = defineProps({
  alt: {
    type: String,
    default: 'Image placeholder'
  },
  type: {
    type: String,
    default: 'abstract', // abstract, icon, thumbnail
    validator: (value) => ['abstract', 'icon', 'thumbnail'].includes(value)
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
});

// Use a different pattern based on type
const svgContent = computed(() => {
  switch(props.type) {
    case 'icon':
      return `
        <rect x="15" y="15" width="70" height="70" fill="#3a3a3a" rx="10" />
        <circle cx="50" cy="40" r="12" fill="#555" />
        <rect x="30" y="60" width="40" height="5" fill="#555" rx="2" />
      `;
    case 'thumbnail':
      return `
        <rect x="10" y="10" width="80" height="60" fill="#3a3a3a" rx="4" />
        <rect x="25" y="25" width="50" height="30" fill="#555" rx="2" />
        <line x1="25" y1="65" x2="75" y2="65" stroke="#555" stroke-width="4" stroke-linecap="round" />
        <line x1="25" y1="75" x2="55" y2="75" stroke="#555" stroke-width="4" stroke-linecap="round" />
      `;
    default: // abstract
      return `
        <rect x="10" y="10" width="80" height="80" fill="#3a3a3a" rx="4" />
        <circle cx="30" cy="30" r="10" fill="#555" />
        <rect x="50" y="20" width="30" height="20" fill="#555" rx="2" />
        <rect x="20" y="50" width="60" height="10" fill="#555" rx="2" />
        <rect x="20" y="70" width="40" height="10" fill="#555" rx="2" />
      `;
  }
});
</script>

<template>
  <div class="image-placeholder" :style="{ width, height }">
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      :aria-label="alt"
      class="placeholder-svg"
      v-html="svgContent"
    ></svg>
  </div>
</template>

<style scoped>
.image-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2a2a2a;
  overflow: hidden;
}

.placeholder-svg {
  width: 100%;
  height: 100%;
}
</style>
